const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

// Cria o servidor Express
const app = express();
app.use(express.json()); // Permite receber dados em JSON
app.use(cors()); // Habilita CORS para comunicação com o frontend

// Configuração do MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Substitua pelo seu usuário do MySQL
  password: "P@t010803", // Substitua pela sua senha
  database: "faturamento_lojas", // Nome do banco de dados
});

// Conexão ao banco de dados
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao MySQL!");
});

// Rota de teste
app.get("/", (req, res) => {
  res.send("Servidor está funcionando!");
});

// Iniciar servidor
const PORT = 3000; // Porta para rodar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota para adicionar um faturamento
app.post("/faturamento", (req, res) => {
    const { loja, data, valor } = req.body;
  
    const sql = "INSERT INTO faturamento (loja, data, valor) VALUES (?, ?, ?)";
    db.query(sql, [loja, data, valor], (err, result) => {
      if (err) {
        console.error("Erro ao adicionar faturamento:", err);
        return res.status(500).send("Erro ao adicionar faturamento.");
      }
      res.status(200).send("Faturamento registrado com sucesso!");
    });
  });

  // Rota para listar os faturamentos
app.get("/faturamento", (req, res) => {
    const sql = "SELECT * FROM faturamento";
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Erro ao buscar faturamentos:", err);
        return res.status(500).send("Erro ao buscar faturamentos.");
      }
      res.json(results);
    });
  });