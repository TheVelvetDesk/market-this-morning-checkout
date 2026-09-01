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
4. Create a Resend Segment named `market-this-morning-paid`; set `RESEND_PAID_SEGMENT_ID`.
5. Fill local env from example file
6. install deps then build
7. deploy to Vercel

## Paid-list behavior

Stripe webhooks are the source of truth. Subscriptions with status `trialing` or `active` are added to the Resend paid segment. Paused, unpaid, incomplete, or ended subscriptions are removed. A scheduled cancellation remains entitled until the paid period actually ends and Stripe sends the deleted status.

Subscribe the webhook endpoint to:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `customer.subscription.paused`
- `customer.subscription.resumed`
