/***** VARIABLES *****/
moment().format();

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

/***** EVENT LISTENERS *****/
$('a').click( function(e) {

});

/***** FUNCTIONS ******/
function updateServiceData() {
  var dataRequest = new XMLHttpRequest();
  dataRequest.open('GET', 'data/shortData.json', true);

  dataRequest.onload = function() {
    var serviceData = JSON.parse(dataRequest.responseText);

    services.forEach( function (service) {
      service.status = serviceData[service.name].status;
    });

    displayServices();
  };

  dataRequest.send(null);
}

function displayServices() {
  services.forEach( function (service) {
    $('#services_wrapper').append('\
      <div class="service">\
        <a href="details.html/?id=' + service.id + '"><h3 class="service_name">' + service.name +'</h3></a>\
        <span class="current_status">(current status: <span class="status" id="' + service.id + '_status">' + service.status + '</span>)</span>\
      </div>\
    ');

    if(service.status === 1) {
      $('#' + service.id + '_status').css('background-color', '#7FFF00');
    }
    else if(service.status === 0) {
      $('#' + service.id + '_status').css('background-color', '#FFC125');
    }
    else {
      $('#' + service.id + '_status').css('background-color', 'red');
    }
  });
}

/***** MAIN RUN *****/
updateServiceData();
