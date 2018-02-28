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
    switch (object.type) {
        case "getbookchapter":
            this.firebase_db.getChapter(object.info.chapter_id).then(function(result) {
                ws.send(JSON.stringify({ "type": object.type, "info": result }));
            });
            break;
        case "createbookchapter":
            this.addChapter(object);
            ws.send();
            break;
        case "savebookchapter":
            this.firebase_db.updateChapter(object.info.chapter_id, {"title": object.info.title, "text": object.info.text});
            ws.send();
            break;
        case "addbook":
            this.firebase_db.addBook(object.info);
            this.firebase_db.addChapter(object.info);
            ws.send(JSON.stringify({ "type": object.type, "book_id": object.info.bookId, "chapter_id": object.info.id }));
            break;
        case "register":
            this.firebase_db.register(object.info);
            ws.send();
            break;
        case "login":
            this.firebase_db.login(object.info).then(function(usertoken){ 
                ws.send(JSON.stringify({ "type": object.type, "info": {"usertoken": usertoken} });
            }, function(errormsg){
                ws.send(JSON.stringify({ "type": object.type, "info": {"errormsg": errormsg}});
            });
            ws.send();
            break;
        case "addchapter":
            object.info.userId = "marc";
            this.firebase_db.addChapter(object.info);
            ws.send();
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
                ws.send(JSON.stringify(message));
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

    }
}

Book_Server.prototype.init = function() {
    var that = this;
    this.clients = []

    this.server = http.createServer();

    this.server.listen(14546, function() {
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
            var index = clients.indexOf(ws);
            console.log("User disconnected");
            ws.close();
        });
        ws.on('error', function(err) {
            console.log(err);
        });
        //ws.send('something');
    });

}

server = new Book_Server();