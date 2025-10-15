const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = 3001;

// Cria servidor HTTP para Socket.IO
const server = http.createServer(app);

// Configura Socket.IO para permitir conexões do React na porta 3001
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(bodyParser.json());

// Caminho absoluto para o banco de dados SQLite
const dbPath = path.resolve(__dirname, "database.db");

// Abre conexão SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Erro ao conectar SQLite:", err.message);
  else console.log("Conectado ao banco SQLite.");
});

// Cria tabela materiais se ela não existir já
db.run(`
  CREATE TABLE IF NOT EXISTS materiais (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    total INTEGER,
    disponivel INTEGER,
    indisponivel INTEGER,
    manutencao INTEGER,
    missao INTEGER,
    updatedAt TEXT
  )
`);

// Rota GET para obter materiais, suporta query name para filtro
app.get("/api/materiais", (req, res) => {
  const name = req.query.name;
  if (name) {
    db.get("SELECT * FROM materiais WHERE name = ?", [name], (err, row) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(row || {});
    });
  } else {
    db.all("SELECT * FROM materiais", [], (err, rows) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(rows);
    });
  }
});

// Rota POST para inserção/atualização de material no banco
app.post("/api/materiais", (req, res) => {
  // Extrai dados do corpo da requisição
  const { name, total, disponivel, indisponivel, manutencao, missao } = req.body;
  const updatedAt = new Date().toISOString();

  // Comando SQL para inserir ou atualizar dependendo da existência do registro
  const sql = `
    INSERT INTO materiais (name, total, disponivel, indisponivel, manutencao, missao, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(name) DO UPDATE SET
      total=excluded.total,
      disponivel=excluded.disponivel,
      indisponivel=excluded.indisponivel,
      manutencao=excluded.manutencao,
      missao=excluded.missao,
      updatedAt=excluded.updatedAt
  `;

  db.run(
    sql,
    [name, total, disponivel, indisponivel, manutencao, missao, updatedAt],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ id: this.lastID, message: "Material salvo com sucesso", updatedAt });

      // Emite evento para todos os sockets conectados para atualização em tempo real
      io.emit("atualizacao", updatedAt);
    }
  );
});

// Inicia servidor na porta definida
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Logs de conexão Socket.IO
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    // Cliente desconectado pode ser gerenciado aqui se necessário
  });
});
