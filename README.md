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

| Layer        | Tool                     |
|-------------|--------------------------|
| Frontend    | React + Vite + TypeScript |
| Backend     | AWS Lambda Functions     |
| Database    | DynamoDB (with TTL)      |
| API         | AWS API Gateway          |
| Hosting     | S3 + CloudFront (w/ OAC) |
| CI/CD       | AWS CodePipeline         |
| Domain      | Yes, it's a .wtf         |


## Features

- 🔗 Transform short URLs into absurdly long ones
- ⏰ Auto-expire links after 7 days (DynamoDB TTL)
- 🎭 Satirical redirect messages with surprise images
- 🚀 Serverless architecture (scales to infinity)
- 💸 Pay-per-use pricing (almost free for low traffic)

## How It Works

Just try it already here:
👉 [https://url-expander.wtf](https://url-expander.wtf)

## Architecture

```
User → CloudFront → S3 (React App)
         ↓
    API Gateway → Lambda → DynamoDB
```

All serverless, all the time. Because managing servers is so 2010.