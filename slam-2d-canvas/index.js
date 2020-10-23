class SlamCanvas {
    constructor(canvasId) {
        this.canvasDisplayer = document.getElementById(canvasId);
        this.ctxDisplayer = this.canvasDisplayer.getContext('2d');
        contextTracker(this.ctxDisplayer)
        this.canvasReceiver = document.createElement('canvas');
        this.ctxReceiver = this.canvasReceiver.getContext('2d');
        window.addEventListener('resize', this.resize.bind(this))
        const boundingClientRect = this.canvasDisplayer.getBoundingClientRect()
        this.pixelRatio = window.devicePixelRatio;
        this.canvasDisplayer.height = boundingClientRect.height * this.pixelRatio;
        this.canvasDisplayer.width = boundingClientRect.width * this.pixelRatio;
        this.ctxDisplayer.translate(this.canvasDisplayer.width / 2, this.canvasDisplayer.height / 2);
        this.ctxDisplayer.scale(this.pixelRatio, this.pixelRatio);
        this.mapData = null;
        this.mapDataOrigin = {};
    }
    garbageCollect() {
        window.removeEventListener('resize', this.resize)
    }
    resize() {
        const boundingClientRect = this.canvasDisplayer.getBoundingClientRect()
        const mx = this.ctxDisplayer.getTransform();
        this.canvasDisplayer.height = boundingClientRect.height * this.pixelRatio;
        this.canvasDisplayer.width = boundingClientRect.width * this.pixelRatio;
        this.ctxDisplayer.reset();
        this.ctxDisplayer.setTransform(mx.a, mx.b, mx.c, mx.d, mx.e, mx.f);
        this.ctxDisplayer.drawImage(this.canvasReceiver, this.mapDataOrigin.x, this.mapDataOrigin.y)
    }
    updateTransform(cx, cy, radian, scale, dx, dy) {
        const transformCenter = this.ctxDisplayer.screenToPixel(cx, cy);
        const transformTo = this.ctxDisplayer.screenToPixel(dx, dy);
        const transformFrom = this.ctxDisplayer.screenToPixel(0, 0);
        const transform = new DOMPoint(transformTo.x - transformFrom.x, transformTo.y - transformFrom.y);
        this.ctxDisplayer.translate(transformCenter.x, transformCenter.y);
        this.ctxDisplayer.rotate(radian);
        this.ctxDisplayer.scale(scale, scale);
        this.ctxDisplayer.translate(-transformCenter.x, -transformCenter.y);
        this.ctxDisplayer.translate(transform.x, transform.y);
        this.drawMap();
    }
    updateMap(mapBuffer, mapWidth, resolution, originX, originY) {
        this.mapData = new ImageData(new Uint8ClampedArray(mapBuffer), mapWidth)
        this.canvasReceiver.height = this.mapData.height;
        this.canvasReceiver.width = this.mapData.width;
        this.ctxReceiver.putImageData(this.mapData, 0, 0)
        this.mapDataOrigin.x = originX / resolution;
        this.mapDataOrigin.y = -this.mapData.height - originY / resolution;
        this.drawMap()
    }
    drawMap() {
        window.requestAnimationFrame(() => {
            console.log("x")
            this.ctxDisplayer.save();
            this.ctxDisplayer.setTransform(1, 0, 0, 1, 0, 0);
            this.ctxDisplayer.clearRect(0, 0, this.canvasDisplayer.width, this.canvasDisplayer.height);
            this.ctxDisplayer.restore();
            this.ctxDisplayer.drawImage(this.canvasReceiver, this.mapDataOrigin.x, this.mapDataOrigin.y)
        })

    }
}

function contextTracker(ctx) {
    let transformMatrix = new DOMMatrix().translate(0, 0);
    let savedTransforms = [];
    ctx.reset = function () {
        transformMatrix = new DOMMatrix().translate(0, 0);
        savedTransforms = [];
    }
    ctx.getTransform = function () {
        return transformMatrix;
    };

    const save = ctx.save;
    ctx.save = function () {
        savedTransforms.push(transformMatrix.translate(0, 0));
        return save.call(ctx);
    };

    const restore = ctx.restore;
    ctx.restore = function () {
        transformMatrix = savedTransforms.pop();
        return restore.call(ctx);
    };

    const scale = ctx.scale;
    ctx.scale = function (sx, sy) {
        transformMatrix = transformMatrix.scale(sx, sy);
        return scale.call(ctx, sx, sy);
    };

    const rotate = ctx.rotate;
    ctx.rotate = function (radians) {
        transformMatrix = transformMatrix.rotate((radians * 180) / Math.PI);
        return rotate.call(ctx, radians);
    };

    const translate = ctx.translate;
    ctx.translate = function (dx, dy) {
        transformMatrix = transformMatrix.translate(dx, dy);
        return translate.call(ctx, dx, dy);
    };

    const transform = ctx.transform;
    ctx.transform = function (a, b, c, d, e, f) {
        let m2 = new DOMMatrix();
        m2.a = a;
        m2.b = b;
        m2.c = c;
        m2.d = d;
        m2.e = e;
        m2.f = f;
        transformMatrix = transformMatrix.multiply(m2);
        return transform.call(ctx, a, b, c, d, e, f);
    };

    const setTransform = ctx.setTransform;
    ctx.setTransform = function (a, b, c, d, e, f) {
        transformMatrix.a = a;
        transformMatrix.b = b;
        transformMatrix.c = c;
        transformMatrix.d = d;
        transformMatrix.e = e;
        transformMatrix.f = f;
        return setTransform.call(ctx, a, b, c, d, e, f);
    };

    const sm = new DOMPoint();
    ctx.screenToPixel = function (x, y) {
        sm.x = x;
        sm.y = y;
        return sm.matrixTransform(transformMatrix.inverse());
    };

    const ms = new DOMPoint();
    ctx.pixelToScreen = function (x, y) {
        ms.x = x;
        ms.y = y;
        return ms.matrixTransform(transformMatrix);
    };

}



// const SlamCanvas = {
//     canvas: null,
//     ctx: null,
// };

// SlamCanvas.initialize= function (canvasId) {
//     SlamCanvas.canvas = document.getElementById(canvasId);
//     SlamCanvas.ctx = SlamCanvas.canvas.getContext('2d');
// }

// SlamCanvas.drawMap = function (img) {
//     SlamCanvas.canvas.height = img.height;
//     SlamCanvas.canvas.width = img.width;
//     SlamCanvas.ctx.drawImage(img, 0,0); 
// }

export default SlamCanvas;

