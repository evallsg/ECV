function onSaveChapter()
{
	var title = document.getElementsByClassName("chapter-title")[0].innerText
	var text = document.getElementsByClassName("chapter-body")[0].innerText
	var data = {
		"title": title,
		"text": text
	}
	this.client.requestUpdateChapter(this.chapter_id, data)
}

function onFinishChapter(event)
{
	event.srcElement.classList.add("disable")
	var title = document.getElementsByClassName("chapter-title")[0].innerText
	var text = document.getElementsByClassName("chapter-body")[0].innerText
	var data = {
		"title": title,
		"text": text,
		"is_terminal": true
	}
	// var text = document.getElementsByClassName("chapter-body")[0].innerText
	this.client.requestUpdateChapter(this.chapter_id, data)
}

function received_book_chapter(response)
{	
	var cosa = 0;
	console.log(response)
	document.getElementsByClassName("menu-title")[0].innerText = response.book.title;
    document.getElementsByClassName("chapter-title")[0].innerText = response.chapter.title;
    document.getElementsByClassName("chapter-body")[0].innerText = response.chapter.text;

}

function GetUrlValue(VarSearch){
    var SearchString = window.location.search.substring(1);
    var VariableArray = SearchString.split('&');
    for(var i = 0; i < VariableArray.length; i++){
        var KeyValuePair = VariableArray[i].split('=');
        if(KeyValuePair[0] == VarSearch){
            return KeyValuePair[1];
        }
    }
}

function init()
{	
	
	var book_id = GetUrlValue("book_id");
	this.chapter_id = GetUrlValue("chapter_id");

	//document.getElementsByTagName("title")[0].innerText = book_title;

	this.client.requestChapter(this.chapter_id, book_id, received_book_chapter)

}


document.getElementsByClassName("btn save")[0].addEventListener("click", onSaveChapter.bind(this), false);
document.getElementsByClassName("btn finish")[0].addEventListener("click", onFinishChapter.bind(this), false);

this.client = new Book_Client(init.bind(this))
