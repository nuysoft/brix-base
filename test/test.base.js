/* global require, define */
/* global describe, before, it, chai */
/* jshint multistr: true */
describe('Brix Base', function() {

    this.timeout(60 * 1000)

    var expect = chai.expect
    var $, Loader, $container

    before(function(done) {
        require(['jquery', 'brix/loader'], function() {
            $ = arguments[0]
            Loader = arguments[1]
            $container = $('#container')
            done()
        })
    })

    define('test/impl1', ['brix/base'], function(Base) {
        return Base.extend({
            foo: Math.random(),
            options: {
                name: 'Impl1'
            },
            constructor: function( /*options*/ ) {
                console.log(this.options.name, 'constructor()')
                    // this.render()
            },
            created: function( /*options*/ ) {
                console.log(this.options.name, 'created()')
                this.init()
                this.render()
            },
            init: function() {
                console.log(this.options.name, 'init()')
            },
            render: function() {
                console.log(this.options.name, 'render()')
                $(this.element).html(this.moduleId)
                expect(this.options.name).to.equal('Impl1')
            }
        })
    })
    define('test/impl1/impl2', ['test/impl1'], function(Impl1) {
        return Impl1.extend({
            bar: Math.random(),
            options: {
                name: 'Impl2'
            },
            constructor: function( /*options*/ ) {
                console.log(this.options.name, 'constructor()')
                    // this.render()
            },
            init: function() {
                console.log(this.options.name, 'init()')
            },
            created: function( /*options*/ ) {
                console.log(this.options.name, 'created()')
                this.init()
                this.render()
            },
            render: function() {
                console.log(this.options.name, 'render()')
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
                console.log(this.options.name, 'constructor()')
                    // this.render()
            },
            created: function( /*options*/ ) {
                console.log(this.options.name, 'created()')
                    // this.render()
            },
            init: function() {
                console.log(this.options.name, 'init()')
            },
            render: function() {
                console.log(this.options.name, 'render()')
                expect(this.options.name).to.equal('Impl3')
                expect(this.foo).to.be.equal(Impl1.prototype.foo)
                expect(this.bar).to.be.equal(Impl2.prototype.bar)
            }
        })
    })

    function glog(task) {
        return function(done) {
            var test = this.test
            console.log('>>> ' + test.title) // 不用 console.group，因为在 phantomjs 无法显示。
            task(function() {
                console.log('<<< ' + test.title)
                done()
            })
        }
    }


    it('Brix Base + Brix Loader', glog(function(done) {
        require(['test/impl1'], function(Impl) {
            $container.html(
                '<div bx-name="test/impl1"></div>' +
                '<div bx-name="test/impl1/impl2"></div>' +
                '<div bx-name="test/impl1/impl2/impl3"></div>'
            )
            Loader.boot($container, function( /*records*/ ) {
                var inst = Loader.query('test/impl1')[0]
                expect(inst.options.name).to.be.equal('Impl1')
                expect(inst.foo).to.equal(Impl.prototype.foo)
                Loader.destroy($container, function() {
                    done()
                })
            })
        })
    }))

    it('Brix Base + new Modeule( options )', glog(function(done) {
        require(['test/impl1', 'test/impl1/impl2', 'test/impl1/impl2/impl3'], function(Impl1, Impl2, Impl3) {
            var inst1 = new Impl1({
                path: 'Base => Impl1'
            })
            var inst2 = new Impl2({
                path: 'Base => Impl1 => Impl2'
            })
            var inst3 = new Impl3({
                path: 'Base => Impl1 => Impl2 => Impl3'
            })
            expect(inst1.options.name).to.be.equal('Impl1')
            expect(inst1.foo).to.equal(Impl1.prototype.foo)
            expect(inst2.options.name).to.be.equal('Impl2')
            expect(inst2.foo).to.equal(Impl1.prototype.foo)
            expect(inst3.options.name).to.be.equal('Impl3')
            expect(inst3.foo).to.equal(Impl1.prototype.foo)
            done()
        })
    }))

    // it('Custom + Brix Loader', function(done) {
    //     done()
    // })

    // it('Custom + new', function(done) {
    //     done()
    // })
})