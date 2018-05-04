/***** VARIABLES *****/
moment().format();

var today = moment();

/***** EVENT LISTENERS *****/


/***** FUNCTIONS ******/
function updateServiceData() {
  var dataRequest = new XMLHttpRequest();
  dataRequest.open('GET', 'sampleJsonFiles/shortDataExample.json', true);

  dataRequest.onload = function() {
    var serviceData = JSON.parse(dataRequest.responseText);

    displayServices(serviceData);
  };

  dataRequest.send(null);
}

function displayServices(serviceData) {
  var i = 0;
  while(serviceData[i] != null) {
    var service = serviceData[i];
    var currRating = 1;
    $('#services_wrapper').append('\
      <div class="service">\
        <div class="col1"><h3 class="service_name"><a href="details.html/?id=' + i + '">' + service.name +'</a></h3></div>\
        <div class="col2"><span class="status" id="' + i + '_status">' + Math.round(service.status*100) + '%</span></div>\
        <div class="col3"><span class="mean_http" id="' + i + '_mean_http">' + Math.round(service.meanHttpTime) + 'ms</span></div>\
        <div class="col4"><span class="mean_ping" id="' + i + '_mean_ping">' + Math.round(service.meanPingTime) + 'ms</span></div>\
      </div>\
    ');

    if(service.status === 1) {
      $('#' + i + '_status').css('background-color', '#7FFF00');
    }
    else if(service.status === 0) {
      $('#' + i + '_status').css('background-color', '#FFC125');
    }
    else {
      $('#' + i + '_status').css('background-color', '#f2ff42');
    }
    i++;
  }
}

/***** MAIN RUN *****/
updateServiceData();
