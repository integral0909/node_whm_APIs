
/*
const http = require('http')
const port = 3000
const requestHander = (request, response) => {

  console.log(request.url)

  response.end('Hello Node.js Server')

  console.log("request received.");
  var username = 'userr';
  var password = '12345luggage';
  var domain  = 'example5.com';
  var create_whm_path  = '/json-api/createacct?api.version=1&username=' + username + '&domain=' + domain +'&plan=package_name&featurelist=default&quota=0&password=' + password;
  var create_ftp_path = 'json-api/cpanel?cpanel_jsonapi_user=user&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Ftp&cpanel_jsonapi_func=addftp&user=' + username + '&pass=' + password + '&quota=12345&homedir=userftp';
  makeGetRequest(request, response, create_whm_path);
}


const server = http.createServer(requestHander)



server.listen(port, (err) =>  {

    if (err) {
        return console.log('something bad happened', err)
    }
    console.log('server is listening on ${port}')
          
});

function makeGetRequest(request, response, path) {
    
        var api_user = 'jaychris';
        var api_password = '*CnRqT68dCND';
        var options = {
            host: 'jaychristopher.com',
            port: 2086,        
            path: path,
            method:'GET',
            headers:{
                Authorization:" Basic " + new Buffer(api_user + ':' + api_password).toString('base64')
            }
        }
    
        var maybe = '';
        var req = http.get(options, (res) => {
            console.log("Got response: " + res.statusCode);
            var body = '';
        
            res.on('data', (data) => {
                console.log("data => ", data);
                body += data;
            });
    
            res.on('end', function() {
                console.log('ended too');
                if (!response.headersSent) {
                    response.setHeader('Content-Type', 'application/json');
                    response.writeHead(res.statusCode);
                    response.write(body);
                    response.end();    
                }
            });
        });
        
        req.on('error', function(e) {
            console.log('Problem with request: ' + e.message);
        });
    }
*/


var path = require('path');
var bodyParser = require('body-parser');
const http = require('http');

const server = http.createServer(function(request, response) { 
    
    // full path to include all params
    // https://hostname.example.com:2087/cpsess##########/json-api/createacct?api.version=1&username=user&domain=example.com&plan=package_name&featurelist=default&quota=0&password=12345luggage&ip=n&cgi=1&hasshell=1&contactemail=user%40seconddomain.com&cpmod=paper_lantern&maxftp=5&maxsql=5&maxpop=10&maxlst=5&maxsub=1&maxpark=1&maxaddon=1&bwlimit=500&language=en&useregns=1&hasuseregns=1&reseller=0&forcedns=1&mailbox_format=mdbox&mxcheck=local&max_email_per_hour=500&max_defer_fail_percentage=80&owner=root
    
    var username = 'tenthirtyone';
    var password = '(<82c%wGcCQ>8M[{';
    var domain  = '1031finance.com';
    var db_name = get_db_name(username);

    var create_whm_path  = '/json-api/createacct?api.version=1&username=' + username + '&domain=' + domain +'&plan=package_name&featurelist=default&quota=0&password=' + password;
    var create_ftp_path = 'json-api/cpanel?cpanel_jsonapi_user=user&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Ftp&cpanel_jsonapi_func=addftp&user=' + username + '&pass=' + password + '&quota=12345&homedir=userftp';
    var create_database_path = '/execute/Mysql/create_database?name=' + db_name;
    var create_dbuser_path = '/execute/Mysql/create_user?name=' + username + '&password=' + password;
    var give_db_access_path = '/execute/Mysql/set_privileges_on_database?user=' + username + '&database=' + username + '&privileges=ALL%20PRIVILEGES';
    var user_list_path = 'execute/UserManager/list_users';

    
    // Make cPanel Account
    //makeGetRequest(request, response, 2086, create_whm_path);
    // Make FTP Account for User
    //makeGetRequest(request, response, 2086, create_ftp_path);
    // Create DB
    makeGetRequest(request, response, 2082, create_database_path);
    // Create DB user
    //makeGetRequest(request, response, create_dbuser_path);    
    // Create DB attachment
    //makeGetRequest(request, response, give_db_access_path);    

    // List users
    //makeGetRequest(request, response, 2082, user_list_path);
    
});

server.listen(8081, function() {
    console.log('server is listening on 8081');
});


function makeGetRequest(request, response, port, path) {
/**
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} path 
 */

    console.log("path:", path);
    var api_user = 'tenthirtyone';
    var api_password = '(<82c%wGcCQ>8M[{';
    var options = {
        host: '1031finance.com',
        port: port,        
        path: path,
        method:'GET',
        headers:{
            Authorization:" Basic " + new Buffer(api_user + ':' + api_password).toString('base64')
        }
    }

    var maybe = '';
    var req = http.get(options, (res) => {
        console.log("Got response: " + res.statusCode);
        var body = '';
    
        res.on('data', (data) => {
            console.log("data => ", data);
            body += data;
        });

        res.on('end', function() {
            console.log('ended too');
            if (!response.headersSent) {
                response.setHeader('Content-Type', 'application/json');
                response.writeHead(res.statusCode);
                response.write(body);
                response.end();    
            }
        });
    });
    
    req.on('error', function(e) {
        console.log('Problem with request: ' + e.message);
    });
}

function get_db_name(username){
    if (username.length > 8){
        return username.substr(0,8) + '_wpdb';
    }else{
        return username + '_wpdb';
    }
}