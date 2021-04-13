import React from 'react'
import Head from 'next/head'
import styles from '../styles/home.module.scss'

const IndexPage = () => (
  <div>
    <Head>
      <title>Home | My Blog</title>
    </Head>
    <h1
      className={styles.title}
    >
      hello world 👋🏻 🌎
    </h1>
  </div>
  )

  export default IndexPage
