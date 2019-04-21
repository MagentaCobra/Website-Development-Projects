#!/usr/bin/nodejs

// -------------- load packages -------------- //
var express = require('express');
var simpleoauth2 = require("simple-oauth2");
var app = express();
var path = require('path');
var hbs = require('hbs');
var cookieSession = require("cookie-session");
var request  = require("request");
var mysql = require("mysql");
var fs = require("fs");

// -------------- express initialization -------------- //
app.set('port', process.env.PORT || 8080 );
app.set("trust proxy", 1);
app.set('view engine', 'hbs');

//first login OAUTH variable
app.use(cookieSession({
    name: "snorkoaj",
    keys: ["secretoKey", "changedisfrance"]
}))
var ion_client_id = "zibWSVVafVZlWpeNJORQs3iwAaqtFmPvu4BYeZS7";
var ion_client_secret = "XOqEUiDKYVBiDaXhLDVTL1rp6L4KIYyJ8PS2eVkkb8BtF5L9Ly4hS6pMOtjgjFLy12QNztoxqMZOOJSyHGmYEGcbNAYipe7vDu9BkRsf0Ii3quwgUzaBrQwbXUrwumVC";
var ion_redirect_uri = "https://user.tjhsst.edu/2020rbai/login";
var oauth2 = simpleoauth2.create({
   client: {
       id: ion_client_id,
       secret: ion_client_secret
   },
   auth: {
       tokenHost: "https://ion.tjhsst.edu/oauth/",
       authorizePath: "https://ion.tjhsst.edu/oauth/authorize",
       tokenPath: "https://ion.tjhsst.edu/oauth/token/"
   }
});
//below is link used to login (asks for user permission) broken
var authorizationUri = oauth2.authorizationCode.authorizeURL({
    scope: "read",
    redirect_uri: ion_redirect_uri
});

//scrabble's OAUTH variables
var userID = "none";
// -------------- serve static folders -------------- //
app.use('/js', express.static(path.join(__dirname, 'js')))
app.use('/css', express.static(path.join(__dirname, 'css')))
app.use('/gif', express.static(path.join(__dirname, 'gif')))

var pool  = mysql.createPool({
      connectionLimit : 10,
      user            : 'site_2020rbai',
      password        : 'q8dsfJ9FzKQtW22rnwaBdkcJ',
      host            : 'mysql1.csl.tjhsst.edu',
      port            : 3306,
      database        : 'site_2020rbai'
    });
/*
var listener = app.listen(app.get("port"), function() {
    console.log("Express server on port "+listener.address().port);
});
*/
// -------------- variable definition -------------- //
var visitorCount = 0; 

// -------------- express 'get' handlers -------------- //
app.get('/', function(req, res){
    
    var message = "You need to login. Click here:";
    if(typeof req.session.token != "undefined") {
       //send to page requesting login
       message = "You are logged in!"
   }
   /*
   var access_token = req.session.token.token.access_token;
   var my_ion_request = "https://ion.tjhsst.edu/api/profile?format=json&access_token="+access_token;
   console.log(my_ion_request);
   //asychronous below
   request.get({url:my_ion_request}, function(e, r, body) {
      var res_object = JSON.parse(body);
      message = res_object["short_name"]+" "+res_object["last_name"]+message;
      res.render("home", {message});
   });
   */
   //message = res_object["short_name"]+" "+res_object["last_name"]+message;
   res.render("home", {message});
    //res.sendFile(__dirname + '/home.html');
});
app.get("/homeLog", function(req, res){
    if(typeof req.session.token == "undefined") {
       //send to page requesting login
       var output_string = "";
       output_string += "<!doctype html>\n";
       output_string += "<html><head></head><body>\n";
       output_string += "<a href="+authorizationUri+">Login To Play</a>";
       output_string += "</body></html>";
       //send away
       res.send(output_string);
   }
   else
   {
       var access_token = req.session.token.token.access_token;
       var my_ion_request = "https://ion.tjhsst.edu/api/profile?format=json&access_token="+access_token;
       console.log(my_ion_request);
       //asychronous below
       request.get({url:my_ion_request}, function(e, r, body) {
          var res_object = JSON.parse(body);
          var message = res_object["short_name"]+" "+res_object["last_name"]+", no need to login more!";
          userID = res_object["short_name"]+" "+res_object["last_name"];
          res.render("home", {message});
       });
   }
});
/*
app.get('/:page', function(req, res){
    var landingPage = req.params.page
    console.log('User requested page: '+landingPage)

    res.sendFile(__dirname + '/survey.html');
});
*/
app.get('/states', function(req, res){
    res.sendFile(__dirname + '/index.html'); 
});

app.get('/survey', function(req, res){
    res.sendFile(__dirname + '/survey.html');
});

//FINAL PROJECT THING
app.get('/tutorial', function(req, res){
   if(typeof req.session.token == "undefined") {
       //send to page requesting login
       var output_string = "";
       output_string += "<!doctype html>\n";
       output_string += "<html><head></head><body>\n";
       output_string += "<a href="+authorizationUri+">Login To Play</a>";
       output_string += "</body></html>";
       //send away
       res.send(output_string);
   }
   else
   {
       var access_token = req.session.token.token.access_token;
       var my_ion_request = "https://ion.tjhsst.edu/api/profile?format=json&access_token="+access_token;
       console.log(my_ion_request);
       //asychronous below
       request.get({url:my_ion_request}, function(e, r, body) {
          var res_object = JSON.parse(body);
          var message = res_object["short_name"]+" "+res_object["last_name"]+", Welcome!";
          userID = res_object["short_name"]+" "+res_object["last_name"];
          res.render("tutorial", {message});
       });
   }
});

app.get("/cube_solver", function(req, res){
    var input = req.query.user;
    //console.log(input);
    var cube = [];
    cube[0] = "dummy";
    for(var i=1; i <= 24; i++)
    {
        cube[i] = input[i-1];
    }
    var start = badInput(cube);
    if(start == null)
        res.send("Bad scramble");

    else
    {
        var seen = {};
        var q = [];
        var pointer = 0;
        q.push(cube);
        var path = {};
        var moving = {};
        while(q.length > 0)
        {
            var curr = q[0];
            var stringCurr = "";
            for(var i=1; i <= 24; i++)
                stringCurr += curr[i];
            q.shift();
            if(curr in seen)
            {
                pointer++;
                continue;
            }
            seen[curr] = 1;
            
            var checking = 0;
            var goal = "WWWWGGRRBBOOGGRRBBOOYYYY";
            for(var i=1; i <= 24; i++){
                if(curr[i] != goal[i-1]){
                    checking = 1;
                    //res.send("rip "+curr);
                }
            }
            if(checking == 0)
                res.send(path[stringCurr]+" ");
            //U turns
            pointer += 1;
            for(var i=0; i < 3; i++)
            {
                var next = turnUp(curr);
                var midpart = turnUp(curr);
                
                var frost = "";
                for(var i=1; i <= 24; i++)
                    frost += next[i];
                //res.send(next);
                if(!(next in seen))
                {
                    q.push(next);
                    path[frost] = stringCurr;
                        moving[frost] = "U";
                    //pointer += 1;
                }
                /*
                for(var a=0; a < i; a++)
                {
                    next = turnUp(midpart);
                    midpart = next;
                    if(!(next in seen))
                    {
                        q.push(next);
                        //pointer += 1;
                    }
                }
                */
            }
            //F turns
            for(var i=0; i < 3; i++)
            {
                var next = turnFront(curr);
                var midpart = turnFront(curr);
                
                var frost = "";
                for(var i=1; i <= 24; i++)
                    frost += next[i];
                if(!(next in seen))
                    {
                        q.push(next);
                        path[frost] = stringCurr;
                        moving[frost] = "F";
                        //pointer += 1;
                    }
                /*
                for(var a=0; a < i; a++)
                {
                    next = turnFront(midpart);
                    midpart = next;
                    if(!(next in seen))
                    {
                        q.push(next);
                        //pointer += 1;
                    }
                }
                */
            }
            //R turns
            for(var i=0; i < 3; i++)
            {
                var next = turnRight(curr);
                var midpart = turnRight(curr);
                
                var frost = "";
                for(var i=1; i <= 24; i++)
                    frost += next[i];
                if(!(next in seen))
                    {
                        q.push(next);
                        path[frost] = stringCurr;
                        moving[frost] = "R";
                        //pointer += 1;
                    }
                /*
                for(var a=0; a < i; a++)
                {
                    next = turnRight(midpart);
                    midpart = next;
                    if(!(next in seen))
                    {
                        q.push(next);
                        //pointer += 1;
                    }
                }
                */
            }
            //add path saving quality
        }
        
        res.send("Solved~~");
    }
    function turnFront(input)
    {
        var swap = [];
        swap.push("3 7 22 20");
        swap.push("4 15 21 12");
        swap.push("5 6 14 13");
        var newCube = [];
        for(var i=0; i <= 24; i++)
        {
            newCube[i] = input[i];
        }
        for(var i=0; i < 3; i++)
        {
            var temp = swap[i].split(" ");
            var t = newCube[temp[0]];
            for(var j=0; j < 3; j++)
            {
                var over = t;
                t = newCube[temp[j+1]];
                newCube[temp[j+1]] = over;
            }
            newCube[temp[0]] = t;
        }
        var stringC = "";
        for(var i=1; i <= 24; i++)
            stringC += newCube[i];
        return newCube;
    }
    function turnUp(input)
    {
        var swap = [];
        swap.push("1 2 4 3");
        swap.push("7 5 11 9");
        swap.push("6 12 10 8");
        var newCube = [];
        for(var i=0; i <= 24; i++)
        {
            newCube[i] = input[i];
        }
        for(var i=0; i < 3; i++)
        {
            var temp = swap[i].split(" ");
            var t = newCube[temp[0]];
            for(var j=0; j < 3; j++)
            {
                var over = t;
                t = newCube[temp[j+1]];
                newCube[temp[j+1]] = over;
            }
            newCube[temp[0]] = t;
        }
        var stringC = "";
        for(var i=1; i <= 24; i++)
            stringC += newCube[i];
        return newCube;
    }
    function turnRight(input)
    {
        var swap = [];
        swap.push("4 9 24 14");
        swap.push("2 17 22 6");
        swap.push("8 16 15 7");
        var newCube = [];
        for(var i=0; i <= 24; i++)
        {
            newCube[i] = input[i];
        }
        for(var i=0; i < 3; i++)
        {
            var temp = swap[i].split(" ");
            var t = newCube[temp[0]];
            for(var j=0; j < 3; j++)
            {
                var over = t;
                t = newCube[temp[j+1]];
                newCube[temp[j+1]] = over;
            }
            newCube[temp[0]] = t;
        }
        var stringC = "";
        for(var i=1; i <= 24; i++)
            stringC += newCube[i];
        return newCube;
    }
    function badInput(cube)
    {
        var pieces = [];
        pieces.push("1 10 11");
         pieces.push("2 8 9");
         pieces.push("3 5 12");
         pieces.push("4 6 7");
         pieces.push("13 20 21");
         pieces.push("14 15 22");
         pieces.push("16 17 24");
         pieces.push("18 19 23");
        var resultC = [];
        for(var i=0; i < 8; i++)
        {
            var temp = pieces[i].split(" ");
            var a = temp[0];
            var b = temp[1];
            var c = temp[2];
            if(convert(a, b, c, cube) == null)
            {
                return null;
            }
            else{
                resultC.push(convert(a, b, c, cube));
            }
        }
        return resultC;
    }
    function convert(a, b, c, cube)
    {
        if(cube[a] == cube[b] || cube[a] == cube[c] || cube[b] == cube[c])
            return null;
        opposites = {};
        opposites["GB"] = 1;
        opposites["BG"] = 1;
        opposites["WY"] = 1;
        opposites["YW"] = 1;
        opposites["RO"] = 1;
        opposites["OR"] = 1;
        var s1 = cube[a]+""+cube[b];
        var s2 = cube[a]+""+cube[c];
        var s3 = cube[b]+""+cube[c];
        if(s1 in opposites || s2 in opposites || s3 in opposites)
            return null;
        return cube[a]+" "+cube[b]+" "+cube[c];
    }
    //res.send(cube[0]);
});

//cookioaj clickioaj
app.get("/cookieClicker", function(req, res){
    if(typeof req.session.token == "undefined") {
       //send to page requesting login
       var output_string = "";
       output_string += "<!doctype html>\n";
       output_string += "<html><head></head><body>\n";
       output_string += "<a href="+authorizationUri+">Login To Play</a>";
       output_string += "</body></html>";
       //send away
       res.send(output_string);
   }
   else
   {
           var access_token = req.session.token.token.access_token;
           var my_ion_request = "https://ion.tjhsst.edu/api/profile?format=json&access_token="+access_token;
           console.log(my_ion_request);
           request.get({url:my_ion_request}, function(e, r, body) {
              var res_object = JSON.parse(body);
              userID = res_object["short_name"]+" "+res_object["last_name"];
           });
        res.sendFile(__dirname + "/cookieClicker.html");
        //userID = res_object["short_name"]+" "+res_object["last_name"];
   }
});
var clicks = 0;
var deltaC = 1;
app.get("/increase", function(req, res){
    
    if(clicks < 100)
    {
        res.send("Not enough clicks!");
    }
    else
    {
        clicks -= 100;
        deltaC += 1;
    }
    res.send("Click increased!");
});

app.get("/clickHelper", function(req, res){
    
    pool.query('SELECT * FROM students', function (error, results, fields) {
      if (error) 
        throw error;
      //console.log("Reee"+results);
      //res.send(results[0].s_name+" "+userID);
      //res.send(results[0].s_name+" "+results[1].s_name);
      //find way to identify primary ID 
      //if can't find it then add (newID, 0, 0) to table
      //update real time every click and purchase
      //res.send(results[2].id+" "+results[2].clicks
      clicks += deltaC;
      res.send(clicks+"");
    });
});

var money = 0;
app.get("/clickBuyer", function(req, res){

    if(clicks >= 50)
    {
        money += 100;
        clicks -= 50;
    }
    else if(clicks >= 20)
    {
        money += 36;
        clicks -= 20;
    }
    else if(clicks >= 12)
    {
        money += 20;
        clicks -= 12;
    }
    else if(clicks >= 7)
    {
        money += 10;
        clicks -= 7;
    }
    else if(clicks > 0)
    {
        money += 1;
        clicks -= 1;
    }
    else
        res.send(money+"");
    res.send(money+"");
});

//AJAX
var BBcount = 0;
var WGcount = 0;
app.get('/dress_poll', function(req, res){
   var input = req.query.user;
   var thing = 0;
   if(input == "BB")
   {
        BBcount += 1;
        thing = BBcount;
   }
    else
    {
        WGcount += 1;
        thing = WGcount;
    }
   res.send(input+" "+thing);
});

app.get('/profile', function(req, res){
    res.sendFile(__dirname + '/profile.html');
});
/*
var testing = "";
app.get('/scrabble', function(req, res){
    testing = "(username)";
    res.render("scrabble", {testing}); 
});
*/
app.get("/log", function(req, res){
   res.sendFile(__dirname + "/log.html"); 
});

//Trying out SQL for the first time 
app.get("/sqlTest", function(req, res){
   res.sendFile(__dirname + "/sqlTest.html"); 
});
app.get("/sqlHelper", function(req, res){
    
    pool.query('SELECT id FROM students', function (error, results, fields) {
      if (error) throw error;
      //console.log('The solution is: ', results[0].solution);
      //result0 = results.students;
      //res.send(results[0].id+" "+results[1].id);
      res.send(results);
    });
    
    //res.send("My result: "+result0);
});
var boof = 0;
//scrabble login
//create 2nd application
app.get('/scrabble', function(req, res){
   //this either shows user information or gives the ugly link
   if(typeof req.session.token == "undefined") {
       //send to page requesting login
       var output_string = "";
       output_string += "<!doctype html>\n";
       output_string += "<html><head></head><body>\n";
       output_string += "<a href="+authorizationUri+">Login To Play</a>";
       output_string += "</body></html>";
       //send away
       res.send(output_string);
   }
   else {
       //send user to information page
       var access_token = req.session.token.token.access_token;
       var my_ion_request = "https://ion.tjhsst.edu/api/profile?format=json&access_token="+access_token;
       console.log(my_ion_request);
       //asychronous below
       request.get({url:my_ion_request}, function(e, r, body) {
          var res_object = JSON.parse(body);
          //console.log(body);
          //console.log(user_name);
          var testing = "";
          testing = res_object["short_name"]+" "+res_object["last_name"];
          boof += 1;
          userID = res_object["short_name"]+" "+res_object["last_name"];
          res.render("scrabble", {testing, boof});
       });
   }
});

//first login
/*
app.get('/creepy', function(req, res){
   //this either shows user information or gives the ugly link
   if(typeof req.session.token == "undefined") {
       //send to page requesting login
       var output_string = "";
       output_string += "<!doctype html>\n";
       output_string += "<html><head></head><body>\n";
       output_string += "<a href="+authorizationUri+">Ugly login</a>";
       output_string += "</body></html>";
       //send away
       res.send(output_string);
   }
   else {
       //send user to information page
       var access_token = req.session.token.token.access_token;
       var my_ion_request = "https://ion.tjhsst.edu/api/profile?format=json&access_token="+access_token;
       console.log(my_ion_request);
       //asychronous below
       request.get({url:my_ion_request}, function(e, r, body) {
          var res_object = JSON.parse(body);
          //console.log(body);
          user_name = res_object["short_name"];
          //console.log(user_name);
          var output_string = "";
          output_string += "<!doctype html>\n";
          output_string += "<html><head></head><body>\n";
          output_string += "<p>Hello "+user_name+" :)</p>\n";
          output_string += "<p>Your middle name is "+res_object["middle_name"]+"<p>\n";
          output_string += "</body></html>";
          
          res.send(output_string);
       });
   }
});
*/

// -------------- login helper ---------- //
//must match ion_redirect_uri for OAUTH 
app.get("/login", async function(req, res) {
   if(typeof req.query.code != "undefined") {
       var theCode = req.query.code;
       var options = {
           code: theCode,
           redirect_uri: ion_redirect_uri,
           scope: "read"
       };
       result = await oauth2.authorizationCode.getToken(options);
       token = oauth2.accessToken.create(result);
       
       req.session.token = token;
       res.redirect("https://user.tjhsst.edu/2020rbai/");
   } 
   else {
       //userID = res_object["short_name"]+" "+res_object["last_name"];
       res.send("no code attached");
   }
});

//use space below for word finding
var chars = fs.readFileSync(__dirname + '/enable1.txt').toString();
var lines = chars.split("\n");
app.get("/compute", function(req, res){
    var input = req.query.user;
    //res.send(input+"waj");
    //recursion!
    var inputMap = {};
    createInitial(input, inputMap);
    
    function createInitial(str, dict) {
        for(var i=0; i < str.length; i++)
        {
            var key = str[i];
            if(key in dict)
                dict[key] += 1;
            else
                dict[key] = 1;
        }
    }
    //use above hashmap to compare with enable1.txt
    var results = [];
    var longest = [];
    var size = 0;
    for(var i=0; i < lines.length; i++)
    {
        var word = lines[i];
        var temp = {};
        createInitial(word, temp);
        var bool = true;
        var offcount = 0;
        
        if(word.length > input.length)
            continue;
        for(var key in temp)
        {
            if(key in inputMap && inputMap[key] >= temp[key])
                console.log("Check1");
            else
            {
                bool = false;
                if(key in inputMap)
                    offcount += temp[key]-inputMap[key];
                else
                    offcount += temp[key];
            }
        }
        //check the wildcard inputs
        if("!" in inputMap && offcount <= inputMap["!"])
            bool = true;
        
        if(bool)
        {
            results.push(word);
            if(size < word.length)
            {
                longest = [];
                longest.push(word);
                size = word.length;
            }
            else if(size == word.length)
                longest.push(word);
        }
    }
    if(req.query.radioB == "yes")
        res.send(longest);
    else
        res.send(results);
    //res.send(input+" "+req.query.radioB);
});

// -------------- listener -------------- //
// The listener is what keeps node 'alive.' 
var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});