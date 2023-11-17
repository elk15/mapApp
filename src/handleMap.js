import { Feature, Map, View } from 'ol/index.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { useGeographic } from 'ol/proj.js';
import { LineString, Point } from 'ol/geom';
import { v4 as uuidv4 } from 'uuid';
import Location from './Location';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import { selectedLocations } from './handleUI';

useGeographic();

export let locations = [];

export const map = new Map({
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

// Layer for routes
const vectorSourceRoutes = new VectorSource();
const vectorLayerRoutes = new VectorLayer({
    source: vectorSourceRoutes,
    style: new Style({
        stroke: new Stroke({
            color: "blue",
            width: 2,
        })
    })
});
map.addLayer(vectorLayerRoutes);

export const drawRouteLine = () => {
    vectorSourceRoutes.clear();

    const routePoints = [];
    locations.forEach(l => {
        if (selectedLocations.includes(l.id)) {
            const newPoint = new Point([l.x, l.y]);
            routePoints.push(newPoint.getCoordinates());
        }
    })

    const line = new LineString(routePoints);
    const lineFeature = new Feature(line);
    vectorSourceRoutes.addFeature(lineFeature);
}

// Layer for points
const vectorSourcePoints = new VectorSource();
const vectorLayerPoints = new VectorLayer({
    source: vectorSourcePoints,
    style: {
        'circle-radius': 5,
        'circle-fill-color': 'red',
    },
});
map.addLayer(vectorLayerPoints);

export const addPoint = (name, x, y) => {
    const point = new Point([x, y]);
    const feature = new Feature(point);
    vectorSourcePoints.addFeature(feature);

    const id = uuidv4();

    locations.push(new Location(id, name, feature, x, y));
}

export const updatePoint = (id, name, longtitude, latitude) => {
    locations.map(l => {
        if (l.id === id) {
            l.name = name;
            l.x = longtitude;
            l.y = latitude;

            vectorSourcePoints.removeFeature(l.feature);

            const point = new Point([longtitude, latitude]);
            const feature = new Feature(point);
            vectorSourcePoints.addFeature(feature);

            l.feature = feature;

            return l;
        }
        return l;
    })
    vectorSourceRoutes.clear();
}

export const deletePoint = (id) => {
    const locationIndex = locations.findIndex(l => l.id === id);
    if (locationIndex === -1) return;
    const deletedLocation = locations.splice(locationIndex, 1);
    const deletedFeature = deletedLocation[0].feature;
    vectorSourcePoints.removeFeature(deletedFeature);
    vectorSourceRoutes.clear();
}

export const updateOrder = () => {
    const newOrder = [];

    $("#locations li").each(function () {
        const id = $(this).data("id");
        newOrder.push(id);
    });

    let updatedLocations = [];

    newOrder.forEach(id => {
        const l = locations.find(l => l.id === id);
        updatedLocations.push(l);
    })

    locations = []

    updatedLocations.forEach(l => {
        locations.push(l);
    })
    vectorSourceRoutes.clear();
}

