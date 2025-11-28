// Class: SWE2511 - Weather Forecaster
// Name: Kalkidan Vassar
// Class Section: 131

let map;
let markerLayer;
let centerRect;

/**
 * displayError - Displays an error message
 * @param message - the message to display
 */
const displayError = (message) => {
    const errorMessage = document.getElementById("errorDisplay");
    errorMessage.innerText = `Error: ${message}`;
    errorMessage.classList.remove("visually-hidden");

    // Clear visual data when an error occurs
    clearMapLayers();
    clearForecastAndConditions();
};

/**
 * clearError - clears displaying of an error message
 */
const clearError = () => {
    const errorMessage = document.getElementById("errorDisplay");
    errorMessage.classList.add("visually-hidden");
    errorMessage.innerText = "";
};

/**
 * clearMapLayers - removes all layers from the map
 */
function clearMapLayers() {
    if (markerLayer) {
        map.removeLayer(markerLayer);
        markerLayer = null;
    }
    if (centerRect) {
        map.removeLayer(centerRect);
        centerRect = null;
    }
}

/**
 * clearForecastAndConditions - clears the weather display areas
 */
function clearForecastAndConditions() {
    // Current conditions
    document.getElementById('forecast-title').innerText = '';
    document.getElementById('current-location').textContent = '';
    document.getElementById('current-desc').textContent = '';
    document.getElementById('current-temp').textContent = '';
    document.getElementById('current-tempC').textContent = '';
    document.getElementById('current-humidity').textContent = '';
    document.getElementById('current-wind').textContent = '';
    document.getElementById('current-icon').src = '';

    // Forecast cards
    const container = document.getElementById('forecast-scroll');
    container.innerHTML = '';
}

/**
 * getWeatherData - Gets the current observation for a given point
 */
async function getWeatherData(startPoint) {
    clearError();
    try {
        const res1 = await fetch(`https://api.weather.gov/points/${startPoint}`);
        if (!res1.ok) throw new Error(`Unable to get point data (${res1.status})`);
        const data1 = await res1.json();

        const res2 = await fetch(data1.properties.observationStations);
        if (!res2.ok) throw new Error(`Unable to get stations (${res2.status})`);
        const data2 = await res2.json();

        const stationId = data2.features?.[0]?.properties?.stationIdentifier;
        if (!stationId) throw new Error("No observation stations found nearby.");

        const res3 = await fetch(`https://api.weather.gov/stations/${stationId}/observations/latest`);
        if (!res3.ok) throw new Error(`Unable to get observations (${res3.status})`);
        const currentConditions = await res3.json();

        updateCurrentConditions(currentConditions);
    } catch (error) {
        displayError(error.message);
    }
}

/**
 * updateStations - Gets all observation stations and adds markers
 */
async function updateStations(startPoint) {
    clearError();
    try {
        const res1 = await fetch(`https://api.weather.gov/points/${startPoint[0]},${startPoint[1]}`);
        if (!res1.ok) throw new Error(`Unable to get point data (${res1.status})`);
        const data1 = await res1.json();

        const res2 = await fetch(data1.properties.observationStations);
        if (!res2.ok) throw new Error(`Unable to get stations (${res2.status})`);
        const data2 = await res2.json();

        addMarkers(data2);
    } catch (error) {
        displayError(error.message);
    }
}

/**
 * addMarkers - Adds weather station markers to the map
 */
async function addMarkers(data2) {
    if (markerLayer) {
        map.removeLayer(markerLayer);
    }

    const customIcon = L.icon({
        iconUrl: 'https://static.vecteezy.com/system/resources/previews/022/270/017/large_2x/weather-station-3d-render-isolated-png.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });

    markerLayer = L.layerGroup().addTo(map);

    const allStations = data2.features;
    if (!allStations || allStations.length === 0) {
        throw new Error("No stations available to display.");
    }

    for (let data of allStations) {
        const marker = L.marker([data.geometry.coordinates[1], data.geometry.coordinates[0]], { icon: customIcon })
            .bindPopup(`Station: ${data.properties.stationIdentifier}`);
        markerLayer.addLayer(marker);
    }
}

/**
 * getWeatherForecastData - Gets the forecast data for a given point
 */
async function getWeatherForecastData(startPoint) {
    clearError();
    try {
        const res1 = await fetch(`https://api.weather.gov/points/${startPoint}`);
        if (!res1.ok) throw new Error(`Unable to get point data (${res1.status})`);
        const data1 = await res1.json();

        const res2 = await fetch(data1.properties.forecast);
        if (!res2.ok) throw new Error(`Unable to get forecast (${res2.status})`);
        const forecast = await res2.json();

        renderForecast(forecast.properties.periods);
    } catch (error) {
        displayError(error.message);
    }
}

/**
 * createForecastCard - builds forecast display cards
 */
function createForecastCard(day, temp, desc, iconUrl) {
    const card = document.createElement('div');
    card.className = 'forecast-card';

    const img = document.createElement('img');
    img.src = iconUrl;
    img.alt = 'Weather Icon';
    card.appendChild(img);

    const title = document.createElement('h6');
    title.className = 'fw-bold mt-2';
    title.textContent = day;
    card.appendChild(title);

    const tempP = document.createElement('p');
    tempP.className = 'mb-0';
    tempP.textContent = `${temp ?? '--'}°F`;
    card.appendChild(tempP);

    const descP = document.createElement('p');
    descP.className = 'small';
    descP.textContent = desc ?? '--';
    card.appendChild(descP);

    return card;
}

/**
 * updateCurrentConditions - updates current conditions display
 */
function updateCurrentConditions(data) {
    document.getElementById('forecast-title').innerText = data.properties.stationName ?? '';
    document.getElementById('current-location').textContent = data.properties.stationName ?? '';
    document.getElementById('current-desc').textContent = data.properties.textDescription ?? '';
    document.getElementById('current-temp').textContent =
        data.properties.temperature.value != null ? `${Math.floor((data.properties.temperature.value) * (9 / 5) + 32)}°F` : '--';
    document.getElementById('current-tempC').textContent =
        data.properties.temperature.value != null ? `${data.properties.temperature.value}°C` : '--';
    document.getElementById('current-humidity').textContent =
        data.properties.relativeHumidity.value != null ? `Humidity: ${Math.floor(data.properties.relativeHumidity.value)}%` : '--';
    document.getElementById('current-wind').textContent =
        data.properties.windSpeed.value != null ? `Wind: ${data.properties.windSpeed.value} kph` : '--';
    document.getElementById('current-icon').src = data.properties.icon ?? '';
}

/**
 * renderForecast - builds forecast card list
 */
function renderForecast(forecasts) {
    const container = document.getElementById('forecast-scroll');
    container.innerHTML = '';
    forecasts.forEach(f => {
        const card = createForecastCard(f.name, f.temperature, f.detailedForecast, f.icon);
        container.appendChild(card);
    });
}

/**
 * window.onload - initializes the weather forecaster when the window loads
 */
window.onload = () => {
    const startPoint = [43.044240, -87.906446]; // MSOE field
    map = L.map('map').setView(startPoint, 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let debounceTimer;
    function debounceUpdate() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updateCenterCoords, 600);
    }

    map.on('move', debounceUpdate);
    map.on('zoom', debounceUpdate);

    function updateCenterCoords() {
        const getCenter = map.getCenter();
        const center = [getCenter.lat, getCenter.lng];

        // remove old rectangle
        if (centerRect) map.removeLayer(centerRect);

        const bounds = [
            [center[0] - 0.002, center[1] - 0.002],
            [center[0] + 0.002, center[1] + 0.002]
        ];
        centerRect = L.rectangle(bounds, {
            color: "#3388ff",
            weight: 2,
            fillOpacity: 0.2
        }).addTo(map);

        updateStations(center);
        getWeatherData(center);
        getWeatherForecastData(center);
    }

    updateCenterCoords();
};
