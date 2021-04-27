import { GetStaticProps } from "next"
import { useSession } from "next-auth/client"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"

import { RichText } from "prismic-dom"
import { useEffect } from "react"
import { getPrismicClient } from "../../../services/prismic"
import styles from '../post.module.scss'

interface IPostPreviewProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
    lang:string
  }
}

export default function PostPreview({ post }: IPostPreviewProps) {
  const [ session ] = useSession()
  const router = useRouter()

  useEffect(()=>{
    if(session?.activeSubscription) {
      router.push(`/posts/${post.slug}?lang=${post.lang}`)
    }
  },[session])
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
            className={`${styles.post_content} ${styles.preview_content}`}
            dangerouslySetInnerHTML={{ __html:post.content }}
          />
          <div className={styles.cotinue_readding} >
            Wanna continue readding?
            <Link href="/" >
              <a href="">Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback:'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const { slug } = params!

  const prismic = getPrismicClient()
  const response = await prismic.getByUID('posts', String(slug),{
    lang: String(locale)
  })

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0,2)),
    updatedAt: new Date(String(response.last_publication_date)).toLocaleDateString('en-US',{
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    lang: response.lang
  }

  return {
    props:{
      post,
    },
    revalidate: 60 * 60 * 24 //24 hours
  }
}
