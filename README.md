# url-expander.wtf

![AWS](https://img.shields.io/badge/AWS-Serverless-FF9900?logo=amazonaws&logoColor=white)
![Usefulness](https://img.shields.io/badge/Usefulness-Questionable-ff1744)
![Productivity](https://img.shields.io/badge/Productivity-Negative-d500f9)
![Coffee](https://img.shields.io/badge/Powered_by-Coffee_%26_Chaos-5d4037)

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
| Styling         | Tailwind CSS + shadcn/ui          |
| Authentication  | AWS Cognito + Google OAuth        |
| Backend         | AWS Lambda (Node.js 20)           |
| Database        | DynamoDB (with GSI & TTL)         |
| API             | AWS API Gateway (REST)            |
| Hosting         | S3 + CloudFront (w/ OAC)          |
| Logging         | CloudFront Standard Logs v2       |
| Analytics       | AWS Athena (SQL on S3 logs)       |
| DNS             | Route 53                          |
| SSL/TLS         | ACM (AWS Certificate Manager)     |
| CI/CD           | GitHub Actions                    |
| Domain          | Yes, it's a .wtf                  |


## Features

- 🔗 **Transform short URLs into absurdly long ones** - Because efficiency is overrated
- 👤 **User Authentication** - Login with Google to track your URLs
- 📊 **Personal Dashboard** - View all your ridiculously expanded URLs with click counts
- ⏰ **Auto-expire links after 7 days** - DynamoDB TTL keeps things tidy
- 🎯 **Click Tracking** - Monitor how many people click your expanded URLs
- 📈 **Analytics Dashboard** - AWS Athena queries for traffic insights (country, device, browser)
- 🔒 **Security Monitoring** - Detect bots, SQL injection attempts, and suspicious traffic
- 🎭 **Redirect Page with Countdown** - 3-2-1 countdown before redirecting
- 🎨 **Beautiful UI** - Clean, minimal design with warm beige aesthetics (inspired by Anthropic)
- 🌙 **Dark Mode** - Because it's 2025
- 🌙 **Anonymous mode** - Generate URLs without login (no tracking)
- 🚀 **Serverless architecture** - Scales to infinity (or your AWS bill limit)
- 💸 **Pay-per-use pricing** - Almost free for low traffic (~$0.01/month)
- 📱 **Mobile responsive** - Works beautifully on all devices
- ♻️ **Auto-delete old logs** - S3 lifecycle policy deletes logs > 30 days

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
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Observability & Analytics                      │
│  CloudFront Standard Logs v2 → S3                           │
│  • Prefix: cloudfront/                                      │
│  • Lifecycle: Auto-delete logs > 30 days                    │
│  • Format: W3C (tab-delimited)                              │
│                                                             │
│  AWS Athena (SQL on S3)                                     │
│  • Database: cloudfront_url_expander_logs                   │
│  • 13+ saved queries (security, performance, analytics)     │
│  • Monitor: traffic, bots, performance, geo-location        │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

### Public Endpoints
- `POST /url-mappings` - Create expanded URL (accepts optional Authorization header)
- `GET /url-mappings/{code}` - Retrieve original URL by expanded code

### Protected Endpoints (requires authentication)
- `GET /users/me/urls` - Get all URLs created by authenticated user

## Deployment

The application uses AWS serverless infrastructure:

1. **Frontend**: React app hosted on S3, distributed via CloudFront
2. **Backend**: Lambda functions triggered by API Gateway
3. **Database**: DynamoDB with on-demand billing
4. **Authentication**: Cognito User Pool with Google OAuth

All infrastructure is pay-per-use with generous free tier coverage.

## Contributing

This is a satirical project, but PRs are welcome if you want to make URLs even more ridiculous.

## License

MIT - Because even chaos deserves to be open source.