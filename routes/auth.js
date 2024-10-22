const express = require('express');
const router = express.Router();
const pool = require('../database/mysql_database');

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    pool.query('SELECT * FROM usuarios_table WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Erro ao executar consulta: ', err);
            return res.status(500).send('Erro ao autenticar usuário.');
        }
        if (results.length > 0) {
            res.redirect('/home');
        } else {
            res.status(401).send('Usuário ou senha inválidos.');
        }
    });
});

router.post('/cadastro', (req, res) => {
    const { username, password } = req.body;

    pool.query('SELECT * FROM usuarios_table WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Erro ao verificar usuário: ', err);
            return res.status(500).send('Erro ao verificar usuário.');
        }

        if (results.length > 0) {
            return res.status(400).send('Usuário já cadastrado.');
        }

        pool.query('INSERT INTO usuarios_table (username, password) VALUES (?, ?)', [username, password], (err) => {
            if (err) {
                console.error('Erro ao tentar registrar: ', err);
                return res.status(500).send('Erro ao registrar usuário.');
            }

            res.redirect('/login'); // Redireciona após o cadastro
        });
    });
});

module.exports = router;