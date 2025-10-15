import React, { useState } from "react";

const itensApoioLogistico = [
  "Alojamento Masculino",
  "Alojamento Feminino",
  "Módulo Sanitário",
];

function PlanejamentoMissao() {
  const [totalApoiado, setTotalApoiado] = useState("");
  const [quantidades, setQuantidades] = useState({
    "Alojamento Masculino": "",
    "Alojamento Feminino": "",
    "Módulo Sanitário": "",
  });
  const [opcoes, setOpcoes] = useState({});
  const [ativados, setAtivados] = useState({
    "Alojamento Masculino": false,
    "Alojamento Feminino": false,
    "Módulo Sanitário": false,
  });

  const handleTotalApoiadoChange = (value) => {
    const cleanValue = value.replace(/\D/g, "");
    setTotalApoiado(cleanValue);
    const half = Math.floor(cleanValue / 2);
    setQuantidades((prev) => ({
      ...prev,
      "Alojamento Masculino": half.toString(),
      "Alojamento Feminino": (cleanValue - half).toString(),
    }));
  };

  const toggleAtivado = (item) => {
    setAtivados((prev) => {
      const newVal = !prev[item];
      return { ...prev, [item]: newVal };
    });
    if (ativados[item]) {
      setQuantidades((prev) => {
        const copy = { ...prev };
        delete copy[item];
        return copy;
      });
      setOpcoes((prev) => {
        const copy = { ...prev };
        delete copy[item];
        return copy;
      });
    }
  };

  const handleQuantidadeChange = (item, value) => {
    const cleanValue = value.replace(/\D/g, "");
    setQuantidades((prev) => ({ ...prev, [item]: cleanValue }));
  };

  const handleOpcaoChange = (item, opcao) => {
    setOpcoes((prev) => ({ ...prev, [item]: opcao }));
  };

  const calcularPlanejamento = () => {
    let alaskaQtd = 0;
    let tagQtd = 0;
    const total = parseInt(totalApoiado || "0", 10);
    const moduloSanitarioQtd = ativados["Módulo Sanitário"] ? total : 0;

    Object.keys(ativados).forEach((item) => {
      if (ativados[item] && item !== "Módulo Sanitário") {
        const qtd = parseInt(quantidades[item] || "0", 10);
        if (qtd > 0) {
          if (opcoes[item] === "alaska") alaskaQtd += qtd;
          else if (opcoes[item] === "tag") tagQtd += qtd;
          else if (opcoes[item] === "mista") {
            alaskaQtd += Math.ceil(qtd / 2);
            tagQtd += Math.floor(qtd / 2);
          }
        }
      }
    });

    return {
      total,
      barracasAlaska: Math.ceil(alaskaQtd / 16),
      barracasTag: Math.ceil(tagQtd / 12),
      modulosSanitarios: Math.ceil(moduloSanitarioQtd / 80),
    };
  };

  const { total, barracasAlaska, barracasTag, modulosSanitarios } =
    calcularPlanejamento();

  return (
    <div className="container py-4" style={{ maxWidth: 700 }}>
      <h2 className="mb-4">Apoio Logístico</h2>

      {/* Total de apoiados */}
      <div className="mb-4">
        <label htmlFor="inputRangeTotal" className="form-label fw-bold">
          Total de apoiado:
        </label>
        <div className="d-flex align-items-center gap-3">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={totalApoiado}
            onChange={(e) => handleTotalApoiadoChange(e.target.value)}
            className="form-control text-center"
            style={{ width: 80 }}
            placeholder="Qtd."
          />
          <input
            id="inputRangeTotal"
            type="range"
            className="form-range flex-grow-1"
            min="0"
            max="500"
            value={total || 0}
            onChange={(e) => handleTotalApoiadoChange(e.target.value)}
          />
        </div>
      </div>

      {/* Itens de apoio logístico */}
      <div className="row g-3">
        {itensApoioLogistico.map((item) => (
          <div key={item} className="col-12">
            <div className="card p-3">
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={!!ativados[item]}
                  onChange={() => toggleAtivado(item)}
                  id={`check-${item}`}
                />
                <label className="form-check-label fw-bold" htmlFor={`check-${item}`}>
                  {item}
                </label>
              </div>

              <div className="d-flex align-items-center gap-3 flex-wrap">
                {item === "Módulo Sanitário" ? (
                  <input
                    type="text"
                    value={total}
                    disabled
                    className="form-control text-center"
                    style={{ width: 80 }}
                  />
                ) : (
                  <>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={quantidades[item] || ""}
                      onChange={(e) => handleQuantidadeChange(item, e.target.value)}
                      disabled={!ativados[item]}
                      className="form-control text-center"
                      style={{ width: 80 }}
                      placeholder="Qtd."
                    />

                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`${item}-tipo`}
                        value="alaska"
                        checked={opcoes[item] === "alaska"}
                        disabled={!ativados[item]}
                        onChange={() => handleOpcaoChange(item, "alaska")}
                        id={`${item}-alaska`}
                      />
                      <label className="form-check-label" htmlFor={`${item}-alaska`}>
                        Alaska
                      </label>
                    </div>

                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`${item}-tipo`}
                        value="tag"
                        checked={opcoes[item] === "tag"}
                        disabled={!ativados[item]}
                        onChange={() => handleOpcaoChange(item, "tag")}
                        id={`${item}-tag`}
                      />
                      <label className="form-check-label" htmlFor={`${item}-tag`}>
                        Tag
                      </label>
                    </div>

                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`${item}-tipo`}
                        value="mista"
                        checked={opcoes[item] === "mista"}
                        disabled={!ativados[item]}
                        onChange={() => handleOpcaoChange(item, "mista")}
                        id={`${item}-mista`}
                      />
                      <label className="form-check-label" htmlFor={`${item}-mista`}>
                        Mista
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resultado */}
      <div className="mt-4 p-3 border rounded bg-light">
        <p className="mb-1">
          <strong>Acampamento para "{total}" pessoas.</strong>
        </p>
        <p className="mb-0">Barracas Alaska necessárias: {barracasAlaska}</p>
        <p className="mb-0">Barracas Tag necessárias: {barracasTag}</p>
        <p className="mb-0">Módulos Sanitários necessários: {modulosSanitarios}</p>
      </div>
    </div>
  );
}

export default PlanejamentoMissao;
