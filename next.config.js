require = require('esm')(module) // so we can import our ES modules later, like from utils

const fs = require('fs');
const path = require('path');
const withSass = require('@zeit/next-sass')

const authors = require('./src/data/authors').default
const { slugify } = require('./src/utils/slug')

module.exports = withSass({
  exportTrailingSlash: true,

  exportPathMap: async function() {
    const paths = {
      '/': { page: '/' },
      '/authors': { page: '/authors' },
    };

    // generate authors pages
    const authorsEntries = Object.entries(authors)
    authorsEntries.forEach(([authorKey]) => {
      paths[`/authors/${authorKey}`] = { page: '/authors/[authorKey]', query: { authorKey } }
    })

    // generate posts pages
    fs.readdirSync(path.resolve(__dirname, 'src', 'posts')).forEach(filename => {
      if (!filename.endsWith('.md')) {
        return
      }
      const slug = slugify(filename)
      paths[`/${slug}`] = { page: '/[slug]', query: { slug } }
    });

    return paths;
  },

  webpack: function(config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
})
