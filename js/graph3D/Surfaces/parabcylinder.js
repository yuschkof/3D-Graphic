Surfaces.prototype.parabcylinder = (point = new Point(0, 0, 0), height = 10 , width = 5, delta = 0.5, color = "#FFFF00") => {
    const points =[], 
          edges = [], 
          polygons = [];

    //точки
    for(let i = 0; i <= height; i++) {
        for(let j = -width; j <= width; j+= 0.25){
            points.push(new Point(point.x + j / delta, -(point.y + Math.pow(j, 2)), point.z + i));
        }
    }

    //рёбра
    for(let i = 0; i < height; i++){
        for(let j = 0; j <= width * 8; j++){
            edges.push(new Edge((width * 8 + 1) * i + j, (width * 8 + 1) * (i + 1) + j));
        }
    }

    for(let i = 0; i < points.length - 1; i++){
        if((i + 1) % (width * 8 + 1) !== 0){
            edges.push(new Edge(i, i + 1));
        }
    }

    //полигоны

    for(i = 0; i < height; i++){
        for(j = 0; j < (width * 8 + 1); j++) {
            if ((j + 1) % (width * 8 + 1) !== 0) {
                polygons.push(new Polygon([(width * 8 + 1) * i + j,
                                       (width * 8 + 1) * i + j + 1, 
                                       (width * 8 + 1) * (i + 1) + j + 1, 
                                       (width * 8 + 1) * (i + 1) + j], 
                                       color));
            } 
        }
    }

    return new Subject(points, edges, polygons);
}