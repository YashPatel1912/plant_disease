import { Leaf, Mail, ShieldCheck } from 'lucide-react';
import './Footer.css';

const FOOTER_LINKS = [
  { label: 'Home', target: 'home' },
  { label: 'How It Works', target: 'features' },
  { label: 'Detect Disease', target: 'detect' },
];

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <div className="footer__logo-row">
            <span className="footer__logo">
              <Leaf size={20} strokeWidth={2.4} />
            </span>
            <span className="footer__name">PlantGuard AI</span>
          </div>
          <p className="footer__text">
            A deep learning tool that helps growers spot plant diseases early from a single leaf photo.
          </p>
        </div>

        <div>
          <h4 className="footer__heading">Explore</h4>
          <ul className="footer__list">
            {FOOTER_LINKS.map((link) => (
              <li key={link.label}>
                <button type="button" className="footer__link" onClick={() => onNavigate(link.target)}>
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="footer__heading">Project</h4>
          <ul className="footer__list">
            <li className="footer__meta">
              <ShieldCheck size={16} />
              <span>Predictions run on your own trained model</span>
            </li>
            <li className="footer__meta">
              <Mail size={16} />
              <span>Built as a plant health research prototype</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>&copy; {new Date().getFullYear()} PlantGuard AI. All rights reserved.</p>
      </div>
    </footer>
  );
}
