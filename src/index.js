const isLargeDesktop = window.innerWidth >= 992;

let c1, c2, selectStation, data;

function sendRequest() {
  $.ajax('https://tourism.api.opendatahub.bz.it/v1/Weather?language=de&extended=true')
      .done((newData) => {
        data = newData;
        processResponse();
      })
      .fail(function () {
        const alertMsg = `<div class="alert alert-danger" role="alert">
          An error occurred: can't reach weather services!
        </div>`

        c1.innerHTML = alertMsg;
        c2.innerHTML = alertMsg;
        selectStation.disabled = true;
      });
}

function processResponse() {
  const todayData = data.Conditions[0];
  const tomorrowData = data.Conditions[1];

  c1.innerHTML = `
    <div>${getDayInfo(todayData)}</div>
    <br/>
    <div>${getDayInfo(tomorrowData)}</div>
  `;

  selectStation.innerHTML = getSelectStation();
}

function getDayInfo(data) {
  if (isLargeDesktop) {
    return `
        <div class="row">
            <div class="col">
                <img src="${data.WeatherImgurl}" alt="weather"/>
            </div>
        
            <div class="col">
                <h5>${data.date.split('T')[0]}: ${data.Title}</h5>
                <p>${data.WeatherCondition}</p>
                <p>${data.Weatherdesc}</p>
                <p>${data.Temperatures}</p>
            </div>
        </div>
  `;
  }

  return `
    <h5>${data.date.split('T')[0]}: ${data.Title}</h5>
    <p>${data.WeatherCondition}</p>
    <p>${data.Weatherdesc}</p>
    <p>${data.Temperatures}</p>
  `;
}

function getSelectStation() {
  const stations = data.Stationdata.map(t => t.CityName).slice(0, 6); // The rest are duplicates

  return `<option value="-"> - </option>` +
      stations.map(station => `<option value="${station}">${station}</option>`);
}

document.addEventListener('DOMContentLoaded', () => {
  c1 = $('#c1')[0];
  c2 = $('#c2')[0];
  selectStation = $('#select-station')[0];

  sendRequest();

  selectStation.addEventListener('change', (e) => {
    if (e.target.value === '') return;

    updateStationData(e.target.value);
  });
})

function updateStationData(station) {
  const stationDataToday = data.Stationdata.filter(t => t.CityName === station)[0];
  const stationDataTomorrow = data.Stationdata.filter(t => t.CityName === station)[1];

  c2.innerHTML = `
    ${getStationDayInfo(stationDataToday)}
    ${getStationDayInfo(stationDataTomorrow)}
  `;
}

function getStationDayInfo(stationData) {
  return `
    <h5>${stationData.date.split('T')[0]}</h5>
    <img src="${stationData.WeatherImgUrl}" alt="weather"/>
    <p>${stationData.WeatherDesc}</p>
  `;
}
