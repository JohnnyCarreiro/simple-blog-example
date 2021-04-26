import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { query as q } from 'faunadb'

import { fauna } from '../../../services/fauna'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope:'read:user'
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session(session) {

      try {
        const uaerActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(String(session.user?.email))
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
            ])
          )
        )
        return {
          ...session,
          activeSubscription :uaerActiveSubscription,
        }
      } catch (error) {
        return {
          ...session,
          activeSubscription :null
        }
      }

    },
    async signIn(user, account, profile){
      const { email } = user
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email as string)
                )
              ),
            ),
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email as string)
              )
            )
          )
        )
        return true
      } catch (error) {
        console.log(JSON.stringify(error, null, 2))
        return false
      }
    }
  }
  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
})
