const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const authRoutes = require('./public/js/auth');
const dbConnection = require('./database/mysql_database');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Adquirindo informação do banco de dados
app.get('/usuarios', (req, res) => {
    dbConnection.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            console.error('Erro ao executar consulta: ', err);
            return res.status(500).send('Erro ao consultar usuários');
        }
        res.json(results); // Retornando os resultados como JSON
    });
});

// Rota inicial para a pagina login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});

// Rota para outras páginas
app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, 'public', 'html', `${page}.html`));
});

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});