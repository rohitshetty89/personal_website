import './ProjectsPage.css';

function ProjectsPage() {
  return (
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
  );
}

export default ProjectsPage;
