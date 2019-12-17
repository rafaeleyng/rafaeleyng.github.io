import NextjsHead from 'next/head'
import site from '../data/site'

import GoogleAnalytics from './GoogleAnalytics'

const Head = ({ pageData = {} }) => {
  return (
    <NextjsHead>
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preload" href="https://fonts.googleapis.com/css?family=Merriweather:900,900italic,300,300italic&display=optional" as="style" />

      <title>{pageData.title || site.title}</title>

      <meta name="description" content={pageData.excerpt || 'Rafael Eyng\'s tech blog'} />
      <meta name="language" content="en" />
      <meta name="content-language" content="en" />
      <meta name="author" content="Rafael Eyng" />
      <meta name="keywords" content={pageData.keywords || 'software, development, javascript, github, node, docker, blog'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <link rel="canonical" href={`${site.url}${pageData.url || ''}`} />
      <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      <link href="https://fonts.googleapis.com/css?family=Merriweather:900,900italic,300,300italic&display=optional" rel="stylesheet" type="text/css" />

      <GoogleAnalytics />
    </NextjsHead>
  )
}

export default Head
