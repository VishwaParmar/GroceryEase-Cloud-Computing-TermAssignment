import boto3

def lambda_handler(event, context):
    try:
        # Get the S3 bucket name and image name from the event
        s3_bucket = event.get('bucket_name')
        image_name = event.get('image_name')

        # Initialize the Amazon Textract client with the desired AWS region
        region = 'us-east-1'  # Replace with your desired AWS region
        textract_client = boto3.client('textract', region_name=region)

        # Set the S3 object location for Textract
        s3_object = {'S3Object': {'Bucket': s3_bucket, 'Name': image_name}}

        # Call Textract to analyze the image and extract text
        response = textract_client.detect_document_text(Document=s3_object)

        # Extract the text from the Textract response
        extracted_text = ""
        for item in response['Blocks']:
            if item['BlockType'] == 'LINE':
                extracted_text += item['Text'] + "\n"

        print("Extracted text:\n", extracted_text)
        return {
            'statusCode': 200,
            'body': extracted_text
        }
    except Exception as e:
        print("Error processing image with Textract:", str(e))
        return {
            'statusCode': 500,
            'body': 'Error processing image with Textract'
        }
