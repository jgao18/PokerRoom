// function Executes on click of login button.
function clicked(){
	var user= document.getElementById("username").value;
	var pass= document.getElementById("password").value;

	var coruser="test";
	var corpass="123";

	if(user==coruser && pass==corpass){
			alert("You are logged in as"+ user);
			window.location="poker.html"//Redirecting to other page
			//return false;
		}
		else
		{
			window.alert("Incorrect username or password!");
		}
	}
