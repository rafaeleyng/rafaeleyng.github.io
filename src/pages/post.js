import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'

import Layout from '../components/Layout'
import Disqus from '../components/Disqus'

import { dateMachine, dateHuman } from '../utils/date'
import getPosts from '../utils/getPosts'

const Post = ({ post }) => {
  // TODO temp fix for `favicon.ico` error
  if (!post) {
    return null
  }

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

      <Disqus pageData={pageData} />
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

  return {
    post,
  }
}

export default Post
