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

		var onBubblesPositionRequest = this.bubbles.onBubblesPositionRequest.bind(this.bubbles);

		var onBubblesPositionReceived = this.bubbles.onBubblesPositionReceived.bind(this.bubbles);

		this.server.on_message = function(author_id, data){
			var message = JSON.parse(data);
			if(message.type == "_pos_request_")
			{
				onBubblesPositionRequest();
			}
			else if(message.type == "_pos_response_")
			{
				onBubblesPositionReceived(message.content);
			}
		};
		this.server.on_user_connected = function(id){
		};

		this.server.on_user_disconnected = function( user_id ){
		};

	}

}

SyncClient.prototype.checkIfHost = function()
{
	if(Object.keys(this.server.clients).length > 1)
		return false;
	else
		return true;
}

SyncClient.prototype.getBubblesPosition = function()
{	
	var message = new Message("", "_pos_request_");
	this.server.sendMessage(JSON.stringify(message))
}

SyncClient.prototype.sendBubblesPosition = function(positions)
{	
	var message = new Message(positions, "_pos_response_");

	this.server.sendMessage(JSON.stringify(message));
}

class Message {
    constructor(content, type) {
        this.content = content;
        this.type = type;
    }
}