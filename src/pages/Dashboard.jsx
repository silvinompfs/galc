import React, { useEffect, useState } from "react";
import MaterialCard from "../components/MaterialCard";
import { io } from "socket.io-client";

import alaskaImg from "../assets/img/alaska.png";
import tagImg from "../assets/img/tag.png";
import electricGeneratorImg from "../assets/img/electric-generator.png";
import toiletImg from "../assets/img/toilet.png";
import airConditioningImg from "../assets/img/air-conditioning.png";

const materiais = [
  "BARRACAS ALASKAS",
  "BARRACAS TAGs",
  "GERADORES DE 100",
  "GERADORES DE 150",
  "GERADORES DE 300",
  "MÓDULOS SANITÁRIOS",
  "CLIMATIZADOR DE 30",
  "CLIMATIZADOR DE 60",
];

const imagensPorMaterial = {
  "BARRACAS ALASKAS": alaskaImg,
  "BARRACAS TAGs": tagImg,
  "GERADORES DE 100": electricGeneratorImg,
  "GERADORES DE 150": electricGeneratorImg,
  "GERADORES DE 300": electricGeneratorImg,
  "MÓDULOS SANITÁRIOS": toiletImg,
  "CLIMATIZADOR DE 30": airConditioningImg,
  "CLIMATIZADOR DE 60": airConditioningImg,
};

function Dashboard() {
  const [materiaisData, setMateriaisData] = useState({});
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    // Recebe evento de atualização e atualiza a lista e timestamp
    socket.on("atualizacao", (updatedAt) => {
      setUltimaAtualizacao(new Date(updatedAt).toLocaleString("pt-BR"));
      fetchMateriais(); // Atualiza lista de materiais
    });

    const fetchMateriais = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/materiais");
        const data = await res.json();
        const dataMap = {};
        let lastUpdateDate = null;

        data.forEach((item) => {
          dataMap[item.name] = item;
          if (item.updatedAt) {
            const itemDate = new Date(item.updatedAt);
            if (!lastUpdateDate || itemDate > lastUpdateDate) lastUpdateDate = itemDate;
          }
        });

        setMateriaisData(dataMap);
        if (lastUpdateDate && !ultimaAtualizacao) {
          setUltimaAtualizacao(lastUpdateDate.toLocaleString("pt-BR"));
        }
      } catch (err) {
        // Aqui pode-se adicionar tratamento de erro mais detalhado
      }
    };

    fetchMateriais();

    return () => socket.disconnect();
  }, []);

  return (
    <div className="container py-4" style={{ margin: 24 }}>
      <h1>Dashboard</h1>

      <p className="text-muted">
        Última atualização: {ultimaAtualizacao || "Ainda não houve atualização"}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {materiais.map((nome) => {
          const mat = materiaisData[nome] || {};
          return (
            <MaterialCard
              key={nome}
              name={nome}
              total={mat.total || 0}
              disponivel={mat.disponivel || 0}
              indisponivel={mat.indisponivel || 0}
              manutencao={mat.manutencao || 0}
              missao={mat.missao || 0}
              imgSrc={imagensPorMaterial[nome]}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
