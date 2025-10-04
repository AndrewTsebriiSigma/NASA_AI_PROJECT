import useStore from '../store/useStore';
import { getExoplanetLinks } from '../lib/api';

const ExoplanetLinks = () => {
  const { targetId } = useStore();
  
  if (!targetId) {
    return null;
  }
  
  const links = getExoplanetLinks(targetId);
  
  if (links.length === 0) {
    return null;
  }
  
  return (
    <div className="exo-card">
      <h3 className="exo-card__title">External Resources</h3>
      <p className="exo-card__sub">Explore this target in official archives</p>
      
      <div className="exo-links">
        {links.map((link, index) => (
          <a 
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="exo-link-btn"
          >
            {link.name}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ExoplanetLinks;

