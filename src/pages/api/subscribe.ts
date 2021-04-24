import { NextApiRequest, NextApiResponse } from "next"
import { getSession, GetSessionOptions } from 'next-auth/client'
import { query as q } from 'faunadb'

import { stripe } from "../../services/stripe"
import { fauna } from "../../services/fauna"

type User = {
  ref: {
    id: string
  }
  data: {
    stripe_cutomer_id: string
  }
}

export default async (request:NextApiRequest, response: NextApiResponse) => {
  if(request.method === 'POST') {

    const { priceId } = request.body

    const session = await getSession({ req:request } as GetSessionOptions)

    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(String(session?.user?.email))
        )
      )
    )

    let customerId = user.data.stripe_cutomer_id

    if(!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: String(session?.user?.email)
      })

      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), String(user.ref.id)),
          {
            data: {
              stripe_cutomer_id:String(stripeCustomer.id)
            }
          }
        )
      )
      customerId = stripeCustomer.id
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
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
