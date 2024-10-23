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
            req.session.usuarioId = results[0].id;
            const usuarioId = req.session.usuarioId;
            console.log('Usuário ID:', usuarioId);
            res.redirect('/home');
        } else {
            res.status(401).send('Usuário ou senha inválidos.');
        }
    });
});

router.post('/cadastro', (req, res) => {
    const { username, password, name, email } = req.body;

    console.log('Dados recebidos:', { username, password, name, email }); // Para depuração

    pool.query('SELECT * FROM usuarios_table WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Erro ao verificar usuário: ', err);
            return res.status(500).send('Erro ao verificar usuário.');
        }

        if (results.length > 0) {
            return res.status(400).send('Usuário já cadastrado.');
        }

        pool.query('INSERT INTO usuarios_table (name, email, username, password) VALUES (?, ?, ?, ?)', [name, email, username, password], (err, result) => {
            if (err) {
                console.error('Erro ao tentar registrar: ', err);
                return res.status(500).send('Erro ao registrar usuário.');
            }

            const usuarioId = result.insertId;

            pool.query('INSERT INTO perfil (usuarioId, name, email) VALUES (?, ?, ?)', [usuarioId, name, email], (err) => {
                if (err) {
                    console.error('Erro ao criar perfil: ', err);
                    return res.status(500).send('Erro ao criar perfil do usuário.');
                }

                res.redirect('/login');
            });
        });
    });
});


router.post('/perfil', (req, res) => {
    const usuarioId = req.session.usuarioId;
    const { name, idade, email, telefone, rua, numero, cidade, estado, cep, bio } = req.body;

    if (!usuarioId) {
        return res.redirect('/login');
    }

    pool.query('SELECT * FROM perfil WHERE usuarioId = ?', [usuarioId], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao verificar perfil.');
        }

        if (results.length > 0) {
            pool.query(
                'UPDATE perfil SET name = ?, idade = ?, email = ?, telefone = ?, rua = ?, numero = ?, cidade = ?, estado = ?, cep = ?, bio = ? WHERE usuarioId = ?',
                [name, idade, email, telefone, rua, numero, cidade, estado, cep, bio, usuarioId],
                (err) => {
                    if (err) {
                        return res.status(500).send('Erro ao atualizar perfil.');
                    }
                    res.redirect('/auth/perfil');
                }
            );
        } else {
            pool.query(
                'INSERT INTO perfil (usuarioId, name, idade, email, telefone, rua, numero, cidade, estado, cep, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [usuarioId, name, idade, email, telefone, rua, numero, cidade, estado, cep, bio],
                (err) => {
                    if (err) {
                        return res.status(500).send('Erro ao cadastrar perfil.');
                    }
                    res.redirect('/auth/perfil');
                }
            );
        }
    });
});

router.get('/perfil', (req, res) => {
    const usuarioId = req.session.usuarioId;
    console.log('Usuário ID:', usuarioId);

    if (!usuarioId) {
        return res.redirect('/login');
    }

    pool.query('SELECT * FROM perfil WHERE usuarioId = ?', [usuarioId], (err, results) => {
        console.log('Resultados da consulta de perfil:', results); 
        if (err) {
            return res.status(500).send('Erro ao buscar perfil.');
        }

        if (results.length > 0) {
            const perfil = results[0];
            console.log('Perfil recebido:', perfil);
            res.render('perfil', { perfil });
        } else {
            res.status(404).send('Perfil não encontrado.');
        }
    });
});

router.get('/dashboard', (req, res) => {
    const usuarioId = req.session.usuarioId;

    if (!usuarioId) {
        return res.redirect('/login');
    }

    pool.query('SELECT * FROM perfil WHERE usuarioId = ?', [usuarioId], (err, perfilResults) => {
        if (err) {
            return res.status(500).send('Erro ao buscar perfil.');
        }

        if (perfilResults.length > 0) {
            const perfil = perfilResults[0];

            pool.query('SELECT * FROM usuarios_table WHERE id = ?', [usuarioId], (err, usuarioResults) => {
                if (err) {
                    return res.status(500).send('Erro ao buscar usuário.');
                }

                if (usuarioResults.length > 0) {
                    const usuario = usuarioResults[0];
                    res.render('dashboard', { usuario, perfil });
                } else {
                    res.status(404).send('Usuário não encontrado.');
                }
            });
        } else {
            res.status(404).send('Perfil não encontrado.');
        }
    });
});

router.get('/logout', (req, res) => {
    const usuarioId = req.session.usuarioId;
    console.log('Usuário ID deslogando:', usuarioId);
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Erro ao sair.');
        }
        res.redirect('/login');
    });
});



module.exports = router;