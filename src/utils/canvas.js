function canvasResize(canvasEl, canvasCtx, width, height) {
    let copyEl = document.createElement('canvas')
    copyEl.width=canvasEl.width;
    copyEl.height=canvasEl.height;
    copyEl.getContext('2d').drawImage(canvasEl, 0, 0);

    if (width !== undefined) {
        canvasEl.width = width
    }
    if (height !== undefined) {
        canvasEl.height = height;
    }
    canvasCtx.drawImage(copyEl, 0, 0);
}
module.exports = {
    canvasResize
}