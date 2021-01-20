import chai from 'chai';
import dateOrDateTimeApply from '../src/engine/attributes/datetime.js'
const assert = chai.assert;
// Flag always contain datetime in Java milliseconds since epoch
const flagDateTime = "1232071462000" // Aug 16, 2009
const dateAug152009 = "1250298753000" // August 15, 2009 1:25:33 AM
const dateAug162009 = "1250423999000" // Aug 16, 2009
const dateAug172009 = "1250472333000" // August 17, 2009 1:25:33 AM

describe('Date Operators test', () => {
    it('date op: equal dates should match', function () {
        assert.equal(dateOrDateTimeApply(dateAug162009, dateAug162009,"EQ", true), true)
    })
    it('date op: equal dates should match', function () {
        assert.equal(dateOrDateTimeApply(dateAug162009, dateAug162009,"EQ", true), true)
    })
    it('date op: greater than date should match', function () {
        assert.equal(dateOrDateTimeApply(dateAug162009, dateAug172009,"GT",true), true)
    })
    it('date op: greater than date should not match', function () {
        assert.equal(dateOrDateTimeApply(dateAug162009, dateAug152009,"GT", true), false)
    })
    it('date op: less than dates should match', function () {
        assert.equal(dateOrDateTimeApply(dateAug162009, dateAug152009,"LT", true), true)
    })
    it('date op: less than dates should not match', function () {
        assert.equal(dateOrDateTimeApply(dateAug162009, dateAug172009,"LT", true), false)
    })
    it('date op: greater than equal dates should match', function () {
        assert.equal(dateOrDateTimeApply(dateAug162009, Math.floor(new Date().getTime() / 1000) * 1000,"GTE", true), true)
    })
    it('date op: less than equal dates should match', function () {
        assert.equal(dateOrDateTimeApply(dateAug162009, dateAug162009,"LTE", true), true)
    })
    it('date op: less than equal dates should match', function () {
        assert.equal(dateOrDateTimeApply(dateAug162009, dateAug152009,"LTE", true), true)
    })

})
