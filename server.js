var path = require('path');
var bodyParser = require('body-parser');
const http = require('http');

const server = http.createServer(function(request, response) { 
    

    // 'json-api/cpanel?cpanel_jsonapi_user=user&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Ftp&cpanel_jsonapi_func=addftp&user=user4&pass=12345luggage&quota=12345&homedir=userftp'
    // path: '/json-api/createacct?api.version=1&username=user333&domain=example333.com&plan=package_name&featurelist=default&quota=0&password=12345luggage',

    // full path to include all params
    // https://hostname.example.com:2087/cpsess##########/json-api/createacct?api.version=1&username=user&domain=example.com&plan=package_name&featurelist=default&quota=0&password=12345luggage&ip=n&cgi=1&hasshell=1&contactemail=user%40seconddomain.com&cpmod=paper_lantern&maxftp=5&maxsql=5&maxpop=10&maxlst=5&maxsub=1&maxpark=1&maxaddon=1&bwlimit=500&language=en&useregns=1&hasuseregns=1&reseller=0&forcedns=1&mailbox_format=mdbox&mxcheck=local&max_email_per_hour=500&max_defer_fail_percentage=80&owner=root
    console.log("request received.");
    var username = 'userr';
    var password = '12345luggage';
    var domain  = 'example5.com';
    var create_whm_path  = '/json-api/createacct?api.version=1&username=' + username + '&domain=' + domain +'&plan=package_name&featurelist=default&quota=0&password=' + password;
    var create_ftp_path = 'json-api/cpanel?cpanel_jsonapi_user=user&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Ftp&cpanel_jsonapi_func=addftp&user=' + username + '&pass=' + password + '&quota=12345&homedir=userftp';
    makeGetRequest(request, response, create_whm_path);
    //makeGetRequest(request, response, create_ftp_path);
    
});

server.listen(8080, function() {
    console.log('server is listening on 8080');
});


/**
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} path 
 */
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