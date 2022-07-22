import axios from 'axios'
import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'
import { useUser } from '../context/user'
import Link from 'next/link'

interface ISubscriptionPlan {
  id: string
  name: string
  price: number
  interval: Stripe.Price.Recurring.Interval | undefined
  currency: string
}

interface ISubscriptionPlans {
  plans: ISubscriptionPlan[]
}

export default function Pricing({ plans }: ISubscriptionPlans) {
  const { user, login, isLoading } = useUser()

  const processSubscription = async (planId: ISubscriptionPlan['id']) => {
    const { data } = await axios.get(`/api/subscription/${planId}`)
    try {
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_KEY as string
      )

      await stripe?.redirectToCheckout({
        sessionId: data.id
      })
    } catch (error) {
      console.error(
        'Error processing subscription:',
        error,
        'Data error: ',
        data
      )
    }
  }

  const showSubscribeButton = !!user && !user.is_subscribed
  const showCreateAccountButton = !user
  const showManageSubscriptionButton = !!user && user.is_subscribed

  return (
    <div className="w-full  max-w-3xl mx-auto py-16 flex justify-around">
      {plans.map((plan) => (
        <div key={plan.id} className="w-80 h-40 rounded shadow px-6 py-4">
          <h2 className="text-xl">{plan.name}</h2>
          <p className="text-gray-500">
            {plan.price / 100} SEK / {plan.interval}
          </p>
          {!isLoading && (
            <div>
              {showSubscribeButton && (
                <button onClick={() => processSubscription(plan.id)}>
                  Subscribe
                </button>
              )}
              {showCreateAccountButton && (
                <button onClick={login}>Create Account</button>
              )}
              {showManageSubscriptionButton && (
                <Link href="/dashboard">
                  <a>Manage Subscription</a>
                </Link>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export const getStaticProps = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2020-08-27'
  })
  const { data: prices } = await stripe.prices.list()

  const plans = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product as string)

      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount as number,
        interval: price.recurring?.interval,
        currency: price.currency
      }
    })
  )

  const sortedPlans = plans.sort((a, b) => a.price - b.price)

  return {
    props: {
      plans: sortedPlans
    }
  }
}
