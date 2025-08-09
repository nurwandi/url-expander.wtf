const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const expanded_code = event.pathParameters?.expanded_code;

    if (!expanded_code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing expanded_code parameter' })
      };
    }

    const params = {
      TableName: process.env.TABLE_NAME || 'url-mappings',
      Key: {
        expanded_code
      }
    };

    const result = await docClient.send(new GetCommand(params));

    if (!result.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'URL mapping not found' })
      };
    }

    // Check if URL has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (result.Item.expires_at && result.Item.expires_at < currentTime) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'URL has expired' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        data: {
          ...result.Item,
          expires_at: new Date(result.Item.expires_at * 1000).toISOString() // Convert back to ISO string
        }
      })
    };
  } catch (error) {
    console.error('Error retrieving URL mapping:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to retrieve URL mapping' })
    };
  }
};