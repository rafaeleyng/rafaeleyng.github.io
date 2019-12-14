const ContentHeader = ({ title, children }) => (
  <header className="page-header">
    <div className="container single-column">
      <h1>{title}</h1>
      {children}
    </div>
  </header>
)

export default ContentHeader
