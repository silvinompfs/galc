import React, { useEffect, useState } from "react";
import tempImg from "../assets/img/pagina_em_construcao.png";

function Relatorio() {
  return (
    <div>
      <h1>Relatório de Vendas</h1>
      
      {/* Exibindo a imagem importada */}
      <img src={tempImg} alt="Descrição da imagem" />
      
      <p>Este é o conteúdo do relatório.</p>
    </div>
  );
}

export default Relatorio;