class Book_Client {
    constructor(on_complete, user_token) {
        this.ws = new WebSocket("ws://localhost:14546")

        var that = this;
        this.ws.onopen = function() {
            if (on_complete) {
                if (user_token)
                    that.requestAuth(user_token);
                on_complete();
            }

        };
        this.ws.onmessage = function(message) {
            var response = JSON.parse(message.data)
            switch (response.type) {
                case "getbookchapter":
                    that.callback_received_chapter(response.info);
                    break;
                case "createbookchapter":
                    break;
                case "savebookchapter":
                    break;
                case "addbook":
                    that.callback_add_book(response.info);
                    break;
                case "register":
                    break;
                case "addchapter":
                    break;
                case "allbooks":
                    that.callback_received_all_books(response.info.books);
                    break;
                case "getchapters":
                    that.callback_received_all_chapters(response.info);
                    break;
                case "login":
                    that.callback_received_user_token(response.info["user-info"].token);
                    break;
                case "auth":
                    if (!response.info.auth) {
                        localStorage.removeItem("user-token")
                        document.location.href = "index.html"
                    }
                    break;
            }
        };

    }
}

Book_Client.prototype.requestAuth = function(user_token) {
    console.log("Requesting auth")
    var message = {
        "type": "auth",
        "info": {
            "user_token": user_token
        }
    }

    this.ws.send(JSON.stringify(message));
};


Book_Client.prototype.requestChapter = function(chapter_id, book_id, callback_received_chapter) {
    console.log("Requesting chapter")
    var message = {
        "type": "getbookchapter",
        "info": {
            "chapter_id": chapter_id,
            "book_id": book_id
        }
    }
    this.callback_received_chapter = callback_received_chapter;

    this.ws.send(JSON.stringify(message));
};

Book_Client.prototype.requestAddNewChapter = function(book_id, parent_chapter_id, decision_text) {
    console.log("Creating add new chapter")
    var message = {
        "type": "addchapter",
        "info": {
            "bookId": book_id,
            "parentId": parent_chapter_id,
            "decision": decision_text
        }
    }

    this.ws.send(JSON.stringify(message));
};

Book_Client.prototype.requestUpdateChapter = function(chapter_id, title_text, body_text) {
    console.log("Saving new chapter")
    var message = {
        "type": "savebookchapter",
        "info": {
            "chapter_id": chapter_id,
            "title": title_text,
            "text": body_text
        }
    }

    this.ws.send(JSON.stringify(message));
};

Book_Client.prototype.requestFinishChapter = function(chapter_id, title_text, body_text) {
    // body...
};

Book_Client.prototype.requestAddBook = function(title, genre, callback_add_book) {
    console.log("Requesting add book")
    var message = {
        "type": "addbook",
        "info": {
            "title": title,
            "userId": "marc",
            "genre": genre
        }
    }
    this.callback_add_book = callback_add_book;
    this.ws.send(JSON.stringify(message))
};

Book_Client.prototype.requestRegister = function(email, password, name) {
    console.log("Requesting register")
    var message = {
        "type": "register",
        "info": {
            "email": email,
            "password": md5(password),
            "name": name
        }
    }

    this.ws.send(JSON.stringify(message));
};

Book_Client.prototype.requestLogin = function(email, password, callback_received_user_token) {
    console.log("Requesting login")
    var message = {
        "type": "login",
        "info": {
            "email": email,
            "password": md5(password)
        }
    }
    this.callback_received_user_token = callback_received_user_token;
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
        "info": {
            "bookId": book_id
        }
    }
    this.callback_received_all_chapters = callback_received_all_chapters;
    this.ws.send(JSON.stringify(message));
};