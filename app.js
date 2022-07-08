const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request  = require("request");



const app =express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));



app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html")
});

app.post("/",function(req,res){

  const query = req.body.cityName;
  const apikey = "70ccf3c02b0ed4f260df110030838901";
  const unit = "metric"
  const url="https://api.openweathermap.org/data/2.5/weather?q="+ query +"&units=" +unit + "&appid="+ apikey ;

  https.get(url,function(response){
    console.log(response.statusCode);

    response.on("data",function(data){
      const wheatherData = JSON.parse(data);

   if(wheatherData.cod ==200){
      const temp=wheatherData.main.temp;
      const city=wheatherData.name;
      const wheather = wheatherData.weather[0].description;
      const icon =  wheatherData.weather[0].icon;
      const humidity = wheatherData.main.humidity;
      const tmax = wheatherData.main.temp_max;
      const tmin = wheatherData.main.temp_min;
      const wind = wheatherData.wind.speed;
      const windspeed = wind*3.6;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.send(`<!doctype html>
         <html lang="en">
           <head>
             <meta charset="utf-8">
             <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
             <meta name="description" content="">
             <meta name="author" content="">
             <title>GoWeather</title>
             <!-- Bootstrap core CSS -->
             <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
             <!-- Custom styles for this template -->
             <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400&display=swap" rel="stylesheet">


           </head>
           <body>

           <nav class="navbar navbar-dark  " style="background-color:#00adb5;">
           <div class="container" style="margin-left:5px;">
           <a class="navbar-brand" href="#">☀ GoWeather
           </a>
           </div>
          </nav>

             <div class="jumbotron jumbotron-fluid"style="background-color:#d2d3c9;">
             <div class="container">
             <h1 class="display-4">Temperature in ${query} is ${temp}°C</h1>
             <p class="lead"><img src="${imageURL}"> ${wheather.toUpperCase()}</p>
             <p> Maximum Temperature : ${tmax}°C</p>
             <p> Minimum Temperature : ${tmin}°C</p>
             <p> Humidity : ${humidity}%</p>
             <p> Wind : ${windspeed.toFixed(2)} km/h</p>
           </div>
           <br>
           <form action="/return" method="post">
         <button class="btn btn-lg btn-info" type="submit" name="button" style = "margin-left: 205px;"> Search Another City</button>
         </form>
           </div>
           </body>
         </html>`);

    }

    else {
      res.sendFile(__dirname +"/failure.html");
    }

        });
  });
});


app.post("/return",function(req,res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
  console.log("server is running on port 3000");
});
