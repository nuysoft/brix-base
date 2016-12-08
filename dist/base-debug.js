
/* global define */
/*
    Brix Base Utility Functions
    
    http://underscorejs.org/
*/
define('brix/base/util',[],function() {
    var _ = {}

    var toString = Object.prototype.toString

    _.each = function(obj, iterator, context) {
        if (obj === null || obj === undefined) return obj
        if (obj.forEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, length = obj.length; i < length; i++) {
                iterator.call(context, obj[i], i, obj)
            }
        } else {
            for (var prop in obj) {
                iterator.call(context, obj[prop], prop, obj)
            }
        }
        return obj
    }

    _.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function(name) {
        _['is' + name] = function(obj) {
            return toString.call(obj) == '[object ' + name + ']'
        }
    })

    _.extend = function() {
        var target = arguments[0]
        var index = 1
        var length = arguments.length
        var deep = false
        var options, name, src, copy, clone

        if (typeof target === "boolean") {
            deep = target
            target = arguments[index] || {}
            index++
        }

        if (typeof target !== "object" && typeof target !== "function") {
            target = {}
        }

        if (length === 1) {
            target = this
            index = 0
        }

        for (; index < length; index++) {
            options = arguments[index]
            if (!options) continue

            for (name in options) {
                src = target[name]
                copy = options[name]

                if (target === copy) continue
                if (copy === undefined) continue

                if (deep && (_.isArray(copy) || _.isObject(copy))) {
                    if (_.isArray(copy)) clone = src && _.isArray(src) ? src : []
                    if (_.isObject(copy)) clone = src && _.isObject(src) ? src : {}

                    target[name] = _.extend(deep, clone, copy)
                } else {
                    target[name] = copy
                }
            }
        }

        return target
    }

    return _
});
/* global define */
define('brix/base/extend',['./util'], function(_) {
	/*
	    This function is loosely inspired by Backbone.js.
	    http://backbonejs.org
	 */
	function extend(protoProps, staticProps) {
		var parent = this

		// 构造函数 Initialize constructor
		var constructor = protoProps && protoProps.hasOwnProperty('constructor') ?
			protoProps.constructor : // 自定义构造函数 Custom constructor
			parent // 父类构造函数 Base constructor

		// 子类 Subclass
		var child = function() {
			constructor.__x_created_with = child.__x_created_with
			var instance = constructor.apply(this, arguments) || this

			// instance.options vs parameter options 
			var options = arguments[0]
			if (options && !instance.hasOwnProperty('options')) {
				instance.options = _.extend(true, {}, this.options, options)
			}

			// 如果模块带有 __x_created_with，则一切初始化行为都交给第三方；否则调用 .create() 方法。
			// If the child module has a property named as __x_created_with, the third-library will be response for the rest of initialization actions.
			// If not, the child module will call the `.create()`.
			if (!child.__x_created_with && instance.created) {
				instance.created.apply(instance, instance.created.length ? [instance.options] : [])
			}

			return instance
		}

		// 静态属性 Static properties
		_.extend(child, parent, staticProps)

		// 原型链 Build prototype chain.
		var Surrogate = function() {
			this.constructor = constructor
		}
		Surrogate.prototype = parent.prototype
		child.prototype = new Surrogate()

		// 原型属性 Copy prototype properties from the parameter protoProps to the prototype of child
		if (protoProps) _.extend(child.prototype, protoProps)

		// Add keyword __super__
		child.__super__ = parent.prototype

		child.extend = extend

		return child
	}

	return extend
});
/* global define */
define(
    'brix/base',[
        './base/extend',
        'jquery'
    ],
    function(
        extend,
        jQuery
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
                ## .constructor()
                自定义构造函数
             */
            /*    
                ## .created()
                通过关键字 new 创建实例后，该方法被调用，内部自动调用 `.init()` 和 `.render()`。
                如果通过 Brix Loader 加载，则不会调用该方法。
             */
            created: function() {
                if (this.init) this.init()
                if (this.render) this.render()
            },
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

        Base.extend = extend

        return Base
    }
);