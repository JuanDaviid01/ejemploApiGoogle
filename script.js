let map, streetViewPanorama, directionsService, directionsRenderer;
let modoOscuro = false;
const estiloOscuro = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }]
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
    }
];
const estiloClaro = [];
function iniciarMap() {
    const tiendaCoord = { lat: 5.062564, lng: -75.494950 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: tiendaCoord
    });
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    new google.maps.Marker({
        position: tiendaCoord,
        map: map,
        title: "Mi Tienda Local"
    });
    streetViewPanorama = new google.maps.StreetViewPanorama(document.getElementById('map'), {
        position: tiendaCoord,
        pov: { heading: 165, pitch: 0 },
        visible: false
    });
    map.setStreetView(streetViewPanorama);
}

function alternarModo() {
    if (!map) {
        console.error("El mapa aún no se ha cargado");
        return;
    }

    modoOscuro = !modoOscuro; // Alterna entre true y false
    map.setOptions({
        styles: modoOscuro ? estiloOscuro : estiloClaro,
    });

    console.log(`Modo cambiado a ${modoOscuro ? "oscuro" : "claro"}`);
}

function alternarStreetView() {
    const isStreetViewVisible = streetViewPanorama.getVisible();
    streetViewPanorama.setVisible(!isStreetViewVisible);
}

function calcularRuta() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(posicion => {
            const ubicacionUsuario = {
                lat: posicion.coords.latitude,
                lng: posicion.coords.longitude
            };
            directionsService.route({
                origin: ubicacionUsuario,
                destination: { lat: 5.062564, lng: -75.494950 },
                travelMode: 'DRIVING'
            }, (result, status) => {
                if (status === 'OK') {
                    directionsRenderer.setDirections(result);
                } else {
                    alert('No se pudo calcular la ruta: ' + status);
                }
            });
        }, () => {
            alert("No se pudo obtener tu ubicación.");
        });
    } else {
        alert("La geolocalización no es compatible con tu navegador.");
    }
}

function cancelarRuta() {
    directionsRenderer.setDirections({ routes: [] }); // Borra la ruta del mapa
}