import { useState } from 'react';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState<string>('about');

  return (
    <div className="container">
      <header className="header">
        <h1>Rohit</h1>
        <nav className="nav">
          <button
            className={activeSection === 'about' ? 'active' : ''}
            onClick={() => setActiveSection('about')}
          >
            About
          </button>
          <button
            className={activeSection === 'projects' ? 'active' : ''}
            onClick={() => setActiveSection('projects')}
          >
            Projects
          </button>
          <button
            className={activeSection === 'contact' ? 'active' : ''}
            onClick={() => setActiveSection('contact')}
          >
            Contact
          </button>
        </nav>
      </header>

      <main className="main">
        {activeSection === 'about' && (
          <section className="section">
            <h2>About Me</h2>
            <p>
              Hello! I'm Rohit, a software professional passionate about building
              great products. I enjoy working with modern technologies and
              solving problems.
            </p>
            <div className="skills">
              <h3>Engineering Leadership</h3>
              <ul>
                <li>Strategic Planning</li>
                <li>Team Building</li>
                <li>Cross-Functional Collaboration</li>
                <li>Automation Strategy</li>
                <li>Operational Excellence</li>
                <li>Analytics</li>
                <li>Product Development</li>
              </ul>
            </div>

            <div className="skills">
              <h3>Cloud & Infrastructure</h3>
              <ul>
                <li>AWS (EBS, EC2, Lambda, Step Functions, CloudWatch)</li>
                <li>Distributed Systems</li>
                <li>Serverless Architecture</li>
                <li>Microservices</li>
                <li>CI/CD Pipelines</li>
              </ul>
            </div>

            <div className="skills">
              <h3>OS, Languages & Frameworks</h3>
              <ul>
                <li>Linux</li>
                <li>Java</li>
                <li>Kotlin</li>
                <li>Python</li>
                <li>JavaScript</li>
                <li>TypeScript</li>
                <li>React</li>
                <li>RESTful APIs</li>
              </ul>
            </div>

            <div className="skills">
              <h3>Methodologies</h3>
              <ul>
                <li>Agile Development</li>
                <li>Sprint Planning</li>
                <li>Code Reviews</li>
                <li>Unit Testing</li>
              </ul>
            </div>
          </section>
        )}

        {activeSection === 'projects' && (
          <section className="section">
            <h2>Projects</h2>
            <div className="projects-grid">
              <div className="project-card">
                <h3>Project One</h3>
                <p>A brief description of your first project and the technologies used.</p>
                <a href="#" className="project-link">View Project</a>
              </div>
              <div className="project-card">
                <h3>Project Two</h3>
                <p>A brief description of your second project and the technologies used.</p>
                <a href="#" className="project-link">View Project</a>
              </div>
              <div className="project-card">
                <h3>Project Three</h3>
                <p>A brief description of your third project and the technologies used.</p>
                <a href="#" className="project-link">View Project</a>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'contact' && (
          <section className="section">
            <h2>Get In Touch</h2>
            <p>
              I'm always open to discussing new opportunities, interesting projects,
              or just having a chat. Feel free to reach out!
            </p>
            <div className="contact-links">
              <a href="mailto:rohit.shetty@outlook.com" className="contact-link">
                Email
              </a>
              <a href="https://github.com/rohitshetty89" target="_blank" rel="noopener noreferrer" className="contact-link">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/rohitdshetty/" target="_blank" rel="noopener noreferrer" className="contact-link">
                LinkedIn
              </a>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Rohit. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
