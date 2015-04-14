
/* global define */
define(
    'brix/base',[
        'jquery', 'underscore'
    ],
    function(
        jQuery, _
    ) {
        /*
            ## Base

            Brix Component Base，Brix 组件基类，Brix Component Definition 的最简实现。
            在编写 Brix Component Implement 时，建议从继承该实现开始。
        */
        function Base() {}

        Base.prototype = {
            // 是否 Brix 组件
            isBrix: true,
            /*
                ## .init()
                初始化组件。
            */
            init: function() {},
            /*
                ## .render( [ callback( error, instance ) ] )
                渲染组件。
            */
            render: function() {},
            /*
                ## .destroy
                销毁组件。
            */
            destroy: function() {
                // 自动移除组件节点和关联节点
                // jQuery(this.element).remove()
                // jQuery(this.relatedElement || this.$relatedElement).remove()
            },
            /*
                在当前组件（关联的元素）上，为一个或多个事件类型绑定一个事件监听函数。
                在内部，Brix 上的事件方法通过调用第三方库（例如 jQuery、KISSY 等）的事件绑定方法来实现。
            */
            on: function(types, selector, data, fn) {
                jQuery(this.relatedElement || this.$relatedElement || this.element || this).on(types, selector, data, fn)
                return this
            },
            /*
                在当前组件（关联的元素）上，为一个或多个事件类型绑定一个事件监听函数，这个监听函数最多执行一次。
            */
            one: function(types, selector, data, fn) {
                jQuery(this.relatedElement || this.$relatedElement || this.element || this).one(types, selector, data, fn)
                return this
            },
            /*
                在当前组件（关联的元素）上，移除绑定的一个或多个类型的监听函数。
            */
            off: function(types, selector, fn) {
                jQuery(this.relatedElement || this.$relatedElement || this.element || this).off(types, selector, fn)
                return this
            },
            /*
                在当前组件（关联的元素）上，执行所有绑定的事件监听函数和默认行为，并模拟冒泡过程。
            */
            trigger: function(event, data) {
                // ( event, data ), ( type, data )
                event = event.type ? event : jQuery.Event(event)
                event.component = this
                jQuery(this.relatedElement || this.$relatedElement || this.element || this).trigger(event, data)
                return this
            },
            /*
                在当前组件（关联的元素）上，执行所有绑定的事件监听函数，并模拟冒泡过程，但不触发默认行为。
            */
            triggerHandler: function(event, data) {
                // ( event, data ), ( type, data )
                event = event.type ? event : jQuery.Event(event)
                event.component = this
                jQuery(this.relatedElement || this.$relatedElement || this.element || this).triggerHandler(event, data)
                return this
            }
        }

        jQuery.fn.extend({
            triggerWithComponent: function(component, event, data) {
                event = event.type ? event : jQuery.Event(event)
                event.component = component
                return this.trigger(event, data)
            },
            triggerHandlerWithComponent: function(component, event, data) {
                event = event.type ? event : jQuery.Event(event)
                event.component = component
                return this.triggerHandler(event, data)
            }
        })

        /*
            Backbone.js
            http://backbonejs.org
         */
        Base.extend = function(protoProps, staticProps) {
            var parent = this
            var child

            // The constructor function for the new subclass is either defined by you
            // (the "constructor" property in your `extend` definition), or defaulted
            // by us to simply call the parent's constructor.
            if (protoProps && _.has(protoProps, 'constructor')) {
                child = protoProps.constructor
            } else {
                child = function() {
                    return parent.apply(this, arguments)
                }

                // rename function name
                // var name = arguments.callee.caller.arguments.callee.caller.arguments[0].replace(/[^a-zA-Z]/g, '_')
                // child = new Function('doit', 'return function ' + name + '() { doit() }')(function() {
                //     return parent.apply(this, arguments)
                // })
            }

            // Add static properties to the constructor function, if supplied.
            _.extend(child, parent, staticProps)

            // Set the prototype chain to inherit from `parent`, without calling
            // `parent`'s constructor function.
            var Surrogate = function() {
                this.constructor = child
            }
            Surrogate.prototype = parent.prototype
            child.prototype = new Surrogate()

            // Add prototype properties (instance properties) to the subclass,
            // if supplied.
            if (protoProps) _.extend(child.prototype, protoProps)

            // Set a convenience property in case the parent's prototype is needed
            // later.
            child.__super__ = parent.prototype

            child.extend = Base.extend

            return child
        }

        return Base
    }
);