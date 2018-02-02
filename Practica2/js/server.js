var room_name = "Bubbles";
var timer = null;
var host = "84.89.136.194";
//connect to the server

var server = new SillyClient();
server.connect(host+":9000", room_name);

server.on_ready = function( id ){
};

server.on_message = function(author_id, data ){
};
server.on_user_connected = function(id){
};

server.on_user_disconnected = function( user_id ){
};