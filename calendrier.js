let evenements = [{
    "title":"HTML/CSS",
    "start": "2020-04-21 01:17:00",
    "end": "2020-04-21 02:57:00"
}]
window.onload = () => {
    let elementCalendrier = document.getElementById("calendrier")

    //on instancie le calendrier
    let calendrier = new FullCalendar.Calendar(elementCalendrier, {
        //appelle les elements
        plugins: ['dayGrid','timeGrid','list'],
        defaultView: 'dayGridMonth',
        locale : 'fr' ,//langue
        //configuration des emplacement des differents elements du haut du calendrier
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
        events: evenements
    })
    calendrier.render()
}