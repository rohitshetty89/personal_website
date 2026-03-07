import './ContactPage.css';

function ContactPage() {
  return (
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
  );
}

export default ContactPage;
