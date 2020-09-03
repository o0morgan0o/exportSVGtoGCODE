const fs = require('fs')
const fsPromises = fs.promises
const XMLparser = require('./xmlParser.js')
const { countReset } = require('console')
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

                // tree view can be splitted in several layers
                const treeLayers = []
                for (let i = 0; i < treeView.g.length; i++) {
                    console.log('new layer detected, export seperately...')
                    let layer = Object.assign({}, treeView)
                    delete layer.g
                    layer.g = []
                    layer.g.push(treeView.g[i])
                    treeLayers.push(layer)
                }

                let gcodeStrings = []
                for (let i = 0; i < treeLayers.length; i++) {
                    console.log(`[+] Getting XML representation on layer ${(i + 1).toString()} / ${treeLayers.length.toString()} ...`)
                    let XMLRepresentation = getRepresentation(treeLayers[i])
                    XMLRepresentation.viewBox = svgViewBox

                    // console.log('converting...', XMLRepresentation)

                    console.log('[+] Converting ...')
                    let gcodeString = svg2gcode(XMLRepresentation, this.settings)
                    console.log('[+] optimization ...')
                    gcodeString = this.removeDuplicatedLines(gcodeString)
                    console.log('[+] Conversion done !\n ---------------------------------------------------')
                    gcodeStrings.push(gcodeString)

                }

                resolve(gcodeStrings)

            })
        })


    }


    removeDuplicatedLines(gcodestring) {
        let tmp = gcodestring.split('\n').filter((item, pos, arr) => {
            return pos === 0 || item != arr[pos - 1]
        }).join('\n')
        return tmp

    }


    writeOutputFile(gcodestring, indexLayer) {
        indexLayer += 1
        let baseDir = "./output/"
        let file = baseDir + this.settings.outputFile
        let count = 1
        while (fs.existsSync(file)) {
            file = baseDir + count.toString() + '-' + this.settings.outputFile
            count++
        }

        console.log('[+] Writing Layer ' + indexLayer.toString() + ' into file ' + file)
        fs.writeFile(file, gcodestring, function (err) {
            if (err) throw err
        })
        console.log('[+] Layer ' + indexLayer.toString() + ' done ')

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