const assert = require('chai').assert
const scale = require('../svg2gcode.js').scale

describe('Test de Text', function () {
    it('should work', function () {

    })
})

describe('test scale function in svg2gcode', function () {
    it('0 scale should be 0', function () {
        assert.equal(scale(0), 0)
        assert.equal(scale(1), 0.352778)
    })

})