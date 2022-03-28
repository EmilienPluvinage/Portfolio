import "../styles/leftmenu.css";
import { useState, useEffect } from "react";

function PageLink({ link, page, setPage, logo, logoHover }) {
  const [LogoSrc, setLogoSrc] = useState("");

  useEffect(() => {
    if (page === link) {
      setLogoSrc(logoHover);
    } else {
      setLogoSrc(logo);
    }
  }, [page, link, logo, logoHover]);

  return (
    <div
      className="li"
      style={page === link ? { color: "skyblue" } : null}
      onClick={() => setPage(link)}
      onMouseOver={() => setLogoSrc(logoHover)}
      onMouseOut={() =>
        page !== link ? setLogoSrc(logo) : setLogoSrc(logoHover)
      }
    >
      <div>
        <img width={"20px"} height={"20px"} src={LogoSrc} alt={link} />
      </div>
      <div style={{ flex: 1, paddingTop: "5px" }}>{link}</div>
    </div>
  );
}

export default PageLink;
