import { map, addPoint, updatePoint, updateOrder, drawRouteLine, deleteRouteLine } from './handleMap';
import { openModal, closeModal, displayLocations, idToUpdate, selectedLocations, clearSelectedLocations, } from './handleUI';
require('webpack-jquery-ui/sortable');

addPoint("Greece", 23, 38);
displayLocations();

let isMenuOpen = true;

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

    // make locations sortable
    $("#locations").sortable({
        update: function (event, ui) {
            updateOrder();
        }
    });

    // draw route line on map
    $("#calculate-route").on("click", function () {
        if (selectedLocations.length > 1) {
            drawRouteLine();
        } else {
            $("#error-message").css("opacity", "1");
            setTimeout(function () {
                $('#error-message').css("opacity", "0");
            }, 3000);
        }
    })

    $("#reset-route").on("click", function () {
        deleteRouteLine();
        clearSelectedLocations();
    })

    $("#toggle-menu").on("click", function () {
        const menu = $(this).parent("#menu");
        if (isMenuOpen) {
            menu.css("transform", "translateX(95%)")
            isMenuOpen = false;
        } else {
            menu.css("transform", "translateX(0%)")
            isMenuOpen = true;
        }
    })

});



