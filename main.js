#!/usr/bin/env node
'use strict'
    ;
const args = require('./args').args
const Converter = require('./converter').Converter
    ;
let settingsGCODE = require('./settingsGcode').getSettings()
    ;

console.log('hello');

(async () => {

    let inputFolder = settingsGCODE.inputFolder
    let outputFolder = settingsGCODE.exportFolder
    let svgFile = inputFolder + args.file
    let outFile = args.output
    let travelSpeed = args.travelSpeed
    let printingSpeed = args.printingSpeed
    let zOffset = args.zOffset
    // console.log(zOffset)

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
    let gcodeArray = await converter.convert()


    for (let i = 0; i < gcodeArray.length; i++) {

        if (settingsGCODE.showOutput) converter.showStringifyGcode(gcodeArray[i])
        if (settingsGCODE.writeOutput) {
            converter.writeOutputFile(outputFolder, gcodeArray[i], i)
        }
    }
    console.log('[+] Finished !\n')



})()

module.exports = {
    Converter: Converter
}