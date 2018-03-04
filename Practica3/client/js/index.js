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
function onRegisterClicked(){
	console.log("enter")
	document.getElementsByClassName("login-title")[0].innerText= "REGISTER";
	document.getElementById("input-username").classList.remove("hidden");
	document.getElementById("btn-login").classList.add("hidden");
	document.getElementById("btn-register").classList.remove("hidden")
	document.getElementsByClassName("login-btn-reg")[0].classList.add("hidden")
}

function init() {

	//document.getElementsByTagName("body")[0].style.display = "initial";
	document.getElementsByClassName("login-btn-lgn")[0].addEventListener("click", onLoginClicked.bind(this), false);
    document.getElementsByClassName("login-btn-reg")[0].addEventListener("click", onRegisterClicked.bind(this), false);
}

var user_token = localStorage.getItem("user-token")

if(user_token)
	document.location.href = "all-books.html";

//document.getElementsByTagName("body")[0].style.display = "none";
this.client = new Book_Client(init.bind(this))