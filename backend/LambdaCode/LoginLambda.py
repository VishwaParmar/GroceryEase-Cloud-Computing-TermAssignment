import boto3
import json
import hashlib

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('User')

def lambda_handler(event, context):
    try:
        # Parse the request body to extract login data
        request_body = json.loads(event['body'])
        email = request_body.get('email')
        password = request_body.get('password')

        if not email or not password:
            raise ValueError("Invalid request. Missing email or password.")

        # Hash the password using the same algorithm as during registration
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        # Get user data from DynamoDB using the email as the key
        response = table.get_item(Key={'email': email})
        user_data = response.get('Item')

        if user_data and user_data['password'] == hashed_password:
            # Return a success response with user details
            response = {
                'statusCode': 200,
                'body': {'message': 'Login successful', 'user': user_data}
            }
        else:
            # Return an error response if user not found or password is incorrect
            response = {
                'statusCode': 401,
                'body': {'message': 'Invalid email or password'}
            }

    except ValueError as ve:
        # Return an error response if the input format is incorrect
        response = {
            'statusCode': 400,
            'body': {'message': str(ve)}
        }
    except Exception as e:
        # Return an error response if there's any other exception
        response = {
            'statusCode': 500,
            'body': {'error': str(e)}
        }

    return response
