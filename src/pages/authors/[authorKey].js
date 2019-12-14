import React from 'react'
import Link from 'next/link'
import dateformat from 'dateformat'

import Layout from '../../components/Layout'
import AuthorLinks from '../../components/AuthorLinks'

import authors from '../../data/authors'

import { dateHuman } from '../../utils/date'
import getPosts from '../../utils/getPosts'

const Author = ({ author, authorKey, posts }) => {
  const contentHeader = (
    <>
      {author.gravatar && (
        <div>
          <img src={`https://s.gravatar.com/avatar/${author.gravatar}?s=100`} alt={`${author.name} Gravatar picture`} />
        </div>
      )}
      <AuthorLinks authorKey={authorKey} author={author} showName={false} />
    </>
  )

  const main = (
    <>
      <h2>Posts by {author.name}</h2>
      <ul>
        {posts.map((post) => (
          <li>
            {dateHuman(post.document.data.date)}
            {' - '}
            <Link href="/[slug]" as={`/${post.slug}/`}>
              <a>{post.document.data.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )

  const pageData = {
    url: `/authors/${authorKey}/`,
  }

  return (
    <Layout
      contentHeader={contentHeader}
      main={main}
      pageData={pageData}
      contentTitle={author.name}
    />
  )
}

export default Author

Author.getInitialProps = async (context) => {
  const { authorKey } = context.query
  const author = authors[authorKey]
  const posts = getPosts().filter((post) => post.document.data.author === authorKey)

  return {
    author,
    authorKey,
    posts,
  }
}
