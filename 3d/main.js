/*$(document).ready( function(){
    renderContactList();
})*/
var room_name = "CHAT_Eva";
var timer = null;
var host = "84.89.136.194";
//connect to the server

var server = new SillyClient();
server.connect(host+":9000", room_name);
var defaultAvatar = "http://www.yesfintech.com/data/cms/yft_teams/4f7fe56b7abeeab4fea116b4f7f130ff_unknown-user.jpg";
var userTemp = document.querySelector("#user");
var contactList = document.querySelector('ul.contact-list');
var sentTemp = document.querySelector("#sent-msg");
var replyTemp = document.querySelector("#replies-msg");
var chatMessages = document.querySelector('ul.conversation-template');
var profileImg = document.querySelector("#profile-img");
var chat= document.querySelector("#chat-name");
var chatImg = document.querySelector("img.contact-profile-img");
var chatRoom = new Chat(room_name);
var me;
var usersList =[];
var chats =[];
setInterval(renderContactList,3000)
//this method is called when the user gets connected to the server
server.on_ready = function( id ){
    //user connected to server
    me = new User("User "+id, defaultAvatar, id ," ");
    chat.innerHTML= room_name;
    chatImg.src = "imgs/room.png";
    me.id = id;
    console.log("I'm connected with id " + id );
    renderProfile();
};
server.getRoomInfo( room_name, function(room_info){ 
    room_info.clients.forEach(function (user_id){
        var client = new User("User "+ user_id, defaultAvatar, user_id ," " );
        usersList.push(client);
    });
} );
//this methods receives messages from other users (author_id its an unique identifier)
server.on_message = function(author_id, data ){
   var data = JSON.parse(data);
   data.id = author_id;
   chatRoom.reciveMessage(data);
   
}

server.on_user_connected = function(id){
    //new user! 
   var user = new User("User "+ id, defaultAvatar, id, " ");
   usersList.push(user);
   renderContactList();
    
}
server.on_user_disconnected = function( user_id ){
    var elem = document.getElementById(user_id);
    if(getUserById(user_id)|| elem!= null){
        elem.parentNode.removeChild(elem);
        usersList.forEach(function(user){
            if(user.id == parseInt(user_id)){
                var i = usersList.indexOf(user);
                delete usersList[i];
            }
        });
    }   
}

//Send message on press Enter
var message = document.getElementById("reply-msg");
message.addEventListener("keyup", function(event) {
    event.preventDefault();
    
    if (event.keyCode === 13) {
         var msg = this.value;
        this.value = "";
        chatRoom.sendMessage(msg, "message");   
    }
});

//Change profile image
avatarFile = document.querySelector("#my-avatar-file");
avatarURL = document.querySelector("#my-avatar-url");

avatarFile.addEventListener("change", function(event){
    avatarURL.value="";
    var tmppath = URL.createObjectURL(event.target.files[0]);
    me.avatar = tmppath;
    chatRoom.sendMessage("", "data-info");
    renderProfile(me)
});

avatarURL.addEventListener("change", function(event){
    avatarFile.value="";
    if((avatarURL.value != undefined)&&(avatarURL.value.includes("http") || avatarURL.value.includes(host))){
        me.avatar = avatarURL.value;
        chatRoom.sendMessage("", "data-info");
        renderProfile(me)
    }
    else{
        alert('ERROR: Wrong format')
    }
});
window.addEventListener('popstate', function(e){
    e.preventDefault();
    var userId = window.location.hash.split("=")[1];
    var user = getUserById(userId);
   /* if(!user){
       renderChat(user);
    }*/
});

contactList.addEventListener("click", function(event){
    event.preventDefault();
    var active = document.querySelector("li.active");
    if(active!= null){
       active.classList.toggle("active");
    }
    var userId = event.path[3].id;
    var el = document.getElementById(userId);
    if(el!=null){
        document.getElementById(userId).classList.toggle("active")
        window.location.hash ="id="+ userId;
        var chat = getChat(userId);
        if(!chat){
            chat = new Chat(userId);
            chats.push(chat);
        }
    }
    
});

var gifs = document.querySelector("div.expanded-gifs");
gifs.addEventListener("click", function(event){
    var data = event.path[0].attributes;
    if(data.class ==undefined){
        var gif = data.src.nodeValue;
        chatRoom.sendMessage(gif, "media");
    }
})

function getChat(name){
    chats.forEach(function(chat){
        if(chat.name == name){
            return chat;
        }
    });
    return false;
}

function getUserById(user_id){
    usersList.forEach(function(user){
        if(user.id == parseInt(user_id)){

            return false;
        }
    });
    return user;
}
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes //+ ' ' + ampm;
    return strTime;
}           

/*User.prototype.say  = function (msg){
        console.log ("L'usuari "+ this.name+ " ha dit "+ msg)
}*/

/*function request(url,callback){


    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(e){
        if(xmlhttp.state==4 &&xmlhttp.status=200){
            var data = xmlhttp.responseText;
            var headers = this.getAllResponseHeaders();
            if(headers.indexOf("application/json")!=-1){
                var data = JSON.parse(data);
                        callback(data);

            }
        }

    };
    xmlhttp.open("GET",url, true);
    xmlhttp.send();
    return xmlhttp;
}
request("datos.json",function(data){ //datos.json es un fitxer amb dades
    for(var i in data){
        var user = data[i];

    }
    
})
*/
