// BCD/Binary Clock
// Copyright 2014 by Lewis Berman
// V1 committed September 13, 2014

var horizontalSeparation = 37;
var verticalSeparation = 37;
var radius = 10;

// Current hr, min, sec are initialized to impossible values

var curHr = 13;
var curMin = 61;
var curSec = 61;

// Time check interval in milliseconds

var interval = 250;

var firstX;
var firstY;
var clockCanvas;
var clockContext; 

function drawCircle(context, xcenter, ycenter, radius, fillIt) {

    context.beginPath();
    context.arc(xcenter, ycenter, radius, Math.PI * 2, false);
    context.closePath();
    context.strokeStyle = "#222";
    context.stroke();

    if (fillIt) {
        context.fillStyle = "#0f0";
    }
    else {
        context.fillStyle = "#fff";
    }
    context.fill();
}

function fillCircle(context, xcenter, ycenter, radius) {

    this.drawCircle(context, xcenter, ycenter, radius, true);

}

function clearCircle(context, xcenter, ycenter, radius) {

    this.drawCircle(context, xcenter, ycenter, radius, false);

}

function drawInitialBCDClock() {

    numLEDsInColBCD = [2, 4, 3, 4, 3, 4];
    firstX = 20;
    firstY = 65;
    clockCanvas = document.getElementById("clockDisplay");
    clockContext = clockCanvas.getContext("2d");
    clockCanvas.height = "186";
    x = firstX;

    for (col = 0; col < numLEDsInColBCD.length; col++) {
        y = firstY;
        for (row = 0; row < numLEDsInColBCD[col]; row++) {
            this.drawCircle(clockContext, x, y, radius, false);
            y += verticalSeparation;
        }
        x += horizontalSeparation;
    }

    clockContext.fillStyle = '#0f0';
    clockContext.font = 'bold 15px sans-serif';
    clockContext.textBaseline = 'top';
    clockContext.fillText( 'h', firstX - radius/2, 32);
    clockContext.fillText( 'h', firstX + horizontalSeparation - radius/2, 32);
    clockContext.fillText( 'm', firstX + 2*horizontalSeparation - radius/2, 32);
    clockContext.fillText( 'm', firstX + 3*horizontalSeparation - radius/2, 32);
    clockContext.fillText ('s', firstX + 4*horizontalSeparation - radius/2, 32);
    clockContext.fillText ('s', firstX + 5*horizontalSeparation - radius/2, 32);
    clockContext.fillText ('24 HOUR BCD CLOCK', 33, 5);
}

function drawInitialBinaryClock() {

    firstX = 40;
    firstY = 54;
    numLEDsInRowBinary = [5,6,6];
    clockCanvas = document.getElementById("clockDisplay");
    clockContext = clockCanvas.getContext("2d");
    clockCanvas.height = "142";
    y = firstY;

    for (row = 0; row < numLEDsInRowBinary.length; row++) {
        x = firstX + (5 * horizontalSeparation);
        for (col = 0; col < numLEDsInRowBinary[row]; col++) {
            this.drawCircle(clockContext, x, y, radius, false);
            x -= horizontalSeparation;
        }
        y += verticalSeparation;
    }

    clockContext.fillStyle = '#0f0';
    clockContext.font = 'bold 15px sans-serif';
    clockContext.textBaseline = 'top';
    clockContext.fillText( 'h', 0, firstY - radius/2);
    clockContext.fillText( 'm', 0, firstY + verticalSeparation - radius/2);
    clockContext.fillText( 's', 0, firstY + 2*verticalSeparation - radius/2);
    clockContext.fillText ('24 HOUR BCD CLOCK', 33, 5);
}

function setLED (row, col) {
    x = firstX + col * horizontalSeparation;
    y = firstY + row * verticalSeparation;
    this.fillCircle(clockContext, x, y, radius);
}

function clearLED (row, col) {
    x = firstX + col * horizontalSeparation;
    y = firstY + row * verticalSeparation;
    this.clearCircle(clockContext, x, y, radius);
}

// Timer interval

var clockInterval;

// displayTimeFunction becomes assigned to whichever clock update function is in use.
var displayTimeFunction;

function setClock() {

    // Save previous second

    previousSec = curSec;
  
    // Get current hour, minute, and second

    datetime = new Date();
    curHr  = datetime.getHours();
    curMin = datetime.getMinutes();
    curSec = datetime.getSeconds();
    
    // Update the display only if second is different from previous

    if (curSec != previousSec) {
        // displayBCDTime(curHr, curMin, curSec);
        // displayBinaryTime(curHr, curMin, curSec);
        displayTimeFunction(curHr, curMin, curSec);
        displayTextualTime(curHr, curMin, curSec);
    }

}

function displayBinaryTime(hr, min, sec) {
        
    // Second
    
    firstDigit = sec;
    (firstDigit & 1) ? setLED(2,5) : clearLED(2,5);
    (firstDigit & 2) ? setLED(2,4) : clearLED(2,4);
    (firstDigit & 4) ? setLED(2,3) : clearLED(2,3);
    (firstDigit & 8) ? setLED(2,2) : clearLED(2,2);
    (firstDigit & 16) ? setLED(2,1) : clearLED(2,1);
    (firstDigit & 32) ? setLED(2,0) : clearLED(2,0);

    // Minute
    
    firstDigit = min;
    (firstDigit & 1) ? setLED(1,5) : clearLED(1,5);
    (firstDigit & 2) ? setLED(1,4) : clearLED(1,4);
    (firstDigit & 4) ? setLED(1,3) : clearLED(1,3);
    (firstDigit & 8) ? setLED(1,2) : clearLED(1,2);
    (firstDigit & 16) ? setLED(1,1) : clearLED(1,1);
    (firstDigit & 32) ? setLED(1,0) : clearLED(1,0);

    // Hour
    
    firstDigit = hr;
    (firstDigit & 1) ? setLED(0,5) : clearLED(0,5);
    (firstDigit & 2) ? setLED(0,4) : clearLED(0,4);
    (firstDigit & 4) ? setLED(0,3) : clearLED(0,3);
    (firstDigit & 8) ? setLED(0,2) : clearLED(0,2);
    (firstDigit & 16) ? setLED(0,1) : clearLED(0,1);
}

function pad(number, length) {

    var str = '' + number;

    while (str.length < length) {
        str = '0' + str;
    }

    return str;
}

function displayTextualTime(hr, min, sec) {

    // Display time as text in infoDiv

    timeTag.innerHTML = pad(curHr,2) + ":" + pad(curMin,2) + ":" + pad(curSec,2);

}

function displayBCDTime(hr, min, sec) {
        
    // Second
    
    firstDigit = sec % 10;
    (firstDigit & 1) ? setLED(0,5) : clearLED(0,5);
    (firstDigit & 2) ? setLED(1,5) : clearLED(1,5);
    (firstDigit & 4) ? setLED(2,5) : clearLED(2,5);
    (firstDigit & 8) ? setLED(3,5) : clearLED(3,5);
    
    tensec = sec / 10;
    (tensec & 1) ? setLED(0,4) : clearLED(0,4);
    (tensec & 2) ? setLED(1,4) : clearLED(1,4);
    (tensec & 4) ? setLED(2,4) : clearLED(2,4);
    
    // Minute
    
    firstDigit = min % 10;
    (firstDigit & 1) ? setLED(0,3) : clearLED(0,3);
    (firstDigit & 2) ? setLED(1,3) : clearLED(1,3);
    (firstDigit & 4) ? setLED(2,3) : clearLED(2,3);
    (firstDigit & 8) ? setLED(3,3) : clearLED(3,3);
    
    tenmin = min / 10;
    (tenmin & 1) ? setLED(0,2) : clearLED(0,2);
    (tenmin & 2) ? setLED(1,2) : clearLED(1,2);
    (tenmin & 4) ? setLED(2,2) : clearLED(2,2);
    
    // Hour
    
    firstDigit = hr % 10;
    (firstDigit & 1) ? setLED(0,1) : clearLED(0,1);
    (firstDigit & 2) ? setLED(1,1) : clearLED(1,1);
    (firstDigit & 4) ? setLED(2,1) : clearLED(2,1);
    (firstDigit & 8) ? setLED(3,1) : clearLED(3,1);
    
    tenhr = hr / 10;
    (tenhr & 1) ? setLED(0,0) : clearLED(0,0);
    (tenhr & 2) ? setLED(1,0) : clearLED(1,0);
}

function startClock() {

    clockInterval = setInterval(function() { setClock() }, interval);
    document.getElementById("startClock").disabled=true;
    document.getElementById("stopClock").disabled=false;
}

function stopClock() {

    clearInterval(clockInterval);
    document.getElementById("startClock").disabled=false;
    document.getElementById("stopClock").disabled=true;
}

function toggleInfo() {

    // Toggle (display or hide) information DIV

    state = document.getElementById("infoDiv").style.visibility;
    control = document.getElementById("information");

    if (state == 'hidden') {
        state = 'visible';
        control.value = "Hide Time Text";
    }
    else {
        state = 'hidden';
        control.value = "Show Time Text";
    }

    document.getElementById("infoDiv").style.visibility = state;
}

function switchMode(newMode) {

    if (newMode == 'bcd') {
        document.getElementById("binaryModeRadio").checked = false;
        drawInitialBCDClock();
        displayTimeFunction = displayBCDTime;
    }
    else if (newMode == 'binary') {
        document.getElementById("bcdModeRadio").checked = false;
        drawInitialBinaryClock();
        displayTimeFunction = displayBinaryTime;
    }
    else alert("Mode Error");
}

function kickoff() {

  // Initialize and kick off the clock

  document.getElementById("infoDiv").style.visibility = 'hidden';
  displayTimeFunction = displayBCDTime;
  switchMode('bcd');
  document.getElementById("bcdModeRadio").checked = 'true';
  startClock();
  document.getElementById("startClock").disabled=true;
}
