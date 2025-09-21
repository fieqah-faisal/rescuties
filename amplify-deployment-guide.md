# AWS Amplify Deployment Configuration Guide

## Environment Variables Setup

In your AWS Amplify console, go to **App Settings > Environment Variables** and add:

```
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=AKIA27ZEMUM6XCJG2WWL
VITE_AWS_SECRET_ACCESS_KEY=K47iOR86vLqhH+vPR6g2ZO/yCl1a/iuTE7kV3TXJ
VITE_S3_BUCKET_NAME=cloud-cuties-tweet-bucket
VITE_SNS_TOPIC_ARN=arn:aws:sns:us-east-1:755453698877:DisasterAlertsMY
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
VITE_PROXY_SERVER_ACCESS_TOKEN=undefined
```

## S3 CORS Configuration

Update your S3 bucket CORS policy to include your Amplify domain:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://your-amplify-domain.amplifyapp.com",
      "https://*.amplifyapp.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## IAM Permissions Required

Your IAM user needs these permissions:

### S3 Permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket",
        "s3:HeadBucket"
      ],
      "Resource": [
        "arn:aws:s3:::cloud-cuties-tweet-bucket",
        "arn:aws:s3:::cloud-cuties-tweet-bucket/*"
      ]
    }
  ]
}
```

### SNS Permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sns:Publish",
        "sns:Subscribe",
        "sns:Unsubscribe",
        "sns:ListTopics",
        "sns:GetTopicAttributes"
      ],
      "Resource": "arn:aws:sns:us-east-1:755453698877:DisasterAlertsMY"
    }
  ]
}
```

### Kinesis Permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "kinesis:PutRecord",
        "kinesis:DescribeStream",
        "kinesis:ListStreams"
      ],
      "Resource": "*"
    }
  ]
}
```

### Comprehend Permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "comprehend:DetectSentiment",
        "comprehend:DetectEntities",
        "comprehend:DetectKeyPhrases"
      ],
      "Resource": "*"
    }
  ]
}
```

## Troubleshooting Steps

1. **Check Environment Variables**: Verify all environment variables are set in Amplify console
2. **Verify IAM Permissions**: Ensure your IAM user has all required permissions
3. **Update CORS Policy**: Make sure S3 CORS includes your Amplify domain
4. **Check Browser Console**: Look for specific error messages in browser dev tools
5. **Test Locally First**: Ensure everything works locally before deploying

## Common Issues

- **CORS Errors**: Update S3 CORS policy with Amplify domain
- **Access Denied**: Check IAM permissions for all AWS services
- **Invalid Credentials**: Verify environment variables are correctly set
- **Network Timeouts**: May need to increase timeout values in production
