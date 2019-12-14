import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'

import Layout from '../components/Layout'
import AuthorLinks from '../components/AuthorLinks'
import Disqus from '../components/Disqus'

import { dateMachine, dateHuman } from '../utils/date'
import getPosts from '../utils/getPosts'

import authors from '../data/authors'

const Post = ({ author, authorKey, post }) => {
  const title = post.document.data.title
  const pageData = {
    title,
    url: `/${post.slug}`,
  }

  const contentHeader = (
    <>
      <p className="post-meta">
        <time itemProp="datePublished" dateTime={dateMachine(post.document.data.date)}>{dateHuman(post.document.data.date)}</time>
      </p>
      <p>
        <AuthorLinks authorKey={authorKey} author={author} />
      </p>
    </>
  )

  /*
    TODO add syntax highlighting:
    https://gist.github.com/ibrahima/d21950a95aee3212e991a8404e238093
    https://github.com/rexxars/react-markdown/issues/191
    https://medium.com/young-developer/react-markdown-code-and-syntax-highlighting-632d2f9b4ada
  */
  const main = (
    <section className="post">
      <span className="hidden" itemProp="publisher">Rafael Eyng</span>
      <span className="hidden" itemProp="keywords">{post.document.data.keywords}</span>
      <article className="post-content" itemProp="articleBody">
        <ReactMarkdown escapeHtml={false} source={post.document.content} />
      </article>

      {/* TODO comments */}
      {/* <Disqus pageData={pageData} /> */}
    </section>
  )

  return (
    <Layout
      contentHeader={contentHeader}
      contentTitle={title}
      main={main}
      pageData={pageData}
    />
  )
}

Post.getInitialProps = async (context) => {
  const { slug } = context.query

  const posts = getPosts()
  const post = posts.find((p) => p.slug === slug)

  const author = authors[post.document.data.author]
  const authorKey = post.document.data.author

  return {
    author,
    authorKey,
    post,
  }
}

export default Post
