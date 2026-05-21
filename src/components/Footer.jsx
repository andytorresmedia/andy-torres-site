// Footer.jsx — global footer (home / work / about).
import { useNav } from '../lib/navigation';
import { STUDIO_EMAIL, STUDIO_PHONE, STUDIO_LOCATION } from '../content/site';

const linkBtn = {
  background: 'none',
  border: 0,
  color: 'inherit',
  padding: 0,
  font: 'inherit',
  textAlign: 'left',
};

export function Footer() {
  const nav = useNav();
  return (
    <footer className="footer" data-screen-label="06 Footer">
      <div className="footer-top">
        <div>
          <h3>The studio</h3>
          <div className="word">
            FRONT&nbsp;ROW<em>.</em>
          </div>
          <p className="pitch">
            A cinematic 3D, VFX, and motion studio for sports, entertainment, and the live-event
            moments that have to land the first time. Headquartered in Los Angeles. Working worldwide.
          </p>
        </div>
        <div>
          <h3>Sitemap</h3>
          <ul>
            <li><button onClick={() => nav('home')} style={linkBtn}>Home</button></li>
            <li><button onClick={() => nav('work')} style={linkBtn}>Work</button></li>
            <li><button onClick={() => nav('about')} style={linkBtn}>About</button></li>
            <li><button onClick={() => nav('contact')} style={linkBtn}>Contact</button></li>
          </ul>
        </div>
        <div>
          <h3>Studio</h3>
          <ul>
            <li>{STUDIO_LOCATION}</li>
            <li>{STUDIO_EMAIL}</li>
            <li>{STUDIO_PHONE}</li>
            <li>Press · Bookings</li>
          </ul>
        </div>
        <div>
          <h3>Follow</h3>
          <ul>
            <li>Instagram</li>
            <li>Vimeo</li>
            <li>LinkedIn</li>
            <li>YouTube</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div>© 2026 Front Row · All rights reserved</div>
        <div className="links">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Colophon</span>
        </div>
      </div>
    </footer>
  );
}
