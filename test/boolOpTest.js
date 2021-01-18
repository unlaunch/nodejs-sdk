import chai from 'chai';
import boolApply from '../src/engine/attributes/bool.js'
const assert = chai.assert;

describe('Boolean Operators test', () => {
    it('string EQ op should return true', function () {
        assert.equal(boolApply (true, true, 'EQ'), true)
    })
    it('string NEQ op should return true', function () {
        assert.equal(boolApply(false, true, 'NEQ'), true)
    })

})
