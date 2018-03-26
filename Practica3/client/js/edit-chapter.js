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
		"finished": true
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

		if(!response.chapter.finished)
			document.getElementById("add-decision").classList.add("hidden");
    }
    else{
        this.editable = true;
    }
    if(!response.finished){
        document.getElementById("alert-status").classList.remove("hidden");
    }


    //document.getElementsByTagName("body")[0].style.display = "initial";

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
	location.reload();
	// var that = this
	// console.log("redirect to book ", data)
 	// document.location.href = "edit-chapter.html?book_id=" + data.bookId + "&chapter_id=" + data.chapterId;
}

function onLogout(){
    this.client.requestLogout(signOut)
}
function signOut(info){

    if(info.success){

        localStorage.removeItem("user-token")
        document.location.href = "index.html";
        console.log(info.success)
    }
    else{
        alert(info.success)
    }
}

function showMenu(event){
	
    var elem = document.getElementsByClassName("menu-responsive")[0].classList;
    if(elem.contains("hidden")){
        elem.remove("hidden")
    }
    else{
        elem.add("hidden")
    };
    
}
function showComments(){
    var that = this
    var elem = document.getElementsByClassName("comments")[0].classList;
    var chapter = document.getElementsByClassName("chapter")[0].classList;

    if(elem.contains("hidden")){

        that.getComments()
        elem.remove("hidden");
        chapter.add("wrap");
    }
    else{

        elem.add("hidden");
        chapter.remove("wrap")
    };    
}
function hiddenAlert(){
    document.getElementById("alert-status").classList.add("hidden");
}
function addComment(){
    if(event.key=="Enter" ||event.key==undefined){
        var that = this
        var comment = document.querySelector("input[name='new-comment']").value;
       /* var dateFormat = require('dateformat');//necessari instalar npm dateformat!!!!!!!!!!!!!!!!*/
        var created = new Date()
        /*formatDate(d, "dddd h:mmtt d MMM yyyy");*/
        that.client.requestAddNewComment(comment, that.chapter_id, created, addCommentSuccess)
    }
}
function addCommentSuccess(){
    document.querySelector("input[name='new-comment']").value=""
    getComments()
}
function getComments(){

    var that = this;
    that.client.requestAllComments(that.chapter_id, renderComments);
}

function renderComments(comments){

    var list = document.getElementsByClassName("list-comments")[0];
    var template = document.getElementById("template-comment");
    for(id in comments){
        if(document.getElementById(id)== undefined){
            var elem = template.cloneNode(true);
            elem.id = id
            elem.innerText = comments[id].comment;
            div1 = document.createElement("div"); 
            div1.className= "comment-user";
            div1.innerText = comments[id].user;
            div2 = document.createElement("div"); 
            div2.className= "comment-date";
            div2.innerText = comments[id].created;
            elem.appendChild(div1);
            elem.appendChild(div2);
            elem.classList.remove("hidden")
            list.appendChild(elem)  
        }
    }
}
function init(){   
    //document.getElementsByTagName("body")[0].style.display = "initial";
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
//
setInterval(callRender,3000);

function callRender(){
    var elem = document.getElementsByClassName("comments")[0].classList;
    if(!elem.contains("hidden")){
        this.getComments()
    }
}


document.getElementsByClassName("btn save")[0].addEventListener("click", onSaveChapter.bind(this), false);
document.getElementById("btn-logout").addEventListener("click", onLogout.bind(this),false);
document.getElementsByClassName("btn finish")[0].addEventListener("click", onFinishChapter.bind(this), false);
document.getElementById("add-decision").addEventListener("click", addDecision.bind(this), false);
document.getElementsByClassName("chapter scroll")[0].addEventListener('scroll', onScrollBottom.bind(this));
document.getElementsByClassName("menu-bars")[0].addEventListener("click",showMenu.bind(this),false);
document.getElementById("add-comment").addEventListener("click",addComment.bind(this),false);

//document.getElementsByTagName("body")[0].style.display = "none";

this.client = new Book_Client(init.bind(this), user_token)

