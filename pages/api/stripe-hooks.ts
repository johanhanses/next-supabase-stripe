import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { buffer } from 'micro'
import { getServiceSupabase } from '../../utils/supabase'

export const config = { api: { bodyParser: false } }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2020-08-27'
  })
  const signature = req.headers['stripe-signature']
  const signingSecret = process.env.STRIPE_SIGNING_SECRET
  const reqBuffer = await buffer(req)

  let event: any

  try {
    event = stripe.webhooks.constructEvent(
      reqBuffer,
      signature as string,
      signingSecret as string
    )
  } catch (error) {
    console.error(error)
    return res.status(400).send(`Webhook error`)
  }

  const supabase = getServiceSupabase()

  switch (event.type) {
    case 'customer.subscription.updated':
      await supabase
        .from('profile')
        .update({
          is_subscribed: true,
          interval: event.data.object.items.data[0].plan.interval
        })
        .eq('stripe_customer', event.data.object.customer)
      break
    case 'customer.subscription.deleted':
      await supabase
        .from('profile')
        .update({
          is_subscribed: false,
          interval: null
        })
        .eq('stripe_customer', event.data.object.customer)
      break
  }

  console.log(event)
  res.send({ received: true })
}
