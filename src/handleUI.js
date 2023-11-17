import { locations, deletePoint } from "./handleMap";

export let idToUpdate = null;

export let selectedLocations = [];

export const openModal = () => {
    $("#modal").show();
    $("#overlay").show();
}

export const closeModal = () => {
    $("#modal").hide();
    $("#overlay").hide();

    $("#update-location").hide();
    $("#submit-location").show();
    idToUpdate = null;

    //reset fields
    $("#name").val("");
    $("#longitude").val("");
    $("#latitude").val("");
}


export const displayLocations = () => {
    $("#locations").empty();

    locations.forEach(l => {
        $("#locations").append(`
            <li data-id="${l.id}" class="${selectedLocations.includes(l.id) ? "selected" : ""}">
                <button class="add-location" data-id="${l.id}">
                    ${selectedLocations.includes(l.id) ?
                `<i class="fa-solid fa-x"></i>`

                :
                `<i class="fa-solid fa-map-location-dot"></i>`

            }
                </button>
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

    // edit location
    $('.edit-location').on('click', (e) => {
        const id = e.target.getAttribute("data-id");

        const location = locations.find(l => l.id === id);
        $("#name").val(location.name);
        $("#longitude").val(location.x);
        $("#latitude").val(location.y);

        idToUpdate = id;
        $("#update-location").show();
        $("#submit-location").hide();
        openModal();
    })

    // add location to route
    $('.add-location').on('click', function () {
        const id = $(this).data("id");

        if (!$(this).parent('li').hasClass("selected")) {
            selectedLocations.push(id);
        } else {
            selectedLocations = selectedLocations.filter(item => item !== id);
        }

        displayLocations();
    })
}

export const clearSelectedLocations = () => {
    selectedLocations = [];
    displayLocations();
}

