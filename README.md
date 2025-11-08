# url-expander.wtf

The most needlessly overengineered way to make your links *worse*.

## What is this?

Imagine Bit.ly.

Now reverse it.

Add nonsense.

Then ship it to production.

`url-expander.wtf` is a web application designed to take your clean, sensible, human-readable URLs... and **stretch them into cursed, verbose, absolutely unnecessary monstrosities**. Built with AWS serverless architecture and the belief that the internet is far too efficient.

## Why?

Because not every developer wants to build something *useful*.
Some of us are driven by chaos, caffeine, and a desire to see how far we can push DNS limits before someone at AWS files a complaint.

## 🔧 Tech Stack

| Layer           | Tool                              |
|-----------------|-----------------------------------|
| Frontend        | React + Vite + TypeScript         |
| Styling         | Tailwind CSS                      |
| Authentication  | AWS Cognito + Google OAuth        |
| Backend         | AWS Lambda (Node.js 20)           |
| Database        | DynamoDB (with GSI & TTL)         |
| API             | AWS API Gateway (REST)            |
| Hosting         | S3 + CloudFront (w/ OAC)          |
| DNS             | Route 53                          |
| SSL/TLS         | ACM (AWS Certificate Manager)     |
| Domain          | Yes, it's a .wtf                  |


## Features

- 🔗 **Transform short URLs into absurdly long ones** - Because efficiency is overrated
- 👤 **User Authentication** - Login with Google to track your URLs
- 📊 **Personal Dashboard** - View all your ridiculously expanded URLs
- ⏰ **Auto-expire links after 7 days** - DynamoDB TTL keeps things tidy
- 🎭 **Satirical redirect messages** - Complete with surprise images
- 🎨 **Anthropic-inspired UI** - Clean, minimal design with warm beige aesthetics
- 🌙 **Anonymous mode** - Generate URLs without login (no tracking)
- 🚀 **Serverless architecture** - Scales to infinity (or your AWS bill limit)
- 💸 **Pay-per-use pricing** - Almost free for low traffic
- 📱 **Mobile responsive** - Works beautifully on all devices

## How It Works

Just try it already here:
👉 [https://url-expander.wtf](https://url-expander.wtf)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  CloudFront → S3 (React SPA)                                │
│  • React + TypeScript + Vite                                │
│  • Tailwind CSS for styling                                 │
│  • AWS Amplify for auth                                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Authentication                           │
│  AWS Cognito User Pool                                      │
│  • Google OAuth 2.0 integration                             │
│  • Custom domain: auth.url-expander.wtf                     │
│  • JWT token-based authentication                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                              │
│  API Gateway (REST)                                         │
│  • POST /url-mappings (create URL)                          │
│  • GET /url-mappings/{code} (retrieve URL)                  │
│  • GET /users/me/urls (list user URLs)                      │
│  • Cognito Authorizer for protected endpoints               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic                           │
│  AWS Lambda Functions (Node.js 20)                          │
│  • url-expander-store-mapping                               │
│  • url-expander-get-mapping                                 │
│  • url-expander-get-user-urls                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                             │
│  DynamoDB                                                   │
│  • Table: url-mappings                                      │
│  • GSI: user-id-index (query URLs by user)                  │
│  • TTL: Auto-delete after 7 days                            │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

### Public Endpoints
- `POST /url-mappings` - Create expanded URL (accepts optional Authorization header)
- `GET /url-mappings/{code}` - Retrieve original URL by expanded code

### Protected Endpoints (requires authentication)
- `GET /users/me/urls` - Get all URLs created by authenticated user

## Development

### Prerequisites
- Node.js 20+
- AWS CLI configured
- Access to AWS account with appropriate permissions

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API Gateway URL

# Run development server
npm run dev
```

### Environment Variables

```env
VITE_API_GATEWAY_URL=https://your-api-gateway-url/v1
```

## Deployment

The application uses AWS serverless infrastructure:

1. **Frontend**: React app hosted on S3, distributed via CloudFront
2. **Backend**: Lambda functions triggered by API Gateway
3. **Database**: DynamoDB with on-demand billing
4. **Authentication**: Cognito User Pool with Google OAuth

All infrastructure is pay-per-use with generous free tier coverage.

## Security Features

- ✅ CORS properly configured
- ✅ HTTPS enforced via CloudFront
- ✅ JWT token validation
- ✅ No credentials stored in frontend
- ✅ User data isolated via GSI queries
- ✅ Automatic token refresh via AWS Amplify

## Contributing

This is a satirical project, but PRs are welcome if you want to make URLs even more ridiculous.

## License

MIT - Because even chaos deserves to be open source.