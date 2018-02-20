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

function processRequest(request, response)
{
    console.log("REQUEST: " + request.url);

        request_parsed = request.url.split("/").slice(1)
        //console.log(request_parsed);

        if (request_parsed[0] == "getbookchapter" && request_parsed.length == 3) {
            var chapter = this.getChapterInfo(request_parsed[1], request_parsed[2]);
            response.end(JSON.stringify(chapter));
        } else if (request_parsed[0] == "createbookchapter" && request_parsed.length == 2) {
            // what we need: decision_text, book_name, parent chapter, chapter_author
            var decision_text;
            var book_name = request_parsed[1];
            var parent_chapter_id;
            var chapter_author;

            new_chapter = new Chapter(parent_chapter_id, chapter_author);

            this.createNewChapter(book_name, new_chapter, decision_text)

        } else if (request_parsed[0] == "savebookchapter" && request_parsed.length == 2) {
            data = ""
            var url_info = url.parse(request.url, true);
            //console.log(url_info);
            var book_name = url_info.pathname.split("/").slice(2);

            request.on('data', (chunk) => {
                data += chunk
              console.log(`Received ${chunk.length} bytes of data.`);
            });
            request.on('end', () => {
              console.log('There will be no more data.');
              console.log(data)
            });

            response.end();

            // setChapterInfo(params[1], params[2]);
            // response.end(JSON.stringify(chapter));
        }

}

Book_Server.prototype.init = function()
{
    this.books_collection = JSON.parse(fs.readFileSync('books.json', 'utf8'));

    //console.log(this.books_collection)

    this.server = http.createServer(processRequest.bind(this));

    this.server.listen(14546, function() {
        console.log("Server ready!");
    });

}

Book_Server.prototype.getChapterInfo = function(book_name, chapter_id) {
    console.log("Getting book " + book_name + " chapter " + chapter_id);

    var book = this.books_collection.find(o => o.book_name === book_name);
    console.log(book);

    if (book == null)
        return "None";
    //console.log(chapters)
    var chapter = book["chapters"].find(o => o.id == chapter_id);
    if (chapter == null)
        return "None";
    return chapter;
}

Book_Server.prototype.createNewChapter = function(book_name, chapter, decision_text) {

    var book = this.books_collection.find(o => o.book_name === book_name);

    chapter.id = book.chapters.length;

    console.log("Creating new chapter in " + book_name + " with id " + chapter.id);

    book.chapters += chapter;

    console.log(book.chapters);

    this.updateBookCollection();
}

Book_Server.prototype.saveBookChapter = function(book_name, chapter) {

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