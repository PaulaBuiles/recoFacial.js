// db.js
const mysql = require('mysql2');

// Crear la conexión con la base de datos
const connection = mysql.createConnection({
    host: 'sgsst.co', // Cambia a la dirección de tu servidor de MySQL
    user: 'desarrollo', // Cambia por tu usuario de MySQL
    password: 'answer%2050', // Cambia por tu contraseña de MySQL
    database: 'desarrollo' // Cambia por el nombre de tu base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conectado a la base de datos MySQL con el ID', connection.threadId);
});

module.exports = connection;
