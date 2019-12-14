import matter from 'gray-matter'

import { slugify } from './slug'

// from https://dev.to/tinacms/creating-a-markdown-blog-with-next-js-52hk
const getPosts = () => {
  const context = require.context('../posts', false, /\.md$/)
  const keys = context.keys()
  const values = keys.map(context)

  return keys.map((key, index) => {
    const value = values[index]
    const document = matter(value.default)
    const slug = slugify(key)

    return {
      document,
      slug,
    }
  })
    .sort((a, b) => new Date(b.document.data.date) - new Date(a.document.data.date))
}

export default getPosts
