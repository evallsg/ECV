function received_book_chapter(response)
{
	var cosa = 0;

    document.getElementsByClassName("chapter-title")[0].innerText = response.title;
    document.getElementsByClassName("chapter-body")[0].innerText = response.text;

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
	var first_chapter_id = GetUrlValue("first_chapter_id");

	//document.getElementsByTagName("title")[0].innerText = book_title;

	this.client.requestChapter(first_chapter_id, received_book_chapter)

}

document.getElementsByTagName("body")[0].style.display = "none";

this.client = new Book_Client(init.bind(this))
