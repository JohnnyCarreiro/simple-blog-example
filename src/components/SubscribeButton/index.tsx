import { useSession, signIn } from 'next-auth/client'
import { Router, useRouter } from 'next/router'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import styles from './styles.module.scss'

interface SubscribeButtonProps {
  priceId:string
}

export function SubscribeButton({ priceId }:SubscribeButtonProps) {

  const [ session ] = useSession()
  const route = useRouter()


  async function handleSubscribe() {
    if(!session){
      signIn('github')
      return
    }
    if(session?.activeSubscription) {
      route.push('/posts')
      return
    }
    try {
      const response = await api.post('/subscribe', { priceId })

      const { sessionId } = response.data

      const stripe = await getStripeJs()

      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}

