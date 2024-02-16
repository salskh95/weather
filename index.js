"use strict";

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
  map.addListener("click", function (e) {
    const clickedLocation = e.latLng;

    getWeatherData(clickedLocation);
  });
}

function searchLocation() {
  const location = document.getElementById("locationInput").value;

  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: location }, function (results, status) {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
      map.setZoom(10);
    } else {
      alert("Geocoder was not successful for the following reason: " + status);
    }
  });
}

function getWeatherData(location) {
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ location: location }, function (results, status) {
    if (status === "OK") {
      if (results[0]) {
        const locationName = results[0].formatted_address;

        fetch(
          `https://api.weatherapi.com/v1/current.json?key=f66bdb983eea4cd1bc983343241602&q=${location.lat()},${location.lng()}`
        )
          .then((res) => res.json())
          .then((data) => {
            const weatherDescription = data.current.condition.text;
            const temperature = data.current.temp_c;

            const contentString = `
            <div>
            <h2>Weather</h2>
            <p><strong>Location:</strong> ${locationName}</p>
            <p><strong>Coordinates:</strong> ${results[0].geometry.location.lat()}, ${results[0].geometry.location.lng()}</p>
            <p><strong>Description:</strong> ${weatherDescription}</p>
            <p><strong>Temperature:</strong> ${temperature}°C</p>
            </div>
            `;

            const infoWindow = new google.maps.InfoWindow({
              content: contentString,
              position: location,
            });
            infoWindow.open(map);
          })
          .catch((error) => console.log("Error fetching weather data:", error));
      } else {
        alert("No results found for the clicked location");
      }
    } else {
      alert("Geocoder was not successful for the following reason: " + status);
    }
  });
}

document
  .getElementById("searchButton")
  .addEventListener("click", searchLocation);

document
  .getElementById("locationInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      searchLocation();
    }
  });
