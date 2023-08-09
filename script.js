let interval;
let intervalId;
let isIntervalSet = false;

const form = document.getElementById("setInterval");
form.addEventListener("submit", (event) => {
    document.getElementById("time-interval").style.backgroundColor = "green";
    setTimeInterval(event);
});

const resetBtn = document.getElementById("reset-button");
resetBtn.addEventListener("click", reset);


function updateSecondsMin() {    //funtion to change the min value of seconds input if either one of hours or minutes input field is non zero
    let hrs = parseInt(document.getElementById("hours").value);
    let mins = parseInt(document.getElementById("minutes").value);
    let secondsInput = document.getElementById("seconds");
   
   if (hrs === 0 && mins === 0) {
       secondsInput.min = '5';
   } else {
       secondsInput.min = '0'; 
   }
}

function setTimeInterval(event) {  //for interval to send notifications
    event.preventDefault();
    clearInterval(intervalId);

    let hours = parseInt(document.getElementById("hours").value);
    let minutes = parseInt(document.getElementById("minutes").value);
    let seconds = parseInt(document.getElementById("seconds").value);
    isIntervalSet = true;

    interval = (hours * 3600 + minutes * 60 + seconds) * 1000;
}

async function sendRecurssiveJokes() { //function for sending notifications recurssively
    clearInterval(intervalId);
    if (!isIntervalSet) {
        alert("SET TIME INTERVAL")
    } else {
        fetchJokeAndShowNotification().then(() => {
            intervalId = setInterval(fetchJokeAndShowNotification, interval);
        })
    }
}

function reset(){ //reset as a whole
    resetOnChange();
    document.getElementById("hours").value = 0;
    document.getElementById("minutes").value = 0;
    document.getElementById("seconds").value = 0;
    document.getElementById("seconds").min = '5';
   
}

function resetOnChange(){ //reset when there in change in interval
    clearInterval(intervalId);
    isIntervalSet = false
    document.getElementById("time-interval").style.backgroundColor = "rgb(216, 102, 102)";
}

async function fetchJokeAndShowNotification() {  //fetching joke from api and displaying notification once
    const sound = new Audio('./soundEffect.wav'); 

    try {
        const response = await fetch('https://official-joke-api.appspot.com/random_joke');
        if (!response.ok) {
            throw new Error('Failed to fetch data.');
        }

        const data = await response.json();
        Notification.requestPermission().then((perm) => {
            if (perm === 'granted') {
                let notification = new Notification(data.setup, {
                    body: data.punchline,
                    tag: "Joke",
                    renotify: true,
                    silent: true
                });
                sound.play();
            } else {
                alert("PERMISSION DENIED");
            }
        });

    } catch (error) {
        console.error(error);
    }
}
