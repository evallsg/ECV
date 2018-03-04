function onSaveChapter()
{
	var title = document.getElementsByClassName("chapter-title")[0].innerText
	var text = document.getElementsByClassName("chapter-body")[0].innerText
	this.client.requestUpdateChapter(this.chapter_id, title, text)
}

function onFinishChapter()
{
	// var title = document.getElementsByClassName("chapter-title")[0].innerText
	// var text = document.getElementsByClassName("chapter-body")[0].innerText
	// this.client.requestUpdateChapter(this.chapter_id, title, text, true)
}

function received_book_chapter(response)
{	
	document.getElementsByClassName("menu-title")[0].innerText = response.book.title;
    document.getElementsByClassName("chapter-title")[0].innerText = response.chapter.title;
    document.getElementsByClassName("chapter-body")[0].innerText = response.chapter.text;

    if(!response.editable)
    {	
    	document.getElementsByClassName("chapter-title")[0].contentEditable = false;
    	document.getElementsByClassName("chapter-body")[0].contentEditable = false;
    }

	document.getElementsByTagName("body")[0].style.display = "initial";
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

var user_token = localStorage.getItem("user-token")

if(!user_token)
    document.location.href = "index.html"

document.getElementsByTagName("body")[0].style.display = "none";

document.getElementsByClassName("btn save")[0].addEventListener("click", onSaveChapter.bind(this), false);
document.getElementsByClassName("btn finish")[0].addEventListener("click", onFinishChapter.bind(this), false);

this.client = new Book_Client(init.bind(this), user_token)
