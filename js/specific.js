/***** VARIABLES *****/
moment().format();

var selectedService = {};

var services = [
  {
    name: 'Ares',
    id: 'ares',
    status: 0,
    data: [],
    domain: 'ares.wustl.edu',
    ip: '128.252.67.118'
  }, {
    name: 'Classic Catalog',
    id: 'classic_catalog',
    status: 0,
    data: [],
    domain: 'catalog.wustl.edu',
    ip: '128.252.67.17'
  },/* {
    name: 'Digital Gateway',
    id: 'digital_gateway',
    status: 0,
    data: [],
    domain: 'digital.wustl.edu',
    ip: '128.252.67.14'
  }, {
    name: 'Findit',
    id: 'findit',
    status: 0,
    data: [],
    domain: '',
    ip: ''
  },*/ {
    name: 'Illiad',
    id: 'illiad',
    status: 0,
    data: [],
    domain: 'illiad.wustl.edu',
    ip: '128.252.67.41'
  }, /*{
    name: 'Libguides',
    id: 'libguides',
    status: 0,
    data: [],
    domain: 'libguides.wustl.edu',
    ip: '52.54.77.227'
  }, {
    name: 'OCLC WorldCat',
    id: 'worldcat',
    status: 0,
    data: [],
    domain: 'www.worldcat.org',
    ip: '132.174.0.31'
  }, {
    name: 'Primo',
    id: 'primo',
    status: 0,
    data: [],
    domain: 'wash-primo.hosted.exlibrisgroup.com',
    ip: '66.151.7.251'
  },*/ {
    name: 'Repository (Samvera)',
    id: 'sam_repo',
    status: 0,
    data: [],
    domain: 'repository.wustl.edu',
    ip: '128.252.67.231'
  }, {
    name: 'Streaming Video (Samvera)',
    id: 'sam_video',
    status: 0,
    data: [],
    description: 'streamingvideo.wustl.edu',
    ip: '128.252.67.8'
  }
];

var today = moment();
var prevDay;
var lastWeek = [];

for(var i=1; i<8; i++) {
  today = moment();
  prevDay = today.subtract(i, 'days');
  lastWeek.push(prevDay.format('MMMM') + ' ' + prevDay.date());
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

function updateServiceData(service) {
  /*
  var dataRequest = new XMLHttpRequest();
  dataRequest.open('GET', 'data/longData.json', true);

  dataRequest.onload = function() {
    var serviceData = JSON.parse(dataRequest.responseText);

    selectedService.data = serviceData[selectedService.name].data;

    displayDetails();
  };

  dataRequest.send(null);
  */
}

function displayDetails() {
  loadChart();
}

function loadChart() {
  new Chart($('#' + selectedService.id +'_chart'), {
    type: 'bar',
    data: {
      labels: [lastWeek[6], lastWeek[5], lastWeek[4], lastWeek[3], lastWeek[2], lastWeek[1], lastWeek[0]],
      datasets: [
        {
          label: 'Uptime (%)',
          backgroundColor: '#7FFF00',
          data: selectedService.data
        },
        {
          label: 'Downtime (%)',
          backgroundColor: '#FFC125',
          data: [(100 - selectedService.data[0]), (100 - selectedService.data[1]), (100 - selectedService.data[2]), (100 - selectedService.data[3]), (100 - selectedService.data[4]), (100 - selectedService.data[5]), (100 - selectedService.data[6])]
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

services.forEach( function (service) {
  if(service.id === serviceId) {
    selectedService = service;
  }
});

updateServiceData();
