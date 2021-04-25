import { GetStaticProps } from 'next'
import Head from 'next/head'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'

import { getPrismicClient } from '../../services/prismic'
import styles from './styles.module.scss'

type Post = {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
}

interface postsProps {
  posts: Post[]
}

export default function Posts({ posts }: postsProps) {
  return (
    <>
      <Head>
        <title> Post | My Blog </title>
      </Head>
      <main className={styles.container} >
        <div className={styles.posts_list} >
          { posts.map(post => (
            <a key={post.slug} href={post.slug}>
              <time>{ post.updatedAt }</time>
              <strong>{ post.title }</strong>
              <p>{post.excerpt}</p>
            </a>
          )) }
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'posts' )
  ], {
    fetch: ['posts.title', 'posts.content'],
    pageSize: 100,
    lang:'*'
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
      })
    }
  })

  return {
    props: {
      posts
    }
  }
}

