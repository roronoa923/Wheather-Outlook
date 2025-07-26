const cityInput = document.querySelector(".city-input")
const searchBtn = document.querySelector(".search-btn")
const notfoundsection =document.querySelector('.not-found')
const searchcitysection = document.querySelector('.search-city')
const weatherinfosection = document.querySelector('.weather-info')
const countrytxt = document .querySelector('.country-txt')
const temptxt = document.querySelector('.temp-txt')
const conditiontxt = document.querySelector('.condition-txt')
const humidityvaluetxt = document.querySelector('.humidity-value-txt')
const windvaluetxt = document.querySelector('.wind-value-txt')
const weathersummaryimage = document.querySelector('.weather-summary-img')
const currentdatetxt = document.querySelector('.current-date-txt')
const forecastItemsContainer = document.querySelector(".forecast-items-container")
const ApiKey ='dde17946bff5eea2b95ab917a95554d9'

searchBtn.addEventListener('click', () =>{
    if(cityInput.value.trim()!=''){
    updateWeatherInfo(cityInput.value)
    cityInput.value = ''
    cityInput.blur()
}
})

cityInput.addEventListener('keydown', (event) =>{ 
    if(event.key == 'Enter' &&
        cityInput.value.trim()!=''
    ){
    updateWeatherInfo(cityInput.value)
    cityInput.value = ''
    cityInput.blur()
    }
})
function getWeatherIcon(id){
    if (id<=231) return 'thunderstorm.svg'
    if (id<=321) return 'drizzle.svg'
    if (id<=531) return 'rain.svg'
    if (id<=622) return 'snow.svg'
    if (id<=781) return 'atmosphere.svg'
    if (id<=800) return 'clear.svg'
    else return 'clouds.svg'
}

 async function getFetchData(endPoint, city) {
 const apiurl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${ApiKey}&units=metric`
 const response = await fetch(apiurl)
 return response.json()
}
function getCurrentDate() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Months are 0-based
    const year = today.getFullYear();
    return `${day}/${month}/${year}`; // Example: "29/03/2025"
}
async function updateWeatherInfo(city) {
    const wheatherData = await getFetchData('weather', city);
    if (wheatherData.cod != 200) {
        showDisplaySection(notfoundsection);
        return;
    }

    console.log(wheatherData);
    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = wheatherData;

    countrytxt.textContent = country;
    temptxt.textContent = Math.round(temp) + ' °C';
    conditiontxt.textContent = main;
    humidityvaluetxt.textContent = humidity + '%';
    windvaluetxt.textContent = speed + 'M/s';
    weathersummaryimage.src = `weather/${getWeatherIcon(id)}`;

    // 🔹 Set the current date in the UI
    currentdatetxt.textContent = getCurrentDate();

    await updateForecastsInfo(city)

    showDisplaySection(weatherinfosection);
}


async function updateForecastsInfo(city) {
  const forecastsData = await getFetchData("forecast", city);

  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastItemsContainer.innerHTML = "";

  forecastsData.list.forEach(forecastWeather => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastItems(forecastWeather);
    }
  });
}

function updateForecastItems(weatherData) {
  console.log(weatherData);

  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date(date);
  const dateOption = { day: "2-digit", month: "short" };
  const dateResult = dateTaken.toLocaleDateString("en-US", dateOption);

  const forecastItem = `
    <div class="forecast-item">
      <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
      <img src="weather/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
      <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
    </div>`;

  forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
}



function showDisplaySection(section) {
    [weatherinfosection, searchcitysection, notfoundsection].forEach(sec => {
        sec.style.display = 'none';  
    });
    section.style.display = 'flex';  
}



