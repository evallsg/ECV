var room_name = "Bubbles";
var timer = null;
var host = "84.89.136.194";
//connect to the server

class SyncClient
{

	constructor(bubbles)
	{
		this.bubbles = bubbles;
		this.server = new SillyClient();
		this.server.connect(host+":9000", room_name);

		this.server.on_ready = function( id ){
		};

		this.server.on_message = function(author_id, data ){
		};
		this.server.on_user_connected = function(id){
		};

		this.server.on_user_disconnected = function( user_id ){
		};

	}

}

SyncClient.prototype.checkIfHost = function()
{
	if(this.server.clients.length > 1)
		return false;
	else
		return true;
}

