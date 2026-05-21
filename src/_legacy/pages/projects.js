import './projects.css';
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import backVideo from '../assets/test.mp4';
import andyLogo from '../assets/andytorreslogo.png';
import thumbnailImage from '../assets/thumbnail_image.jpg';
import peekImageCD from '../assets/peek_image_cd.png';
import superBowlLVII from '../assets/super-bowl-lvii-open.jpg';
import chiefsPromo1 from '../assets/chiefs-promo-1.jpg';
import sunsCGI from '../assets/suns-cgi-sfx.jpg';
import fccCGI from '../assets/fccincy-cgi.jpg';
import atlHawks from '../assets/atl-hawks-upside-down.png';
import superBowlLVII2 from '../assets/chiefs-superbowl-lvii-2.jpg';
import sanFran49ers from '../assets/san-fran-49ers.png';
import chicagoBulls from '../assets/chicago-bulls.jpg';
import laClippers from '../assets/la-clippers.jpg';
import dallasMavs from '../assets/dallas-mavs.jpg';
import sunsCGI2 from '../assets/phoenix-suns-2.png';
import excelSportsNBA from '../assets/excel-sports-nba.jpg';
import chicagoBullsCoinbase from '../assets/chicago-bulls-coinbase.jpg';
import chiefsPatrickMahomes from '../assets/chiefs-patrick-mahomes.jpg';
import paoloBanchero from '../assets/paolo-banchero.png';
import chicagoBulls2 from '../assets/chicago-bulls-2.jpg';
import goldenStateWarriors from '../assets/golden-state-warriors.png';
import bengals from '../assets/bengals.png';
import koepka from '../assets/koepka-michelob-ultra.png';
import dreamdoll from '../assets/dreamdoll.png';
import brooklynNets from '../assets/brooklyn-nets-show-open.jpeg';
import losAngelesChargers from '../assets/Los-Angeles-Chargers-Show-Open.jpeg';
import denverNuggets from '../assets/NBA-Champions-Denver-Nuggets.jpeg';
import denverNuggets2 from '../assets/NBA-Finals-Promo.jpeg';
import superBowlLVIIring from '../assets/SBLVII-Ring-Reveal-chiefs.jpeg';
import uscShowOpen from '../assets/USC-Show-Open.jpeg';

// Client logos
import clientAdidas from '../assets/AT-ClientLogos/Adidas.png';
import clientAngryOrchard from '../assets/AT-ClientLogos/AngryOrchard.png';
import clientAtlantaHawks from '../assets/AT-ClientLogos/AtlantaHawks.png';
import clientBrooklynNets from '../assets/AT-ClientLogos/BrooklynNets.png';
import clientCarolinaPanthers from '../assets/AT-ClientLogos/CarolinaPanthers.png';
import clientChicagoBulls from '../assets/AT-ClientLogos/ChicagoBulls.png';
import clientCoinbase from '../assets/AT-ClientLogos/Coinbase.png';
import clientDallasMavericks from '../assets/AT-ClientLogos/DallasMavericks.png';
import clientDenverNuggets from '../assets/AT-ClientLogos/DenverNuggets.png';
import clientEASports from '../assets/AT-ClientLogos/EASports.png';
import clientFCCincinnati from '../assets/AT-ClientLogos/FCCincinnati.png';
import clientFIFAWordCupQatar from '../assets/AT-ClientLogos/FIFAWorldCupQatar.png';
import clientIgnite from '../assets/AT-ClientLogos/Ignite.png';
import clientKansasCityChiefs from '../assets/AT-ClientLogos/KansasCityChiefs.png';
import clientLAClippers from '../assets/AT-ClientLogos/LAClippers.png';
import clientLosAngelesChargers from '../assets/AT-ClientLogos/LosAngelesChargers.png';
import clientLouisvilleCardinals from '../assets/AT-ClientLogos/LouisvilleCardinals.png';
import clientMahomes from '../assets/AT-ClientLogos/Mahomes.png';
import clientNBA from '../assets/AT-ClientLogos/NBA.png';
import clientNewYorkKnicks from '../assets/AT-ClientLogos/NewYorkKnicks.png';
import clientOutbackSteakhouse from '../assets/AT-ClientLogos/OutbackSteakhouse.png';
import clientPaniniOfAmerica from '../assets/AT-ClientLogos/PaniniOfAmerica.png';
import clientPhoenixSuns from '../assets/AT-ClientLogos/PhoenixSuns.png';
import clientPuma from '../assets/AT-ClientLogos/Puma.png';
import clientRollingLoud from '../assets/AT-ClientLogos/RollingLoud.png';
import clientSF49ers from '../assets/AT-ClientLogos/SF49ers.png';
import clientSuperBowlLVII from '../assets/AT-ClientLogos/SuperBowlLVII.png';
import clientTheCrewLeague from '../assets/AT-ClientLogos/TheCrewLeague.png';
import clientUFC from '../assets/AT-ClientLogos/UFC.png';
import clientUnderArmour from '../assets/AT-ClientLogos/UnderArmour.png';
import clientUSC from '../assets/AT-ClientLogos/USC.png';
import clientCBSSports from '../assets/AT-ClientLogos/CBSSports.png';

import { LogoLoop } from '../blocks/Animations/LogoLoop/LogoLoop.jsx';
import DecryptedText from '../blocks/TextAnimations/DecryptedText/DecryptedText.jsx';

// For video player
import {useState} from 'react'
import ModalVideo from 'react-modal-video'
import '../../node_modules/react-modal-video/scss/modal-video.scss';

function Projects() {

  const [isOpen, setOpen] = useState(false);
  const [videoId, setVideoId] = useState("0");

  const openModalWithVideo = (newVideoId) => {
    console.log('huh:', newVideoId);
    setVideoId(newVideoId); 
    setOpen(true);
  };

  const logoImages = [
    { src: clientUnderArmour, alt: "UnderArmour", href: "https://www.underarmour.com/en-us/" },
    { src: clientAdidas, alt: "Adidas", href: "https://www.adidas.com/us" },
    { src: clientPuma, alt: "Puma", href: "https://us.puma.com/us/en" },
    { src: clientEASports, alt: "EA Sports", href: "https://www.ea.com/sports" },
    { src: clientCoinbase, alt: "Coinbase", href: "https://www.coinbase.com" },
    { src: clientPaniniOfAmerica, alt: "Panini of America", href: "https://www.paniniamerica.net" },
    { src: clientSuperBowlLVII, alt: "Super Bowl LVII", href: "https://www.nfl.com" },
    { src: clientFIFAWordCupQatar, alt: "FIFA", href: "https://www.fifa.com/en" },
    { src: clientRollingLoud, alt: "Rolling Loud", href: "https://www.rollingloud.com" },
    { src: clientUFC, alt: "UFC", href: "https://www.ufc.com" },
    { src: clientNBA, alt: "NBA", href: "https://www.nba.com" },
    { src: clientMahomes, alt: "Patrick Mahomes", href: "https://www.instagram.com/patrickmahomes/?hl=en" },
    { src: clientOutbackSteakhouse, alt: "Outback", href: "https://www.outback.com" },
    { src: clientAngryOrchard, alt: "Angry Orchard", href: "https://www.angryorchard.com" },
    { src: clientTheCrewLeague, alt: "The Crew League", href: "https://thecrewleague.com" },
    { src: clientKansasCityChiefs, alt: "Kansas City Chiefs", href: "https://www.chiefs.com" },
    { src: clientLosAngelesChargers, alt: "Los Angeles Chargers", href: "https://www.chargers.com" },
    { src: clientSF49ers, alt: "San Francisco 49ers", href: "https://www.49ers.com" },
    { src: clientCarolinaPanthers, alt: "Carolina Panthers", href: "https://www.panthers.com" },
    { src: clientUSC, alt: "USC", href: "https://www.usc.edu" },
    { src: clientLouisvilleCardinals, alt: "Louisville Cardinals", href: "https://gocards.com" },
    { src: clientFCCincinnati, alt: "FC Cincinnati", href: "https://www.fccincinnati.com" },
    { src: clientChicagoBulls, alt: "Chicago Bulls", href: "https://www.bulls.com" },
    { src: clientNewYorkKnicks, alt: "New York Knicks", href: "https://www.nba.com/knicks/" },
    { src: clientCBSSports, alt: "CBS Sports", href: "https://www.cbssports.com" },
    { src: clientLAClippers, alt: "LA Clippers", href: "https://www.nba.com/clippers/" },
    { src: clientPhoenixSuns, alt: "Phoenix Suns", href: "https://www.nba.com/suns/" },
    { src: clientDenverNuggets, alt: "Denver Nuggets", href: "https://www.nba.com/nuggets/" },
    { src: clientBrooklynNets, alt: "Brooklyn Nets", href: "https://www.nba.com/nets/" },
    { src: clientDallasMavericks, alt: "Dallas Mavericks", href: "https://www.nba.com/mavs/" },
    { src: clientIgnite, alt: "Ignite", href: "https://en.wikipedia.org/wiki/NBA_G_League_Ignite" },
    { src: clientAtlantaHawks, alt: "Atlanta Hawks", href: "https://www.nba.com/hawks/" },
  ];

  return (
    <div>
      <div className="hero_projects">

        <div className="back-video-container">
          <video autoPlay loop muted playsInline className="back-video-projects">
            <source src={backVideo} type="video/mp4" />
          </video>
        </div>

        <nav>
          <a href="#" className="navbar-logo">
            <img src={andyLogo} alt="andy torres logo" className="logo" />
          </a>
          <ul className="navbar-links-group">
            <li>
              <Link to="/projects" className="navbar-links">
                <DecryptedText
                  text="[PROJECTS]"
                  speed={50}
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
                  speed={50}
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
                  speed={50}
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


        <div className="projects-header">
          <div className="thumbnail-container">
            <div className="thumbnail">
              <div className="thumbnail-inner">
                <a href="https://vimeo.com/999951411" className="atag-no-style" target="__blank">
                  <img src={thumbnailImage} alt="Thumbnail" />
                </a>
                <img className="peek-image" src={peekImageCD} alt="Peek CD" />
              </div>
            </div>
          </div>
          <div className="highlight-text">
            <h2 style={{fontFamily: 'Syne'}}>2024 HIGHLIGHT REEL</h2>
            <br></br>
            <p>
              <ModalVideo channel='vimeo' autoplay isOpen={isOpen} videoId="999951411" onClose={() => setOpen(false)} />

              <a onClick={() => openModalWithVideo("999951411")} className="atag-no-style" target="__blank">Watch <i className="fa fa-play-circle"></i> </a>
            </p>
          </div>
        </div>

      </div>

      <div style={{ height: '80px', position: 'relative', overflow: 'hidden', backgroundColor: 'black' }}>
        <LogoLoop 
          logos={logoImages} 
          speed={50}
          direction="left"
          logoHeight={80}
          gap={20}
          pauseOnHover={false}
          scaleOnHover
          fadeOut
          fadeOutColor="black"
          ariaLabel="Clients"
          />
      </div>

      <div className="grid-container">
        <div className="grid-item">
        <Fade triggerOnce>
            {/* Super Bowl LVII Show Open video  */}
            <a href="https://www.youtube.com/watch?v=yhNCjhR1dn0" target="__blank">
              <img src={superBowlLVII} alt="Video Thumbnail" />
            </a>

            <div className="grid-container-text">
                <h3 className="grid-container-text-title">Super Bowl LVII Show Oen!</h3>
                <p className="grid-container-text-subtitle">FanDuel</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://twitter.com/nuggets/status/1668455869716250624?s=20" target="__blank">
              <img src={denverNuggets} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">NBA Champions</h3>
                <p className="grid-container-text-subtitle">Denver Nuggets</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://www.instagram.com/reel/CrhMI2wA5w0/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA%3D%3D" target="__blank">
              <img src={brooklynNets} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">Brooklyn Nets Playoffs Show Open</h3>
                <p className="grid-container-text-subtitle">Brooklyn Nets</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://twitter.com/chargers/status/1700641984707215391?s=20" target="__blank">
              <img src={losAngelesChargers} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">Los Angeles Chargers Show Open</h3>
                <p className="grid-container-text-subtitle">Los Angeles Chargers</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://www.instagram.com/p/CrO4hhsOx19/" target="__blank">
              <img src={fccCGI} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">FC Cincinnati Intro Video</h3>
                <p className="grid-container-text-subtitle">FC Cincinnati</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://twitter.com/Chiefs/status/1669535765607456769?s=20" target="__blank">
              <img src={superBowlLVIIring} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">SBLVII Ring Reveal</h3>
                <p className="grid-container-text-subtitle">Kansas City Chiefs</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://twitter.com/andytorres_a/status/1584349239613980672?s=20&t=Bn9N1-6Uuw-QZ6ZZnmPFsA" target="__blank">
              <img src={laClippers} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">LA Clippers Show Open</h3>
                <p className="grid-container-text-subtitle">LA Clippers</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://twitter.com/andytorres_a/status/1573360816581382145?s=20&t=r4AarUZLdN9r9cqgrAmDZg" target="__blank">
              <img src={excelSportsNBA} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">NBA DRAFT COMBINE: The Movie</h3>
                <p className="grid-container-text-subtitle">excel sports x NBA</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://www.instagram.com/p/Cn8Y34XjQwu/" target="__blank">
              <img src={chiefsPromo1} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">AFC Championship Promo</h3>
                <p className="grid-container-text-subtitle">Kansas City Chiefs</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://twitter.com/andytorres_a/status/1590830852610707457?s=20&t=cfp87Ohm0SZKExlL5_eElg" target="__blank">
              <img src={chicagoBulls} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">Chicago Bulls City Edition</h3>
                <p className="grid-container-text-subtitle">Chicago Bulls</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://www.instagram.com/p/CogEBb1DCv1/" target="__blank">
              <img src={superBowlLVII2} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">Super Bowl LVII Promo</h3>
                <p className="grid-container-text-subtitle">Kansas City Chiefs</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://twitter.com/Bengals/status/1492876221742419973?s=20&t=-2joXkPi8LIfZxd3W2Z04w" target="__blank">
              <img src={bengals} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">Super Bowl LVI | Bengals</h3>
                <p className="grid-container-text-subtitle">Cincinnati Bengals</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://www.youtube.com/watch?v=KMEFqxT1Lng" target="__blank">
              <img src={uscShowOpen} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">USC Show Open</h3>
                <p className="grid-container-text-subtitle">University of Southern California</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://twitter.com/warriors/status/1537910456102289408?s=20&t=Zo9LlV_X-qjFBRF_eUzrDA" target="__blank">
              <img src={goldenStateWarriors} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">2022 NBA Champions</h3>
                <p className="grid-container-text-subtitle">Golden State Warriors</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://twitter.com/andytorres_a/status/1590171966824419328?s=20&t=cfp87Ohm0SZKExlL5_eElg" target="__blank">
              <img src={sunsCGI2} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">Phoenix Suns Intro Video</h3>
                <p className="grid-container-text-subtitle">Phoenix Suns</p>
            </div>
        </Fade>
        </div>


        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://www.instagram.com/p/CrJtn1fOWw-/" target="__blank">
              <img src={sunsCGI} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">Suns NBA Playoffs Show Open</h3>
                <p className="grid-container-text-subtitle">Phoenix Suns</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://twitter.com/chicagobulls/status/1517548791636926466?s=20&t=dBFkH-S3LlLuB-P92TucjQ" target="__blank">
              <img src={chicagoBulls2} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">Chicago Bulls Playoffs Promo</h3>
                <p className="grid-container-text-subtitle">Chicago Bulls</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://www.instagram.com/p/Ce31kCiO-a8/?utm_source=ig_web_copy_link" target="__blank">
              <img src={dreamdoll} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">Dreamdoll 3D Visual Piece </h3>
                <p className="grid-container-text-subtitle">DREAMDOLL</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://twitter.com/andytorres_a/status/1568998791835172865?s=20&t=QuX6-TIRdrlHBhFL1ie4ag" target="__blank">
              <img src={chiefsPatrickMahomes} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">Mahomes Season Opener</h3>
                <p className="grid-container-text-subtitle">Patrick Mahomes</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://twitter.com/nuggets/status/1664112437883465728?s=20" target="__blank">
              <img src={denverNuggets2} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">NBA Finals Promo</h3>
                <p className="grid-container-text-subtitle">Denver Nuggets</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://twitter.com/andytorres_a/status/1588595801298964480?s=20&t=cfp87Ohm0SZKExlL5_eElg" target="__blank">
              <img src={dallasMavs} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">Dallas Mavericks City Edition</h3>
                <p className="grid-container-text-subtitle">Dallas Mavericks</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://gondola.cc/posts/214620-paolo5-instagram" target="__blank">
              <img src={paoloBanchero} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">2022 NBA Draft</h3>
                <p className="grid-container-text-subtitle">Paolo Banchero</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://www.instagram.com/p/CqtL44Cr9xF/" target="__blank">
              <img src={atlHawks} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">Atlanta Hawks Show Open</h3>
                <p className="grid-container-text-subtitle">Atlanta Hawks</p>
            </div>
        </Fade>
        </div>
        
        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://www.instagram.com/p/CTQTrUCnZtD/?utm_source=ig_web_copy_link" target="__blank">
              <img src={koepka} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">Koepka Closeup | Michelob Ultra</h3>
                <p className="grid-container-text-subtitle">Brooks Koepka</p>
            </div>
        </Fade>
        </div>

        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://twitter.com/49ers/status/1614306663422656512?s=20" target="__blank">
              <img src={sanFran49ers} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">49ers NFL Playoffs</h3>
                <p className="grid-container-text-subtitle">San Francisco 49ers</p>
            </div>
        </Fade>
        </div>
        
        
        <div className="grid-item">
        <Fade triggerOnce>
            <a href="https://twitter.com/andytorres_a/status/1567910955341828096?s=20&t=QuX6-TIRdrlHBhFL1ie4ag" target="__blank">
              <img src={chicagoBullsCoinbase} alt="Video Thumbnail" />
            </a>
            <div className="grid-container-text">
                <h3 className="grid-container-text-title">The Aurochs NFT Project</h3>
                <p className="grid-container-text-subtitle">Chicago Bulls x Coinbase</p>
            </div>
        </Fade>
        </div>



      </div>
        
      <p>Hi</p>
        


    </div>
  );
}

export default Projects;
