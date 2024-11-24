import { useState } from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import Info from './components/nfo'
import 'bootstrap/dist/css/bootstrap.css'


function App() {
  const [count, setCount] = useState(0)

  return (
   
  <div className="stuff" id='stuff'>
    <Header />
    <div className="homer">
    <section className="py-5 text-center container" >
      <div className="row py-lg-5">
        <div className="col-lg-6 col-md-8 mx-auto">
          <h1 className="fw-bold">JAMEE : TRACKING JOBS SO YOU DON'T HAVE TO</h1>
          <p className="lead text-body-secondary">
            Jamee is an AI powered chrome extension that helps track job applications, integrating it seamlessly.
          </p>
          <p>
          <a href="#" className="btn btn-dark my-2 text-white">Download <img src="/diocn.png" alt="" width="20px" /></a>

          </p>
        </div>
      </div>
    </section>
    </div>
    
  <section className="text-center py-5" id = "bula">
  <div className="col-lg-6 col-md-8 mx-auto">
    <h1 className="fw-bold">NEVER HAVE TO STRESS AGAIN</h1>
  </div>

  <div className="d-flex justify-content-center">
    <img
      src="/img22.png"
      alt="Example Image"
      className="img-fluid rounded"
      style={{ maxWidth: '80%', height: 'auto' }}
    />
  </div>

  <p className="lead text-body-secondary">
    Say no more to manual tracking and the stress of having to log in every single job application you have submitted. 
  </p>
</section>


    <section  id='yoyo'>

    
        <div className="d-md-flex flex-md-equal w-100 my-md-3 ps-md-3">
      <div className="bg-body-tertiary me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden" style={{ width: '100%' }}>
        <div className="my-3 p-3">
          <h2 className="display-5">Job Applications have never been this easy</h2>
          <p className="lead text-body-secondary">Our Team is determined to ease the stress when an individual stress during job hunting. In particuar, job application tracking, as we recognize
            that it can get quite tedious to do so manually and constantly as you keep applying to jobs .So get ready for our latest innovation of Notion AI as we bring to you "JAMEE". 
            An AI powered chrome extension used in tracking job applications. 
          </p>
        </div>
        <div
          className="bg-body shadow-sm mx-auto"
          //style={{ width: "80%", height: "300px", borderRadius: "21px 21px 0 0" }}
        ></div>
      </div>

      <div className="bg-body-tertiary me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden" style={{ width: '100%' }}>
        <div className="my-3 py-3">
          <h2 className="display-5">What are you waiting for ?</h2>
          <p className="lead">Get started today!!</p>
        </div>
        <div
          
          //className="bg-body shadow-sm mx-auto"
          //style={{ width: "80%", height: "300px", borderRadius: "21px 21px 0 0" }}
        ><a href="#" className="btn btn-dark my-2 text-white">Download <img src="/diocn.png" alt="" width="20px" />
      </a>
      </div>
      </div>
    </div>
    <div class="container">
  <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
    <p class="col-md-4 mb-0 text-body-secondary">&copy; 2024 Company, Inc</p>

    <a href="/" class="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
      <svg class="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"/></svg>
    </a>

    <ul class="nav col-md-4 justify-content-end">
      
    </ul>
  </footer>
</div>
</section>
  </div>
  );
}

export default App
