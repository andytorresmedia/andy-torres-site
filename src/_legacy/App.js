import {
  HashRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Homepage from "./pages/homepage";
import Projects from "./pages/projects";
import Bio from "./pages/bio";
import Contact from "./pages/contact";
import Clients from "./pages/clients";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/bio" element={<Bio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/clients" element={<Clients />} />

        {/* <Route path="/*" element={<h1 style={{color: 'whitesmoke', fontFamily: 'Major Mono Display'}}>404: page not found</h1>} /> */}
      </Routes>
    </Router>
    </>
  );
}

export default App;
