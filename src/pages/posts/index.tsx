import Head from 'next/head'
import Link from 'next/link'
import { GetStaticProps } from 'next'

import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'

import { getPrismicClient } from '../../services/prismic'
import styles from './styles.module.scss'
import { useRouter } from 'next/router'

type Post = {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
  lang: string
}

interface postsProps {
  posts: Post[]
}

export default function Posts({ posts }: postsProps) {
  const { locale } = useRouter()
  return (
    <>
      <Head>
        <title> Post | My Blog </title>
      </Head>
      <main className={styles.container} >
        <div className={styles.posts_list} >
          { posts.map(post => (
            <Link key={post.slug} href={`/posts/${post.slug}?lang=${post.lang}`} locale={locale} >
              <a>
                <time>{ post.updatedAt }</time>
                <strong>{ post.title }</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          )) }
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const prismic = getPrismicClient()

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'posts' )
  ], {
    fetch: ['posts.title', 'posts.content'],
    pageSize: 100,
    lang: String(locale)
  })



  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find((content:any) => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(String(post.last_publication_date)).toLocaleDateString('en-US',{
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      lang:post.lang,
    }
  })

  return {
    props: {
      posts
    }
  }
}

