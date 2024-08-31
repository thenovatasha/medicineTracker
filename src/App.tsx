import React, { ChangeEvent } from "react";
import { useState } from "react";

const App = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, password: password }),
    });
    console.log("Click Click");
  }
  async function onNameChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }
  async function onPasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }
  return (
    <form>
      <label htmlFor="search">
        <input onChange={onNameChange} type="text" name="search" id="search" />
      </label>
      <label htmlFor="pass">
        <input onChange={onPasswordChange} type="text" name="pass" id="pass" />
      </label>
      <button onClick={onSearch} type="button">
        Search
      </button>
    </form>
  );
};

export default App;
