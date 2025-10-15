import React, { useState, useEffect } from "react";

const materiaisFixos = [
  "BARRACAS ALASKAS",
  "BARRACAS TAGs",
  "GERADORES DE 100",
  "GERADORES DE 150",
  "GERADORES DE 300",
  "MÓDULOS SANITÁRIOS",
  "CLIMATIZADOR DE 30",
  "CLIMATIZADOR DE 60",
];

function AtualizarDados() {
  const [materialSelecionado, setMaterialSelecionado] = useState(materiaisFixos[0]);
  const [quantidades, setQuantidades] = useState({ total: "", manutencao: "", missao: "" });
  const [todosMateriais, setTodosMateriais] = useState([]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const total = Number(quantidades.total) || 0;
  const manutencao = Number(quantidades.manutencao) || 0;
  const missao = Number(quantidades.missao) || 0;

  // Calcula disponível e indisponível
  const disponivel = total - (manutencao + missao) >= 0 ? total - (manutencao + missao) : 0;
  const indisponivel = manutencao + missao;

  // Validação: total >= manutencao + missao
  useEffect(() => {
    if (total < manutencao + missao) {
      setErro("Total deve ser maior ou igual à soma de Manutenção e Missão");
    } else {
      setErro("");
    }
  }, [total, manutencao, missao]);

  // Busca os dados do material selecionado e atualiza o formulário
  function consultarDados() {
    if (!materialSelecionado) return;
    fetch(`http://localhost:3001/api/materiais?name=${encodeURIComponent(materialSelecionado)}`)
      .then((res) => res.json())
      .then((data) => {
        let item = data;
        if (Array.isArray(data)) {
          item = data.find((x) => x.name === materialSelecionado) || {};
        }
        setQuantidades({
          total: item.total?.toString() ?? "",
          manutencao: item.manutencao?.toString() ?? "",
          missao: item.missao?.toString() ?? "",
        });
      })
      .catch(() => setQuantidades({ total: "", manutencao: "", missao: "" }));
  }

  // Busca todos os materiais e atualiza a tabela
  useEffect(() => {
    fetch("http://localhost:3001/api/materiais")
      .then((res) => res.json())
      .then((data) => setTodosMateriais(data))
      .catch(() => setTodosMateriais([]));
  }, []);

  // Atualiza quantidades conforme entrada do usuário, só números
  function handleChange(e) {
    const { name, value } = e.target;
    const clean = value.replace(/^0+(?=\d)/, "").replace(/\D/g, "");
    setQuantidades((prev) => ({ ...prev, [name]: clean }));
  }

  // Salva os dados atualizados via API e atualiza view, com validação de erros
  function save() {
    if (erro) {
      setSucesso("");
      return;
    }
    if (!window.confirm(`Deseja salvar os dados atualizados para ${materialSelecionado}?`)) return;

    fetch("http://localhost:3001/api/materiais", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: materialSelecionado,
        total,
        manutencao,
        missao,
        disponivel,
        indisponivel,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro na resposta do servidor");
        return res.json();
      })
      .then(() => {
        setSucesso("✅ Dados salvos com sucesso!");
        return fetch("http://localhost:3001/api/materiais")
          .then((res) => res.json())
          .then((data) => setTodosMateriais(data));
      })
      .catch(() => {
        setErro("❌ Erro ao salvar os dados.");
        setSucesso("");
      });
  }

  return (
    <div className="container py-4" style={{ maxWidth: 700 }}>
      <h2 className="mb-4">Atualizar Dados</h2>

      <label>Selecione o material:</label>
      <div className="d-flex align-items-center mb-3">
        <select
          className="form-select me-3"
          value={materialSelecionado}
          onChange={(e) => setMaterialSelecionado(e.target.value)}
          style={{ maxWidth: 300 }}
        >
          {materiaisFixos.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button className="btn btn-outline-primary" onClick={consultarDados}>
          Consultar
        </button>
      </div>

      <div className="mb-3">
        <label className="form-label">Total:</label>
        <input
          type="text"
          className={`form-control ${erro ? "is-invalid" : ""}`}
          name="total"
          value={quantidades.total}
          onChange={handleChange}
          placeholder="Digite um número"
        />
        {erro && <div className="alert alert-danger">{erro}</div>}
        {sucesso && <div className="alert alert-success">{sucesso}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Manutenção:</label>
        <input
          type="text"
          className="form-control"
          name="manutencao"
          value={quantidades.manutencao}
          onChange={handleChange}
          placeholder="Digite um número"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Missão:</label>
        <input
          type="text"
          className="form-control"
          name="missao"
          value={quantidades.missao}
          onChange={handleChange}
          placeholder="Digite um número"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Disponível:</label>
        <input type="number" className="form-control alert alert-success" value={disponivel} readOnly />
      </div>

      <div className="mb-3">
        <label className="form-label">Indisponível:</label>
        <input type="number" className="form-control alert alert-danger" value={indisponivel} readOnly />
      </div>

      <button className="btn btn-primary" onClick={save} disabled={!!erro}>
        Salvar
      </button>

      <h3 className="mt-5">Todos os Materiais</h3>
      <table className="table table-striped">
        <thead className="table-light">
          <tr>
            <th>Material</th>
            <th>Total</th>
            <th>Disponível</th>
            <th>Indisponível</th>
            <th>Manutenção</th>
            <th>Missão</th>
          </tr>
        </thead>
        <tbody>
          {todosMateriais.map((mat) => (
            <tr key={mat.name}>
              <td>{mat.name}</td>
              <td>{mat.total}</td>
              <td>{mat.disponivel}</td>
              <td>{mat.indisponivel}</td>
              <td>{mat.manutencao}</td>
              <td>{mat.missao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AtualizarDados;
