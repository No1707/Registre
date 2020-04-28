"use strict"

// $(document).ready(function(){
    
// })

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
var db = firebase.firestore();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        const mail = user.email
        db.collection("élève").doc(mail).get().then(function(doc){
            if(doc.exists){
                $(".text2").append(`${doc.data().Prénom}`)
            } else {
                db.collection("professeur").doc(mail).get().then(function(doc){
                    if(doc.exists){
                        $(".text2").append(`${doc.data().Prénom}`)
                    } else {
                        db.collection("administration").doc(mail).get().then(function(doc){
                            if(doc.exists){
                                $(".text2").append(`${doc.data().Prénom}`)
                            }
                        })
                    }
                })
            }
        })
    } else {
      console.log("Aucun utilisateur connecté")
    }
  });

  window.setTimeout(function(){
    location.replace("registre.html")
  }, 7000)
