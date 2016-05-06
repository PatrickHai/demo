// var MongoClient = require('mongodb').MongoClient;
// var assert = require('assert');


// var url = 'mongodb://localhost:27017/test';

// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected correctly to server.");
//   db.close();
// });


// var mongo = require('mongodb'), Server = mongo.Server, Db = mongo.Db;

// var server = new Server('localhost', 27017, {auto_reconnect: true});
// var db = new Db('test', server);

// exports.getMainCategory = function(success){
//   db.open(function(err, db) {
//       if(!err) {
//           db.collection('maincategory', function(err, collection){
//             collection.find().toArray(function(error, bars){
//               success(bars);
//             });
//           });
//       }
//   });
// };



var mysql = require('mysql');  


// var TEST_DATABASE = 'test';  
// var client = mysql.createConnection({  
//   host: 'localhost',
//   port: '3306',
//   user: 'root',  
//   password: '',  
// });  
      
var TEST_DATABASE = 'silk_tmp';  

function handleError (err) {
  console.log('errorDetail:\n',err);
  if (err) {
    if (err.code === 'ETIMEDOUT') {
      connect();
    } else {
      console.error('err.code未被监听:\n',err.stack || err);
    }
  }
}
// 创建连接
var connect = function(){
  client = mysql.createConnection({  
    host: '123.56.204.219',
    port: '3306',
    user: 'silk_tmp',  
    password: 'silk_tmp',  
    database: TEST_DATABASE,  
  });  
  client.connect(handleError);
}

var client;
connect();


exports.getMedication = function(success){
  var result = {
        "name": "白加黑",
        "children": [{
            "name": "适应症",
            "children": [{
                "name": "发热"
            }, {
                "name": "头痛",
                "size": 3812
            }, {
                "name": "四肢酸痛",
                "size": 6714
            }, {
                "name": "喷嚏",
                "size": 743
            }, {
                "name": "流鼻涕",
                "size": 743
            }, {
                "name": "鼻塞",
                "size": 743
            }, {
                "name": "咳嗽",
                "size": 743
            }]
        },
        { "name": "用法用量：白天服用,一日二次,每次1～2片"},
        { "name": "不良反应：偶见轻度乏力.恶心.上腹不适.食欲不振.口干等"}
        ]
};
  success(result); 
};


exports.getSummary = function(success){
  client.query(  
    'SELECT * FROM t_data_summary order by created desc limit 1',  
    function(err, results, fields) {  
      if (err) {  
        // throw err;
        handleError(err);
      }  
        
      if(results[0]){
        var data = {
          id: results[0].id, 
          drugs: results[0].drugs, 
          illnesses: results[0].illnesses,
          medications: results[0].medications,
          inspects: results[0].inspects
        };
        success(data); 
      }    
    }  
  ); 
};

exports.getCategory = function(type, success){
  client.query(  
    'select * from t_datatype_summary where data_series = '+ type,  
    function(err, results, fields) {  
      if (err) {  
        // throw err;
        handleError(err);
      }  
        
      if(results){
        var data = new Array();
        results.forEach(function(d){
          data.push({category: d.data_type, value: parseInt(d.data_total)});
        });
        success(data); 
      }    
    }  
  ); 
};

exports.getTrends = function(success){
  client.query(  
    'select * from t_data_summary order by workdate',  
    function(err, results, fields) {  
      if (err) {  
        // throw err;
        handleError(err);
      }  
        
      if(results){
        var data = new Array();
        results.forEach(function(d){
          data.push(
            {
              dateKey: d.workdate, 
              drugs: parseInt(d.drugs), 
              illnesses: parseInt(d.illnesses), 
              medications: parseInt(d.medications), 
              inspects: parseInt(d.inspects)
            });
        });
        success(data); 
      }
    }  
  ); 
};


exports.getDrugList = function(drugName, success){
  client.query(  
    'select * from t_yongyao_detail where ypmc like "%'+ drugName +'%" limit 50',
    function(err, results, fields) {  
      if (err) {  
        // throw err;
        handleError(err);
      }  
      if(results){
        var data = new Array();
        results.forEach(function(d){
          data.push(
            {
              id: d.id, 
              dateKey: d.workdate, 
              ypmc: d.ypmc,
              gg: d.gg, 
              jx: d.jx, 
              // yfyl: d.yfyl,
              pzwh: d.pzwh,
              scqy: d.scqy
            });
        });
        success(data); 
      }
    }  
  ); 
};

exports.getDrugListInit = function(success){
  client.query(  
    'select * from t_yongyao_detail limit 50',
    function(err, results, fields) {  
      if (err) {  
        // throw err;
        handleError(err);
      }  
      if(results){
        var data = new Array();
        results.forEach(function(d){
          data.push(
            {
              id: d.id, 
              dateKey: d.workdate, 
              ypmc: d.ypmc,
              gg: d.gg, 
              jx: d.jx, 
              pzwh: d.pzwh,
              scqy: d.scqy
            });
        });
        success(data); 
      }
    }  
  ); 
};

exports.getDrugsType = function(success){
  client.query(  
    'select * from t_drugstype',
    function(err, results, fields) {  
      if (err) {  
        // throw err;
        handleError(err);
      }  
      if(results){
        var data = new Array();
        results.forEach(function(d){
          data.push(
            {
              type: d.type_name,
              value: d.type_count
            });
        });
        success(data);
      }
    }  
  ); 
};

exports.getDrugTree = function(id,success){
  if(!id){
    console.log('参数无效不正确！');
    return false;
  }
  var logStr = '\n\n==============';
  var drugId = id;
  var drugTree = {
    "name": "",
    "type": 'drug',
    "children": [
      {
        "name": "药品说明",
        "type": 'drugPropertys',
        "children": [
          {
            "name": "成分",
            "type": 'drugProperty',
            "value":""
          },
          {
            "name": "剂型",
            "type": 'drugProperty',
            "value":""
          },
          {
            "name": "OTC类别",
            "type": 'drugProperty',
            "value":""
          },
          {
            "name": "生产企业",
            "type": 'drugProperty',
            "value":""
          },
          {
            "name": "用法用量",
            "type": 'drugProperty',
            "value":""
          },
          {
            "name": "禁忌",
            "type": 'drugProperty',
            "value":""
          },
          {
            "name": "注意事项",
            "type": 'drugProperty',
            "value":""
          },
          {
            "name": "不良反应",
            "type": 'drugProperty',
            "value":""
          }
        ]
      },
      {
        "name": "治疗疾病",
        "type": 'silks',
        "children": []
      },
      {
        "name": "合理用药",
        "type": 'usages',
        "children": [
          {
            "name": "药品相互作用",
            "type": 'usageCategory',
            "value":""
          },
          {
            "name": "注射剂配伍禁忌",
            "type": 'usageCategory',
            "value":""
          },
          {
            "name": "过敏库",
            "type": 'usageCategory',
            "value":""
          },
          {
            "name": "儿童禁忌",
            "type": 'usageCategory',
            "value":""
          },
          {
            "name": "老人禁忌",
            "type": 'usageCategory',
            "value":""
          },
          {
            "name": "妊娠禁忌",
            "type": 'usageCategory',
            "value":""
          }
          
        ]
      }
    ]
  };
  // drug
  client.query(  
    'select * from t_yongyao_detail where id="' + drugId + '"',
    function(err, result, fields) {  
      if (err) {  
        // throw err;
        handleError(err);
      }  
      if(result){
        var drug = result[0];
        drugTree.name = drug.ypmc;
        // 成分
        drugTree.children[0].children[0].value = drug.cf;
        // 剂型
        drugTree.children[0].children[1].value = drug.jx;
        // OTC分类
        drugTree.children[0].children[2].value = drug.otc;
        // 生产企业
        drugTree.children[0].children[3].value = drug.scqy;
        // 用法用量
        drugTree.children[0].children[4].value = drug.yfyl;
        // 禁忌
        drugTree.children[0].children[5].value = drug.jj;
        // 注意事项
        drugTree.children[0].children[6].value = drug.zysx;
        // 不良反应
        drugTree.children[0].children[7].value = drug.blfy;
        
        // console.log(logStr,'drug',drugTree.children[0].children);
      }
    }  
  ); 
  // drugSilks
  client.query(  
    'select * from t_ypjb where yid="'+ drugId + '" limit 5' ,
    function(err, result, fields) {  
      if (err) {  
        // throw err;
        handleError(err);
      }  
      if(result && result.length > 0){
        var silksMapArr = [];
        var silksMapStr = '';
        result.forEach(function(item){
          silksMapArr.push(item.jid);
          silksMapStr = "'"+ silksMapArr.join("','")+"'";
        });

        client.query(  
          'select * from t_jb39_list where id in ('+ silksMapStr +')' ,
          function(err, result, fields) {  
            if (err) {  
              // throw err;
              handleError(err);
            }  
            if(result){
              result.forEach(function(item,index){
                drugTree.children[1].children[index] = {
                  name: item.name,
                  id:item.id,
                  type: 'silk'
                }
              });
              success(drugTree);
            }
          }  
        ); 
      }else{
        success(drugTree);
      }
    }  
  ); 
};
exports.getSilkTree = function(id,success){
  var silkId = id;
  var logStr = '\n\n==============\n\n';
  var silkTree = {
    "name": "",
    "type": 'silk',
    "children": [
      {
        "name": "治疗药品",
        "type": "silkProperty",
        "children":[]
      },
      {
        "name": "病理",
        "type": "silkProperty",
        "value":""
      },
      {
        "name": "部位",
        "type": "silkProperty",
        "value":""
      },
      {
        "name": "科室",
        "type": "silkProperty",
        "value":""
      },
      {
        "name": "症状",
        "type": "silkProperty",
        "value":""
      }
      // {
      //   "name": "检查",
      //   "type": "silkCheck",
      //   "children":[]
      // },
    ]
  };

  // silk
  client.query(  
    'select * from t_jb39_list where id="' + silkId + '"',
    function(err, result, fields) {  
      if (err) {  
        // throw err;
        handleError(err);
      }  
      if(result){
        var silk = result[0];
        silkTree.name = silk.name;
        silkTree.children[1].value = silk.jb_body;
        silkTree.children[2].value = silk.bw;
        silkTree.children[3].value = silk.ks;
        silkTree.children[4].value = silk.zz;
      }

    }  
  ); 
  // silkDrugs
  client.query(  
    'select * from t_ypjb where jid="'+ silkId + '" limit 5' ,
    function(err, result, fields) {  
      if (err) {  
        // throw err;
        handleError(err);
      }  
      if(result){
        var drugsMapArr = [];
        var drugsMapStr = '';
        result.forEach(function(item){
          drugsMapArr.push(item.yid);
          drugsMapStr = "'"+ drugsMapArr.join("','")+"'";
        });
        client.query(  
          'select * from t_yongyao_detail where id in ('+ drugsMapStr +')' ,
          function(err, result, fields) {  
            if (err) {  
              // throw err;
              handleError(err);
            }  
            if(result){
              result.forEach(function(item,index){
                silkTree.children[0].children[index] = {
                  name: item.ypmc,
                  id:item.id,
                  type: 'drug'
                }
              });
              success(silkTree);
            }
          }  
        ); 
      }
    }  
  ); 

};
exports.getMulu = function(params,success){
  console.log('params',params);
  client.query(  
    'select * from t_mi_data where data_type=' + params.data_type + ' limit 50',
    function(err, results, fields) {  
      if (err) {  
        // throw err;
        handleError(err);
      }  
      if(results){
        var data = new Array();
        console.log('results length',results.length);
        results.forEach(function(d){
          data.push(
            {
              id: d.id, 
              region_code: d.region_code, 
              data_type: d.data_type, 
              name: d.mi_data_name
            });
        });
        success(data); 
      }
    }  
  ); 
};

