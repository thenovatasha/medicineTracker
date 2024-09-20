// src/Login.js
import React, { FormEvent, useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    // Create the payload for the login request
    const loginPayload = {
      username,
      password,
    };

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginPayload),
        credentials: 'include', // Allows cookies to be included
      });

      const data = await response.json();

      if (data.cookiesSet) {
        setSuccess('Login successful');
        setError('');
      } else {
        setError('Login failed');
        setSuccess('');
      }
    } catch (err) {
      setError('Login failed');
      setSuccess('');
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;