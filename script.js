const MISSPELLEDWORDCOUNT = document.querySelector("#misspelledWordCount");
const WPM = document.querySelector("#wpm");
const ORIGINALTEXT = document.querySelector("#originalText").innerHTML;
const TEXTAREA = document.querySelector("textArea");
const CLOCK = document.querySelector("#clock");
const RESET = document.querySelector("button");

var clockInterval;
var wpmInterval;
var timerRunning = false;
var millisecondsCounter = 0;
var secondsCounter = 0;
var wpmSecondsCounter = 0;

var originTextArray = ORIGINALTEXT.split(" ");

const Clock = {
    minutes: 0,
    seconds: 0,
    updateTime: function () {
        Clock.seconds = Math.trunc(secondsCounter % 60);
        Clock.minutes = Math.floor(secondsCounter / 60);
    },

    printClock: function () {
        return addLeadingZeros(Clock.minutes) + ":" + addLeadingZeros(Clock.seconds);
    }
};

function addLeadingZeros(value) {
    if (value <= 9){
        value = "0" + value;
    }
    return value;
}

//Function to start clock
function startClock () {
    let inputTextLength = TEXTAREA.value.length;
    if (inputTextLength === 0 && !timerRunning) {
        timerRunning = true;
        clockInterval = setInterval(runTimer, 10);
        wpmInterval = setInterval(wordsPerMinute, 1000);
    }
}
//Function to run timer
function runTimer () {
    CLOCK.innerHTML = Clock.printClock();
    millisecondsCounter += 10; //interval runs every 10 milliseconds
    secondsCounter = millisecondsCounter / 1000;
    Clock.updateTime();
}
//Function to count words per minute
function wordsPerMinute() {
    wpmSecondsCounter++;
    let inputText = TEXTAREA.value;
    let minutesPassed = wpmSecondsCounter / 60;
    let wordsTyped = inputText.length / 5; //1 word counts as 5 characters
    let wpm = Math.trunc(wordsTyped / minutesPassed);

    WPM.innerHTML = wpm;
    return wpm;
}
//Function to change border color when there is a misspelled word
function spellCheck () {
    let inputText = TEXTAREA.value;
    let originTextSubstring = ORIGINALTEXT.substring(0, inputText.length);

    if (inputText == ORIGINALTEXT) {
        //TODO popup window showing final wpm and misspelled word count
        resetTimer();
        TEXTAREA.style.borderColor = "#33FFD5";
    }
    else {
        if (inputText == originTextSubstring) {
            TEXTAREA.style.borderColor = "#000CED";
        }
        else {
            TEXTAREA.style.borderColor = "#FF3333";
        }
    }
}

//Function to find misspelled words count
function misspelledWords (inputText) {
    let misspelledWordCount = 0;
    let inputTextArray = inputText.split(" ");
    for (let i = 0; i < inputTextArray.length - 1; i++) {
        if (inputTextArray[i] != originTextArray[i]) {
            misspelledWordCount++;
        }
    }
    MISSPELLEDWORDCOUNT.innerHTML = addLeadingZeros(misspelledWordCount);
}



//Reset timer and text area when the reset button is pressed
function resetTimer () {
    timerRunning = false;
    clearInterval(clockInterval);
    clockInterval = null;
    Clock.minutes = 0;
    Clock.seconds = 0;
    millisecondsCounter = 0;

    TEXTAREA.value = "";
    TEXTAREA.style.borderColor = "#888";
    CLOCK.innerHTML = Clock.printClock();
    console.log("Reset button was pressed");
}

function resetAnalysis() {
    MISSPELLEDWORDCOUNT.innerHTML = "00";
    WPM.innerHTML = "00";
}

function resetCall () {
    resetTimer();
    resetAnalysis();
}
function callAnalysis () {
    let inputText = TEXTAREA.value;
    spellCheck();
    misspelledWords(inputText);
}

TEXTAREA.addEventListener("keypress", startClock, false);
TEXTAREA.addEventListener("keyup", callAnalysis, false);
RESET.addEventListener("click", resetCall, false);


//keypress event occurs when a key is pressed but no output is committed to the UI