const express = require("express");
const socket = require("socket.io");

// App setup
const PORT = 2021;
let activeUsers = new Set();
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});

//set the template engine to ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))

// Socket setup
const io = socket(server);

app.get('/', (req, res) => {
    res.render('index')
})

io.on('connection', (socket) => { 
    console.log("Socket connection established...");

    socket.on("new user", function (data) {
        socket.userId = data;
        activeUsers.add(data);
        io.emit("new user", [...activeUsers]);
    });

    socket.on("username changed", function (data) {
        const activeUsersArr = [...activeUsers].map((item) => item.toLowerCase())
        const valueIndex = activeUsersArr.indexOf(data.oldUsername.toLowerCase())
        if (valueIndex !== -1) {
            activeUsersArr[valueIndex] = data.newUsername
        }
        activeUsers = new Set(...activeUsersArr)
        io.emit("updated user", data);
    });
  
    socket.on("disconnect", () => {
        console.log(`user disconnected: ${socket.userId}`)
        activeUsers.delete(socket.userId);
        io.emit("user disconnected", socket.userId);
    });

    socket.on("chat message", function (data) {
        io.emit("chat message", data);
    });
      
    socket.on("typing", function (data) {
        socket.broadcast.emit("typing", data);
    });
});

