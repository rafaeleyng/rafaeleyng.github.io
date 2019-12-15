const GoogleAnalytics = () => {
  const script = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-154633858-1');
`

  return (
    <>
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-154633858-1"></script>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  )
}

export default GoogleAnalytics
