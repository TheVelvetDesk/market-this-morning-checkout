# Market This Morning

10 USD/mo. First month free promo. Cancel anytime.

## Offer
- 10 USD/month
- First month free promo (trial 30 days)
- Cancel anytime

## Jennifer setup
1. Create Stripe price 10 USD/mo; set STRIPE_PRICE_ID. Trial is trial_period_days=30.
2. Webhook /api/webhook; set STRIPE_WEBHOOK_SECRET.
3. Local stripe listen to webhook route
4. Resend audience market-this-morning-paid
5. Fill local env from example file
6. install deps then build
7. deploy to Vercel
