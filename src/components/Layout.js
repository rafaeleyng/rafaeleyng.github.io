import Head from './Head'
import SiteHeader from './SiteHeader'
import ContentHeader from './ContentHeader'
import Main from './Main'

import './Styles'

const Layout = ({ contentTitle, contentHeader, main, pageData = {} }) => {
  return (
    <>
      <Head pageData={pageData} />
      <SiteHeader />
      {contentTitle && <ContentHeader title={contentTitle}>{contentHeader}</ContentHeader>}
      <Main>{main}</Main>
    </>
  )
}

export default Layout
