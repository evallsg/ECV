var WebSocket = require('ws');
var http = require('http');
var fs = require('fs');
var Database = require('./database.js');

function Book_Server() {
    this.init();

    this.firebase_db = new Database();
    this.firebase_db.init();
}

Book_Server.prototype.processRequest = function(object, ws) {
    var that = this
    switch (object.type) {
        case "auth":
            var usermail = that.active_clients[object.info.user_token];
            if (usermail) {
                console.log("here")
                ws.current_user = usermail;
                ws.send(ws.send(JSON.stringify({ "type": object.type, "info": { "auth": true } })));
            } else
                ws.send(ws.send(JSON.stringify({ "type": object.type, "info": { "auth": false } })));
            break;

        case "getbookchapter":
            console.log("getbookchapter")
            this.firebase_db.getChapter(object.info.chapter_id).then(function(result) {

                object.info.chapter = result
                that.firebase_db.getBook(object.info.book_id).then(function(result) {
                    object.info.book = result

                    console.log("curren user ", ws.current_user)
                    console.log("owner ", object.info.chapter.owner_id)
                    if (ws.current_user == object.info.chapter.owner_id)
                        object.info.editable = true;
                    else if (object.info.chapter.owner_id == undefined)
                        object.info.editable = true;
                    else
                        object.info.editable = false;

                    ws.send(JSON.stringify({ "type": object.type, "info": object.info }));
                }).catch(function(error) {
                    console.log("error get chapter ", error)
                });

            });
            break;
        case "createbookchapter":
            //this.addChapter(object).then(function(){ws.send();});

            break;
        case "savebookchapter":
            object.info.data.owner_id = ws.current_user;
            this.firebase_db.updateChapter(object.info.chapter_id, object.info.data);

            break;
        case "addbook":
            object.info.userId = ws.current_user;

            this.firebase_db.addBook(object.info).then(function(id) {
                object.info.bookId = id;
                that.firebase_db.addChapter(object.info).then(
                    function(data) {
                        console.log("add book server chapter: ", data)
                        setTimeout(call(ws, object), 50);


                    }).catch(function(error) {
                    console.log("error server ", error)
                });
            }).catch(function() {
                console.log("error server addBook")
            });

            break;
        case "register":
            this.firebase_db.register(object.info).then(function(user) {
                ws.send(JSON.stringify({ "type": object.type, "info": { "user": user } }));
            }).catch(function(errormsg) {
                ws.send(JSON.stringify({ "type": object.type, "info": { "errormsg": errormsg } }));
            });
            //ws.send();
            break;
        case "login":
            this.firebase_db.login(object.info).then(function(user_info) {
                that.active_clients[user_info.token] = object.info.email;
                ws.current_user = object.info.email;
                ws.send(JSON.stringify({ "type": object.type, "info": { "user": user_info } }));
            }).catch(function(errormsg) {
                ws.send(JSON.stringify({ "type": object.type, "info": { "errormsg": errormsg } }));
            });
            // ws.send();
            break;
        case "logout":
            this.firebase_db.logout().then(function() {
                ws.send(JSON.stringify({ "type": object.type, "info": { "success": true } }));
            }).catch(function(errormsg) {
                ws.send(JSON.stringify({ "type": object.type, "info": { "success": errormsg } }));
            });
            break;
        case "addchapter":
            object.info.userId = ws.current_user;
            this.firebase_db.addChapter(object.info).then(function(id) {
                console.log("add chapter server id ", object.info)
                console.log("id ", id)
                var data = {
                    "type": object.type,
                    "info": {
                        "chapterId": id,
                        "bookId": object.info.bookId
                    }
                }
                setTimeout(call(ws, data), 60);

            });;
            break;
        case "allbooks":
            this.firebase_db.getAllBooks().then(function(result) {
                var message = { "type": object.type, "info": { "books": [] } }
                for (var key in result) {
                    for (var anotherKey in result[key].chapters) {
                        var first_chapter_id = anotherKey
                        break;
                    }
                    var book_info = { "book_id": key, "title": result[key].title, "owner": result[key].owner_id, "finished": result[key].finished, "genre": result[key].genre, "first_chapter_id": first_chapter_id };
                    message.info.books.push(book_info);
                }
                //setTimeout(call(ws,object), 50);
                if (ws.readyState === 1) ws.send(JSON.stringify(message));
            }).catch(function(error) {
                ws.send(JSON.stringify({ "type": object.type, "info": { "errormsg": error } }));
                console.log("error recive books")
            });
            break;
        case "getchapters":
            this.firebase_db.getBookChapters(object.info.bookId).then(function(result) {
                // it doesn't work for now but maybe we have to change some structure from the DB
                var message = { "type": object.type, "info": { "chapters": [] } }
                for (chapterId of result)
                    message.info.chapters += [chapterId]
                ws.send(JSON.stringify({ "type": object.type, "info": result }));
            });
            break;
        case "addcomment":
            object.info.userId = ws.current_user;
            this.firebase_db.addComment(object.info).then(function(response) {
                ws.send(JSON.stringify({ "type": object.type, "info": response }))
            })
            break;
        case "getcomments":
            console.log(object.info)
            this.firebase_db.getComments(object.info).then(function(response) {
                for (i in response) {
                    if (ws.current_user == response[i].user) {
                        response[i].owner = true
                    } else {
                        response[i].owner = false
                    }
                }
                ws.send(JSON.stringify({ "type": object.type, "info": response }))
            })
            break
        case "deletecomment":
            var that = this
            this.firebase_db.getCommentById(object.info).then(function(response) {
                if (ws.current_user == response.user) {
                    console.log(object.info)
                    that.firebase_db.deleteComment(object.info).then(function(response) {
                        ws.send(JSON.stringify({ "type": object.type, "info": response }));
                    })
                } else {
                    ws.send(JSON.stringify({ "type": object.type, "info": false }));
                }
            })

            break
        case "getbooktree":
            this.firebase_db.getBookChaptersStructure(object.info.bookId).then(function(result) {

                structured_response = {}
                for (var chapter_id in result) {
                    structured_response[chapter_id] = result[chapter_id];
                }

                ws.send(JSON.stringify({ "type": object.type, "info": structured_response }));
            });
            break;
    }
}

Book_Server.prototype.init = function() {
    var that = this;
    this.active_clients = {};

    this.server = http.createServer();

    this.server.listen(14446, function() {
        console.log("Server ready!");
    });

    var wss = new WebSocket.Server({ server: this.server });

    wss.on('connection', function connection(ws) {
        console.log("User connected")
        ws.on('message', function incoming(message) {

            //TODO: check if json
            console.log('received: %s', message);
            var object_message = JSON.parse(message);
            that.processRequest(object_message, ws);
            //that.
        });
        ws.on("close", function(message) {
            //var index = this.clients.indexOf(ws);
            console.log("User disconnected");
            ws.close();
        });
        ws.on('error', function(err) {
            console.log(err);
        });
        //ws.send('something');
    });

}

function call(ws, object) {
    if (ws.readyState === 1) {
        //do nothing
        console.log("call enter")
        ws.send(JSON.stringify(object));
    } else if (ws.readyState != 1) {
        //fallback
        setInterval(call(ws, object), 50)
    }
}

server = new Book_Server();