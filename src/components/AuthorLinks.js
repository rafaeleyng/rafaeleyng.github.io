import React from 'react'
import Link from 'next/link'

const AuthorLinks = ({ authorKey, author, showName }) => (
  <>
    {showName && (
      <>
        <Link href="/authors/[authorKey]" as={`/authors/${authorKey}/`}>
          <a rel="author" itemProp="author" onClick={`_gaq.push(['_trackEvent', 'post_author', 'Post View', ${author.name}])`}>{author.name}</a>
        </Link>
        {' | '}
      </>
    )}
    <a href={`https://github.com/${author.github}`} target="_blank">{author.github}</a>
    {' | '}
    <a href={`https://twitter.com/${author.twitter}`} target="_blank">@{author.twitter}</a>
  </>
)

AuthorLinks.defaultProps = {
  showName: true,
}

export default AuthorLinks
