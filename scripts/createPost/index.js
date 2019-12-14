require = require('esm')(module)

// run this script to create a new post
const fs = require('fs')
const path = require('path')
const dateformat = require('dateformat')
const template = require('lodash/template')

const { dateMachine } = require('../../src/utils/date')
const { slugify } = require('../../src/utils/slug')

const readTemplate = () => {
  const filename = 'post-template'
  const filepath = path.resolve(__dirname, filename)
  return fs.readFileSync(filepath, 'utf8')
}

const getTitle = () => {
  const title = process.argv[2]
  if (!title) {
    console.error(`[createPost] pass the post title as argument to the script`)
    process.exit(1)
  }
  return title
}

const getDate = () => {
  return dateMachine(new Date())
}

const writePostFile = (filename, content) => {
  const filepath = path.resolve(__dirname, '..', '..', 'src', 'posts', filename)
  fs.writeFileSync(filepath, content)
  console.log('[createPost] did create file', filepath)
}

const main = () => {
  const postTemplate = readTemplate()

  const date = getDate()
  const title = getTitle()
  const options = {
    date,
    title,
  }

  const result = template(postTemplate)(options)
  const filename = `${slugify(`${date} ${title}`)}.md`

  writePostFile(filename, result)
}

main()
