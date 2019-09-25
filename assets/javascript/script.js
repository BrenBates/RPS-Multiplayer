$(document).ready(function () {


 var firebaseConfig = {
    apiKey: "AIzaSyC5mbxor2QPARgNB8-pp4f02jGxgzeAAhY",
    authDomain: "rps-multiplayer-40acd.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-40acd.firebaseio.com",
    projectId: "rps-multiplayer-40acd",
    storageBucket: "",
    messagingSenderId: "583212189079",
    appId: "1:583212189079:web:c34a1113a726ec94feb0d2"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

let database = firebase.database();

//User Authentication Code

function submitCreateAccount() { 
    var displayName =  document.querySelector("#entry-displayname");
    var email = document.querySelector("#entry-email");
    var password = document.querySelector("#entry-password");

    firebase.auth().createUserWithEmailAndPassword(email.value,  password.value)
        .then(function(user) { 
            //add the displayName
            user.updateProfile({displayName: displayName.value});
        });

}

function signInWithEmailandPassword() { 
    var email  = document.querySelector("#email");
    var password = document.querySelector("#password");

    firebase.auth().signInWithEmailandPassword(email.value, password.value);
}

function googleSignin(googleUser) {
    var credential = firebase.auth.GoogleAuthProvider.credential({
        'idToken' : googleUser.getAuthResponse().id_token
    });
    firebase.auth().signInWithCredential(credential);
}


firebase.auth().onAuthStateChanged(authStateChangeListener);

function authStateChangeListener(user) {
    //signin
    if (user) {
        //do login operations...
        Chat.onlogin();
        Game.onlogin();
        } else { //signout
            window.location.reload();    
        }
}


//Functions for chat messaging
function sendChatMessage() { 
    ref = firebase.database().ref("/chat");
    messageField = document.querySelector("#chat-message");

    ref.push().set({
        name: firebase.auth().currentUser.displayName,
        message: messageField.value
    })
}

ref = firebase.database().ref("/chat");

ref.on("child_added", function(snapshot) { 
    var message = snapshot.val();
    addChatMessage(message.name, message.message);
});


//Functions for match-making

var STATE = {OPEN: 1, JOINED: 2};

// { 
//     "creator" : {"displayName": "Brennen", "uid": "1234567...1A5DAF6E1"},
//     "joiner" : {"displayName": "Bob", "uid": "1244567...1A5DAF6E1"},
//     "state": 2 //JOINED

// };




ref = firebase.database().ref("/games");

var openGames = ref.orderByChild("state").equalTo(STATE.OPEN);

//Function for creating a new game

function createGame() { 
    var user = firebase.auth().currentUser;
    var currentGame = {
        creator: {uid: user.uid, displayName: user.displayName},
        state: STATE.OPEN
    };

    ref.push().set(currentGame);
}


//Add join button when someone else adds a new game

openGames.on("child_added", function(snapshot) {
    var data = snapshot.val();
    //ignore our own games 
    if (data.creator.uid != firebase.auth().currentUser.uid) {
        addJoinGameButton(snapshot.key, data);
    }
});

//Function for joining a game

function joinGame(key) { 
    var user = firebase.auth().currentUser;
    var gameRef = ref.child(key);
    gameRef.transaction(function(game) { 
        if (!game.joiner) {
            game.state = STATE.JOINED;
            game.joiner = {uid: user.uid, displayName: user.displayName}
        }
        return game;
    })
}


//Removing a game

openGames.on("child_removed", function(snapshot) {
    var item = document.querySelector("#" + snapshot.key);
    if (item) {
        item.remove();
    }
});

function rpsGame(key) {
    var gameRef = ref.child(key);
    gameRef.on("value", function(snapshot) {
        var game = snapshot.val();
        switch (game.state) { 
            case STATE.JOINED: joinedGame(gameRef, game); break;
            // case 
            // case
            case STATE.COMPLETE: showWinner (game); break; 
        }})
};





});



// Instructions

// Create a game that suits this user story:
// Only two users can play at the same time.
// Both players pick either rock, paper or scissors. After the players make their selection, the game will tell them whether a tie occurred or if one player defeated the other.
// The game will track each player's wins and losses.
// Throw some chat functionality in there! No online multiplayer game is complete without having to endure endless taunts and insults from your jerk opponent.
// Styling and theme are completely up to you. Get Creative!
// Deploy your assignment to Github Pages.

