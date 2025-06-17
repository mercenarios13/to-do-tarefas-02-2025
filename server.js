const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DB_FILE = './db.json';

app.use(cors());
app.use(bodyParser.json());

// Função para ler e salvar o "banco"
function readDB() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ usuarios: [], tarefas: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_FILE));
}
function writeDB(db) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Rotas Usuários
app.get('/usuarios', (req, res) => {
    const db = readDB();
    res.json(db.usuarios);
});
app.post('/usuarios', (req, res) => {
    const db = readDB();
    const { nome, email } = req.body;
    if (!nome || !email) return res.status(400).json({ erro: 'Campos obrigatórios.' });
    const id = Date.now();
    db.usuarios.push({ id, nome, email });
    writeDB(db);
    res.json({ mensagem: 'Usuário cadastrado com sucesso.' });
});

// Rotas Tarefas
app.get('/tarefas', (req, res) => {
    const db = readDB();
    res.json(db.tarefas);
});
app.post('/tarefas', (req, res) => {
    const db = readDB();
    const { usuarioId, descricao, setor, prioridade } = req.body;
    if (!usuarioId || !descricao || !setor || !prioridade) return res.status(400).json({ erro: 'Campos obrigatórios.' });
    const id = Date.now();
    const dataCadastro = new Date().toISOString().split('T')[0];
    db.tarefas.push({ id, usuarioId, descricao, setor, prioridade, dataCadastro, status: 'a fazer' });
    writeDB(db);
    res.json({ mensagem: 'Tarefa cadastrada com sucesso.' });
});
app.put('/tarefas/:id', (req, res) => {
    const db = readDB();
    const id = Number(req.params.id);
    const tarefa = db.tarefas.find(t => t.id === id);
    if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    Object.assign(tarefa, req.body);
    writeDB(db);
    res.json({ mensagem: 'Tarefa atualizada com sucesso.' });
});
app.delete('/tarefas/:id', (req, res) => {
    const db = readDB();
    const id = Number(req.params.id);
    db.tarefas = db.tarefas.filter(t => t.id !== id);
    writeDB(db);
    res.json({ mensagem: 'Tarefa excluída com sucesso.' });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
