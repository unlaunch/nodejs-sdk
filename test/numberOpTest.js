import chai from 'chai';
import numberApply from '../src/engine/attributes/number.js'
const assert = chai.assert;

describe('Number Operators test', () => {
    it('Number EQ op should return true', function () {
        assert.equal(numberApply("123", 123, 'EQ'), true)
    })
    it('Number EQ op should return true', function () {
        assert.equal(numberApply(12.3, 12.30, 'EQ'), true)
    })
    it('Number NEQ op should return true', function () {
        assert.equal(numberApply(123, 222, 'NEQ'), true)    
    })
    it('Number GT op should return true', function () {
        assert.equal(numberApply(123, 445, 'GT'), true)
    })
    it('Number GTE op should return true', function () {
        assert.equal(numberApply("123",123 , 'GTE'), true)
    })
    it('Number LT op should return false', function () {
        assert.equal(numberApply(123, 222, 'LT'), false)
    })
    it('Number LT op should return false', function () {
        assert.equal(numberApply(123, 11, 'LT'), true)
    })
    it('Number LTE should return true', function () {
        assert.equal(numberApply(123, 11, 'LTE'), true)
    })
})

