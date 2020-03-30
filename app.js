// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyA-jY35gl77Yli8qqCuFPt57-j5ZAVXnGc",
    authDomain: "registreabsence.firebaseapp.com",
    databaseURL: "https://registreabsence.firebaseio.com",
    projectId: "registreabsence",
    storageBucket: "registreabsence.appspot.com",
    messagingSenderId: "692146756912",
    appId: "1:692146756912:web:8b0c195a882e23440a7cf5"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Buttons 

$("#register").click(function(){
    $(".connection").css("display","none");
    $(".registration").css("display","flex");
})

$("#RReturn").click(function(){
    $(".connection").css("display","flex");
    $(".registration").css("display","none");
})