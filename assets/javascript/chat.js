

//Functions for chat messaging
// function sendChatMessage() { 
//     ref = firebase.database().ref("/chat");
//     messageField = document.querySelector("#chat-message");

//     ref.push().set({
//         name: firebase.auth().currentUser.displayName,
//         message: messageField.value
//     })
// }

// ref = firebase.database().ref("/chat");

// ref.on("child_added", function(snapshot) { 
//     var message = snapshot.val();
//     addChatMessage(message.name, message.message);
// });