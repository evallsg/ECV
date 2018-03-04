function userTokenReceived(user_token)
{	
	// TODO: check if there's an error
	localStorage.setItem("user-token", user_token)

	document.location.href = "all-books.html";
}

function onLoginClicked()
{
	var user = document.querySelector("input[name='email']").value;
	var password = document.querySelector("input[name='password']").value;

	if(!user || !password)
		alert("idiot");

	this.client.requestLogin(user, password, userTokenReceived)

}

function init() {

	//document.getElementsByTagName("body")[0].style.display = "initial";
	document.getElementsByClassName("login-btn-lgn")[0].addEventListener("click", onLoginClicked.bind(this), false);
   
}

var user_token = localStorage.getItem("user-token")

if(user_token)
	document.location.href = "all-books.html";

//document.getElementsByTagName("body")[0].style.display = "none";
this.client = new Book_Client(init.bind(this))