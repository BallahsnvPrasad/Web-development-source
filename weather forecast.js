/*accessing date format from user format*/
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]

}, 1000);

/*It is used to accessing auto location from the user*/
const apikey = "c67ecb3fc78b4d4c96f4ea42c0fe782d";
window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lon = position.coords.longitude;
            let lat = position.coords.latitude;
            const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` + `lon=${lon}&appid=${apikey}`;

            fetch(url).then((res) => {
                return res.json();
            }).then((data) => {
                console.log(data);
                console.log(new Date().getTime())
                var dat = new Date(data.dt)
                console.log(dat.toLocaleString(undefined, 'Asia/Kolkata'))
                console.log(new Date().getMinutes())
                weatherReport(data);
            })
        })
    }
})

/*accessing user searching city by using search bar*/
function searchByCity() {
    var place = document.getElementById('input').value;
    var urlsearch = `http://api.openweathermap.org/data/2.5/weather?q=${place}&` + `appid=${apikey}`;

    fetch(urlsearch).then((res) => {
        return res.json();
    }).then((data) => {
        console.log(data);
        weatherReport(data);
    })
    document.getElementById('input').value = '';
}

/*Gathering data from the webserver using APIKEY*/
function weatherReport(data) {

    var urlcast = `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` + `appid=${apikey}`;

    fetch(urlcast).then((res) => {
        return res.json();
    }).then((forecast) => {
        console.log(forecast.city);

        dayForecast(forecast)

        console.log(data);
        document.getElementById('city').innerText = data.name + ', ' + data.sys.country;
        console.log(data.name, data.sys.country);

        document.getElementById('humidity').innerText = data.main.humidity;
        console.log(data.main.humidity);

        document.getElementById('pressure').innerText = data.main.pressure;
        console.log(data.main.pressure);

        document.getElementById('windspeed').innerText = data.wind.speed;
        console.log(data.wind.speed);

        console.log(Math.floor(data.main.temp - 273));
        document.getElementById('temperature').innerText = Math.floor(data.main.temp - 273) + ' °C';

        document.getElementById('clouds').innerText = data.weather[0].description;
        console.log(data.weather[0].description)

        let icon1 = data.weather[0].icon;
        let iconurl = "http://api.openweathermap.org/img/w/" + icon1 + ".png";
        document.getElementById('img').src = iconurl
    })

}


/*Accessing future forecast fron the webserver*/
function dayForecast(forecast) {
    document.querySelector('.weekF').innerHTML = ''
    for (let i = 8; i < forecast.list.length; i += 8) {
        console.log(forecast.list[i]);
        let div = document.createElement('div');
        div.setAttribute('class', 'dayF');

        let day = document.createElement('p');
        day.setAttribute('class', 'date')
        day.innerText = new Date(forecast.list[i].dt * 1000).toDateString(undefined, 'Asia/Kolkata');
        div.appendChild(day);

        let temp = document.createElement('p');
        temp.innerText = Math.floor((forecast.list[i].main.temp_max - 273)) + ' °C';
        div.appendChild(temp);

        let description = document.createElement('p');
        description.setAttribute('class', 'desc')
        description.innerText = forecast.list[i].weather[0].description;
        div.appendChild(description);

        document.querySelector('.weekF').appendChild(div)
    }
} 