import chai from 'chai';
import dateOrDateTimeApply from '../src/engine/attributes/datetime.js'
const assert = chai.assert;
// Flag always contain datetime in Java milliseconds since epoch
const flagDateTime = "1232071462000" // Aug 16, 2009
const time0 = "1250298753000" // August 15, 2009 1:12:33 AM
const time1 = "1250299113000" // August 15, 2009 1:18:33 AM 
const time2 = "1250299533000" // August 15, 2009 1:25:33 AM
describe('Datetime Operators test', () => {
    it('datetime op: equaldatetime should match', function () {
        assert.equal(dateOrDateTimeApply(time1, time1,"EQ", false), true)
    })
    it('datetime op: equal datetime should match', function () {
        assert.equal(dateOrDateTimeApply(time1, time1,"EQ", false), true)
    })
    it('datetime op: greater than datetime should match', function () {
        assert.equal(dateOrDateTimeApply(time1, time2,"GT",false), true)
    })
    it('datetime op: greater than datetime should not match', function () {
        assert.equal(dateOrDateTimeApply(time1, time0,"GT", false), false)
    })
    it('datetime op: less than datetime should match', function () {
        assert.equal(dateOrDateTimeApply(time1, time0,"LT", false), true)
    })
    it('datetime op: less than datetime should not match', function () {
        assert.equal(dateOrDateTimeApply(time1,time2,"LT", false), false)
    })
    it('datetime op: greater than equal datetime should match', function () {
        assert.equal(dateOrDateTimeApply(time1, Math.floor(new Date().getTime() / 1000) * 1000,"GTE", false), true)
    })
    it('datetime op: less than equal datetime should match', function () {
        assert.equal(dateOrDateTimeApply(time1, time1,"LTE", false), true)
    })
    it('datetime op: less than equal datetime should match', function () {
        assert.equal(dateOrDateTimeApply(time1, time0,"LTE", false), true)
    })

})
