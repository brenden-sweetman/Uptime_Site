/***** VARIABLES *****/
moment().format();

var selectedService = {};

var today = moment();
var prevDay;
var lastWeek = [];

/* FIX DATE FORMATTING FOR CHART AXIS-LABEL */
for(var i=1; i<8; i++) {
  today = moment();
  prevDay = today.subtract(i, 'days');
  lastWeek.push(prevDay.format('YYYY-MM-DD'));
  //prevDay.format('MMMM') + ' ' +
}

/***** FUNCTIONS ******/
function urlData(param) {
    var results = new RegExp('[\?&]' + param + '=([^]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

function updateServiceData(serviceId) {
  var dataRequest = new XMLHttpRequest();
  dataRequest.open('GET', '/sampleJsonFiles/longDataExample.json', true);

  dataRequest.onload = function() {
    var serviceData = JSON.parse(dataRequest.responseText);

    displayDetails(serviceData);
  };

  dataRequest.send(null);
}

function displayDetails(serviceData) {
  loadChart(serviceData);
}

function loadChart(serviceData) {
  var selectedService = serviceData[serviceId];

  var serviceDataByDay = [];
  for(var i=0; i<7; i++) {
    serviceDataByDay.push(selectedService[lastWeek[i]].status);
  }

  new Chart($('.service_chart'), {
    type: 'bar',
    data: {
      labels: [lastWeek[6], lastWeek[5], lastWeek[4], lastWeek[3], lastWeek[2], lastWeek[1], lastWeek[0]],
      datasets: [
        {
          label: 'Uptime (%)',
          backgroundColor: '#7FFF00',
          data: [(100*serviceDataByDay[6]), (100*serviceDataByDay[5]), (100*serviceDataByDay[4]), (100*serviceDataByDay[3]), (100*serviceDataByDay[2]), (100*serviceDataByDay[1]), (100*serviceDataByDay[0])]
        },
        {
          label: 'Downtime (%)',
          backgroundColor: '#FFC125',
          data: [(100 - 100*serviceDataByDay[6]), (100 - 100*serviceDataByDay[5]), (100 - 100*serviceDataByDay[4]), (100 - 100*serviceDataByDay[3]), (100 - 100*serviceDataByDay[2]), (100 - 100*serviceDataByDay[1]), (100 - 100*serviceDataByDay[0])]
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: false,
      },
      scales: {
        yAxes: [{
          stacked: true,
          ticks: {
            suggestedMin: 0,
            suggestedMax: 100
          }
        }],
        xAxes: [{
          stacked: true
        }]
      }
    }
  });
}

/***** MAIN RUN *****/
var serviceId = urlData('id');

updateServiceData(serviceId);

updateServiceData();
