import React from 'react'
import Link from 'next/link'

import Layout from '../../components/Layout'
import AuthorLinks from '../../components/AuthorLinks'

import authors from '../../data/authors'

const Authors = () => {
  const authorsList = Object.entries(authors)

  const main = (
    <ul>
      {authorsList.map(([authorKey, author]) => (
        <li key={authorKey}>
          <AuthorLinks authorKey={authorKey} author={author} />
        </li>
      ))}
    </ul>
  )

  const pageData = {
    url: `/authors/`,
  }

  return (
    <Layout
      contentTitle="Authors"
      main={main}
      pageData={pageData}
    />
  )
}

export default Authors
