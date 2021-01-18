import chai from 'chai';
import stringApply from '../src/engine/attributes/string.js'
const assert = chai.assert;

describe('String Operators test', () => {
    it('string EQ op should return true', function () {
        assert.equal(stringApply("testString", "testString", 'EQ'), true)
    })
    it('string NEQ op should return true', function () {
        assert.equal(stringApply("testString", "testString", 'NEQ'), false)
    })
    it('string CON op should return true', function () {
        assert.equal(stringApply("testString", "test", 'CON'), true)
    })
    it('string NCON op should return true', function () {
        assert.equal(stringApply("testString", "abc", 'NCON'), true)
    })
    it('string SW op should return true', function () {
        assert.equal(stringApply("testString", "t", 'SW'), true)
    })
    it('string EW op should return true', function () {
        assert.equal(stringApply("testString", "g", 'EW'), true)
    })
    it('string NSW op should return true', function () {
        assert.equal(stringApply("testString", "abc", 'NSW'), true)
    })
    it('string NEW op should return true', function () {
        assert.equal(stringApply("testString", "xyz", 'NEW'), true)
    })

})
