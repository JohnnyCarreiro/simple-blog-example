import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"

import { RichText } from "prismic-dom"
import { getPrismicClient } from "../../services/prismic"
import styles from './post.module.scss'

interface IPostProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  },
  error?: {
    lang: string
    slug: string
  }
}

export default function Post({ post, error }: IPostProps) {
  const { locale } = useRouter()

  return (
    <>
      {post && (
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
      )}
      {error?.lang === 'pt-br' && (
        <>
          <Head>
            <title> Não Encontrado | My Blog</title>
          </Head>
          <main className={styles.container} >
            <article className={styles.post} >
              <h1> Post não Encontrado</h1>
              <br/>
              <p>Não encontramos nenhum posr com o  id: {error.slug}, para a lingua selecionada!</p>
              <br/>
              <Link href="/posts" locale={locale}>
                <a href="/posts"> Voltar para todos os post desta lingua?</a>
              </Link>
            </article>
          </main>
        </>
      )}
      {error?.lang === 'en-us' && (
        <>
          <Head>
            <title> Not found | My Blog</title>
          </Head>
          <main className={styles.container} >
            <article className={styles.post} >
              <h1> Post not Found</h1>
              <br/>
              <p>We dont have any post with this id: {error.slug}, on selected language</p>
              <br/>
              <Link href="/posts" locale={locale}>
                <a> Back to all posts from this language?</a>
              </Link>
            </article>
          </main>
        </>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params, locale }) => {

  const session = await getSession({ req })

  const { slug } = params!

  if(!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  try {
    const prismic = getPrismicClient(req)
  const response = await prismic.getByUID('posts', String(slug),{
    lang: String(locale)
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
  } catch (error) {
    return {
      props: {
        error: {
          lang: locale,
          slug
        }
      }
    }
  }
}
