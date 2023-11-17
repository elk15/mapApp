import { map, addPoint, updatePoint } from './handleMap';
import { openModal, closeModal, displayLocations, idToUpdate } from './handleUI';


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

        if (idToUpdate) {
            updatePoint(idToUpdate, name, longtitude, latitude)
        } else {
            addPoint(name, longtitude, latitude);
        }

        closeModal();

        displayLocations();
    })

});



