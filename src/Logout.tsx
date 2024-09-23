import React from 'react';

function Logout() {

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/logout', {
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

  const handleMeds = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/meds', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This will include cookies to allow the server to clear them
      });

      if (response.redirected) {
        window.location.href = response.url; // Redirect to login page
      }
    } catch (err) {
      console.error('Med fetch failed:', err);
    }
  };


  const handleInserMed = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/meds', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "Tufnil",
          width: 5,
          height: 10,
          startDate: Date.now(),
          startingDose: 20,
          missed: 10,
          dosages: [2, 3]
        }),
        credentials: 'include', // This will include cookies to allow the server to clear them
      });

      if (response.redirected) {
        window.location.href = response.url; // Redirect to login page
      }
    } catch (err) {
      console.error('Insert med failed:', err);
    }
  };

  const handleDeleteMed = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/meds?name=Tufnil', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This will include cookies to allow the server to clear them
      });

      if (response.redirected) {
        window.location.href = response.url; // Redirect to login page
      }
    } catch (err) {
      console.error('Insert med failed:', err);
    }
  };

  const forgotMedHandler = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/meds/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: "nafi",
            medicine: "Tufnil",
            amount: 2,
            type: "forgot"
        }),
        credentials: 'include', // This will include cookies to allow the server to clear them
      });

      if (response.redirected) {
        window.location.href = response.url; // Redirect to login page
      }
    } catch (err) {
      console.error('Insert med failed:', err);
    }
  };

  const extraDoseHandler = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/meds/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: "nafi",
            medicine: "Tufnil",
            amount: 2,
            type: "extra"
        }),
        credentials: 'include', // This will include cookies to allow the server to clear them
      });

      if (response.redirected) {
        window.location.href = response.url; // Redirect to login page
      }
    } catch (err) {
      console.error('Insert med failed:', err);
    }
  };
  return (
    <div>
      <h1>Hello User</h1>
      <button onClick={handleMeds}>Get all meds</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleInserMed}>Insert new meds</button>
      <button onClick={handleDeleteMed}>Delete med</button>
      <button onClick={forgotMedHandler}>Forgot Med</button>
      <button onClick={extraDoseHandler}>Took extra</button>

    </div>
  );
}

export default Logout;