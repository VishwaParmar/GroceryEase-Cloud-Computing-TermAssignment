import boto3
import json
import hashlib

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('User')
sns_client = boto3.client('sns')
sns_topic_name = 'orderConfirmation'  # Replace with the name of your SNS topic

def lambda_handler(event, context):
    try:
        # Parse the request body to extract user registration data
        request_body = event['body']
        email = request_body.get('email')
        password = request_body.get('password')
        name = request_body.get('name')
        phone = request_body.get('phone')

        if not email or not password or not name or not phone:
            raise ValueError("Invalid request. Missing required fields.")

        # Hash the password using a secure hashing algorithm (e.g., SHA-256)
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        # Put the user registration data into the DynamoDB table
        item = {
            'email': email,
            'password': hashed_password,
            'name': name,
            'phone': phone
        }
        table.put_item(Item=item)

        # Create an SNS topic subscription with the provided email
        sns_topic_arn = get_sns_topic_arn(sns_topic_name)
        if sns_topic_arn:
            subscribe_email_to_topic(sns_topic_arn, email)
        else:
            raise ValueError("SNS topic not found.")

        # Send an email notification using SNS
        send_registration_notification(sns_topic_arn, email, name)

        # Return a success response
        response = {
            'statusCode': 200,
            'body': json.dumps({'message': 'User registration successful.'})
        }
    except Exception as e:
        # Return an error response if there's any exception
        response = {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

    return response

def get_sns_topic_arn(topic_name):
    response = sns_client.list_topics()
    topics = response.get('Topics', [])
    for topic in topics:
        if topic_name in topic['TopicArn']:
            return topic['TopicArn']
    return None

def subscribe_email_to_topic(topic_arn, email):
    sns_client.subscribe(
        TopicArn=topic_arn,
        Protocol='email',
        Endpoint=email
    )

def send_registration_notification(sns_topic_arn, email, name):
    subject = 'User Registration'
    message = f'Hello {name},\n\nThank you for registering with our service. Your email address {email} has been registered successfully.'
    
    sns_client.publish(
        TopicArn=sns_topic_arn,
        Message=message,
        Subject=subject
    )
