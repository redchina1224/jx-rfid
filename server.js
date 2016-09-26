
var config = require('./config');

//var mysqlconn = require('./user_modules/user_mysql');

//var redisclient = require('./user_modules/user_redis');

var webapp = require('./user_modules/user_webapp');

var udpserver = require('./user_modules/user_udp');



var mysql = require('mysql');

var mysqlconn;
function handleError () {
    mysqlconn = mysql.createConnection({
    host: config.mysql_host,//
    user: config.mysql_username,//
    password: config.mysql_password,//
    database:config.mysql_datebase,
    port: config.mysql_port
    });


    //连接错误，2秒重试
    mysqlconn.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleError , 2000);
        }
    });

    mysqlconn.on('error', function (err) {
        console.log('db error', err);
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleError();
        } else {
            throw err;
        }
    });
}
handleError();







webapp.get('/mysql/count/:table/', function(req, res){ 
      var  actionSql = "select COUNT(*) as count from "+req.params.table+"";     
//查 query
mysqlconn.query(actionSql,function (err, result) {
        if(err){
         // $("#dbif").text('[SELECT ERROR] - '+err.message);//("MYSQL:127.0.0.1<br>端口:3306");
          //console.log('[SELECT ERROR] - ',err.message);
          res.writeHead(200, {'Content-Type': 'application/json'});          
          return;
        }  
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(''+JSON.stringify(result)+'');     
        });
     }); 



webapp.get('/mysql/get/:table/:indexdata/', function(req, res){ 
      var  actionSql = "SELECT * FROM "+req.params.table+" order by id desc LIMIT " + ((req.params.indexdata-1)*10) + ",10";     
//查 query
mysqlconn.query(actionSql,function (err, result) {
        if(err){
         // $("#dbif").text('[SELECT ERROR] - '+err.message);//("MYSQL:127.0.0.1<br>端口:3306");
          //console.log('[SELECT ERROR] - ',err.message);
          res.writeHead(200, {'Content-Type': 'application/json'});
          return;
        }  
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(''+JSON.stringify(result)+'');     
        });
     }); 











// webapp.get('/device/:deviceid/get/', function(req, res){ 
// //      var  actionSql = "SELECT * FROM "+req.params.table+" LIMIT " + ((req.params.indexdata-1)*10) + ",10";     
// //查 query
// // conn.query(actionSql,function (err, result) {
// //         if(err){
// //          // $("#dbif").text('[SELECT ERROR] - '+err.message);//("MYSQL:127.0.0.1<br>端口:3306");
// //           //console.log('[SELECT ERROR] - ',err.message);
// //           if(err.code === 'PROTOCOL_CONNECTION_LOST') conn.connect();
// //           res.writeHead(200, {'Content-Type': 'application/json'});
// //           return;
// //         }  
// //         res.writeHead(200, {'Content-Type': 'application/json'});
// //         res.end(''+JSON.stringify(result)+'');     
// //         });

//         //res.writeHead(200, {'Content-Type': 'application/json'});
//         res.writeHead(200, {'Content-Type': 'text/plain'});
//         //res.end("get:"+req.params.deviceid+"->"+req.params.action);   
//         reskv(req.params.deviceid,res);
//      }); 


// webapp.get('/device/:deviceid/set/:sendmsg', function(req, res){ 
//     var sendstr="sendstr:"+req.params.sendmsg;
//     //server.send(testmsg, 0, testmsg.length, 10629,'60.163.137.41');
//     udpsend(req.params.deviceid,sendstr,udpserver,res)
//      }); 





udpserver.on("message", function (msg, rinfo) {

var str = ''+msg+'';
try
{
  //var aaa = JSON.parse(str);
  var deviceinfo = JSON.parse(str);

}
catch(err)
{
	console.log("not json");
}
//server.send(msg, 0, msg.length, rinfo.address);
//  server.send(msg, 0, msg.length, rinfo.port, rinfo.address);
});


   function udpsend(d_code,msg,server,res) {
//  client.auth("f209e5ac54f4444f:WangXuXiao7229026", redis.print);
    // 获取数据，返回String

    redisclient.get(d_code, function (err, reply) {
    if(reply!=null)
      {
    try
    {
    var deviceinfo = JSON.parse(reply.toString());

      var sendmsg = new Buffer(msg+"\0");
      server.send(sendmsg, 0, sendmsg.length, deviceinfo.rport,deviceinfo.rip);
      res.write('{"d_code":"'+d_code+'","online":"true","rip":"'+deviceinfo.rip+'","rport":"'+deviceinfo.rport+'"}');//  msg+"-->"+deviceinfo.rip+":"+deviceinfo.rport);
      }
      catch(err)
      {res.write("err:"+err);}
      }
      else
      {res.write('{"d_code":"'+d_code+'","online":"false"}');}  
      res.end();
    });

    // // 如果传入一个Buffer，返回也是一个Buffer
    // client.get(new Buffer("key"), function (err, reply) {
    //     console.log(reply.toString()); // print `<Buffer 4f 4b>`
    // });
 //   client.quit();
}
