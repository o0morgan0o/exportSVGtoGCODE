'use strict'
    ;
const args = require('./args').args
const Converter = require('./converter').Converter
    ;
let settingsGCODE = require('./settingsGcode').getSettings()
    ;

(async () => {

    let svgFile = 'input/' + args.file
    let outFile = args.output
    let travelSpeed = args.travelSpeed
    let printingSpeed = args.printingSpeed
    let zOffset = args.zOffset
    console.log(zOffset)

    // validateInputs()
    // TODO : make a validation of the inputs
    // if (svgFile.search('.svg') == -1) {

    settingsGCODE.inputFile = svgFile
    settingsGCODE.outputFile = outFile
    settingsGCODE.seekRate = travelSpeed
    settingsGCODE.feedRate = printingSpeed
    settingsGCODE.colorCommandOff4 = settingsGCODE.colorCommandOff4.replace('{{Zoff}}', zOffset.toString())
    settingsGCODE.start = settingsGCODE.start.replace('{{Zoff}}', zOffset.toString())


    // settingsGCODE.inputFile = 'test/shapes/rectBig.svg'
    let converter = new Converter(settingsGCODE)
    let gcode = await converter.convert()


    if (settingsGCODE.showOutput) converter.showStringifyGcode(gcode)
    if (settingsGCODE.writeOutput) {
        converter.writeOutputFile(gcode)
    }



})()

module.exports = {
    Converter: Converter
}