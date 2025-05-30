import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [saldo, setSaldo] = useState('');
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/clientes')
      .then(res => res.json())
      .then(data => setClientes(data));
  }, []);

  const agregarCliente = () => {
    const metodo = editando ? 'PUT' : 'POST';
    const url = editando ? `http://localhost:3001/clientes/${editando}` : 'http://localhost:3001/clientes';

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, saldo })
    })
    .then(() => {
      setNombre('');
      setCorreo('');
      setSaldo('');
      setEditando(null);
      return fetch('http://localhost:3001/clientes');
    })
    .then(res => res.json())
    .then(data => setClientes(data));
  };

  const eliminarCliente = (id) => {
    fetch(`http://localhost:3001/clientes/${id}`, { method: 'DELETE' })
      .then(() => fetch('http://localhost:3001/clientes'))
      .then(res => res.json())
      .then(data => setClientes(data));
  };

  const editarCliente = (cliente) => {
    setEditando(cliente.id);
    setNombre(cliente.nombre);
    setCorreo(cliente.correo);
    setSaldo(cliente.saldo);
  };

  return (
    <div className="container">
      <h1>Lista de Clientes</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Saldo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.id}>
              <td>{cliente.nombre}</td>
              <td>{cliente.correo}</td>
              <td>{cliente.saldo ?? 'N/A'}</td>
              <td>
                <button className="editar" onClick={() => editarCliente(cliente)}>Editar</button>
                <button className="eliminar" onClick={() => eliminarCliente(cliente.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{editando ? 'Editar Cliente' : 'Agregar Cliente'}</h2>
      <div className="formulario">
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" />
        <input value={correo} onChange={e => setCorreo(e.target.value)} placeholder="Correo" />
        <input value={saldo} onChange={e => setSaldo(e.target.value)} placeholder="Saldo" type="number" />
        <button onClick={agregarCliente}>{editando ? 'Actualizar' : 'Crear'}</button>
      </div>
    </div>
  );
}

export default App;
