/* global define */
define(['./util'], function(_) {
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
			var instance = constructor.apply(this, arguments) || this

			// instance.options vs parameter options 
			var options = arguments[0]
			if (options && !instance.hasOwnProperty('options')) {
				instance.options = _.extend(true, {}, this.options, options)
			}

			// 如果模块带有 __x_created_with，则一切初始化行为都交给第三方；否则调用 .create() 方法。
			// If the module child has the property named as __x_created_with, the third library will be response for the rest of initialization actions.
			// If not, the module child will call the function .create().
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
})