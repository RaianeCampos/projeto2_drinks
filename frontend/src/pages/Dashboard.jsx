import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate(); 

 
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
 
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');


  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
  };

  
  const handleInsert = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await api.post('/drinks', { 
        nome: name, 
        ingredientes: ingredients, 
        receita: instructions,
        imagem: imageUrl
      });
      setMessage(`Drink "${name}" inserido com sucesso!`);
     
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
      const response = await api.get('/drinks', { params: { termo: searchTerm } });
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
    <div className="dashboard-container">
      
      
      <button onClick={handleLogout} className="btn-logout">
        Sair
      </button>

     
      <h1 className="dashboard-header">Painel de Drinks</h1>
      {message && <p className="message">{message}</p>}

      <div className="dashboard-sections">

        
        <div className="section">
          <h2>Inserir Novo Drink</h2>
          <form onSubmit={handleInsert}>
            
            <div className="form-group">
              <label htmlFor="name">Nome:</label>
              <input id="name" type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="ingredients">Ingredientes:</label>
              <textarea id="ingredients" className="form-control" value={ingredients} onChange={e => setIngredients(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="instructions">Instruções:</label>
              <textarea id="instructions" className="form-control" value={instructions} onChange={e => setInstructions(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">URL da Imagem:</label>
              <input id="imageUrl" type="text" className="form-control" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            </div>
            <button type="submit" className="btn-submit">Inserir Drink</button>
          </form>
        </div>

        
        <div className="section">
          <h2>Buscar Drinks</h2>
          <form onSubmit={handleSearch}>
            
            <div className="form-group">
              <label htmlFor="search">Buscar por nome:</label>
              <input 
                id="search"
                type="text" 
                className="form-control"
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                placeholder="Ex: Margarita"
                required
              />
            </div>
            <button type="submit" className="btn-submit">Buscar</button>
          </form>

         
          <div className="search-results">
            {searchResults.map(drink => (
              <Link to={`/drink/${drink.id}`} key={drink.id} className="drink-card-link">
                <div className="drink-card">
                  {drink.image_url && <img src={drink.image_url} alt={drink.name} />}
                  <div className="drink-info">
                    <h4>{drink.name}</h4>
                    <p><strong>Ingredientes:</strong> {drink.ingredients}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    
    </div>
  );
}

export default Dashboard;