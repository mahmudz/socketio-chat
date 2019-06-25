// Acts as a server
const express = require('express');
const socket = require('socket.io');


// Initialize
const app = express();


// Express app uses
app.use(express.static('public'))


// Serving Express Server
const server = app.listen(3000, function(e) {
    console.log('Server Started At 3000');
});


const io = socket(server);

let users = [{
    username: "mahmudz",
    password: "12345"
}, {
    username: "hasan",
    password: "12345"
}];

io.on('connection', (socket) => {
    socket.on('newUserConnected', (data) => {

        let ifExists = users.filter(function(user) {
            return user.username == data.username && user.password == data.password;
        });

        if (ifExists.length > 0) {
            socket.emit('usernameApproved');
        } else {
            users.push(data);

            socket.broadcast.emit('newUserJoined', {
                username: data.username
            });
            socket.emit('usernameApproved');

            console.log(`${data.username} Joined.`);
            console.log(users);
        }
    });

    socket.on('sendNewMessage', (data) => {
        socket.broadcast.emit('receiveNewMessage', data);
    });


});