const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

// Run Test
app.get("/", (req, res) => {
  res.send(
    `<h1  style="text-align: center; margin-top:100px;  font-weight: 900; color: blue">Welcome To Linux Pc Builder Server</h1>`
  );
});
// Port Run
app.listen(port, () => console.log("Server Running At Port", port));
