<template>
  <canvas id="homecanvas"></canvas>
</template>

<script>
import SlamCanvas from "slam-2d-canvas";
export default {
  data: () => ({
    slamCanvas: null,
    mapData: null,
  }),
  mounted() {
    this.slamCanvas = new SlamCanvas("homecanvas");
    window.slamCanvas = this.slamCanvas;
    const image = new Image();
    image.src = "map.jpg";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      context.drawImage(image, 0, 0);
      this.mapData = context.getImageData(
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      );
      for (let i = 0; i < this.mapData.width; i++) {
        const k = i + (this.mapData.height / 2) * this.mapData.width;
        this.mapData.data[k * 4] = 255;
      }

      for (let i = 0; i < this.mapData.height; i++) {
        const k = this.mapData.width/2 + i * this.mapData.width;
        this.mapData.data[k * 4] = 255;
      }

      console.log(this.mapData);
      this.slamCanvas.updateMap(
        this.mapData.data.buffer,
        this.mapData.width,
        0.5,
        -this.mapData.width / 2*0.5,
        -this.mapData.height /2*0.5
      );

    };
    // this.mapBuffer = new Uint8Array(2000 * 3000 * 4);
    // for (let i = 0; i < 2000 * 3000*4; ) {
    //   this.mapBuffer[i] = i%12000 / 50;
    //   this.mapBuffer[i+1] =Math.abs( Math.sin(i/21000)) * 50;
    //         this.mapBuffer[i+2] =Math.abs( Math.cos(i/11000)) * 150;
    //   this.mapBuffer[i + 3] = 255;
    //   i=i+4;
    // }
    // console.log(this.mapBuffer)
    //
  },
  beforeDestroy() {
    this.slamCanvas.garbageCollect();
  },
};
</script>

<style>
canvas {
  height: calc(100vh - 26px);
  padding: 0;
  margin: 0;
  line-height: 0;
  width: 100vw;
  background-color: pink;
}
</style>