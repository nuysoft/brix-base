/* global require */
/* global describe, before, it, chai */
/* jshint multistr: true */
describe('Brix Base', function() {

    this.timeout(60 * 1000)

    var expect = chai.expect
    var Base

    before(function(done) {
        require(['brix/base'], function(B) {
            Base = B
            done()
        })
    })

    it('Util.isXxx', function(done) {
        var Util = require('brix/base/util')
        expect(Util.isBoolean(true)).to.equal(true)
        expect(Util.isObject({})).to.equal(true)
        done()
    })

})