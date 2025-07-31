// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Home Page</h1>
      <button onClick={() => navigate('/form')} style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
        Go to Task Form
      </button>
    </div>
  );
};

export default HomePage;
