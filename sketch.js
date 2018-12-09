//perfect day = coldish, cloudy, not raining.
//perfect temp 60
//api key 80dc2b2246004f62b5b6023418181;
let avgTemp = 0;
let isSunny = false;
let apiPrecp = false;
let finalfdi = 0;
let apiImg = null;
let count = 0;
let animcount = 0;
let started = false;
let loaded = false
let calcd = false;

function setup() {

    loadJSON("https://api.apixu.com/v1/forecast.json?key=80dc2b2246004f62b5b60234181811&q=Boston&days=1", apiCallback);
    started = true;
}

function draw() {

    ShowLoading();
    if (loaded && !calcd) {
        finalfdi = CalcFDI(avgTemp, apiPrecp, isSunny);

    }
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
    if (temp > 60)
        return map(temp, 60, 110, 0, 70);
    else {
        return map(temp, -18, 60, 30, 0);
    }
}

function CalcFDI(temp_, preceptitation_, sunny_) {
    this.temp = temp_;
    this.prec = preceptitation_;
    this.sunny = sunny_;
    this.fdi = 0;

    fditemp = calcTemp(this.temp);

    this.fdi += fditemp;
    console.log(fditemp);

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

    let title = createDiv("Today's FDR is ")
    let div = createDiv(floor(this.fdi));
    div.style('font-size', '50px');
    div.style('position', 'relative');
    div.style('left', '49%');
    div.style('bottom', '50%');
    div.style('color', '#8900ff');


    title.style('font-size', '50px');
    title.style('position', 'relative');
    title.style('left', '50%');
    title.style('bottom', '75%');
    title.style('color', '#8900ff');
    calcd = true;
}

function ShowLoading() {
    if (started) {
        select('.middle').show();
        animcount++
        if (animcount > 120) {
            select('.middle').hide();
            animcount = 0;
            started = false;
            loaded = true;
        }
    }
}
