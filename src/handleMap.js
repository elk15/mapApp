import { Feature, Map, View } from 'ol/index.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { useGeographic } from 'ol/proj.js';
import { Point } from 'ol/geom';
import { v4 as uuidv4 } from 'uuid';
import Location from './Location';

useGeographic();

export const locations = [];

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

const vectorSource = new VectorSource();
const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: {
        'circle-radius': 5,
        'circle-fill-color': 'red',
    },
});
map.addLayer(vectorLayer);

export const addPoint = (name, x, y) => {
    const point = new Point([x, y]);
    const feature = new Feature(point);
    vectorSource.addFeature(feature);

    const id = uuidv4();

    locations.push(new Location(id, name, feature, x, y));
}

export const updatePoint = (id, name, longtitude, latitude) => {
    locations.map(l => {
        if (l.id === id) {
            l.name = name;
            l.x = longtitude;
            l.y = latitude;

            vectorSource.removeFeature(l.feature);

            const point = new Point([longtitude, latitude]);
            const feature = new Feature(point);
            vectorSource.addFeature(feature);

            l.feature = feature;

            return l;
        }
        return l;
    })
}

export const deletePoint = (id) => {
    const locationIndex = locations.findIndex(l => l.id === id);
    if (locationIndex === -1) return;
    const deletedLocation = locations.splice(locationIndex, 1);
    const deletedFeature = deletedLocation[0].feature;
    vectorSource.removeFeature(deletedFeature);
}