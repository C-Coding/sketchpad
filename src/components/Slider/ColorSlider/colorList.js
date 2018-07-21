
const arr = [];

for (let i = 0; i < 255; i++) {
    arr.push([i, 0, 0])
}
for (let i = 0; i < 255; i++) {
    arr.push([255, i, 0])
}
for (let i = 0; i < 255; i++) {
    arr.push([255 - i, 255, 0])
}
for (let i = 0; i < 255; i++) {
    arr.push([0, 255, i])
}
for (let i = 0; i < 255; i++) {
    arr.push([0, 255 - i, 255])
}
for (let i = 0; i < 255; i++) {
    arr.push([i, 0, 255])
}
for (let i = 0; i < 256; i++) {
    arr.push([255, i, 255])
}

module.exports = arr;