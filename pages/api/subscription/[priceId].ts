import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../utils/supabase'
import cookie from 'cookie'
import Stripe from 'stripe'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = await supabase.auth.api.getUserByCookie(req)

  if (!user) return res.status(401).send('Unauthorized')

  const token =
    req.headers.cookie && cookie.parse(req.headers.cookie)['sb-access-token']

  if (token) {
    supabase.auth.session = () => ({
      access_token: token,
      token_type: 'Bearer',
      user
    })
  }

  const {
    data: { stripe_customer }
  } = await supabase
    .from('profile')
    .select('stripe_customer')
    .eq('id', user.id)
    .single()

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2020-08-27'
  })

  const { priceId } = req.query
  const lineItems = [
    {
      price: priceId as string,
      quantity: 1
    }
  ]

  try {
    const session = await stripe.checkout.sessions.create({
      customer: stripe_customer,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: lineItems,
      success_url: 'http://localhost:3000/payment/success',
      cancel_url: 'http://localhost:3000/payment/cancelled'
    })

    res.send({ id: session.id })
  } catch (error) {
    console.log('Felet: ', error)
    res.send(error)
  }
}
