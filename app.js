const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'html');
app.set('views', __dirname);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res) {

  const query = req.body.cityName;

  const apiKey = "88ee1fe4b533a397037536a287621729"
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=metric&appid=" + apiKey

  https.get(url, function(response) {

    if (response.statusCode === 200) {

      response.on("data", function(data) {
        const weatherData = JSON.parse(data)

        const temp = Math.round(weatherData.main.temp);
        const des = weatherData.weather[0].main;
        const disCity = weatherData.name;
        const riseTimeSec = weatherData.sys.sunrise
        const setTimeSec = weatherData.sys.sunset
        const windSpeed = weatherData.wind.speed;
        const pressure = weatherData.main.pressure;
        const humidity = weatherData.main.humidity;

        var date = new Date(riseTimeSec * 1000);
        var timestr = date.toLocaleTimeString();
        var date1 = new Date(setTimeSec * 1000);
        var timestr1 = date1.toLocaleTimeString();

        const icon = weatherData.weather[0].icon
        const iconurl = "http://openweathermap.org/img/wn/" + icon + "@2x.png"

        const htmlDoc = `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${disCity} | Live Weather App</title>
            <link rel="icon" href="Images/favIcon.png">

            <link href="https://fonts.googleapis.com/css2?family=Bree+Serif&display=swap" rel="stylesheet">

            <link rel="stylesheet" href="reStyle.css">
          </head>
          <body>
            <div class="Container">
              <h1>${disCity}</h1>
              <div class="imgCon">
                 <img src="${iconurl}" alt="">
              </div>
              <ul>
              <li><span class="ulHead">Weather:</span> <spam class="disData">${des}</spam></li>
              <li><span class="ulHead">Temperature</span>: <spam class="disData">${temp} &#8451;</spam></li>
              <li><span class="ulHead">Wind Speed</span>: <spam class="disData">${windSpeed} m/s</spam></li>
              <li><span class="ulHead">Pressure</span>: <spam class="disData">${pressure} hpa</spam></li>
              <li><span class="ulHead">Humidity</span>: <spam class="disData">${humidity}%</spam></li>
              <li><span class="ulHead">SunRise at</span>: <spam class="disData">${date}</spam></li>
              <li><span class="ulHead">SunSet at</span>: <spam class="disData">${date1}</spam></li>
              </ul>
            </div>
            <form class="" action="/main" method="post">
            <div class="btnCon"><button type="submit" name="submit">&larr; Go Back</button></div>
            </form>
          </body>
        </html>
        `;

        res.send(htmlDoc);

      })

    } else {
      res.sendFile(__dirname + "/error.html");
    }
  })

})
app.post("/main", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on the port 3000.");
})
