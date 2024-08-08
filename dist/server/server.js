import express from "express";
const app = express();
const PORT = 3000;
app.get("/", (req, res) => {
    res.send("Express + TS Server");
});
app.listen(PORT);
console.log(`server started at http://localhost:${PORT}`);
