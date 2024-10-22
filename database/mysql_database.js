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

// Testa a conexão inicial com o pool
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL: ', err);
        return;
    }
    console.log('Conexão com MySQL bem-sucedida!');

    // Executando o SELECT
    connection.query('SELECT * FROM usuarios_table', (err, results) => {
        connection.release(); // Libera a conexão de volta ao pool
        if (err) {
            console.error('Erro ao executar consulta: ', err);
            return;
        }
        console.log('Resultados: ', results); // Aqui você verá os resultados
    });
});

// Exporta o pool para ser usado em outras partes da aplicação
module.exports = pool;
