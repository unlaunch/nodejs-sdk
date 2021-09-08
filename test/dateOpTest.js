const chai = require('chai')
const dateOrDateTimeApply = require('../src/engine/attributes/datetime.js')
const assert = chai.assert;

const ONE_DAY = 24 * 60 * 60 * 1000;

describe('Date Operators test', () => {

    let currentDate = new Date();

    it('date op: equal userValue = value should match', function () {
        assert.equal(dateOrDateTimeApply(currentDate.getTime(), currentDate,"EQ", true), true)
    })
    it('date op: equal userValue = value should match', function () {
        assert.equal(dateOrDateTimeApply(currentDate.getTime(), currentDate.getTime(),"EQ", true), true)
    })

    let valueDate = new Date();
    valueDate.setDate(15);
    valueDate.setHours(2);
    let userDate = new Date();
    userDate.setDate(15);
    userDate.setHours(15);
    it('date op: equal userDate = valueDate should match', function () {
        assert.equal(dateOrDateTimeApply(valueDate.getTime(), userDate,"EQ", true), true)
    })

    it('date op: greater than userDate > valueDate should match', function () {
        assert.equal(dateOrDateTimeApply(currentDate.getTime(), currentDate.getTime() + ONE_DAY,"GT",true), true)
    })
    it('date op: greater than date should not match', function () {
        assert.equal(dateOrDateTimeApply(currentDate.getTime(), currentDate,"GT", true), false)
    })
    it('date op: less than userDate < valueDate should match', function () {
        assert.equal(dateOrDateTimeApply(currentDate.getTime(), currentDate - ONE_DAY,"LT", true), true)
    })
    it('date op: less than userDate = valueDate should not match', function () {
        assert.equal(dateOrDateTimeApply(currentDate.getTime(), currentDate,"LT", true), false)
    })
    it('date op: greater than equal userDate = valueDate should match', function () {
        assert.equal(dateOrDateTimeApply(currentDate.getTime(), currentDate,"GTE", true), true)
    })
    it('date op: less than equal userDate < valueDate should match', function () {
        assert.equal(dateOrDateTimeApply(currentDate.getTime(), currentDate - ONE_DAY,"LTE", true), true)
    })
    it('date op: less than equal userDate = valueDate should match', function () {
        assert.equal(dateOrDateTimeApply(currentDate.getTime(), currentDate.getTime(),"LTE", true), true)
    })
})
