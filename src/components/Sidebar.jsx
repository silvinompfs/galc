import React from "react";
import { Link, useLocation } from "react-router-dom";
import galcImg from "../assets/img/galc.png";

const menuItems = [
  { name: "Início", path: "/" },
  { name: "Materiais", path: "/materiais" },
  { name: "Atualizar dados", path: "/atualizar-dados" },
  { name: "Planejamento de Missão", path: "/planejamento-missao" },
  { name: "Relatórios", path: "/relatorios" },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside
      className="sidebar d-flex flex-column bg-dark text-white vh-100 p-3"
      style={{ width: "240px" }}
    >
      <div className="d-flex align-items-center mb-4">
        <img
          src={galcImg}
          alt="Logo GALC"
          className="me-2"
          style={{ width: 48, height: 48 }}
        />
        <span className="fs-5 fw-bold">GALC</span>
      </div>
      <ul className="nav nav-pills flex-column">
        {menuItems.map((item) => (
          <li key={item.name} className="nav-item mb-2">
            <Link
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? "active" : "text-white"
                }`}
              style={{
                borderRadius: "8px",
                transition: "all 0.2s ease-in-out",
              }}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
