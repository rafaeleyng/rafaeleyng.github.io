import Link from 'next/link'
import site from '../data/site'

const SiteHeader = () => {
  return (
    <div className="container">
      <header className="site-header single-column">
        <Link href={process.env.blogPath || '/'}><a className="blog-title">{site.title}</a></Link>

        <nav className="blog-menu" >
          <a href="https://rafaeleyng.github.io/me" target="_blank">About</a>
          <a href="https://github.com/rafaeleyng/rafaeleyng.github.io" target="_blank">Github</a>
        </nav>
      </header>
    </div>
  )
}

export default SiteHeader