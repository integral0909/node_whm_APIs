var prompt = require('prompt');
var path = require('path');
var bodyParser = require('body-parser');
const http = require('http');

var schema = {
    properties: {
        username: {
            pattern: /^[a-zA-Z0-9\-]+$/,
            message: 'Username must be only letters, numbers, or dashes',
            required: true
        },
        password: {
            hidden: true,
            default: '(<82c%wGcCQ>8M[{'
        },
        domain: {
            pattern: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/,
            message: 'Must input domain',          
            required: true
        },
        emailaccount: {
            pattern: /^[a-zA-Z0-9\-]+$/
        },
        forward_dest_domain: {
            pattern: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/,
        },
        forward_dest_email: {
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        }
    }
  };

// 
// Start the prompt 
// 
prompt.start();



// 
// Get two properties from the user: username and email 
// 
prompt.get('schema', function (err, result) {

    // 
    // Log the results. 
    // 
    console.log('Command-line input received:');
    console.log('  username: ' + result.username);
    console.log('  password: ' + result.password);
    console.log('  domain: ' + result.domain);
    console.log('  emailaccount: ' + result.emailaccount);
    console.log('  forward_dest_domain: ' + result.forward_dest_domain);
    console.log('  forward_dest_email: ' + result.forward_dest_email);
    initRequestVariables(result.username, result.password, result.domain, result.emailaccount, result.forward_dest_domain, result.forward_dest_email);
});


function initRequestVariables(username, password, domain, emailaccount, forward_dest_domain, forward_dest_email){
    // full path to include all params
    // https://hostname.example.com:2087/cpsess##########/json-api/createacct?api.version=1&username=user&domain=example.com&plan=package_name&featurelist=default&quota=0&password=12345luggage&ip=n&cgi=1&hasshell=1&contactemail=user%40seconddomain.com&cpmod=paper_lantern&maxftp=5&maxsql=5&maxpop=10&maxlst=5&maxsub=1&maxpark=1&maxaddon=1&bwlimit=500&language=en&useregns=1&hasuseregns=1&reseller=0&forcedns=1&mailbox_format=mdbox&mxcheck=local&max_email_per_hour=500&max_defer_fail_percentage=80&owner=root
    
    var whm_user = 'jaychris';
    var whm_password = '*CnRqT68dCND';
    var whm_host = 'jaychristopher.com';

    // Cpanel user credential
    var db_name = create_db_name(username);
    var db_user_name = create_dbuser_name(username);

    var whm_authorization = " Basic " + new Buffer(whm_user + ':' + whm_password).toString('base64');
    var cpanel_authorization = " Basic " + new Buffer(username + ':' + password).toString('base64');
    
    var create_whm_path  = '/json-api/createacct?api.version=1&username=' + username + '&domain=' + domain +'&plan=package_name&featurelist=default&quota=0&password=' + password;
    var create_ftp_path = '/json-api/cpanel?cpanel_jsonapi_user=user&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Ftp&cpanel_jsonapi_func=addftp&user=' + username + '&pass=' + password + '&quota=12345&homedir=userftp';
    var create_database_path = '/execute/Mysql/create_database?name=' + db_name;
    var create_dbuser_path = '/execute/Mysql/create_user?name=' + db_user_name + '&password=' + password;
    var give_db_access_path = '/execute/Mysql/set_privileges_on_database?user=' + db_user_name + '&database=' + db_name + '&privileges=ALL%20PRIVILEGES';
    var user_list_path = '/execute/UserManager/list_users';
    var create_email_path = '/execute/Email/add_pop?email=' + emailaccount + '&password=' + password + '&quota=0&domain=' + domain + '&skip_update_db=1';
    var add_domain_forwarder_path = '/execute/Email/add_domain_forwarder?domain=' + domain + '&destdomain=' + forward_dest_domain;
    var add_email_forwarder_path = '/execute/Email/add_forwarder?domain=' + domain + '&email=' + emailaccount + '%40' + domain + '&fwdopt=fwd&fwdemail=' + forward_dest_email;

    console.log('Sending requests......');
    // Make cPanel Account
    makeGetRequest(function(data){        
        // Create DB
        makeGetRequest(function(data){
            // Create DB user0
            makeGetRequest(function(data) {
                // Create DB attachment
                makeGetRequest(null, domain, 2082, give_db_access_path, cpanel_authorization, true);
            }, domain, 2082, create_dbuser_path, cpanel_authorization, false);

            if (emailaccount.length > 0){
                // Create email
                makeGetRequest(function(data) {
                    if (forward_dest_email.length > 0){
                        // Add mail forwarder
                        makeGetRequest(null, domain, 2082, add_email_forwarder_path, cpanel_authorization, true);
                    }
                    if (forward_dest_domain.length > 0){
                        // Add domain forwarder
                        makeGetRequest(null, domain, 2082, add_domain_forwarder_path, cpanel_authorization, true);                
                    }
                }, domain, 2082, create_email_path, cpanel_authorization, false);
            }

        }, domain, 2082, create_database_path, cpanel_authorization, false);
        
        // Make FTP Account for User
        makeGetRequest(null, whm_host, 2086, create_ftp_path, whm_authorization, true);
    }, whm_host, 2086, create_whm_path, whm_authorization, false);

    

    // List users
    //makeGetRequest(request, response, domain, 2082, user_list_path, true);
}


/**
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} host 
 * @param {*} port 
 * @param {*} path 
 * @param {*} authorization 
 */
function makeGetRequest(callback, host, port, path, authorization, send_response) {
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
            if (res.statusCode != 401) {
                console.log("data => ", data);
                body += data;
            }                
        });

        res.on('end', function() {
            if (res.statusCode == 401) console.log('Response :' + res.statusMessage);
            if (send_response) {
                console.log('Response :' + body);
                // if (!callback.headersSent) {
                //     callback.setHeader('Content-Type', 'application/json');
                //     callback.writeHead(res.statusCode);
                //     callback.write(body);
                //     callback.end();    
                // }
            } else {
                callback(body);
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