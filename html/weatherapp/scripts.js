const cityHeader = document.getElementById('cityHeader')
const cityInput = document.getElementById('cityInput')
const citySubmit = document.getElementById('citySubmit')
const hourForecastContainer = document.getElementById('hourForecastContainer')
const weekForecastContainer = document.getElementById('weekForecastContainer')


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


async function updatePage (cityName) {
    const weather = await fetchWeather(cityName)
    const forecast = await fetchForecast(cityName)

    const forecastExists = 'list' in forecast
    if (!forecastExists) {
        alert(`No data for ${cityName}`)
        return
    }
    
    cityHeader.textContent = weather.name
    
    const forecastsSorted = forecast.list.reduce((currState, currForecast) => {
        const forecastDate = moment(currForecast.dt_txt).format("DDMMYYYY")
        if (forecastDate != currState.date) {
            currState.currList = []
            currState.date = forecastDate
            currState.allLists.push(currState.currList)
        }
        currState.currList.push(currForecast)
        return currState
    }, {allLists: [], currList: null, date: null}).allLists

    const hourWeathers = forecast.list.slice(0, 4).map((forecast) => new Weather(forecast))
    const hourShadowBox = document.createElement("div")
    hourShadowBox.classList.add("hourForecastShadow", "shadow")
    for (let hourIdx = 0; hourIdx < hourWeathers.length; hourIdx += 1) {
        hourShadowBox.appendChild(createHourForecastBox(hourWeathers[hourIdx]))
    }
    hourForecastContainer.innerHTML = ""
    hourForecastContainer.appendChild(hourShadowBox)

    const weekWeathers = forecastsSorted.slice(0, 5).map((forecastList) => {
        return forecastList.map((forecast) => {
            return new Weather(forecast)
        })
    })
    weekForecastContainer.innerHTML = ""
    for (let dayIdx = 0; dayIdx < weekWeathers.length; dayIdx += 1) {
        weekForecastContainer.appendChild(createWeekForecastBox(weekWeathers[dayIdx]))
    }
}
updatePage = alertOnErrCallback(updatePage, "updatePage")

citySubmit.addEventListener("click", alertOnErrCallback(() => {
    updatePage(cityInput.value)
    cityInput.value = ""
}, "citySubmit"))

// initial page
updatePage("provo")


class Weather {
    constructor(weatherJson) {
        this.json = weatherJson
    }

    get cityTemp() {
        return this.json.main.temp
    }

    get cityTempFormatted() { 
        return `${this.cityTemp} °F`
    }

    get dateSmall() {
        return moment(this.json.dt_txt).format("dddd, MMM Do")
    }

    get dateTime() {
        return moment(this.json.dt_txt).format("ha")
    }

    get weather() {
        // weather[0] -- we only care about the first (default) result
        return this.json.weather[0]
    }

    get iconSrc() {
        return `http://openweathermap.org/img/w/${this.weather.icon}.png`
    }

    get weatherType() {
        return this.weather.main
    }
    
    get weatherDesc() {
        return this.weather.description
    }

    static cityTempMinMax(weathers) {
        let minTemp = null
        let maxTemp = null
        for (const weather of weathers) {
            const temp = weather.cityTemp
            const isFirst = minTemp === null
            if (isFirst) {
                minTemp = temp
                maxTemp = temp
            } else if (temp > maxTemp) {
                maxTemp = temp
            } else if (temp < minTemp) {
                minTemp = temp
            }
        }
        return `${minTemp} -- ${maxTemp}`
    }

    static averageWeather(weathers) {
        const typeCounts = {}
        for (const weather of weathers) {
            const type = weather.weatherType
            const typeIncluded = type in typeCounts
            if (!typeIncluded) {
                typeCounts[type] = 1
            } else {
                typeCounts[type] += 1
            }
        }
        
        let maxType = null
        for (const type in typeCounts) {
            const count = typeCounts[type]
            if (maxType === null || count > maxType.count) {
                maxType = {type, count}
            }
        }

        for (const weather of weathers) {
            if (weather.weatherType === maxType.type) {
                return weather
            }
        }
    }
}


function createHourForecastBox(hourWeather) {
    const time = document.createElement("h3")
    time.classList.add("time")
    time.textContent = hourWeather.dateTime

    const icon = document.createElement("img")
    icon.classList.add("icon")
    icon.src = hourWeather.iconSrc

    const weatherDesc = document.createElement("p")
    weatherDesc.classList.add("weatherDesc")
    weatherDesc.textContent = hourWeather.weatherDesc

    const temp = document.createElement("h2")
    temp.classList.add("temp")
    temp.textContent = hourWeather.cityTempFormatted

    const hourBox = document.createElement("div")
    hourBox.classList.add("hourForecastBox")
    hourBox.appendChild(time)
    hourBox.appendChild(icon)
    hourBox.appendChild(weatherDesc)
    hourBox.appendChild(temp)
    return hourBox
}


function createWeekForecastBox(weekWeathers) {
    const avgWeather = Weather.averageWeather(weekWeathers)

    const date = document.createElement("h3")
    date.classList.add("date")
    date.textContent = avgWeather.dateSmall
    
    const weatherDesc = document.createElement("p")
    weatherDesc.classList.add("weatherDesc")
    weatherDesc.textContent = avgWeather.weatherDesc
    
    const icon = document.createElement("img")
    icon.classList.add("icon")
    icon.src = avgWeather.iconSrc
    
    const tempMinMax = document.createElement("h2")
    tempMinMax.classList.add("tempMinMax")
    tempMinMax.textContent = Weather.cityTempMinMax(weekWeathers)

    const weekForecast = document.createElement("div")
    weekForecast.classList.add("weekForecastBox", "shadow")
    weekForecast.appendChild(date)
    weekForecast.appendChild(weatherDesc)
    weekForecast.appendChild(icon)
    weekForecast.appendChild(tempMinMax)
    return weekForecast
}
