import json
import boto3
import random

def lambda_handler(event, context):
    # Parse the input data from the API Gateway event
    data = json.loads(event['body'])
    print(data)

    # Generate a random 5-digit order ID
    order_id = generate_order_id()

    # Extract the email ID from the data
    email = data.get('email', '')  # Assuming the key for email ID in the input data is 'email'

    # Save the order details to DynamoDB
    success = save_order_to_dynamodb(order_id, data, email)

    if success:
        # Prepare the success response to be sent back to the API Gateway
        response = {
            'statusCode': 200,
            'body': json.dumps({'message': 'Order placed successfully', 'orderId': order_id})
        }
        
        # Send email notification using SNS
        send_sns_notification(email, order_id)
    else:
        # Prepare the error response to be sent back to the API Gateway
        response = {
            'statusCode': 500,
            'body': json.dumps({'message': 'Failed to place order'})
        }

    return response

def generate_order_id():
    # Generate a random 5-digit order ID
    return str(random.randint(10000, 99999))

def save_order_to_dynamodb(order_id, order_data, email):
    dynamodb = boto3.resource('dynamodb')
    table_name = 'Order'  # Replace with your actual DynamoDB table name
    table = dynamodb.Table(table_name)

    try:
        # Add the order ID, email, and id (primary key) to the order data
        order_data['orderId'] = order_id
        order_data['email'] = email
        order_data['id'] = order_id

        # Split the 'Items' string into individual items and quantities
        items_string = order_data.get('Items', '')
        items_list = [item.strip() for item in items_string.split()]

        # Extract item names and quantities
        items = {}
        for i in range(0, len(items_list), 2):
            item_name = items_list[i]
            quantity = int(items_list[i + 1])
            items[item_name] = quantity

        # Add the items dictionary to the order data
        order_data['Items'] = items

        # Save the order details to DynamoDB
        table.put_item(Item=order_data)

        # Return True if the order is successfully saved
        return True
    except Exception as e:
        # Handle the exception if there's an error while saving the order
        print('Error while saving order to DynamoDB:', e)
        return False

def send_sns_notification(email, order_id):
    sns_client = boto3.client('sns')
    topic_name = 'orderConfirmation'  # Replace with the name of your SNS topic

    # Get the SNS topic ARN by name
    topics = sns_client.list_topics()['Topics']
    topic_arn = [topic['TopicArn'] for topic in topics if topic_name in topic['TopicArn']][0]

    message = f"Your order with ID {order_id} has been successfully placed."
    subject = "Order Placed"

    sns_client.publish(
        TopicArn=topic_arn,
        Message=message,
        Subject=subject,
        MessageAttributes={
            'email': {
                'DataType': 'String',
                'StringValue': email
            }
        }
    )
