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
        <h1>Rohit Shetty</h1>
        <nav className="nav">
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
      </header>

      <main className="main">
        {activeSection === 'about' && <AboutPage />}
        {activeSection === 'projects' && <ProjectsPage />}
        {activeSection === 'contact' && <ContactPage />}
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Rohit. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
