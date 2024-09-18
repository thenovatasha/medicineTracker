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
import { useState } from "react";
const App = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    function onSearch(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: name, password: password }),
            });
            console.log("Click Click");
        });
    }
    function onNameChange(e) {
        return __awaiter(this, void 0, void 0, function* () {
            setName(e.target.value);
        });
    }
    function onPasswordChange(e) {
        return __awaiter(this, void 0, void 0, function* () {
            setPassword(e.target.value);
        });
    }
    return (_jsxs("form", { children: [_jsx("label", { htmlFor: "search", children: _jsx("input", { onChange: onNameChange, type: "text", name: "search", id: "search" }) }), _jsx("label", { htmlFor: "pass", children: _jsx("input", { onChange: onPasswordChange, type: "text", name: "pass", id: "pass" }) }), _jsx("button", { onClick: onSearch, type: "button", children: "Search" })] }));
};
export default App;
