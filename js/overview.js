/***** VARIABLES *****/
moment().format();

var services = [];

var today = moment();

/***** EVENT LISTENERS *****/
$('.service_name a').click( function(e) {

});

/***** FUNCTIONS ******/
function updateServiceData() {
  var dataRequest = new XMLHttpRequest();
  dataRequest.open('GET', 'sampleJsonFiles/shortDataExample.json', true);

  dataRequest.onload = function() {
    var serviceData = JSON.parse(dataRequest.responseText);

    var i = 0;
    while(serviceData[i] != null) {
      services.push = serviceData[i];
      i++;
    }

    displayServices();
  };

  dataRequest.send(null);
}

function displayServices() {
  services.forEach( function (service) {
    $('#services_wrapper').append('\
      <div class="service">\
        <div class="col1"><h3 class="service_name"><a href="details.html/?id=' + service.id + '">' + service.name +'</a></h3></div>\
        <div class="col2"><span class="current_status">Uptime in Last 20 Minutes... <span class="status" id="' + service.id + '_status">' + Math.round(service.status*100) + '%</span></span></div>\
        <div class="col3"><span></span></div>\
        <div class="col4"><span></span></div>\
        <div class="col5"><span></span></div>\
      </div>\
    ');

    if(service.status === 1) {
      $('#' + service.id + '_status').css('background-color', '#7FFF00');
    }
    else if(service.status === 0) {
      $('#' + service.id + '_status').css('background-color', '#FFC125');
    }
    else {
      $('#' + service.id + '_status').css('background-color', '#f2ff42');
    }
  });
}

/***** MAIN RUN *****/
updateServiceData();
