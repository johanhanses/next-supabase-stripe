import Stripe from 'stripe'

export interface IPremiumContent {
  id: number | string
  video_url: string
  created_at: string
}

export interface ILesson {
  id: number | string
  title: string
  description: string
  created_at: string
}

export interface ILessons {
  lessons: ILesson[]
}

export interface IUser {
  id: string
  email: string
}

export interface ISubscriptionPlan {
  id: string
  name: string
  price: number
  interval: Stripe.Price.Recurring.Interval | undefined
  currency: string
}

export interface ISubscriptionPlans {
  plans: ISubscriptionPlan[]
}
