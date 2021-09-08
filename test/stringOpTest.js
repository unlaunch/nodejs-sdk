const chai = require('chai')
const stringApply = require('../src/engine/attributes/string.js')
const assert = chai.assert;

const flagString = 'ahiman';

describe('String Operators test', () => {
    it('string EQ op should macth', function () {
        assert.equal(stringApply(flagString, "ahiman", 'EQ'), true)
    })
    it('string NEQ op should match', function () {
        assert.equal(stringApply(flagString, "abc", 'NEQ'), true)
    })
    it("string CON op shouldn't match", function () {
        assert.equal(stringApply(flagString, "abc", 'CON'), false)
    })
    it("string CON op should match", function () {
        assert.equal(stringApply(flagString, "fishisahiman", 'CON'), true)
    })
    it("string CON op should match", function () {
        assert.equal(stringApply(flagString, "this also contains ahiman so it should match", 'CON'), true)
    })
    it('string NCON op should match', function () {
        assert.equal(stringApply(flagString, "doesntcontain", 'NCON'), true)
    })
    it('string SW op should match', function () {
        assert.equal(stringApply(flagString, "ahimanatstart", 'SW'), true)
    })
    it('string NSW op should match', function () {
        assert.equal(stringApply(flagString, "noahimanatstart", 'NSW'), true)
    })
    it('string EW op should match', function () {
        assert.equal(stringApply(flagString, "endswithahiman", 'EW'), true)
    })
    it('string NEW op should match', function () {
        assert.equal(stringApply(flagString, "doesntendswithahiman", 'NEW'), false)
    })
    it("null string should throw Error", function () {
        assert.throws(() => stringApply(flagString, null, 'SW'), Error)
    })
    it("empty string shouldn't match", function () {
        assert.equal(stringApply(flagString, "", 'EW'), false)
    })

})
