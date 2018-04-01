function onScrollBottom(event) {
    var that = this;
    // var element = event.target;
    /* if (element.scrollHeight - element.scrollTop === element.clientHeight)
     {*/
    var list = document.getElementById("list-decisions");
    for (id in that.chapterDecisions) {
        if (document.getElementById(id) == null) {
            var template = document.getElementById("template-decision");
            var elem = template.cloneNode(true);
            elem.id = id
            newElem = document.createElement("a");
            newElem.href = "edit-chapter.html?book_id=" + that.book_id + "&chapter_id=" + id;
            newElem.innerText = that.chapterDecisions[id].decision;
            elem.appendChild(newElem)
            elem.classList.remove("hidden")
            list.appendChild(elem)
        }

    }
    document.getElementById("add-decision").classList.remove("hidden")
    document.getElementsByClassName("options")[0].classList.remove("hidden")

    /* }*/
};

function book_tree_received_callback(result) {

    document.getElementsByClassName("chapter")[0].classList.add("hidden")
    document.getElementsByClassName("book-tree")[0].classList.remove("hidden")

    tree_structure = []
    tree_dictionary = {}
    var book_tree = new BookTree(".book-tree")

    config = {
        container: "#tree-simple",
        node: {
            collapsable: true
        },
        animation: {
            nodeAnimation: "easeOutBounce",
            nodeSpeed: 700,
            connectorsAnimation: "bounce",
            connectorsSpeed: 700
        }
    };

    tree_structure.push(config)

    for (var chapter_id in result) {

        if (!result[chapter_id].owner_id)
            html_class = "no-owner"
        else if (result[chapter_id].finished)
            html_class = "finished"
        else
            html_class = "not-finished"
        if(chapter_id==this.chapter_id){
            html_class+= " current"
        }

        node = {
            text: {
                "data-chapter": {
                    val: result[chapter_id]["title"]!=""? result[chapter_id]["title"]:"[NO TITLE]",
                    href: "edit-chapter.html?book_id=" + this.book_id + "&chapter_id=" + chapter_id,
                    target: "_self"              
                }
            },
            HTMLclass: html_class,

        }

    
        if (result[chapter_id]["parent_id"])
            node["parent"] = tree_dictionary[result[chapter_id]["parent_id"]]

        tree_dictionary[chapter_id] = node

        tree_structure.push(node);
    }

    book_tree.loadTree(tree_structure)
}

function onSaveChapter() {
    var title = document.getElementsByClassName("chapter-title")[0].innerText
    var text = document.getElementsByClassName("chapter-body")[0].innerText
    var data = {
        "title": title,
        "text": text
    }
    this.client.requestUpdateChapter(this.chapter_id, data)
}

function onFinishChapter(event) {
    event.srcElement.classList.add("disable")
    var title = document.getElementsByClassName("chapter-title")[0].innerText
    var text = document.getElementsByClassName("chapter-body")[0].innerText
    var data = {
        "title": title,
        "text": text,
        "finished": true
    }
    // var text = document.getElementsByClassName("chapter-body")[0].innerText
    this.client.requestUpdateChapter(this.chapter_id, data);
    document.getElementById("alert-status").classList.add("hidden");
    onScrollBottom();
}

function received_book_chapter(response) {
    //document.getElementsByClassName("chapter scroll")[0].style.display = "initial";
    var that = this;
    that.chapterDecisions = response.chapter.children;
    console.log(response)
    document.getElementsByClassName("menu-title")[0].innerText = response.book.title;
    document.getElementsByClassName("chapter-title")[0].innerText = response.chapter.title;
    document.getElementsByClassName("chapter-body")[0].innerText = response.chapter.text;

    if (!response.chapter.owner_id) {
        document.getElementById("alert-status-ownership").classList.remove("hidden");
    } else if (!response.chapter.finished) {
        document.getElementById("alert-status").classList.remove("hidden");
    } else {
        /*document.getElementsByClassName("options")[0].classList.remove("hidden")*/
        document.getElementsByClassName("btn finish")[0].classList.add("disable");
        this.onScrollBottom()
    }

    this.finished = response.chapter.finished

    if (!response.editable) {
        document.getElementsByClassName("chapter-title")[0].contentEditable = false;
        document.getElementsByClassName("chapter-body")[0].contentEditable = false;
        document.getElementsByClassName("btn save")[0].classList.add("hidden");
        document.getElementsByClassName("btn finish")[0].classList.add("hidden");

    } else {
        this.editable = true;
        document.getElementsByClassName("btn save")[0].classList.remove("hidden");
        document.getElementsByClassName("icon left save")[0].classList.remove("hidden")

    }


    document.getElementsByClassName("chapter scroll")[0].classList.remove("hidden")

}

function GetUrlValue(VarSearch) {
    var SearchString = window.location.search.substring(1);
    var VariableArray = SearchString.split('&');
    for (var i = 0; i < VariableArray.length; i++) {
        var KeyValuePair = VariableArray[i].split('=');
        if (KeyValuePair[0] == VarSearch) {
            return KeyValuePair[1];
        }
    }
}

function addDecision() {

    if (this.editable)
        onSaveChapter();

    var that = this
    var modalDecision = document.getElementById("modal new-decision");
    modalDecision.classList.remove("hidden");
    document.getElementById("btn-cancel-decision").addEventListener("click", function(event) {
        modalDecision.classList.add("hidden");
    })
    document.getElementById("btn-start-decision").addEventListener("click", function(event) {
        var decision = document.getElementsByClassName("decision-input")[0].value;
        that.client.requestAddNewChapter(that.book_id, that.chapter_id, decision, redirectToEditChapter.bind(this))

        // that.client.requestAllBooks(received_all_books);
    })
}

function redirectToEditChapter(data) {
    location.reload();
    // var that = this
    // console.log("redirect to book ", data)
    // document.location.href = "edit-chapter.html?book_id=" + data.bookId + "&chapter_id=" + data.chapterId;
}

function onLogout() {
    this.client.requestLogout(signOut)
}

function signOut(info) {

    if (info.success) {

        localStorage.removeItem("user-token")
        document.location.href = "index.html";
        console.log(info.success)
    } else {
        alert(info.success)
    }
}

function showMenu(event) {

    var elem = document.getElementsByClassName("menu-responsive")[0].classList;
    if (elem.contains("hidden")) {
        elem.remove("hidden")
    } else {
        elem.add("hidden")
    };

}

function showComments() {
    var that = this
    var elem = document.getElementsByClassName("comments")[0].classList;
    var chapter = document.getElementsByClassName("chapter")[0].classList;

    if (elem.contains("hidden")) {

        that.getComments()
        elem.remove("hidden");
        chapter.add("wrap");
    } else {

        elem.add("hidden");
        chapter.remove("wrap")
    };
}

function hiddenAlert() {
    document.getElementById("alert-status").classList.add("hidden");
}

function acceptOwnership() {
    document.getElementById("alert-status-ownership").classList.add("hidden");
    this.onSaveChapter();

    if (!this.finished)
        document.getElementById("alert-status").classList.remove("hidden");

    document.getElementsByClassName("btn save")[0].classList.remove("hidden");
    document.getElementsByClassName("icon left save")[0].classList.remove("hidden")
    document.getElementsByClassName("btn finish")[0].classList.remove("hidden")
    document.getElementsByClassName("chapter-title")[0].contentEditable = true;
    document.getElementsByClassName("chapter-body")[0].contentEditable = true;
}

function declineOwnership() {
    window.history.back();
}

function addComment() {
    if (event.key == "Enter" || event.key == undefined) {
        var that = this
        var comment = document.querySelector("input[name='new-comment']").value;
        /* var dateFormat = require('dateformat');//necessari instalar npm dateformat!!!!!!!!!!!!!!!!*/
        var created = new Date()
       
        /*formatDate(d, "dddd h:mmtt d MMM yyyy");*/
        that.client.requestAddNewComment(comment, that.chapter_id, created, addCommentSuccess)
    }
}

function addCommentSuccess() {
    document.querySelector("input[name='new-comment']").value = ""
    getComments()
}

function getComments() {

    var that = this;
    that.client.requestAllComments(that.chapter_id, renderComments.bind(this));
}

function deleteComment(data) {
    var that = this
    console.log("delete ", data)
    that.client.requestDeleteComment(that.chapter_id, data.getAttribute("data-id"), deleteCommentSuccess.bind(this))
}

function deleteCommentSuccess(response) {
    var that = this
    that.commentsRemoved.push(response)
    document.getElementById(response).remove()
}

function renderComments(comments) {
    var that = this
    var list = document.getElementsByClassName("list-comments")[0];
    var template = document.getElementById("template-comment");
    current = new Date()
    currentDate = current.toLocaleDateString("es-ES")
    for (id in comments) {
        if (document.getElementById(id) == undefined) {
            var elem = template.cloneNode(true);
            elem.id = id
            elem.innerText = comments[id].comment;
            div1 = document.createElement("div");
            div1.className = "comment-user";
            div1.innerText = comments[id].user;
            div2 = document.createElement("div");
            div2.className = "comment-date";
            created = new Date(comments[id].created);

            dd= created.getDate()
            mm = created.getMonth()+1
            yyyy = created.getFullYear()
            HH = created.getHours()
            MM =created.getMinutes()
            SS = created.getSeconds()
            if(dd<10){
                dd='0'+dd;
            } 
            if(mm<10){
                mm='0'+mm;
            } 
            if(MM<10){
                MM='0'+MM
            }
            if(HH<10){
                HH='0'+HH
            }
            if(SS<10){
                SS='0'+SS
            }
            if(currentDate== created.toLocaleDateString("es-ES")){
                date = HH+":"+MM+":"+SS+" "+"Today"
            }else{
                date = dd+"/"+mm+"/"+yyyy
            }
        
            div2.innerText=date
            if (comments[id].owner || that.editable) {
                i = document.createElement("i")
                i.className = "fas fa-trash-alt trash";
                i.setAttribute("onclick", "deleteComment(this)")
                i.setAttribute("data-id", id)
                console.log(i)
                div2.appendChild(i)
            }

            elem.appendChild(div1);
            elem.appendChild(div2);
            elem.classList.remove("hidden")
            list.appendChild(elem)
        }
    }
    for (i in that.commentsRemoved) {
        console.log("removed ", that.commentsRemoved[i])

        comment = document.getElementById(that.commentsRemoved[i]);
        console.log(comment)
        if (comment != undefined) {
            comment.remove()
        }
    }
}

function onShowBookTree() {
    this.client.requestBookTree(this.book_id, book_tree_received_callback.bind(this))
}

function init() {
    this.book_id = GetUrlValue("book_id");
    this.chapter_id = GetUrlValue("chapter_id");
    this.commentsRemoved = []
    //document.getElementsByTagName("title")[0].innerText = book_title;
    this.editable = false;
    this.client.requestChapter(this.chapter_id, this.book_id, received_book_chapter.bind(this))
}
document.getElementsByClassName("chapter scroll")[0].classList.add("hidden")
var user_token = localStorage.getItem("user-token")

if (!user_token) {
    document.location.href = "index.html"
}
//
setInterval(callRender, 3000);

function callRender() {
    var elem = document.getElementsByClassName("comments")[0].classList;
    if (!elem.contains("hidden")) {
        this.getComments()
    }
}


document.getElementsByClassName("btn save")[0].addEventListener("click", onSaveChapter.bind(this), false);
document.getElementsByClassName("btn show-tree")[0].addEventListener("click", onShowBookTree.bind(this), false);
document.getElementById("btn-logout").addEventListener("click", onLogout.bind(this), false);
document.getElementsByClassName("btn finish")[0].addEventListener("click", onFinishChapter.bind(this), false);
document.getElementById("add-decision").addEventListener("click", addDecision.bind(this), false);
/*document.getElementsByClassName("chapter scroll")[0].addEventListener('scroll', onScrollBottom.bind(this));*/
document.getElementsByClassName("menu-bars")[0].addEventListener("click", showMenu.bind(this), false);
document.getElementById("add-comment").addEventListener("click", addComment.bind(this), false);

this.client = new Book_Client(init.bind(this), user_token)