import { useState } from 'react';
import './App.css';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';

function App() {
  const [activeSection, setActiveSection] = useState<string>('about');

  return (
    <div className="container">
      <header className="header">
        <div className="header-shell">
          <div className="brand-block">
             <p className="brand-kicker">Rohit Shetty</p>
          </div>
          <nav className="nav" aria-label="Primary">
            <button
              className={activeSection === 'about' ? 'active' : ''}
              onClick={() => setActiveSection('about')}
            >
              About
            </button>
            {/* <button
              className={activeSection === 'projects' ? 'active' : ''}
              onClick={() => setActiveSection('projects')}
            >
              Projects
            </button> */}
            <button
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={() => setActiveSection('contact')}
            >
              Contact
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        {activeSection === 'about' && <AboutPage />}
        {activeSection === 'projects' && <ProjectsPage />}
        {activeSection === 'contact' && <ContactPage />}
      </main>

      <footer className="footer">
        <div className="footer-shell">
          <p className="footer-title">Rohit Shetty</p>
          <p className="footer-copy">
            Software professional focused on building great products.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
