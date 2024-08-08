const App = () => {
    async function onSearch() {
        fetch("http://localhost:3000")
            .then((response) => response.text())
            .then((data) => console.log(data));
        console.log("Click Click");
    }
    return (
        <div>
            <label htmlFor="search">
                <input type="text" name="search" id="search" />
            </label>
            <button onClick={onSearch} type="button">
                Search
            </button>
        </div>
    );
};

export default App;
