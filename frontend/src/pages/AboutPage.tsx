import './AboutPage.css';
import rohit from '../assets/images/rohit.jpeg';

function AboutPage() {
  return (
    <section className="section">
      <div className="about-hero">
        <div className="about-content">
          <p className="eyebrow">Software Professional</p>
          <h2>About</h2>
          <p className="subtitle">Hi, I am Rohit Shetty</p>
          <p>
            A software professional passionate about
            building great products. I enjoy working with modern technologies
            and solving problems.
          </p>
        </div>
        <div className="about-image-card">
          <div className="about-image">
            <img src={rohit} alt="Portrait of Rohit Shetty" />
          </div>
        </div>
      </div>

      <div className="skills-section">
        <h3 className="skills-heading">Skills</h3>
        <div className="skills-grid">
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
        </div>
      </div>
    </section>
  );
}

export default AboutPage;
