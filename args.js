
const yargs = require('yargs')
const args = yargs
    .usage('Usage: node main.js -f myFile.svg')
    .option('file', {
        alias: 'f',
        description: 'give me a svg file to convert (required)',
        type: 'string'
    })
    .option('travelSpeed', {
        alias: 't',
        description: 'travel speed (no printing)',
        type: 'number',
        default: 1600
    })
    .option('printingSpeed', {
        alias: 'p',
        description: 'speed during printing',
        type: 'number',
        default: 4000
    })
    .option('output', {
        alias: 'o',
        description: 'where to output the converted .gcode file ?',
        type: 'string',
        default: 'output.gcode'
    })
    .option('zOffset', {
        alias: 'z',
        description: 'elevation of the pen when moving (note: during printing Z=0 always)',
        type: 'number',
        default: 2
    })
    .demandOption(['f'])
    .help()
    .alias('help', 'h')
    .argv



module.exports = {
    args: args
}