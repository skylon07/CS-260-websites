async function alertOnErr(callback, context, args) {
    try {
        await callback(...args)
    } catch(err) {
        alert(`${context} failed! ${err}`)
    }
}

function alertOnErrCallback(callback, context) {
    return (...args) => alertOnErr(callback, context, args)
}

async function fetchWeather(cityName) {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName},US&units=imperial&APPID=591915043b1a48d778f9d7ce44e3a626`)
    const json = await response.json()
    return json
}

async function fetchForecast(cityName) {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName},US&units=imperial&APPID=591915043b1a48d778f9d7ce44e3a626`)
    const json = await response.json()
    return json
}

const weatherSubmit = document.getElementById('weatherSubmit')
const weatherInput = document.getElementById('weatherInput')
const weatherResults = document.getElementById('weatherResults')
weatherSubmit.addEventListener("click", alertOnErrCallback(async (event) => {
    event.preventDefault()
    
    const city = await fetchWeather(weatherInput.value)

    const nameHeader = document.createElement("h2")
    nameHeader.textContent = `Weather in ${city.name}`

    const tempHeader = document.createElement("h2")
    tempHeader.innerHTML = `${city.main.temp} &deg;F`

    const descStrs = []
    const imgs = []
    for (let i = 0; i < city.weather.length; i += 1) {
        const weather = city.weather[i]

        descStrs.push(weather.description)

        const img = document.createElement("img")
        img.src = `http://openweathermap.org/img/w/${weather.icon}.png`
        imgs.push(img)
    }

    const desc = document.createElement("p")
    desc.textContent = descStrs.reduce((descStr, descPart) => descStr + ", " + descPart)

    weatherResults.innerHTML = ""
    weatherResults.appendChild(nameHeader)
    weatherResults.appendChild(...imgs)
    weatherResults.appendChild(tempHeader)
    weatherResults.appendChild(desc)
    weatherResults.appendChild(document.createElement("br"))

    const forecast = await fetchForecast(weatherInput.value)

    for (let i = 0; i < forecast.list.length; i += 1) {
        const currForecast = forecast.list[i]

        const header = document.createElement("h2")
        header.textContent = moment(currForecast.dt_txt).format("MMMM Do YYYY, h:mm:sss a")
        weatherResults.appendChild(header)

        const temp = document.createElement("p")
        temp.textContent = `Temperature: ${currForecast.main.temp}`
        weatherResults.appendChild(temp)

        const img = document.createElement("img")
        img.src = `http://openweathermap.org/img/w/${currForecast.weather[0].icon}.png`
        weatherResults.appendChild(img)
    }
}), "weatherSubmit")
