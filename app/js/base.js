$(document).ready(function(){
  initData();
});

var getSummary = function(){
  $.ajax({
    url: '/api/summary',
    type: 'GET',
    success: function(e){
      var result =  JSON.parse(e);
      $('#drugs').html(format(result.drugs));
      $('#illnesses').html(format(result.illnesses));
      $('#medications').html(format(result.medications));
      $('#inspects').html(format(result.inspects));
    }
  });
}

var getDosageType = function(){
    $.ajax({
    url: '/api/category',
    type: 'GET',
    success: function(e){
      drawBarChart(JSON.parse(e), 'bar-chart', '#10a0de');
    }
  });
}

var getIllnessType = function(){
    $.ajax({
    url: '/api/illnessType',
    type: 'GET',
    success: function(e){
      drawBarChart(JSON.parse(e), 'bar-chart1', '#7bcc3a');
    }
  });
}

var getRationalUse = function(){
    $.ajax({
    url: '/api/rationalUse',
    type: 'GET',
    success: function(e){
      drawBarChart(JSON.parse(e), 'bar-chart2', '#ffd162');
    }
  });
}

var getInspects = function(){
  $.ajax({
    url: '/api/inspects',
    type: 'GET',
    success: function(e){
      drawBarChart(JSON.parse(e), 'bar-chart3', '#f74b4b');
    }
  });
}

var getTrends = function(){
  $.ajax({
    url: '/api/trends',
    type: 'GET',
    success: function(e){
      draw_2lines_datekey(JSON.parse(e), [{target: 'drugs', des: '药品数量'}], 'line-chart', 'blueline', 'bluelinecircle');
      draw_2lines_datekey(JSON.parse(e), [{target: 'illnesses', des: '疾病数量'}], 'line-chart1','greenline', 'greenlinecircle');
      draw_2lines_datekey(JSON.parse(e), [{target: 'medications', des: '合理用药'}], 'line-chart2','yellowline', 'yellowlinecircle');
      draw_2lines_datekey(JSON.parse(e), [{target: 'inspects', des: '检查化验'}], 'line-chart3', 'redline', 'redlinecircle');
    }
  });
}

var initData = function(){
  getSummary();
  getDosageType();
  getIllnessType();
  getRationalUse();
  getInspects();
  getTrends();
  getDrugType();
  $.ajax({
    url: '/api/maincategory',
    type: 'GET',
    success: function(e){
      maincategory = JSON.parse(e);
      gauge = drawLiquidChart(maincategory[0].value * 100, "liquid_chart");
      maincategory.forEach(function(d){
        $('.list-inline').append('<li><h5 class="text-muted m-t-20">'+d.category+'</h5><h4 class="m-b-0">'+d.value*100+'%</h4></li>');
      });
    }
  });

  // initTree();

  $('#searchMedication').click(function(){
    var medicationName = $('#medicationName').val();
    $.ajax({
      url: '/api/medication',
      type: 'GET',
      data: {name: medicationName},
      success: function(e){
        drawTreeChart(JSON.parse(e), 'tree-chart');
      }
    });
  });

  $('#dragName').bind('keypress',function(event){
    var dragName = $('#dragName').val();
    if(event.keyCode == '13' && dragName != ''){
        $.ajax({
          url: '/api/druglist',
          type: 'GET',
          data: {drugName: dragName},
          success: function(e){
              var results = JSON.parse(e);
              $('#drugList').empty();
              results.forEach(function(d){
                $('#drugList').append('<tr><td>'+d.ypmc+'</td><td>'+d.gg+'</td><td>'+d.jx+'</td><td>'+d.yfyl+'</td><td>'+d.scqy+'</td></tr>');
              });
          }
        });
    }
  });

  // drawDonut3d('donut3d-chart');
  
}

var getDrugType = function(){
  $.ajax({
    url: '/api/drugsType',
    type: 'GET',
    success: function(e){
      drawPie(JSON.parse(e), 'pie-chart');
    }
  });
}

var initTree = function(){
  $.ajax({
      url: '/api/medication',
      type: 'GET',
      success: function(e){
        drawTreeChart(JSON.parse(e), 'tree-chart');
      }
    });
}

var switchLiquid = function(){
    if(count >= maincategory.length){
      count = 0;
    }
    gauge.update(maincategory[count].value * 100);
    count ++;
}

var count = 1;

function format(num) {
    return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

