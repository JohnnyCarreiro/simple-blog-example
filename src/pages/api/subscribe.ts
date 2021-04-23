import { NextApiRequest, NextApiResponse } from "next"
import { stripe } from "../../services/stripe"
import { getSession, GetSessionOptions } from 'next-auth/client'

export default async (request:NextApiRequest, response: NextApiResponse) => {
  if(request.method === 'POST') {

    const { priceId } = request.body
    console.log("PriceId:", priceId)
    console.log('Request:', JSON.stringify(request.body, null, 2))

    const session = await getSession({ req:request } as GetSessionOptions)

    const stripeCustomer = await stripe.customers.create({
      email: String(session?.user?.email)
    })

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {price: priceId, quantity:1}
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: String(process.env.STRIPE_SUCCESS_URL),
      cancel_url: String(process.env.STRIPE_SUCCESS_URL),
    })

    return response.status(200).json({sessionId: stripeCheckoutSession.id })
  } else {
    response.setHeader('Allow', 'POST')
    response.status(405).end('Method not allowed')
  }
}
