

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a la base de datos SQLite
const dbPath = path.resolve(__dirname, '../clientes.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite');
    }
});

// Obtener todos los clientes
app.get('/clientes', (req, res) => {
    db.all('SELECT * FROM clientes', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Agregar un nuevo cliente
app.post('/clientes', (req, res) => {
    const { nombre, correo, saldo } = req.body;
    db.run('INSERT INTO clientes (nombre, correo, saldo) VALUES (?, ?, ?)', [nombre, correo, saldo], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, nombre, correo, saldo });
    });
});

// Eliminar cliente por id
app.delete('/clientes/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM clientes WHERE id = ?', id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ deletedID: id });
    });
});

// Actualizar cliente por id
app.put('/clientes/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, correo, saldo } = req.body;
    db.run(
        'UPDATE clientes SET nombre = ?, correo = ?, saldo = ? WHERE id = ?',
        [nombre, correo, saldo, id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id, nombre, correo, saldo });
        }
    );
});


// Ruta base para verificar si el backend funciona
app.get('/', (req, res) => {
  res.send('API funcionando. Usa /clientes para interactuar.');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});

