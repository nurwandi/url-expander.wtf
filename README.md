# url-expander.wtf

The most needlessly overengineered way to make your links *worse*.

## What is this?

Imagine Bit.ly.

Now reverse it.

Add nonsense.

Then ship it to production.

`url-expander.wtf` is a web application designed to take your clean, sensible, human-readable URLs... and **stretch them into cursed, verbose, absolutely unnecessary monstrosities**. Built with [Supabase](https://supabase.com/), [Edge Functions](https://supabase.com/docs/guides/functions), and the belief that the internet is far too efficient.

## Why?

Because not every developer wants to build something *useful*.  
Some of us are driven by chaos, caffeine, and a desire to see how far we can push DNS limits before someone at AWS files a complaint.

## 🔧 Tech Stack

| Layer        | Tool                     |
|-------------|--------------------------|
| Frontend    | SvelteKit                |
| Backend     | Supabase Edge Functions |
| Database    | Supabase Postgres        |
| Hosting     | S3 + CloudFront (w/ OAC) |
| CI/CD       | AWS CodePipeline         |
| Domain      | Yes, it's a .wtf         |


## How It Works

Just try it already here:
👉 [https://url-expander.wtf](https://url-expander.wtf)