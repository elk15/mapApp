export default class Location {
    constructor(id, name, feature, x, y) {
        this.id = id;
        this.name = name;
        this.feature = feature;
        this.x = x;
        this.y = y;
    }

    rename = (newName) => {
        this.name = newName
    }
}