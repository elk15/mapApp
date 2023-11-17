import { Feature, Map, View } from 'ol/index.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { useGeographic } from 'ol/proj.js';
import { Point } from 'ol/geom';
import { v4 as uuidv4 } from 'uuid';
import Location from './Location';

useGeographic();

const locations = [];

const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
    ],
    view: new View({
        center: [0, 0],
        zoom: 2,
    }),
});

const vectorSource = new VectorSource();
const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: {
        'circle-radius': 5,
        'circle-fill-color': 'red',
    },
});
map.addLayer(vectorLayer);

const addPoint = (name, x, y) => {
    const point = new Point([x, y]);
    const feature = new Feature(point);
    vectorSource.addFeature(feature);

    const id = uuidv4();

    locations.push(new Location(id, name, feature, x, y));
}

const deletePoint = (id) => {
    const locationIndex = locations.findIndex(l => l.id === id);
    if (locationIndex === -1) return;
    const deletedLocation = locations.splice(locationIndex, 1);
    const deletedFeature = deletedLocation[0].feature;
    vectorSource.removeFeature(deletedFeature);
}

const openModal = () => {
    $("#modal").show();
    $("#overlay").show();
}

const closeModal = () => {
    $("#modal").hide();
    $("#overlay").hide();

    //reset fields
    $("#name").val("");
    $("#longitude").val("");
    $("#latitude").val("");
}

const displayLocations = () => {
    $("#locations").empty();

    locations.forEach(l => {
        const li = $('li')
        $("#locations").append(`
            <li>
                <button><i class="fa-solid fa-bars"></i></button>
                <button><i class="fa-solid fa-map-location-dot"></i></button>
                <button class="edit-location" data-id="${l.id}">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button class="delete-location" data-id="${l.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>

                <h3>${l.name}</h3>
                Long: ${l.x.toFixed(2)} 
                Lat: ${l.y.toFixed(2)}
            </li>
        `);
    })

    // Append event listeners

    // delete location
    $('.delete-location').on('click', (e) => {
        const id = e.target.getAttribute("data-id");
        deletePoint(id);
        displayLocations();
    })
}

jQuery(function () {
    // open the add new location modal
    $("#open-modal").on('click', () => {
        openModal();
    });

    $("#close-modal").on('click', () => {
        closeModal();
    });

    // add coordinates by clicking on the map
    map.on('click', (e) => {
        const [x, y] = e.coordinate;
        openModal();
        $("#longitude").val(x);
        $("#latitude").val(y);
    });

    // add a new location
    $('form').on('submit', (e) => {
        e.preventDefault();
        const name = $("#name").val();
        const longtitude = parseFloat($("#longitude").val());
        const latitude = parseFloat($("#latitude").val());

        addPoint(name, longtitude, latitude);

        closeModal();

        displayLocations();
    })
});



