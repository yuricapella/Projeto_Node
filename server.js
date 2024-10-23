const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'sua_chave_secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function verificarAutenticacao(req, res, next) {
    const publicRoutes = ['/login', '/cadastro'];
    if (publicRoutes.includes(req.path) || req.session.usuarioId) {
        return next();
    }
    res.redirect('/login');
}

app.get('/', (req, res) => {
    if (req.session.usuarioId) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

app.get('/home', verificarAutenticacao, (req, res) => {
    res.render('home');
});

app.get('/perfil', verificarAutenticacao, (req, res) => {
    res.render('perfil');
});

app.get('/dashboard', verificarAutenticacao, (req, res) => {
    res.render('dashboard');
});

app.use('/auth', authRoutes);

app.use((req, res) => {
    res.status(404).render('404');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
