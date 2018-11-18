//perfect day = coldish, cloudy, not raining.
//perfect temp 65
//api key 80dc2b2246004f62b5b6023418181;
let avgTemp = 0;
let isSunny = false;
let apiPrecp = false;
let finalfdi = 0;
let apiImg = null;

function preload() {


}

function setup() {
    loadJSON("http://api.apixu.com/v1/forecast.json?key=80dc2b2246004f62b5b60234181811&q=Boston&days=1", apiCallback);
    finalfdi = CalcFDI(avgTemp, isSunny, apiPrecp);
    console.log(finalfdi);
}

function draw() {
    createCanvas(500, 500);
    textAlign(CENTER);
    rectMode(CENTER);
    background(255);
    textSize(32);
    fill(0);
    text("Fran Danger Index Calculator", width / 2, 50);
    text("Today's FDI is", width / 2, 150);
    fill(255, 0, 255);
    text(finalfdi, width / 2, 200);
    noFill()
    stroke(0);
    rect(width / 2, 160, 250, 110);


}

function apiCallback(data) {
    //console.log(data.forecast.forecastday[0].day.condition.text);
    let cond = data.forecast.forecastday[0].day.condition.text;
    avgTemp = data.forecast.forecastday[0].day.avgtemp_f;
    let precep = data.forecast.forecastday[0].day.totalprecip_in;
    if (cond != "Sunny" && cond != "Clear") {
        isSunny = false;
    }
    if (precep > 0) {
        apiPrecp = true;
    }
}

function calcTemp(temp) {
    if (temp > 65)
        return map(temp, 65, 110, 0, 70);
    else {
        return map(temp, -18, 65, 30, 0);
    }
}

function CalcFDI(temp_, preceptitation_, sunny_) {
    this.temp = temp_;
    this.prec = preceptitation_;
    this.sunny = sunny_;
    this.fdi = 0;

    fditemp = calcTemp(this.temp);

    this.fdi += fditemp;

    if (this.temp < 32 && this.prec) {
        //snowing = bad!
        this.fdi += 30;
        console.log("added 30 because of snow");
    }
    if (this.temp > 32 && this.prec) {
        //raining = not great, but kinda okay!
        this.fdi += 10;
        console.log("added 10 because of rain");
    }
    if (this.sunny) {
        let tempoffset = 30 + (this.temp / 2);
        this.fdi += tempoffset;
        console.log("added 30 + temp because of sunny");
    }
    return floor(this.fdi);
}
