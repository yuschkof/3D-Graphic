class Light extends Point {
    constructor(x, y, z, lumen = 400) {
        super(x, y, z);
        this.lumen = lumen; 
    }
}