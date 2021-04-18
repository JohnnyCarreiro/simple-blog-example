import React from 'react'
import Head from 'next/head'

import styles from './home.module.scss'
import { SubscribeButton } from '../components/SubscribeButton'

const IndexPage = () => (
  <div>
    <Head>
      <title>Home | My Blog</title>
    </Head>
    <main className={styles.contentContainer} >
      <section className={styles.hero} >
        <span>👏 Hey! welcome</span>
        <h1>News about the <span>React</span> world</h1>
        <p>
          Get access to all publications <br/>
          <span>for only $9.90 month</span>
        </p>
        <SubscribeButton />
      </section>
      <img src="/images/avatar.svg" alt="Girl codding"/>
    </main>
  </div>
  )

  export default IndexPage
