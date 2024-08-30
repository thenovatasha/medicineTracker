import React from "react";

const App = () => {
    async function onSearch(e: React.FormEvent) {
        e.preventDefault();
        fetch("http://localhost:3000/newUser", {
            method: "POST",
            body: JSON.stringify({ name: "Nafisa", password: "HAHA" }),
        })
            .then((response) => response.text())
            .then((data) => console.log(data));
        console.log("Click Click");
    }
    return (
        <form onSubmit={onSearch}>
            <label htmlFor="search">
                <input type="text" name="search" id="search" />
            </label>

            <label htmlFor="pass">
                <input type="text" name="pass" id="pass" />
            </label>
            <button type="submit">Search</button>
        </form>
    );
};

export default App;
