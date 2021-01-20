import chai from 'chai';
import setApply from '../src/engine/attributes/set.js'
const assert = chai.assert;

describe('Set Operators test', () => {
    //All Of tests
    
    it('Set AO op: equal sets should match', function () {
        assert.equal(setApply([1,2,3],[1,2,3] , 'AO'), true)
    })
    it('Set AO op: user set is superset should match', function () {
        assert.equal(setApply([1,2,3],[1,2,3,4] , 'AO'), true)
    })
    it('Set AO op: user set is subset should nots match', function () {
        assert.equal(setApply([1,2,3],[1,2] , 'AO'), false)
    })
    it('Set AO op: user set is null should not match', function () {
        assert.equal(setApply([1,2,3],[] , 'AO'), false)
    })
    
    //Any of 

    it('Set HA op: equal sets should match', function () {
        assert.equal(setApply([1,2,3,4],[1,2,3,4] , 'HA'), true)
    })  
    it('Set HA op: userset is super set should match', function () {
        assert.equal(setApply([1,2,3,4],[1,2,3,4,5] , 'HA'), true)
    })
    it('Set HA op: user set is subset should match', function () {
        assert.equal(setApply([1,2,3,4],[1,2] , 'HA'), true)
    })
    it('Set HA op: user set is subset unordered should match', function () {
        assert.equal(setApply([1,2,3,4],[3,2,1,10] , 'HA'), true)
    })
    if('Set HA op: user set is disjoint should not match', function(){
        assert.equal(setApply([1,2,3],[4,5] , 'HA'), false)        
    })
    if('Set HA op: user set is null should not match', function(){
        assert.equal(setApply([1,2,3],[] , 'HA'), false)        
    })

    //Part of
    it('Set PO op: when equal sets should match', function () {
        assert.equal(setApply([1,2,3,4],[1,2,3,4] , 'PO'), true)
    })
    it('Set PO op: when user set is superset should not match', function () {
        assert.equal(setApply([1,2,3,4],[1,2,3,4,5] , 'PO'), false)
    })
    it('Set PO op: when user set is subset should match', function () {
        assert.equal(setApply([1,2,3,4],[1,2,3] , 'PO'), true)
    })
    it('Set PO op: when user set is null should not match', function () {
        assert.equal(setApply([1,2,3,4],[] , 'PO'), false)
    })

    // Equals
    it('Set EQ op: when equal sets should match', function () {
        assert.equal(setApply([1,2,3],[1,2,3] , 'EQ'), true)
    })
    it('Set EQ op: when user set is superset should not match', function () {
        assert.equal(setApply([1,2,3,4],[1,2,3,4,5,6,7,8] , 'EQ'), false)
    })
    it('Set EQ op: when user set is subset should not match', function () {
        assert.equal(setApply([1,2,3,4],[1,2,3] , 'EQ'), false)
    })
    it('Set EQ op: when user set is empty or null should not match', function () {
        assert.equal(setApply([1,2,3],[] , 'EQ'), false)
    })

    // rest of operators
    it('Set NAO op should return true', function () {
        assert.equal(setApply([1,2,3],[1] , 'NAO'), true)
    })
   
    it('Set NHA op should return true', function () {
        assert.equal(setApply([1,2,3],[4,5,6] , 'NHA'), true)
    })
    
    it('Set NEQ op should return false', function () {
        assert.equal(setApply([1,2,3],[1,2,3] , 'NEQ'), false)
    })
    it('Set NEQ op should return true', function () {
        assert.equal(setApply([1,2,3],[1,2,3,4] , 'NEQ'), true)
    })
  
    it('Set NPO op should return true', function () {
        assert.equal(setApply([1,2,3,4],[5,6] , 'NPO'), true)
    })
})

