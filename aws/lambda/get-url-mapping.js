const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "ap-southeast-3" });
const dynamodb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  try {
    const expanded_code = event.pathParameters?.expanded_code;

    if (!expanded_code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing expanded_code parameter' })
      };
    }

    console.log('Looking up expanded_code:', expanded_code);

    // Get the URL mapping
    const getParams = {
      TableName: 'url-mappings',
      Key: {
        expanded_code: expanded_code
      }
    };

    const result = await dynamodb.send(new GetCommand(getParams));

    if (!result.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'URL mapping not found' })
      };
    }

    // Check if URL is expired
    const now = Math.floor(Date.now() / 1000);
    if (result.Item.expires_at && result.Item.expires_at < now) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'URL has expired' })
      };
    }

    // Increment click count
    const updateParams = {
      TableName: 'url-mappings',
      Key: {
        expanded_code: expanded_code
      },
      UpdateExpression: 'SET click_count = if_not_exists(click_count, :zero) + :inc',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':zero': 0
      },
      ReturnValues: 'ALL_NEW'
    };

    const updateResult = await dynamodb.send(new UpdateCommand(updateParams));

    console.log('Click count incremented. New count:', updateResult.Attributes.click_count);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        data: updateResult.Attributes
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};
