/* global define */
/*
    Brix Base Utility Functions
    
    http://underscorejs.org/
*/
define(function() {
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
})