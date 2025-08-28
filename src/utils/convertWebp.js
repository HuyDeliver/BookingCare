const sharp = require('sharp');


const convertToWebp = async (fileBase64) => {
    let base64data = fileBase64.replace(/^data:image\/\w+;base64,/, '')
    let buffer = Buffer.from(base64data, 'base64')

    let webpBuffer = await sharp(buffer)
        .webp({ quality: 80, effort: 4 }) // Tối ưu chất lượng và tốc độ nén
        .toBuffer();
    return `data:image/webp;base64,${webpBuffer.toString('base64')}`;
}
module.exports = {
    convertToWebp
}