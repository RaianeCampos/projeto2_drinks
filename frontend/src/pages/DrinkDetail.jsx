import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './DrinkDetail.css'; 

function DrinkDetail() {
  const [drink, setDrink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams(); 

  useEffect(() => {
   
    const fetchDrink = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get(/drinks/${id});
        setDrink(response.data);
      } catch (err) {
        console.error('Erro ao buscar drink:', err);
        setError('Drink não encontrado ou erro no servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrink();
  }, [id]); 

  if (loading) {
    return <div className="detail-container"><p>Carregando...</p></div>;
  }

  if (error) {
    return <div className="detail-container"><p className="error-message">{error}</p></div>;
  }

  if (!drink) {
    return null; 
  }

  return (
    <div className="detail-container">
      <div className="detail-box">
        
        {/* Botão para voltar */}
        <Link to="/dashboard" className="btn-back">
          &larr; Voltar ao Painel
        </Link>

        <h1 className="detail-title">{drink.name}</h1>
        
        {drink.image_url && (
          <img src={drink.image_url} alt={drink.name} className="detail-image" />
        )}

        <div className="detail-section">
          <h2>Ingredientes</h2>
          {/* A tag <p> com white-space: pre-wrap preserva quebras de linha */}
          <p>{drink.ingredients}</p>
        </div>

        <div className="detail-section">
          <h2>Modo de Preparo (Instruções)</h2>
          <p>{drink.instructions}</p>
        </div>

      </div>
    </div>
  );
}

export default DrinkDetail;