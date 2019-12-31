const MISSPELLEDWORDCOUNT = document.querySelector("#misspelledWordCount");
const WPM = document.querySelector("#wpm");
const ORIGINALTEXT = document.querySelector("#originalText").innerText;
const TEXTAREA = document.querySelector("textArea");
const CLOCK = document.querySelector("#clock");
const RESET = document.querySelector("#reset");
const SUMMARY = document.querySelector(".summary");
const CLOSESUMMARY = document.querySelector("#closeSummary");

var clockInterval;
var wpmInterval;
var timerRunning = false;
var millisecondsCounter = 0;
var secondsCounter = 0;
var wpmSecondsCounter = 0;
var wpm = 0;
var misspelledWordsCount = 0;

var originTextArray = ORIGINALTEXT.split(" ");

var Clock = {
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
    wpm = Math.trunc(wordsTyped / minutesPassed);

    WPM.innerHTML = wpm;
    return wpm;
}
//Function to change border color when there is a misspelled word
function spellCheck () {
    let inputText = TEXTAREA.value;
    let originTextSubstring = ORIGINALTEXT.substring(0, inputText.length);

    if (inputText == ORIGINALTEXT) {
        TEXTAREA.style.borderColor = "#33FFD5";
        summary();
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
    misspelledWordsCount = 0;
    let inputTextArray = inputText.split(" ");
    for (let i = 0; i < inputTextArray.length - 1; i++) {
        if (inputTextArray[i] != originTextArray[i]) {
            misspelledWordsCount++;
        }
    }
    MISSPELLEDWORDCOUNT.innerHTML = addLeadingZeros(misspelledWordsCount);
}

//Function to open pop up and display test statistics
function summary() {
    resetTimer();
    SUMMARY.querySelector("#statistics").innerHTML = "Misspelled words = " + misspelledWordsCount + " WPM = " + wpm;
    SUMMARY.style.display = "block";
}

function callAnalysis () {
    let inputText = TEXTAREA.value;
    spellCheck();
    misspelledWords(inputText);
}

//Reset timer and text area when the reset button is pressed
function resetTimer () {
    timerRunning = false;
    clearInterval(clockInterval);
    clearInterval(wpmInterval);
}

//The following are functions to reset document and script properties
function resetCall () {
    resetTimer();
    resetDocument();
    resetAnalysis();
}

function resetAnalysis() {
    wpm = 0;
    misspelledWordsCount = 0;
    MISSPELLEDWORDCOUNT.innerHTML = "00";
    WPM.innerHTML = "00";
}

function resetDocument (){
    clockInterval = null;
    Clock.minutes = 0;
    Clock.seconds = 0;
    millisecondsCounter = 0;
    TEXTAREA.value = "";
    TEXTAREA.style.borderColor = "#888";
    CLOCK.innerHTML = Clock.printClock();
}

CLOSESUMMARY.onclick = function () {
    SUMMARY.style.display = "none";
    resetCall();
};

TEXTAREA.addEventListener("keypress", startClock, false);
TEXTAREA.addEventListener("keyup", callAnalysis, false);
RESET.addEventListener("click", resetCall, false);