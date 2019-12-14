import React from 'react'
import Link from 'next/link'

import Layout from '../components/Layout'

import { dateMachine, dateHuman } from '../utils/date'
import getPosts from '../utils/getPosts'

const Index = ({ posts }) => {
  const main = (
    <ul className="post-list">
      {posts.map((post) => {
        const postData = post.document.data

        return (
          <li key={post.slug}>
            <p className="post-meta">
              <time dateTime={dateMachine(postData.date)}>{dateHuman(postData.date)}</time>
            </p>
            <Link href="/[slug]" as={`/${post.slug}`}>
              <a className="post-link">
                <h2 className="post-title">{ postData.title }</h2>
                <p className="post-summary">{postData.excerpt}</p>
              </a>
            </Link>
          </li>
        )
      })}
    </ul>
  )

  return (
    <Layout
      main={main}
    />
  )
}

export default Index

Index.getInitialProps = async function() {
  const posts = getPosts()

  return {
    posts,
  }
}
