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
            this.firebase_db.login(object.info);
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
    this.books_collection = JSON.parse(fs.readFileSync('books.json', 'utf8'));
    var that = this;
    var clients = []

    this.server = http.createServer();

    this.server.listen(14546, function() {
        console.log("Server ready!");
    });

    var wss = new WebSocket.Server({ server: this.server });

    wss.on('connection', function connection(ws) {
        clients.push(ws);
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
            clients.splice(index);
            console.log("User disconnected");
            ws.close();
        });
        ws.on('error', function(err) {
            console.log(err);
        });
        //ws.send('something');
    });

}

Book_Server.prototype.getChapter = function(object, ws) {
    //console.log("Getting book " + book_name + " chapter " + chapter_id);

    var book = this.books_collection.find(o => o.book_name === object.info.book_name);
    //console.log(book);

    if (book == null)
        return "None";
    //console.log(chapters)
    var chapter = book["chapters"].find(o => o.id == object.info.chapter);
    if (chapter == null)
        return "None";

    var message = {
        "type": "getbookchapter",
        "info": chapter
    }

    ws.send(JSON.stringify(message));
}

Book_Server.prototype.createNewChapter = function(object) {

    var book = this.books_collection.find(o => o.book_name === book_name);

    chapter.id = book.chapters.length;

    console.log("Creating new chapter in " + book_name + " with id " + chapter.id);

    book.chapters += chapter;

    console.log(book.chapters);

    this.updateBookCollection();
}

Book_Server.prototype.saveBookChapter = function(object) {

    //TODO: get chapter info
    // update relevant chapter info (state, text, title, decisions...)

    console.log("Getting book " + book_name + " chapter " + chapter_id);
    var book = this.books_collection.find(o => o.book_name === book_name);

    // if (book == null)
    //     return "None";
    // //console.log(chapters)
    // var chapter = book["chapters"].find(o => o.id == chapter_id);
    // if (chapter == null)
    //     return "None";
    // return chapter;
}


server = new Book_Server();