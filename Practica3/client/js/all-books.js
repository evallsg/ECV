function onClickOnBook(evt) {
    // get book Id
    var target_book_id = evt.currentTarget.attributes.book_id.nodeValue;
    var first_chapter_id = evt.currentTarget.attributes.first_chapter_id.nodeValue;

    document.location.href = "edit-chapter.html?book_id=" + target_book_id + "&chapter_id=" + first_chapter_id;
}

// Test function for now
function onClickNewBook() {
    var modal = document.getElementById("modal new-book");
    modal.classList.remove("hidden");
    modal.getElementById("btn-cancel").addEventListener("click", function(event){
       // modal.classList.add("hidden");
    })
    modal.getElementById("btn-start").addEventListener("click", function(event){
        /*var title = modal.getElementById("input-title").val();
        var genre = modal.getElementById("input-genre").val();*/
        this.client.requestAddBook(title, genre);
        client.requestAllBooks(received_all_books);
    })
    console.log("new book")
    
}

function received_all_books(books) {
    var books_view = document.getElementsByClassName("books")[0]

    while(books_view.firstChild){
        books_view.removeChild(books_view.firstChild);
    }

    books.forEach(function(book) {
        var template = document.getElementById("templates").getElementsByClassName("container")[0]
        var elem = template.cloneNode(true);
        elem.setAttribute("book_id", book.book_id);
        elem.setAttribute("first_chapter_id", book.first_chapter_id);
        elem.querySelector(".book-title").innerText = book.title;

        elem.addEventListener("click", onClickOnBook, false);

        books_view.appendChild(elem);
    });



    document.getElementsByTagName("body")[0].style.display = "initial";
}

function init() {

    client.requestAllBooks(received_all_books);
}

//document.getElementsByTagName("body")[0].style.display = "none";

document.getElementsByClassName("btn new-book")[0].addEventListener("click", onClickNewBook.bind(this), false);

this.client = new Book_Client(init.bind(this))