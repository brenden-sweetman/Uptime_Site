/***** VARIABLES *****/
moment().format();

var services = [
  {
    name: 'Ares',
    id: 'ares',
    data: [],
    domain: 'ares.wustl.edu',
    ip: '128.252.67.118',
    status: 'online'
  }, {
    name: 'Classic Catalog',
    id: 'classic_catalog',
    data: [],
    domain: 'catalog.wustl.edu',
    ip: '128.252.67.17',
    status: 'offline'
  }, {
    name: 'Digital Gateway',
    id: 'digital_gateway',
    data: [],
    domain: 'digital.wustl.edu',
    ip: '128.252.67.14',
    status: 'online'
  }, {
    name: 'Findit',
    id: 'findit',
    data: [],
    domain: '',
    ip: '',
    status: 'online'
  }, {
    name: 'Illiad',
    id: 'illiad',
    data: [],
    domain: 'illiad.wustl.edu',
    ip: '128.252.67.41',
    status: 'online'
  }, {
    name: 'Libguides',
    id: 'libguides',
    data: [],
    domain: 'libguides.wustl.edu',
    ip: '52.54.77.227',
    status: 'online'
  }, {
    name: 'OCLC WorldCat',
    id: 'worldcat',
    data: [],
    domain: 'www.worldcat.org',
    ip: '132.174.0.31',
    status: 'online'
  }, {
    name: 'Primo',
    id: 'primo',
    data: [],
    domain: 'wash-primo.hosted.exlibrisgroup.com',
    ip: '66.151.7.251',
    status: 'online'
  }, {
    name: 'Repository (Samvera)',
    id: 'sam_repo',
    data: [],
    domain: 'repository.wustl.edu',
    ip: '128.252.67.231',
    status: 'online'
  }, {
    name: 'Streaming Video (Samvera)',
    id: 'sam_video',
    data: [],
    description: 'streamingvideo.wustl.edu',
    ip: '128.252.67.8',
    status: 'online'
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

/***** EVENT LISTENERS *****/

/***** FUNCTIONS ******/
function updateServiceData(service) {
  services.forEach( function (service) {
    for(var i=0; i<7; i++) {
      service.data.push(Math.round(100 * (Math.random() * 100)) / 100);
    }
  });
}

function loadChart(service) {
  new Chart($('#' + service.id +'_chart'), {
    type: 'bar',
    data: {
      labels: [lastWeek[6], lastWeek[5], lastWeek[4], lastWeek[3], lastWeek[2], lastWeek[1], lastWeek[0]],
      datasets: [
        {
          label: 'Uptime (%)',
          backgroundColor: '#7FFF00',
          data: service.data
        },
        {
          label: 'Downtime (%)',
          backgroundColor: '#FFC125',
          data: [(100 - service.data[0]), (100 - service.data[1]), (100 - service.data[2]), (100 - service.data[3]), (100 - service.data[4]), (100 - service.data[5]), (100 - service.data[6])]
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
services.forEach( function (service) {
  // update data
  updateServiceData();

  $('#services_wrapper').append('\
    <div class="service">\
      <h3 class="service_name">' + service.name +'</h3>\
      <span class="current_status">(current status: <span class="status" id="' + service.id + '_status">' + service.status + '</span>)</span>\
      <canvas class="service_chart" id="' + service.id + '_chart"></canvas>\
    </div>\
  ');

  if(service.status === 'offline') {
    $('#' + service.id + '_status').css('background-color', '#FFC125');
  }

  loadChart(service);
});
