import React, { useState } from 'react';
import Login from './Login';
import Logout from './Logout';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login />
      ) : (
        <Logout />
      )}
      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? 'Go to Login' : 'Go to Logout'}
      </button>
    </div>
  );
}

export default App;