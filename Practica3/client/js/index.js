function userTokenReceived(user_token)
{	
	// TODO: check if there's an error
	localStorage.setItem("user_token", user_token)

	document.location.href = "all-books.html";
}

function onLoginClicked()
{
	var user = document.querySelector("input[name='username']");
	var password = document.querySelector("input[name='password']");

	if(!user || !password)
		alert("idiot");

	this.client.requestLogin(user, password, userTokenReceived)

}

function init() {

	document.getElementsByTagName("body")[0].style.display = "initial";
	document.getElementsByClassName("login-btn-lgn")[0].addEventListener("click", onLoginClicked.bind(this), false);
   
}

document.getElementsByTagName("body")[0].style.display = "none";
this.client = new Book_Client(init.bind(this))