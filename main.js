'use strict'
    ;
const args = require('./args').args
const fs = require('fs')
const Converter = require('./converter').Converter
const path = require('path')
const svgoConfig = require('./svgoConfig').svgoConfig
const SVGO = require('./node_modules/svgo/lib/svgo.js')
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
    let useSvgo = args.useSvgo
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
    settingsGCODE.useSvgo = useSvgo

    // implementation svgo
    if (settingsGCODE.useSvgo === true) {
        console.log('[+] using svgo to optimize the svg file ...')
        const mSvgo = new SVGO({
            floatPrecision: 8,
            plugins: svgoConfig,
            pretty: true
        })
        // convert the input file
        const filepath = path.resolve(settingsGCODE.inputFolder, settingsGCODE.inputFile)
        console.log(filepath)
        fs.readFile(filepath, 'utf8', function (err, data) {
            if (err) throw err
            console.log('reading')
            mSvgo.optimize(data, { path: filepath }).then(function (result) {
                let svgoFileOutput = path.resolve(settingsGCODE.inputFolder, settingsGCODE.inputFile + "_temp")
                fs.writeFile(svgoFileOutput, result.data, (err) => {
                    if (err) return console.log(err)
                    console.log('svgo conversion success')
                    settingsGCODE.inputFile = svgFile + "_temp"
                    launchConversion(settingsGCODE)
                })

            })
        })
    } else {

        launchConversion(settingsGCODE)
    }


})()

async function launchConversion(settingsGCODE) {

    // settingsGCODE.inputFile = 'test/shapes/rectBig.svg'
    let converter = new Converter(settingsGCODE)
    let gcodeArray = await converter.convert()


    for (let i = 0; i < gcodeArray.length; i++) {

        if (settingsGCODE.showOutput) converter.showStringifyGcode(gcodeArray[i])
        if (settingsGCODE.writeOutput) {
            converter.writeOutputFile(settingsGCODE.exportFolder, gcodeArray[i], i)
        }
    }
    console.log('[+] Finished !\n')



}