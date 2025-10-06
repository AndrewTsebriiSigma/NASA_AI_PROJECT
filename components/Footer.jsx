const Footer = () => {
  return (
    <footer className="exo-footer">
      <nav>
        <ul className="exo-footer__links">
          <li>
            <a href="https://www.spaceappschallenge.org/" target="_blank" rel="noopener noreferrer" className="exo-footer__link">
              NASA Space Apps
            </a>
          </li>
          <li>
            <a href="https://exoplanetarchive.ipac.caltech.edu/" target="_blank" rel="noopener noreferrer" className="exo-footer__link">
              Exoplanet Archive
            </a>
          </li>
          <li>
            <a href="https://mast.stsci.edu/" target="_blank" rel="noopener noreferrer" className="exo-footer__link">
              MAST
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;

