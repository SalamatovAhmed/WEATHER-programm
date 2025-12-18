const API_KEY = "285b31f1226172b245204b66404989b2";

const elements = {
    cityInput: document.getElementById('cityInput'),
    searchBtn: document.getElementById('searchBtn'),
    location: document.getElementById('location'),
    temp: document.getElementById('temp'),
    weatherDesc: document.getElementById('weatherDesc'),
    time: document.getElementById('time'),
    mainIcon: document.getElementById('mainIcon'),
    wind: document.getElementById('wind'),
    humidityChance: document.getElementById('humidity-chance'),
    pressure: document.getElementById('pressure'),
    humidityVal: document.getElementById('humidity-val'),
    forecast: document.getElementById('forecast')
};

async function fetchWeather(city) {
    if (!city) return;
    const urlCur = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=en`;
    const urlFor = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=en`;

    try {
        const [cur, forData] = await Promise.all([
            fetch(urlCur).then(r => r.json()),
            fetch(urlFor).then(r => r.json())
        ]);

        if (cur.cod === 200) render(cur, forData);
    } catch (err) {
        console.error("Error fetching weather:", err);
    }
}

function render(cur, forData) {
    elements.location.textContent = cur.name;
    elements.temp.textContent = Math.round(cur.main.temp);
    elements.weatherDesc.textContent = cur.weather[0].description;
    elements.mainIcon.src = `https://openweathermap.org/img/wn/${cur.weather[0].icon}@2x.png`;

    const now = new Date();
    elements.time.textContent = now.toLocaleDateString('en-US', { weekday: 'long' }) + ' | ' + 
                               now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    elements.wind.textContent = `${cur.wind.speed} km/h`;
    elements.humidityChance.textContent = `${cur.main.humidity}%`;
    elements.pressure.textContent = `${cur.main.pressure} mbar`;
    elements.humidityVal.textContent = `${cur.main.humidity}%`;

    // Отрисовка почасового прогноза (нижние иконки)
    elements.forecast.innerHTML = "";
    const hourly = forData.list.slice(0, 5);

    hourly.forEach((item, index) => {
        const date = new Date(item.dt * 1000);
        const hours = index === 0 ? "Now" : date.getHours() + ":00";
        const icon = item.weather[0].icon;

        elements.forecast.innerHTML += `
            <div class="forecast-item">
                <p>${hours}</p>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon">
                <p><strong>${Math.round(item.main.temp)}°</strong></p>
                <p class="rain-prob">${item.main.humidity}%</p>
            </div>
        `;
    });
}

elements.searchBtn.addEventListener("click", () => fetchWeather(elements.cityInput.value.trim()));
elements.cityInput.addEventListener("keypress", (e) => { if(e.key === "Enter") fetchWeather(elements.cityInput.value.trim()); });

fetchWeather("Malang");