const Disqus = ({ pageData }) => {
  const script = `
  var disqus_shortname = 'TODO';
  var disqus_identifier = '${pageData.url}';

  /* * * DON'T EDIT BELOW THIS LINE * * */
  (function() {
      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
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
