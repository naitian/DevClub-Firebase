document.addEventListener('DOMContentLoaded', ready);

function ready() {
	const messageDiv = document.getElementById("messages");
}

function insertMessage(message, type) {
	const messageDiv = document.getElementById("messages");
	if(type == "self")
		messageDiv.innerHTML += `<div class="message right">${message}</div><br>`;
	else
		messageDiv.innerHTML += `<div class="message left">${message}</div><br>`;
}