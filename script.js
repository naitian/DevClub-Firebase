document.addEventListener('DOMContentLoaded', ready);

var ref = new Firebase("devclub-chat-app.firebaseio.com");
var sender = "Naitian Zhou";

ref.on("value", (data) => {
    data = data.val();
    if(data)
        console.log("yes");
});


//Called when document is loaded.
function ready() {
    //Gets the input text box
    const input = document.getElementById("input");

    //Triggers when a key is pressed while focused on the input
    input.addEventListener("keypress", (e) => {
        //Check for pressing enter key
        if(e.keyCode == 13){
            //Sends message
            sendMessage(input.value);

            //Clears the input text box
            input.value = "";
        }
    });
    
    //Places focus on the input text box when any part of the page is pressed.
    document.getElementsByTagName("body")[0].addEventListener("click", () => {
        input.focus();
    });
}

//Inserts the message into the DOM
function insertMessage(message, sender) {
    //Gets message container div
    const messageDiv = document.getElementById("messages");
    messageDiv.innerHTML += `<div class="wrapper"><div class="message">${sender}: ${message}</div></div>`;
    scroll();
    document.getElementsByClassName("message")[document.getElementsByClassName("message").length -1 ].style.opacity = 1;
}

function scroll() {
	const messageDiv = document.getElementById("messages");
	for(var i = messageDiv.scrollTop; i < messageDiv.scrollHeight; i++)
		messageDiv.scrollTop = messageDiv.scrollHeight;
}

function sendMessage(message) {
    if(message.trim().length > 0) {
        var messageRef = ref.child("messages");
        var newMessage = messageRef.push();
        newMessage.set({
            sender: sender,
            message: message
        });
    }
}

function clearScreen() {
    const messageDiv = document.getElementById("messages");
    messageDiv.innerHTML = "";
}

ref.child("/messages").on("value", (snapshot) => {
    var data = snapshot.val();
    clearScreen();
    for (var message in data) {
        message = data[message];
        insertMessage(message.message, message.sender);
    }
});
