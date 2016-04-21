define("brix/base/util",[],function(){var t={},e=Object.prototype.toString;return t.each=function(t,e,n){if(null===t||void 0===t)return t;if(t.forEach)t.forEach(e,n);else if(t.length===+t.length)for(var r=0,i=t.length;i>r;r++)e.call(n,t[r],r,t);else for(var o in t)e.call(n,t[o],o,t);return t},t.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(n){t["is"+n]=function(t){return e.call(t)=="[object "+n+"]"}}),t.extend=function(){var e,n,r,i,o,s=arguments[0],a=1,u=arguments.length,l=!1;for("boolean"==typeof s&&(l=s,s=arguments[a]||{},a++),"object"!=typeof s&&"function"!=typeof s&&(s={}),1===u&&(s=this,a=0);u>a;a++)if(e=arguments[a])for(n in e)r=s[n],i=e[n],s!==i&&void 0!==i&&(l&&(t.isArray(i)||t.isObject(i))?(t.isArray(i)&&(o=r&&t.isArray(r)?r:[]),t.isObject(i)&&(o=r&&t.isObject(r)?r:{}),s[n]=t.extend(l,o,i)):s[n]=i);return s},t}),define("brix/base/extend",["./util"],function(t){function e(n,r){var i=this,o=n&&n.hasOwnProperty("constructor")?n.constructor:i,s=function(){var e=o.apply(this,arguments)||this,n=arguments[0];return n&&!e.hasOwnProperty("options")&&(e.options=t.extend(!0,{},this.options,n)),!s.__x_created_with&&e.created&&e.created.apply(e,e.created.length?[e.options]:[]),e};t.extend(s,i,r);var a=function(){this.constructor=o};return a.prototype=i.prototype,s.prototype=new a,n&&t.extend(s.prototype,n),s.__super__=i.prototype,s.extend=e,s}return e}),define("brix/base",["./base/extend","jquery"],function(t,e){function n(){}return n.prototype={isBrix:!0,init:function(){},render:function(){},destroy:function(){},on:function(t,n,r,i){return e(this.relatedElement||this.$relatedElement||this.element||this).on(t,n,r,i),this},one:function(t,n,r,i){return e(this.relatedElement||this.$relatedElement||this.element||this).one(t,n,r,i),this},off:function(t,n,r){return e(this.relatedElement||this.$relatedElement||this.element||this).off(t,n,r),this},trigger:function(t,n){return t=t.type?t:e.Event(t),t.component=this,e(this.relatedElement||this.$relatedElement||this.element||this).trigger(t,n),this},triggerHandler:function(t,n){return t=t.type?t:e.Event(t),t.component=this,e(this.relatedElement||this.$relatedElement||this.element||this).triggerHandler(t,n),this}},n.extend=t,n});