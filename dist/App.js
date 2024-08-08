import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const App = () => {
    function onSearch() {
        console.log("Click Click");
    }
    return (_jsxs("div", { children: [_jsx("label", { htmlFor: "search", children: _jsx("input", { type: "text", name: "search", id: "search" }) }), _jsx("button", { onClick: onSearch, type: "button", children: "Search" })] }));
};
export default App;
