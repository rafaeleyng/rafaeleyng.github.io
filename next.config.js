require = require('esm')(module) // so we can import our ES modules later, like from utils

const fs = require('fs');
const path = require('path');
const withSass = require('@zeit/next-sass')

const { slugify } = require('./src/utils/slug')

const isProd = process.env.NODE_ENV === 'production'
const blogPath = isProd ? '/blog' : ''

module.exports = withSass({
  assetPrefix: blogPath,

  env: {
    blogPath,
  },

  exportPathMap: async function() {
    const paths = {
      '/': { page: '/' },
    };

    // generate posts pages
    fs.readdirSync(path.resolve(__dirname, 'src', 'posts')).forEach(filename => {
      if (!filename.endsWith('.md')) {
        return
      }
      const slug = slugify(filename)
      paths[`/${slug}`] = { page: '/post', query: { slug } }
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
