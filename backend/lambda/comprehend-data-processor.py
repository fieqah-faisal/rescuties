import json
import boto3
import urllib.request
import urllib.parse
import logging
import os  # Add this import

# --- AWS clients ---
s3 = boto3.client("s3")
comprehend = boto3.client("comprehend")
sns = boto3.client("sns")
bedrock = boto3.client("bedrock-runtime")

# --- Constants (use environment variables for security) ---
TOPIC_ARN = os.environ.get('TOPIC_ARN', "arn:aws:sns:us-east-1:755453698877:DisasterAlertsMY")
MODEL_ID = os.environ.get('MODEL_ID', "amazon.nova-micro-v1:0")
GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY')
OPENWEATHER_API_KEY = os.environ.get('OPENWEATHER_API_KEY')

# --- Logger ---
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# --- Helper: Geocode locations using urllib ---
def geocode_location(location_text):
    try:
        if not GOOGLE_MAPS_API_KEY:
            logger.error("Google Maps API key not configured")
            return None, None
            
        base_url = "https://maps.googleapis.com/maps/api/geocode/json"
        params = {"address": location_text, "key": GOOGLE_MAPS_API_KEY}
        encoded_params = urllib.parse.urlencode(params)
        full_url = f"{base_url}?{encoded_params}"
        
        with urllib.request.urlopen(full_url) as response:
            data = json.loads(response.read().decode())
            if data.get("status") == "OK" and data.get("results"):
                result = data["results"][0]["geometry"]["location"]
                return result["lat"], result["lng"]
            else:
                logger.warning(f"Geocoding failed for {location_text}: {data.get('status')}")
                return None, None
    except Exception as e:
        logger.error(f"Geocoding error for '{location_text}': {e}")
        return None, None

# --- Helper: Weather confirmation using OpenWeatherMap ---
def check_weather(lat, lng):
    try:
        if not OPENWEATHER_API_KEY:
            logger.error("OpenWeather API key not configured")
            return {"confirmed": False, "details": "API key not configured"}
            
        base_url = "https://api.openweathermap.org/data/2.5/weather"
        params = {
            "lat": lat,
            "lon": lng,
            "appid": OPENWEATHER_API_KEY,
            "units": "metric"
        }
        encoded_params = urllib.parse.urlencode(params)
        full_url = f"{base_url}?{encoded_params}"
        
        logger.info(f"Calling OpenWeatherMap API: {full_url.replace(OPENWEATHER_API_KEY, 'REDACTED')}")

        with urllib.request.urlopen(full_url) as response:
            data = json.loads(response.read().decode())
            
            if data.get("cod") != 200:
                error_msg = data.get("message", "Unknown error")
                logger.error(f"OpenWeatherMap API error: {error_msg}")
                return {"confirmed": False, "details": f"API Error: {error_msg}"}
            
            weather_main = data.get("weather", [{}])[0].get("main", "Unknown").lower()
            weather_desc = data.get("weather", [{}])[0].get("description", "Unknown").lower()
            rain = data.get("rain", {}).get("1h", 0)
            
            # Expanded list of severe weather indicators
            severe_indicators = [
                "thunderstorm", "heavy", "extreme", "torrential", "violent",
                "flood", "storm", "hurricane", "typhoon", "cyclone", "tornado"
            ]
            
            is_severe = (
                rain > 5 or  
                any(indicator in weather_main for indicator in severe_indicators) or
                any(indicator in weather_desc for indicator in severe_indicators)
            )
            
            return {
                "confirmed": is_severe,
                "details": f"{weather_desc}, {rain}mm rain in last hour"
            }
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        logger.error(f"HTTPError: {e.code} - {e.reason} - {error_body}")
        return {"confirmed": False, "details": f"HTTP Error: {e.code}"}
    except Exception as e:
        logger.error(f"Weather API error: {e}")
        return {"confirmed": False, "details": f"Error: {str(e)}"}

# --- Lambda handler ---
def lambda_handler(event, context):
    # 1️⃣ Get input text from S3 trigger
    try:
        record = event["Records"][0]
        bucket = record["s3"]["bucket"]["name"]
        key = record["s3"]["object"]["key"]

        logger.info(f"New file uploaded: s3://{bucket}/{key}")

        obj = s3.get_object(Bucket=bucket, Key=key)
        file_content = obj["Body"].read().decode("utf-8")

        # If JSON file (tweet with metadata)
        try:
            tweet_data = json.loads(file_content)
            text = tweet_data.get("text", file_content)
        except Exception:
            text = file_content

    except Exception as e:
        logger.error(f"Error reading from S3: {e}")
        return {"statusCode": 500, "body": json.dumps("Error reading from S3")}

    logger.info(f"Input text: {text}")

    # 2️⃣ Comprehend: Entities & Sentiment
    try:
        entities = comprehend.detect_entities(Text=text, LanguageCode="en")
        locations = [e["Text"] for e in entities["Entities"] if e["Type"] == "LOCATION"]
        
        sentiment_response = comprehend.detect_sentiment(Text=text, LanguageCode="en")
        sentiment_text = sentiment_response.get("Sentiment", "NEUTRAL").upper()
    except Exception as e:
        logger.error(f"Error with Comprehend: {e}")
        return {"statusCode": 500, "body": json.dumps("Error with Comprehend")}

    # 3️⃣ Nova Micro: Generate summary
    prompt = f"""
    Summarize the following disaster report in one sentence:

    Report: {text}

    Summary:
    """
    bedrock_input = {"messages": [{"role": "user", "content": [{"text": prompt}]}]}
    
    try:
        response = bedrock.invoke_model(
            modelId=MODEL_ID,
            contentType="application/json",
            accept="application/json",
            body=json.dumps(bedrock_input)
        )
        response_body = json.loads(response["body"].read())

        ai_summary = "No summary generated."
        
        if "output" in response_body:
            message = response_body.get("output", {}).get("message", {})
            content = message.get("content", [])
            if content:
                ai_summary = content[0].get("text", "").strip()
        elif "results" in response_body:
            results = response_body.get("results", [])
            if results:
                content = results[0].get("content", [])
                if content and isinstance(content[0], dict) and "text" in content[0]:
                    ai_summary = content[0]["text"].strip()
                elif content and isinstance(content[0], str):
                    ai_summary = content[0].strip()
        
    except Exception as e:
        logger.error(f"Error invoking Nova Micro: {e}")
        ai_summary = "Error generating summary"

    # 4️⃣ Geocode precise locations & check weather
    lat_lng_list = []
    weather_confirmations = []

    for loc in locations:
        lat, lng = geocode_location(loc)
        if lat and lng:
            lat_lng_list.append(f"{loc} ({lat:.5f}, {lng:.5f})")
            weather = check_weather(lat, lng)
            if weather["confirmed"]:
                weather_confirmations.append(f"{loc}: CONFIRMED ({weather['details']})")
            else:
                weather_confirmations.append(f"{loc}: NOT CONFIRMED ({weather['details']})")
        else:
            lat_lng_list.append(f"{loc} (Unknown coordinates)")
            weather_confirmations.append(f"{loc}: Geocoding failed")

    locations_text = "; ".join(lat_lng_list) if lat_lng_list else "Unknown location"
    weather_text = "\n".join(weather_confirmations) if weather_confirmations else "No weather data"

    # 5️⃣ Build SNS message
    message = f"🚨 Disaster Alert 🚨\n\nSummary: {ai_summary}\n\n"
    message += f"Detected location(s): {locations_text}\n"
    message += f"Sentiment: {sentiment_text}\n"
    message += f"Weather confirmation:\n{weather_text}"

    # 6️⃣ Publish to SNS
    try:
        sns.publish(TopicArn=TOPIC_ARN, Message=message, Subject="Disaster Alert")
        logger.info("Alert successfully published to SNS.")
    except Exception as e:
        logger.error(f"Error publishing to SNS: {e}")
        return {"statusCode": 500, "body": json.dumps("Error publishing to SNS")}

    return {"statusCode": 200, "body": json.dumps("Alert sent successfully!")}