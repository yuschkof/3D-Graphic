Surfaces.prototype.sphere = ( pointCount = 10, ringCount = 10, x = 10, y = 0, z = 0, R = 0) => {
    let x0 = x;
    let y0 = y;
    let z0 = z;
    let points = [];
    let edges = [];
    let polygons = [];
    // set points
    for (let beta = Math.PI / 2; beta >= -Math.PI / 2; beta -= Math.PI / ringCount) {
        let r = Math.cos(beta) * R;
        let height = Math.sin(beta) * R;
        for (let alpha = 0; alpha < Math.PI * 2; alpha += Math.PI / pointCount * 2) {
            let x = Math.cos(alpha) * r + x0;
            let y = height + y0;
            let z = Math.sin(alpha) * r + z0;
            points.push(new Point(x, y, z));
        } 
    }
    //set edges
    for (let i = 0; i < points.length; i++) {
        if (i % pointCount === 0 && i !== 0) {
            edges.push(new Edge(i, i + 1));
        } else {
            if (i + 1 < points.length && (i + 1) % pointCount !== 0){
                edges.push(new Edge(i, i + 1));
            } else {
                edges.push(new Edge(i, i + 1 - pointCount));
            }
        }
        if (i + pointCount < points.length) {
            edges.push(new Edge(i, i + pointCount));
        }
    }
    //set polygons 
    for (let i = 0; i < points.length; i++) {
        if ((i + 1 + pointCount) < points.length && ((i + 1) % pointCount) != 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + pointCount, i + pointCount]));
        } else if ((i + pointCount) < points.length && ((i + 1) % pointCount) == 0) {
            polygons.push(new Polygon([i, i - pointCount + 1, i + 1, i + pointCount]));
        }
    }
    return new Subject(points, edges, polygons);
}