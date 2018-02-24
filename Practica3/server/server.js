var WebSocket = require('ws');
var http = require('http');
var fs = require('fs');
var Database = require('./database.js');

function Book_Server(){
    this.init();

    this.firebase_db = new Database();
    this.firebase_db.init();
}

Book_Server.prototype.processRequest = function(object, ws)
{
	switch(object.type){
   		case"getbookchapter": 
        	this.getChapter(object, ws);
        	break;
    	case "createbookchapter":
        	this.createNewChapter(object);
        	ws.send();
        	break;
    	case "savebookchapter":
        	this.saveBookChapter(object);
        	ws.send();
        	break;
    	case "addbook":
    		this.firebase_db.addBook(object.info);
    		var chapterId = this.firebase_db.addChapter(object.info);
    	    ws.send(JSON.stringify({"type": object.type, "book_id" : object.info.bookId, "chapter_id" : object.info.id}));
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
            // TODO: function to get all books
            //var allbooks = this.firebase_db.addChapter(object.info);
            ws.send(JSON.stringify({"type": object.type, "info":[{"book_name": "book1"}, {"book_name" : "book2"}]}));
            break;
	}
}

Book_Server.prototype.init = function()
{
    this.books_collection = JSON.parse(fs.readFileSync('books.json', 'utf8'));
    var that =  this;
    var clients = []

    this.server = http.createServer();

    this.server.listen(14546, function() {
        console.log("Server ready!");
    });

    var wss = new WebSocket.Server({ server: this.server});

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
        ws.on("close", function(message){
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

    var message = {"type": "getbookchapter",
					"info": chapter}

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