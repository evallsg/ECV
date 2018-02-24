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
            that.requestAddNewChapter(response.book_id, response.chapter_id, "First decision")
            break;
        case "register":
            break;
        case "addchapter":
            break;
        case "allbooks":
            that.callback_received_all_books(response.info);
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
  console.log("Creating chapter")
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

Book_Client.prototype.addBook = function(title) {
  console.log("Requesting chapter")
  var message = {
            "type": "addbook",
            "info" : {
                "title": title,
                "userId": "marc",
                "genre": "noire"
            }
        }

  this.ws.send(JSON.stringify(message));
};

Book_Client.prototype.requestRegister = function(email, password, name) {
  console.log("Requesting chapter")
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
  console.log("Requesting chapter")
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
  console.log("Requesting chapter")
  var message = {
            "type": "allbooks"
        }
  this.callback_received_all_books = callback_received_all_books;
  this.ws.send(JSON.stringify(message));
};