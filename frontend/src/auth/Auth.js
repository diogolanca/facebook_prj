import React, { useState } from 'react';
import './Auth.css'; // Estilos para o formulário
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Auth() {
  const [isLogin, setIsLogin] = useState(true); // Alternar entre login e registro
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await axios.post('http://127.0.0.1:8000/sign-in/', {
          email: formData.email,
          password: formData.password,
        });
        navigate('/feed'); // Redirecionar após login
      } else {
        const response = await axios.post('http://127.0.0.1:8000/sign-up/', {
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email,
          password1: formData.password,
          password2: formData.confirm_password,
        });
        navigate('/feed'); // Redirecionar após registro
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
      setSuccess('');
    }
  };


  return (
    <div className="auth-container">
      <div className="tabs">
        <button onClick={() => setIsLogin(true)} className={isLogin ? 'active' : ''}>
          Login
        </button>
        <button onClick={() => setIsLogin(false)} className={!isLogin ? 'active' : ''}>
          Sign Up
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {!isLogin && (
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
        )}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}

export default Auth;
