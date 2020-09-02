const assert = require('chai').assert
const Converter = require('../converter').Converter
let settingsGCODE = require('./settingsGcodeTest').getSettings()

describe('testing conversion of small rect', function () {

    it('should fail', async function () {
        settingsGCODE.inputFile = 'test/shapes/rectSmall.svg'
        const converter = new Converter(settingsGCODE)
        const result = await converter.convert()
        assert.equal(result,
            `\nG1 Z2\n;end of initialization\n\nG0 F4000\nG90 G21\nG0 X10 Y60\nG1 F1600\n\nG1 Z0 ;ON\nG0 X10 Y60\nG0 X60 Y60\nG0 X60 Y10\nG0 X10 Y10\nG0 X10 Y60\n\nG1 Z1.5 ;OFF\nG0 F4000\n\n;end of file\nG0 X0 Y0`
        )
    })

    it('should fail', async function () {
        settingsGCODE.inputFile = 'test/shapes/rectBig.svg'
        const converter = new Converter(settingsGCODE)
        const result = await converter.convert()
        assert.equal(result,
            `\nG1 Z2\n;end of initialization\n\nG0 F4000\nG90 G21\nG0 X2 Y295\nG1 F1600\n\nG1 Z0 ;ON\nG0 X2 Y295\nG0 X208 Y295\nG0 X208 Y2\nG0 X2 Y2\nG0 X2 Y295\n\nG1 Z1.5 ;OFF\nG0 F4000\n\n;end of file\nG0 X0 Y0`
        )
    })
})



