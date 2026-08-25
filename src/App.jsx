import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Ticker from "./components/Ticker";
import Intro from "./components/Intro";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Achievements from "./components/Achievements";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Admin from "./components/Admin";
import "./App.css";

function checkIsAdmin() {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  return path === "/admin" || path.startsWith("/admin/") || hash === "#admin" || hash.startsWith("#admin/") || search.includes("admin=true");
}

export default function App() {
  const [showAdmin, setShowAdmin] = useState(checkIsAdmin());

  // Listen to URL changes & history
  useEffect(() => {
    const handleUrlChange = () => {
      setShowAdmin(checkIsAdmin());
    };

    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("hashchange", handleUrlChange);

    // Secret shortcut: Ctrl + Shift + A (or Cmd + Shift + A) to open admin anytime
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setShowAdmin((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("hashchange", handleUrlChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Scroll reveal
  useEffect(() => {
    if (showAdmin) return;
    const els = document.querySelectorAll(".reveal-on-scroll");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [showAdmin]);

  const handleCloseAdmin = () => {
    setShowAdmin(false);
    if (window.location.pathname.includes("admin")) {
      window.history.pushState({}, "", "/");
    }
    if (window.location.hash.includes("admin")) {
      window.history.pushState({}, "", window.location.pathname);
    }
  };

  // If on /admin or secret mode, render Admin Dashboard
  if (showAdmin) {
    return <Admin onClose={handleCloseAdmin} />;
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <Intro />
        <Experience />
        <Projects />
        <Achievements />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
