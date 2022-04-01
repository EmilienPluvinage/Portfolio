import "../styles/leftmenu.css";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function PageLink({ link, logo, logoHover }) {
  const location = useLocation().pathname.match(/^\/([^/]*)\/*/);
  const [LogoSrc, setLogoSrc] = useState(
    location[0] === link || location[1] === link ? logoHover : logo
  );
  useEffect(() => {
    if (location[0] === link || location[1] === link) {
      setLogoSrc(logoHover);
    } else {
      setLogoSrc(logo);
    }
  }, [location, link, logo, logoHover]);

  return (
    <div
      className="li"
      style={
        location[0] === link || location[1] === link
          ? { color: "skyblue" }
          : null
      }
      onMouseOver={() => setLogoSrc(logoHover)}
      onMouseOut={() =>
        location[0] !== link && location[1] !== link
          ? setLogoSrc(logo)
          : setLogoSrc(logoHover)
      }
    >
      <Link to={link} className="text-link">
        <div>
          <img width={"20px"} height={"20px"} src={LogoSrc} alt={link} />
        </div>
        <div style={{ flex: 1, paddingTop: "5px" }}>
          {link === "/" ? "Main" : link}
        </div>
      </Link>
    </div>
  );
}

export default PageLink;
