const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { id, original_url, expanded_code, created_at, expires_at } = body;

    if (!id || !original_url || !expanded_code || !created_at || !expires_at) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const params = {
      TableName: process.env.TABLE_NAME || 'url-mappings',
      Item: {
        id,
        original_url,
        expanded_code,
        created_at,
        expires_at: Math.floor(new Date(expires_at).getTime() / 1000) // DynamoDB TTL expects epoch seconds
      }
    };

    await docClient.send(new PutCommand(params));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'URL mapping stored successfully',
        data: body 
      })
    };
  } catch (error) {
    console.error('Error storing URL mapping:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to store URL mapping' })
    };
  }
};