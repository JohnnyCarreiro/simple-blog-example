import React from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'

import styles from './home.module.scss'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'

interface HomeProps{
  product:{
    priceId:string
    amount:number
  }
}

export default function IndexPage({product}:HomeProps){
  return (
  <div>
    <Head>
      <title>Home | My Blog</title>
    </Head>
    <main className={styles.contentContainer} >
      <section className={styles.hero} >
        <span>👏 Hey! welcome</span>
        <h1>News about the <span>React</span> world</h1>
        <p>
          Get access to all post and articles <br/>
          <span>for only {product.amount} month</span>
        </p>
        <SubscribeButton priceId={product.priceId} />
      </section>
      <img src="/images/avatar.svg" alt="Girl codding"/>
    </main>
  </div>
  )
}

  export const getStaticProps:GetStaticProps = async () => {
    const price = await stripe.prices.retrieve('price_1IhjivK55UgA8d4Th1P1DaPx', {
      expand:['product']
    })
    const product ={
      priceId: price.id,
      amount:new Intl.NumberFormat('en-Us', {
        style:'currency',
        currency:'USD',
      }).format(Number(price.unit_amount) / 100),
    }
    return {
      props:{
        product
      },
      revalidate: 60 * 60 * 24 //24 hours
    }
  }
