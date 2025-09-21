# kinesis_lambda.py
import os
import json
import base64
import time
from typing import Dict

USE_AWS = os.getenv("USE_AWS", "false").lower() == "true"
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
SNS_TOPIC_ARN = os.getenv("SNS_TOPIC_ARN", "")  # set when deployed
BEDROCK_MODEL_ID = os.getenv("BEDROCK_MODEL_ID", "")  # optional

# Lazy init AWS clients only if USE_AWS
if USE_AWS:
    import boto3
    comprehend = boto3.client("comprehend", region_name=AWS_REGION)
    sns = boto3.client("sns", region_name=AWS_REGION)
    try:
        bedrock = boto3.client("bedrock-runtime", region_name=AWS_REGION)
    except Exception:
        bedrock = boto3.client("bedrock", region_name=AWS_REGION)


def analyze_with_comprehend(text: str) -> Dict:
    if not USE_AWS:
        return {
            "sentiment": {"Sentiment": "NEUTRAL"},
            "entities": {"Entities": []}
        }
    sent = comprehend.detect_sentiment(Text=text, LanguageCode="en")
    ents = comprehend.detect_entities(Text=text, LanguageCode="en")
    return {"sentiment": sent, "entities": ents}


def call_bedrock(text: str) -> Dict:
    if not USE_AWS or not BEDROCK_MODEL_ID:
        return {"summary": (text[:200] + ("..." if len(text) > 200 else ""))}
    try:
        resp = bedrock.invoke_model(
            modelId=BEDROCK_MODEL_ID,
            contentType="application/json",
            accept="application/json",
            body=json.dumps({"input": text})
        )
        body = resp["body"].read().decode("utf-8")
        try:
            return json.loads(body)
        except Exception:
            return {"raw": body}
    except Exception as e:
        print("Bedrock error:", e)
        return {"error": str(e)}


def compute_severity(tweet: Dict, comp_result: Dict) -> str:
    text = (tweet.get("text") or "").lower()
    hashtags = [h.lower() for h in tweet.get("hashtags", [])]
    verified = tweet.get("is_verified", False)

    keywords_high = ["trapped", "urgent", "help needed", "evacuate", "buried", "rescue", "hospitals", "drowning"]
    keywords_med = ["power outage", "fire", "wildfire", "landslide", "flood", "earthquake", "tremor", "storm", "typhoon"]

    if any(k in text for k in keywords_high) or any(h in ("#rescue", "#help", "#urgent") for h in hashtags):
        return "high"
    if any(k in text for k in keywords_med) or any(h in ("#flood", "#wildfire", "#earthquake", "#stormalert", "#typhoon") for h in hashtags):
        return "medium"
    if verified and comp_result.get("sentiment", {}).get("Sentiment") in ("NEGATIVE", "MIXED"):
        return "medium"
    return "low"


def format_alert(payload: Dict, severity: str) -> str:
    """Format a clean, human-readable alert message."""
    return f"""
🚨 Disaster Alert 🚨

📍 Location: {payload.get("location", "Unknown")}
🕑 Time: {payload.get("timestamp", "Unknown")}
⚠️ Severity: {severity.upper()}

Summary:
{payload.get("bedrock", {}).get("summary") or payload.get("text")}

Recommended Actions:
- Stay alert and follow local authority guidance
- Ensure safety of affected residents
- Coordinate with rescue teams if nearby

Source: Automated Disaster Monitoring System
    """.strip()


def publish_to_sns(payload: Dict, severity: str):
    """Publish formatted alert message to SNS topic (with JSON fallback)."""
    clean_message = format_alert(payload, severity)

    if not USE_AWS or not SNS_TOPIC_ARN:
        print("SNS publish (mock):\n", clean_message)
        return {"mock": True}

    msg_attrs = {
        "severity": {"DataType": "String", "StringValue": severity},
        "event_time": {"DataType": "String", "StringValue": payload.get("timestamp", "")}
    }

    resp = sns.publish(
        TopicArn=SNS_TOPIC_ARN,
        Message=clean_message,
        Subject=f"Disaster Alert - {severity.upper()}",
        MessageAttributes=msg_attrs
    )
    return resp


def lambda_handler(event, context=None):
    failures = []
    processed = 0

    for rec in event.get("Records", []):
        event_id = rec.get("eventID") or rec.get("eventID")
        try:
            b64 = rec["kinesis"]["data"]
            raw = base64.b64decode(b64).decode("utf-8")
            tweet = json.loads(raw)
        except Exception as e:
            print("Invalid record, skipping:", e)
            failures.append(event_id)
            continue

        try:
            text = tweet.get("text", "")
            comp = analyze_with_comprehend(text)
            bedrock_out = call_bedrock(text)
            severity = compute_severity(tweet, comp)

            alert = {
                "tweet_id": tweet.get("id") or tweet.get("tweet_id"),
                "timestamp": tweet.get("timestamp"),
                "user": tweet.get("user"),
                "text": text,
                "location": tweet.get("location"),
                "hashtags": tweet.get("hashtags"),
                "is_verified": tweet.get("is_verified"),
                "comprehend": comp,
                "bedrock": bedrock_out,
                "severity": severity,
                "processed_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            }

            publish_to_sns(alert, severity)
            processed += 1

        except Exception as e:
            print("Processing error for", event_id, e)
            failures.append(event_id)
            continue

    if failures:
        return {"batchItemFailures": [{"itemIdentifier": fid} for fid in failures]}
    return {"status": "ok", "processed": processed}
