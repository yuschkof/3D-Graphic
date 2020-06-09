window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callbacks) {
            window.setTimeout(callbacks, 1000 / 60);
        };
})();

window.onload = function () {
    const WINDOW = {
        LEFT: -10,
        BOTTOM: -10,
        WIDTH: 20,
        HEIGHT: 20,
        CENTER: new Point(0, 0, -30), // центр окошка, через которое видим мир
        CAMERA: new Point(0, 0, -50) // точка, из которой смотрим на мир
    };
    const ZOOM_OUT = 1.1;
    const ZOOM_IN = 0.9;
    const sur = new Surfaces;
    const canvas = new Canvas({
        width: 600,
        height: 600,
        WINDOW,
        callbacks: {
            wheel,
            mouseup,
            mousedown,
            mousemove,
            mouseleave
        }
    });
    const graph3D = new Graph3D({
        WINDOW
    });
    const ui = new UI({
        callbacks: {
            move,
            printPoints,
            printEdges,
            printPolygons
        }
    });

    // сцена
    const SCENE = [
        sur.sphera(20, 8, { x0: 0, y0: 0, z0: 0, }, "#ffff00", { rotateOz: new Point }),
        sur.sphera(20, 4, { x0: -9, y0: 0, z0: -9, }, "#ff0100", {rotateOy: new Point(-9, 0, -9) }),
        // sur.sphera(),
    ]; 

    const LIGHT = new Light(-20, 2, -20, 200); //источник света

    let canRotate = false; 
    let canPrint = {
        point: false,
        edges: false,
        polygon: true
    }
    
    // about callback
    function wheel(event) {
        const delta = (event.wheelDelta > 0) ? ZOOM_IN : ZOOM_OUT;
        graph3D.zoomMatrix(delta);
        SCENE.forEach(subject => {
            subject.points.forEach(point => graph3D.transform(point));
            if (subject.animation) {
                for (let key in subject.animation) {
                    graph3D.transform(subject.animation[key]);
                }
            }
        });
    }

    function mousemove(event) {
        if (canRotate) {
            if (event.movementX) {
                const alpha = canvas.sx(event.movementX) / WINDOW.CAMERA.z;
                graph3D.rotateOyMatrix(alpha);
                SCENE.forEach(subject => {
                    subject.points.forEach(point => graph3D.transform(point));
                    if (subject.animation) {
                        for (let key in subject.animation) {
                            graph3D.transform(subject.animation[key]);
                        }
                    }
                });
            }
            if (event.movementY) {
                const alpha = canvas.sy(event.movementY) / -WINDOW.CAMERA.z;
                graph3D.rotateOxMatrix(alpha);
                SCENE.forEach(subject => {
                    subject.points.forEach(point => graph3D.transform(point));
                    if (subject.animation) {
                        for (let key in subject.animation) {
                            graph3D.transform(subject.animation[key]);
                        }
                    }
                });
            }
        }
    }

    function mouseup() {
        canRotate = false;
    }

    function mouseleave() {
        mouseup();
    }

    function mousedown() {
        canRotate = true;
    }

    function move(direction) {
        if (direction === 'up' || direction === 'down') {
            const delta = (direction === 'up') ? 0.1 : -0.1;
            graph3D.moveMatrix(0, delta, 0);
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.transform(point)));
        }
        if (direction === 'left' || direction === 'right') {
            const delta = (direction === 'right') ? 0.1 : -0.1;
            graph3D.moveMatrix(delta, 0, 0);
            SCENE.forEach(subject => subject.points.forEach(point => graph3D.transform(point)));
        }
    }

    function printPoints(value) {
        canPrint.points = value
    }

    function printEdges(value) {
        canPrint.edges = value
    }

    function printPolygons(value) {
        canPrint.polygons = value
    }

    function printAllPolygons() {
        //нарисовать полигоны
        if (canPrint.polygons) {
            const polygons = [];
            SCENE.forEach(subject => {
                //отсечь невидимые грани
                // graph3D.calcGorner(subject, WINDOW.CAMERA)
                graph3D.calcDistance(subject, WINDOW.CAMERA, "distance"); // 
                graph3D.calcDistance(subject, LIGHT, 'lumen'); // рассчитать дистанция полигон до источник света
                for (let i = 0; i < subject.polygons.length; i++) {
                    if (subject.polygons[i].visible) {
                        const polygon = subject.polygons[i];
                        const point1 = {
                            x: graph3D.xs(subject.points[polygon.points[0]]),
                            y: graph3D.ys(subject.points[polygon.points[0]])
                        };
                        const point2 = {
                            x: graph3D.xs(subject.points[polygon.points[1]]),
                            y: graph3D.ys(subject.points[polygon.points[1]])
                        };
                        const point3 = {
                            x: graph3D.xs(subject.points[polygon.points[2]]),
                            y: graph3D.ys(subject.points[polygon.points[2]])
                        };
                        const point4 = {
                            x: graph3D.xs(subject.points[polygon.points[3]]),
                            y: graph3D.ys(subject.points[polygon.points[3]])
                        };
                        let { r, g, b } = polygon.color;
                        const lumen = graph3D.calcIllummination(polygon.lumen, LIGHT.lumen)
                        r = Math.round(r * lumen);
                        g = Math.round(g * lumen);
                        b = Math.round(b * lumen);
                        polygons.push({
                            points: [point1, point2, point3, point4],
                            color: polygon.rgbToHex(r, g, b),
                            distance: polygon.distance,
                        });
                    }
                }
            });
            //отрисовка всех полигонов
            polygons.sort((a, b) => b.distance - a.distance); // отрисовать полигоны       
            polygons.forEach(polygon => canvas.polygon(polygon.points, polygon.color));
        }
    }

    function printSubject(subject) {
        

        if (canPrint.edges) {
            for (let i = 0; i < subject.edges.length; i++) {
                const edges = subject.edges[i];
                const point1 = subject.points[edges.p1];
                const point2 = subject.points[edges.p2];
                canvas.line(graph3D.xs(point1), graph3D.ys(point1), graph3D.xs(point2), graph3D.ys(point2));
            }
        }

        if (canPrint.points) {
            for (let i = 0; i < subject.points.length; i++) {
                const points = subject.points[i];
                canvas.point(graph3D.xs(points), graph3D.ys(points));
            }
        }
    }

    function render() {
        canvas.clear();
        printAllPolygons();
        SCENE.forEach(subject => printSubject(subject));
        canvas.text(WINDOW.LEFT, WINDOW.BOTTOM, 'FPS: ' + FPSout);
        canvas.render();

    }

    function animation() {
        //закрутим фигуру!
        SCENE.forEach(subject => {
            if (subject.animation) {
                for (let key in subject.animation) {
                        const {x, y, z} = subject.animation[key];
                        const xn = WINDOW.CENTER.x - x;
                        const yn = WINDOW.CENTER.y - y;
                        const zn = WINDOW.CENTER.z - z;
                        const alpha = Math.PI / 180;
                        graph3D.animateMatrix(xn, yn, zn, key, -alpha, -xn, -yn, -zn);
                        subject.points.forEach(point => graph3D.transform(point));
                }
            }
            
        });
    }
    setInterval(animation, 30)

    let FPS = 0;
    let FPSout = 0;
    let timestamp = Date.now();
    (function animloop() {
        FPS++;
        const currentTimestamp = Date.now();
        if (currentTimestamp - timestamp >= 1000) {
            timestamp = currentTimestamp;
            FPSout = FPS;
            FPS = 0;
        }
        render();
        requestAnimFrame(animloop);
    })();
};