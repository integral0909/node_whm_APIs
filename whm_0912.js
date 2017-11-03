var path = require('path');
var bodyParser = require('body-parser');
const http = require('http');

const server = http.createServer(function(request, response) { 
    
    // full path to include all params
    // https://hostname.example.com:2087/cpsess##########/json-api/createacct?api.version=1&username=user&domain=example.com&plan=package_name&featurelist=default&quota=0&password=12345luggage&ip=n&cgi=1&hasshell=1&contactemail=user%40seconddomain.com&cpmod=paper_lantern&maxftp=5&maxsql=5&maxpop=10&maxlst=5&maxsub=1&maxpark=1&maxaddon=1&bwlimit=500&language=en&useregns=1&hasuseregns=1&reseller=0&forcedns=1&mailbox_format=mdbox&mxcheck=local&max_email_per_hour=500&max_defer_fail_percentage=80&owner=root
    
    var whm_user = 'jaychris';
    var whm_password = '*CnRqT68dCND';
    
    var whm_host = 'jaychristopher.com';
    var user_domain = '1031finance.com';

    // Cpanel user credential
    var username = 'tenthirtyone';
    var password = '(<82c%wGcCQ>8M[{';
    var domain  = '1031finance.com';
    var db_name = create_db_name(username);
    var db_user_name = create_dbuser_name(username);
    var create_whm_path  = '/json-api/createacct?api.version=1&username=' + username + '&domain=' + domain +'&plan=package_name&featurelist=default&quota=0&password=' + password;
    var create_ftp_path = 'json-api/cpanel?cpanel_jsonapi_user=user&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Ftp&cpanel_jsonapi_func=addftp&user=' + username + '&pass=' + password + '&quota=12345&homedir=userftp';

    var create_database_path = '/execute/Mysql/create_database?name=' + db_name;
    var create_dbuser_path = '/execute/Mysql/create_user?name=' + db_user_name + '&password=' + password;
    var give_db_access_path = '/execute/Mysql/set_privileges_on_database?user=' + db_user_name + '&database=' + db_name + '&privileges=ALL%20PRIVILEGES';
    var user_list_path = 'execute/UserManager/list_users';

    var whm_authorization = " Basic " + new Buffer(whm_user + ':' + whm_password).toString('base64');
    var cpanel_authorization = " Basic " + new Buffer(username + ':' + password).toString('base64');

    // Make cPanel Account
    makeGetRequest(request, function(){
        // Create DB
        makeGetRequest(request, function(){
            // Create DB user0
            makeGetRequest(request, function(data) {
                // Create DB attachment
                makeGetRequest(request, response, user_domain, 2082, give_db_access_path, cpanel_authorization, true);
            }, user_domain, 2082, create_dbuser_path, cpanel_authorization, false);

        }, user_domain, 2082, create_database_path, cpanel_authorization, false);
        
        // Make FTP Account for User
        makeGetRequest(request, response, whm_host, 2086, create_ftp_path, whm_authorization, true);
    }, whm_host, 2086, create_whm_path, whm_authorization, false);

    

    // List users
    //makeGetRequest(request, response, user_domain, 2082, user_list_path, true);
    
});

server.listen(8081, function() {
    console.log('server is listening on 8081');
});

/**
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} host 
 * @param {*} port 
 * @param {*} path 
 * @param {*} authorization 
 */
function makeGetRequest(request, response_or_cb, host, port, path, authorization, send_response) {
    var options = {
        host: host,
        port: port,        
        path: path,
        method:'GET',
        headers:{
            Authorization: authorization
        }
    }

    var maybe = '';
    var req = http.get(options, (res) => {
        console.log("Got response: " + res.statusCode);
        var body = [];
        res.setEncoding('utf8');
        res.on('data', (data) => {
            console.log("data => ", data);
            body += data;
        });

        res.on('end', function() {
            if (send_response) {
                if (!response_or_cb.headersSent) {
                    response_or_cb.setHeader('Content-Type', 'application/json');
                    response_or_cb.writeHead(res.statusCode);
                    response_or_cb.write(body);
                    response_or_cb.end();    
                }
            } else {
                response_or_cb(body);
            }
        });
    });
    
    req.on('error', function(e) {
        console.log('Problem with request: ' + e.message);
    });
}

function create_db_name(username){
    if (username.length > 8){
        return username.substr(0,8) + '_wpdb';
    }else{
        return username + '_wpdb';
    }
}

function create_dbuser_name(username){
    if (username.length > 8){
        return username.substr(0,8) + '_wpuser';
    }else{
        return username + '_wpuser';
    }
}