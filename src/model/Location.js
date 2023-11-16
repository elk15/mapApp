export default class Location {
    constructor(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
    }

    rename = (newName) => {
        this.name = newName
    }
}