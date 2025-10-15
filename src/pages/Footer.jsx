import React from "react";

function Footer() {
  return (
    <footer style={{
      backgroundColor: "#223140",
      padding: "10px 20px",
      textAlign: "center",
      borderTop: "1px solid #e7e7e7",
      position: "fixed",
      bottom: 0,
      width: "100%",
      fontSize: 14,
      color: "#e7e7e7"
    }}>
      &copy; {new Date().getFullYear()} ® Desenvolvido por Marcos Silvino
    </footer>
  );
}

export default Footer;
