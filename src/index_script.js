window.onload = function() {
    fillDatabase(100);
    arrangeCSV();
    fillDummyTable();
    fillFocus(pickRandom());
}

let dataBase = [{}];

let currentDynamicData = [415, 391, 389];

const data = {
  labels: ['HP', 'IEEE', 'CIGRE'],
  datasets: [{
    data: currentDynamicData,
    backgroundColor: [
      '#cc1b62',
      '#458bd1',
      '#ffd059'
    ],
    borderWidth: 0
  }]
};

const config = {
    type: 'bar',
    data: data,
    options: {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
      scales: {
        y: {
            title: {
                display: true,
                text: 'Ampere'
            },
            beginAtZero: false,
            min: 250,
            max: 450
        },
        x: {
            grid: {
                display: false,
            }
        }
      }
    },
  };

const overviewChart = new Chart(document.getElementById('dynamic_bar_chart'), config);




const data2 = {
    labels: '',
    datasets: [
      {
        label: 'HP',
        data: 0,
        borderColor: '#cc1b62',
        backgroundColor: '#cc1b62',
        pointRadius: 3,
        tension: 0.1
      },
      {
        label: 'IEEE',
        data: 0,
        borderColor:'#458bd1',
        backgroundColor: '#458bd1',
        pointRadius: 3,
        tension: 0.1
      },
      {
        label: 'CIGRE',
        data: 0,
        borderColor:'#ffd059',
        backgroundColor: '#ffd059',
        pointRadius: 3,
        tension: 0.1
      }
    ]
  };

const config2 = {
    type: 'line',
    data: data2,
    options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        },
        scales: {
            y: {
                grid: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: true,
                }
            }
        }
    }
};

const forecastChart = new Chart(document.getElementById('forecast_chart'), config2);

function fillDummyTable() {
    
    let tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    for(let i = 0; i < dataBase.length; i++) {
        let row = document.createElement('tr');
        row.setAttribute('id', `row${i}`);
        let col1 = document.createElement('td');
        col1.setAttribute('id', `col${i}_1`);
        let col2 = document.createElement('td');
        col2.setAttribute('id', `col${i}_2`);
        let col3 = document.createElement('td');
        col3.setAttribute('id', `col${i}_3`);

        let peak = Math.max(dataBase[i].dynamic[0], dataBase[i].dynamic[1], dataBase[i].dynamic[2]);

        col1.innerHTML = dataBase[i].name;
        col2.innerHTML = `${dataBase[i].static} A`;
        col3.innerHTML = `${Math.max(peak)} A`;

        row.appendChild(col1);
        row.appendChild(col2);
        row.appendChild(col3);
        tbody.appendChild(row);

        col3.style.color = getColor(peak);

        row.addEventListener('mouseenter', ()=> {
            row.style.backgroundColor = getColor(peak);
            col3.style.color = '#000000';
            col3.style.fontWeight = '400';
        });
        row.addEventListener('mouseleave', ()=> {
            row.style.backgroundColor = '#ffffff';
            col3.style.color = getColor(peak);
            col3.style.fontWeight = '600';
        });
        row.addEventListener('click', ()=> {
            fillFocus(dataBase[i]);
        });
    }
    
    restyle();
}

function restyle() {
    const style = document.createElement('style');
    style.innerHTML = `
    #table {
        width: 100%;
        border-collapse: collapse;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 1vw;
        font-weight: 100;
    }
    
    th {
        background-color: #34576e;
        color: #ffffff;
        line-height: 3vw;
        width: 33%;
        font-weight: 400;
    }
    
    td {
        line-height: 3vw;
        font-weight: 400;
        text-align: center;
    }
    `;
    document.head.appendChild(style);
}

var intensityIndexColor = ['#67cfb0', '#ffd561', '#c44d6f'];

function getColor(intensity) {
    let color;
    if(intensity < 380) {
        color = intensityIndexColor[0];
    }
    if(intensity >= 380) {
        color = intensityIndexColor[1];
    }
    if(intensity > 430) {
        color = intensityIndexColor[2];
    }
    return color;
}

function pickRandom() {
    let rnd = dataBase[Math.floor(Math.random() * (dataBase.length - 0 + 1)) + 0];
    return rnd;
}

function fillFocus(x) {
    document.getElementById('overview_name').innerHTML = x.name;
    document.getElementById('static_v').innerHTML = x.static;
    document.getElementById('thermal_v').innerHTML = x.thermal;

    document.getElementById('static_v').style.color = getColor(x.static);


    currentDynamicData[0] = x.dynamic[0];
    currentDynamicData[1] = x.dynamic[1];
    currentDynamicData[2] = x.dynamic[2];

    fillForecast(x);

    overviewChart.update();
}

function fillDatabase(x) {
    for(var i = 0; i < x; i++) {
        var num = Math.floor(Math.random() * (430 - 270 + 1)) + 270;
        var spread = 20;
        let newData = {
            name: `Powerline X${i}`,
            static: num,
            thermal: Math.floor(Math.random() * (80 - 60 + 1)) + 60,
            dynamic: [
                Math.floor(Math.random() * ((num+spread) - (num-spread) + 1)) + (num-spread),
                Math.floor(Math.random() * ((num+spread) - (num-spread) + 1)) + (num-spread),
                Math.floor(Math.random() * ((num+spread) - (num-spread) + 1)) + (num-spread)
            ],
            datesfore: [],
            hpfore: [],
            ieeefore: [],
            cigrefore: []
        };
        dataBase[i] = newData;
    }
}

var csvDates = [];
var csvHP = [];
var csvIEEE = [];
var csvCIGRE = [];

function arrangeCSV() {
    let dataSplits = csv.split(/\r?\n/);
   
    for(var i = 0; i < dataSplits.length; i++) {
        let split1 = dataSplits[i].split('-');
        let year = split1[0];
        let month = split1[1];

        let split2 = split1[2].split('T');
        let day = split2[0];

        let split3 = split2[1].split(':');
        let hour = split3[0];

        let split4 = split3[2].split(',');
        let hp = split4[1];
        let ieee = split4[2];
        let cigre = split4[3];
        
        csvDates[i] = `${day}.${month} ${hour}:00`;
        csvHP[i] = parseInt(hp);
        csvIEEE[i] = parseInt(ieee);
        csvCIGRE[i] = parseInt(cigre);
    }

    let uDate = [], u1 = [], u2 = [], u3 = [];
    for(var i = 2; i < 52; i += 4) {
        uDate.push(csvDates[i]);
        u1.push(csvHP[i]);
        u2.push(csvIEEE[i]);
        u3.push(csvCIGRE[i]);
    }

    csvDate = uDate;
    csvHP = u1;
    csvIEEE = u2;
    csvCIGRE = u3;

    randomizeReadings();
    
}

function randomizeReadings() {
    for(var i = 0; i < dataBase.length; i++) {
        dataBase[i].datesfore = csvDate;

        let r1 = [], r2 = [], r3 = [];
        let spread = 10;
        for(var j = 0; j < csvHP.length; j++) {
            r1[j] = Math.floor(Math.random() * ((csvHP[j]+spread) - (csvHP[j]-spread) + 1)) + (csvHP[j]-spread);
            r2[j] = Math.floor(Math.random() * ((csvIEEE[j]+spread) - (csvIEEE[j]-spread) + 1)) + (csvIEEE[j]-spread);
            r3[j] = Math.floor(Math.random() * ((csvCIGRE[j]+spread) - (csvCIGRE[j]-spread) + 1)) + (csvCIGRE[j]-spread);
        }
        dataBase[i].hpfore = r1;
        dataBase[i].ieeefore = r2;
        dataBase[i].cigrefore = r3;
    }
}

function fillForecast(x) {
    data2.labels = x.datesfore;
    data2.datasets[0].data = x.hpfore;
    data2.datasets[1].data = x.ieeefore;
    data2.datasets[2].data = x.cigrefore;
    forecastChart.update();

}

var csv = `2022-04-26T22:00:00Z,415,391,389
2022-04-26T23:00:00Z,406,408,407
2022-04-27T00:00:00Z,396,415,412
2022-04-27T01:00:00Z,360,355,356
2022-04-27T02:00:00Z,343,363,363
2022-04-27T03:00:00Z,321,317,320
2022-04-27T04:00:00Z,321,312,318
2022-04-27T05:00:00Z,335,303,318
2022-04-27T06:00:00Z,380,323,341
2022-04-27T07:00:00Z,440,407,419
2022-04-27T08:00:00Z,447,426,441
2022-04-27T09:00:00Z,433,427,441
2022-04-27T10:00:00Z,403,415,426
2022-04-27T11:00:00Z,370,384,394
2022-04-27T12:00:00Z,311,305,311
2022-04-27T13:00:00Z,289,255,274
2022-04-27T14:00:00Z,309,272,269
2022-04-27T15:00:00Z,312,271,269
2022-04-27T16:00:00Z,302,264,266
2022-04-27T17:00:00Z,302,285,285
2022-04-27T18:00:00Z,303,293,294
2022-04-27T19:00:00Z,303,315,317
2022-04-27T20:00:00Z,324,315,318
2022-04-27T21:00:00Z,339,319,323
2022-04-27T22:00:00Z,360,325,336
2022-04-27T23:00:00Z,370,336,338
2022-04-28T00:00:00Z,420,377,386
2022-04-28T01:00:00Z,420,425,433
2022-04-28T02:00:00Z,401,359,370
2022-04-28T03:00:00Z,397,411,420
2022-04-28T04:00:00Z,327,304,314
2022-04-28T05:00:00Z,371,306,325
2022-04-28T06:00:00Z,359,329,345
2022-04-28T07:00:00Z,331,347,360
2022-04-28T08:00:00Z,347,353,361
2022-04-28T09:00:00Z,364,377,375
2022-04-28T10:00:00Z,346,346,345
2022-04-28T11:00:00Z,346,326,329
2022-04-28T12:00:00Z,348,333,335
2022-04-28T13:00:00Z,349,338,342
2022-04-28T14:00:00Z,337,325,331
2022-04-28T15:00:00Z,350,327,336
2022-04-28T16:00:00Z,342,334,342
2022-04-28T17:00:00Z,327,343,349
2022-04-28T18:00:00Z,384,367,370
2022-04-28T19:00:00Z,400,416,413
2022-04-28T20:00:00Z,361,387,382
2022-04-28T21:00:00Z,329,334,336
2022-04-28T22:00:00Z,358,320,325
2022-04-28T23:00:00Z,402,421,414
2022-04-29T00:00:00Z,378,384,382
2022-04-29T01:00:00Z,388,387,385
2022-04-29T02:00:00Z,389,391,389
2022-04-29T03:00:00Z,383,393,391
2022-04-29T04:00:00Z,372,382,379
2022-04-29T05:00:00Z,360,345,349
2022-04-29T06:00:00Z,380,341,353
2022-04-29T07:00:00Z,386,387,401
2022-04-29T08:00:00Z,358,380,397
2022-04-29T09:00:00Z,325,345,361
2022-04-29T10:00:00Z,285,311,318
2022-04-29T11:00:00Z,311,284,293
2022-04-29T12:00:00Z,323,303,314
2022-04-29T13:00:00Z,334,317,328
2022-04-29T14:00:00Z,330,306,321
2022-04-29T15:00:00Z,333,307,324
2022-04-29T16:00:00Z,330,310,321
2022-04-29T17:00:00Z,319,296,310
2022-04-29T18:00:00Z,297,299,308
2022-04-29T19:00:00Z,363,344,352
2022-04-29T20:00:00Z,370,364,371
2022-04-29T21:00:00Z,369,364,373
2022-04-29T22:00:00Z,379,355,364
2022-04-29T23:00:00Z,367,381,386
2022-04-30T00:00:00Z,352,341,347
2022-04-30T01:00:00Z,366,355,356
2022-04-30T02:00:00Z,377,375,375
2022-04-30T03:00:00Z,380,374,376
2022-04-30T04:00:00Z,371,378,377
2022-04-30T05:00:00Z,330,336,332
2022-04-30T06:00:00Z,336,289,284
2022-04-30T07:00:00Z,370,346,335
2022-04-30T08:00:00Z,385,381,375
2022-04-30T09:00:00Z,390,382,385
2022-04-30T10:00:00Z,346,344,353
2022-04-30T11:00:00Z,270,293,301
2022-04-30T12:00:00Z,278,231,241
2022-04-30T13:00:00Z,264,238,252
2022-04-30T14:00:00Z,316,296,319
2022-04-30T15:00:00Z,266,207,239
2022-04-30T16:00:00Z,313,271,294
2022-04-30T17:00:00Z,280,268,291
2022-04-30T18:00:00Z,313,262,272
2022-04-30T19:00:00Z,338,346,351
2022-04-30T20:00:00Z,346,292,296
2022-04-30T21:00:00Z,390,373,379
2022-04-30T22:00:00Z,388,397,394
2022-04-30T23:00:00Z,394,416,415
2022-05-01T00:00:00Z,386,369,367
2022-05-01T01:00:00Z,411,419,415
2022-05-01T02:00:00Z,399,409,406
2022-05-01T03:00:00Z,399,391,388
2022-05-01T04:00:00Z,387,400,397
2022-05-01T05:00:00Z,362,355,353
2022-05-01T06:00:00Z,370,324,330
2022-05-01T07:00:00Z,362,368,383
2022-05-01T08:00:00Z,293,277,266
2022-05-01T09:00:00Z,295,256,241
2022-05-01T10:00:00Z,343,282,269
2022-05-01T11:00:00Z,379,381,379
2022-05-01T12:00:00Z,386,383,380
2022-05-01T13:00:00Z,389,366,365
2022-05-01T14:00:00Z,395,375,374
2022-05-01T15:00:00Z,406,400,397
2022-05-01T16:00:00Z,413,411,408
2022-05-01T17:00:00Z,422,433,434
2022-05-01T18:00:00Z,406,436,431
2022-05-01T19:00:00Z,395,417,404
2022-05-01T20:00:00Z,390,386,381
2022-05-01T21:00:00Z,393,392,387
2022-05-01T22:00:00Z,386,380,378
2022-05-01T23:00:00Z,369,386,383
2022-05-02T00:00:00Z,317,340,341
2022-05-02T01:00:00Z,330,296,302
2022-05-02T02:00:00Z,358,353,354
2022-05-02T03:00:00Z,351,354,354
2022-05-02T04:00:00Z,322,331,331
2022-05-02T05:00:00Z,311,292,290
2022-05-02T06:00:00Z,379,336,330
2022-05-02T07:00:00Z,411,420,417
2022-05-02T08:00:00Z,411,385,384
2022-05-02T09:00:00Z,426,392,397
2022-05-02T10:00:00Z,435,417,421
2022-05-02T11:00:00Z,424,415,419
2022-05-02T12:00:00Z,414,396,406
2022-05-02T13:00:00Z,397,393,404
2022-05-02T14:00:00Z,350,350,356
2022-05-02T15:00:00Z,355,317,324
2022-05-02T16:00:00Z,381,365,358
2022-05-02T17:00:00Z,398,402,395
2022-05-02T18:00:00Z,349,397,388
2022-05-02T19:00:00Z,324,309,309
2022-05-02T20:00:00Z,318,314,317
2022-05-02T21:00:00Z,321,316,320
2022-05-02T22:00:00Z,344,343,344
2022-05-02T23:00:00Z,358,367,364
2022-05-03T00:00:00Z,345,338,341
2022-05-03T01:00:00Z,344,330,335
2022-05-03T02:00:00Z,344,323,330
2022-05-03T03:00:00Z,341,338,342
2022-05-03T04:00:00Z,343,321,323
2022-05-03T05:00:00Z,350,344,340
2022-05-03T06:00:00Z,382,322,316
2022-05-03T07:00:00Z,400,408,399
2022-05-03T08:00:00Z,372,387,384
2022-05-03T09:00:00Z,327,316,315
2022-05-03T10:00:00Z,306,306,297
2022-05-03T11:00:00Z,285,259,255
2022-05-03T12:00:00Z,286,242,244
2022-05-03T13:00:00Z,296,265,267
2022-05-03T14:00:00Z,358,347,358
2022-05-03T15:00:00Z,404,312,318
2022-05-03T16:00:00Z,334,396,403
2022-05-03T17:00:00Z,429,446,439
2022-05-03T18:00:00Z,344,412,405
2022-05-03T19:00:00Z,363,343,346
2022-05-03T20:00:00Z,384,362,371
2022-05-03T21:00:00Z,386,368,368
2022-05-03T22:00:00Z,422,399,398
2022-05-03T23:00:00Z,426,439,438
2022-05-04T00:00:00Z,419,412,409
2022-05-04T01:00:00Z,417,417,418
2022-05-04T02:00:00Z,408,417,416
2022-05-04T03:00:00Z,387,388,389
2022-05-04T04:00:00Z,357,367,372
2022-05-04T05:00:00Z,342,297,315
2022-05-04T06:00:00Z,363,353,371
2022-05-04T07:00:00Z,375,359,379
2022-05-04T08:00:00Z,354,351,372
2022-05-04T09:00:00Z,276,255,273
2022-05-04T10:00:00Z,324,257,273
2022-05-04T11:00:00Z,370,305,315
2022-05-04T12:00:00Z,407,408,403
2022-05-04T13:00:00Z,406,390,388`;