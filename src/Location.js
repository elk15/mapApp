export default class Location {
    constructor(name, feature, x, y) {
        this.name = name;
        this.feature = feature;
        this.x = x;
        this.y = y;
    }

    rename = (newName) => {
        this.name = newName
    }
}