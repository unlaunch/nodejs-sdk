import chai from 'chai';
import setApply from '../src/engine/attributes/set.js'
const assert = chai.assert;

describe('Set Operators test', () => {
    it('Set AO op should return true', function () {
        assert.equal(setApply([1,2,3],[1,2,3,4] , 'AO'), true)
    })
    it('Set NAO op should return true', function () {
        assert.equal(setApply([1,2,3],[1] , 'NAO'), true)
    })
    it('Set HA op should return true', function () {
        assert.equal(setApply([1,2,3],[1] , 'HA'), true)
    })
    it('Set NHA op should return true', function () {
        assert.equal(setApply([1,2,3],[4,5,6] , 'NHA'), true)
    })
    it('Set EQ op should return true', function () {
        assert.equal(setApply([1,2,3],[1,2,3] , 'EQ'), true)
    })
    it('Set NEQ op should return false', function () {
        assert.equal(setApply([1,2,3],[1,2,3] , 'NEQ'), false)
    })
    it('Set NEQ op should return true', function () {
        assert.equal(setApply([1,2,3],[1,2,3,4] , 'NEQ'), true)
    })
    it('Set PO op should return true', function () {
        assert.equal(setApply([1,2,3,4],[1,2,3] , 'PO'), true)
    })
    it('Set NPO op should return true', function () {
        assert.equal(setApply([1,2,3,4],[5,6] , 'NPO'), true)
    })
})

