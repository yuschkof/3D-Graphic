class Math3D {
    constructor() {
        // матрица сдвига
        this.moveMatrix = [[ 1,  0,  0, 0],
                           [ 0,  1,  0, 0],
                           [ 0,  0,  1, 0],
                           [ 1,  1,  1, 1]];
        // матрица масштабирования
        this.zoomMatrix = [[ 1, 0,  0, 0],
                           [ 0, 1,  0, 0],
                           [ 0, 0,  1, 0],
                           [ 0, 0,  0, 1]];
        // матрица поворота вокруг оси Ох
        this.rotateOxMatrix = [[ 1,  0,  0, 0],
                               [ 0,  1,  1, 0],
                               [ 0,  1,  1, 0],
                               [ 0,  0,  0, 1]];
        // матрица поворота вокруг оси Оy
        this.rotateOyMatrix = [[ 1,  0,  1, 0],
                               [ 0,  1,  0, 0],
                               [ 1,  0,  1, 0],
                               [ 0,  0,  0, 1]];
        // матрица поворота вокруг оси Оz
        this.rotateOzMatrix = [[ 1,  1,  0, 0],
                               [ 1,  1,  0, 0],
                               [ 0,  0,  1, 0],
                               [ 0,  0,  0, 1]];
    }

    // перемножение матрицы преобразования на точку
    // m = [x, y, z, 1]
    // T = [[],[],[],[]] по 4 элемента
    multMatrix(T, m) {
        const c = [0, 0, 0, 0];
        const rows = T.length;
        const colomns = m.length;
        for (let i = 0; i < rows; i++) {
            let S = 0;
            for (let j = 0; j < colomns; j++) {        
                S += T[j][i] * m[j];   
            }
            c[i] = S;
        }
        return c;
    }

    zoom(delta, point) {
        const array = this.multMatrix(
            [[delta,  0,  0, 0],
             [ 0, delta,  0, 0],
             [ 0,  0, delta, 0],
             [ 0,  0,     0, 1]],
            [point.x, point.y, point.z, 1]
        );
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    move(sx, sy, sz, point) {
        var array = this.multMatrix(
            [[ 1,  0,  0, 0],
             [ 0,  1,  0, 0],
             [ 0,  0,  1, 0],
             [sx, sy, sz, 1]], 
            [point.x, point.y, point.z, 1]
        );
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    rotateOx(alpha, point) {
        var array = this.multMatrix(
            [[1, 0, 0, 0],
             [0,  Math.cos(alpha), Math.sin(alpha), 0],
             [0, -Math.sin(alpha), Math.cos(alpha), 0],
             [0, 0, 0, 1]], 
            [point.x, point.y, point.z, 1]
        );
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    rotateOy(alpha, point) {
        var array = this.multMatrix(
            [[Math.cos(alpha), 0, -Math.sin(alpha), 0],
             [0, 1, 0, 0],
             [Math.sin(alpha), 0, Math.cos(alpha), 0],
             [0, 0, 0, 1]], 
            [point.x, point.y, point.z, 1]
        );
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }
    
    rotateOz(alpha, point) {
        var array = this.multMatrix(
            [[ Math.cos(alpha), Math.sin(alpha), 0, 0],
             [-Math.sin(alpha), Math.cos(alpha), 0, 0],
             [0, 0, 1, 0],
             [0, 0, 0, 1]], 
            [point.x, point.y, point.z, 1]
        );
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }
}