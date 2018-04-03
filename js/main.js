/***** VARIABLES *****/
var services = [
  {
    name: 'Ares',
    id: 'ares',
    domain: 'ares.wustl.edu',
    ip: '128.252.67.118',
    status: 'online'
  }, {
    name: 'Classic Catalog',
    id: 'classic_catalog',
    domain: 'catalog.wustl.edu',
    ip: '128.252.67.17',
    status: 'offline'
  }, {
    name: 'Digital Gateway',
    id: 'digital_gateway',
    domain: 'digital.wustl.edu',
    ip: '128.252.67.14',
    status: 'online'
  }, {
    name: 'Findit',
    id: 'findit',
    domain: '',
    ip: '',
    status: 'online'
  }, {
    name: 'Illiad',
    id: 'illiad',
    domain: 'illiad.wustl.edu',
    ip: '128.252.67.41',
    status: 'online'
  }, {
    name: 'Libguides',
    id: 'libguides',
    domain: 'libguides.wustl.edu',
    ip: '52.54.77.227',
    status: 'online'
  }, {
    name: 'OCLC WorldCat',
    id: 'worldcat',
    domain: 'www.worldcat.org',
    ip: '132.174.0.31',
    status: 'online'
  }, {
    name: 'Primo',
    id: 'primo',
    domain: 'wash-primo.hosted.exlibrisgroup.com',
    ip: '66.151.7.251',
    status: 'online'
  }, {
    name: 'Repository (Samvera)',
    id: 'sam_repo',
    domain: 'repository.wustl.edu',
    ip: '128.252.67.231',
    status: 'online'
  }, {
    name: 'Streaming Video (Samvera)',
    id: 'sam_video',
    description: 'streamingvideo.wustl.edu',
    ip: '128.252.67.8',
    status: 'online'
  }
];

/***** EVENT LISTENERS *****/

/***** FUNCTIONS ******/
function loadChart(service) {
  new Chart($('#' + service.id +'_chart'), {
    type: 'bar',
    data: {
      labels: ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'],
      datasets: [
        {
          label: 'Uptime (%)',
          backgroundColor: ['#7FFF00', '#7FFF00', '#7FFF00', '#7FFF00', '#7FFF00', '#7FFF00', '#7FFF00'],
          data: [98, 99, 93, 98, 99, 99, 95],
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
          ticks: {
            suggestedMin: 0,
            suggestedMax: 100
          }
        }]
      }
    }
  });
}

function greenOrangeGrad() {

}


/***** MAIN RUN *****/
services.forEach( function (service) {
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
