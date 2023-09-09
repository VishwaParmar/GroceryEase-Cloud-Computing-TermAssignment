import json
import boto3
from decimal import Decimal

# Custom JSON Encoder to handle Decimal types
class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return str(o)
        return super(DecimalEncoder, self).default(o)

dynamodb = boto3.resource('dynamodb')
table_name = 'Inventory'  # Replace with your DynamoDB table name

def get_inventory_data(category=None):
    table = dynamodb.Table(table_name)

    if category and category.lower() != 'all':
        response = table.scan(
            FilterExpression=boto3.dynamodb.conditions.Attr('Category').eq(category)
        )
    else:
        # If category is 'All' or not provided, retrieve all data from the table
        response = table.scan()

    return response['Items']

def lambda_handler(event, context):
    try:
        # Check if the 'category' key is present in the event body
        category = event.get('category', '').strip()

        # Get the inventory data based on the user's chosen category
        inventory_data = get_inventory_data(category)

        return {
            'statusCode': 200,
            'body': json.dumps(inventory_data, cls=DecimalEncoder)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }


