import './clients.css';
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import andyLogo from '../assets/andytorreslogo.png';

import nfl from '../assets/client_NFL.png';
import nba from '../assets/client_NBA.png';
import chiefs from '../assets/client_chiefs.png';
import fanduel from '../assets/client_fanduel.png';
import suns from '../assets/client_phoenix_suns.png';
import cbsSports from '../assets/client_cbs_sports.png';
import patrickMahomes from '../assets/client_patrick_mahomes.png';
import chicagoBulls from '../assets/client_chicago_bulls.png';
import coinbase from '../assets/client_coinbase.png';
import atlantaHawks from '../assets/client_atlanta_hawks.png';
import fcCincinnati from '../assets/client_fc_cincinnati.png';
import sanFran49ers from '../assets/client_san_fran_49ers.png';
import laClippers from '../assets/client_la_clippers.png';
import dallasMavs from '../assets/client_dallas_mavs.png';
import excelSports from '../assets/client_excel_sports.png';
import paoloBanchero from '../assets/client_paolo_banchero.png';
import goldenStateWarriors from '../assets/client_golden_state_warriors.png';
import cincinnatiBengals from '../assets/client_cincinnati_bengals.png';
import mizzou from '../assets/client_mizzou.png';
import brooksKoepka from '../assets/client_brooksKoepka.png';
import sportsDigita from '../assets/client_sportsdigita.png';
import fiestaBowl from '../assets/client_fiesta_bowl.png';
import kcsn from '../assets/client_kcsn.png';

function Clients() {
  return (
    <div>
      <div className="hero_clients">
        <nav>
          <a href="#" className="navbar-logo">
            <img src={andyLogo} alt="andy torres logo" className="logo" />
          </a>
          <ul className="navbar-links-group">
            <li>
              <Link to="/projects" className="navbar-links">projects</Link>
            </li>
            <li>
              <Link to="/clients" className="navbar-links">clients</Link>
            </li>
            <li>
              <Link to="/bio" className="navbar-links">bio</Link>
            </li>
            <li>
              <Link to="/contact" className="navbar-links">contact</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="client-grid-container">
        <div className="thumbnail-grid">
          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={nfl} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>
          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={nba} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>
          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={chiefs} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>
          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={fanduel} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>

          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={patrickMahomes} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>
          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={chicagoBulls} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>
          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={suns} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>
          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={cbsSports} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>

          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={coinbase} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>
          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={atlantaHawks} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>
          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={fcCincinnati} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>
          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={sanFran49ers} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>

          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={laClippers} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>
          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={dallasMavs} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>
          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={excelSports} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>
          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={goldenStateWarriors} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>

          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={paoloBanchero} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>
          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={cincinnatiBengals} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>
          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={mizzou} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>

          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={brooksKoepka} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>
          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={sportsDigita} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>
          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={fiestaBowl} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>
          <div className="grid-item-client">
            <Fade triggerOnce>
              <a href="#" target="__blank">
                <img src={kcsn} alt="Video Thumbnail" />
              </a>
            </Fade>
          </div>






        </div>
      </div>


    </div>
  );
}

export default Clients;
