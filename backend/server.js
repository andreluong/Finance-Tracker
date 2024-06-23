const app = require("./app");

const PORT = process.env.SERVER_PORT || 8080;

app.listen(PORT, () => {
    console.log("Server is running successfully on port " + PORT);
});
