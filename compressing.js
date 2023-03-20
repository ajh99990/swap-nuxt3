const compressing = require('compressing');
const fs = require('fs');

const args = process.argv.slice(2)

if (args[0] === 'test') {
    compressing.zip.compressDir('./dist', './dist.zip').then(() => {
        fs.renameSync('./dist.zip', './dist/dist.zip')
        fs.renameSync('./version', './dist/version')
    })
    return
}

if (args[0] === 'release') {
    fs.renameSync('./dist.zip', './dist/dist.zip')
    fs.renameSync('./version', './dist/version')
} else {
    compressing.zip.compressDir('./dist', './dist.zip')
}