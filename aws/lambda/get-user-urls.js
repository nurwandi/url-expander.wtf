const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-southeast-3' });
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
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
    console.log('Event requestContext:', JSON.stringify(event.requestContext, null, 2));

    // Extract user_id from Cognito JWT token
    let user_id = null;

    if (event.requestContext && event.requestContext.authorizer) {
      if (event.requestContext.authorizer.claims) {
        user_id = event.requestContext.authorizer.claims.sub;
        console.log('Found user_id in authorizer.claims:', user_id);
      } else if (event.requestContext.authorizer.jwt && event.requestContext.authorizer.jwt.claims) {
        user_id = event.requestContext.authorizer.jwt.claims.sub;
        console.log('Found user_id in jwt.claims:', user_id);
      }
    }

    if (!user_id) {
      console.log('No user_id found - returning 401');
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized - No valid token provided' })
      };
    }

    console.log('Querying URLs for user_id:', user_id);

    // Query DynamoDB using GSI
    const params = {
      TableName: process.env.TABLE_NAME || 'url-mappings',
      IndexName: 'user-id-index',
      KeyConditionExpression: 'user_id = :userId',
      ExpressionAttributeValues: {
        ':userId': user_id
      },
      ScanIndexForward: false // Sort by created_at descending (newest first)
    };

    const result = await docClient.send(new QueryCommand(params));

    // Transform results to include friendly format
    const urls = result.Items.map(item => ({
      id: item.id,
      code: item.expanded_code,
      original_url: item.original_url,
      created_at: item.created_at,
      expires_at: new Date(item.expires_at * 1000).toISOString(), // Convert epoch to ISO
      click_count: item.click_count || 0,
      expanded_url: `https://url-expander.wtf/${item.expanded_code}`
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        count: urls.length,
        urls: urls
      })
    };
  } catch (error) {
    console.error('Error fetching user URLs:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch URLs' })
    };
  }
};
