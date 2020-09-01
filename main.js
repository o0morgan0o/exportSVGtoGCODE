'use strict'
const fs = require('fs')
const XMLparser = require('./xmlParser.js')
const getRepresentation = require('./getRepresentation').getRepresentation
const svg2gcode = require('./svg2gcode').svg2gcode
const settingsGCODE = require('./settingsGcode').settingsGCODE


fs.readFile('rect.svg', 'utf8', (err, data) => {
    if (err) {
        console.log(err)
        return
    }
    // console.log(data)


    let tree = XMLparser.XMLparse(data, { preserveAttributes: false, preserveDocumentNode: false })
    console.log(tree.getTree())

    let XMLRepresentation = getRepresentation(tree.getTree())
    // console.log(XMLRepresentation)

    const gcode = svg2gcode(XMLRepresentation, settingsGCODE)
    console.log(gcode)
})
