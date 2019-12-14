import NextjsHead from 'next/head'
import site from '../data/site'

import GoogleAnalytics from './GoogleAnalytics'

const Head = ({ pageData = {} }) => {
  return (
    <NextjsHead>
      <title>{pageData.title || site.title}</title>

      <link href="//fonts.googleapis.com/css?family=Merriweather:900,900italic,300,300italic" rel="stylesheet" type="text/css" />
      <link rel="canonical" href={`${site.url}${pageData.url || ''}`} />
      {/* TODO feed XML */}
      {/* <link rel="alternate" type="application/rss+xml" title="{{ site.title }}" href="{{ "/feed.xml" | prepend: site.baseurl | prepend: site.url }}" /> */}

      <meta name="description" content={pageData.excerpt || ''} />
      <meta name="language" content="en" />
      <meta name="content-language" content="en" />
      <meta name="author" content="Rafael Eyng" />
      <meta name="keywords" content={pageData.keywords || 'software, development, javascript, github, node, docker, blog'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* TODO */}
      {/* <GoogleAnalytics /> */}
    </NextjsHead>
  )
}

export default Head
