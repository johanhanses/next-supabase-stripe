import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { getServiceSupabase } from '../../utils/supabase'
import { IUser } from '../interface'

interface IRequestParams extends NextApiRequest {
  record: IUser
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    return res.status(401).send('Unauthorized')
  }

  const { record } = req.body as IRequestParams

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2020-08-27'
  })

  const customer = await stripe.customers.create({
    email: record.email
  })

  const supabase = getServiceSupabase()

  await supabase
    .from('profile')
    .update({ stripe_customer: customer.id })
    .eq('id', record.id)

  res.send({ message: `Stripe customer with id ${customer.id} created` })
}
