/**
 * config
 */

var path = require('path');

var config = {
  // debug 为 true 时，用于本地调试
  debug: true,

  // mongodb 配置
//  db: 'mongodb://127.0.0.1/node_club_dev',

  // mysql 配置，默认是本地
  mysql_host: '127.0.0.1',
  mysql_port: 3306,
  mysql_datebase: 'yxtk-education',
  mysql_username: 'yxtk',  
  mysql_password: 'readyidu@2016',

  // redis 配置，默认是本地
  redis_host: '127.0.0.1',
  redis_port: 6379,
  redis_db: 0,
  redis_password: '',

//  session_secret: 'moolink_session', // 务必修改
//  auth_cookie_name: 'moolink_auth',

  // 程序运行的端口
  webport: 8080,

};

module.exports = config;
