const App = () => {
    function onSearch() {
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
