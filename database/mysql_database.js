const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',    // Endereço do servidor MySQL
    user: 'seu_usuario',  // Usuário do MySQL
    password: 'sua_senha',// Senha do MySQL
    database: 'nome_do_banco' // Nome do banco de dados
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL: ', err);
        return;
    }
    console.log('Conexão com MySQL bem-sucedida!');
});