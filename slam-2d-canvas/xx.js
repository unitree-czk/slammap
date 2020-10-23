function copyToHeapUint8Array(typedArray) {
    const numBytes = typedArray.length;
    const ptr = Module._malloc(numBytes);
    const heapBytes = new Uint8Array(Module.HEAPU8.buffer, ptr, numBytes);
    heapBytes.set(new Uint8Array(typedArray));
    return heapBytes;
}

function main() {

    let a = new Uint8Array(9000000)
    let s = performance.now()
    let bytes_1 = copyToHeapUint8Array(a);

    Module.calcal(bytes_1.byteOffset, 9000000)
    Module._free(bytes_1.byteOffset)
    console.log(performance.now() - s)

}

setTimeout(main, 1000)
