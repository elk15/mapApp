import { Feature, Map, View } from 'ol/index.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { useGeographic } from 'ol/proj.js';
import { Point } from 'ol/geom';

useGeographic();

const point = new Point([-110, 45]);

const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
        new VectorLayer({
            source: new VectorSource({
                features: [new Feature(point)],
            }),
            style: {
                'circle-radius': 9,
                'circle-fill-color': 'red',
            },
        }),
    ],
    view: new View({
        center: [0, 0],
        zoom: 2,
    }),
});

