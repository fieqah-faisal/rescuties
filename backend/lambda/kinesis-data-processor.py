import json
import base64
import boto3
from datetime import datetime

# Use client instead of resource for better performance
s3_client = boto3.client('s3')
s3_bucket = "cloud-cuties-tweet-bucket"

def lambda_handler(event, context):
    processed_records = 0
    failed_records = 0
    
    try:
        for record in event['Records']:
            try:
                # Decode the Kinesis data
                encoded_data = record['kinesis']['data']
                decoded_bytes = base64.b64decode(encoded_data)
                decoded_string = decoded_bytes.decode('utf-8')  # Use utf-8 for better Unicode support
                
                print(f"Decoded data length: {len(decoded_string)} characters")
                
                # Parse JSON to validate it's proper JSON
                json_data = json.loads(decoded_string)
                
                # Create a more descriptive filename with timestamp
                sequence_number = record['kinesis']['sequenceNumber']
                partition_key = record['kinesis']['partitionKey']
                timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
                
                # Enhanced filename: timestamp_sequence_partition.json
                s3_file_name = f"twitter_data/{timestamp}_{sequence_number}_{partition_key}.json"
                
                # Upload directly to S3 without creating temporary file
                s3_client.put_object(
                    Bucket=s3_bucket,
                    Key=s3_file_name,
                    Body=json.dumps(json_data, indent=2, ensure_ascii=False),
                    ContentType='application/json',
                    Metadata={
                        'source': 'kinesis-stream',
                        'sequence-number': sequence_number,
                        'partition-key': partition_key,
                        'processed-at': datetime.utcnow().isoformat()
                    }
                )
                
                processed_records += 1
                print(f"Successfully uploaded record {processed_records} to S3: {s3_file_name}")
                
            except json.JSONDecodeError as e:
                failed_records += 1
                print(f"Invalid JSON in record {processed_records + failed_records}: {str(e)}")
                print(f"Raw data: {decoded_string[:200]}...")  # Show first 200 chars for debugging
                
            except UnicodeDecodeError as e:
                failed_records += 1
                print(f"Unicode decode error in record {processed_records + failed_records}: {str(e)}")
                
            except Exception as e:
                failed_records += 1
                print(f"Error processing record {processed_records + failed_records}: {str(e)}")
        
        # Summary
        total_records = processed_records + failed_records
        print(f"Processing complete: {processed_records}/{total_records} records successful")
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Twitter data successfully processed',
                'processed_records': processed_records,
                'failed_records': failed_records,
                'total_records': total_records
            })
        }
        
    except Exception as e:
        print(f"Lambda function failed: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e),
                'message': 'Failed to process Kinesis records'
            })
        }