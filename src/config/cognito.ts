import { Amplify } from 'aws-amplify';

export const cognitoConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'ap-southeast-3_My3vl7vSz',
      userPoolClientId: '21pkoj656th55ggv4bqbldlao9',
      loginWith: {
        oauth: {
          domain: 'auth.url-expander.wtf',
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: ['http://localhost:8081/', 'http://localhost:8080/', 'https://url-expander.wtf/'],
          redirectSignOut: ['http://localhost:8081/', 'http://localhost:8080/', 'https://url-expander.wtf/'],
          responseType: 'code',
        },
      },
    },
  },
};

// Configure Amplify
Amplify.configure(cognitoConfig);
