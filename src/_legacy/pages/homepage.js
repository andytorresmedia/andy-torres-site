import './homepage.css';
import andyLogo from '../assets/andytorreslogo.png';
import andyFullLogoName from '../assets/full-andy-logo-name.png';
import backgroundVideo from '../assets/test.mp4';
import {Link} from 'react-router-dom';
import DecryptedText from '../blocks/TextAnimations/DecryptedText/DecryptedText.jsx';

function Homepage() {
  return (
    <div>
      <div className="hero">

        <video autoPlay loop muted playsInline className="back-video">
          <source src={backgroundVideo} type="video/mp4" />
        </video>

        <nav>
          <a href="#" className="navbar-logo">
            <img src={andyLogo} alt="andy torres logo" className="logo" />
          </a>
          <ul className="navbar-links-group">
            <li>
              <Link to="/projects" className="navbar-links">
                <DecryptedText
                  text="[PROJECTS]"
                  speed={70}
                  sequential={true}
                  maxIterations={50}
                  characters="02⋿34¿579%$?&#*@▮"
                  revealDirection="start"
                  animateOn="view"
                  />
              </Link>
            </li>
            <li>
              <Link to="/bio" className="navbar-links">
              <DecryptedText
                  text="[BIO]"
                  speed={70}
                  sequential={true}
                  maxIterations={50}
                  characters="02⋿34¿579%$?&#*@▮"
                  revealDirection="start"
                  animateOn="view"
                  />
              </Link>
            </li>
            <li>
              <Link to="/contact" className="navbar-links">
                <DecryptedText
                  text="[CONTACT]"
                  speed={70}
                  sequential={true}
                  maxIterations={50}
                  characters="02⋿34¿579%$?&#*@▮"
                  revealDirection="start"
                  animateOn="view"
                  />
              </Link>
            </li>
          </ul>
        </nav>


        <div className="content">
          <img src={andyFullLogoName} alt="andy torres" className="homepage-name" />
            <div>
              <button className='homepage-cta-button'>
                <Link to="/projects" className="atag-no-style">
                <DecryptedText
                  text="2024 reel "
                  speed={90}
                  sequential={true}
                  maxIterations={50}
                  characters="0234¿579%$?&#*@▮"
                  revealDirection="start"
                  animateOn="view"
                  />
                  <i className="fa-solid fa-arrow-right fa-xs"></i>
                </Link>
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
