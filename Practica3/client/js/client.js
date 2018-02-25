class Book_Client
{
  constructor( on_complete )
  {
    this.ws = new WebSocket("ws://localhost:14546")

    this.ws.onopen = function() {
      if(on_complete)
          on_complete();     
    };
    var that = this;
    this.ws.onmessage = function(message) {
      var response = JSON.parse(message.data)
      switch(response.type){
        case"getbookchapter": 
            break;
        case "createbookchapter":
            break;
        case "savebookchapter":
            break;
        case "addbook":
            break;
        case "register":
            break;
        case "addchapter":
            break;
        case "allbooks":
            that.callback_received_all_books(response.info);
            break;
        case "getchapters":
            that.callback_received_all_chapters(response.info);
            break;
      }
    };

  }
}

Book_Client.prototype.requestChapter = function(book_name, chapter_id) {
  console.log("Requesting chapter")
  var message = {
            "type": "getbookchapter",
            "info" : {
                "book_name": book_name,
                "chapter": chapter_id
            }
        }

  this.ws.send(JSON.stringify(message));
};

Book_Client.prototype.requestAddNewChapter = function(book_id, parent_chapter_id, decision_text) {
  console.log("Creating add new chapter")
  var message = {
            "type": "addchapter",
            "info" : {
                "bookId": book_id,
                "parentId": parent_chapter_id,
                "decision": decision_text
            }
        }

  this.ws.send(JSON.stringify(message));
};

Book_Client.prototype.requestUpdateChapter = function(book_id, parent_chapter_id, title_text, body_text) {
  // body...
};

Book_Client.prototype.requestAddBook = function(title, genre) {
  console.log("Requesting add book")
  var message = {
            "type": "addbook",
            "info" : {
                "title": title,
                "userId": "marc",
                "genre": genre
            }
        }

  this.ws.send(JSON.stringify(message));
};

Book_Client.prototype.requestRegister = function(email, password, name) {
  console.log("Requesting register")
  var message = {
            "type": "register",
            "info" : {
                "email": email,
                "password": md5(password),
                "name": name
            }
        }

  this.ws.send(JSON.stringify(message));
};

Book_Client.prototype.requestLogin = function(email, password) {
  console.log("Requesting login")
  var message = {
            "type": "login",
            "info" : {
                "email": email,
                "password": md5(password)
            }
        }

  this.ws.send(JSON.stringify(message));
};


Book_Client.prototype.requestAllBooks = function(callback_received_all_books) {
  console.log("Requesting all books")
  var message = {
            "type": "allbooks"
        }
  this.callback_received_all_books = callback_received_all_books;
  this.ws.send(JSON.stringify(message));
};

Book_Client.prototype.requestAllChapters = function(book_id, callback_received_all_chapters) {
  console.log("Requesting chapters")
  var message = {
            "type": "getchapters",
            "info":{
              "bookId": book_id
            }
        }
  this.callback_received_all_chapters = callback_received_all_chapters;
  this.ws.send(JSON.stringify(message));
};