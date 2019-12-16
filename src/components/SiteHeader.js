import Link from 'next/link'
import site from '../data/site'

const SiteHeader = () => {
  return (
    <div className="container">
      <header className="site-header single-column">
        <Link href={process.env.blogPath || '/'}><a className="blog-title">{site.title}</a></Link>

        <nav className="blog-menu" >
          <a target="_blank" rel="noopener" href="https://rafaeleyng.github.io/me">About</a>
          <a target="_blank" rel="noopener" href="https://github.com/rafaeleyng/rafaeleyng.github.io">Github</a>
        </nav>
      </header>
    </div>
  )
}

export default SiteHeader
