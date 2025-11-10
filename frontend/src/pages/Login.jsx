import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      

      localStorage.setItem('token', response.data.token);
      
     
      navigate('/dashboard');

    } catch (err) {
      if (err.response && err.response.data) {
        const message = err.response.data.errors 
          ? err.response.data.errors[0].msg 
          : err.response.data.message;
        setError(message);
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }
    }
  };

  return (
  <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              className="form-control" // <-- 3. APLIQUE AS CLASSES
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <input
              id="password"
              type="password"
              className="form-control" // <-- 3. APLIQUE AS CLASSES
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          
          <button type="submit" className="btn-submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;