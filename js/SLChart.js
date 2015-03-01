/*
* SLChart.js
*
* Zach Toogood February 2015
* zrtoogood@gmail.com
* zachtoogood.com
*
* The purpose of this file is to take the URL of a StrongLifts backup file (a .csv generated by the StrongLifts App) and
* generate a chart using Chart.js or ChartNew.js (by francois.vancoppenolle@favomo.be, http:\\www.favomo.be\graphjs).
*
*
*
*/

var dataString = "http://zachtoogood.com/files/SLChart/data/spreadsheet-stronglifts.csv";
parseData(dataString);


//parse and draw data
function parseData(dataString){
	//Get Data
        Papa.parse(dataString, {
		download: true,
            dynamictyping: true,
		complete: function(results) {
			//console.log(results);
            drawChart(results);
		}
	});

    function drawChart(_data){
        var labels = [];
        var weight = [];
        var squat = [];
        var bench = [];
        var deadlift = [];
        var row = [];
        var ohp = [];

        //Set Data
        document.getElementById('notes').innerHTML = '';

        for (i = 1; i < _data.data.length - 1; i++) { //i = 1 ignore header

            var _label = _data.data[i][0]; //Date
            var _note = _data.data[i][1]; //Date
            var _weight = parseFloat(_data.data[i][3]); //BW
            var _squat = parseFloat(_data.data[i][5]); // Squat

            if (i%2 == 0)
            {
            //OH Press and Deadlift
            var _ohp = parseFloat(_data.data[i][13]); 
            var _deadlift = parseFloat(_data.data[i][21]); 

            var _bench = undefined;
            var _row = undefined;
            } else {
            //Bench and Row
            var _bench = parseFloat(_data.data[i][13]); 
            var _row = parseFloat(_data.data[i][21]); 

            var _ohp = undefined;
            var _deadlift = undefined;
            }

            if (_weight < 10){
                _weight = undefined;
            }

            labels.push(_label);
            squat.push(_squat);
            weight.push(_weight);
            bench.push(_bench);
            deadlift.push(_deadlift);
            row.push(_row);
            ohp.push(_ohp);

            if (_note != ""){
                document.getElementById('notes').innerHTML += '<ul><b>' + _label + '</b> : ' + _note + '</ul>';
            }
            
            }

        //Define Chart
        var LineChart = {
            labels: labels,
            datasets: [ 
            {
                label: "Deadlift (kg)",
                fillColor: "rgba(249,249,10,0.6)",
                strokeColor: "rgba(249,249,10,0.5)",
                pointColor: "rgba(249,249,10,0.5)",
                pointStrokeColor: "rgba(249,249,10,0.5)",
                data: deadlift,
                skipNullValues: true
            },

            {
                label: "Bodyweight (kg)",
                fillColor: "rgba(252,10,10,0.6)",
                strokeColor: "rgba(252,10,10,0.5)",
                pointColor: "rgba(252,10,10,0.5)",
                pointStrokeColor: "rgba(252,10,10,0.5)",
                data: weight,
                skipNullValues: true
            },

            {
                label: "Squat (kg)",
                fillColor: "rgba(10,10,249,0.6)",
                strokeColor: "rgba(10,10,249,0.5)",
                pointColor: "rgba(10,10,249,0.5)",
                pointStrokeColor: "rgba(10,10,249,0.5)",
                data: squat,
                skipNullValues: true
            },

            {
                label: "Bench (kg)",
                fillColor: "rgba(10,249,10,0.6)",
                strokeColor: "rgba(10,249,10,0.5)",
                pointColor: "rgba(10,249,10,0.5)",
                pointStrokeColor: "rgba(10,249,10,0.5)",
                data: bench,
                skipNullValues: true
            },

            {
                label: "Row (kg)",
                fillColor: "rgba(249,10,249,0.6)",
                strokeColor: "rgba(249,10,249,0.5)",
                pointColor: "rgba(249,10,249,0.5)",
                pointStrokeColor: "rgba(249,10,249,0.5)",
                data: row,
                skipNullValues: true
            },

            {
                label: "OH Press (kg)",
                fillColor: "rgba(10,249,249,0.6)",
                strokeColor: "rgba(10,249,249,0.5)",
                pointColor: "rgba(10,249,249,0.5)",
                pointStrokeColor: "rgba(10,249,249,0.5)",
                data: ohp,
                skipNullValues: true
            }

            ]
        }

        //Draw Chart
        var myLineChart = new Chart(document.getElementById("canvas").getContext("2d")).Line(LineChart,
                {
                    scaleFontSize : 13,
                    scaleFontColor : "#000000",
                    //Boolean - If we want to override with a hard coded scale
                    scaleOverride: false,
                    scaleSteps: 12,
                    scaleStepWidth: Math.ceil(10),
                    scaleStartValue: 0
                });

        legend(document.getElementById("placeholder"), LineChart);
    }

}


//Handle files
  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

      var dataString = files[0];
  parseData(dataString);
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);



//Legend
function legend(parent, data) {
    parent.className = 'legend';
    var datas = data.hasOwnProperty('datasets') ? data.datasets : data;

    // remove possible children of the parent
    while(parent.hasChildNodes()) {
        parent.removeChild(parent.lastChild);
    }

    datas.forEach(function(d) {
        var title = document.createElement('span');
        title.className = 'title';
        parent.appendChild(title);

        var colorSample = document.createElement('div');
        colorSample.className = 'color-sample';
        colorSample.style.backgroundColor = d.hasOwnProperty('strokeColor') ? d.strokeColor : d.color;
        colorSample.style.borderColor = d.hasOwnProperty('fillColor') ? d.fillColor : d.color;
        title.appendChild(colorSample);

        var text = document.createTextNode(d.label);
        title.appendChild(text);
    });
}
