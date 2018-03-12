function onScrollBottom(event)
{	
	var that = this;
    var element = event.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight)
    {
		var list = document.getElementById("list-decisions");
	 	for(id in that.chapterDecisions){
	 		if(document.getElementById(id)==null){
	     		var template = document.getElementById("template-decision");
		        var elem = template.cloneNode(true);
		        elem.id = id
		        newElem = document.createElement("a"); 
		        newElem.href= "edit-chapter.html?book_id=" + that.book_id + "&chapter_id=" + id;
		        newElem.innerText = that.chapterDecisions[id].decision;
		        elem.appendChild(newElem)
		        elem.classList.remove("hidden")
		        list.appendChild(elem)	
	 		}
	        
	    }
	    document.getElementsByClassName("options")[0].classList.remove("hidden")
       
    }
};

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
	var that = this;
	that.chapterDecisions = response.chapter.children;
	console.log(response)
	document.getElementsByClassName("menu-title")[0].innerText = response.book.title;
    document.getElementsByClassName("chapter-title")[0].innerText = response.chapter.title;
    document.getElementsByClassName("chapter-body")[0].innerText = response.chapter.text;

    if(!response.editable)
    {	
    	document.getElementsByClassName("chapter-title")[0].contentEditable = false;
    	document.getElementsByClassName("chapter-body")[0].contentEditable = false;
		document.getElementsByClassName("btn save")[0].classList.add("hidden");
		document.getElementsByClassName("btn finish")[0].classList.add("hidden");
    }
    else
    	this.editable = true;

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
function addDecision(){

	if(this.editable)
		onSaveChapter();

    var that = this
    var modalDecision = document.getElementById("modal new-decision");
    modalDecision.classList.remove("hidden");
    document.getElementById("btn-cancel-decision").addEventListener("click", function(event){
       modalDecision.classList.add("hidden");
    })
    document.getElementById("btn-start-decision").addEventListener("click", function(event){
        var decision = document.getElementsByClassName("decision-input")[0].value;
        that.client.requestAddNewChapter(that.book_id, that.chapter_id, decision, redirectToEditChapter.bind(this))
            
       // that.client.requestAllBooks(received_all_books);
    })
}
function redirectToEditChapter(data){
	var that = this
	console.log("redirect to book ", data)
    document.location.href = "edit-chapter.html?book_id=" + data.bookId + "&chapter_id=" + data.chapterId;
};
function init()
{	
	
	this.book_id = GetUrlValue("book_id");
	this.chapter_id = GetUrlValue("chapter_id");

	//document.getElementsByTagName("title")[0].innerText = book_title;
	this.editable = false;
	this.client.requestChapter(this.chapter_id, this.book_id, received_book_chapter.bind(this))

}

var user_token = localStorage.getItem("user-token")

if(!user_token){
    document.location.href = "index.html"
}

document.getElementsByClassName("btn save")[0].addEventListener("click", onSaveChapter.bind(this), false);
document.getElementsByClassName("btn finish")[0].addEventListener("click", onFinishChapter.bind(this), false);
document.getElementById("add-decision").addEventListener("click", addDecision.bind(this), false);
document.getElementsByClassName("chapter scroll")[0].addEventListener('scroll', onScrollBottom.bind(this));
this.client = new Book_Client(init.bind(this), user_token)
