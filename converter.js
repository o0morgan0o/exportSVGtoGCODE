const fs = require('fs')
const fsPromises = fs.promises
const XMLparser = require('./xmlParser.js')
const getRepresentation = require('./getRepresentation').getRepresentation
const svg2gcode = require('./svg2gcode').svg2gcode

class Converter {
    constructor(settings) {
        this.settings = settings

    }

    async convert() {

        return new Promise((resolve, reject) => {
            fs.readFile(this.settings.inputFile, 'utf8', (err, data) => {
                if (err) {
                    console.error(err)
                    reject('error reading file')
                    return
                }

                let tree = XMLparser.XMLparse(data, { preserveAttributes: false, preserveDocumentNode: false })
                // console.log(tree)
                const treeView = tree.getTree()
                const svgViewBox = tree.getTree().viewBox.split(' ')

                console.log('[+] Getting XML representation ...')
                let XMLRepresentation = getRepresentation(tree.getTree())
                XMLRepresentation.viewBox = svgViewBox

                // console.log('converting...', XMLRepresentation)

                console.log('[+] Converting ...')
                let gcodeString = svg2gcode(XMLRepresentation, this.settings)
                // console.log('aaaaaaaaa', this.gcode)
                gcodeString = this.removeDuplicatedLines(gcodeString)
                console.log('[+] Conversion done !\n -----------------')
                resolve(gcodeString)

            })
        })


    }


    removeDuplicatedLines(gcodestring) {
        let tmp = gcodestring.split('\n').filter((item, pos, arr) => {
            return pos === 0 || item != arr[pos - 1]
        }).join('\n')
        return tmp

    }


    writeOutputFile(gcodestring) {
        if (showConsole) console.log(this.gcode)
        console.log('writing to file ...')
        fs.writeFile(this.settings.outputFile, this.gcode, function (err) {
            if (err) throw err
        })
        console.log("done !")

    }

    showStringifyGcode(gcodestring) {
        console.log('Stringified GCODE :\n')
        console.log(JSON.stringify(gcodestring))
        console.log('done.')
    }

}

module.exports = {
    Converter: Converter
}