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
            if(usermail)
            {
                ws.current_user = usermail;
                ws.send(ws.send(JSON.stringify({ "type": object.type, "info": {"auth": true}} )));   
            }
            else
                ws.send(ws.send(JSON.stringify({ "type": object.type, "info": {"auth": false}} )));   
            break;

        case "getbookchapter":
            console.log("getbookchapter")
            this.firebase_db.getChapter(object.info.chapter_id).then(function(result) {

                object.info.chapter= result
                that.firebase_db.getBook(object.info.book_id).then(function(result){
                    object.info.book = result

                    if(ws.current_user == object.info.book.owner_id)
                        object.info.editable = true;
                    else
                        object.info.editable = false;

                    ws.send(JSON.stringify({ "type": object.type, "info": object.info }));
                }).catch(function(error){
                    console.log("error get chapter ", error)
                });
                
            });
            break;
        case "createbookchapter":
            this.addChapter(object).then(function(){ws.send();});
            
            break;
        case "savebookchapter":
            this.firebase_db.updateChapter(object.info.chapter_id,object.info.data);
            
            break;
        case "addbook":
            object.info.userId = ws.current_user;

            this.firebase_db.addBook(object.info).then(function(id){
                object.info.bookId = id;
                that.firebase_db.addChapter(object.info).then(
                function(data){
                    console.log("add book server chapter: ", data)
                    setTimeout(call(ws,object), 50);
                    

                }).catch(function(error){
                    console.log("error server ", error)
                });
            }).catch(function(){
                console.log("error server addBook")
            });
            
            break;
        case "register":
            this.firebase_db.register(object.info);
            ws.send();
            break;
        case "login":
            this.firebase_db.login(object.info).then(function(user_info){ 
                that.active_clients[user_info.token] = object.info.email;
                ws.current_user = object.info.email;
                ws.send(JSON.stringify({ "type": object.type, "info": {"user-info": user_info} }));
            }, function(errormsg){
                ws.send(JSON.stringify({ "type": object.type, "info": {"errormsg": errormsg}}));
            });
            ws.send();
            break;
        case "addchapter":
            object.info.userId = "marc";
            this.firebase_db.addChapter(object.info).then(function(id){
               ws.send(JSON.stringify({ "type": object.type, "info": {"chapterId": id} })) 
            });
            ;
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
    this.active_clients = {};

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
function call(ws,object){
    if(ws.readyState === 1) {
        //do nothing
        console.log("call enter")
        ws.send(JSON.stringify(object));
    } else if (ws.readyState !=1) {
        //fallback
        console.log("interval")
       setInterval(call(ws, object), 30)
    }
}

server = new Book_Server();