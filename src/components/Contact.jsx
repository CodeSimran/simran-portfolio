import { useRef, useState, useEffect } from "react";
import emailjs from "emailjs-com";
import { getStoredResumeConfig, openResumeInNewTab } from "../data/portfolioData";
import "./Contact.css";

export default function Contact() {
  const formRef = useRef();
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [resume, setResume] = useState(getStoredResumeConfig());

  useEffect(() => {
    const handleUpdate = () => {
      setResume(getStoredResumeConfig());
    };
    window.addEventListener("portfolio_data_updated", handleUpdate);
    return () => window.removeEventListener("portfolio_data_updated", handleUpdate);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    emailjs.sendForm(
      "YOUR_SERVICE_ID",   // replace with your EmailJS service ID
      "YOUR_TEMPLATE_ID",  // replace with your EmailJS template ID
      formRef.current,
      "YOUR_PUBLIC_KEY"    // replace with your EmailJS public key
    ).then(() => setStatus("sent"))
     .catch(() => setStatus("error"));
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="contact-headline">
        <h2 className="contact-big">Let us Build<br/>Together!</h2>
      </div>
      <div className="contact-divider"></div>
      <div className="footer-grid">
        <div className="footer-col">
          <p className="footer-col-title">MENU</p>
          {["intro","experience","projects","skills"].map(id => (
            <a key={id} href={`#${id}`} className="footer-link">
              {id.charAt(0).toUpperCase()+id.slice(1)}
            </a>
          ))}
        </div>
        <div className="footer-col">
          <p className="footer-col-title">CONNECT</p>
          <button
            type="button"
            onClick={() => openResumeInNewTab(resume)}
            className="footer-link-btn"
          >
            Resume / CV (PDF) ↗
          </button>
          <a href="https://www.linkedin.com/in/simrankr19/" target="_blank" rel="noreferrer" className="footer-link">LinkedIn ↗</a>
          <a href="https://github.com/CodeSimran" target="_blank" rel="noreferrer" className="footer-link">GitHub ↗</a>
          <a href="mailto:simrank04u@gmail.com" className="footer-link">Email</a>
        </div>
        <div className="footer-col">
          <p className="footer-col-title">SAY HELLO</p>
          <a href="mailto:simrank04u@gmail.com" className="footer-email">simrank04u@gmail.com</a>
          <p className="footer-availability">
            <span className="availability-dot"></span>
            Open to full-stack roles and collaborations
          </p>
          <p className="footer-phone">TEL — 8102413132</p>
        </div>
      </div>

      <div className="contact-form-area">
        <h3 className="form-heading">Send a Message</h3>
        {status === "sent" ? (
          <div className="form-success">Message sent! I will get back to you soon.</div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <input type="text" name="from_name" placeholder="Your Name" required className="form-input" />
              <input type="email" name="reply_to" placeholder="Your Email" required className="form-input" />
            </div>
            <textarea name="message" placeholder="Your Message" rows={5} required className="form-input form-textarea"></textarea>
            {status === "error" && <p className="form-error">Something went wrong. Please try again.</p>}
            <button type="submit" className="form-btn" disabled={status==="sending"}>
              {status === "sending" ? "Sending..." : "Send Message →"}
            </button>
          </form>
        )}
      </div>

      <div className="footer-bottom">
        <span>2024 Simran Kumari</span>
        <span>B.Tech CSE · CIST, Bhopal · CGPA 9.60</span>
      </div>
    </section>
  );
}
