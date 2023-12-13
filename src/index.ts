const {app} = require("./router/app");
const PORT = 1111;

app.listen(PORT, () => {
    console.log(`service learnning redis node listen to port ${PORT}, http://localhost:${PORT}/api/debug`);
})


