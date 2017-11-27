function getElementLeft(element) {           //计算距离文档左偏移
    let actualLeft = element.offsetLeft;
    let current = element.offsetParent;
    while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }
    return actualLeft;
}
function getElementTop(element) {            //计算距离文档上偏移
    let actualTop = element.offsetTop;
    let current = element.offsetParent;
    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return actualTop;
}

export {
    getElementLeft,
    getElementTop
}