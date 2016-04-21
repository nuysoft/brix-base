/* global $, require, define */
/* global describe, before, it, chai */
/* jshint multistr: true */
describe('Brix Base', function() {

    this.timeout(60 * 1000)

    var expect = chai.expect
    var $, Loader, Base, $container
    var Impl1, Impl2, Impl3

    define('test/impl1', [], function() {
        return Base.extend({
            foo: Math.random(),
            options: {
                name: 'Impl1'
            },
            constructor: function( /*options*/ ) {
                this.render()
            },
            created: function( /*options*/ ) {
                this.render()
            },
            render: function() {
                $(this.element).html(this.moduleId)
                expect(this.options.name).to.equal('Impl1')
            }
        })
    })
    define('test/impl1/impl2' ['test/impl1'], function(Impl1) {
        return Impl1.extend({
            bar: Math.random(),
            options: {
                name: 'Impl2'
            },
            constructor: function( /*options*/ ) {
                // this.render()
            },
            created: function( /*options*/ ) {
                this.render()
            },
            render: function() {
                expect(this.options.name).to.equal('Impl2')
                expect(this.foo).to.be.equal(Impl1.prototype.foo)
            }
        })
    })
    define('test/impl1/impl2/impl3', ['test/impl1', 'test/impl1/impl2'], function(Impl1, Impl2) {
        return Impl2.extend({
            faz: Math.random(),
            options: {
                name: 'Impl3'
            },
            constructor: function( /*options*/ ) {
                // this.render()
            },
            created: function( /*options*/ ) {
                this.render()
            },
            render: function() {
                $()
                expect(this.options.name).to.equal('Impl3')
                expect(this.foo).to.be.equal(Impl1.prototype.foo)
                expect(this.bar).to.be.equal(Impl2.prototype.bar)
            }
        })
    })

    before(function(done) {
        require(['jquery', 'brix/loader', 'brix/base'], function() {
            $ = arguments[0]
            Loader = arguments[1]
            Base = arguments[2]
            $container = $('#container')
            done()
        })
    })


    it('Brix Base + Brix Loader', function(done) {
        require(['test/impl1'], function(Impl) {
            $container.html('<div bx-name="test/impl1"></div>')
            Loader.boot($container, function(records) {
                var inst = Loader.query('test/impl1')[0]
                expect(inst.options.name).to.be.equal('Impl1')
                expect(inst.foo).to.equal(Impl.prototype.foo)
                Loader.destroy($container, function() {
                    done()
                })
            })
        })
    })

    // it('Brix Base + new', function(done) {
    //     require(['test/impl1'], function(Impl) {
    //         var inst = new Impl({
    //             path: 'Base => Impl1'
    //         })
    //         expect(inst.options.name).to.be.equal('Impl1')
    //         expect(inst.foo).to.equal(Impl.prototype.foo)
    //         done()
    //     })
    // })

    // it('Custom + Brix Loader', function(done) {
    //     done()
    // })

    // it('Custom + new', function(done) {
    //     done()
    // })
})