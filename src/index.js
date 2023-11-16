import { Feature, Map, View } from 'ol/index.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { useGeographic } from 'ol/proj.js';
import { Point } from 'ol/geom';
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
    locations.push(new Location(name, feature, x, y));
}

const deletePoint = (x, y) => {
    const locationIndex = locations.findIndex(l => l.x == x && l.y == y);
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
});



