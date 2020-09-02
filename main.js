'use strict'
const fs = require('fs')
const XMLparser = require('./xmlParser.js')
const getRepresentation = require('./getRepresentation').getRepresentation
const svg2gcode = require('./svg2gcode').svg2gcode
const settingsGCODE = require('./settingsGcode').settingsGCODE


let writeGcodeInTheConsole = false

fs.readFile('bbb.svg', 'utf8', (err, data) => {
    if (err) {
        console.log(err)
        return
    }
    // console.log(data)


    let tree = XMLparser.XMLparse(data, { preserveAttributes: false, preserveDocumentNode: false })
    // console.log(tree)
    // console.log(tree.getTree().viewBox.split(' '))
    const svgViewBox = tree.getTree().viewBox.split(' ')
    const svgHeight = svgViewBox[3]
    // console.log(tree.getTree().g[1].rect)

    let XMLRepresentation = getRepresentation(tree.getTree())
    XMLRepresentation.viewBox = svgViewBox
    // console.log(XMLRepresentation)
    // console.log('cc')

    const gcode = svg2gcode(XMLRepresentation, settingsGCODE)
    fs.writeFile('out.gcode', gcode, function (err) {
        if (err) throw err
    })

    if (writeGcodeInTheConsole) console.log(gcode)
})
