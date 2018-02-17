var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer(function(request, response) {
    console.log("REQUEST: " + request.url);

    request_parsed = request.url.split("/").slice(1)
    //console.log(request_parsed);

    if (request_parsed[0] == "getbookchapter" && request_parsed.length == 3) {
        var chapter = getChapterInfo(request_parsed[1], request_parsed[2]);
        response.end(JSON.stringify(chapter));
    } else if (request_parsed[0] == "setbookchapter" && request_parsed.length == 2) {
        var body = "";
        request.on('data', function() {
            body += request.read();
        });
        request.on('end', function() {
            console.log(body);
            response.write("OK");
            response.end();
        });

        var url_info = url.parse(request.url, true);
        //console.log(url_info);
        var book_name = url_info.pathname.split("/").slice(2);
        //console.log(book_name);
        var params = url_info.query;
        console.log("Setting new chapter for " + book_name);
        console.log(params);
        // TODO: do stuff with it

        response.end();

        // setChapterInfo(params[1], params[2]);
        // response.end(JSON.stringify(chapter));
    }

    // var url_info = url.parse( request.url, true ); //all the request info is here
    // //console.log(url_info);
    // var pathname = url_info.pathname; //the address
    // //console.log(pathname);
    // var params = url_info.query; //the parameters
    // //console.log(params)
    // response.end("OK!"); //send a response
});

server.listen(13456, function() {
    console.log("Server ready!");
});

function getChapterInfo(book_name, chapter_id) {
    console.log("Getting book " + book_name + " chapter " + chapter_id);
    var books_collection = JSON.parse(fs.readFileSync('books.json', 'utf8'));

    var book = books_collection.find(o => o.book_name === book_name);

    if (book == null)
        return "None";
    //console.log(chapters)
    var chapter = book["chapters"].find(o => o.id == chapter_id);
    if (chapter == null)
        return "None";
    return chapter;
}

function setChapterInfo(book_name, chapter_id) {
    console.log("Getting book " + book_name + " chapter " + chapter_id);
    var books_collection = JSON.parse(fs.readFileSync('books.json', 'utf8'));

    var book = books_collection.find(o => o.book_name === book_name);

    if (book == null)
        return "None";
    //console.log(chapters)
    var chapter = book["chapters"].find(o => o.id == chapter_id);
    if (chapter == null)
        return "None";
    return chapter;
}