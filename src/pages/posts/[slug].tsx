import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"
import Head from "next/head"

import { RichText } from "prismic-dom"
import { getPrismicClient } from "../../services/prismic"
import styles from './post.module.scss'

interface IPostProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

export default function Post({ post }: IPostProps) {
  return (
    <>
      <Head>
        <title>{post.slug} | My Blog</title>
      </Head>
      <main className={styles.container} >
        <article className={styles.post} >
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.post_content}
            dangerouslySetInnerHTML={{ __html:post.content }}
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params, query }) => {

  const session = getSession({ req })
  console.log('params:',params)
  console.log('query:',query)
  const { slug, lang } = query!

  // if(!session) {
  //   //Do something
  // }

  const prismic = getPrismicClient(req)
  const response = await prismic.getByUID('posts', String(slug),{
    lang
  })

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(String(response.last_publication_date)).toLocaleDateString('en-US',{
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props:{
      post,
    }
  }
}
