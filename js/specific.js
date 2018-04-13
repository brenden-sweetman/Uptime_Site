/***** VARIABLES *****/
moment().format();

var selected_service =   {
    name: 'Ares',
    id: 'ares',
    data: [],
    domain: 'ares.wustl.edu',
    ip: '128.252.67.118',
    status: 'online'
  };

var today = moment();
var prevDay;
var lastWeek = [];

for(var i=1; i<8; i++) {
  today = moment();
  prevDay = today.subtract(i, 'days');
  lastWeek.push(prevDay.format('MMMM') + ' ' + prevDay.date());
}

/***** FUNCTIONS ******/
function updateServiceData(service) {
  for(var i=0; i<7; i++) {
    selected_service.data.push(Math.round(100 * (Math.random() * 100)) / 100);
  }
}

function loadChart(service) {
  new Chart($('#' + selected_service.id +'_chart'), {
    type: 'bar',
    data: {
      labels: [lastWeek[6], lastWeek[5], lastWeek[4], lastWeek[3], lastWeek[2], lastWeek[1], lastWeek[0]],
      datasets: [
        {
          label: 'Uptime (%)',
          backgroundColor: '#7FFF00',
          data: selected_service.data
        },
        {
          label: 'Downtime (%)',
          backgroundColor: '#FFC125',
          data: [(100 - selected_service.data[0]), (100 - selected_service.data[1]), (100 - selected_service.data[2]), (100 - selected_service.data[3]), (100 - selected_service.data[4]), (100 - selected_service.data[5]), (100 - selected_service.data[6])]
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
// update data
updateServiceData();

$('#details_wrapper').append('\
  <div class="detail">\
    <canvas class="service_chart" id="' + selected_service.id + '_chart"></canvas>\
  </div>\
');

if(selected_service.status === 'offline') {
  $('#' + selected_service.id + '_status').css('background-color', '#FFC125');
}

loadChart(selected_service);
