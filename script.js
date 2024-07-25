function initMap() {
  // Create a map centered on a default location
  const map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 20.5937, lng: 78.9629 },
      zoom: 4
  });

  // Create a search box and link it to the UI element
  const input = document.getElementById('pac-input');
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the search box results towards the current map's viewport
  map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve more details for that place
  searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();

      if (places.length === 0) {
          return;
      }

      // Clear out the old markers
      markers.forEach(marker => marker.setMap(null));
      markers = [];

      // For each place, get the icon, name, and location
      const bounds = new google.maps.LatLngBounds();
      places.forEach(place => {
          if (!place.geometry || !place.geometry.location) {
              console.log("Returned place contains no geometry");
              return;
          }

          const marker = new google.maps.Marker({
              map,
              title: place.name,
              position: place.geometry.location
          });
          markers.push(marker);

          if (place.geometry.viewport) {
              // Only geocodes have viewport
              bounds.union(place.geometry.viewport);
          } else {
              bounds.extend(place.geometry.location);
          }
      });
      map.fitBounds(bounds);
  });

  // Add a button to get the user's current location
  const locationButton = document.createElement('button');
  locationButton.textContent = 'Current Location';
  locationButton.classList.add('custom-map-control-button');
//   map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(locationButton);

  locationButton.addEventListener('click', () => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
              const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
              };

              map.setCenter(pos);

              const marker = new google.maps.Marker({
                  position: pos,
                  map: map,
                  title: 'You are here',
              });
          }, () => {
              handleLocationError(true, map.getCenter());
          });
      } else {
          handleLocationError(false, map.getCenter());
      }
  });

   // Add a button to toggle satellite view
   const satelliteButton = document.createElement('button');
   satelliteButton.textContent = 'Satellite View';
   satelliteButton.classList.add('custom-map-control-button');
   map.controls[google.maps.ControlPosition.TOP_RIGHT].push(satelliteButton);

   satelliteButton.addEventListener('click', () => {
       const currentTypeId = map.getMapTypeId();
       map.setMapTypeId(currentTypeId === 'roadmap' ? 'satellite' : 'roadmap');
       satelliteButton.textContent = currentTypeId === 'roadmap' ? 'Roadmap View' : 'Satellite View';
   });

}

function handleLocationError(browserHasGeolocation, pos) {
  const infoWindow = new google.maps.InfoWindow({
      position: pos
  });
  infoWindow.setContent(browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : 'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

// Initialize the map when the window loads
window.onload = initMap;



// Review Code
document.getElementById('reviewButton').addEventListener('click', function() {
    document.getElementById('reviewSection').classList.remove('hidden');
});

const stars = document.querySelectorAll('.star');
let selectedRating = 0;

stars.forEach((star, index) => {
    star.addEventListener('click', function() {
        selectedRating = index + 1;
        document.getElementById('rating').textContent = selectedRating;

        // Highlight the selected stars
        stars.forEach((s, i) => {
            if (i < selectedRating) {
                s.classList.add('selected');
            } else {
                s.classList.remove('selected');
            }
        });
    });

    star.addEventListener('mouseover', function() {
        let hoverRating = index + 1;
        stars.forEach((s, i) => {
            if (i < hoverRating) {
                s.classList.add('hover');
            } else {
                s.classList.remove('hover');
            }
        });
    });

    star.addEventListener('mouseleave', function() {
        stars.forEach(s => s.classList.remove('hover'));
    });
});

document.getElementById('submitRating').addEventListener('click', function() {
    if (selectedRating > 0) {
        alert(`Thank you for your rating of ${selectedRating} stars!`);
        // Here you can add code to send the rating to the server or process it further
    } else {
        alert('Please select a rating before submitting.');
    }
});
