

function Header() {
    return (
        <div className="container-fluid">
        <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
          <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
            <svg className="bi me-2" width="40" height="32"></svg>
            <img src="/logo.png" alt="Our company Logo" width="40px" />
          </a>
      
          <ul className="nav nav-pills">
            <li className="nav-item">
              <a href="#" className="nav-link active text-dark" aria-current="page">Home</a>
            </li>
            <li className="nav-item">
              <a href="#bula" className="nav-link text-dark">Features</a>
            </li>
            <li className="nav-item">
              <a href="#yoyo" className="nav-link text-dark">Download</a>
            </li>
          </ul>
        </header>
      </div>
      

    );
}

export default Header;