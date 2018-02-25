function received_book_chapter(response)
{
	var cosa = 0;

    document.getElementsByClassName("chapter-title")[0].innerText = response.title;
    document.getElementsByClassName("chapter-body")[0].innerText = response.text;

	document.getElementsByTagName("body")[0].style.display = "initial";
}

function init()
{	
	var book_id = localStorage.getItem("book_id");
	var first_chapter_id = localStorage.getItem("first_chapter_id");
	var book_title = localStorage.getItem("book_title");

	document.getElementsByTagName("title")[0].innerText = book_title;

	this.client.requestChapter(first_chapter_id, received_book_chapter)

}

document.getElementsByTagName("body")[0].style.display = "none";

this.client = new Book_Client(init.bind(this))
