import json
import boto3
import base64
from botocore.exceptions import ClientError

def invoke_second_lambda(payload):
    lambda_client = boto3.client('lambda', region_name='us-east-1')
    response = lambda_client.invoke(
        FunctionName='UploadImageToTextractCF',
        InvocationType='RequestResponse',  # Synchronous invocation
        Payload=json.dumps(payload).encode('utf-8')  # Convert payload to bytes
    )
    return json.loads(response['Payload'].read().decode())

def lambda_handler(event, context):
    # Parse the request body
    request_body = event['body']
    
    # Extract image file details from the request body
    image_data = request_body.get('image_data')
    image_name = request_body.get('image_name')
    bucket_name = 'orderbucketcfb00930141'  # Replace with your desired bucket name

    # Validate that image_data and image_name are present
    if not (image_data and image_name):
        return {
            'status': 400,  # Bad Request status code
            'body': 'Missing required fields: image_data, image_name'
        }

    # Convert base64-encoded image data back to bytes
    try:
        image_bytes = base64.b64decode(image_data)
    except ValueError:
        return {
            'status': 400,
            'body': 'Invalid base64-encoded image data'
        }

    # Upload the image file to S3
    s3 = boto3.client('s3')
    try:
        s3.put_object(Bucket=bucket_name, Key=image_name, Body=image_bytes)
    except ClientError as e:
        return {
            'status': 500,  # Internal Server Error status code,
            'body': 'Failed to upload image to S3: {}'.format(e)
        }
    
    payload_for_second_lambda = {
        'bucket_name': bucket_name,
        'image_name': image_name
    }
    print(payload_for_second_lambda)

    # Synchronously invoke the second Lambda function
    response_from_second_lambda = invoke_second_lambda(payload_for_second_lambda)

    # Read and decode the response from the second Lambda function

    # Return the response from the second Lambda function

    return response_from_second_lambda