import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { navItems } from "../data/siteContent.js";

const logoSrc = "/assets/blinkride-logo.webp";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  useEffect(() => {
    function updateHeaderState() {
      setScrolled(window.scrollY > 90);
    }

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    return () => window.removeEventListener("scroll", updateHeaderState);
  }, []);

  const headerClassName = ["site-header", scrolled ? "is-scrolled" : "is-top", open ? "drawer-is-open" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClassName}>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div className="nav-shell">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          <img className="brand-logo" src={logoSrc} alt="BlinkRide" loading="eager" decoding="async" />
        </Link>

        <div className="header-actions">
          <button
            className="header-menu-button"
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={24} strokeWidth={3} />
          </button>
          <Link className="header-app-button" to="/get-the-app" onClick={() => setOpen(false)}>
            Get the App
          </Link>
        </div>
      </div>

      <button
        className={open ? "menu-backdrop is-open" : "menu-backdrop"}
        type="button"
        aria-label="Close menu backdrop"
        onClick={() => setOpen(false)}
      />

      <aside className={open ? "side-drawer is-open" : "side-drawer"} aria-hidden={!open} aria-label="Site menu">
        <img className="drawer-watermark" src={logoSrc} alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <button
          className="drawer-close"
          type="button"
          aria-label="Close menu"
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
          }}
        >
          <X size={23} strokeWidth={4} />
        </button>
        <nav className="drawer-nav" aria-label="Menu navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </header>
  );
}
