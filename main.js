'use strict'
    ;
const args = require('./args').args
const Converter = require('./converter').Converter
    ;
let settingsGCODE = require('./settingsGcode').getSettings()
    ;

(async () => {

    let writeGcodeInTheConsole = false
    let svgFile = args.file
    let outFile = args.output
    let travelSpeed = args.travelSpeed
    let printingSpeed = args.printingSpeed


    settingsGCODE.inputFile = svgFile

    // TODO : make a validation of the inputs
    // settingsGCODE.outputFile = outFile
    //validation
    // if (svgFile.search('.svg') == -1) {
    //     console.error('invalid svg file, exiting... (run node main.js -h for usage)')
    //     return 0
    // }


    // settingsGCODE.inputFile = 'test/shapes/rectBig.svg'
    let converter = new Converter(settingsGCODE)
    let gcode = await converter.convert()


    converter.showStringifyGcode(gcode)



})()

module.exports = {
    Converter: Converter
}