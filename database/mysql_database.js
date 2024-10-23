const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'usuarios', // Nome do banco de dados
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL: ', err);
        return;
    }
    console.log('Conexão com MySQL bem-sucedida!');

    const createUsuarioTableQuery = `
        CREATE TABLE IF NOT EXISTS usuarios_table (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
    `;

    const createPerfilTableQuery = `
        CREATE TABLE IF NOT EXISTS perfil (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuarioId INT,
            name VARCHAR(255),
            idade INT,
            telefone VARCHAR(15),
            rua VARCHAR(255),
            numero INT,
            cidade VARCHAR(255),
            estado VARCHAR(255),
            cep VARCHAR(10),
            bio TEXT,
            email VARCHAR(255),
            FOREIGN KEY (usuarioId) REFERENCES usuarios_table(id)
        )
    `;

    connection.query(createUsuarioTableQuery, (err) => {
        if (err) {
            console.error('Erro ao criar tabela usuarios_table: ', err);
        } else {
            console.log('Tabela usuarios_table criada ou já existe.');
        }
    });

    connection.query(createPerfilTableQuery, (err) => {
        if (err) {
            console.error('Erro ao criar tabela perfil: ', err);
        } else {
            console.log('Tabela perfil criada ou já existe.');
        }
        connection.release();
    });
});

module.exports = pool;
