var WebSocket = require('ws');
var http = require('http');
var url = require('url');
var fs = require('fs');

function Book_Server(){
    this.init();
}

// prototype for book objects
function Book(book_name, book_author, state, chapters){
    this.book_name = book_name;
    this.book_author = book_author;
    this.state = state;
    this.chapters = chapters;
}

// prototype for book chapters
// children should be a vector containing {id: next_chapter_idx, decision_text: "text of the decision leading to next_chapter_idx"}
function Chapter(parent, chapter_author){
        this.id = -1;
        this.parent = parent;
        this.chapter_author = chapter_author;
        this.title = "";
        this.text = "";
        this.state = "on_progress";
        this.is_terminal = 0;
        this.children = [];
}

Book_Server.prototype.updateBookCollection = function()
{
    //TODO: save the book collection file
}

function getJsonDataFromRequest(request, response, callback_func)
{
    data = "";
    request.on('data', (chunk) => {
        data += chunk;
      console.log(`Received ${chunk.length} bytes of data.`);
    });
    request.on('end', () => {
      console.log('There will be no more data.');
      console.log(data);
      callback_func(data, response);
    });
}

Book_Server.prototype.processRequest = function(object, ws)
{

    if (object.type == "getbookchapter") {

        this.getChapterInfo(object, ws);

    } else if (object.type == "createbookchapter") {
        // what we need: decision_text, book_name, parent chapter, chapter_author
        this.createNewChapter(object);
        ws.send();

    } else if (object.type == "savebookchapter") {

        this.saveBookChapter(object);
        ws.send();

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
            ws.send("Got it");
            //that.
        });
        ws.on("close", function(message){
            var index = clients.indexOf(ws)
            clients.splice(index)
            console.log("User disconnected")
        });
        ws.send('something');
    });

}

Book_Server.prototype.getChapterInfo = function(object, ws) {
    //console.log("Getting book " + book_name + " chapter " + chapter_id);

    var book = this.books_collection.find(o => o.book_name === object.info.book_name);
    console.log(book);

    if (book == null)
        return "None";
    //console.log(chapters)
    var chapter = book["chapters"].find(o => o.id == object.info.chapter);
    if (chapter == null)
        return "None";
    ws.send(JSON.stringify(chapter));
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