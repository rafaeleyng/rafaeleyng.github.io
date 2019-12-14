const Disqus = ({ pageData }) => {
  const script = `
var disqus_config = function () {
  this.page.url = 'https://rafaeleyng.github.io/blog${pageData.url}';
  this.page.identifier = '${pageData.url}';
};

(function() { // DON'T EDIT BELOW THIS LINE
  var d = document, s = d.createElement('script');
  s.src = 'https://https-rafaeleyng-github-io-blog.disqus.com/embed.js';
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
})();
`

  return (
    <>
      <div id="disqus_thread"></div>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{ __html: script }}
      />
      <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
    </>
  )
}

export default Disqus
