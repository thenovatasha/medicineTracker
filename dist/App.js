var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const App = () => {
    function onSearch() {
        return __awaiter(this, void 0, void 0, function* () {
            fetch("http://localhost:3000/newUser", {
                method: "POST",
                body: JSON.stringify({ name: "Nafisa", password: "HAHA" }),
            })
                .then((response) => response.text())
                .then((data) => console.log(data));
            console.log("Click Click");
        });
    }
    return (_jsxs("div", { children: [_jsx("label", { htmlFor: "search", children: _jsx("input", { type: "text", name: "search", id: "search" }) }), _jsx("button", { onClick: onSearch, type: "button", children: "Search" })] }));
};
export default App;
