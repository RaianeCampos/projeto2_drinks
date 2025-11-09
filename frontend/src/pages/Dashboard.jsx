import React, { useState } from 'react';
import api from '../services/api';

function Dashboard() {

  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
 
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');

  const handleInsert = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await api.post('/drinks/insert', { name, ingredients, instructions, imageUrl });
      setMessage(Drink "${response.data.name}" inserido com sucesso!);
      setName('');
      setIngredients('');
      setInstructions('');
      setImageUrl('');
    } catch (err) {
      setMessage('Erro ao inserir drink.');
      console.error(err);
    }
  };


  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
    
      const response = await api.get('/drinks/search', { params: { name: searchTerm } });
      setSearchResults(response.data);
      if (response.data.length === 0) {
        setMessage('Nenhum resultado encontrado.');
      }
    } catch (err) {
      setMessage('Erro ao buscar.');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Painel de Drinks</h1>
      {message && <p>{message}</p>}

      <hr />

      {/* Formulário de Inserção */}
      <h2>Inserir Novo Drink</h2>
      <form onSubmit={handleInsert}>
        <div><label>Nome:</label> <input type="text" value={name} onChange={e => setName(e.target.value)} required /></div>
        <div><label>Ingredientes:</label> <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} required /></div>
        <div><label>Instruções:</label> <textarea value={instructions} onChange={e => setInstructions(e.target.value)} required /></div>
        <div><label>URL da Imagem:</label> <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} /></div>
        <button type="submit">Inserir Drink</button>
      </form>

      <hr />

      {/* Formulário de Busca */}
      <h2>Buscar Drinks</h2>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          placeholder="Buscar por nome..."
          required
        />
        <button type="submit">Buscar</button>
      </form>

      {/* Resultados da Busca */}
      <div>
        {searchResults.map(drink => (
          <div key={drink.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h4>{drink.name}</h4>
            <p><strong>Ingredientes:</strong> {drink.ingredients}</p>
            {drink.image_url && <img src={drink.image_url} alt={drink.name} width="100" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;