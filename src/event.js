/* global define */
/* global setTimeout */

define(
    [
        'loader', 'jquery', 'underscore'
    ],
    function(
        Loader, jQuery, _
    ) {
        /*
            _.extend(Brix.prototype, Event)
        */
        var Util = Loader.Util
        var Constant = Loader.Constant

        return {
            /*
                在当前组件（关联的元素）上，代理 bx-type 风格的事件监听函数。
                TODO 只处理关联元素上的事件，不处理内部的事件！
            */
            delegateBxTypeEvents: function(element) {
                if (!element) element = this.relatedElement || this.element
                delegateBxTypeEvents(this, element, false)
                delegateBxTypeEvents(this, element, true)
                return this
            },
            /*
                在当前组件（关联的元素）上，移除 bx-type 风格的事件监听函数。
            */
            undelegateBxTypeEvents: function() {
                undelegateBxTypeEvents(this)
                return this
            },
            /*
                在当前组件（关联的元素）上，为一个或多个事件类型绑定一个事件监听函数。
                在内部，Brix 上的事件方法通过调用第三方库（例如 jQuery、KISSY 等）的事件绑定方法来实现。
            */
            on: function(types, selector, data, fn) {
                jQuery(this.relatedElement || this.element).on(types, selector, data, fn)
                return this
            },
            /*
                在当前组件（关联的元素）上，为一个或多个事件类型绑定一个事件监听函数，这个监听函数最多执行一次。
            */
            one: function(types, selector, data, fn) {
                jQuery(this.relatedElement || this.element).one(types, selector, data, fn)
                return this
            },
            /*
                在当前组件（关联的元素）上，移除绑定的一个或多个类型的监听函数。
            */
            off: function(types, selector, fn) {
                jQuery(this.relatedElement || this.element).off(types, selector, fn)
                return this
            },
            /*
                在当前组件（关联的元素）上，执行所有绑定的事件监听函数和默认行为，并模拟冒泡过程。
            */
            trigger: function(type, data) {
                jQuery(this.relatedElement || this.element).trigger(type, data)
                return this
            },
            /*
                在当前组件（关联的元素）上，执行所有绑定的事件监听函数，并模拟冒泡过程，但不触发默认行为。
            */
            triggerHandler: function(type, data) {
                jQuery(this.relatedElement || this.element).triggerHandler(type, data)
                return this
            }
        }

        function delegateBxTypeEvents(instance, element, deep) {
            var types = parseBxTypes(element, deep)
            _.each(types, function(type /*, index*/ ) {
                var name = Constant.PREFIX + type // 'bx-' + type
                var selector = '[' + name + ']'

                if (deep) {
                    jQuery(element)
                        .off(type, selector)
                        .off(type + Constant.COMPONENT_NAMESPACE, selector)
                        .on(type, selector, appetizer)
                        .on(type + Constant.COMPONENT_NAMESPACE, selector, entrees)
                } else {
                    jQuery(element)
                        .off(type, appetizer)
                        .off(type + Constant.COMPONENT_NAMESPACE, entrees)
                        .on(type, appetizer)
                        .on(type + Constant.COMPONENT_NAMESPACE, entrees)
                }

                // 开胃菜
                function appetizer(event) {
                    if (jQuery(event.target).closest('.disabled').length) return
                    event.preventDefault()
                    // 平行的事件，只触发一次
                    if (!event.originalEvent._triggered) {
                        event.originalEvent._triggered = true
                        setTimeout(function() {
                            jQuery(event.target).trigger(
                                event.type + Constant.COMPONENT_NAMESPACE,
                                event
                            )
                        }, 0)
                    }
                }

                // 主菜
                function entrees(event, extra) { // extraParameters
                    // TODO 检测命名空间 event.namespace_re.test
                    if (extra) {
                        event._triggered = true
                        // 依然使用原来的事件对象。
                        // 因为手动触发的事件会缺少很多属性，例如 jQuery.event.keyHooks/mouseHooks.props，以及更重要的 originalEvent。
                        extra.currentTarget = event.currentTarget

                        var handler = jQuery(event.currentTarget).attr(name)
                            // console.log(event.type, handler, event.delegateTarget)
                        var parts = parseFnAndParams(handler)
                        if (parts) {
                            if (parts.fn in instance) {
                                instance[parts.fn].apply(
                                    instance, [extra].concat(parts.params)
                                )
                            } else {
                                /* jshint evil:true */
                                eval(handler)
                            }
                        }
                        event.preventDefault()
                        event.stopPropagation()

                    }
                }

            })
        }

        function undelegateBxTypeEvents(instance, deep) {
            var types = parseBxTypes(instance.element, deep)
            _.each(types, function(type /*, index*/ ) {
                var name = Constant.PREFIX + type
                var selector = '[' + name + ']'
                if (deep) jQuery(instance.element).off(type + Constant.COMPONENT_NAMESPACE, selector)
                else jQuery(instance.element).off(type + Constant.COMPONENT_NAMESPACE)
            })
        }

        /**
         * 解析 bx-type 风格的事件配置
         * @param  {element} 一个 DOM 元素
         * @param  {boolean} 是否进行深度查找
         * @return {array}
         *      [
         *        {
         *          target:
         *          type:
         *          handler:
         *          fn:
         *          params:
         *        },
         *      ]
         */
        function parseBxEvents(element, deep) {
            // 数组 or 伪数组
            if (!element.nodeType && element.length) element = element[0]
            var elements = deep ? element.getElementsByTagName('*') : [element]
            var events = []
            Util.each(elements, function(item /*, index*/ ) {
                Util.each(item.attributes, function(attribute) {
                    Constant.RE_EVENT.exec('') // reset lastIndex to 0
                    var ma = Constant.RE_EVENT.exec(attribute.name)
                    if (!ma) return
                    var handleObj = {
                        target: item,
                        type: ma[1],
                        handler: attribute.value
                    }
                    Util.extend(handleObj, parseFnAndParams(attribute.value))
                    events.push(handleObj)
                })
            })
            return events
        }

        /**
         * 解析 bx-type 风格的事件类型
         * @param  {element} 一个 DOM 元素
         * @param  {boolean} 是否进行深度查找
         * @return {array}
         *      [ 'click', 'change', ... ]
         */
        function parseBxTypes(element, deep) {
            return Util.unique(
                Util.map(
                    // [ { target type handler fn params }, ... ]
                    parseBxEvents(element, deep),
                    function(item) {
                        return item.type
                    }
                )
            )
        }

        /**
         * 解析函数名称和参数值
         * @param  {string} 表达式。
         * @return {object}
         *      {
         *          fn:
         *          params:
         *      }
         */
        function parseFnAndParams(handler) {
            var parts = Constant.FN_ARGS.exec(handler)
            var fn
            var params
            if (parts && parts[1]) {
                fn = parts[1]
                params = parts[2] || ''
                try {
                    // 1. 尝试保持参数的类型 
                    /* jshint -W061 */
                    params = eval('(function(){ return [].splice.call(arguments, 0 ) })(' + params + ')')
                } catch (error) {
                    // 2. 如果失败，只能解析为字符串
                    params = parts[2].split(/,\s*/)
                }
                return {
                    fn: fn,
                    params: params
                }
            }
            return {}
        }

    }
)