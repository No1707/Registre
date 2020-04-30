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


let evenements = []


let elementCalendrier = document.getElementById("calendrier")

// création du calendrier
let calendrier = new FullCalendar.Calendar(elementCalendrier, {
    //appelle les elements
    plugins: ['dayGrid','timeGrid','list'],
    contentHeight: 700,
    defaultView: 'timeGridWeek',
    locale : 'fr' ,//langue
    header: {
        left:'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,list'
    },
    buttonText: {
        today:"Aujourd'hui",
        month:"Mois",
        week:"Semaine",
        list:"liste",
    },
    events: evenements,
    nowIndicator: true
})
calendrier.render()


// fonction de re-rendering du calendrier

function rerender(){
    $("#calendrier").html("")
    calendrier = new FullCalendar.Calendar(elementCalendrier, {
        //appelle les elements
        plugins: ['dayGrid','timeGrid','list'],
        contentHeight: 700,
        defaultView: 'timeGridWeek',
        locale : 'fr' ,//langue
        header: {
            left:'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,list'
        },
        buttonText: {
            today:"Aujourd'hui",
            month:"Mois",
            week:"Semaine",
            list:"liste",
        },
        events: evenements,
        nowIndicator: true,
        eventClick: function(info){
            displayRegister(info.event)
        }
    })
    calendrier.render()
}


// Display les cours dans le calendrier 

function calChange(){
    const value = $("#selectClassesCalendar").val()

    db.collection("Cours").doc(value).collection("All").onSnapshot(function(querySnapshot){
        evenements = []
        querySnapshot.forEach(function(doc){
            const oldDate = doc.id
            let newDate = oldDate.split(" ")

            let cours = {
                "title": doc.data().Matière,
                "start": doc.id,
                "end": newDate[0]+" "+doc.data().Fin
            }
            evenements.push(cours)
            rerender()
        })
        
    })
}


// Initialisation des gestionnaires d'événement

//Back-end
$("#delClassBtn").on("click", delClass)
$("#confirmAddClass").on("click", confirmAddClass)
$('#addUserForm').on('submit', onAddUser);
$("#signOutBtn").on("click", disconnect);
$("#addCourseForm").on('submit', addCourse)
$("#modifUserForm").on("submit", confirmModif)
$("#courseInfosConf").on("click", studInfos)
function rerunBtns(){
    $(".supprBtn").on("click", supprUser )
    $(".modifBtn").on("click", modifUser ) 
}

//Front-end
$("#closeW").on("click", () => $(".courseInfos").css("display","none"))
$("#addClassBtn").on("click", () => $("#inputAddClass").css("display","block"))
$("#selectClasses").change(displayUsers)
$("#selectClassesCalendar").change(calChange)
$("#addUserBtn").on("click", () => $("html, body").animate({scrollTop: $(".mid").offset().top - 200}))
$("#addCourseBtn").on("click", () => $("html, body").animate({scrollTop: $(".mid").offset().top - 200}))
$("#displayClasses").on("click", () => $("html, body").animate({scrollTop: $("#newTable").offset().top}, 600))
$("#EDT").on("click", () => $("html, body").animate({scrollTop: $(".main").offset().top}, 600))
$("#etudes").change( () => {if( $("#etudes").val() == "élève"){$("#displayIf").css("display","block")} else { $("#displayIf").css("display","none")}})
$("#editUsersBtn").on("click", () => {
    $(".editBtns").css("display","table-cell")
    rerunBtns()
})

// Afficher menu absences / retards du cours

function displayRegister(e){
    $(".courseInfos").css("display","flex")
    $(".courseStudents").html("")
    const classe = $("#selectClassesCalendar").val()

    window.date = moment(e.start).format('YYYY-MM-DD hh:mm:ss');

    
    db.collection("Cours").doc(classe).collection("All").doc(date).get().then(function(doc){
        if(doc.exists){
            if(doc.data().firstList == "true"){
                $("#courseInfosConf").css("dispay","none")
                $("#closeW").css("dispay","block")
                db.collection("Cours").doc(classe).collection("All").doc(date).collection("élèves").onSnapshot(function(querySnapshot){
                    $(".courseStudents").html("")
                    querySnapshot.forEach(function(doc){
                        $(".courseStudents").append(`
                        <tr>
                            <td>${doc.data().Prénom}</td>
                            <td>${doc.data().Nom}</td>
                            <td>${doc.data().Status}</td>
                        </tr>
                        `)
                    })
                })
            } else {
                $("#courseInfosConf").css("dispay","block")
                db.collection("élève").where("Classe", "==", classe).onSnapshot(function(querySnapshot){
                    $(".courseStudents").html("")
                    querySnapshot.forEach(function(doc){
                        $(".courseStudents").append(`
                            <tr class="studentStatus">
                                <td>${doc.data().Nom}</td>
                                <td>${doc.data().Prénom}</td>
                                <td><select name="status" class="${doc.data().Mail}">
                                    <option value="define">à définir</option>
                                    <option value="présent">présent(e)</option>
                                    <option value="retard">retard</option>
                                    <option value="absent">absent(e)</option>
                                    </select>
                                </td>
                            </tr>
                        `)
                    })
                })
            }
            $("#displayMat").html("")
            $("#displayEns").html("")
            $("#displayDat").html("")
            $("#displayHeu").html("")

            $("#displayMat").append(`${doc.data().Matière}`)
            $("#displayEns").append(`${doc.data().Enseignant}`)
            $("#displayDat").append(`${doc.data().Date}`)
            $("#displayHeu").append(`${doc.data().Début}&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;${doc.data().Fin}`)
        } else {
            const val = date.slice(11, 13)
            switch(val){
                case "01": let val0 = date.split("")
                val0.splice(11, 2, "1", "3")
                window.newDate = val0.join("")
                break;
                case "02": let val1 = date.split("")
                val1.splice(11, 2, "1", "4")
                window.newDate = val1.join("")
                break;
                case "03": let val2 = date.split("")
                val2.splice(11, 2, "1", "5")
                window.newDate = val2.join("")
                break;
                case "04": let val3 = date.split("")
                val3.splice(11, 2, "1", "6")
                window.newDate = val3.join("")
                break;
                case "05": let val4 = date.split("")
                val4.splice(11, 2, "1", "7")
                window.newDate = val4.join("")
                break;
                case "06": let val5 = date.split("")
                val5.splice(11, 2, "1", "8")
                window.newDate = val5.join("")
                break;
                case "07": let val6 = date.split("")
                val6.splice(11, 2, "1", "9")
                window.newDate = val6.join("")
                break;
                case "08": let val7 = date.split("")
                val7.splice(11, 2, "2", "0")
                window.newDate = val7.join("")
                break;
                case "09": let val8 = date.split("")
                val8.splice(11, 2, "2", "1")
                window.newDate = val8.join("")
                break;
                case "10": let val9 = date.split("")
                val9.splice(11, 2, "2", "2")
                window.newDate = val9.join("")
                break;
                case "11": let val10 = date.split("")
                val10.splice(11, 2, "2", "3")
                window.newDate = val10.join("")
                break;
            }
            date = newDate
            db.collection("Cours").doc(classe).collection("All").doc(date).get().then(function(doc){
                $("#displayMat").html("")
                $("#displayEns").html("")
                $("#displayDat").html("")
                $("#displayHeu").html("")

                $("#displayMat").append(`${doc.data().Matière}`)
                $("#displayEns").append(`${doc.data().Enseignant}`)
                $("#displayDat").append(`${doc.data().Date}`)
                $("#displayHeu").append(`${doc.data().Début}&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;${doc.data().Fin}`)

                if(doc.data().firstList == "true"){
                    db.collection("Cours").doc(classe).collection("All").doc(date).collection("élèves").onSnapshot(function(querySnapshot){
                        $(".courseStudents").html("")
                        querySnapshot.forEach(function(doc){
                            $(".courseStudents").append(`
                            <tr>
                                <th>${doc.data().Prénom}</th>
                                <th>${doc.data().Nom}</th>
                                <th>${doc.data().Status}</th>
                            </tr>
                            `)
                        })
                    })
                } else {
                    db.collection("élève").where("Classe", "==", classe).onSnapshot(function(querySnapshot){
                        $(".courseStudents").html("")
                        querySnapshot.forEach(function(doc){
                            $(".courseStudents").append(`
                                <tr class="studentStatus">
                                    <td>${doc.data().Nom}</td>
                                    <td>${doc.data().Prénom}</td>
                                    <td><select name="status" class="${doc.data().Mail}">
                                        <option value="define">à définir</option>
                                        <option value="présent">présent(e)</option>
                                        <option value="retard">retard</option>
                                        <option value="absent">absent(e)</option>
                                        </select>
                                    </td>
                                </tr>
                            `)
                        })
                    })
                }
            })
        }
    })
}


// Confirmation des infos d'absences / retard envoyés à la database

function studInfos(){
    const classe = $("#selectClassesCalendar").val()
    const ref = db.collection("Cours").doc(classe).collection("All").doc(date)

    $(".courseInfos").css("display","none")

    
            $(".studentStatus").each(function(){
                const prénom = $(this).children("td").eq(0).text()
                const nom = $(this).children("td").eq(1).text()
                const status = $(this).children("td").eq(2).children().val()
        
                ref.collection("élèves").doc().set({
                    Nom: nom,
                    Prénom: prénom,
                    Status: status
                },{merge: true})
            })
            ref.set({
                firstList: "true"
            },{merge: true})
            alert("Liste enregistré !")
}

// Ajout classe database

function confirmAddClass(){

    const newClass = $("#addInput").val().toLowerCase()

    db.collection("Classes").doc(newClass).get().then(function(doc){
        if(doc.exists){
            alert("Cette classe existe déjà")
        } else {
            if( newClass.length >= 3 ){
                db.collection("Classes").doc(newClass).set({
                    Students: 0
                }).then(function(){
                    $("#inputAddClass").css("display","none")
                    alert("Classe créée")
                })
            }
        }
    })
}

// Suppr class database

function delClass(){
    
    const selectClass = $("#selectClasses").val()
    
    if( selectClass.length > 2 ){
        db.collection("Classes").doc(selectClass).delete().then(function(){
            alert("Classe supprimée")
        }).catch(function(error){
            alert("Check la console")
            console.log("Error removing document: ", error);
        })
    }
}


// Affichage des classes dans le menu select du tableau et de la navbar


db.collection("Classes").onSnapshot(function(querySnapshot){
    $(".studentClass").remove()
    $(".studentClassCalendar").remove()
    querySnapshot.forEach(function(doc) {
        $("#selectClasses").append(`
            <option class="studentClass" value="${doc.id}">${doc.id}</option>
        `)
        $("#selectClassesCalendar").append(`
            <option class="studentClassCalendar" value="${doc.id}">${doc.id}</option>
        `)
    });
});


// Supprimer informations de l'utilisateur

function supprUser(){
    const td = $(this).attr("class").split(" ")[0]

    if( $("#selectClasses").val() == "professeurs"){
        db.collection("professeur").doc(td).delete().then(function() {
            console.log("Document successfully deleted!");
            alert("Utilisateur supprimé avec succés")
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    } else {
        db.collection("élève").doc(td).delete().then(function() {
            console.log("Document successfully deleted!");
            alert("Utilisateur supprimé avec succés")
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }
}


// Modifier information de l'utilisateur

function modifUser(){
    const td = $(this).attr("class").split(" ")[0]
    $("html, body").animate({scrollTop: $("html").height()})
    
    if( $("#selectClasses").val() == "professeurs"){
        db.collection("professeur").doc(td).get().then(function(doc){
            if(doc.exists){
                $("#Mclasse").prop("required",false)
                $("#displayM").css("display","none")
                $("#Mnom").val(doc.data().Nom)
                $("#Mprénom").val(doc.data().Prénom)
                $("#Memail").val(doc.data().Mail)
            }
        })
    } else {
        db.collection("élève").doc(td).get().then(function(doc){
            if(doc.exists){
                $("#Mclasse").prop("required",true)
                $("#displayM").css("display","block")
                $("#Mnom").val(doc.data().Nom)
                $("#Mprénom").val(doc.data().Prénom)
                $("#Memail").val(doc.data().Mail)
                $("#Mclasse").val(doc.data().Classe)
            }
        })
    }
}

// Confirmation des modifications de l'utilisateur

function confirmModif(event){
    event.preventDefault()

    const nom = $("#Mnom").val()
    const prénom = $("#Mprénom").val()
    const mail = $("#Memail").val()

    if( $("#selectClasses").val() == "professeurs"){
        db.collection("professeur").doc(mail).set({
            Nom: nom,
            Prénom: prénom,
            Mail: mail
        })
    } else {
        const classe = $("#Mclasse").val()
        db.collection("élève").doc(mail).set({
            Nom: nom,
            Prénom: prénom,
            Mail: mail,
            Classe: classe
        })
    }
}

// Ajouter utilisateurs à la database

function onAddUser (event) {
    event.preventDefault();

    const nom = $('#nom').val();
    const prénom = $('#prénom').val();
    const grade = $('#etudes').val();
    const email = $('#email').val();
    const classe = $('#classe').val();

    if( nom.length >= 2 && prénom.length >= 2){
        db.collection(grade).doc(email).get().then(function(doc){
            if(doc.exists){
                $('#email').css("border","2px red solid")
                alert("Ce mail a déjà été enregistré, l'utilisateur a dû recevoir un mail l'invitant à s'inscrire.") 
            } else {
                if( $("#displayIf").css("display") == "block" ){
                    db.collection(grade).doc(email).set({
                        Nom: nom,
                        Prénom: prénom,
                        Rôle: grade,
                        Mail: email,
                        Classe: classe
                    })
                    .then(function () {
                        console.log("Document successfully written!");
                        alert("L'utilisateur a été enregistré, un mail lui a été envoyé, il se peut qu'il soit dans sa boîte Spam.")
    
                        Email.send({
                            Host: "smtp.gmail.com",
                            Username : "nolanseb08@gmail.com",
                            Password : "MkeKyou08",
                            To : email,
                            From : "nolanseb08@gmail.com",
                            Subject : "Enregistrement sur le registre de Sèb & Nolan",
                            Body : "Bonjour, un administrateur vous a enregistré sur le registre de Sèb et Nolan ! Rendez-vous à l'adresse suivante: '...'. Bienvenue !"
                        }).catch(function(error){
                            console.log(error)
                            alert("Une erreur s'est produite lors de l'envoi du mail, ouvrir la console.")
                        });
                    })
                    .catch(function (error) {
                        console.error("Error writing document: ", error);
                        alert("Il y a eu une erreur à l'enregistrement de l'utilisateur, ouvrir console")
                    });
                } else {
                    db.collection(grade).doc(email).set({
                        Nom: nom,
                        Prénom: prénom,
                        Rôle: grade,
                        Mail: email
                    })
                    .then(function () {
                        console.log("Document successfully written!");
                        alert("L'utilisateur a été enregistré, un mail lui a été envoyé, il se peut qu'il soit dans sa boîte Spam.")
    
                        Email.send({
                            Host: "smtp.gmail.com",
                            Username : "nolanseb08@gmail.com",
                            Password : "MkeKyou08",
                            To : email,
                            From : "nolanseb08@gmail.com",
                            Subject : "Enregistrement sur le registre de Sèb & Nolan",
                            Body : "Bonjour, un administrateur vous a enregistré sur le registre de Sèb et Nolan ! Rendez-vous à l'adresse suivante: '...'. Bienvenue !"
                        }).catch(function(error){
                            console.log(error)
                            alert("Une erreur s'est produite lors de l'envoi du mail, ouvrir la console.")
                        });
                    })
                    .catch(function (error) {
                        console.error("Error writing document: ", error);
                        alert("Il y a eu une erreur à l'enregistrement de l'utilisateur, ouvrir console")
                    });
                }
            }
        });
    } else {
        $("#nom").css("border","2px red solid")
        $("#prénom").css("border","2px red solid")
        alert("Le nom ou le prénom  est / sont  trop courts")
    }
}



// Fonction de déconnexion

function disconnect(event){
    event.preventDefault();

    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        alert("Disconnected")
        location.replace("connexion.html")
    }).catch(function(error) {
        // An error happened.
    });
}



// Ajouter cours à la database

function addCourse(event){
    event.preventDefault()

    const classe = $("#classCourse").val().toLowerCase()
    const matière = $("#matière").val().toLowerCase()
    const prof = $("#enseignant").val()
    const date = $("#date").val()
    const start = $("#start").val()
    const end = $("#end").val()

    let oldDate = date.split("/")
    oldDate.reverse()
    let newDate = oldDate.join("-")

    db.collection("Cours").doc(classe).collection("All").doc(newDate+" "+start).set({
        Date: date,
        Matière: matière,
        Enseignant: prof,
        Début: start,
        Fin: end
    }).then(function(){
        alert("Cours ajouté !")
        $("#classCourse").val("")
        $("#matière").val("")
        $("#date").val("")
        $("#start").val("")
        $("#end").val("")
    })
}



// Afficher élèves dans tableau

function displayUsers(){

    const selectClass = $("#selectClasses").val().toLowerCase()

    if( $("#selectClasses").val() == "professeurs"){
        db.collection("professeur").onSnapshot(function(querySnapshot){
            $(".studentsRow").remove()
            querySnapshot.forEach(function(doc) {
                    $("#Students").append(`
                    <tr class="studentsRow">
                        <td>${doc.data().Nom}</td>
                        <td>${doc.data().Prénom}</td>
                        <td class="editBtns"><button class="${doc.data().Mail} neumorph modifBtn" data-toggle="collapse" data-target="#modifUserDiv">Modifier</button><button class="${doc.data().Mail} neumorph supprBtn">Supprimer</button></td>
                    </tr>
                    `)
                    $("#nbrStud").empty()
            })
        })
    } else {
        db.collection("élève").onSnapshot(function(querySnapshot){
            $(".studentsRow").remove()
            let nbrStud = 0
            querySnapshot.forEach(function(doc) {
                if(doc.data().Classe == selectClass){
                    $("#Students").append(`
                    <tr class="studentsRow">
                        <td>${doc.data().Nom}</td>
                        <td>${doc.data().Prénom}</td>
                        <td class="editBtns"><button class="${doc.data().Mail} neumorph modifBtn" data-toggle="collapse" data-target="#modifUserDiv">Modifier</button><button class="${doc.data().Mail} neumorph supprBtn">Supprimer</button></td>
                    </tr>
                    `)
                    nbrStud++
                    $("#nbrStud").empty()
                    $("#nbrStud").append(`${nbrStud} étudiants`)
                }
            })
        })
    }
}



// Affichage de l'adresse mail de l'utilisateur connecté

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        $("#tagMail ").append(`
            ${user.email}
        `)
        console.log(user)
        db.collection("administration").doc(user.email).get().then(function(doc){
            if(doc.exists){
                $(".adminDisplay").css("display","block")
            } else {
                $(".adminDisplay").css("display","none")
            }
        })
    } else {
      // No user is signed in.
      console.log("Aucun utilisateur connecté")
    }
});