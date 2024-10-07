const express = require('express');
const router = express.Router();

// Simulação de usuários
const users = [
    { username: 'usuario1', password: 'senha1' },
    { username: 'usuario2', password: 'senha2' },
];

// Rota de login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.redirect('/home');
    } else {
        res.status(401).send('Usuário ou senha inválidos.');
    }
});

module.exports = router;