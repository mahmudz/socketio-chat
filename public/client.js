$(document).ready(function() {

    function scrollToButtom() {
        $('#chatFeed').scrollTop($('#chatFeed')[0].scrollHeight);
    }

    let username = '';

    const socket = io.connect();

    if (window.localStorage.getItem('username')) {
        username = window.localStorage.getItem('username');
        $('#loginWindow').remove();
        $('#loggedInAs').html('Logged in as ' + username);
        $('#chatWindow').show();
    } else {
        $("#goBTN").click(function(e) {
            e.preventDefault();

            // Check if entered blank
            if ($('#username').val() == '') {
                return;
            }

            socket.emit('newUserConnected', {
                username: $('#username').val(),
                password: $('#password').val()
            });

            username = $('#username').val();


            socket.on('usernameApproved', function() {
                window.localStorage.setItem('username', username);
                $('#loggedInAs').html('Logged in as ' + username);

                $('#loginWindow').remove();
                $('#chatWindow').show();
            });
        });
    }



    $('#message').keyup(function(e) {
        e.preventDefault();
        if (e.which == 13) {
            if ($('#message').val() == '') {
                return;
            } else {
                socket.emit('sendNewMessage', {
                    username: username,
                    message: $('#message').val()
                });
                $('#chatFeed').append('<div class="alert alert-success ml-auto text-right" role="alert" style="width: 70%;">' +
                    '<small>You</small><br>' + $('#message').val() + '</div>');

                scrollToButtom();

                $('#message').val('');
            }
        }
    });

    socket.on('receiveNewMessage', function(data) {
        if (data.username == username) {
            return;
        } else {
            $('#chatFeed').append('<div class="alert alert-primary mr-auto" role="alert" style="width: 70%;">' +
                '<small>' + data.username + '</small><br>' + data.message + '</div>');
            scrollToButtom();
        }
    });

    socket.on('newUserJoined', (data) => {
        if (data.username == username) {
            window.localStorage.setItem('username', username);
            $('#loggedInAs').html('Logged in as ' + username);
        } else {
            $('#chatFeed').append('<p><small class="text-muted">' + data.username + ' connected to chat.</small></p>');
            scrollToButtom();
        }
    });

});