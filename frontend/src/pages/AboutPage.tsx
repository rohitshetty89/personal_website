import './AboutPage.css';

function AboutPage() {
  return (
    <section className="section">
      <h2>About Me</h2>
      <p>
        Hello! I'm Rohit, a software professional passionate about building
        great products. I enjoy working with modern technologies and
        solving problems.
      </p>
      <h3 className="skills-heading">Skills</h3>
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
  );
}

export default AboutPage;
