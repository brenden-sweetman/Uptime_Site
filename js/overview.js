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

/***** EVENT LISTENERS *****/
$('a').click( function(e) {
  xmlhttp = new XMLHttpRequest();
  // xmlhttp.open() and xmlhttp.send()
});

/***** FUNCTIONS ******/
function updateServiceData(service) {
  services.forEach( function (service) {
    for(var i=0; i<7; i++) {
      service.data.push(Math.round(100 * (Math.random() * 100)) / 100);
    }
  });
}

/***** MAIN RUN *****/
services.forEach( function (service) {
  // update data
  updateServiceData();

  $('#services_wrapper').append('\
    <div class="service">\
      <a href="details.html"><h3 class="service_name">' + service.name +'</h3></a>\
      <span class="current_status">(current status: <span class="status" id="' + service.id + '_status">' + service.status + '</span>)</span>\
    </div>\
  ');

  if(service.status === 'offline') {
    $('#' + service.id + '_status').css('background-color', '#FFC125');
  }
});
