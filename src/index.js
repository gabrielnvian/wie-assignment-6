const isLargeDesktop = window.innerWidth >= 992;

$.ajax('https://tourism.api.opendatahub.bz.it/v1/Weather?language=de&extended=true')
    .done(processResponse)
    .fail(function () {
      alert("An error occurred!");
    });

function processResponse(data) {
  const c1 = $('#c1')[0];

  const todayData = data.Conditions[0];
  const tomorrowData = data.Conditions[1];

  c1.innerHTML = `
    <div>${getDayInfo(todayData)}</div>
    <br/>
    <div>${getDayInfo(tomorrowData)}</div>
  `;
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
