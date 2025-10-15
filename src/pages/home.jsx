import React from "react";
import galcImg from "../assets/img/galc.png";

function Home() {
  return (
    <div className="home-main">
      <h1 className="home-title">Operações GALC</h1>
      <img src={galcImg} alt="GALC" className="home-image" />
    </div>
  );
}

export default Home;
