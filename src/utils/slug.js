import slugifyLib from 'slugify'

export const slugify = (str) => {
  let result = str

  if (result.startsWith('./')) {
    result = result.replace('./', '')
  }

  const dateRegex = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}\-/
  if (dateRegex.test(result)) {
    result = result.substring(11)
  }

  if (result.endsWith('.md')) {
    result = result.slice(0, -3)
  }

  return slugifyLib(result, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
  })
}
