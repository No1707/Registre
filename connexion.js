"use strict"

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



// Gestionnaires d'évènements
$('#checkMail').on("submit",checkMail);
$('#notSignedUp').on('submit', newAccount);
$('#signedUp').on('submit', signIn);



// Check si l'utilisateur est déjà inscrit à la connexion

function checkMail(event){
    event.preventDefault();

    const mail = $("#Cemail").val()

    const docEleve = db.collection("élève").doc(mail)
    const docProf = db.collection("professeur").doc(mail)
    const docAdmin = db.collection("administration").doc(mail)

    docEleve.get().then(function(doc){
        $("#mailSpan").css("transform","translateY(-150%)")
        if(doc.exists){
            if(doc.data().firstCo == undefined){
                $("#Cemail").attr("readonly", true)
                $("#checkMailBtn").css("display","none")
                $("#notSignedUp").css("display","flex")
            } else {
                $("#Cemail").attr("readonly", true)
                $("#checkMailBtn").css("display","none")
                $("#signedUp").css("display","flex")
            }
        } else {
            docProf.get().then(function(doc){
                if(doc.exists){
                    if(doc.data().firstCo == undefined){
                        $("#Cemail").attr("readonly", true)
                        $("#checkMailBtn").css("display","none")
                        $("#notSignedUp").css("display","flex")
                    } else {
                        $("#Cemail").attr("readonly", true)
                        $("#checkMailBtn").css("display","none")
                        $("#signedUp").css("display","flex")
                    }
                } else {
                    docAdmin.get().then(function(doc){
                        if(doc.exists){
                            $("#Cemail").attr("readonly", true)
                            $("#checkMailBtn").css("display","none")
                            $("#signedUp").css("display","flex")
                        } else {
                            alert("Utilisateur non enregistré, demander la permission d'un administrateur.")
                        }
                    })
                }
            }).catch(function(error){
                console.log(error)
            })
        }
    }).catch(function(error){
        console.log(error)
    })
}



// Fonction de création de compte

function newAccount(event){
    event.preventDefault()

    if( $('#notSignedUpPass').val().length && $('#notSignedUpPass2').val().length >= 6){

        if( $('#notSignedUpPass').val() === $('#notSignedUpPass2').val() ){

            const mail = $('#Cemail').val();
            const password = $('#notSignedUpPass').val();
        
            firebase.auth().createUserWithEmailAndPassword(mail, password)
            .then(function(){
                db.collection("élève").doc(mail).get().then(function(doc){
                    if(doc.exists){
                        db.collection("élève").doc(mail).set({
                            firstCo: true
                        }, { merge: true }).then(function(){ location.replace("firstpage.html") })
                    } else {
                        db.collection("professeur").doc(mail).set({
                            firstCo: true
                        }, { merge: true }).then(function(){ location.replace("firstpage.html") })
                    }
                })
            })
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage)
                if(errorMessage == "The email address is already in use by another account."){
                    alert("Utilisateur déjà inscrit.")
                }
            });

        } else {
            $('#notSignedUpPass').css("border","2px red solid")
            $('#notSignedUpPass2').css("border","2px red solid")
            alert("Les mots de passes ne correspondent pas")
        }

    } else {
        $('#notSignedUpPass').css("border","2px red solid")
        $('#notSignedUpPass2').css("border","2px red solid")
        alert("Le mot de passe doit faire plus de 6 caractères")
    }
}



// Fonction de connexion

function signIn(event){
    event.preventDefault()

    const email = $('#Cemail').val();
    const password = $('#signedUpPass').val();
    

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(){
        console.log("signed in "+email)
        location.replace("firstpage.html")
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if(errorMessage == "There is no user record corresponding to this identifier. The user may have been deleted."){
            alert("Email incorrect ou utilisateur non enregistré.")
        }
        if(errorMessage == "Too many unsuccessful login attempts. Please try again later."){
            alert("Trop de tentatives ratées, réessayer dans quelques minutes")
        }
        if(errorMessage == "The password is invalid or the user does not have a password."){
            alert("Mot de passe incorrect")
        }
        console.log(errorMessage)
    });
}