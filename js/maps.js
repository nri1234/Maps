'use strict';
let markerFlag = true;
(function () {

	let locationArray = mySlides;

	window.initMap = function () {
		let markers = [];

		let myMap = new google.maps.Map(document.getElementById('mapid'), {

			zoom: 4,
			center: latLngFromArr(locationArray, flkty.selectedIndex)
		});

		function latLngFromArr(array, i) {
			let latitude = parseFloat(array[i].lat);
			let longitude = parseFloat(array[i].lng);
			return { lat: latitude, lng: longitude };
		}

		for (let i = 0; i < locationArray.length; i++) {
			markers[i] = new google.maps.Marker({
				position: latLngFromArr(locationArray, i),
				title: locationArray[i].title,
				map: myMap
			});
			markers[i].addListener('click', function () {
				markerFlag = false;
				flkty.selectCell(i);
				markerFlag = true;

			});
		}

		flkty.on('change', function (index) {
			if (markerFlag === true) {
				myMap.panTo(latLngFromArr(mySlides, index));
			}
		});





			document.getElementById('center-map').addEventListener('click', function (event) {
			event.preventDefault();
			myMap.panTo(latLngFromArr(locationArray, flkty.selectedIndex));
			myMap.setZoom(10);
		});

		document.getElementById('center-smooth').addEventListener('click', function (event) {
			event.preventDefault();
			smoothPanAndZoom(myMap, 7, latLngFromArr(locationArray, flkty.selectedIndex));
		});
	}

	let smoothPanAndZoom = function (map, zoom, coords) {
		let jumpZoom = zoom - Math.abs(map.getZoom() - zoom);
		jumpZoom = Math.min(jumpZoom, zoom - 1);
		jumpZoom = Math.max(jumpZoom, 3);

		// Zaczynamy od oddalenia mapy do wyliczonego powiększenia. 
		smoothZoom(map, jumpZoom, function () {
			// Następnie przesuwamy mapę do żądanych współrzędnych.
			smoothPan(map, coords, function () {
				// Na końcu powiększamy mapę do żądanego powiększenia. 
				smoothZoom(map, zoom);
			});
		});
	};

	let smoothZoom = function (map, zoom, callback) {
		let startingZoom = map.getZoom();
		let steps = Math.abs(startingZoom - zoom);

		// Jeśli steps == 0, czyli startingZoom == zoom
		if (!steps) {
			// Jeśli podano trzeci argument
			if (callback) {
				// Wywołaj funkcję podaną jako trzeci argument.
				callback();
			}
			// Zakończ działanie funkcji
			return;
		}

		// Trochę matematyki, dzięki której otrzymamy -1 lub 1, w zależności od tego czy startingZoom jest mniejszy od zoom
		let stepChange = - (startingZoom - zoom) / steps;

		let i = 0;
		// Wywołujemy setInterval, który będzie wykonywał funkcję co X milisekund (X podany jako drugi argument, w naszym przypadku 80)
		let timer = window.setInterval(function () {
			// Jeśli wykonano odpowiednią liczbę kroków
			if (++i >= steps) {
				// Wyczyść timer, czyli przestań wykonywać funkcję podaną w powyższm setInterval
				window.clearInterval(timer);
				// Jeśli podano trzeci argument
				// Jeśli trzeci argument to funkcja...

				if (callback) {
					// Wykonaj funkcję podaną jako trzeci argument
					callback();
				}
			}
			// Skorzystaj z metody setZoom obiektu map, aby zmienić powiększenie na zaokrąglony wynik poniższego obliczenia
			map.setZoom(Math.round(startingZoom + stepChange * i));
		}, 80);
	};

	// Poniższa funkcja działa bardzo podobnie do smoothZoom. Spróbuj samodzielnie ją przeanalizować. 
	let smoothPan = function (map, coords, callback) {
		let mapCenter = map.getCenter();
		coords = new google.maps.LatLng(coords);

		let steps = 12;
		let panStep = { lat: (coords.lat() - mapCenter.lat()) / steps, lng: (coords.lng() - mapCenter.lng()) / steps };

		let i = 0;
		let timer = window.setInterval(function () {
			if (++i >= steps) {
				window.clearInterval(timer);
				if (callback) callback();
			}
			map.panTo({ lat: mapCenter.lat() + panStep.lat * i, lng: mapCenter.lng() + panStep.lng * i });
		}, 1000 / 30);
	};


})();


