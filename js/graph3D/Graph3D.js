class Graph3D {
    constructor({ WINDOW }) {
        this.WINDOW = WINDOW;
        this.math = new Math3D();
    }

    xs(point) {
        const zs = this.WINDOW.CENTER.z;
        const z0 = this.WINDOW.CAMERA.z;
        const x0 = this.WINDOW.CAMERA.x;
        return (point.x - x0) / (point.z - z0) * (zs - z0) + x0;
    }

    ys(point) {
        const zs = this.WINDOW.CENTER.z;
        const z0 = this.WINDOW.CAMERA.z;
        const y0 = this.WINDOW.CAMERA.y;
        return (point.y - y0) / (point.z - z0) * (zs - z0) + y0;
    }

    // масштабирование точки
    zoom(delta, point) { 
        this.math.zoom(delta, point); 
    }

    // перенос точки вдоль оси Ox
    moveOx(delta, point) { 
        return this.math.move(delta, 0, 0, point);
    }
    // перенос точки вдоль оси Oy
    moveOy(delta, point) { 
        return this.math.move(delta, 0, 0, point);
    }

    // повороты по осям
    rotateOx(alpha, point) {
        return this.math.rotateOx(alpha, point);
    }
    rotateOy(alpha, point) {
        return this.math.rotateOy(alpha, point);
    }
    rotateOz(alpha, point) {
        return this.math.rotateOz(alpha,point);
    }

    calcDistance(subject, endPoint, name) {
        for( let i = 0; i < subject.polygons.length; i++) {
            const points = subject.polygons[i].points;
            let x = 0, y = 0, z = 0;
            for(let j = 0; j < points.length; j++) {
                x += subject.points[points[j]].x;
                y += subject.points[points[j]].y;
                z += subject.points[points[j]].z;
            }
            x = x / points.length;
            y = y / points.length;
            z = z / points.length;
            
            subject.polygons[i][name] =
                Math.sqrt((endPoint.x - x) * (endPoint.x - x) +
                          (endPoint.y - y) * (endPoint.y - y) +
                          (endPoint.z - z) * (endPoint.z - z));
        }   
    }
}