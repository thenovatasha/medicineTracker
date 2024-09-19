import React from 'react';

function Logout() {
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This will include cookies to allow the server to clear them
      });

      if (response.redirected) {
        window.location.href = response.url; // Redirect to login page
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div>
      <h1>Logout</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;