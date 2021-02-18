import chai from 'chai';
import dateOrDateTimeApply from '../src/engine/attributes/datetime.js'
const assert = chai.assert;

describe('Datetime Operators test', () => {

    let currentTime = new Date();

    it('datetime op: equal userValue = value should match', function () {
        assert.equal(dateOrDateTimeApply(currentTime.getTime(), currentTime,"EQ", false), true)
    })
    it('datetime op: equal userValue = value should match', function () {
        assert.equal(dateOrDateTimeApply(currentTime.getTime(), currentTime.getTime(),"EQ", false), true)
    })
    it('datetime op: userValue > value should match', function () {
        assert.equal(dateOrDateTimeApply(currentTime.getTime(), currentTime.getTime() + 1000,"GT",false), true)
    })
    it('datetime op: greater than userValue = value should not match', function () {
        assert.equal(dateOrDateTimeApply(currentTime.getTime(), currentTime,"GT", false), false)
    })
    it('datetime op: less than userValue < value should match', function () {
        assert.equal(dateOrDateTimeApply(currentTime.getTime(), currentTime.getTime() - 1000,"LT", false), true)
    })
    it('datetime op: less than userValue = value should not match', function () {
        assert.equal(dateOrDateTimeApply(currentTime.getTime(), currentTime,"LT", false), false)
    })
    it('datetime op: greater than userValue > value datetime should match', function () {
        assert.equal(dateOrDateTimeApply(currentTime.getTime(), currentTime.getTime() + 1000,"GTE", false), true)
    })
    it('datetime op: greater than equal userValue = value should match', function () {
        assert.equal(dateOrDateTimeApply(currentTime.getTime(), currentTime,"GTE", false), true)
    })
    it('datetime op: less than equal userValue < value should match', function () {
        assert.equal(dateOrDateTimeApply(currentTime.getTime(), currentTime.getTime() - 1000,"LTE", false), true)
    })
    it('datetime op: less than equal userValue = value should match', function () {
        assert.equal(dateOrDateTimeApply(currentTime.getTime(), currentTime,"LTE", false), true)
    })
})
