var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/.pnpm/react@19.2.4/node_modules/react/cjs/react.production.js
var require_react_production = __commonJS({
  "../../node_modules/.pnpm/react@19.2.4/node_modules/react/cjs/react.production.js"(exports2) {
    "use strict";
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
    var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
    var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
    var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
    var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
    var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
    var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var ReactNoopUpdateQueue = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function() {
      },
      enqueueReplaceState: function() {
      },
      enqueueSetState: function() {
      }
    };
    var assign = Object.assign;
    var emptyObject = {};
    function Component(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    Component.prototype.isReactComponent = {};
    Component.prototype.setState = function(partialState, callback) {
      if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables."
        );
      this.updater.enqueueSetState(this, partialState, callback, "setState");
    };
    Component.prototype.forceUpdate = function(callback) {
      this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
    };
    function ComponentDummy() {
    }
    ComponentDummy.prototype = Component.prototype;
    function PureComponent(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    pureComponentPrototype.constructor = PureComponent;
    assign(pureComponentPrototype, Component.prototype);
    pureComponentPrototype.isPureReactComponent = true;
    var isArrayImpl = Array.isArray;
    function noop() {
    }
    var ReactSharedInternals = { H: null, A: null, T: null, S: null };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function ReactElement(type, key, props) {
      var refProp = props.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== refProp ? refProp : null,
        props
      };
    }
    function cloneAndReplaceKey(oldElement, newKey) {
      return ReactElement(oldElement.type, newKey, oldElement.props);
    }
    function isValidElement(object) {
      return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function escape(key) {
      var escaperLookup = { "=": "=0", ":": "=2" };
      return "$" + key.replace(/[=:]/g, function(match) {
        return escaperLookup[match];
      });
    }
    var userProvidedKeyEscapeRegex = /\/+/g;
    function getElementKey(element, index) {
      return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
    }
    function resolveThenable(thenable) {
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
        default:
          switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
            function(fulfilledValue) {
              "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
            },
            function(error) {
              "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
            }
          )), thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
      }
      throw thenable;
    }
    function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
      var type = typeof children;
      if ("undefined" === type || "boolean" === type) children = null;
      var invokeCallback = false;
      if (null === children) invokeCallback = true;
      else
        switch (type) {
          case "bigint":
          case "string":
          case "number":
            invokeCallback = true;
            break;
          case "object":
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
                break;
              case REACT_LAZY_TYPE:
                return invokeCallback = children._init, mapIntoArray(
                  invokeCallback(children._payload),
                  array,
                  escapedPrefix,
                  nameSoFar,
                  callback
                );
            }
        }
      if (invokeCallback)
        return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
          return c;
        })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
          callback,
          escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
            userProvidedKeyEscapeRegex,
            "$&/"
          ) + "/") + invokeCallback
        )), array.push(callback)), 1;
      invokeCallback = 0;
      var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
      if (isArrayImpl(children))
        for (var i = 0; i < children.length; i++)
          nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if (i = getIteratorFn(children), "function" === typeof i)
        for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
          nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if ("object" === type) {
        if ("function" === typeof children.then)
          return mapIntoArray(
            resolveThenable(children),
            array,
            escapedPrefix,
            nameSoFar,
            callback
          );
        array = String(children);
        throw Error(
          "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
        );
      }
      return invokeCallback;
    }
    function mapChildren(children, func, context) {
      if (null == children) return children;
      var result = [], count = 0;
      mapIntoArray(children, result, "", "", function(child) {
        return func.call(context, child, count++);
      });
      return result;
    }
    function lazyInitializer(payload) {
      if (-1 === payload._status) {
        var ctor = payload._result;
        ctor = ctor();
        ctor.then(
          function(moduleObject) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 1, payload._result = moduleObject;
          },
          function(error) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 2, payload._result = error;
          }
        );
        -1 === payload._status && (payload._status = 0, payload._result = ctor);
      }
      if (1 === payload._status) return payload._result.default;
      throw payload._result;
    }
    var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
      if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var event = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
          error
        });
        if (!window.dispatchEvent(event)) return;
      } else if ("object" === typeof process && "function" === typeof process.emit) {
        process.emit("uncaughtException", error);
        return;
      }
      console.error(error);
    };
    var Children = {
      map: mapChildren,
      forEach: function(children, forEachFunc, forEachContext) {
        mapChildren(
          children,
          function() {
            forEachFunc.apply(this, arguments);
          },
          forEachContext
        );
      },
      count: function(children) {
        var n = 0;
        mapChildren(children, function() {
          n++;
        });
        return n;
      },
      toArray: function(children) {
        return mapChildren(children, function(child) {
          return child;
        }) || [];
      },
      only: function(children) {
        if (!isValidElement(children))
          throw Error(
            "React.Children.only expected to receive a single React element child."
          );
        return children;
      }
    };
    exports2.Activity = REACT_ACTIVITY_TYPE;
    exports2.Children = Children;
    exports2.Component = Component;
    exports2.Fragment = REACT_FRAGMENT_TYPE;
    exports2.Profiler = REACT_PROFILER_TYPE;
    exports2.PureComponent = PureComponent;
    exports2.StrictMode = REACT_STRICT_MODE_TYPE;
    exports2.Suspense = REACT_SUSPENSE_TYPE;
    exports2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
    exports2.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(size) {
        return ReactSharedInternals.H.useMemoCache(size);
      }
    };
    exports2.cache = function(fn) {
      return function() {
        return fn.apply(null, arguments);
      };
    };
    exports2.cacheSignal = function() {
      return null;
    };
    exports2.cloneElement = function(element, config, children) {
      if (null === element || void 0 === element)
        throw Error(
          "The argument must be a React element, but you passed " + element + "."
        );
      var props = assign({}, element.props), key = element.key;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
      var propName = arguments.length - 2;
      if (1 === propName) props.children = children;
      else if (1 < propName) {
        for (var childArray = Array(propName), i = 0; i < propName; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      return ReactElement(element.type, key, props);
    };
    exports2.createContext = function(defaultValue) {
      defaultValue = {
        $$typeof: REACT_CONTEXT_TYPE,
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      };
      defaultValue.Provider = defaultValue;
      defaultValue.Consumer = {
        $$typeof: REACT_CONSUMER_TYPE,
        _context: defaultValue
      };
      return defaultValue;
    };
    exports2.createElement = function(type, config, children) {
      var propName, props = {}, key = null;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
      var childrenLength = arguments.length - 2;
      if (1 === childrenLength) props.children = children;
      else if (1 < childrenLength) {
        for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      if (type && type.defaultProps)
        for (propName in childrenLength = type.defaultProps, childrenLength)
          void 0 === props[propName] && (props[propName] = childrenLength[propName]);
      return ReactElement(type, key, props);
    };
    exports2.createRef = function() {
      return { current: null };
    };
    exports2.forwardRef = function(render) {
      return { $$typeof: REACT_FORWARD_REF_TYPE, render };
    };
    exports2.isValidElement = isValidElement;
    exports2.lazy = function(ctor) {
      return {
        $$typeof: REACT_LAZY_TYPE,
        _payload: { _status: -1, _result: ctor },
        _init: lazyInitializer
      };
    };
    exports2.memo = function(type, compare) {
      return {
        $$typeof: REACT_MEMO_TYPE,
        type,
        compare: void 0 === compare ? null : compare
      };
    };
    exports2.startTransition = function(scope) {
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      ReactSharedInternals.T = currentTransition;
      try {
        var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
      } catch (error) {
        reportGlobalError(error);
      } finally {
        null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
      }
    };
    exports2.unstable_useCacheRefresh = function() {
      return ReactSharedInternals.H.useCacheRefresh();
    };
    exports2.use = function(usable) {
      return ReactSharedInternals.H.use(usable);
    };
    exports2.useActionState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useActionState(action, initialState, permalink);
    };
    exports2.useCallback = function(callback, deps) {
      return ReactSharedInternals.H.useCallback(callback, deps);
    };
    exports2.useContext = function(Context) {
      return ReactSharedInternals.H.useContext(Context);
    };
    exports2.useDebugValue = function() {
    };
    exports2.useDeferredValue = function(value, initialValue) {
      return ReactSharedInternals.H.useDeferredValue(value, initialValue);
    };
    exports2.useEffect = function(create, deps) {
      return ReactSharedInternals.H.useEffect(create, deps);
    };
    exports2.useEffectEvent = function(callback) {
      return ReactSharedInternals.H.useEffectEvent(callback);
    };
    exports2.useId = function() {
      return ReactSharedInternals.H.useId();
    };
    exports2.useImperativeHandle = function(ref, create, deps) {
      return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
    };
    exports2.useInsertionEffect = function(create, deps) {
      return ReactSharedInternals.H.useInsertionEffect(create, deps);
    };
    exports2.useLayoutEffect = function(create, deps) {
      return ReactSharedInternals.H.useLayoutEffect(create, deps);
    };
    exports2.useMemo = function(create, deps) {
      return ReactSharedInternals.H.useMemo(create, deps);
    };
    exports2.useOptimistic = function(passthrough, reducer) {
      return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
    };
    exports2.useReducer = function(reducer, initialArg, init) {
      return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
    };
    exports2.useRef = function(initialValue) {
      return ReactSharedInternals.H.useRef(initialValue);
    };
    exports2.useState = function(initialState) {
      return ReactSharedInternals.H.useState(initialState);
    };
    exports2.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
      return ReactSharedInternals.H.useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
      );
    };
    exports2.useTransition = function() {
      return ReactSharedInternals.H.useTransition();
    };
    exports2.version = "19.2.4";
  }
});

// ../../node_modules/.pnpm/react@19.2.4/node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "../../node_modules/.pnpm/react@19.2.4/node_modules/react/cjs/react.development.js"(exports2, module2) {
    "use strict";
    "production" !== process.env.NODE_ENV && (function() {
      function defineDeprecationWarning(methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              info[0],
              info[1]
            );
          }
        });
      }
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable)
          return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      function warnNoop(publicInstance, callerName) {
        publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
        var warningKey = publicInstance + "." + callerName;
        didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          callerName,
          publicInstance
        ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
      }
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function ComponentDummy() {
      }
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function noop() {
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        newKey = ReactElement(
          oldElement.type,
          newKey,
          oldElement.props,
          oldElement._owner,
          oldElement._debugStack,
          oldElement._debugTask
        );
        oldElement._store && (newKey._store.validated = oldElement._store.validated);
        return newKey;
      }
      function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      function getElementKey(element, index) {
        return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback) {
          invokeCallback = children;
          callback = callback(invokeCallback);
          var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
          isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
            return c;
          })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + childKey
          ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
          return 1;
        }
        invokeCallback = 0;
        childKey = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), "function" === typeof i)
          for (i === children.entries && (didWarnAboutMaps || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var ioInfo = payload._ioInfo;
          null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
          ioInfo = payload._result;
          var thenable = ioInfo();
          thenable.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 1;
                payload._result = moduleObject;
                var _ioInfo = payload._ioInfo;
                null != _ioInfo && (_ioInfo.end = performance.now());
                void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
              }
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 2;
                payload._result = error;
                var _ioInfo2 = payload._ioInfo;
                null != _ioInfo2 && (_ioInfo2.end = performance.now());
                void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            }
          );
          ioInfo = payload._ioInfo;
          if (null != ioInfo) {
            ioInfo.value = thenable;
            var displayName = thenable.displayName;
            "string" === typeof displayName && (ioInfo.name = displayName);
          }
          -1 === payload._status && (payload._status = 0, payload._result = thenable);
        }
        if (1 === payload._status)
          return ioInfo = payload._result, void 0 === ioInfo && console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
            ioInfo
          ), "default" in ioInfo || console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
            ioInfo
          ), ioInfo.default;
        throw payload._result;
      }
      function resolveDispatcher() {
        var dispatcher = ReactSharedInternals.H;
        null === dispatcher && console.error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
        return dispatcher;
      }
      function releaseAsyncTransition() {
        ReactSharedInternals.asyncTransitions--;
      }
      function enqueueTask(task) {
        if (null === enqueueTaskImpl)
          try {
            var requireString = ("require" + Math.random()).slice(0, 7);
            enqueueTaskImpl = (module2 && module2[requireString]).call(
              module2,
              "timers"
            ).setImmediate;
          } catch (_err) {
            enqueueTaskImpl = function(callback) {
              false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var channel = new MessageChannel();
              channel.port1.onmessage = callback;
              channel.port2.postMessage(void 0);
            };
          }
        return enqueueTaskImpl(task);
      }
      function aggregateErrors(errors) {
        return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
      }
      function popActScope(prevActQueue, prevActScopeDepth) {
        prevActScopeDepth !== actScopeDepth - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        );
        actScopeDepth = prevActScopeDepth;
      }
      function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
        var queue = ReactSharedInternals.actQueue;
        if (null !== queue)
          if (0 !== queue.length)
            try {
              flushActQueue(queue);
              enqueueTask(function() {
                return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
              });
              return;
            } catch (error) {
              ReactSharedInternals.thrownErrors.push(error);
            }
          else ReactSharedInternals.actQueue = null;
        0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
      }
      function flushActQueue(queue) {
        if (!isFlushing) {
          isFlushing = true;
          var i = 0;
          try {
            for (; i < queue.length; i++) {
              var callback = queue[i];
              do {
                ReactSharedInternals.didUsePromise = false;
                var continuation = callback(false);
                if (null !== continuation) {
                  if (ReactSharedInternals.didUsePromise) {
                    queue[i] = callback;
                    queue.splice(0, i);
                    return;
                  }
                  callback = continuation;
                } else break;
              } while (1);
            }
            queue.length = 0;
          } catch (error) {
            queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
          } finally {
            isFlushing = false;
          }
        }
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function(publicInstance) {
          warnNoop(publicInstance, "forceUpdate");
        },
        enqueueReplaceState: function(publicInstance) {
          warnNoop(publicInstance, "replaceState");
        },
        enqueueSetState: function(publicInstance) {
          warnNoop(publicInstance, "setState");
        }
      }, assign = Object.assign, emptyObject = {};
      Object.freeze(emptyObject);
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      var deprecatedAPIs = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      };
      for (fnName in deprecatedAPIs)
        deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      ComponentDummy.prototype = Component.prototype;
      deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
      deprecatedAPIs.constructor = PureComponent;
      assign(deprecatedAPIs, Component.prototype);
      deprecatedAPIs.isPureReactComponent = true;
      var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = {
        H: null,
        A: null,
        T: null,
        S: null,
        actQueue: null,
        asyncTransitions: 0,
        isBatchingLegacy: false,
        didScheduleLegacyUpdate: false,
        didUsePromise: false,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      deprecatedAPIs = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
        deprecatedAPIs,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
        queueMicrotask(function() {
          return queueMicrotask(callback);
        });
      } : enqueueTask;
      deprecatedAPIs = Object.freeze({
        __proto__: null,
        c: function(size) {
          return resolveDispatcher().useMemoCache(size);
        }
      });
      var fnName = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports2.Activity = REACT_ACTIVITY_TYPE;
      exports2.Children = fnName;
      exports2.Component = Component;
      exports2.Fragment = REACT_FRAGMENT_TYPE;
      exports2.Profiler = REACT_PROFILER_TYPE;
      exports2.PureComponent = PureComponent;
      exports2.StrictMode = REACT_STRICT_MODE_TYPE;
      exports2.Suspense = REACT_SUSPENSE_TYPE;
      exports2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports2.__COMPILER_RUNTIME = deprecatedAPIs;
      exports2.act = function(callback) {
        var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
        actScopeDepth++;
        var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
        try {
          var result = callback();
        } catch (error) {
          ReactSharedInternals.thrownErrors.push(error);
        }
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        if (null !== result && "object" === typeof result && "function" === typeof result.then) {
          var thenable = result;
          queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          });
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              thenable.then(
                function(returnValue) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  if (0 === prevActScopeDepth) {
                    try {
                      flushActQueue(queue), enqueueTask(function() {
                        return recursivelyFlushAsyncActWork(
                          returnValue,
                          resolve,
                          reject
                        );
                      });
                    } catch (error$0) {
                      ReactSharedInternals.thrownErrors.push(error$0);
                    }
                    if (0 < ReactSharedInternals.thrownErrors.length) {
                      var _thrownError = aggregateErrors(
                        ReactSharedInternals.thrownErrors
                      );
                      ReactSharedInternals.thrownErrors.length = 0;
                      reject(_thrownError);
                    }
                  } else resolve(returnValue);
                },
                function(error) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                    ReactSharedInternals.thrownErrors
                  ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                }
              );
            }
          };
        }
        var returnValue$jscomp$0 = result;
        popActScope(prevActQueue, prevActScopeDepth);
        0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
          didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), ReactSharedInternals.actQueue = null);
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        return {
          then: function(resolve, reject) {
            didAwaitActCall = true;
            0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
              return recursivelyFlushAsyncActWork(
                returnValue$jscomp$0,
                resolve,
                reject
              );
            })) : resolve(returnValue$jscomp$0);
          }
        };
      };
      exports2.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports2.cacheSignal = function() {
        return null;
      };
      exports2.captureOwnerStack = function() {
        var getCurrentStack = ReactSharedInternals.getCurrentStack;
        return null === getCurrentStack ? null : getCurrentStack();
      };
      exports2.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key, owner = element._owner;
        if (null != config) {
          var JSCompiler_inline_result;
          a: {
            if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
              config,
              "ref"
            ).get) && JSCompiler_inline_result.isReactWarning) {
              JSCompiler_inline_result = false;
              break a;
            }
            JSCompiler_inline_result = void 0 !== config.ref;
          }
          JSCompiler_inline_result && (owner = getOwner());
          hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
          for (propName in config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        }
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          JSCompiler_inline_result = Array(propName);
          for (var i = 0; i < propName; i++)
            JSCompiler_inline_result[i] = arguments[i + 2];
          props.children = JSCompiler_inline_result;
        }
        props = ReactElement(
          element.type,
          key,
          props,
          owner,
          element._debugStack,
          element._debugTask
        );
        for (key = 2; key < arguments.length; key++)
          validateChildKeys(arguments[key]);
        return props;
      };
      exports2.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        defaultValue._currentRenderer = null;
        defaultValue._currentRenderer2 = null;
        return defaultValue;
      };
      exports2.createElement = function(type, config, children) {
        for (var i = 2; i < arguments.length; i++)
          validateChildKeys(arguments[i]);
        i = {};
        var key = null;
        if (null != config)
          for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) i.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
            childArray[_i] = arguments[_i + 2];
          Object.freeze && Object.freeze(childArray);
          i.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === i[propName] && (i[propName] = childrenLength[propName]);
        key && defineKeyPropWarningGetter(
          i,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return ReactElement(
          type,
          key,
          i,
          getOwner(),
          propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports2.createRef = function() {
        var refObject = { current: null };
        Object.seal(refObject);
        return refObject;
      };
      exports2.forwardRef = function(render) {
        null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : "function" !== typeof render ? console.error(
          "forwardRef requires a render function but was given %s.",
          null === render ? "null" : typeof render
        ) : 0 !== render.length && 2 !== render.length && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        );
        null != render && null != render.defaultProps && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
        Object.defineProperty(elementType, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
          }
        });
        return elementType;
      };
      exports2.isValidElement = isValidElement;
      exports2.lazy = function(ctor) {
        ctor = { _status: -1, _result: ctor };
        var lazyType = {
          $$typeof: REACT_LAZY_TYPE,
          _payload: ctor,
          _init: lazyInitializer
        }, ioInfo = {
          name: "lazy",
          start: -1,
          end: -1,
          value: null,
          owner: null,
          debugStack: Error("react-stack-top-frame"),
          debugTask: console.createTask ? console.createTask("lazy()") : null
        };
        ctor._ioInfo = ioInfo;
        lazyType._debugInfo = [{ awaited: ioInfo }];
        return lazyType;
      };
      exports2.memo = function(type, compare) {
        null == type && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          null === type ? "null" : typeof type
        );
        compare = {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
        var ownName;
        Object.defineProperty(compare, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
          }
        });
        return compare;
      };
      exports2.startTransition = function(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        currentTransition._updatedFibers = /* @__PURE__ */ new Set();
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
        } catch (error) {
          reportGlobalError(error);
        } finally {
          null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
            "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
          ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      };
      exports2.unstable_useCacheRefresh = function() {
        return resolveDispatcher().useCacheRefresh();
      };
      exports2.use = function(usable) {
        return resolveDispatcher().use(usable);
      };
      exports2.useActionState = function(action, initialState, permalink) {
        return resolveDispatcher().useActionState(
          action,
          initialState,
          permalink
        );
      };
      exports2.useCallback = function(callback, deps) {
        return resolveDispatcher().useCallback(callback, deps);
      };
      exports2.useContext = function(Context) {
        var dispatcher = resolveDispatcher();
        Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        );
        return dispatcher.useContext(Context);
      };
      exports2.useDebugValue = function(value, formatterFn) {
        return resolveDispatcher().useDebugValue(value, formatterFn);
      };
      exports2.useDeferredValue = function(value, initialValue) {
        return resolveDispatcher().useDeferredValue(value, initialValue);
      };
      exports2.useEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useEffect(create, deps);
      };
      exports2.useEffectEvent = function(callback) {
        return resolveDispatcher().useEffectEvent(callback);
      };
      exports2.useId = function() {
        return resolveDispatcher().useId();
      };
      exports2.useImperativeHandle = function(ref, create, deps) {
        return resolveDispatcher().useImperativeHandle(ref, create, deps);
      };
      exports2.useInsertionEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useInsertionEffect(create, deps);
      };
      exports2.useLayoutEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useLayoutEffect(create, deps);
      };
      exports2.useMemo = function(create, deps) {
        return resolveDispatcher().useMemo(create, deps);
      };
      exports2.useOptimistic = function(passthrough, reducer) {
        return resolveDispatcher().useOptimistic(passthrough, reducer);
      };
      exports2.useReducer = function(reducer, initialArg, init) {
        return resolveDispatcher().useReducer(reducer, initialArg, init);
      };
      exports2.useRef = function(initialValue) {
        return resolveDispatcher().useRef(initialValue);
      };
      exports2.useState = function(initialState) {
        return resolveDispatcher().useState(initialState);
      };
      exports2.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return resolveDispatcher().useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports2.useTransition = function() {
        return resolveDispatcher().useTransition();
      };
      exports2.version = "19.2.4";
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  }
});

// ../../node_modules/.pnpm/react@19.2.4/node_modules/react/index.js
var require_react = __commonJS({
  "../../node_modules/.pnpm/react@19.2.4/node_modules/react/index.js"(exports2, module2) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module2.exports = require_react_production();
    } else {
      module2.exports = require_react_development();
    }
  }
});

// ../../node_modules/.pnpm/js-binary-schema-parser@2.0.3/node_modules/js-binary-schema-parser/lib/index.js
var require_lib = __commonJS({
  "../../node_modules/.pnpm/js-binary-schema-parser@2.0.3/node_modules/js-binary-schema-parser/lib/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.loop = exports2.conditional = exports2.parse = void 0;
    var parse = function parse2(stream, schema) {
      var result = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      var parent = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : result;
      if (Array.isArray(schema)) {
        schema.forEach(function(partSchema) {
          return parse2(stream, partSchema, result, parent);
        });
      } else if (typeof schema === "function") {
        schema(stream, result, parent, parse2);
      } else {
        var key = Object.keys(schema)[0];
        if (Array.isArray(schema[key])) {
          parent[key] = {};
          parse2(stream, schema[key], result, parent[key]);
        } else {
          parent[key] = schema[key](stream, result, parent, parse2);
        }
      }
      return result;
    };
    exports2.parse = parse;
    var conditional = function conditional2(schema, conditionFunc) {
      return function(stream, result, parent, parse2) {
        if (conditionFunc(stream, result, parent)) {
          parse2(stream, schema, result, parent);
        }
      };
    };
    exports2.conditional = conditional;
    var loop = function loop2(schema, continueFunc) {
      return function(stream, result, parent, parse2) {
        var arr = [];
        var lastStreamPos = stream.pos;
        while (continueFunc(stream, result, parent)) {
          var newParent = {};
          parse2(stream, schema, result, newParent);
          if (stream.pos === lastStreamPos) {
            break;
          }
          lastStreamPos = stream.pos;
          arr.push(newParent);
        }
        return arr;
      };
    };
    exports2.loop = loop;
  }
});

// ../../node_modules/.pnpm/js-binary-schema-parser@2.0.3/node_modules/js-binary-schema-parser/lib/parsers/uint8.js
var require_uint8 = __commonJS({
  "../../node_modules/.pnpm/js-binary-schema-parser@2.0.3/node_modules/js-binary-schema-parser/lib/parsers/uint8.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.readBits = exports2.readArray = exports2.readUnsigned = exports2.readString = exports2.peekBytes = exports2.readBytes = exports2.peekByte = exports2.readByte = exports2.buildStream = void 0;
    var buildStream = function buildStream2(uint8Data) {
      return {
        data: uint8Data,
        pos: 0
      };
    };
    exports2.buildStream = buildStream;
    var readByte = function readByte2() {
      return function(stream) {
        return stream.data[stream.pos++];
      };
    };
    exports2.readByte = readByte;
    var peekByte = function peekByte2() {
      var offset = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
      return function(stream) {
        return stream.data[stream.pos + offset];
      };
    };
    exports2.peekByte = peekByte;
    var readBytes = function readBytes2(length) {
      return function(stream) {
        return stream.data.subarray(stream.pos, stream.pos += length);
      };
    };
    exports2.readBytes = readBytes;
    var peekBytes = function peekBytes2(length) {
      return function(stream) {
        return stream.data.subarray(stream.pos, stream.pos + length);
      };
    };
    exports2.peekBytes = peekBytes;
    var readString = function readString2(length) {
      return function(stream) {
        return Array.from(readBytes(length)(stream)).map(function(value) {
          return String.fromCharCode(value);
        }).join("");
      };
    };
    exports2.readString = readString;
    var readUnsigned = function readUnsigned2(littleEndian) {
      return function(stream) {
        var bytes = readBytes(2)(stream);
        return littleEndian ? (bytes[1] << 8) + bytes[0] : (bytes[0] << 8) + bytes[1];
      };
    };
    exports2.readUnsigned = readUnsigned;
    var readArray = function readArray2(byteSize, totalOrFunc) {
      return function(stream, result, parent) {
        var total = typeof totalOrFunc === "function" ? totalOrFunc(stream, result, parent) : totalOrFunc;
        var parser = readBytes(byteSize);
        var arr = new Array(total);
        for (var i = 0; i < total; i++) {
          arr[i] = parser(stream);
        }
        return arr;
      };
    };
    exports2.readArray = readArray;
    var subBitsTotal = function subBitsTotal2(bits, startIndex, length) {
      var result = 0;
      for (var i = 0; i < length; i++) {
        result += bits[startIndex + i] && Math.pow(2, length - i - 1);
      }
      return result;
    };
    var readBits = function readBits2(schema) {
      return function(stream) {
        var _byte = readByte()(stream);
        var bits = new Array(8);
        for (var i = 0; i < 8; i++) {
          bits[7 - i] = !!(_byte & 1 << i);
        }
        return Object.keys(schema).reduce(function(res, key) {
          var def = schema[key];
          if (def.length) {
            res[key] = subBitsTotal(bits, def.index, def.length);
          } else {
            res[key] = bits[def.index];
          }
          return res;
        }, {});
      };
    };
    exports2.readBits = readBits;
  }
});

// ../../node_modules/.pnpm/js-binary-schema-parser@2.0.3/node_modules/js-binary-schema-parser/lib/schemas/gif.js
var require_gif = __commonJS({
  "../../node_modules/.pnpm/js-binary-schema-parser@2.0.3/node_modules/js-binary-schema-parser/lib/schemas/gif.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2["default"] = void 0;
    var _ = require_lib();
    var _uint = require_uint8();
    var subBlocksSchema = {
      blocks: function blocks(stream) {
        var terminator = 0;
        var chunks = [];
        var streamSize = stream.data.length;
        var total = 0;
        for (var size = (0, _uint.readByte)()(stream); size !== terminator; size = (0, _uint.readByte)()(stream)) {
          if (!size) break;
          if (stream.pos + size >= streamSize) {
            var availableSize = streamSize - stream.pos;
            chunks.push((0, _uint.readBytes)(availableSize)(stream));
            total += availableSize;
            break;
          }
          chunks.push((0, _uint.readBytes)(size)(stream));
          total += size;
        }
        var result = new Uint8Array(total);
        var offset = 0;
        for (var i = 0; i < chunks.length; i++) {
          result.set(chunks[i], offset);
          offset += chunks[i].length;
        }
        return result;
      }
    };
    var gceSchema = (0, _.conditional)({
      gce: [{
        codes: (0, _uint.readBytes)(2)
      }, {
        byteSize: (0, _uint.readByte)()
      }, {
        extras: (0, _uint.readBits)({
          future: {
            index: 0,
            length: 3
          },
          disposal: {
            index: 3,
            length: 3
          },
          userInput: {
            index: 6
          },
          transparentColorGiven: {
            index: 7
          }
        })
      }, {
        delay: (0, _uint.readUnsigned)(true)
      }, {
        transparentColorIndex: (0, _uint.readByte)()
      }, {
        terminator: (0, _uint.readByte)()
      }]
    }, function(stream) {
      var codes = (0, _uint.peekBytes)(2)(stream);
      return codes[0] === 33 && codes[1] === 249;
    });
    var imageSchema = (0, _.conditional)({
      image: [{
        code: (0, _uint.readByte)()
      }, {
        descriptor: [{
          left: (0, _uint.readUnsigned)(true)
        }, {
          top: (0, _uint.readUnsigned)(true)
        }, {
          width: (0, _uint.readUnsigned)(true)
        }, {
          height: (0, _uint.readUnsigned)(true)
        }, {
          lct: (0, _uint.readBits)({
            exists: {
              index: 0
            },
            interlaced: {
              index: 1
            },
            sort: {
              index: 2
            },
            future: {
              index: 3,
              length: 2
            },
            size: {
              index: 5,
              length: 3
            }
          })
        }]
      }, (0, _.conditional)({
        lct: (0, _uint.readArray)(3, function(stream, result, parent) {
          return Math.pow(2, parent.descriptor.lct.size + 1);
        })
      }, function(stream, result, parent) {
        return parent.descriptor.lct.exists;
      }), {
        data: [{
          minCodeSize: (0, _uint.readByte)()
        }, subBlocksSchema]
      }]
    }, function(stream) {
      return (0, _uint.peekByte)()(stream) === 44;
    });
    var textSchema = (0, _.conditional)({
      text: [{
        codes: (0, _uint.readBytes)(2)
      }, {
        blockSize: (0, _uint.readByte)()
      }, {
        preData: function preData(stream, result, parent) {
          return (0, _uint.readBytes)(parent.text.blockSize)(stream);
        }
      }, subBlocksSchema]
    }, function(stream) {
      var codes = (0, _uint.peekBytes)(2)(stream);
      return codes[0] === 33 && codes[1] === 1;
    });
    var applicationSchema = (0, _.conditional)({
      application: [{
        codes: (0, _uint.readBytes)(2)
      }, {
        blockSize: (0, _uint.readByte)()
      }, {
        id: function id(stream, result, parent) {
          return (0, _uint.readString)(parent.blockSize)(stream);
        }
      }, subBlocksSchema]
    }, function(stream) {
      var codes = (0, _uint.peekBytes)(2)(stream);
      return codes[0] === 33 && codes[1] === 255;
    });
    var commentSchema = (0, _.conditional)({
      comment: [{
        codes: (0, _uint.readBytes)(2)
      }, subBlocksSchema]
    }, function(stream) {
      var codes = (0, _uint.peekBytes)(2)(stream);
      return codes[0] === 33 && codes[1] === 254;
    });
    var schema = [
      {
        header: [{
          signature: (0, _uint.readString)(3)
        }, {
          version: (0, _uint.readString)(3)
        }]
      },
      {
        lsd: [{
          width: (0, _uint.readUnsigned)(true)
        }, {
          height: (0, _uint.readUnsigned)(true)
        }, {
          gct: (0, _uint.readBits)({
            exists: {
              index: 0
            },
            resolution: {
              index: 1,
              length: 3
            },
            sort: {
              index: 4
            },
            size: {
              index: 5,
              length: 3
            }
          })
        }, {
          backgroundColorIndex: (0, _uint.readByte)()
        }, {
          pixelAspectRatio: (0, _uint.readByte)()
        }]
      },
      (0, _.conditional)({
        gct: (0, _uint.readArray)(3, function(stream, result) {
          return Math.pow(2, result.lsd.gct.size + 1);
        })
      }, function(stream, result) {
        return result.lsd.gct.exists;
      }),
      // content frames
      {
        frames: (0, _.loop)([gceSchema, applicationSchema, commentSchema, imageSchema, textSchema], function(stream) {
          var nextCode = (0, _uint.peekByte)()(stream);
          return nextCode === 33 || nextCode === 44;
        })
      }
    ];
    var _default = schema;
    exports2["default"] = _default;
  }
});

// ../../node_modules/.pnpm/gifuct-js@2.1.2/node_modules/gifuct-js/lib/deinterlace.js
var require_deinterlace = __commonJS({
  "../../node_modules/.pnpm/gifuct-js@2.1.2/node_modules/gifuct-js/lib/deinterlace.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.deinterlace = void 0;
    var deinterlace = function deinterlace2(pixels, width) {
      var newPixels = new Array(pixels.length);
      var rows = pixels.length / width;
      var cpRow = function cpRow2(toRow2, fromRow2) {
        var fromPixels = pixels.slice(fromRow2 * width, (fromRow2 + 1) * width);
        newPixels.splice.apply(newPixels, [toRow2 * width, width].concat(fromPixels));
      };
      var offsets = [0, 4, 2, 1];
      var steps = [8, 8, 4, 2];
      var fromRow = 0;
      for (var pass = 0; pass < 4; pass++) {
        for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
          cpRow(toRow, fromRow);
          fromRow++;
        }
      }
      return newPixels;
    };
    exports2.deinterlace = deinterlace;
  }
});

// ../../node_modules/.pnpm/gifuct-js@2.1.2/node_modules/gifuct-js/lib/lzw.js
var require_lzw = __commonJS({
  "../../node_modules/.pnpm/gifuct-js@2.1.2/node_modules/gifuct-js/lib/lzw.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.lzw = void 0;
    var lzw = function lzw2(minCodeSize, data, pixelCount) {
      var MAX_STACK_SIZE = 4096;
      var nullCode = -1;
      var npix = pixelCount;
      var available, clear, code_mask, code_size, end_of_information, in_code, old_code, bits, code, i, datum, data_size, first, top, bi, pi;
      var dstPixels = new Array(pixelCount);
      var prefix = new Array(MAX_STACK_SIZE);
      var suffix = new Array(MAX_STACK_SIZE);
      var pixelStack = new Array(MAX_STACK_SIZE + 1);
      data_size = minCodeSize;
      clear = 1 << data_size;
      end_of_information = clear + 1;
      available = clear + 2;
      old_code = nullCode;
      code_size = data_size + 1;
      code_mask = (1 << code_size) - 1;
      for (code = 0; code < clear; code++) {
        prefix[code] = 0;
        suffix[code] = code;
      }
      var datum, bits, count, first, top, pi, bi;
      datum = bits = count = first = top = pi = bi = 0;
      for (i = 0; i < npix; ) {
        if (top === 0) {
          if (bits < code_size) {
            datum += data[bi] << bits;
            bits += 8;
            bi++;
            continue;
          }
          code = datum & code_mask;
          datum >>= code_size;
          bits -= code_size;
          if (code > available || code == end_of_information) {
            break;
          }
          if (code == clear) {
            code_size = data_size + 1;
            code_mask = (1 << code_size) - 1;
            available = clear + 2;
            old_code = nullCode;
            continue;
          }
          if (old_code == nullCode) {
            pixelStack[top++] = suffix[code];
            old_code = code;
            first = code;
            continue;
          }
          in_code = code;
          if (code == available) {
            pixelStack[top++] = first;
            code = old_code;
          }
          while (code > clear) {
            pixelStack[top++] = suffix[code];
            code = prefix[code];
          }
          first = suffix[code] & 255;
          pixelStack[top++] = first;
          if (available < MAX_STACK_SIZE) {
            prefix[available] = old_code;
            suffix[available] = first;
            available++;
            if ((available & code_mask) === 0 && available < MAX_STACK_SIZE) {
              code_size++;
              code_mask += available;
            }
          }
          old_code = in_code;
        }
        top--;
        dstPixels[pi++] = pixelStack[top];
        i++;
      }
      for (i = pi; i < npix; i++) {
        dstPixels[i] = 0;
      }
      return dstPixels;
    };
    exports2.lzw = lzw;
  }
});

// ../../node_modules/.pnpm/gifuct-js@2.1.2/node_modules/gifuct-js/lib/index.js
var require_lib2 = __commonJS({
  "../../node_modules/.pnpm/gifuct-js@2.1.2/node_modules/gifuct-js/lib/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.decompressFrames = exports2.decompressFrame = exports2.parseGIF = void 0;
    var _gif = _interopRequireDefault(require_gif());
    var _jsBinarySchemaParser = require_lib();
    var _uint = require_uint8();
    var _deinterlace = require_deinterlace();
    var _lzw = require_lzw();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var parseGIF5 = function parseGIF6(arrayBuffer) {
      var byteData = new Uint8Array(arrayBuffer);
      return (0, _jsBinarySchemaParser.parse)((0, _uint.buildStream)(byteData), _gif["default"]);
    };
    exports2.parseGIF = parseGIF5;
    var generatePatch = function generatePatch2(image) {
      var totalPixels = image.pixels.length;
      var patchData = new Uint8ClampedArray(totalPixels * 4);
      for (var i = 0; i < totalPixels; i++) {
        var pos = i * 4;
        var colorIndex = image.pixels[i];
        var color = image.colorTable[colorIndex] || [0, 0, 0];
        patchData[pos] = color[0];
        patchData[pos + 1] = color[1];
        patchData[pos + 2] = color[2];
        patchData[pos + 3] = colorIndex !== image.transparentIndex ? 255 : 0;
      }
      return patchData;
    };
    var decompressFrame = function decompressFrame2(frame, gct, buildImagePatch) {
      if (!frame.image) {
        console.warn("gif frame does not have associated image.");
        return;
      }
      var image = frame.image;
      var totalPixels = image.descriptor.width * image.descriptor.height;
      var pixels = (0, _lzw.lzw)(image.data.minCodeSize, image.data.blocks, totalPixels);
      if (image.descriptor.lct.interlaced) {
        pixels = (0, _deinterlace.deinterlace)(pixels, image.descriptor.width);
      }
      var resultImage = {
        pixels,
        dims: {
          top: frame.image.descriptor.top,
          left: frame.image.descriptor.left,
          width: frame.image.descriptor.width,
          height: frame.image.descriptor.height
        }
      };
      if (image.descriptor.lct && image.descriptor.lct.exists) {
        resultImage.colorTable = image.lct;
      } else {
        resultImage.colorTable = gct;
      }
      if (frame.gce) {
        resultImage.delay = (frame.gce.delay || 10) * 10;
        resultImage.disposalType = frame.gce.extras.disposal;
        if (frame.gce.extras.transparentColorGiven) {
          resultImage.transparentIndex = frame.gce.transparentColorIndex;
        }
      }
      if (buildImagePatch) {
        resultImage.patch = generatePatch(resultImage);
      }
      return resultImage;
    };
    exports2.decompressFrame = decompressFrame;
    var decompressFrames5 = function decompressFrames6(parsedGif, buildImagePatches) {
      return parsedGif.frames.filter(function(f) {
        return f.image;
      }).map(function(f) {
        return decompressFrame(f, parsedGif.gct, buildImagePatches);
      });
    };
    exports2.decompressFrames = decompressFrames5;
  }
});

// ../../node_modules/.pnpm/gif.js.optimized@1.0.1/node_modules/gif.js.optimized/dist/gif.js
var require_gif2 = __commonJS({
  "../../node_modules/.pnpm/gif.js.optimized@1.0.1/node_modules/gif.js.optimized/dist/gif.js"(exports2, module2) {
    !(function(t, e) {
      "object" == typeof exports2 && "object" == typeof module2 ? module2.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports2 ? exports2.GIF = e() : t.GIF = e();
    })(exports2, function() {
      return (function(t) {
        function e(n) {
          if (i[n]) return i[n].exports;
          var r = i[n] = { exports: {}, id: n, loaded: false };
          return t[n].call(r.exports, r, r.exports, e), r.loaded = true, r.exports;
        }
        var i = {};
        return e.m = t, e.c = i, e.p = "", e(0);
      })([function(t, e, i) {
        var n, r, s, o = function(t2, e2) {
          function i2() {
            this.constructor = t2;
          }
          for (var n2 in e2) a.call(e2, n2) && (t2[n2] = e2[n2]);
          return i2.prototype = e2.prototype, t2.prototype = new i2(), t2.__super__ = e2.prototype, t2;
        }, a = {}.hasOwnProperty, h = [].indexOf || function(t2) {
          for (var e2 = 0, i2 = this.length; e2 < i2; e2++) if (e2 in this && this[e2] === t2) return e2;
          return -1;
        };
        n = i(1).EventEmitter, s = i(2), r = (function(t2) {
          function e2(t3) {
            var e3, n3, r2;
            this.running = false, this.options = {}, this.frames = [], this.groups = /* @__PURE__ */ new Map(), this.freeWorkers = [], this.activeWorkers = [], this.setOptions(t3);
            for (n3 in i2) r2 = i2[n3], null == (e3 = this.options)[n3] && (e3[n3] = r2);
          }
          var i2, n2;
          return o(e2, t2), i2 = { workerScript: "gif.worker.js", workers: 2, repeat: 0, background: "#fff", quality: 10, width: null, height: null, transparent: null, debug: false }, n2 = { delay: 500, copy: false }, e2.prototype.setOption = function(t3, e3) {
            if (this.options[t3] = e3, null != this._canvas && ("width" === t3 || "height" === t3)) return this._canvas[t3] = e3;
          }, e2.prototype.setOptions = function(t3) {
            var e3, i3, n3;
            i3 = [];
            for (e3 in t3) a.call(t3, e3) && (n3 = t3[e3], i3.push(this.setOption(e3, n3)));
            return i3;
          }, e2.prototype.addFrame = function(t3, e3) {
            var i3, r2, s2;
            null == e3 && (e3 = {}), i3 = {}, i3.transparent = this.options.transparent;
            for (s2 in n2) i3[s2] = e3[s2] || n2[s2];
            if (null == this.options.width && this.setOption("width", t3.width), null == this.options.height && this.setOption("height", t3.height), "undefined" != typeof ImageData && null !== ImageData && t3 instanceof ImageData) i3.data = t3.data;
            else if ("undefined" != typeof CanvasRenderingContext2D && null !== CanvasRenderingContext2D && t3 instanceof CanvasRenderingContext2D || "undefined" != typeof WebGLRenderingContext && null !== WebGLRenderingContext && t3 instanceof WebGLRenderingContext) e3.copy ? i3.data = this.getContextData(t3) : i3.context = t3;
            else {
              if (null == t3.childNodes) throw new Error("Invalid image");
              e3.copy ? i3.data = this.getImageData(t3) : i3.image = t3;
            }
            return r2 = this.frames.length, r2 > 0 && i3.data && (this.groups.has(i3.data) ? this.groups.get(i3.data).push(r2) : this.groups.set(i3.data, [r2])), this.frames.push(i3);
          }, e2.prototype.render = function() {
            var t3, e3, i3, n3;
            if (this.running) throw new Error("Already running");
            if (null == this.options.width || null == this.options.height) throw new Error("Width and height must be set prior to rendering");
            if (this.running = true, this.nextFrame = 0, this.finishedFrames = 0, this.imageParts = function() {
              var e4, i4, n4;
              for (n4 = [], t3 = e4 = 0, i4 = this.frames.length; 0 <= i4 ? e4 < i4 : e4 > i4; t3 = 0 <= i4 ? ++e4 : --e4) n4.push(null);
              return n4;
            }.call(this), i3 = this.spawnWorkers(), this.options.globalPalette === true) this.renderNextFrame();
            else for (t3 = e3 = 0, n3 = i3; 0 <= n3 ? e3 < n3 : e3 > n3; t3 = 0 <= n3 ? ++e3 : --e3) this.renderNextFrame();
            return this.emit("start"), this.emit("progress", 0);
          }, e2.prototype.abort = function() {
            for (var t3; ; ) {
              if (t3 = this.activeWorkers.shift(), null == t3) break;
              this.log("killing active worker"), t3.terminate();
            }
            return this.running = false, this.emit("abort");
          }, e2.prototype.spawnWorkers = function() {
            var t3, e3, i3;
            return t3 = Math.min(this.options.workers, this.frames.length), function() {
              i3 = [];
              for (var n3 = e3 = this.freeWorkers.length; e3 <= t3 ? n3 < t3 : n3 > t3; e3 <= t3 ? n3++ : n3--) i3.push(n3);
              return i3;
            }.apply(this).forEach(/* @__PURE__ */ (function(t4) {
              return function(e4) {
                var i4;
                return t4.log("spawning worker " + e4), i4 = new Worker(t4.options.workerScript), i4.onmessage = function(e5) {
                  return t4.activeWorkers.splice(t4.activeWorkers.indexOf(i4), 1), t4.freeWorkers.push(i4), t4.frameFinished(e5.data, false);
                }, t4.freeWorkers.push(i4);
              };
            })(this)), t3;
          }, e2.prototype.frameFinished = function(t3, e3) {
            var i3, n3, r2, s2, o2;
            if (this.finishedFrames++, e3 ? (n3 = this.frames.indexOf(t3), r2 = this.groups.get(t3.data)[0], this.log("frame " + (n3 + 1) + " is duplicate of " + r2 + " - " + this.activeWorkers.length + " active"), this.imageParts[n3] = { indexOfFirstInGroup: r2 }) : (this.log("frame " + (t3.index + 1) + " finished - " + this.activeWorkers.length + " active"), this.emit("progress", this.finishedFrames / this.frames.length), this.imageParts[t3.index] = t3), this.options.globalPalette === true && !e3 && (this.options.globalPalette = t3.globalPalette, this.log("global palette analyzed"), this.frames.length > 2)) for (i3 = s2 = 1, o2 = this.freeWorkers.length; 1 <= o2 ? s2 < o2 : s2 > o2; i3 = 1 <= o2 ? ++s2 : --s2) this.renderNextFrame();
            return h.call(this.imageParts, null) >= 0 ? this.renderNextFrame() : this.finishRendering();
          }, e2.prototype.finishRendering = function() {
            var t3, e3, i3, n3, r2, s2, o2, a2, h2, l, f, p, u, d, c, g, v, m, y, _;
            for (v = this.imageParts, r2 = s2 = 0, l = v.length; s2 < l; r2 = ++s2) e3 = v[r2], e3.indexOfFirstInGroup && (this.imageParts[r2] = this.imageParts[e3.indexOfFirstInGroup]);
            for (h2 = 0, m = this.imageParts, o2 = 0, f = m.length; o2 < f; o2++) e3 = m[o2], h2 += (e3.data.length - 1) * e3.pageSize + e3.cursor;
            for (h2 += e3.pageSize - e3.cursor, this.log("rendering finished - filesize " + Math.round(h2 / 1e3) + "kb"), t3 = new Uint8Array(h2), c = 0, y = this.imageParts, a2 = 0, p = y.length; a2 < p; a2++) for (e3 = y[a2], _ = e3.data, i3 = d = 0, u = _.length; d < u; i3 = ++d) g = _[i3], t3.set(g, c), c += i3 === e3.data.length - 1 ? e3.cursor : e3.pageSize;
            return n3 = new Blob([t3], { type: "image/gif" }), this.emit("finished", n3, t3);
          }, e2.prototype.renderNextFrame = function() {
            var t3, e3, i3, n3;
            if (0 === this.freeWorkers.length) throw new Error("No free workers");
            if (!(this.nextFrame >= this.frames.length)) return t3 = this.frames[this.nextFrame++], e3 = this.frames.indexOf(t3), e3 > 0 && this.groups.has(t3.data) && this.groups.get(t3.data)[0] !== e3 ? void setTimeout(/* @__PURE__ */ (function(e4) {
              return function() {
                return e4.frameFinished(t3, true);
              };
            })(this), 0) : (n3 = this.freeWorkers.shift(), i3 = this.getTask(t3), this.log("starting frame " + (i3.index + 1) + " of " + this.frames.length), this.activeWorkers.push(n3), n3.postMessage(i3));
          }, e2.prototype.getContextData = function(t3) {
            return t3.getImageData(0, 0, this.options.width, this.options.height).data;
          }, e2.prototype.getImageData = function(t3) {
            var e3;
            return null == this._canvas && (this._canvas = document.createElement("canvas"), this._canvas.width = this.options.width, this._canvas.height = this.options.height), e3 = this._canvas.getContext("2d"), e3.setFill = this.options.background, e3.fillRect(0, 0, this.options.width, this.options.height), e3.drawImage(t3, 0, 0), this.getContextData(e3);
          }, e2.prototype.getTask = function(t3) {
            var e3, i3;
            if (e3 = this.frames.indexOf(t3), i3 = { index: e3, last: e3 === this.frames.length - 1, delay: t3.delay, transparent: t3.transparent, width: this.options.width, height: this.options.height, quality: this.options.quality, dither: this.options.dither, globalPalette: this.options.globalPalette, repeat: this.options.repeat, canTransfer: true }, null != t3.data) i3.data = t3.data;
            else if (null != t3.context) i3.data = this.getContextData(t3.context);
            else {
              if (null == t3.image) throw new Error("Invalid frame");
              i3.data = this.getImageData(t3.image);
            }
            return i3;
          }, e2.prototype.log = function(t3) {
            if (this.options.debug) return console.log(t3);
          }, e2;
        })(n), t.exports = r;
      }, function(t, e) {
        function i() {
          this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0;
        }
        function n(t2) {
          return "function" == typeof t2;
        }
        function r(t2) {
          return "number" == typeof t2;
        }
        function s(t2) {
          return "object" == typeof t2 && null !== t2;
        }
        function o(t2) {
          return void 0 === t2;
        }
        t.exports = i, i.EventEmitter = i, i.prototype._events = void 0, i.prototype._maxListeners = void 0, i.defaultMaxListeners = 10, i.prototype.setMaxListeners = function(t2) {
          if (!r(t2) || t2 < 0 || isNaN(t2)) throw TypeError("n must be a positive number");
          return this._maxListeners = t2, this;
        }, i.prototype.emit = function(t2) {
          var e2, i2, r2, a, h, l;
          if (this._events || (this._events = {}), "error" === t2 && (!this._events.error || s(this._events.error) && !this._events.error.length)) {
            if (e2 = arguments[1], e2 instanceof Error) throw e2;
            var f = new Error('Uncaught, unspecified "error" event. (' + e2 + ")");
            throw f.context = e2, f;
          }
          if (i2 = this._events[t2], o(i2)) return false;
          if (n(i2)) switch (arguments.length) {
            case 1:
              i2.call(this);
              break;
            case 2:
              i2.call(this, arguments[1]);
              break;
            case 3:
              i2.call(this, arguments[1], arguments[2]);
              break;
            default:
              a = Array.prototype.slice.call(arguments, 1), i2.apply(this, a);
          }
          else if (s(i2)) for (a = Array.prototype.slice.call(arguments, 1), l = i2.slice(), r2 = l.length, h = 0; h < r2; h++) l[h].apply(this, a);
          return true;
        }, i.prototype.addListener = function(t2, e2) {
          var r2;
          if (!n(e2)) throw TypeError("listener must be a function");
          return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", t2, n(e2.listener) ? e2.listener : e2), this._events[t2] ? s(this._events[t2]) ? this._events[t2].push(e2) : this._events[t2] = [this._events[t2], e2] : this._events[t2] = e2, s(this._events[t2]) && !this._events[t2].warned && (r2 = o(this._maxListeners) ? i.defaultMaxListeners : this._maxListeners, r2 && r2 > 0 && this._events[t2].length > r2 && (this._events[t2].warned = true, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[t2].length), "function" == typeof console.trace && console.trace())), this;
        }, i.prototype.on = i.prototype.addListener, i.prototype.once = function(t2, e2) {
          function i2() {
            this.removeListener(t2, i2), r2 || (r2 = true, e2.apply(this, arguments));
          }
          if (!n(e2)) throw TypeError("listener must be a function");
          var r2 = false;
          return i2.listener = e2, this.on(t2, i2), this;
        }, i.prototype.removeListener = function(t2, e2) {
          var i2, r2, o2, a;
          if (!n(e2)) throw TypeError("listener must be a function");
          if (!this._events || !this._events[t2]) return this;
          if (i2 = this._events[t2], o2 = i2.length, r2 = -1, i2 === e2 || n(i2.listener) && i2.listener === e2) delete this._events[t2], this._events.removeListener && this.emit("removeListener", t2, e2);
          else if (s(i2)) {
            for (a = o2; a-- > 0; ) if (i2[a] === e2 || i2[a].listener && i2[a].listener === e2) {
              r2 = a;
              break;
            }
            if (r2 < 0) return this;
            1 === i2.length ? (i2.length = 0, delete this._events[t2]) : i2.splice(r2, 1), this._events.removeListener && this.emit("removeListener", t2, e2);
          }
          return this;
        }, i.prototype.removeAllListeners = function(t2) {
          var e2, i2;
          if (!this._events) return this;
          if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[t2] && delete this._events[t2], this;
          if (0 === arguments.length) {
            for (e2 in this._events) "removeListener" !== e2 && this.removeAllListeners(e2);
            return this.removeAllListeners("removeListener"), this._events = {}, this;
          }
          if (i2 = this._events[t2], n(i2)) this.removeListener(t2, i2);
          else if (i2) for (; i2.length; ) this.removeListener(t2, i2[i2.length - 1]);
          return delete this._events[t2], this;
        }, i.prototype.listeners = function(t2) {
          var e2;
          return e2 = this._events && this._events[t2] ? n(this._events[t2]) ? [this._events[t2]] : this._events[t2].slice() : [];
        }, i.prototype.listenerCount = function(t2) {
          if (this._events) {
            var e2 = this._events[t2];
            if (n(e2)) return 1;
            if (e2) return e2.length;
          }
          return 0;
        }, i.listenerCount = function(t2, e2) {
          return t2.listenerCount(e2);
        };
      }, function(t, e) {
        var i, n, r, s, o;
        o = navigator.userAgent.toLowerCase(), s = navigator.platform.toLowerCase(), i = o.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, "unknown", 0], r = "ie" === i[1] && document.documentMode, n = { name: "version" === i[1] ? i[3] : i[1], version: r || parseFloat("opera" === i[1] && i[4] ? i[4] : i[2]), platform: { name: o.match(/ip(?:ad|od|hone)/) ? "ios" : (o.match(/(?:webos|android)/) || s.match(/mac|win|linux/) || ["other"])[0] } }, n[n.name] = true, n[n.name + parseInt(n.version, 10)] = true, n.platform[n.platform.name] = true, t.exports = n;
      }]);
    });
  }
});

// ../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/is.js
var require_is = __commonJS({
  "../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/is.js"(exports2, module2) {
    var defined = (val) => typeof val !== "undefined" && val !== null;
    var object = (val) => typeof val === "object";
    var plainObject = (val) => Object.prototype.toString.call(val) === "[object Object]";
    var fn = (val) => typeof val === "function";
    var bool = (val) => typeof val === "boolean";
    var buffer = (val) => val instanceof Buffer;
    var typedArray = (val) => {
      if (defined(val)) {
        switch (val.constructor) {
          case Uint8Array:
          case Uint8ClampedArray:
          case Int8Array:
          case Uint16Array:
          case Int16Array:
          case Uint32Array:
          case Int32Array:
          case Float32Array:
          case Float64Array:
            return true;
        }
      }
      return false;
    };
    var arrayBuffer = (val) => val instanceof ArrayBuffer;
    var string = (val) => typeof val === "string" && val.length > 0;
    var number = (val) => typeof val === "number" && !Number.isNaN(val);
    var integer = (val) => Number.isInteger(val);
    var inRange = (val, min, max) => val >= min && val <= max;
    var inArray = (val, list) => list.includes(val);
    var invalidParameterError = (name, expected, actual) => new Error(
      `Expected ${expected} for ${name} but received ${actual} of type ${typeof actual}`
    );
    var nativeError = (native, context) => {
      context.message = native.message;
      return context;
    };
    module2.exports = {
      defined,
      object,
      plainObject,
      fn,
      bool,
      buffer,
      typedArray,
      arrayBuffer,
      string,
      number,
      integer,
      inRange,
      inArray,
      invalidParameterError,
      nativeError
    };
  }
});

// ../../node_modules/.pnpm/detect-libc@2.1.2/node_modules/detect-libc/lib/process.js
var require_process = __commonJS({
  "../../node_modules/.pnpm/detect-libc@2.1.2/node_modules/detect-libc/lib/process.js"(exports2, module2) {
    "use strict";
    var isLinux = () => process.platform === "linux";
    var report = null;
    var getReport = () => {
      if (!report) {
        if (isLinux() && process.report) {
          const orig = process.report.excludeNetwork;
          process.report.excludeNetwork = true;
          report = process.report.getReport();
          process.report.excludeNetwork = orig;
        } else {
          report = {};
        }
      }
      return report;
    };
    module2.exports = { isLinux, getReport };
  }
});

// ../../node_modules/.pnpm/detect-libc@2.1.2/node_modules/detect-libc/lib/filesystem.js
var require_filesystem = __commonJS({
  "../../node_modules/.pnpm/detect-libc@2.1.2/node_modules/detect-libc/lib/filesystem.js"(exports2, module2) {
    "use strict";
    var fs = require("fs");
    var LDD_PATH = "/usr/bin/ldd";
    var SELF_PATH = "/proc/self/exe";
    var MAX_LENGTH = 2048;
    var readFileSync = (path) => {
      const fd = fs.openSync(path, "r");
      const buffer = Buffer.alloc(MAX_LENGTH);
      const bytesRead = fs.readSync(fd, buffer, 0, MAX_LENGTH, 0);
      fs.close(fd, () => {
      });
      return buffer.subarray(0, bytesRead);
    };
    var readFile = (path) => new Promise((resolve, reject) => {
      fs.open(path, "r", (err, fd) => {
        if (err) {
          reject(err);
        } else {
          const buffer = Buffer.alloc(MAX_LENGTH);
          fs.read(fd, buffer, 0, MAX_LENGTH, 0, (_, bytesRead) => {
            resolve(buffer.subarray(0, bytesRead));
            fs.close(fd, () => {
            });
          });
        }
      });
    });
    module2.exports = {
      LDD_PATH,
      SELF_PATH,
      readFileSync,
      readFile
    };
  }
});

// ../../node_modules/.pnpm/detect-libc@2.1.2/node_modules/detect-libc/lib/elf.js
var require_elf = __commonJS({
  "../../node_modules/.pnpm/detect-libc@2.1.2/node_modules/detect-libc/lib/elf.js"(exports2, module2) {
    "use strict";
    var interpreterPath = (elf) => {
      if (elf.length < 64) {
        return null;
      }
      if (elf.readUInt32BE(0) !== 2135247942) {
        return null;
      }
      if (elf.readUInt8(4) !== 2) {
        return null;
      }
      if (elf.readUInt8(5) !== 1) {
        return null;
      }
      const offset = elf.readUInt32LE(32);
      const size = elf.readUInt16LE(54);
      const count = elf.readUInt16LE(56);
      for (let i = 0; i < count; i++) {
        const headerOffset = offset + i * size;
        const type = elf.readUInt32LE(headerOffset);
        if (type === 3) {
          const fileOffset = elf.readUInt32LE(headerOffset + 8);
          const fileSize = elf.readUInt32LE(headerOffset + 32);
          return elf.subarray(fileOffset, fileOffset + fileSize).toString().replace(/\0.*$/g, "");
        }
      }
      return null;
    };
    module2.exports = {
      interpreterPath
    };
  }
});

// ../../node_modules/.pnpm/detect-libc@2.1.2/node_modules/detect-libc/lib/detect-libc.js
var require_detect_libc = __commonJS({
  "../../node_modules/.pnpm/detect-libc@2.1.2/node_modules/detect-libc/lib/detect-libc.js"(exports2, module2) {
    "use strict";
    var childProcess = require("child_process");
    var { isLinux, getReport } = require_process();
    var { LDD_PATH, SELF_PATH, readFile, readFileSync } = require_filesystem();
    var { interpreterPath } = require_elf();
    var cachedFamilyInterpreter;
    var cachedFamilyFilesystem;
    var cachedVersionFilesystem;
    var command = "getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true";
    var commandOut = "";
    var safeCommand = () => {
      if (!commandOut) {
        return new Promise((resolve) => {
          childProcess.exec(command, (err, out) => {
            commandOut = err ? " " : out;
            resolve(commandOut);
          });
        });
      }
      return commandOut;
    };
    var safeCommandSync = () => {
      if (!commandOut) {
        try {
          commandOut = childProcess.execSync(command, { encoding: "utf8" });
        } catch (_err) {
          commandOut = " ";
        }
      }
      return commandOut;
    };
    var GLIBC = "glibc";
    var RE_GLIBC_VERSION = /LIBC[a-z0-9 \-).]*?(\d+\.\d+)/i;
    var MUSL = "musl";
    var isFileMusl = (f) => f.includes("libc.musl-") || f.includes("ld-musl-");
    var familyFromReport = () => {
      const report = getReport();
      if (report.header && report.header.glibcVersionRuntime) {
        return GLIBC;
      }
      if (Array.isArray(report.sharedObjects)) {
        if (report.sharedObjects.some(isFileMusl)) {
          return MUSL;
        }
      }
      return null;
    };
    var familyFromCommand = (out) => {
      const [getconf, ldd1] = out.split(/[\r\n]+/);
      if (getconf && getconf.includes(GLIBC)) {
        return GLIBC;
      }
      if (ldd1 && ldd1.includes(MUSL)) {
        return MUSL;
      }
      return null;
    };
    var familyFromInterpreterPath = (path) => {
      if (path) {
        if (path.includes("/ld-musl-")) {
          return MUSL;
        } else if (path.includes("/ld-linux-")) {
          return GLIBC;
        }
      }
      return null;
    };
    var getFamilyFromLddContent = (content) => {
      content = content.toString();
      if (content.includes("musl")) {
        return MUSL;
      }
      if (content.includes("GNU C Library")) {
        return GLIBC;
      }
      return null;
    };
    var familyFromFilesystem = async () => {
      if (cachedFamilyFilesystem !== void 0) {
        return cachedFamilyFilesystem;
      }
      cachedFamilyFilesystem = null;
      try {
        const lddContent = await readFile(LDD_PATH);
        cachedFamilyFilesystem = getFamilyFromLddContent(lddContent);
      } catch (e) {
      }
      return cachedFamilyFilesystem;
    };
    var familyFromFilesystemSync = () => {
      if (cachedFamilyFilesystem !== void 0) {
        return cachedFamilyFilesystem;
      }
      cachedFamilyFilesystem = null;
      try {
        const lddContent = readFileSync(LDD_PATH);
        cachedFamilyFilesystem = getFamilyFromLddContent(lddContent);
      } catch (e) {
      }
      return cachedFamilyFilesystem;
    };
    var familyFromInterpreter = async () => {
      if (cachedFamilyInterpreter !== void 0) {
        return cachedFamilyInterpreter;
      }
      cachedFamilyInterpreter = null;
      try {
        const selfContent = await readFile(SELF_PATH);
        const path = interpreterPath(selfContent);
        cachedFamilyInterpreter = familyFromInterpreterPath(path);
      } catch (e) {
      }
      return cachedFamilyInterpreter;
    };
    var familyFromInterpreterSync = () => {
      if (cachedFamilyInterpreter !== void 0) {
        return cachedFamilyInterpreter;
      }
      cachedFamilyInterpreter = null;
      try {
        const selfContent = readFileSync(SELF_PATH);
        const path = interpreterPath(selfContent);
        cachedFamilyInterpreter = familyFromInterpreterPath(path);
      } catch (e) {
      }
      return cachedFamilyInterpreter;
    };
    var family = async () => {
      let family2 = null;
      if (isLinux()) {
        family2 = await familyFromInterpreter();
        if (!family2) {
          family2 = await familyFromFilesystem();
          if (!family2) {
            family2 = familyFromReport();
          }
          if (!family2) {
            const out = await safeCommand();
            family2 = familyFromCommand(out);
          }
        }
      }
      return family2;
    };
    var familySync = () => {
      let family2 = null;
      if (isLinux()) {
        family2 = familyFromInterpreterSync();
        if (!family2) {
          family2 = familyFromFilesystemSync();
          if (!family2) {
            family2 = familyFromReport();
          }
          if (!family2) {
            const out = safeCommandSync();
            family2 = familyFromCommand(out);
          }
        }
      }
      return family2;
    };
    var isNonGlibcLinux = async () => isLinux() && await family() !== GLIBC;
    var isNonGlibcLinuxSync = () => isLinux() && familySync() !== GLIBC;
    var versionFromFilesystem = async () => {
      if (cachedVersionFilesystem !== void 0) {
        return cachedVersionFilesystem;
      }
      cachedVersionFilesystem = null;
      try {
        const lddContent = await readFile(LDD_PATH);
        const versionMatch = lddContent.match(RE_GLIBC_VERSION);
        if (versionMatch) {
          cachedVersionFilesystem = versionMatch[1];
        }
      } catch (e) {
      }
      return cachedVersionFilesystem;
    };
    var versionFromFilesystemSync = () => {
      if (cachedVersionFilesystem !== void 0) {
        return cachedVersionFilesystem;
      }
      cachedVersionFilesystem = null;
      try {
        const lddContent = readFileSync(LDD_PATH);
        const versionMatch = lddContent.match(RE_GLIBC_VERSION);
        if (versionMatch) {
          cachedVersionFilesystem = versionMatch[1];
        }
      } catch (e) {
      }
      return cachedVersionFilesystem;
    };
    var versionFromReport = () => {
      const report = getReport();
      if (report.header && report.header.glibcVersionRuntime) {
        return report.header.glibcVersionRuntime;
      }
      return null;
    };
    var versionSuffix = (s) => s.trim().split(/\s+/)[1];
    var versionFromCommand = (out) => {
      const [getconf, ldd1, ldd2] = out.split(/[\r\n]+/);
      if (getconf && getconf.includes(GLIBC)) {
        return versionSuffix(getconf);
      }
      if (ldd1 && ldd2 && ldd1.includes(MUSL)) {
        return versionSuffix(ldd2);
      }
      return null;
    };
    var version = async () => {
      let version2 = null;
      if (isLinux()) {
        version2 = await versionFromFilesystem();
        if (!version2) {
          version2 = versionFromReport();
        }
        if (!version2) {
          const out = await safeCommand();
          version2 = versionFromCommand(out);
        }
      }
      return version2;
    };
    var versionSync = () => {
      let version2 = null;
      if (isLinux()) {
        version2 = versionFromFilesystemSync();
        if (!version2) {
          version2 = versionFromReport();
        }
        if (!version2) {
          const out = safeCommandSync();
          version2 = versionFromCommand(out);
        }
      }
      return version2;
    };
    module2.exports = {
      GLIBC,
      MUSL,
      family,
      familySync,
      isNonGlibcLinux,
      isNonGlibcLinuxSync,
      version,
      versionSync
    };
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/debug.js"(exports2, module2) {
    "use strict";
    var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module2.exports = debug;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/constants.js"(exports2, module2) {
    "use strict";
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
    9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
    var RELEASE_TYPES = [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ];
    module2.exports = {
      MAX_LENGTH,
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_SAFE_INTEGER,
      RELEASE_TYPES,
      SEMVER_SPEC_VERSION,
      FLAG_INCLUDE_PRERELEASE: 1,
      FLAG_LOOSE: 2
    };
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/re.js
var require_re = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/re.js"(exports2, module2) {
    "use strict";
    var {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = require_constants();
    var debug = require_debug();
    exports2 = module2.exports = {};
    var re = exports2.re = [];
    var safeRe = exports2.safeRe = [];
    var src = exports2.src = [];
    var safeSrc = exports2.safeSrc = [];
    var t = exports2.t = {};
    var R = 0;
    var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    var safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    var makeSafeRegex = (value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    };
    var createToken = (name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug(name, index, value);
      t[name] = index;
      src[index] = value;
      safeSrc[index] = safe;
      re[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports2.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports2.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports2.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/parse-options.js"(exports2, module2) {
    "use strict";
    var looseOption = Object.freeze({ loose: true });
    var emptyOpts = Object.freeze({});
    var parseOptions = (options) => {
      if (!options) {
        return emptyOpts;
      }
      if (typeof options !== "object") {
        return looseOption;
      }
      return options;
    };
    module2.exports = parseOptions;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/identifiers.js"(exports2, module2) {
    "use strict";
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a, b) => {
      if (typeof a === "number" && typeof b === "number") {
        return a === b ? 0 : a < b ? -1 : 1;
      }
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    };
    var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
    module2.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/semver.js"(exports2, module2) {
    "use strict";
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { safeRe: re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var SemVer = class _SemVer {
      constructor(version, options) {
        options = parseOptions(options);
        if (version instanceof _SemVer) {
          if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
            return version;
          } else {
            version = version.version;
          }
        } else if (typeof version !== "string") {
          throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
          throw new TypeError(
            `version is longer than ${MAX_LENGTH} characters`
          );
        }
        debug("SemVer", version, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split(".").map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof _SemVer)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new _SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.major < other.major) {
          return -1;
        }
        if (this.major > other.major) {
          return 1;
        }
        if (this.minor < other.minor) {
          return -1;
        }
        if (this.minor > other.minor) {
          return 1;
        }
        if (this.patch < other.patch) {
          return -1;
        }
        if (this.patch > other.patch) {
          return 1;
        }
        return 0;
      }
      comparePre(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b = other.prerelease[i];
          debug("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b = other.build[i];
          debug("build compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.
      inc(release, identifier, identifierBase) {
        if (release.startsWith("pre")) {
          if (!identifier && identifierBase === false) {
            throw new Error("invalid increment argument: identifier is empty");
          }
          if (identifier) {
            const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
            if (!match || match[1] !== identifier) {
              throw new Error(`invalid identifier: ${identifier}`);
            }
          }
        }
        switch (release) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier, identifierBase);
            this.inc("pre", identifier, identifierBase);
            break;
          // If the input is a non-prerelease version, this acts the same as
          // prepatch.
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier, identifierBase);
            }
            this.inc("pre", identifier, identifierBase);
            break;
          case "release":
            if (this.prerelease.length === 0) {
              throw new Error(`version ${this.raw} is not a prerelease`);
            }
            this.prerelease.length = 0;
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          // This probably shouldn't be used publicly.
          // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
          case "pre": {
            const base = Number(identifierBase) ? 1 : 0;
            if (this.prerelease.length === 0) {
              this.prerelease = [base];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === "number") {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                if (identifier === this.prerelease.join(".") && identifierBase === false) {
                  throw new Error("invalid increment argument: identifier already exists");
                }
                this.prerelease.push(base);
              }
            }
            if (identifier) {
              let prerelease = [identifier, base];
              if (identifierBase === false) {
                prerelease = [identifier];
              }
              if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                if (isNaN(this.prerelease[1])) {
                  this.prerelease = prerelease;
                }
              } else {
                this.prerelease = prerelease;
              }
            }
            break;
          }
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
          this.raw += `+${this.build.join(".")}`;
        }
        return this;
      }
    };
    module2.exports = SemVer;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/parse.js
var require_parse = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/parse.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var parse = (version, options, throwErrors = false) => {
      if (version instanceof SemVer) {
        return version;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        if (!throwErrors) {
          return null;
        }
        throw er;
      }
    };
    module2.exports = parse;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/coerce.js
var require_coerce = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/coerce.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var parse = require_parse();
    var { safeRe: re, t } = require_re();
    var coerce = (version, options) => {
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version === "number") {
        version = String(version);
      }
      if (typeof version !== "string") {
        return null;
      }
      options = options || {};
      let match = null;
      if (!options.rtl) {
        match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
      } else {
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        coerceRtlRegex.lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      const major = match[2];
      const minor = match[3] || "0";
      const patch = match[4] || "0";
      const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
      const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
      return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
    };
    module2.exports = coerce;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/compare.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
    module2.exports = compare;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/gte.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var gte = (a, b, loose) => compare(a, b, loose) >= 0;
    module2.exports = gte;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/lrucache.js
var require_lrucache = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/internal/lrucache.js"(exports2, module2) {
    "use strict";
    var LRUCache = class {
      constructor() {
        this.max = 1e3;
        this.map = /* @__PURE__ */ new Map();
      }
      get(key) {
        const value = this.map.get(key);
        if (value === void 0) {
          return void 0;
        } else {
          this.map.delete(key);
          this.map.set(key, value);
          return value;
        }
      }
      delete(key) {
        return this.map.delete(key);
      }
      set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== void 0) {
          if (this.map.size >= this.max) {
            const firstKey = this.map.keys().next().value;
            this.delete(firstKey);
          }
          this.map.set(key, value);
        }
        return this;
      }
    };
    module2.exports = LRUCache;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/eq.js
var require_eq = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/eq.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var eq = (a, b, loose) => compare(a, b, loose) === 0;
    module2.exports = eq;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/neq.js
var require_neq = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/neq.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var neq = (a, b, loose) => compare(a, b, loose) !== 0;
    module2.exports = neq;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/gt.js
var require_gt = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/gt.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var gt = (a, b, loose) => compare(a, b, loose) > 0;
    module2.exports = gt;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/lt.js
var require_lt = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/lt.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var lt = (a, b, loose) => compare(a, b, loose) < 0;
    module2.exports = lt;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/lte.js
var require_lte = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/lte.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var lte = (a, b, loose) => compare(a, b, loose) <= 0;
    module2.exports = lte;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/cmp.js
var require_cmp = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/cmp.js"(exports2, module2) {
    "use strict";
    var eq = require_eq();
    var neq = require_neq();
    var gt = require_gt();
    var gte = require_gte();
    var lt = require_lt();
    var lte = require_lte();
    var cmp = (a, op, b, loose) => {
      switch (op) {
        case "===":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a === b;
        case "!==":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt(a, b, loose);
        case ">=":
          return gte(a, b, loose);
        case "<":
          return lt(a, b, loose);
        case "<=":
          return lte(a, b, loose);
        default:
          throw new TypeError(`Invalid operator: ${op}`);
      }
    };
    module2.exports = cmp;
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/comparator.js
var require_comparator = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/comparator.js"(exports2, module2) {
    "use strict";
    var ANY = /* @__PURE__ */ Symbol("SemVer ANY");
    var Comparator = class _Comparator {
      static get ANY() {
        return ANY;
      }
      constructor(comp, options) {
        options = parseOptions(options);
        if (comp instanceof _Comparator) {
          if (comp.loose === !!options.loose) {
            return comp;
          } else {
            comp = comp.value;
          }
        }
        comp = comp.trim().split(/\s+/).join(" ");
        debug("comparator", comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
          this.value = "";
        } else {
          this.value = this.operator + this.semver.version;
        }
        debug("comp", this);
      }
      parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
          throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== void 0 ? m[1] : "";
        if (this.operator === "=") {
          this.operator = "";
        }
        if (!m[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer(m[2], this.options.loose);
        }
      }
      toString() {
        return this.value;
      }
      test(version) {
        debug("Comparator.test", version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
          return true;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        return cmp(version, this.operator, this.semver, this.options);
      }
      intersects(comp, options) {
        if (!(comp instanceof _Comparator)) {
          throw new TypeError("a Comparator is required");
        }
        if (this.operator === "") {
          if (this.value === "") {
            return true;
          }
          return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === "") {
          if (comp.value === "") {
            return true;
          }
          return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
          return false;
        }
        if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
          return false;
        }
        if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
          return true;
        }
        if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
          return true;
        }
        if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
          return true;
        }
        if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
          return true;
        }
        if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
          return true;
        }
        return false;
      }
    };
    module2.exports = Comparator;
    var parseOptions = require_parse_options();
    var { safeRe: re, t } = require_re();
    var cmp = require_cmp();
    var debug = require_debug();
    var SemVer = require_semver();
    var Range = require_range();
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/range.js
var require_range = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/classes/range.js"(exports2, module2) {
    "use strict";
    var SPACE_CHARACTERS = /\s+/g;
    var Range = class _Range {
      constructor(range, options) {
        options = parseOptions(options);
        if (range instanceof _Range) {
          if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
            return range;
          } else {
            return new _Range(range.raw, options);
          }
        }
        if (range instanceof Comparator) {
          this.raw = range.value;
          this.set = [[range]];
          this.formatted = void 0;
          return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
        this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        if (this.set.length > 1) {
          const first = this.set[0];
          this.set = this.set.filter((c) => !isNullSet(c[0]));
          if (this.set.length === 0) {
            this.set = [first];
          } else if (this.set.length > 1) {
            for (const c of this.set) {
              if (c.length === 1 && isAny(c[0])) {
                this.set = [c];
                break;
              }
            }
          }
        }
        this.formatted = void 0;
      }
      get range() {
        if (this.formatted === void 0) {
          this.formatted = "";
          for (let i = 0; i < this.set.length; i++) {
            if (i > 0) {
              this.formatted += "||";
            }
            const comps = this.set[i];
            for (let k = 0; k < comps.length; k++) {
              if (k > 0) {
                this.formatted += " ";
              }
              this.formatted += comps[k].toString().trim();
            }
          }
        }
        return this.formatted;
      }
      format() {
        return this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(range) {
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ":" + range;
        const cached = cache.get(memoKey);
        if (cached) {
          return cached;
        }
        const loose = this.options.loose;
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug("hyphen replace", range);
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug("comparator trim", range);
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug("tilde trim", range);
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug("caret trim", range);
        let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
        if (loose) {
          rangeList = rangeList.filter((comp) => {
            debug("loose invalid filter", comp, this.options);
            return !!comp.match(re[t.COMPARATORLOOSE]);
          });
        }
        debug("range list", rangeList);
        const rangeMap = /* @__PURE__ */ new Map();
        const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
        for (const comp of comparators) {
          if (isNullSet(comp)) {
            return [comp];
          }
          rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has("")) {
          rangeMap.delete("");
        }
        const result = [...rangeMap.values()];
        cache.set(memoKey, result);
        return result;
      }
      intersects(range, options) {
        if (!(range instanceof _Range)) {
          throw new TypeError("a Range is required");
        }
        return this.set.some((thisComparators) => {
          return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
            return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options);
              });
            });
          });
        });
      }
      // if ANY of the sets match ALL of its comparators, then pass
      test(version) {
        if (!version) {
          return false;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        for (let i = 0; i < this.set.length; i++) {
          if (testSet(this.set[i], version, this.options)) {
            return true;
          }
        }
        return false;
      }
    };
    module2.exports = Range;
    var LRU = require_lrucache();
    var cache = new LRU();
    var parseOptions = require_parse_options();
    var Comparator = require_comparator();
    var debug = require_debug();
    var SemVer = require_semver();
    var {
      safeRe: re,
      t,
      comparatorTrimReplace,
      tildeTrimReplace,
      caretTrimReplace
    } = require_re();
    var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
    var isNullSet = (c) => c.value === "<0.0.0-0";
    var isAny = (c) => c.value === "";
    var isSatisfiable = (comparators, options) => {
      let result = true;
      const remainingComparators = comparators.slice();
      let testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every((otherComparator) => {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    };
    var parseComparator = (comp, options) => {
      comp = comp.replace(re[t.BUILD], "");
      debug("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug("caret", comp);
      comp = replaceTildes(comp, options);
      debug("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug("xrange", comp);
      comp = replaceStars(comp, options);
      debug("stars", comp);
      return comp;
    };
    var isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
    var replaceTildes = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
    };
    var replaceTilde = (comp, options) => {
      const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("tilde", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
        } else if (pr) {
          debug("replaceTilde pr", pr);
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug("tilde return", ret);
        return ret;
      });
    };
    var replaceCarets = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
    };
    var replaceCaret = (comp, options) => {
      debug("caret", comp, options);
      const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      const z = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("caret", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          if (M === "0") {
            ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          debug("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          debug("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
          }
        }
        debug("caret return", ret);
        return ret;
      });
    };
    var replaceXRanges = (comp, options) => {
      debug("replaceXRanges", comp, options);
      return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
    };
    var replaceXRange = (comp, options) => {
      comp = comp.trim();
      const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        debug("xRange", comp, ret, gtlt, M, m, p, pr);
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          if (gtlt === "<") {
            pr = "-0";
          }
          ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug("xRange return", ret);
        return ret;
      });
    };
    var replaceStars = (comp, options) => {
      debug("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    };
    var replaceGTE0 = (comp, options) => {
      debug("replaceGTE0", comp, options);
      return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
    };
    var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
      } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
      } else if (fpr) {
        from = `>=${from}`;
      } else {
        from = `>=${from}${incPr ? "-0" : ""}`;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = `<${+tM + 1}.0.0-0`;
      } else if (isX(tp)) {
        to = `<${tM}.${+tm + 1}.0-0`;
      } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
      } else if (incPr) {
        to = `<${tM}.${tm}.${+tp + 1}-0`;
      } else {
        to = `<=${to}`;
      }
      return `${from} ${to}`.trim();
    };
    var testSet = (set, version, options) => {
      for (let i = 0; i < set.length; i++) {
        if (!set[i].test(version)) {
          return false;
        }
      }
      if (version.prerelease.length && !options.includePrerelease) {
        for (let i = 0; i < set.length; i++) {
          debug(set[i].semver);
          if (set[i].semver === Comparator.ANY) {
            continue;
          }
          if (set[i].semver.prerelease.length > 0) {
            const allowed = set[i].semver;
            if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    };
  }
});

// ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS({
  "../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/satisfies.js"(exports2, module2) {
    "use strict";
    var Range = require_range();
    var satisfies = (version, range, options) => {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version);
    };
    module2.exports = satisfies;
  }
});

// ../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/package.json
var require_package = __commonJS({
  "../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/package.json"(exports2, module2) {
    module2.exports = {
      name: "sharp",
      description: "High performance Node.js image processing, the fastest module to resize JPEG, PNG, WebP, GIF, AVIF and TIFF images",
      version: "0.34.5",
      author: "Lovell Fuller <npm@lovell.info>",
      homepage: "https://sharp.pixelplumbing.com",
      contributors: [
        "Pierre Inglebert <pierre.inglebert@gmail.com>",
        "Jonathan Ong <jonathanrichardong@gmail.com>",
        "Chanon Sajjamanochai <chanon.s@gmail.com>",
        "Juliano Julio <julianojulio@gmail.com>",
        "Daniel Gasienica <daniel@gasienica.ch>",
        "Julian Walker <julian@fiftythree.com>",
        "Amit Pitaru <pitaru.amit@gmail.com>",
        "Brandon Aaron <hello.brandon@aaron.sh>",
        "Andreas Lind <andreas@one.com>",
        "Maurus Cuelenaere <mcuelenaere@gmail.com>",
        "Linus Unneb\xE4ck <linus@folkdatorn.se>",
        "Victor Mateevitsi <mvictoras@gmail.com>",
        "Alaric Holloway <alaric.holloway@gmail.com>",
        "Bernhard K. Weisshuhn <bkw@codingforce.com>",
        "Chris Riley <criley@primedia.com>",
        "David Carley <dacarley@gmail.com>",
        "John Tobin <john@limelightmobileinc.com>",
        "Kenton Gray <kentongray@gmail.com>",
        "Felix B\xFCnemann <Felix.Buenemann@gmail.com>",
        "Samy Al Zahrani <samyalzahrany@gmail.com>",
        "Chintan Thakkar <lemnisk8@gmail.com>",
        "F. Orlando Galashan <frulo@gmx.de>",
        "Kleis Auke Wolthuizen <info@kleisauke.nl>",
        "Matt Hirsch <mhirsch@media.mit.edu>",
        "Matthias Thoemmes <thoemmes@gmail.com>",
        "Patrick Paskaris <patrick@paskaris.gr>",
        "J\xE9r\xE9my Lal <kapouer@melix.org>",
        "Rahul Nanwani <r.nanwani@gmail.com>",
        "Alice Monday <alice0meta@gmail.com>",
        "Kristo Jorgenson <kristo.jorgenson@gmail.com>",
        "YvesBos <yves_bos@outlook.com>",
        "Guy Maliar <guy@tailorbrands.com>",
        "Nicolas Coden <nicolas@ncoden.fr>",
        "Matt Parrish <matt.r.parrish@gmail.com>",
        "Marcel Bretschneider <marcel.bretschneider@gmail.com>",
        "Matthew McEachen <matthew+github@mceachen.org>",
        "Jarda Kot\u011B\u0161ovec <jarda.kotesovec@gmail.com>",
        "Kenric D'Souza <kenric.dsouza@gmail.com>",
        "Oleh Aleinyk <oleg.aleynik@gmail.com>",
        "Marcel Bretschneider <marcel.bretschneider@gmail.com>",
        "Andrea Bianco <andrea.bianco@unibas.ch>",
        "Rik Heywood <rik@rik.org>",
        "Thomas Parisot <hi@oncletom.io>",
        "Nathan Graves <nathanrgraves+github@gmail.com>",
        "Tom Lokhorst <tom@lokhorst.eu>",
        "Espen Hovlandsdal <espen@hovlandsdal.com>",
        "Sylvain Dumont <sylvain.dumont35@gmail.com>",
        "Alun Davies <alun.owain.davies@googlemail.com>",
        "Aidan Hoolachan <ajhoolachan21@gmail.com>",
        "Axel Eirola <axel.eirola@iki.fi>",
        "Freezy <freezy@xbmc.org>",
        "Daiz <taneli.vatanen@gmail.com>",
        "Julian Aubourg <j@ubourg.net>",
        "Keith Belovay <keith@picthrive.com>",
        "Michael B. Klein <mbklein@gmail.com>",
        "Jordan Prudhomme <jordan@raboland.fr>",
        "Ilya Ovdin <iovdin@gmail.com>",
        "Andargor <andargor@yahoo.com>",
        "Paul Neave <paul.neave@gmail.com>",
        "Brendan Kennedy <brenwken@gmail.com>",
        "Brychan Bennett-Odlum <git@brychan.io>",
        "Edward Silverton <e.silverton@gmail.com>",
        "Roman Malieiev <aromaleev@gmail.com>",
        "Tomas Szabo <tomas.szabo@deftomat.com>",
        "Robert O'Rourke <robert@o-rourke.org>",
        "Guillermo Alfonso Varela Chouci\xF1o <guillevch@gmail.com>",
        "Christian Flintrup <chr@gigahost.dk>",
        "Manan Jadhav <manan@motionden.com>",
        "Leon Radley <leon@radley.se>",
        "alza54 <alza54@thiocod.in>",
        "Jacob Smith <jacob@frende.me>",
        "Michael Nutt <michael@nutt.im>",
        "Brad Parham <baparham@gmail.com>",
        "Taneli Vatanen <taneli.vatanen@gmail.com>",
        "Joris Dugu\xE9 <zaruike10@gmail.com>",
        "Chris Banks <christopher.bradley.banks@gmail.com>",
        "Ompal Singh <ompal.hitm09@gmail.com>",
        "Brodan <christopher.hranj@gmail.com>",
        "Ankur Parihar <ankur.github@gmail.com>",
        "Brahim Ait elhaj <brahima@gmail.com>",
        "Mart Jansink <m.jansink@gmail.com>",
        "Lachlan Newman <lachnewman007@gmail.com>",
        "Dennis Beatty <dennis@dcbeatty.com>",
        "Ingvar Stepanyan <me@rreverser.com>",
        "Don Denton <don@happycollision.com>"
      ],
      scripts: {
        build: "node install/build.js",
        install: "node install/check.js || npm run build",
        clean: "rm -rf src/build/ .nyc_output/ coverage/ test/fixtures/output.*",
        test: "npm run lint && npm run test-unit",
        lint: "npm run lint-cpp && npm run lint-js && npm run lint-types",
        "lint-cpp": "cpplint --quiet src/*.h src/*.cc",
        "lint-js": "biome lint",
        "lint-types": "tsd --files ./test/types/sharp.test-d.ts",
        "test-leak": "./test/leak/leak.sh",
        "test-unit": "node --experimental-test-coverage test/unit.mjs",
        "package-from-local-build": "node npm/from-local-build.js",
        "package-release-notes": "node npm/release-notes.js",
        "docs-build": "node docs/build.mjs",
        "docs-serve": "cd docs && npm start",
        "docs-publish": "cd docs && npm run build && npx firebase-tools deploy --project pixelplumbing --only hosting:pixelplumbing-sharp"
      },
      type: "commonjs",
      main: "lib/index.js",
      types: "lib/index.d.ts",
      files: [
        "install",
        "lib",
        "src/*.{cc,h,gyp}"
      ],
      repository: {
        type: "git",
        url: "git://github.com/lovell/sharp.git"
      },
      keywords: [
        "jpeg",
        "png",
        "webp",
        "avif",
        "tiff",
        "gif",
        "svg",
        "jp2",
        "dzi",
        "image",
        "resize",
        "thumbnail",
        "crop",
        "embed",
        "libvips",
        "vips"
      ],
      dependencies: {
        "@img/colour": "^1.0.0",
        "detect-libc": "^2.1.2",
        semver: "^7.7.3"
      },
      optionalDependencies: {
        "@img/sharp-darwin-arm64": "0.34.5",
        "@img/sharp-darwin-x64": "0.34.5",
        "@img/sharp-libvips-darwin-arm64": "1.2.4",
        "@img/sharp-libvips-darwin-x64": "1.2.4",
        "@img/sharp-libvips-linux-arm": "1.2.4",
        "@img/sharp-libvips-linux-arm64": "1.2.4",
        "@img/sharp-libvips-linux-ppc64": "1.2.4",
        "@img/sharp-libvips-linux-riscv64": "1.2.4",
        "@img/sharp-libvips-linux-s390x": "1.2.4",
        "@img/sharp-libvips-linux-x64": "1.2.4",
        "@img/sharp-libvips-linuxmusl-arm64": "1.2.4",
        "@img/sharp-libvips-linuxmusl-x64": "1.2.4",
        "@img/sharp-linux-arm": "0.34.5",
        "@img/sharp-linux-arm64": "0.34.5",
        "@img/sharp-linux-ppc64": "0.34.5",
        "@img/sharp-linux-riscv64": "0.34.5",
        "@img/sharp-linux-s390x": "0.34.5",
        "@img/sharp-linux-x64": "0.34.5",
        "@img/sharp-linuxmusl-arm64": "0.34.5",
        "@img/sharp-linuxmusl-x64": "0.34.5",
        "@img/sharp-wasm32": "0.34.5",
        "@img/sharp-win32-arm64": "0.34.5",
        "@img/sharp-win32-ia32": "0.34.5",
        "@img/sharp-win32-x64": "0.34.5"
      },
      devDependencies: {
        "@biomejs/biome": "^2.3.4",
        "@cpplint/cli": "^0.1.0",
        "@emnapi/runtime": "^1.7.0",
        "@img/sharp-libvips-dev": "1.2.4",
        "@img/sharp-libvips-dev-wasm32": "1.2.4",
        "@img/sharp-libvips-win32-arm64": "1.2.4",
        "@img/sharp-libvips-win32-ia32": "1.2.4",
        "@img/sharp-libvips-win32-x64": "1.2.4",
        "@types/node": "*",
        emnapi: "^1.7.0",
        "exif-reader": "^2.0.2",
        "extract-zip": "^2.0.1",
        icc: "^3.0.0",
        "jsdoc-to-markdown": "^9.1.3",
        "node-addon-api": "^8.5.0",
        "node-gyp": "^11.5.0",
        "tar-fs": "^3.1.1",
        tsd: "^0.33.0"
      },
      license: "Apache-2.0",
      engines: {
        node: "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      config: {
        libvips: ">=8.17.3"
      },
      funding: {
        url: "https://opencollective.com/libvips"
      }
    };
  }
});

// ../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/libvips.js
var require_libvips = __commonJS({
  "../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/libvips.js"(exports2, module2) {
    var { spawnSync } = require("node:child_process");
    var { createHash } = require("node:crypto");
    var semverCoerce = require_coerce();
    var semverGreaterThanOrEqualTo = require_gte();
    var semverSatisfies = require_satisfies();
    var detectLibc = require_detect_libc();
    var { config, engines, optionalDependencies } = require_package();
    var minimumLibvipsVersionLabelled = process.env.npm_package_config_libvips || config.libvips;
    var minimumLibvipsVersion = semverCoerce(minimumLibvipsVersionLabelled).version;
    var prebuiltPlatforms = [
      "darwin-arm64",
      "darwin-x64",
      "linux-arm",
      "linux-arm64",
      "linux-ppc64",
      "linux-riscv64",
      "linux-s390x",
      "linux-x64",
      "linuxmusl-arm64",
      "linuxmusl-x64",
      "win32-arm64",
      "win32-ia32",
      "win32-x64"
    ];
    var spawnSyncOptions = {
      encoding: "utf8",
      shell: true
    };
    var log = (item) => {
      if (item instanceof Error) {
        console.error(`sharp: Installation error: ${item.message}`);
      } else {
        console.log(`sharp: ${item}`);
      }
    };
    var runtimeLibc = () => detectLibc.isNonGlibcLinuxSync() ? detectLibc.familySync() : "";
    var runtimePlatformArch = () => `${process.platform}${runtimeLibc()}-${process.arch}`;
    var buildPlatformArch = () => {
      if (isEmscripten()) {
        return "wasm32";
      }
      const { npm_config_arch, npm_config_platform, npm_config_libc } = process.env;
      const libc = typeof npm_config_libc === "string" ? npm_config_libc : runtimeLibc();
      return `${npm_config_platform || process.platform}${libc}-${npm_config_arch || process.arch}`;
    };
    var buildSharpLibvipsIncludeDir = () => {
      try {
        return require(`@img/sharp-libvips-dev-${buildPlatformArch()}/include`);
      } catch {
        try {
          return require("@img/sharp-libvips-dev/include");
        } catch {
        }
      }
      return "";
    };
    var buildSharpLibvipsCPlusPlusDir = () => {
      try {
        return require("@img/sharp-libvips-dev/cplusplus");
      } catch {
      }
      return "";
    };
    var buildSharpLibvipsLibDir = () => {
      try {
        return require(`@img/sharp-libvips-dev-${buildPlatformArch()}/lib`);
      } catch {
        try {
          return require(`@img/sharp-libvips-${buildPlatformArch()}/lib`);
        } catch {
        }
      }
      return "";
    };
    var isUnsupportedNodeRuntime = () => {
      if (process.release?.name === "node" && process.versions) {
        if (!semverSatisfies(process.versions.node, engines.node)) {
          return { found: process.versions.node, expected: engines.node };
        }
      }
    };
    var isEmscripten = () => {
      const { CC } = process.env;
      return Boolean(CC?.endsWith("/emcc"));
    };
    var isRosetta = () => {
      if (process.platform === "darwin" && process.arch === "x64") {
        const translated = spawnSync("sysctl sysctl.proc_translated", spawnSyncOptions).stdout;
        return (translated || "").trim() === "sysctl.proc_translated: 1";
      }
      return false;
    };
    var sha512 = (s) => createHash("sha512").update(s).digest("hex");
    var yarnLocator = () => {
      try {
        const identHash = sha512(`imgsharp-libvips-${buildPlatformArch()}`);
        const npmVersion = semverCoerce(optionalDependencies[`@img/sharp-libvips-${buildPlatformArch()}`], {
          includePrerelease: true
        }).version;
        return sha512(`${identHash}npm:${npmVersion}`).slice(0, 10);
      } catch {
      }
      return "";
    };
    var spawnRebuild = () => spawnSync(`node-gyp rebuild --directory=src ${isEmscripten() ? "--nodedir=emscripten" : ""}`, {
      ...spawnSyncOptions,
      stdio: "inherit"
    }).status;
    var globalLibvipsVersion = () => {
      if (process.platform !== "win32") {
        const globalLibvipsVersion2 = spawnSync("pkg-config --modversion vips-cpp", {
          ...spawnSyncOptions,
          env: {
            ...process.env,
            PKG_CONFIG_PATH: pkgConfigPath()
          }
        }).stdout;
        return (globalLibvipsVersion2 || "").trim();
      } else {
        return "";
      }
    };
    var pkgConfigPath = () => {
      if (process.platform !== "win32") {
        const brewPkgConfigPath = spawnSync(
          'which brew >/dev/null 2>&1 && brew environment --plain | grep PKG_CONFIG_LIBDIR | cut -d" " -f2',
          spawnSyncOptions
        ).stdout || "";
        return [
          brewPkgConfigPath.trim(),
          process.env.PKG_CONFIG_PATH,
          "/usr/local/lib/pkgconfig",
          "/usr/lib/pkgconfig",
          "/usr/local/libdata/pkgconfig",
          "/usr/libdata/pkgconfig"
        ].filter(Boolean).join(":");
      } else {
        return "";
      }
    };
    var skipSearch = (status, reason, logger) => {
      if (logger) {
        logger(`Detected ${reason}, skipping search for globally-installed libvips`);
      }
      return status;
    };
    var useGlobalLibvips = (logger) => {
      if (Boolean(process.env.SHARP_IGNORE_GLOBAL_LIBVIPS) === true) {
        return skipSearch(false, "SHARP_IGNORE_GLOBAL_LIBVIPS", logger);
      }
      if (Boolean(process.env.SHARP_FORCE_GLOBAL_LIBVIPS) === true) {
        return skipSearch(true, "SHARP_FORCE_GLOBAL_LIBVIPS", logger);
      }
      if (isRosetta()) {
        return skipSearch(false, "Rosetta", logger);
      }
      const globalVipsVersion = globalLibvipsVersion();
      return !!globalVipsVersion && semverGreaterThanOrEqualTo(globalVipsVersion, minimumLibvipsVersion);
    };
    module2.exports = {
      minimumLibvipsVersion,
      prebuiltPlatforms,
      buildPlatformArch,
      buildSharpLibvipsIncludeDir,
      buildSharpLibvipsCPlusPlusDir,
      buildSharpLibvipsLibDir,
      isUnsupportedNodeRuntime,
      runtimePlatformArch,
      log,
      yarnLocator,
      spawnRebuild,
      globalLibvipsVersion,
      pkgConfigPath,
      useGlobalLibvips
    };
  }
});

// ../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/sharp.js
var require_sharp = __commonJS({
  "../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/sharp.js"(exports2, module2) {
    var { familySync, versionSync } = require_detect_libc();
    var { runtimePlatformArch, isUnsupportedNodeRuntime, prebuiltPlatforms, minimumLibvipsVersion } = require_libvips();
    var runtimePlatform = runtimePlatformArch();
    var paths = [
      `../src/build/Release/sharp-${runtimePlatform}.node`,
      "../src/build/Release/sharp-wasm32.node",
      `@img/sharp-${runtimePlatform}/sharp.node`,
      "@img/sharp-wasm32/sharp.node"
    ];
    var path;
    var sharp2;
    var errors = [];
    for (path of paths) {
      try {
        sharp2 = require(path);
        break;
      } catch (err) {
        errors.push(err);
      }
    }
    if (sharp2 && path.startsWith("@img/sharp-linux-x64") && !sharp2._isUsingX64V2()) {
      const err = new Error("Prebuilt binaries for linux-x64 require v2 microarchitecture");
      err.code = "Unsupported CPU";
      errors.push(err);
      sharp2 = null;
    }
    if (sharp2) {
      module2.exports = sharp2;
    } else {
      const [isLinux, isMacOs, isWindows] = ["linux", "darwin", "win32"].map((os) => runtimePlatform.startsWith(os));
      const help = [`Could not load the "sharp" module using the ${runtimePlatform} runtime`];
      errors.forEach((err) => {
        if (err.code !== "MODULE_NOT_FOUND") {
          help.push(`${err.code}: ${err.message}`);
        }
      });
      const messages = errors.map((err) => err.message).join(" ");
      help.push("Possible solutions:");
      if (isUnsupportedNodeRuntime()) {
        const { found, expected } = isUnsupportedNodeRuntime();
        help.push(
          "- Please upgrade Node.js:",
          `    Found ${found}`,
          `    Requires ${expected}`
        );
      } else if (prebuiltPlatforms.includes(runtimePlatform)) {
        const [os, cpu] = runtimePlatform.split("-");
        const libc = os.endsWith("musl") ? " --libc=musl" : "";
        help.push(
          "- Ensure optional dependencies can be installed:",
          "    npm install --include=optional sharp",
          "- Ensure your package manager supports multi-platform installation:",
          "    See https://sharp.pixelplumbing.com/install#cross-platform",
          "- Add platform-specific dependencies:",
          `    npm install --os=${os.replace("musl", "")}${libc} --cpu=${cpu} sharp`
        );
      } else {
        help.push(
          `- Manually install libvips >= ${minimumLibvipsVersion}`,
          "- Add experimental WebAssembly-based dependencies:",
          "    npm install --cpu=wasm32 sharp",
          "    npm install @img/sharp-wasm32"
        );
      }
      if (isLinux && /(symbol not found|CXXABI_)/i.test(messages)) {
        try {
          const { config } = require(`@img/sharp-libvips-${runtimePlatform}/package`);
          const libcFound = `${familySync()} ${versionSync()}`;
          const libcRequires = `${config.musl ? "musl" : "glibc"} ${config.musl || config.glibc}`;
          help.push(
            "- Update your OS:",
            `    Found ${libcFound}`,
            `    Requires ${libcRequires}`
          );
        } catch (_errEngines) {
        }
      }
      if (isLinux && /\/snap\/core[0-9]{2}/.test(messages)) {
        help.push(
          "- Remove the Node.js Snap, which does not support native modules",
          "    snap remove node"
        );
      }
      if (isMacOs && /Incompatible library version/.test(messages)) {
        help.push(
          "- Update Homebrew:",
          "    brew update && brew upgrade vips"
        );
      }
      if (errors.some((err) => err.code === "ERR_DLOPEN_DISABLED")) {
        help.push("- Run Node.js without using the --no-addons flag");
      }
      if (isWindows && /The specified procedure could not be found/.test(messages)) {
        help.push(
          "- Using the canvas package on Windows?",
          "    See https://sharp.pixelplumbing.com/install#canvas-and-windows",
          "- Check for outdated versions of sharp in the dependency tree:",
          "    npm ls sharp"
        );
      }
      help.push(
        "- Consult the installation documentation:",
        "    See https://sharp.pixelplumbing.com/install"
      );
      throw new Error(help.join("\n"));
    }
  }
});

// ../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/constructor.js
var require_constructor = __commonJS({
  "../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/constructor.js"(exports2, module2) {
    var util = require("node:util");
    var stream = require("node:stream");
    var is = require_is();
    require_sharp();
    var debuglog = util.debuglog("sharp");
    var queueListener = (queueLength) => {
      Sharp.queue.emit("change", queueLength);
    };
    var Sharp = function(input, options) {
      if (arguments.length === 1 && !is.defined(input)) {
        throw new Error("Invalid input");
      }
      if (!(this instanceof Sharp)) {
        return new Sharp(input, options);
      }
      stream.Duplex.call(this);
      this.options = {
        // resize options
        topOffsetPre: -1,
        leftOffsetPre: -1,
        widthPre: -1,
        heightPre: -1,
        topOffsetPost: -1,
        leftOffsetPost: -1,
        widthPost: -1,
        heightPost: -1,
        width: -1,
        height: -1,
        canvas: "crop",
        position: 0,
        resizeBackground: [0, 0, 0, 255],
        angle: 0,
        rotationAngle: 0,
        rotationBackground: [0, 0, 0, 255],
        rotateBefore: false,
        orientBefore: false,
        flip: false,
        flop: false,
        extendTop: 0,
        extendBottom: 0,
        extendLeft: 0,
        extendRight: 0,
        extendBackground: [0, 0, 0, 255],
        extendWith: "background",
        withoutEnlargement: false,
        withoutReduction: false,
        affineMatrix: [],
        affineBackground: [0, 0, 0, 255],
        affineIdx: 0,
        affineIdy: 0,
        affineOdx: 0,
        affineOdy: 0,
        affineInterpolator: this.constructor.interpolators.bilinear,
        kernel: "lanczos3",
        fastShrinkOnLoad: true,
        // operations
        tint: [-1, 0, 0, 0],
        flatten: false,
        flattenBackground: [0, 0, 0],
        unflatten: false,
        negate: false,
        negateAlpha: true,
        medianSize: 0,
        blurSigma: 0,
        precision: "integer",
        minAmpl: 0.2,
        sharpenSigma: 0,
        sharpenM1: 1,
        sharpenM2: 2,
        sharpenX1: 2,
        sharpenY2: 10,
        sharpenY3: 20,
        threshold: 0,
        thresholdGrayscale: true,
        trimBackground: [],
        trimThreshold: -1,
        trimLineArt: false,
        dilateWidth: 0,
        erodeWidth: 0,
        gamma: 0,
        gammaOut: 0,
        greyscale: false,
        normalise: false,
        normaliseLower: 1,
        normaliseUpper: 99,
        claheWidth: 0,
        claheHeight: 0,
        claheMaxSlope: 3,
        brightness: 1,
        saturation: 1,
        hue: 0,
        lightness: 0,
        booleanBufferIn: null,
        booleanFileIn: "",
        joinChannelIn: [],
        extractChannel: -1,
        removeAlpha: false,
        ensureAlpha: -1,
        colourspace: "srgb",
        colourspacePipeline: "last",
        composite: [],
        // output
        fileOut: "",
        formatOut: "input",
        streamOut: false,
        keepMetadata: 0,
        withMetadataOrientation: -1,
        withMetadataDensity: 0,
        withIccProfile: "",
        withExif: {},
        withExifMerge: true,
        withXmp: "",
        resolveWithObject: false,
        loop: -1,
        delay: [],
        // output format
        jpegQuality: 80,
        jpegProgressive: false,
        jpegChromaSubsampling: "4:2:0",
        jpegTrellisQuantisation: false,
        jpegOvershootDeringing: false,
        jpegOptimiseScans: false,
        jpegOptimiseCoding: true,
        jpegQuantisationTable: 0,
        pngProgressive: false,
        pngCompressionLevel: 6,
        pngAdaptiveFiltering: false,
        pngPalette: false,
        pngQuality: 100,
        pngEffort: 7,
        pngBitdepth: 8,
        pngDither: 1,
        jp2Quality: 80,
        jp2TileHeight: 512,
        jp2TileWidth: 512,
        jp2Lossless: false,
        jp2ChromaSubsampling: "4:4:4",
        webpQuality: 80,
        webpAlphaQuality: 100,
        webpLossless: false,
        webpNearLossless: false,
        webpSmartSubsample: false,
        webpSmartDeblock: false,
        webpPreset: "default",
        webpEffort: 4,
        webpMinSize: false,
        webpMixed: false,
        gifBitdepth: 8,
        gifEffort: 7,
        gifDither: 1,
        gifInterFrameMaxError: 0,
        gifInterPaletteMaxError: 3,
        gifKeepDuplicateFrames: false,
        gifReuse: true,
        gifProgressive: false,
        tiffQuality: 80,
        tiffCompression: "jpeg",
        tiffBigtiff: false,
        tiffPredictor: "horizontal",
        tiffPyramid: false,
        tiffMiniswhite: false,
        tiffBitdepth: 8,
        tiffTile: false,
        tiffTileHeight: 256,
        tiffTileWidth: 256,
        tiffXres: 1,
        tiffYres: 1,
        tiffResolutionUnit: "inch",
        heifQuality: 50,
        heifLossless: false,
        heifCompression: "av1",
        heifEffort: 4,
        heifChromaSubsampling: "4:4:4",
        heifBitdepth: 8,
        jxlDistance: 1,
        jxlDecodingTier: 0,
        jxlEffort: 7,
        jxlLossless: false,
        rawDepth: "uchar",
        tileSize: 256,
        tileOverlap: 0,
        tileContainer: "fs",
        tileLayout: "dz",
        tileFormat: "last",
        tileDepth: "last",
        tileAngle: 0,
        tileSkipBlanks: -1,
        tileBackground: [255, 255, 255, 255],
        tileCentre: false,
        tileId: "https://example.com/iiif",
        tileBasename: "",
        timeoutSeconds: 0,
        linearA: [],
        linearB: [],
        pdfBackground: [255, 255, 255, 255],
        // Function to notify of libvips warnings
        debuglog: (warning) => {
          this.emit("warning", warning);
          debuglog(warning);
        },
        // Function to notify of queue length changes
        queueListener
      };
      this.options.input = this._createInputDescriptor(input, options, { allowStream: true });
      return this;
    };
    Object.setPrototypeOf(Sharp.prototype, stream.Duplex.prototype);
    Object.setPrototypeOf(Sharp, stream.Duplex);
    function clone() {
      const clone2 = this.constructor.call();
      const { debuglog: debuglog2, queueListener: queueListener2, ...options } = this.options;
      clone2.options = structuredClone(options);
      clone2.options.debuglog = debuglog2;
      clone2.options.queueListener = queueListener2;
      if (this._isStreamInput()) {
        this.on("finish", () => {
          this._flattenBufferIn();
          clone2.options.input.buffer = this.options.input.buffer;
          clone2.emit("finish");
        });
      }
      return clone2;
    }
    Object.assign(Sharp.prototype, { clone });
    module2.exports = Sharp;
  }
});

// ../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/input.js
var require_input = __commonJS({
  "../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/input.js"(exports2, module2) {
    var is = require_is();
    var sharp2 = require_sharp();
    var align = {
      left: "low",
      top: "low",
      low: "low",
      center: "centre",
      centre: "centre",
      right: "high",
      bottom: "high",
      high: "high"
    };
    var inputStreamParameters = [
      // Limits and error handling
      "failOn",
      "limitInputPixels",
      "unlimited",
      // Format-generic
      "animated",
      "autoOrient",
      "density",
      "ignoreIcc",
      "page",
      "pages",
      "sequentialRead",
      // Format-specific
      "jp2",
      "openSlide",
      "pdf",
      "raw",
      "svg",
      "tiff",
      // Deprecated
      "failOnError",
      "openSlideLevel",
      "pdfBackground",
      "tiffSubifd"
    ];
    function _inputOptionsFromObject(obj) {
      const params = inputStreamParameters.filter((p) => is.defined(obj[p])).map((p) => [p, obj[p]]);
      return params.length ? Object.fromEntries(params) : void 0;
    }
    function _createInputDescriptor(input, inputOptions, containerOptions) {
      const inputDescriptor = {
        autoOrient: false,
        failOn: "warning",
        limitInputPixels: 16383 ** 2,
        ignoreIcc: false,
        unlimited: false,
        sequentialRead: true
      };
      if (is.string(input)) {
        inputDescriptor.file = input;
      } else if (is.buffer(input)) {
        if (input.length === 0) {
          throw Error("Input Buffer is empty");
        }
        inputDescriptor.buffer = input;
      } else if (is.arrayBuffer(input)) {
        if (input.byteLength === 0) {
          throw Error("Input bit Array is empty");
        }
        inputDescriptor.buffer = Buffer.from(input, 0, input.byteLength);
      } else if (is.typedArray(input)) {
        if (input.length === 0) {
          throw Error("Input Bit Array is empty");
        }
        inputDescriptor.buffer = Buffer.from(input.buffer, input.byteOffset, input.byteLength);
      } else if (is.plainObject(input) && !is.defined(inputOptions)) {
        inputOptions = input;
        if (_inputOptionsFromObject(inputOptions)) {
          inputDescriptor.buffer = [];
        }
      } else if (!is.defined(input) && !is.defined(inputOptions) && is.object(containerOptions) && containerOptions.allowStream) {
        inputDescriptor.buffer = [];
      } else if (Array.isArray(input)) {
        if (input.length > 1) {
          if (!this.options.joining) {
            this.options.joining = true;
            this.options.join = input.map((i) => this._createInputDescriptor(i));
          } else {
            throw new Error("Recursive join is unsupported");
          }
        } else {
          throw new Error("Expected at least two images to join");
        }
      } else {
        throw new Error(`Unsupported input '${input}' of type ${typeof input}${is.defined(inputOptions) ? ` when also providing options of type ${typeof inputOptions}` : ""}`);
      }
      if (is.object(inputOptions)) {
        if (is.defined(inputOptions.failOnError)) {
          if (is.bool(inputOptions.failOnError)) {
            inputDescriptor.failOn = inputOptions.failOnError ? "warning" : "none";
          } else {
            throw is.invalidParameterError("failOnError", "boolean", inputOptions.failOnError);
          }
        }
        if (is.defined(inputOptions.failOn)) {
          if (is.string(inputOptions.failOn) && is.inArray(inputOptions.failOn, ["none", "truncated", "error", "warning"])) {
            inputDescriptor.failOn = inputOptions.failOn;
          } else {
            throw is.invalidParameterError("failOn", "one of: none, truncated, error, warning", inputOptions.failOn);
          }
        }
        if (is.defined(inputOptions.autoOrient)) {
          if (is.bool(inputOptions.autoOrient)) {
            inputDescriptor.autoOrient = inputOptions.autoOrient;
          } else {
            throw is.invalidParameterError("autoOrient", "boolean", inputOptions.autoOrient);
          }
        }
        if (is.defined(inputOptions.density)) {
          if (is.inRange(inputOptions.density, 1, 1e5)) {
            inputDescriptor.density = inputOptions.density;
          } else {
            throw is.invalidParameterError("density", "number between 1 and 100000", inputOptions.density);
          }
        }
        if (is.defined(inputOptions.ignoreIcc)) {
          if (is.bool(inputOptions.ignoreIcc)) {
            inputDescriptor.ignoreIcc = inputOptions.ignoreIcc;
          } else {
            throw is.invalidParameterError("ignoreIcc", "boolean", inputOptions.ignoreIcc);
          }
        }
        if (is.defined(inputOptions.limitInputPixels)) {
          if (is.bool(inputOptions.limitInputPixels)) {
            inputDescriptor.limitInputPixels = inputOptions.limitInputPixels ? 16383 ** 2 : 0;
          } else if (is.integer(inputOptions.limitInputPixels) && is.inRange(inputOptions.limitInputPixels, 0, Number.MAX_SAFE_INTEGER)) {
            inputDescriptor.limitInputPixels = inputOptions.limitInputPixels;
          } else {
            throw is.invalidParameterError("limitInputPixels", "positive integer", inputOptions.limitInputPixels);
          }
        }
        if (is.defined(inputOptions.unlimited)) {
          if (is.bool(inputOptions.unlimited)) {
            inputDescriptor.unlimited = inputOptions.unlimited;
          } else {
            throw is.invalidParameterError("unlimited", "boolean", inputOptions.unlimited);
          }
        }
        if (is.defined(inputOptions.sequentialRead)) {
          if (is.bool(inputOptions.sequentialRead)) {
            inputDescriptor.sequentialRead = inputOptions.sequentialRead;
          } else {
            throw is.invalidParameterError("sequentialRead", "boolean", inputOptions.sequentialRead);
          }
        }
        if (is.defined(inputOptions.raw)) {
          if (is.object(inputOptions.raw) && is.integer(inputOptions.raw.width) && inputOptions.raw.width > 0 && is.integer(inputOptions.raw.height) && inputOptions.raw.height > 0 && is.integer(inputOptions.raw.channels) && is.inRange(inputOptions.raw.channels, 1, 4)) {
            inputDescriptor.rawWidth = inputOptions.raw.width;
            inputDescriptor.rawHeight = inputOptions.raw.height;
            inputDescriptor.rawChannels = inputOptions.raw.channels;
            switch (input.constructor) {
              case Uint8Array:
              case Uint8ClampedArray:
                inputDescriptor.rawDepth = "uchar";
                break;
              case Int8Array:
                inputDescriptor.rawDepth = "char";
                break;
              case Uint16Array:
                inputDescriptor.rawDepth = "ushort";
                break;
              case Int16Array:
                inputDescriptor.rawDepth = "short";
                break;
              case Uint32Array:
                inputDescriptor.rawDepth = "uint";
                break;
              case Int32Array:
                inputDescriptor.rawDepth = "int";
                break;
              case Float32Array:
                inputDescriptor.rawDepth = "float";
                break;
              case Float64Array:
                inputDescriptor.rawDepth = "double";
                break;
              default:
                inputDescriptor.rawDepth = "uchar";
                break;
            }
          } else {
            throw new Error("Expected width, height and channels for raw pixel input");
          }
          inputDescriptor.rawPremultiplied = false;
          if (is.defined(inputOptions.raw.premultiplied)) {
            if (is.bool(inputOptions.raw.premultiplied)) {
              inputDescriptor.rawPremultiplied = inputOptions.raw.premultiplied;
            } else {
              throw is.invalidParameterError("raw.premultiplied", "boolean", inputOptions.raw.premultiplied);
            }
          }
          inputDescriptor.rawPageHeight = 0;
          if (is.defined(inputOptions.raw.pageHeight)) {
            if (is.integer(inputOptions.raw.pageHeight) && inputOptions.raw.pageHeight > 0 && inputOptions.raw.pageHeight <= inputOptions.raw.height) {
              if (inputOptions.raw.height % inputOptions.raw.pageHeight !== 0) {
                throw new Error(`Expected raw.height ${inputOptions.raw.height} to be a multiple of raw.pageHeight ${inputOptions.raw.pageHeight}`);
              }
              inputDescriptor.rawPageHeight = inputOptions.raw.pageHeight;
            } else {
              throw is.invalidParameterError("raw.pageHeight", "positive integer", inputOptions.raw.pageHeight);
            }
          }
        }
        if (is.defined(inputOptions.animated)) {
          if (is.bool(inputOptions.animated)) {
            inputDescriptor.pages = inputOptions.animated ? -1 : 1;
          } else {
            throw is.invalidParameterError("animated", "boolean", inputOptions.animated);
          }
        }
        if (is.defined(inputOptions.pages)) {
          if (is.integer(inputOptions.pages) && is.inRange(inputOptions.pages, -1, 1e5)) {
            inputDescriptor.pages = inputOptions.pages;
          } else {
            throw is.invalidParameterError("pages", "integer between -1 and 100000", inputOptions.pages);
          }
        }
        if (is.defined(inputOptions.page)) {
          if (is.integer(inputOptions.page) && is.inRange(inputOptions.page, 0, 1e5)) {
            inputDescriptor.page = inputOptions.page;
          } else {
            throw is.invalidParameterError("page", "integer between 0 and 100000", inputOptions.page);
          }
        }
        if (is.object(inputOptions.openSlide) && is.defined(inputOptions.openSlide.level)) {
          if (is.integer(inputOptions.openSlide.level) && is.inRange(inputOptions.openSlide.level, 0, 256)) {
            inputDescriptor.openSlideLevel = inputOptions.openSlide.level;
          } else {
            throw is.invalidParameterError("openSlide.level", "integer between 0 and 256", inputOptions.openSlide.level);
          }
        } else if (is.defined(inputOptions.level)) {
          if (is.integer(inputOptions.level) && is.inRange(inputOptions.level, 0, 256)) {
            inputDescriptor.openSlideLevel = inputOptions.level;
          } else {
            throw is.invalidParameterError("level", "integer between 0 and 256", inputOptions.level);
          }
        }
        if (is.object(inputOptions.tiff) && is.defined(inputOptions.tiff.subifd)) {
          if (is.integer(inputOptions.tiff.subifd) && is.inRange(inputOptions.tiff.subifd, -1, 1e5)) {
            inputDescriptor.tiffSubifd = inputOptions.tiff.subifd;
          } else {
            throw is.invalidParameterError("tiff.subifd", "integer between -1 and 100000", inputOptions.tiff.subifd);
          }
        } else if (is.defined(inputOptions.subifd)) {
          if (is.integer(inputOptions.subifd) && is.inRange(inputOptions.subifd, -1, 1e5)) {
            inputDescriptor.tiffSubifd = inputOptions.subifd;
          } else {
            throw is.invalidParameterError("subifd", "integer between -1 and 100000", inputOptions.subifd);
          }
        }
        if (is.object(inputOptions.svg)) {
          if (is.defined(inputOptions.svg.stylesheet)) {
            if (is.string(inputOptions.svg.stylesheet)) {
              inputDescriptor.svgStylesheet = inputOptions.svg.stylesheet;
            } else {
              throw is.invalidParameterError("svg.stylesheet", "string", inputOptions.svg.stylesheet);
            }
          }
          if (is.defined(inputOptions.svg.highBitdepth)) {
            if (is.bool(inputOptions.svg.highBitdepth)) {
              inputDescriptor.svgHighBitdepth = inputOptions.svg.highBitdepth;
            } else {
              throw is.invalidParameterError("svg.highBitdepth", "boolean", inputOptions.svg.highBitdepth);
            }
          }
        }
        if (is.object(inputOptions.pdf) && is.defined(inputOptions.pdf.background)) {
          inputDescriptor.pdfBackground = this._getBackgroundColourOption(inputOptions.pdf.background);
        } else if (is.defined(inputOptions.pdfBackground)) {
          inputDescriptor.pdfBackground = this._getBackgroundColourOption(inputOptions.pdfBackground);
        }
        if (is.object(inputOptions.jp2) && is.defined(inputOptions.jp2.oneshot)) {
          if (is.bool(inputOptions.jp2.oneshot)) {
            inputDescriptor.jp2Oneshot = inputOptions.jp2.oneshot;
          } else {
            throw is.invalidParameterError("jp2.oneshot", "boolean", inputOptions.jp2.oneshot);
          }
        }
        if (is.defined(inputOptions.create)) {
          if (is.object(inputOptions.create) && is.integer(inputOptions.create.width) && inputOptions.create.width > 0 && is.integer(inputOptions.create.height) && inputOptions.create.height > 0 && is.integer(inputOptions.create.channels)) {
            inputDescriptor.createWidth = inputOptions.create.width;
            inputDescriptor.createHeight = inputOptions.create.height;
            inputDescriptor.createChannels = inputOptions.create.channels;
            inputDescriptor.createPageHeight = 0;
            if (is.defined(inputOptions.create.pageHeight)) {
              if (is.integer(inputOptions.create.pageHeight) && inputOptions.create.pageHeight > 0 && inputOptions.create.pageHeight <= inputOptions.create.height) {
                if (inputOptions.create.height % inputOptions.create.pageHeight !== 0) {
                  throw new Error(`Expected create.height ${inputOptions.create.height} to be a multiple of create.pageHeight ${inputOptions.create.pageHeight}`);
                }
                inputDescriptor.createPageHeight = inputOptions.create.pageHeight;
              } else {
                throw is.invalidParameterError("create.pageHeight", "positive integer", inputOptions.create.pageHeight);
              }
            }
            if (is.defined(inputOptions.create.noise)) {
              if (!is.object(inputOptions.create.noise)) {
                throw new Error("Expected noise to be an object");
              }
              if (inputOptions.create.noise.type !== "gaussian") {
                throw new Error("Only gaussian noise is supported at the moment");
              }
              inputDescriptor.createNoiseType = inputOptions.create.noise.type;
              if (!is.inRange(inputOptions.create.channels, 1, 4)) {
                throw is.invalidParameterError("create.channels", "number between 1 and 4", inputOptions.create.channels);
              }
              inputDescriptor.createNoiseMean = 128;
              if (is.defined(inputOptions.create.noise.mean)) {
                if (is.number(inputOptions.create.noise.mean) && is.inRange(inputOptions.create.noise.mean, 0, 1e4)) {
                  inputDescriptor.createNoiseMean = inputOptions.create.noise.mean;
                } else {
                  throw is.invalidParameterError("create.noise.mean", "number between 0 and 10000", inputOptions.create.noise.mean);
                }
              }
              inputDescriptor.createNoiseSigma = 30;
              if (is.defined(inputOptions.create.noise.sigma)) {
                if (is.number(inputOptions.create.noise.sigma) && is.inRange(inputOptions.create.noise.sigma, 0, 1e4)) {
                  inputDescriptor.createNoiseSigma = inputOptions.create.noise.sigma;
                } else {
                  throw is.invalidParameterError("create.noise.sigma", "number between 0 and 10000", inputOptions.create.noise.sigma);
                }
              }
            } else if (is.defined(inputOptions.create.background)) {
              if (!is.inRange(inputOptions.create.channels, 3, 4)) {
                throw is.invalidParameterError("create.channels", "number between 3 and 4", inputOptions.create.channels);
              }
              inputDescriptor.createBackground = this._getBackgroundColourOption(inputOptions.create.background);
            } else {
              throw new Error("Expected valid noise or background to create a new input image");
            }
            delete inputDescriptor.buffer;
          } else {
            throw new Error("Expected valid width, height and channels to create a new input image");
          }
        }
        if (is.defined(inputOptions.text)) {
          if (is.object(inputOptions.text) && is.string(inputOptions.text.text)) {
            inputDescriptor.textValue = inputOptions.text.text;
            if (is.defined(inputOptions.text.height) && is.defined(inputOptions.text.dpi)) {
              throw new Error("Expected only one of dpi or height");
            }
            if (is.defined(inputOptions.text.font)) {
              if (is.string(inputOptions.text.font)) {
                inputDescriptor.textFont = inputOptions.text.font;
              } else {
                throw is.invalidParameterError("text.font", "string", inputOptions.text.font);
              }
            }
            if (is.defined(inputOptions.text.fontfile)) {
              if (is.string(inputOptions.text.fontfile)) {
                inputDescriptor.textFontfile = inputOptions.text.fontfile;
              } else {
                throw is.invalidParameterError("text.fontfile", "string", inputOptions.text.fontfile);
              }
            }
            if (is.defined(inputOptions.text.width)) {
              if (is.integer(inputOptions.text.width) && inputOptions.text.width > 0) {
                inputDescriptor.textWidth = inputOptions.text.width;
              } else {
                throw is.invalidParameterError("text.width", "positive integer", inputOptions.text.width);
              }
            }
            if (is.defined(inputOptions.text.height)) {
              if (is.integer(inputOptions.text.height) && inputOptions.text.height > 0) {
                inputDescriptor.textHeight = inputOptions.text.height;
              } else {
                throw is.invalidParameterError("text.height", "positive integer", inputOptions.text.height);
              }
            }
            if (is.defined(inputOptions.text.align)) {
              if (is.string(inputOptions.text.align) && is.string(this.constructor.align[inputOptions.text.align])) {
                inputDescriptor.textAlign = this.constructor.align[inputOptions.text.align];
              } else {
                throw is.invalidParameterError("text.align", "valid alignment", inputOptions.text.align);
              }
            }
            if (is.defined(inputOptions.text.justify)) {
              if (is.bool(inputOptions.text.justify)) {
                inputDescriptor.textJustify = inputOptions.text.justify;
              } else {
                throw is.invalidParameterError("text.justify", "boolean", inputOptions.text.justify);
              }
            }
            if (is.defined(inputOptions.text.dpi)) {
              if (is.integer(inputOptions.text.dpi) && is.inRange(inputOptions.text.dpi, 1, 1e6)) {
                inputDescriptor.textDpi = inputOptions.text.dpi;
              } else {
                throw is.invalidParameterError("text.dpi", "integer between 1 and 1000000", inputOptions.text.dpi);
              }
            }
            if (is.defined(inputOptions.text.rgba)) {
              if (is.bool(inputOptions.text.rgba)) {
                inputDescriptor.textRgba = inputOptions.text.rgba;
              } else {
                throw is.invalidParameterError("text.rgba", "bool", inputOptions.text.rgba);
              }
            }
            if (is.defined(inputOptions.text.spacing)) {
              if (is.integer(inputOptions.text.spacing) && is.inRange(inputOptions.text.spacing, -1e6, 1e6)) {
                inputDescriptor.textSpacing = inputOptions.text.spacing;
              } else {
                throw is.invalidParameterError("text.spacing", "integer between -1000000 and 1000000", inputOptions.text.spacing);
              }
            }
            if (is.defined(inputOptions.text.wrap)) {
              if (is.string(inputOptions.text.wrap) && is.inArray(inputOptions.text.wrap, ["word", "char", "word-char", "none"])) {
                inputDescriptor.textWrap = inputOptions.text.wrap;
              } else {
                throw is.invalidParameterError("text.wrap", "one of: word, char, word-char, none", inputOptions.text.wrap);
              }
            }
            delete inputDescriptor.buffer;
          } else {
            throw new Error("Expected a valid string to create an image with text.");
          }
        }
        if (is.defined(inputOptions.join)) {
          if (is.defined(this.options.join)) {
            if (is.defined(inputOptions.join.animated)) {
              if (is.bool(inputOptions.join.animated)) {
                inputDescriptor.joinAnimated = inputOptions.join.animated;
              } else {
                throw is.invalidParameterError("join.animated", "boolean", inputOptions.join.animated);
              }
            }
            if (is.defined(inputOptions.join.across)) {
              if (is.integer(inputOptions.join.across) && is.inRange(inputOptions.join.across, 1, 1e6)) {
                inputDescriptor.joinAcross = inputOptions.join.across;
              } else {
                throw is.invalidParameterError("join.across", "integer between 1 and 100000", inputOptions.join.across);
              }
            }
            if (is.defined(inputOptions.join.shim)) {
              if (is.integer(inputOptions.join.shim) && is.inRange(inputOptions.join.shim, 0, 1e6)) {
                inputDescriptor.joinShim = inputOptions.join.shim;
              } else {
                throw is.invalidParameterError("join.shim", "integer between 0 and 100000", inputOptions.join.shim);
              }
            }
            if (is.defined(inputOptions.join.background)) {
              inputDescriptor.joinBackground = this._getBackgroundColourOption(inputOptions.join.background);
            }
            if (is.defined(inputOptions.join.halign)) {
              if (is.string(inputOptions.join.halign) && is.string(this.constructor.align[inputOptions.join.halign])) {
                inputDescriptor.joinHalign = this.constructor.align[inputOptions.join.halign];
              } else {
                throw is.invalidParameterError("join.halign", "valid alignment", inputOptions.join.halign);
              }
            }
            if (is.defined(inputOptions.join.valign)) {
              if (is.string(inputOptions.join.valign) && is.string(this.constructor.align[inputOptions.join.valign])) {
                inputDescriptor.joinValign = this.constructor.align[inputOptions.join.valign];
              } else {
                throw is.invalidParameterError("join.valign", "valid alignment", inputOptions.join.valign);
              }
            }
          } else {
            throw new Error("Expected input to be an array of images to join");
          }
        }
      } else if (is.defined(inputOptions)) {
        throw new Error(`Invalid input options ${inputOptions}`);
      }
      return inputDescriptor;
    }
    function _write(chunk, _encoding, callback) {
      if (Array.isArray(this.options.input.buffer)) {
        if (is.buffer(chunk)) {
          if (this.options.input.buffer.length === 0) {
            this.on("finish", () => {
              this.streamInFinished = true;
            });
          }
          this.options.input.buffer.push(chunk);
          callback();
        } else {
          callback(new Error("Non-Buffer data on Writable Stream"));
        }
      } else {
        callback(new Error("Unexpected data on Writable Stream"));
      }
    }
    function _flattenBufferIn() {
      if (this._isStreamInput()) {
        this.options.input.buffer = Buffer.concat(this.options.input.buffer);
      }
    }
    function _isStreamInput() {
      return Array.isArray(this.options.input.buffer);
    }
    function metadata(callback) {
      const stack = Error();
      if (is.fn(callback)) {
        if (this._isStreamInput()) {
          this.on("finish", () => {
            this._flattenBufferIn();
            sharp2.metadata(this.options, (err, metadata2) => {
              if (err) {
                callback(is.nativeError(err, stack));
              } else {
                callback(null, metadata2);
              }
            });
          });
        } else {
          sharp2.metadata(this.options, (err, metadata2) => {
            if (err) {
              callback(is.nativeError(err, stack));
            } else {
              callback(null, metadata2);
            }
          });
        }
        return this;
      } else {
        if (this._isStreamInput()) {
          return new Promise((resolve, reject) => {
            const finished = () => {
              this._flattenBufferIn();
              sharp2.metadata(this.options, (err, metadata2) => {
                if (err) {
                  reject(is.nativeError(err, stack));
                } else {
                  resolve(metadata2);
                }
              });
            };
            if (this.writableFinished) {
              finished();
            } else {
              this.once("finish", finished);
            }
          });
        } else {
          return new Promise((resolve, reject) => {
            sharp2.metadata(this.options, (err, metadata2) => {
              if (err) {
                reject(is.nativeError(err, stack));
              } else {
                resolve(metadata2);
              }
            });
          });
        }
      }
    }
    function stats(callback) {
      const stack = Error();
      if (is.fn(callback)) {
        if (this._isStreamInput()) {
          this.on("finish", () => {
            this._flattenBufferIn();
            sharp2.stats(this.options, (err, stats2) => {
              if (err) {
                callback(is.nativeError(err, stack));
              } else {
                callback(null, stats2);
              }
            });
          });
        } else {
          sharp2.stats(this.options, (err, stats2) => {
            if (err) {
              callback(is.nativeError(err, stack));
            } else {
              callback(null, stats2);
            }
          });
        }
        return this;
      } else {
        if (this._isStreamInput()) {
          return new Promise((resolve, reject) => {
            this.on("finish", function() {
              this._flattenBufferIn();
              sharp2.stats(this.options, (err, stats2) => {
                if (err) {
                  reject(is.nativeError(err, stack));
                } else {
                  resolve(stats2);
                }
              });
            });
          });
        } else {
          return new Promise((resolve, reject) => {
            sharp2.stats(this.options, (err, stats2) => {
              if (err) {
                reject(is.nativeError(err, stack));
              } else {
                resolve(stats2);
              }
            });
          });
        }
      }
    }
    module2.exports = (Sharp) => {
      Object.assign(Sharp.prototype, {
        // Private
        _inputOptionsFromObject,
        _createInputDescriptor,
        _write,
        _flattenBufferIn,
        _isStreamInput,
        // Public
        metadata,
        stats
      });
      Sharp.align = align;
    };
  }
});

// ../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/resize.js
var require_resize = __commonJS({
  "../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/resize.js"(exports2, module2) {
    var is = require_is();
    var gravity = {
      center: 0,
      centre: 0,
      north: 1,
      east: 2,
      south: 3,
      west: 4,
      northeast: 5,
      southeast: 6,
      southwest: 7,
      northwest: 8
    };
    var position = {
      top: 1,
      right: 2,
      bottom: 3,
      left: 4,
      "right top": 5,
      "right bottom": 6,
      "left bottom": 7,
      "left top": 8
    };
    var extendWith = {
      background: "background",
      copy: "copy",
      repeat: "repeat",
      mirror: "mirror"
    };
    var strategy = {
      entropy: 16,
      attention: 17
    };
    var kernel = {
      nearest: "nearest",
      linear: "linear",
      cubic: "cubic",
      mitchell: "mitchell",
      lanczos2: "lanczos2",
      lanczos3: "lanczos3",
      mks2013: "mks2013",
      mks2021: "mks2021"
    };
    var fit = {
      contain: "contain",
      cover: "cover",
      fill: "fill",
      inside: "inside",
      outside: "outside"
    };
    var mapFitToCanvas = {
      contain: "embed",
      cover: "crop",
      fill: "ignore_aspect",
      inside: "max",
      outside: "min"
    };
    function isRotationExpected(options) {
      return options.angle % 360 !== 0 || options.rotationAngle !== 0;
    }
    function isResizeExpected(options) {
      return options.width !== -1 || options.height !== -1;
    }
    function resize(widthOrOptions, height, options) {
      if (isResizeExpected(this.options)) {
        this.options.debuglog("ignoring previous resize options");
      }
      if (this.options.widthPost !== -1) {
        this.options.debuglog("operation order will be: extract, resize, extract");
      }
      if (is.defined(widthOrOptions)) {
        if (is.object(widthOrOptions) && !is.defined(options)) {
          options = widthOrOptions;
        } else if (is.integer(widthOrOptions) && widthOrOptions > 0) {
          this.options.width = widthOrOptions;
        } else {
          throw is.invalidParameterError("width", "positive integer", widthOrOptions);
        }
      } else {
        this.options.width = -1;
      }
      if (is.defined(height)) {
        if (is.integer(height) && height > 0) {
          this.options.height = height;
        } else {
          throw is.invalidParameterError("height", "positive integer", height);
        }
      } else {
        this.options.height = -1;
      }
      if (is.object(options)) {
        if (is.defined(options.width)) {
          if (is.integer(options.width) && options.width > 0) {
            this.options.width = options.width;
          } else {
            throw is.invalidParameterError("width", "positive integer", options.width);
          }
        }
        if (is.defined(options.height)) {
          if (is.integer(options.height) && options.height > 0) {
            this.options.height = options.height;
          } else {
            throw is.invalidParameterError("height", "positive integer", options.height);
          }
        }
        if (is.defined(options.fit)) {
          const canvas = mapFitToCanvas[options.fit];
          if (is.string(canvas)) {
            this.options.canvas = canvas;
          } else {
            throw is.invalidParameterError("fit", "valid fit", options.fit);
          }
        }
        if (is.defined(options.position)) {
          const pos = is.integer(options.position) ? options.position : strategy[options.position] || position[options.position] || gravity[options.position];
          if (is.integer(pos) && (is.inRange(pos, 0, 8) || is.inRange(pos, 16, 17))) {
            this.options.position = pos;
          } else {
            throw is.invalidParameterError("position", "valid position/gravity/strategy", options.position);
          }
        }
        this._setBackgroundColourOption("resizeBackground", options.background);
        if (is.defined(options.kernel)) {
          if (is.string(kernel[options.kernel])) {
            this.options.kernel = kernel[options.kernel];
          } else {
            throw is.invalidParameterError("kernel", "valid kernel name", options.kernel);
          }
        }
        if (is.defined(options.withoutEnlargement)) {
          this._setBooleanOption("withoutEnlargement", options.withoutEnlargement);
        }
        if (is.defined(options.withoutReduction)) {
          this._setBooleanOption("withoutReduction", options.withoutReduction);
        }
        if (is.defined(options.fastShrinkOnLoad)) {
          this._setBooleanOption("fastShrinkOnLoad", options.fastShrinkOnLoad);
        }
      }
      if (isRotationExpected(this.options) && isResizeExpected(this.options)) {
        this.options.rotateBefore = true;
      }
      return this;
    }
    function extend(extend2) {
      if (is.integer(extend2) && extend2 > 0) {
        this.options.extendTop = extend2;
        this.options.extendBottom = extend2;
        this.options.extendLeft = extend2;
        this.options.extendRight = extend2;
      } else if (is.object(extend2)) {
        if (is.defined(extend2.top)) {
          if (is.integer(extend2.top) && extend2.top >= 0) {
            this.options.extendTop = extend2.top;
          } else {
            throw is.invalidParameterError("top", "positive integer", extend2.top);
          }
        }
        if (is.defined(extend2.bottom)) {
          if (is.integer(extend2.bottom) && extend2.bottom >= 0) {
            this.options.extendBottom = extend2.bottom;
          } else {
            throw is.invalidParameterError("bottom", "positive integer", extend2.bottom);
          }
        }
        if (is.defined(extend2.left)) {
          if (is.integer(extend2.left) && extend2.left >= 0) {
            this.options.extendLeft = extend2.left;
          } else {
            throw is.invalidParameterError("left", "positive integer", extend2.left);
          }
        }
        if (is.defined(extend2.right)) {
          if (is.integer(extend2.right) && extend2.right >= 0) {
            this.options.extendRight = extend2.right;
          } else {
            throw is.invalidParameterError("right", "positive integer", extend2.right);
          }
        }
        this._setBackgroundColourOption("extendBackground", extend2.background);
        if (is.defined(extend2.extendWith)) {
          if (is.string(extendWith[extend2.extendWith])) {
            this.options.extendWith = extendWith[extend2.extendWith];
          } else {
            throw is.invalidParameterError("extendWith", "one of: background, copy, repeat, mirror", extend2.extendWith);
          }
        }
      } else {
        throw is.invalidParameterError("extend", "integer or object", extend2);
      }
      return this;
    }
    function extract(options) {
      const suffix = isResizeExpected(this.options) || this.options.widthPre !== -1 ? "Post" : "Pre";
      if (this.options[`width${suffix}`] !== -1) {
        this.options.debuglog("ignoring previous extract options");
      }
      ["left", "top", "width", "height"].forEach(function(name) {
        const value = options[name];
        if (is.integer(value) && value >= 0) {
          this.options[name + (name === "left" || name === "top" ? "Offset" : "") + suffix] = value;
        } else {
          throw is.invalidParameterError(name, "integer", value);
        }
      }, this);
      if (isRotationExpected(this.options) && !isResizeExpected(this.options)) {
        if (this.options.widthPre === -1 || this.options.widthPost === -1) {
          this.options.rotateBefore = true;
        }
      }
      if (this.options.input.autoOrient) {
        this.options.orientBefore = true;
      }
      return this;
    }
    function trim(options) {
      this.options.trimThreshold = 10;
      if (is.defined(options)) {
        if (is.object(options)) {
          if (is.defined(options.background)) {
            this._setBackgroundColourOption("trimBackground", options.background);
          }
          if (is.defined(options.threshold)) {
            if (is.number(options.threshold) && options.threshold >= 0) {
              this.options.trimThreshold = options.threshold;
            } else {
              throw is.invalidParameterError("threshold", "positive number", options.threshold);
            }
          }
          if (is.defined(options.lineArt)) {
            this._setBooleanOption("trimLineArt", options.lineArt);
          }
        } else {
          throw is.invalidParameterError("trim", "object", options);
        }
      }
      if (isRotationExpected(this.options)) {
        this.options.rotateBefore = true;
      }
      return this;
    }
    module2.exports = (Sharp) => {
      Object.assign(Sharp.prototype, {
        resize,
        extend,
        extract,
        trim
      });
      Sharp.gravity = gravity;
      Sharp.strategy = strategy;
      Sharp.kernel = kernel;
      Sharp.fit = fit;
      Sharp.position = position;
    };
  }
});

// ../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/composite.js
var require_composite = __commonJS({
  "../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/composite.js"(exports2, module2) {
    var is = require_is();
    var blend = {
      clear: "clear",
      source: "source",
      over: "over",
      in: "in",
      out: "out",
      atop: "atop",
      dest: "dest",
      "dest-over": "dest-over",
      "dest-in": "dest-in",
      "dest-out": "dest-out",
      "dest-atop": "dest-atop",
      xor: "xor",
      add: "add",
      saturate: "saturate",
      multiply: "multiply",
      screen: "screen",
      overlay: "overlay",
      darken: "darken",
      lighten: "lighten",
      "colour-dodge": "colour-dodge",
      "color-dodge": "colour-dodge",
      "colour-burn": "colour-burn",
      "color-burn": "colour-burn",
      "hard-light": "hard-light",
      "soft-light": "soft-light",
      difference: "difference",
      exclusion: "exclusion"
    };
    function composite(images) {
      if (!Array.isArray(images)) {
        throw is.invalidParameterError("images to composite", "array", images);
      }
      this.options.composite = images.map((image) => {
        if (!is.object(image)) {
          throw is.invalidParameterError("image to composite", "object", image);
        }
        const inputOptions = this._inputOptionsFromObject(image);
        const composite2 = {
          input: this._createInputDescriptor(image.input, inputOptions, { allowStream: false }),
          blend: "over",
          tile: false,
          left: 0,
          top: 0,
          hasOffset: false,
          gravity: 0,
          premultiplied: false
        };
        if (is.defined(image.blend)) {
          if (is.string(blend[image.blend])) {
            composite2.blend = blend[image.blend];
          } else {
            throw is.invalidParameterError("blend", "valid blend name", image.blend);
          }
        }
        if (is.defined(image.tile)) {
          if (is.bool(image.tile)) {
            composite2.tile = image.tile;
          } else {
            throw is.invalidParameterError("tile", "boolean", image.tile);
          }
        }
        if (is.defined(image.left)) {
          if (is.integer(image.left)) {
            composite2.left = image.left;
          } else {
            throw is.invalidParameterError("left", "integer", image.left);
          }
        }
        if (is.defined(image.top)) {
          if (is.integer(image.top)) {
            composite2.top = image.top;
          } else {
            throw is.invalidParameterError("top", "integer", image.top);
          }
        }
        if (is.defined(image.top) !== is.defined(image.left)) {
          throw new Error("Expected both left and top to be set");
        } else {
          composite2.hasOffset = is.integer(image.top) && is.integer(image.left);
        }
        if (is.defined(image.gravity)) {
          if (is.integer(image.gravity) && is.inRange(image.gravity, 0, 8)) {
            composite2.gravity = image.gravity;
          } else if (is.string(image.gravity) && is.integer(this.constructor.gravity[image.gravity])) {
            composite2.gravity = this.constructor.gravity[image.gravity];
          } else {
            throw is.invalidParameterError("gravity", "valid gravity", image.gravity);
          }
        }
        if (is.defined(image.premultiplied)) {
          if (is.bool(image.premultiplied)) {
            composite2.premultiplied = image.premultiplied;
          } else {
            throw is.invalidParameterError("premultiplied", "boolean", image.premultiplied);
          }
        }
        return composite2;
      });
      return this;
    }
    module2.exports = (Sharp) => {
      Sharp.prototype.composite = composite;
      Sharp.blend = blend;
    };
  }
});

// ../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/operation.js
var require_operation = __commonJS({
  "../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/operation.js"(exports2, module2) {
    var is = require_is();
    var vipsPrecision = {
      integer: "integer",
      float: "float",
      approximate: "approximate"
    };
    function rotate(angle, options) {
      if (!is.defined(angle)) {
        return this.autoOrient();
      }
      if (this.options.angle || this.options.rotationAngle) {
        this.options.debuglog("ignoring previous rotate options");
        this.options.angle = 0;
        this.options.rotationAngle = 0;
      }
      if (is.integer(angle) && !(angle % 90)) {
        this.options.angle = angle;
      } else if (is.number(angle)) {
        this.options.rotationAngle = angle;
        if (is.object(options) && options.background) {
          this._setBackgroundColourOption("rotationBackground", options.background);
        }
      } else {
        throw is.invalidParameterError("angle", "numeric", angle);
      }
      return this;
    }
    function autoOrient() {
      this.options.input.autoOrient = true;
      return this;
    }
    function flip(flip2) {
      this.options.flip = is.bool(flip2) ? flip2 : true;
      return this;
    }
    function flop(flop2) {
      this.options.flop = is.bool(flop2) ? flop2 : true;
      return this;
    }
    function affine(matrix, options) {
      const flatMatrix = [].concat(...matrix);
      if (flatMatrix.length === 4 && flatMatrix.every(is.number)) {
        this.options.affineMatrix = flatMatrix;
      } else {
        throw is.invalidParameterError("matrix", "1x4 or 2x2 array", matrix);
      }
      if (is.defined(options)) {
        if (is.object(options)) {
          this._setBackgroundColourOption("affineBackground", options.background);
          if (is.defined(options.idx)) {
            if (is.number(options.idx)) {
              this.options.affineIdx = options.idx;
            } else {
              throw is.invalidParameterError("options.idx", "number", options.idx);
            }
          }
          if (is.defined(options.idy)) {
            if (is.number(options.idy)) {
              this.options.affineIdy = options.idy;
            } else {
              throw is.invalidParameterError("options.idy", "number", options.idy);
            }
          }
          if (is.defined(options.odx)) {
            if (is.number(options.odx)) {
              this.options.affineOdx = options.odx;
            } else {
              throw is.invalidParameterError("options.odx", "number", options.odx);
            }
          }
          if (is.defined(options.ody)) {
            if (is.number(options.ody)) {
              this.options.affineOdy = options.ody;
            } else {
              throw is.invalidParameterError("options.ody", "number", options.ody);
            }
          }
          if (is.defined(options.interpolator)) {
            if (is.inArray(options.interpolator, Object.values(this.constructor.interpolators))) {
              this.options.affineInterpolator = options.interpolator;
            } else {
              throw is.invalidParameterError("options.interpolator", "valid interpolator name", options.interpolator);
            }
          }
        } else {
          throw is.invalidParameterError("options", "object", options);
        }
      }
      return this;
    }
    function sharpen(options, flat, jagged) {
      if (!is.defined(options)) {
        this.options.sharpenSigma = -1;
      } else if (is.bool(options)) {
        this.options.sharpenSigma = options ? -1 : 0;
      } else if (is.number(options) && is.inRange(options, 0.01, 1e4)) {
        this.options.sharpenSigma = options;
        if (is.defined(flat)) {
          if (is.number(flat) && is.inRange(flat, 0, 1e4)) {
            this.options.sharpenM1 = flat;
          } else {
            throw is.invalidParameterError("flat", "number between 0 and 10000", flat);
          }
        }
        if (is.defined(jagged)) {
          if (is.number(jagged) && is.inRange(jagged, 0, 1e4)) {
            this.options.sharpenM2 = jagged;
          } else {
            throw is.invalidParameterError("jagged", "number between 0 and 10000", jagged);
          }
        }
      } else if (is.plainObject(options)) {
        if (is.number(options.sigma) && is.inRange(options.sigma, 1e-6, 10)) {
          this.options.sharpenSigma = options.sigma;
        } else {
          throw is.invalidParameterError("options.sigma", "number between 0.000001 and 10", options.sigma);
        }
        if (is.defined(options.m1)) {
          if (is.number(options.m1) && is.inRange(options.m1, 0, 1e6)) {
            this.options.sharpenM1 = options.m1;
          } else {
            throw is.invalidParameterError("options.m1", "number between 0 and 1000000", options.m1);
          }
        }
        if (is.defined(options.m2)) {
          if (is.number(options.m2) && is.inRange(options.m2, 0, 1e6)) {
            this.options.sharpenM2 = options.m2;
          } else {
            throw is.invalidParameterError("options.m2", "number between 0 and 1000000", options.m2);
          }
        }
        if (is.defined(options.x1)) {
          if (is.number(options.x1) && is.inRange(options.x1, 0, 1e6)) {
            this.options.sharpenX1 = options.x1;
          } else {
            throw is.invalidParameterError("options.x1", "number between 0 and 1000000", options.x1);
          }
        }
        if (is.defined(options.y2)) {
          if (is.number(options.y2) && is.inRange(options.y2, 0, 1e6)) {
            this.options.sharpenY2 = options.y2;
          } else {
            throw is.invalidParameterError("options.y2", "number between 0 and 1000000", options.y2);
          }
        }
        if (is.defined(options.y3)) {
          if (is.number(options.y3) && is.inRange(options.y3, 0, 1e6)) {
            this.options.sharpenY3 = options.y3;
          } else {
            throw is.invalidParameterError("options.y3", "number between 0 and 1000000", options.y3);
          }
        }
      } else {
        throw is.invalidParameterError("sigma", "number between 0.01 and 10000", options);
      }
      return this;
    }
    function median(size) {
      if (!is.defined(size)) {
        this.options.medianSize = 3;
      } else if (is.integer(size) && is.inRange(size, 1, 1e3)) {
        this.options.medianSize = size;
      } else {
        throw is.invalidParameterError("size", "integer between 1 and 1000", size);
      }
      return this;
    }
    function blur(options) {
      let sigma;
      if (is.number(options)) {
        sigma = options;
      } else if (is.plainObject(options)) {
        if (!is.number(options.sigma)) {
          throw is.invalidParameterError("options.sigma", "number between 0.3 and 1000", sigma);
        }
        sigma = options.sigma;
        if ("precision" in options) {
          if (is.string(vipsPrecision[options.precision])) {
            this.options.precision = vipsPrecision[options.precision];
          } else {
            throw is.invalidParameterError("precision", "one of: integer, float, approximate", options.precision);
          }
        }
        if ("minAmplitude" in options) {
          if (is.number(options.minAmplitude) && is.inRange(options.minAmplitude, 1e-3, 1)) {
            this.options.minAmpl = options.minAmplitude;
          } else {
            throw is.invalidParameterError("minAmplitude", "number between 0.001 and 1", options.minAmplitude);
          }
        }
      }
      if (!is.defined(options)) {
        this.options.blurSigma = -1;
      } else if (is.bool(options)) {
        this.options.blurSigma = options ? -1 : 0;
      } else if (is.number(sigma) && is.inRange(sigma, 0.3, 1e3)) {
        this.options.blurSigma = sigma;
      } else {
        throw is.invalidParameterError("sigma", "number between 0.3 and 1000", sigma);
      }
      return this;
    }
    function dilate(width) {
      if (!is.defined(width)) {
        this.options.dilateWidth = 1;
      } else if (is.integer(width) && width > 0) {
        this.options.dilateWidth = width;
      } else {
        throw is.invalidParameterError("dilate", "positive integer", dilate);
      }
      return this;
    }
    function erode(width) {
      if (!is.defined(width)) {
        this.options.erodeWidth = 1;
      } else if (is.integer(width) && width > 0) {
        this.options.erodeWidth = width;
      } else {
        throw is.invalidParameterError("erode", "positive integer", erode);
      }
      return this;
    }
    function flatten(options) {
      this.options.flatten = is.bool(options) ? options : true;
      if (is.object(options)) {
        this._setBackgroundColourOption("flattenBackground", options.background);
      }
      return this;
    }
    function unflatten() {
      this.options.unflatten = true;
      return this;
    }
    function gamma(gamma2, gammaOut) {
      if (!is.defined(gamma2)) {
        this.options.gamma = 2.2;
      } else if (is.number(gamma2) && is.inRange(gamma2, 1, 3)) {
        this.options.gamma = gamma2;
      } else {
        throw is.invalidParameterError("gamma", "number between 1.0 and 3.0", gamma2);
      }
      if (!is.defined(gammaOut)) {
        this.options.gammaOut = this.options.gamma;
      } else if (is.number(gammaOut) && is.inRange(gammaOut, 1, 3)) {
        this.options.gammaOut = gammaOut;
      } else {
        throw is.invalidParameterError("gammaOut", "number between 1.0 and 3.0", gammaOut);
      }
      return this;
    }
    function negate(options) {
      this.options.negate = is.bool(options) ? options : true;
      if (is.plainObject(options) && "alpha" in options) {
        if (!is.bool(options.alpha)) {
          throw is.invalidParameterError("alpha", "should be boolean value", options.alpha);
        } else {
          this.options.negateAlpha = options.alpha;
        }
      }
      return this;
    }
    function normalise(options) {
      if (is.plainObject(options)) {
        if (is.defined(options.lower)) {
          if (is.number(options.lower) && is.inRange(options.lower, 0, 99)) {
            this.options.normaliseLower = options.lower;
          } else {
            throw is.invalidParameterError("lower", "number between 0 and 99", options.lower);
          }
        }
        if (is.defined(options.upper)) {
          if (is.number(options.upper) && is.inRange(options.upper, 1, 100)) {
            this.options.normaliseUpper = options.upper;
          } else {
            throw is.invalidParameterError("upper", "number between 1 and 100", options.upper);
          }
        }
      }
      if (this.options.normaliseLower >= this.options.normaliseUpper) {
        throw is.invalidParameterError(
          "range",
          "lower to be less than upper",
          `${this.options.normaliseLower} >= ${this.options.normaliseUpper}`
        );
      }
      this.options.normalise = true;
      return this;
    }
    function normalize(options) {
      return this.normalise(options);
    }
    function clahe(options) {
      if (is.plainObject(options)) {
        if (is.integer(options.width) && options.width > 0) {
          this.options.claheWidth = options.width;
        } else {
          throw is.invalidParameterError("width", "integer greater than zero", options.width);
        }
        if (is.integer(options.height) && options.height > 0) {
          this.options.claheHeight = options.height;
        } else {
          throw is.invalidParameterError("height", "integer greater than zero", options.height);
        }
        if (is.defined(options.maxSlope)) {
          if (is.integer(options.maxSlope) && is.inRange(options.maxSlope, 0, 100)) {
            this.options.claheMaxSlope = options.maxSlope;
          } else {
            throw is.invalidParameterError("maxSlope", "integer between 0 and 100", options.maxSlope);
          }
        }
      } else {
        throw is.invalidParameterError("options", "plain object", options);
      }
      return this;
    }
    function convolve(kernel) {
      if (!is.object(kernel) || !Array.isArray(kernel.kernel) || !is.integer(kernel.width) || !is.integer(kernel.height) || !is.inRange(kernel.width, 3, 1001) || !is.inRange(kernel.height, 3, 1001) || kernel.height * kernel.width !== kernel.kernel.length) {
        throw new Error("Invalid convolution kernel");
      }
      if (!is.integer(kernel.scale)) {
        kernel.scale = kernel.kernel.reduce((a, b) => a + b, 0);
      }
      if (kernel.scale < 1) {
        kernel.scale = 1;
      }
      if (!is.integer(kernel.offset)) {
        kernel.offset = 0;
      }
      this.options.convKernel = kernel;
      return this;
    }
    function threshold(threshold2, options) {
      if (!is.defined(threshold2)) {
        this.options.threshold = 128;
      } else if (is.bool(threshold2)) {
        this.options.threshold = threshold2 ? 128 : 0;
      } else if (is.integer(threshold2) && is.inRange(threshold2, 0, 255)) {
        this.options.threshold = threshold2;
      } else {
        throw is.invalidParameterError("threshold", "integer between 0 and 255", threshold2);
      }
      if (!is.object(options) || options.greyscale === true || options.grayscale === true) {
        this.options.thresholdGrayscale = true;
      } else {
        this.options.thresholdGrayscale = false;
      }
      return this;
    }
    function boolean(operand, operator, options) {
      this.options.boolean = this._createInputDescriptor(operand, options);
      if (is.string(operator) && is.inArray(operator, ["and", "or", "eor"])) {
        this.options.booleanOp = operator;
      } else {
        throw is.invalidParameterError("operator", "one of: and, or, eor", operator);
      }
      return this;
    }
    function linear(a, b) {
      if (!is.defined(a) && is.number(b)) {
        a = 1;
      } else if (is.number(a) && !is.defined(b)) {
        b = 0;
      }
      if (!is.defined(a)) {
        this.options.linearA = [];
      } else if (is.number(a)) {
        this.options.linearA = [a];
      } else if (Array.isArray(a) && a.length && a.every(is.number)) {
        this.options.linearA = a;
      } else {
        throw is.invalidParameterError("a", "number or array of numbers", a);
      }
      if (!is.defined(b)) {
        this.options.linearB = [];
      } else if (is.number(b)) {
        this.options.linearB = [b];
      } else if (Array.isArray(b) && b.length && b.every(is.number)) {
        this.options.linearB = b;
      } else {
        throw is.invalidParameterError("b", "number or array of numbers", b);
      }
      if (this.options.linearA.length !== this.options.linearB.length) {
        throw new Error("Expected a and b to be arrays of the same length");
      }
      return this;
    }
    function recomb(inputMatrix) {
      if (!Array.isArray(inputMatrix)) {
        throw is.invalidParameterError("inputMatrix", "array", inputMatrix);
      }
      if (inputMatrix.length !== 3 && inputMatrix.length !== 4) {
        throw is.invalidParameterError("inputMatrix", "3x3 or 4x4 array", inputMatrix.length);
      }
      const recombMatrix = inputMatrix.flat().map(Number);
      if (recombMatrix.length !== 9 && recombMatrix.length !== 16) {
        throw is.invalidParameterError("inputMatrix", "cardinality of 9 or 16", recombMatrix.length);
      }
      this.options.recombMatrix = recombMatrix;
      return this;
    }
    function modulate(options) {
      if (!is.plainObject(options)) {
        throw is.invalidParameterError("options", "plain object", options);
      }
      if ("brightness" in options) {
        if (is.number(options.brightness) && options.brightness >= 0) {
          this.options.brightness = options.brightness;
        } else {
          throw is.invalidParameterError("brightness", "number above zero", options.brightness);
        }
      }
      if ("saturation" in options) {
        if (is.number(options.saturation) && options.saturation >= 0) {
          this.options.saturation = options.saturation;
        } else {
          throw is.invalidParameterError("saturation", "number above zero", options.saturation);
        }
      }
      if ("hue" in options) {
        if (is.integer(options.hue)) {
          this.options.hue = options.hue % 360;
        } else {
          throw is.invalidParameterError("hue", "number", options.hue);
        }
      }
      if ("lightness" in options) {
        if (is.number(options.lightness)) {
          this.options.lightness = options.lightness;
        } else {
          throw is.invalidParameterError("lightness", "number", options.lightness);
        }
      }
      return this;
    }
    module2.exports = (Sharp) => {
      Object.assign(Sharp.prototype, {
        autoOrient,
        rotate,
        flip,
        flop,
        affine,
        sharpen,
        erode,
        dilate,
        median,
        blur,
        flatten,
        unflatten,
        gamma,
        negate,
        normalise,
        normalize,
        clahe,
        convolve,
        threshold,
        boolean,
        linear,
        recomb,
        modulate
      });
    };
  }
});

// ../../node_modules/.pnpm/@img+colour@1.1.0/node_modules/@img/colour/color.cjs
var require_color = __commonJS({
  "../../node_modules/.pnpm/@img+colour@1.1.0/node_modules/@img/colour/color.cjs"(exports2, module2) {
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var index_exports = {};
    __export2(index_exports, {
      default: () => index_default
    });
    module2.exports = __toCommonJS2(index_exports);
    var colors = {
      aliceblue: [240, 248, 255],
      antiquewhite: [250, 235, 215],
      aqua: [0, 255, 255],
      aquamarine: [127, 255, 212],
      azure: [240, 255, 255],
      beige: [245, 245, 220],
      bisque: [255, 228, 196],
      black: [0, 0, 0],
      blanchedalmond: [255, 235, 205],
      blue: [0, 0, 255],
      blueviolet: [138, 43, 226],
      brown: [165, 42, 42],
      burlywood: [222, 184, 135],
      cadetblue: [95, 158, 160],
      chartreuse: [127, 255, 0],
      chocolate: [210, 105, 30],
      coral: [255, 127, 80],
      cornflowerblue: [100, 149, 237],
      cornsilk: [255, 248, 220],
      crimson: [220, 20, 60],
      cyan: [0, 255, 255],
      darkblue: [0, 0, 139],
      darkcyan: [0, 139, 139],
      darkgoldenrod: [184, 134, 11],
      darkgray: [169, 169, 169],
      darkgreen: [0, 100, 0],
      darkgrey: [169, 169, 169],
      darkkhaki: [189, 183, 107],
      darkmagenta: [139, 0, 139],
      darkolivegreen: [85, 107, 47],
      darkorange: [255, 140, 0],
      darkorchid: [153, 50, 204],
      darkred: [139, 0, 0],
      darksalmon: [233, 150, 122],
      darkseagreen: [143, 188, 143],
      darkslateblue: [72, 61, 139],
      darkslategray: [47, 79, 79],
      darkslategrey: [47, 79, 79],
      darkturquoise: [0, 206, 209],
      darkviolet: [148, 0, 211],
      deeppink: [255, 20, 147],
      deepskyblue: [0, 191, 255],
      dimgray: [105, 105, 105],
      dimgrey: [105, 105, 105],
      dodgerblue: [30, 144, 255],
      firebrick: [178, 34, 34],
      floralwhite: [255, 250, 240],
      forestgreen: [34, 139, 34],
      fuchsia: [255, 0, 255],
      gainsboro: [220, 220, 220],
      ghostwhite: [248, 248, 255],
      gold: [255, 215, 0],
      goldenrod: [218, 165, 32],
      gray: [128, 128, 128],
      green: [0, 128, 0],
      greenyellow: [173, 255, 47],
      grey: [128, 128, 128],
      honeydew: [240, 255, 240],
      hotpink: [255, 105, 180],
      indianred: [205, 92, 92],
      indigo: [75, 0, 130],
      ivory: [255, 255, 240],
      khaki: [240, 230, 140],
      lavender: [230, 230, 250],
      lavenderblush: [255, 240, 245],
      lawngreen: [124, 252, 0],
      lemonchiffon: [255, 250, 205],
      lightblue: [173, 216, 230],
      lightcoral: [240, 128, 128],
      lightcyan: [224, 255, 255],
      lightgoldenrodyellow: [250, 250, 210],
      lightgray: [211, 211, 211],
      lightgreen: [144, 238, 144],
      lightgrey: [211, 211, 211],
      lightpink: [255, 182, 193],
      lightsalmon: [255, 160, 122],
      lightseagreen: [32, 178, 170],
      lightskyblue: [135, 206, 250],
      lightslategray: [119, 136, 153],
      lightslategrey: [119, 136, 153],
      lightsteelblue: [176, 196, 222],
      lightyellow: [255, 255, 224],
      lime: [0, 255, 0],
      limegreen: [50, 205, 50],
      linen: [250, 240, 230],
      magenta: [255, 0, 255],
      maroon: [128, 0, 0],
      mediumaquamarine: [102, 205, 170],
      mediumblue: [0, 0, 205],
      mediumorchid: [186, 85, 211],
      mediumpurple: [147, 112, 219],
      mediumseagreen: [60, 179, 113],
      mediumslateblue: [123, 104, 238],
      mediumspringgreen: [0, 250, 154],
      mediumturquoise: [72, 209, 204],
      mediumvioletred: [199, 21, 133],
      midnightblue: [25, 25, 112],
      mintcream: [245, 255, 250],
      mistyrose: [255, 228, 225],
      moccasin: [255, 228, 181],
      navajowhite: [255, 222, 173],
      navy: [0, 0, 128],
      oldlace: [253, 245, 230],
      olive: [128, 128, 0],
      olivedrab: [107, 142, 35],
      orange: [255, 165, 0],
      orangered: [255, 69, 0],
      orchid: [218, 112, 214],
      palegoldenrod: [238, 232, 170],
      palegreen: [152, 251, 152],
      paleturquoise: [175, 238, 238],
      palevioletred: [219, 112, 147],
      papayawhip: [255, 239, 213],
      peachpuff: [255, 218, 185],
      peru: [205, 133, 63],
      pink: [255, 192, 203],
      plum: [221, 160, 221],
      powderblue: [176, 224, 230],
      purple: [128, 0, 128],
      rebeccapurple: [102, 51, 153],
      red: [255, 0, 0],
      rosybrown: [188, 143, 143],
      royalblue: [65, 105, 225],
      saddlebrown: [139, 69, 19],
      salmon: [250, 128, 114],
      sandybrown: [244, 164, 96],
      seagreen: [46, 139, 87],
      seashell: [255, 245, 238],
      sienna: [160, 82, 45],
      silver: [192, 192, 192],
      skyblue: [135, 206, 235],
      slateblue: [106, 90, 205],
      slategray: [112, 128, 144],
      slategrey: [112, 128, 144],
      snow: [255, 250, 250],
      springgreen: [0, 255, 127],
      steelblue: [70, 130, 180],
      tan: [210, 180, 140],
      teal: [0, 128, 128],
      thistle: [216, 191, 216],
      tomato: [255, 99, 71],
      turquoise: [64, 224, 208],
      violet: [238, 130, 238],
      wheat: [245, 222, 179],
      white: [255, 255, 255],
      whitesmoke: [245, 245, 245],
      yellow: [255, 255, 0],
      yellowgreen: [154, 205, 50]
    };
    for (const key in colors) Object.freeze(colors[key]);
    var color_name_default = Object.freeze(colors);
    var reverseNames = /* @__PURE__ */ Object.create(null);
    for (const name in color_name_default) {
      if (Object.hasOwn(color_name_default, name)) {
        reverseNames[color_name_default[name]] = name;
      }
    }
    var cs = {
      to: {},
      get: {}
    };
    cs.get = function(string) {
      const prefix = string.slice(0, 3).toLowerCase();
      let value;
      let model;
      switch (prefix) {
        case "hsl": {
          value = cs.get.hsl(string);
          model = "hsl";
          break;
        }
        case "hwb": {
          value = cs.get.hwb(string);
          model = "hwb";
          break;
        }
        default: {
          value = cs.get.rgb(string);
          model = "rgb";
          break;
        }
      }
      if (!value) {
        return null;
      }
      return { model, value };
    };
    cs.get.rgb = function(string) {
      if (!string) {
        return null;
      }
      const abbr = /^#([a-f\d]{3,4})$/i;
      const hex = /^#([a-f\d]{6})([a-f\d]{2})?$/i;
      const rgba = /^rgba?\(\s*([+-]?(?:\d*\.)?\d+(?:e\d+)?)(?=[\s,])\s*(?:,\s*)?([+-]?(?:\d*\.)?\d+(?:e\d+)?)(?=[\s,])\s*(?:,\s*)?([+-]?(?:\d*\.)?\d+(?:e\d+)?)\s*(?:[\s,|/]\s*([+-]?(?:\d*\.)?\d+(?:e\d+)?)(%?)\s*)?\)$/i;
      const per = /^rgba?\(\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*(?:[\s,|/]\s*([+-]?[\d.]+)(%?)\s*)?\)$/i;
      const keyword = /^(\w+)$/;
      let rgb = [0, 0, 0, 1];
      let match;
      let i;
      let hexAlpha;
      if (match = string.match(hex)) {
        hexAlpha = match[2];
        match = match[1];
        for (i = 0; i < 3; i++) {
          const i2 = i * 2;
          rgb[i] = Number.parseInt(match.slice(i2, i2 + 2), 16);
        }
        if (hexAlpha) {
          rgb[3] = Number.parseInt(hexAlpha, 16) / 255;
        }
      } else if (match = string.match(abbr)) {
        match = match[1];
        hexAlpha = match[3];
        for (i = 0; i < 3; i++) {
          rgb[i] = Number.parseInt(match[i] + match[i], 16);
        }
        if (hexAlpha) {
          rgb[3] = Number.parseInt(hexAlpha + hexAlpha, 16) / 255;
        }
      } else if (match = string.match(rgba)) {
        for (i = 0; i < 3; i++) {
          rgb[i] = Number.parseFloat(match[i + 1]);
        }
        if (match[4]) {
          rgb[3] = match[5] ? Number.parseFloat(match[4]) * 0.01 : Number.parseFloat(match[4]);
        }
      } else if (match = string.match(per)) {
        for (i = 0; i < 3; i++) {
          rgb[i] = Math.round(Number.parseFloat(match[i + 1]) * 2.55);
        }
        if (match[4]) {
          rgb[3] = match[5] ? Number.parseFloat(match[4]) * 0.01 : Number.parseFloat(match[4]);
        }
      } else if (match = string.toLowerCase().match(keyword)) {
        if (match[1] === "transparent") {
          return [0, 0, 0, 0];
        }
        if (!Object.hasOwn(color_name_default, match[1])) {
          return null;
        }
        rgb = color_name_default[match[1]].slice();
        rgb[3] = 1;
        return rgb;
      } else {
        return null;
      }
      for (i = 0; i < 3; i++) {
        rgb[i] = clamp(rgb[i], 0, 255);
      }
      rgb[3] = clamp(rgb[3], 0, 1);
      return rgb;
    };
    cs.get.hsl = function(string) {
      if (!string) {
        return null;
      }
      const hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*(?:[,|/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:e[+-]?\d+)?)\s*)?\)$/i;
      const match = string.match(hsl);
      if (match) {
        const alpha = Number.parseFloat(match[4]);
        const h = (Number.parseFloat(match[1]) % 360 + 360) % 360;
        const s = clamp(Number.parseFloat(match[2]), 0, 100);
        const l = clamp(Number.parseFloat(match[3]), 0, 100);
        const a = clamp(Number.isNaN(alpha) ? 1 : alpha, 0, 1);
        return [h, s, l, a];
      }
      return null;
    };
    cs.get.hwb = function(string) {
      if (!string) {
        return null;
      }
      const hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*[\s,]\s*([+-]?[\d.]+)%\s*[\s,]\s*([+-]?[\d.]+)%\s*(?:[\s,]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:e[+-]?\d+)?)\s*)?\)$/i;
      const match = string.match(hwb);
      if (match) {
        const alpha = Number.parseFloat(match[4]);
        const h = (Number.parseFloat(match[1]) % 360 + 360) % 360;
        const w = clamp(Number.parseFloat(match[2]), 0, 100);
        const b = clamp(Number.parseFloat(match[3]), 0, 100);
        const a = clamp(Number.isNaN(alpha) ? 1 : alpha, 0, 1);
        return [h, w, b, a];
      }
      return null;
    };
    cs.to.hex = function(...rgba) {
      return "#" + hexDouble(rgba[0]) + hexDouble(rgba[1]) + hexDouble(rgba[2]) + (rgba[3] < 1 ? hexDouble(Math.round(rgba[3] * 255)) : "");
    };
    cs.to.rgb = function(...rgba) {
      return rgba.length < 4 || rgba[3] === 1 ? "rgb(" + Math.round(rgba[0]) + ", " + Math.round(rgba[1]) + ", " + Math.round(rgba[2]) + ")" : "rgba(" + Math.round(rgba[0]) + ", " + Math.round(rgba[1]) + ", " + Math.round(rgba[2]) + ", " + rgba[3] + ")";
    };
    cs.to.rgb.percent = function(...rgba) {
      const r = Math.round(rgba[0] / 255 * 100);
      const g = Math.round(rgba[1] / 255 * 100);
      const b = Math.round(rgba[2] / 255 * 100);
      return rgba.length < 4 || rgba[3] === 1 ? "rgb(" + r + "%, " + g + "%, " + b + "%)" : "rgba(" + r + "%, " + g + "%, " + b + "%, " + rgba[3] + ")";
    };
    cs.to.hsl = function(...hsla) {
      return hsla.length < 4 || hsla[3] === 1 ? "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)" : "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, " + hsla[3] + ")";
    };
    cs.to.hwb = function(...hwba) {
      let a = "";
      if (hwba.length >= 4 && hwba[3] !== 1) {
        a = ", " + hwba[3];
      }
      return "hwb(" + hwba[0] + ", " + hwba[1] + "%, " + hwba[2] + "%" + a + ")";
    };
    cs.to.keyword = function(...rgb) {
      return reverseNames[rgb.slice(0, 3)];
    };
    function clamp(number_, min, max) {
      return Math.min(Math.max(min, number_), max);
    }
    function hexDouble(number_) {
      const string_ = Math.round(number_).toString(16).toUpperCase();
      return string_.length < 2 ? "0" + string_ : string_;
    }
    var color_string_default = cs;
    var reverseKeywords = {};
    for (const key of Object.keys(color_name_default)) {
      reverseKeywords[color_name_default[key]] = key;
    }
    var convert = {
      rgb: { channels: 3, labels: "rgb" },
      hsl: { channels: 3, labels: "hsl" },
      hsv: { channels: 3, labels: "hsv" },
      hwb: { channels: 3, labels: "hwb" },
      cmyk: { channels: 4, labels: "cmyk" },
      xyz: { channels: 3, labels: "xyz" },
      lab: { channels: 3, labels: "lab" },
      oklab: { channels: 3, labels: ["okl", "oka", "okb"] },
      lch: { channels: 3, labels: "lch" },
      oklch: { channels: 3, labels: ["okl", "okc", "okh"] },
      hex: { channels: 1, labels: ["hex"] },
      keyword: { channels: 1, labels: ["keyword"] },
      ansi16: { channels: 1, labels: ["ansi16"] },
      ansi256: { channels: 1, labels: ["ansi256"] },
      hcg: { channels: 3, labels: ["h", "c", "g"] },
      apple: { channels: 3, labels: ["r16", "g16", "b16"] },
      gray: { channels: 1, labels: ["gray"] }
    };
    var conversions_default = convert;
    var LAB_FT = (6 / 29) ** 3;
    function srgbNonlinearTransform(c) {
      const cc = c > 31308e-7 ? 1.055 * c ** (1 / 2.4) - 0.055 : c * 12.92;
      return Math.min(Math.max(0, cc), 1);
    }
    function srgbNonlinearTransformInv(c) {
      return c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92;
    }
    for (const model of Object.keys(convert)) {
      if (!("channels" in convert[model])) {
        throw new Error("missing channels property: " + model);
      }
      if (!("labels" in convert[model])) {
        throw new Error("missing channel labels property: " + model);
      }
      if (convert[model].labels.length !== convert[model].channels) {
        throw new Error("channel and label counts mismatch: " + model);
      }
      const { channels, labels } = convert[model];
      delete convert[model].channels;
      delete convert[model].labels;
      Object.defineProperty(convert[model], "channels", { value: channels });
      Object.defineProperty(convert[model], "labels", { value: labels });
    }
    convert.rgb.hsl = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const min = Math.min(r, g, b);
      const max = Math.max(r, g, b);
      const delta = max - min;
      let h;
      let s;
      switch (max) {
        case min: {
          h = 0;
          break;
        }
        case r: {
          h = (g - b) / delta;
          break;
        }
        case g: {
          h = 2 + (b - r) / delta;
          break;
        }
        case b: {
          h = 4 + (r - g) / delta;
          break;
        }
      }
      h = Math.min(h * 60, 360);
      if (h < 0) {
        h += 360;
      }
      const l = (min + max) / 2;
      if (max === min) {
        s = 0;
      } else if (l <= 0.5) {
        s = delta / (max + min);
      } else {
        s = delta / (2 - max - min);
      }
      return [h, s * 100, l * 100];
    };
    convert.rgb.hsv = function(rgb) {
      let rdif;
      let gdif;
      let bdif;
      let h;
      let s;
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const v = Math.max(r, g, b);
      const diff = v - Math.min(r, g, b);
      const diffc = function(c) {
        return (v - c) / 6 / diff + 1 / 2;
      };
      if (diff === 0) {
        h = 0;
        s = 0;
      } else {
        s = diff / v;
        rdif = diffc(r);
        gdif = diffc(g);
        bdif = diffc(b);
        switch (v) {
          case r: {
            h = bdif - gdif;
            break;
          }
          case g: {
            h = 1 / 3 + rdif - bdif;
            break;
          }
          case b: {
            h = 2 / 3 + gdif - rdif;
            break;
          }
        }
        if (h < 0) {
          h += 1;
        } else if (h > 1) {
          h -= 1;
        }
      }
      return [
        h * 360,
        s * 100,
        v * 100
      ];
    };
    convert.rgb.hwb = function(rgb) {
      const r = rgb[0];
      const g = rgb[1];
      let b = rgb[2];
      const h = convert.rgb.hsl(rgb)[0];
      const w = 1 / 255 * Math.min(r, Math.min(g, b));
      b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
      return [h, w * 100, b * 100];
    };
    convert.rgb.oklab = function(rgb) {
      const r = srgbNonlinearTransformInv(rgb[0] / 255);
      const g = srgbNonlinearTransformInv(rgb[1] / 255);
      const b = srgbNonlinearTransformInv(rgb[2] / 255);
      const lp = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
      const mp = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
      const sp = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
      const l = 0.2104542553 * lp + 0.793617785 * mp - 0.0040720468 * sp;
      const aa = 1.9779984951 * lp - 2.428592205 * mp + 0.4505937099 * sp;
      const bb = 0.0259040371 * lp + 0.7827717662 * mp - 0.808675766 * sp;
      return [l * 100, aa * 100, bb * 100];
    };
    convert.rgb.cmyk = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const k = Math.min(1 - r, 1 - g, 1 - b);
      const c = (1 - r - k) / (1 - k) || 0;
      const m = (1 - g - k) / (1 - k) || 0;
      const y = (1 - b - k) / (1 - k) || 0;
      return [c * 100, m * 100, y * 100, k * 100];
    };
    function comparativeDistance(x, y) {
      return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
    }
    convert.rgb.keyword = function(rgb) {
      const reversed = reverseKeywords[rgb];
      if (reversed) {
        return reversed;
      }
      let currentClosestDistance = Number.POSITIVE_INFINITY;
      let currentClosestKeyword;
      for (const keyword of Object.keys(color_name_default)) {
        const value = color_name_default[keyword];
        const distance = comparativeDistance(rgb, value);
        if (distance < currentClosestDistance) {
          currentClosestDistance = distance;
          currentClosestKeyword = keyword;
        }
      }
      return currentClosestKeyword;
    };
    convert.keyword.rgb = function(keyword) {
      return [...color_name_default[keyword]];
    };
    convert.rgb.xyz = function(rgb) {
      const r = srgbNonlinearTransformInv(rgb[0] / 255);
      const g = srgbNonlinearTransformInv(rgb[1] / 255);
      const b = srgbNonlinearTransformInv(rgb[2] / 255);
      const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
      const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
      const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
      return [x * 100, y * 100, z * 100];
    };
    convert.rgb.lab = function(rgb) {
      const xyz = convert.rgb.xyz(rgb);
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > LAB_FT ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > LAB_FT ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > LAB_FT ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert.hsl.rgb = function(hsl) {
      const h = hsl[0] / 360;
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      let t3;
      let value;
      if (s === 0) {
        value = l * 255;
        return [value, value, value];
      }
      const t2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const t1 = 2 * l - t2;
      const rgb = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * -(i - 1);
        if (t3 < 0) {
          t3++;
        }
        if (t3 > 1) {
          t3--;
        }
        if (6 * t3 < 1) {
          value = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
          value = t2;
        } else if (3 * t3 < 2) {
          value = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
          value = t1;
        }
        rgb[i] = value * 255;
      }
      return rgb;
    };
    convert.hsl.hsv = function(hsl) {
      const h = hsl[0];
      let s = hsl[1] / 100;
      let l = hsl[2] / 100;
      let smin = s;
      const lmin = Math.max(l, 0.01);
      l *= 2;
      s *= l <= 1 ? l : 2 - l;
      smin *= lmin <= 1 ? lmin : 2 - lmin;
      const v = (l + s) / 2;
      const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
      return [h, sv * 100, v * 100];
    };
    convert.hsv.rgb = function(hsv) {
      const h = hsv[0] / 60;
      const s = hsv[1] / 100;
      let v = hsv[2] / 100;
      const hi = Math.floor(h) % 6;
      const f = h - Math.floor(h);
      const p = 255 * v * (1 - s);
      const q = 255 * v * (1 - s * f);
      const t = 255 * v * (1 - s * (1 - f));
      v *= 255;
      switch (hi) {
        case 0: {
          return [v, t, p];
        }
        case 1: {
          return [q, v, p];
        }
        case 2: {
          return [p, v, t];
        }
        case 3: {
          return [p, q, v];
        }
        case 4: {
          return [t, p, v];
        }
        case 5: {
          return [v, p, q];
        }
      }
    };
    convert.hsv.hsl = function(hsv) {
      const h = hsv[0];
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const vmin = Math.max(v, 0.01);
      let sl;
      let l;
      l = (2 - s) * v;
      const lmin = (2 - s) * vmin;
      sl = s * vmin;
      sl /= lmin <= 1 ? lmin : 2 - lmin;
      sl = sl || 0;
      l /= 2;
      return [h, sl * 100, l * 100];
    };
    convert.hwb.rgb = function(hwb) {
      const h = hwb[0] / 360;
      let wh = hwb[1] / 100;
      let bl = hwb[2] / 100;
      const ratio = wh + bl;
      let f;
      if (ratio > 1) {
        wh /= ratio;
        bl /= ratio;
      }
      const i = Math.floor(6 * h);
      const v = 1 - bl;
      f = 6 * h - i;
      if ((i & 1) !== 0) {
        f = 1 - f;
      }
      const n = wh + f * (v - wh);
      let r;
      let g;
      let b;
      switch (i) {
        default:
        case 6:
        case 0: {
          r = v;
          g = n;
          b = wh;
          break;
        }
        case 1: {
          r = n;
          g = v;
          b = wh;
          break;
        }
        case 2: {
          r = wh;
          g = v;
          b = n;
          break;
        }
        case 3: {
          r = wh;
          g = n;
          b = v;
          break;
        }
        case 4: {
          r = n;
          g = wh;
          b = v;
          break;
        }
        case 5: {
          r = v;
          g = wh;
          b = n;
          break;
        }
      }
      return [r * 255, g * 255, b * 255];
    };
    convert.cmyk.rgb = function(cmyk) {
      const c = cmyk[0] / 100;
      const m = cmyk[1] / 100;
      const y = cmyk[2] / 100;
      const k = cmyk[3] / 100;
      const r = 1 - Math.min(1, c * (1 - k) + k);
      const g = 1 - Math.min(1, m * (1 - k) + k);
      const b = 1 - Math.min(1, y * (1 - k) + k);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.rgb = function(xyz) {
      const x = xyz[0] / 100;
      const y = xyz[1] / 100;
      const z = xyz[2] / 100;
      let r;
      let g;
      let b;
      r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
      g = x * -0.969266 + y * 1.8760108 + z * 0.041556;
      b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;
      r = srgbNonlinearTransform(r);
      g = srgbNonlinearTransform(g);
      b = srgbNonlinearTransform(b);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.lab = function(xyz) {
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > LAB_FT ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > LAB_FT ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > LAB_FT ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert.xyz.oklab = function(xyz) {
      const x = xyz[0] / 100;
      const y = xyz[1] / 100;
      const z = xyz[2] / 100;
      const lp = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
      const mp = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
      const sp = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z);
      const l = 0.2104542553 * lp + 0.793617785 * mp - 0.0040720468 * sp;
      const a = 1.9779984951 * lp - 2.428592205 * mp + 0.4505937099 * sp;
      const b = 0.0259040371 * lp + 0.7827717662 * mp - 0.808675766 * sp;
      return [l * 100, a * 100, b * 100];
    };
    convert.oklab.oklch = function(oklab) {
      return convert.lab.lch(oklab);
    };
    convert.oklab.xyz = function(oklab) {
      const ll = oklab[0] / 100;
      const a = oklab[1] / 100;
      const b = oklab[2] / 100;
      const l = (0.999999998 * ll + 0.396337792 * a + 0.215803758 * b) ** 3;
      const m = (1.000000008 * ll - 0.105561342 * a - 0.063854175 * b) ** 3;
      const s = (1.000000055 * ll - 0.089484182 * a - 1.291485538 * b) ** 3;
      const x = 1.227013851 * l - 0.55779998 * m + 0.281256149 * s;
      const y = -0.040580178 * l + 1.11225687 * m - 0.071676679 * s;
      const z = -0.076381285 * l - 0.421481978 * m + 1.58616322 * s;
      return [x * 100, y * 100, z * 100];
    };
    convert.oklab.rgb = function(oklab) {
      const ll = oklab[0] / 100;
      const aa = oklab[1] / 100;
      const bb = oklab[2] / 100;
      const l = (ll + 0.3963377774 * aa + 0.2158037573 * bb) ** 3;
      const m = (ll - 0.1055613458 * aa - 0.0638541728 * bb) ** 3;
      const s = (ll - 0.0894841775 * aa - 1.291485548 * bb) ** 3;
      const r = srgbNonlinearTransform(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
      const g = srgbNonlinearTransform(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
      const b = srgbNonlinearTransform(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);
      return [r * 255, g * 255, b * 255];
    };
    convert.oklch.oklab = function(oklch) {
      return convert.lch.lab(oklch);
    };
    convert.lab.xyz = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let x;
      let y;
      let z;
      y = (l + 16) / 116;
      x = a / 500 + y;
      z = y - b / 200;
      const y2 = y ** 3;
      const x2 = x ** 3;
      const z2 = z ** 3;
      y = y2 > LAB_FT ? y2 : (y - 16 / 116) / 7.787;
      x = x2 > LAB_FT ? x2 : (x - 16 / 116) / 7.787;
      z = z2 > LAB_FT ? z2 : (z - 16 / 116) / 7.787;
      x *= 95.047;
      y *= 100;
      z *= 108.883;
      return [x, y, z];
    };
    convert.lab.lch = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let h;
      const hr = Math.atan2(b, a);
      h = hr * 360 / 2 / Math.PI;
      if (h < 0) {
        h += 360;
      }
      const c = Math.sqrt(a * a + b * b);
      return [l, c, h];
    };
    convert.lch.lab = function(lch) {
      const l = lch[0];
      const c = lch[1];
      const h = lch[2];
      const hr = h / 360 * 2 * Math.PI;
      const a = c * Math.cos(hr);
      const b = c * Math.sin(hr);
      return [l, a, b];
    };
    convert.rgb.ansi16 = function(args, saturation = null) {
      const [r, g, b] = args;
      let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation;
      value = Math.round(value / 50);
      if (value === 0) {
        return 30;
      }
      let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
      if (value === 2) {
        ansi += 60;
      }
      return ansi;
    };
    convert.hsv.ansi16 = function(args) {
      return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
    };
    convert.rgb.ansi256 = function(args) {
      const r = args[0];
      const g = args[1];
      const b = args[2];
      if (r >> 4 === g >> 4 && g >> 4 === b >> 4) {
        if (r < 8) {
          return 16;
        }
        if (r > 248) {
          return 231;
        }
        return Math.round((r - 8) / 247 * 24) + 232;
      }
      const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
      return ansi;
    };
    convert.ansi16.rgb = function(args) {
      args = args[0];
      let color = args % 10;
      if (color === 0 || color === 7) {
        if (args > 50) {
          color += 3.5;
        }
        color = color / 10.5 * 255;
        return [color, color, color];
      }
      const mult = (Math.trunc(args > 50) + 1) * 0.5;
      const r = (color & 1) * mult * 255;
      const g = (color >> 1 & 1) * mult * 255;
      const b = (color >> 2 & 1) * mult * 255;
      return [r, g, b];
    };
    convert.ansi256.rgb = function(args) {
      args = args[0];
      if (args >= 232) {
        const c = (args - 232) * 10 + 8;
        return [c, c, c];
      }
      args -= 16;
      let rem;
      const r = Math.floor(args / 36) / 5 * 255;
      const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
      const b = rem % 6 / 5 * 255;
      return [r, g, b];
    };
    convert.rgb.hex = function(args) {
      const integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
      const string = integer.toString(16).toUpperCase();
      return "000000".slice(string.length) + string;
    };
    convert.hex.rgb = function(args) {
      const match = args.toString(16).match(/[a-f\d]{6}|[a-f\d]{3}/i);
      if (!match) {
        return [0, 0, 0];
      }
      let colorString = match[0];
      if (match[0].length === 3) {
        colorString = [...colorString].map((char) => char + char).join("");
      }
      const integer = Number.parseInt(colorString, 16);
      const r = integer >> 16 & 255;
      const g = integer >> 8 & 255;
      const b = integer & 255;
      return [r, g, b];
    };
    convert.rgb.hcg = function(rgb) {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;
      const max = Math.max(Math.max(r, g), b);
      const min = Math.min(Math.min(r, g), b);
      const chroma = max - min;
      let hue;
      const grayscale = chroma < 1 ? min / (1 - chroma) : 0;
      if (chroma <= 0) {
        hue = 0;
      } else if (max === r) {
        hue = (g - b) / chroma % 6;
      } else if (max === g) {
        hue = 2 + (b - r) / chroma;
      } else {
        hue = 4 + (r - g) / chroma;
      }
      hue /= 6;
      hue %= 1;
      return [hue * 360, chroma * 100, grayscale * 100];
    };
    convert.hsl.hcg = function(hsl) {
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
      let f = 0;
      if (c < 1) {
        f = (l - 0.5 * c) / (1 - c);
      }
      return [hsl[0], c * 100, f * 100];
    };
    convert.hsv.hcg = function(hsv) {
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const c = s * v;
      let f = 0;
      if (c < 1) {
        f = (v - c) / (1 - c);
      }
      return [hsv[0], c * 100, f * 100];
    };
    convert.hcg.rgb = function(hcg) {
      const h = hcg[0] / 360;
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      if (c === 0) {
        return [g * 255, g * 255, g * 255];
      }
      const pure = [0, 0, 0];
      const hi = h % 1 * 6;
      const v = hi % 1;
      const w = 1 - v;
      let mg = 0;
      switch (Math.floor(hi)) {
        case 0: {
          pure[0] = 1;
          pure[1] = v;
          pure[2] = 0;
          break;
        }
        case 1: {
          pure[0] = w;
          pure[1] = 1;
          pure[2] = 0;
          break;
        }
        case 2: {
          pure[0] = 0;
          pure[1] = 1;
          pure[2] = v;
          break;
        }
        case 3: {
          pure[0] = 0;
          pure[1] = w;
          pure[2] = 1;
          break;
        }
        case 4: {
          pure[0] = v;
          pure[1] = 0;
          pure[2] = 1;
          break;
        }
        default: {
          pure[0] = 1;
          pure[1] = 0;
          pure[2] = w;
        }
      }
      mg = (1 - c) * g;
      return [
        (c * pure[0] + mg) * 255,
        (c * pure[1] + mg) * 255,
        (c * pure[2] + mg) * 255
      ];
    };
    convert.hcg.hsv = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      let f = 0;
      if (v > 0) {
        f = c / v;
      }
      return [hcg[0], f * 100, v * 100];
    };
    convert.hcg.hsl = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const l = g * (1 - c) + 0.5 * c;
      let s = 0;
      if (l > 0 && l < 0.5) {
        s = c / (2 * l);
      } else if (l >= 0.5 && l < 1) {
        s = c / (2 * (1 - l));
      }
      return [hcg[0], s * 100, l * 100];
    };
    convert.hcg.hwb = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      return [hcg[0], (v - c) * 100, (1 - v) * 100];
    };
    convert.hwb.hcg = function(hwb) {
      const w = hwb[1] / 100;
      const b = hwb[2] / 100;
      const v = 1 - b;
      const c = v - w;
      let g = 0;
      if (c < 1) {
        g = (v - c) / (1 - c);
      }
      return [hwb[0], c * 100, g * 100];
    };
    convert.apple.rgb = function(apple) {
      return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
    };
    convert.rgb.apple = function(rgb) {
      return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
    };
    convert.gray.rgb = function(args) {
      return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
    };
    convert.gray.hsl = function(args) {
      return [0, 0, args[0]];
    };
    convert.gray.hsv = convert.gray.hsl;
    convert.gray.hwb = function(gray) {
      return [0, 100, gray[0]];
    };
    convert.gray.cmyk = function(gray) {
      return [0, 0, 0, gray[0]];
    };
    convert.gray.lab = function(gray) {
      return [gray[0], 0, 0];
    };
    convert.gray.hex = function(gray) {
      const value = Math.round(gray[0] / 100 * 255) & 255;
      const integer = (value << 16) + (value << 8) + value;
      const string = integer.toString(16).toUpperCase();
      return "000000".slice(string.length) + string;
    };
    convert.rgb.gray = function(rgb) {
      const value = (rgb[0] + rgb[1] + rgb[2]) / 3;
      return [value / 255 * 100];
    };
    function buildGraph() {
      const graph = {};
      const models2 = Object.keys(conversions_default);
      for (let { length } = models2, i = 0; i < length; i++) {
        graph[models2[i]] = {
          // http://jsperf.com/1-vs-infinity
          // micro-opt, but this is simple.
          distance: -1,
          parent: null
        };
      }
      return graph;
    }
    function deriveBFS(fromModel) {
      const graph = buildGraph();
      const queue = [fromModel];
      graph[fromModel].distance = 0;
      while (queue.length > 0) {
        const current = queue.pop();
        const adjacents = Object.keys(conversions_default[current]);
        for (let { length } = adjacents, i = 0; i < length; i++) {
          const adjacent = adjacents[i];
          const node = graph[adjacent];
          if (node.distance === -1) {
            node.distance = graph[current].distance + 1;
            node.parent = current;
            queue.unshift(adjacent);
          }
        }
      }
      return graph;
    }
    function link(from, to) {
      return function(args) {
        return to(from(args));
      };
    }
    function wrapConversion(toModel, graph) {
      const path = [graph[toModel].parent, toModel];
      let fn = conversions_default[graph[toModel].parent][toModel];
      let cur = graph[toModel].parent;
      while (graph[cur].parent) {
        path.unshift(graph[cur].parent);
        fn = link(conversions_default[graph[cur].parent][cur], fn);
        cur = graph[cur].parent;
      }
      fn.conversion = path;
      return fn;
    }
    function route(fromModel) {
      const graph = deriveBFS(fromModel);
      const conversion = {};
      const models2 = Object.keys(graph);
      for (let { length } = models2, i = 0; i < length; i++) {
        const toModel = models2[i];
        const node = graph[toModel];
        if (node.parent === null) {
          continue;
        }
        conversion[toModel] = wrapConversion(toModel, graph);
      }
      return conversion;
    }
    var route_default = route;
    var convert2 = {};
    var models = Object.keys(conversions_default);
    function wrapRaw(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        return fn(args);
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    function wrapRounded(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        const result = fn(args);
        if (typeof result === "object") {
          for (let { length } = result, i = 0; i < length; i++) {
            result[i] = Math.round(result[i]);
          }
        }
        return result;
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    for (const fromModel of models) {
      convert2[fromModel] = {};
      Object.defineProperty(convert2[fromModel], "channels", { value: conversions_default[fromModel].channels });
      Object.defineProperty(convert2[fromModel], "labels", { value: conversions_default[fromModel].labels });
      const routes = route_default(fromModel);
      const routeModels = Object.keys(routes);
      for (const toModel of routeModels) {
        const fn = routes[toModel];
        convert2[fromModel][toModel] = wrapRounded(fn);
        convert2[fromModel][toModel].raw = wrapRaw(fn);
      }
    }
    var color_convert_default = convert2;
    var skippedModels = [
      // To be honest, I don't really feel like keyword belongs in color convert, but eh.
      "keyword",
      // Gray conflicts with some method names, and has its own method defined.
      "gray",
      // Shouldn't really be in color-convert either...
      "hex"
    ];
    var hashedModelKeys = {};
    for (const model of Object.keys(color_convert_default)) {
      hashedModelKeys[[...color_convert_default[model].labels].sort().join("")] = model;
    }
    var limiters = {};
    function Color(object, model) {
      if (!(this instanceof Color)) {
        return new Color(object, model);
      }
      if (model && model in skippedModels) {
        model = null;
      }
      if (model && !(model in color_convert_default)) {
        throw new Error("Unknown model: " + model);
      }
      let i;
      let channels;
      if (object == null) {
        this.model = "rgb";
        this.color = [0, 0, 0];
        this.valpha = 1;
      } else if (object instanceof Color) {
        this.model = object.model;
        this.color = [...object.color];
        this.valpha = object.valpha;
      } else if (typeof object === "string") {
        const result = color_string_default.get(object);
        if (result === null) {
          throw new Error("Unable to parse color from string: " + object);
        }
        this.model = result.model;
        channels = color_convert_default[this.model].channels;
        this.color = result.value.slice(0, channels);
        this.valpha = typeof result.value[channels] === "number" ? result.value[channels] : 1;
      } else if (object.length > 0) {
        this.model = model || "rgb";
        channels = color_convert_default[this.model].channels;
        const newArray = Array.prototype.slice.call(object, 0, channels);
        this.color = zeroArray(newArray, channels);
        this.valpha = typeof object[channels] === "number" ? object[channels] : 1;
      } else if (typeof object === "number") {
        this.model = "rgb";
        this.color = [
          object >> 16 & 255,
          object >> 8 & 255,
          object & 255
        ];
        this.valpha = 1;
      } else {
        this.valpha = 1;
        const keys = Object.keys(object);
        if ("alpha" in object) {
          keys.splice(keys.indexOf("alpha"), 1);
          this.valpha = typeof object.alpha === "number" ? object.alpha : 0;
        }
        const hashedKeys = keys.sort().join("");
        if (!(hashedKeys in hashedModelKeys)) {
          throw new Error("Unable to parse color from object: " + JSON.stringify(object));
        }
        this.model = hashedModelKeys[hashedKeys];
        const { labels } = color_convert_default[this.model];
        const color = [];
        for (i = 0; i < labels.length; i++) {
          color.push(object[labels[i]]);
        }
        this.color = zeroArray(color);
      }
      if (limiters[this.model]) {
        channels = color_convert_default[this.model].channels;
        for (i = 0; i < channels; i++) {
          const limit = limiters[this.model][i];
          if (limit) {
            this.color[i] = limit(this.color[i]);
          }
        }
      }
      this.valpha = Math.max(0, Math.min(1, this.valpha));
      if (Object.freeze) {
        Object.freeze(this);
      }
    }
    Color.prototype = {
      toString() {
        return this.string();
      },
      toJSON() {
        return this[this.model]();
      },
      string(places) {
        let self = this.model in color_string_default.to ? this : this.rgb();
        self = self.round(typeof places === "number" ? places : 1);
        const arguments_ = self.valpha === 1 ? self.color : [...self.color, this.valpha];
        return color_string_default.to[self.model](...arguments_);
      },
      percentString(places) {
        const self = this.rgb().round(typeof places === "number" ? places : 1);
        const arguments_ = self.valpha === 1 ? self.color : [...self.color, this.valpha];
        return color_string_default.to.rgb.percent(...arguments_);
      },
      array() {
        return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha];
      },
      object() {
        const result = {};
        const { channels } = color_convert_default[this.model];
        const { labels } = color_convert_default[this.model];
        for (let i = 0; i < channels; i++) {
          result[labels[i]] = this.color[i];
        }
        if (this.valpha !== 1) {
          result.alpha = this.valpha;
        }
        return result;
      },
      unitArray() {
        const rgb = this.rgb().color;
        rgb[0] /= 255;
        rgb[1] /= 255;
        rgb[2] /= 255;
        if (this.valpha !== 1) {
          rgb.push(this.valpha);
        }
        return rgb;
      },
      unitObject() {
        const rgb = this.rgb().object();
        rgb.r /= 255;
        rgb.g /= 255;
        rgb.b /= 255;
        if (this.valpha !== 1) {
          rgb.alpha = this.valpha;
        }
        return rgb;
      },
      round(places) {
        places = Math.max(places || 0, 0);
        return new Color([...this.color.map(roundToPlace(places)), this.valpha], this.model);
      },
      alpha(value) {
        if (value !== void 0) {
          return new Color([...this.color, Math.max(0, Math.min(1, value))], this.model);
        }
        return this.valpha;
      },
      // Rgb
      red: getset("rgb", 0, maxfn(255)),
      green: getset("rgb", 1, maxfn(255)),
      blue: getset("rgb", 2, maxfn(255)),
      hue: getset(["hsl", "hsv", "hsl", "hwb", "hcg"], 0, (value) => (value % 360 + 360) % 360),
      saturationl: getset("hsl", 1, maxfn(100)),
      lightness: getset("hsl", 2, maxfn(100)),
      saturationv: getset("hsv", 1, maxfn(100)),
      value: getset("hsv", 2, maxfn(100)),
      chroma: getset("hcg", 1, maxfn(100)),
      gray: getset("hcg", 2, maxfn(100)),
      white: getset("hwb", 1, maxfn(100)),
      wblack: getset("hwb", 2, maxfn(100)),
      cyan: getset("cmyk", 0, maxfn(100)),
      magenta: getset("cmyk", 1, maxfn(100)),
      yellow: getset("cmyk", 2, maxfn(100)),
      black: getset("cmyk", 3, maxfn(100)),
      x: getset("xyz", 0, maxfn(95.047)),
      y: getset("xyz", 1, maxfn(100)),
      z: getset("xyz", 2, maxfn(108.833)),
      l: getset("lab", 0, maxfn(100)),
      a: getset("lab", 1),
      b: getset("lab", 2),
      keyword(value) {
        if (value !== void 0) {
          return new Color(value);
        }
        return color_convert_default[this.model].keyword(this.color);
      },
      hex(value) {
        if (value !== void 0) {
          return new Color(value);
        }
        return color_string_default.to.hex(...this.rgb().round().color);
      },
      hexa(value) {
        if (value !== void 0) {
          return new Color(value);
        }
        const rgbArray = this.rgb().round().color;
        let alphaHex = Math.round(this.valpha * 255).toString(16).toUpperCase();
        if (alphaHex.length === 1) {
          alphaHex = "0" + alphaHex;
        }
        return color_string_default.to.hex(...rgbArray) + alphaHex;
      },
      rgbNumber() {
        const rgb = this.rgb().color;
        return (rgb[0] & 255) << 16 | (rgb[1] & 255) << 8 | rgb[2] & 255;
      },
      luminosity() {
        const rgb = this.rgb().color;
        const lum = [];
        for (const [i, element] of rgb.entries()) {
          const chan = element / 255;
          lum[i] = chan <= 0.04045 ? chan / 12.92 : ((chan + 0.055) / 1.055) ** 2.4;
        }
        return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
      },
      contrast(color2) {
        const lum1 = this.luminosity();
        const lum2 = color2.luminosity();
        if (lum1 > lum2) {
          return (lum1 + 0.05) / (lum2 + 0.05);
        }
        return (lum2 + 0.05) / (lum1 + 0.05);
      },
      level(color2) {
        const contrastRatio = this.contrast(color2);
        if (contrastRatio >= 7) {
          return "AAA";
        }
        return contrastRatio >= 4.5 ? "AA" : "";
      },
      isDark() {
        const rgb = this.rgb().color;
        const yiq = (rgb[0] * 2126 + rgb[1] * 7152 + rgb[2] * 722) / 1e4;
        return yiq < 128;
      },
      isLight() {
        return !this.isDark();
      },
      negate() {
        const rgb = this.rgb();
        for (let i = 0; i < 3; i++) {
          rgb.color[i] = 255 - rgb.color[i];
        }
        return rgb;
      },
      lighten(ratio) {
        const hsl = this.hsl();
        hsl.color[2] += hsl.color[2] * ratio;
        return hsl;
      },
      darken(ratio) {
        const hsl = this.hsl();
        hsl.color[2] -= hsl.color[2] * ratio;
        return hsl;
      },
      saturate(ratio) {
        const hsl = this.hsl();
        hsl.color[1] += hsl.color[1] * ratio;
        return hsl;
      },
      desaturate(ratio) {
        const hsl = this.hsl();
        hsl.color[1] -= hsl.color[1] * ratio;
        return hsl;
      },
      whiten(ratio) {
        const hwb = this.hwb();
        hwb.color[1] += hwb.color[1] * ratio;
        return hwb;
      },
      blacken(ratio) {
        const hwb = this.hwb();
        hwb.color[2] += hwb.color[2] * ratio;
        return hwb;
      },
      grayscale() {
        const rgb = this.rgb().color;
        const value = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
        return Color.rgb(value, value, value);
      },
      fade(ratio) {
        return this.alpha(this.valpha - this.valpha * ratio);
      },
      opaquer(ratio) {
        return this.alpha(this.valpha + this.valpha * ratio);
      },
      rotate(degrees) {
        const hsl = this.hsl();
        let hue = hsl.color[0];
        hue = (hue + degrees) % 360;
        hue = hue < 0 ? 360 + hue : hue;
        hsl.color[0] = hue;
        return hsl;
      },
      mix(mixinColor, weight) {
        if (!mixinColor || !mixinColor.rgb) {
          throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
        }
        const color1 = mixinColor.rgb();
        const color2 = this.rgb();
        const p = weight === void 0 ? 0.5 : weight;
        const w = 2 * p - 1;
        const a = color1.alpha() - color2.alpha();
        const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
        const w2 = 1 - w1;
        return Color.rgb(
          w1 * color1.red() + w2 * color2.red(),
          w1 * color1.green() + w2 * color2.green(),
          w1 * color1.blue() + w2 * color2.blue(),
          color1.alpha() * p + color2.alpha() * (1 - p)
        );
      }
    };
    for (const model of Object.keys(color_convert_default)) {
      if (skippedModels.includes(model)) {
        continue;
      }
      const { channels } = color_convert_default[model];
      Color.prototype[model] = function(...arguments_) {
        if (this.model === model) {
          return new Color(this);
        }
        if (arguments_.length > 0) {
          return new Color(arguments_, model);
        }
        return new Color([...assertArray(color_convert_default[this.model][model].raw(this.color)), this.valpha], model);
      };
      Color[model] = function(...arguments_) {
        let color = arguments_[0];
        if (typeof color === "number") {
          color = zeroArray(arguments_, channels);
        }
        return new Color(color, model);
      };
    }
    function roundTo(number, places) {
      return Number(number.toFixed(places));
    }
    function roundToPlace(places) {
      return function(number) {
        return roundTo(number, places);
      };
    }
    function getset(model, channel, modifier) {
      model = Array.isArray(model) ? model : [model];
      for (const m of model) {
        (limiters[m] ||= [])[channel] = modifier;
      }
      model = model[0];
      return function(value) {
        let result;
        if (value !== void 0) {
          if (modifier) {
            value = modifier(value);
          }
          result = this[model]();
          result.color[channel] = value;
          return result;
        }
        result = this[model]().color[channel];
        if (modifier) {
          result = modifier(result);
        }
        return result;
      };
    }
    function maxfn(max) {
      return function(v) {
        return Math.max(0, Math.min(max, v));
      };
    }
    function assertArray(value) {
      return Array.isArray(value) ? value : [value];
    }
    function zeroArray(array, length) {
      for (let i = 0; i < length; i++) {
        if (typeof array[i] !== "number") {
          array[i] = 0;
        }
      }
      return array;
    }
    var index_default = Color;
  }
});

// ../../node_modules/.pnpm/@img+colour@1.1.0/node_modules/@img/colour/index.cjs
var require_colour = __commonJS({
  "../../node_modules/.pnpm/@img+colour@1.1.0/node_modules/@img/colour/index.cjs"(exports2, module2) {
    module2.exports = require_color().default;
  }
});

// ../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/colour.js
var require_colour2 = __commonJS({
  "../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/colour.js"(exports2, module2) {
    var color = require_colour();
    var is = require_is();
    var colourspace = {
      multiband: "multiband",
      "b-w": "b-w",
      bw: "b-w",
      cmyk: "cmyk",
      srgb: "srgb"
    };
    function tint(tint2) {
      this._setBackgroundColourOption("tint", tint2);
      return this;
    }
    function greyscale(greyscale2) {
      this.options.greyscale = is.bool(greyscale2) ? greyscale2 : true;
      return this;
    }
    function grayscale(grayscale2) {
      return this.greyscale(grayscale2);
    }
    function pipelineColourspace(colourspace2) {
      if (!is.string(colourspace2)) {
        throw is.invalidParameterError("colourspace", "string", colourspace2);
      }
      this.options.colourspacePipeline = colourspace2;
      return this;
    }
    function pipelineColorspace(colorspace) {
      return this.pipelineColourspace(colorspace);
    }
    function toColourspace(colourspace2) {
      if (!is.string(colourspace2)) {
        throw is.invalidParameterError("colourspace", "string", colourspace2);
      }
      this.options.colourspace = colourspace2;
      return this;
    }
    function toColorspace(colorspace) {
      return this.toColourspace(colorspace);
    }
    function _getBackgroundColourOption(value) {
      if (is.object(value) || is.string(value) && value.length >= 3 && value.length <= 200) {
        const colour = color(value);
        return [
          colour.red(),
          colour.green(),
          colour.blue(),
          Math.round(colour.alpha() * 255)
        ];
      } else {
        throw is.invalidParameterError("background", "object or string", value);
      }
    }
    function _setBackgroundColourOption(key, value) {
      if (is.defined(value)) {
        this.options[key] = _getBackgroundColourOption(value);
      }
    }
    module2.exports = (Sharp) => {
      Object.assign(Sharp.prototype, {
        // Public
        tint,
        greyscale,
        grayscale,
        pipelineColourspace,
        pipelineColorspace,
        toColourspace,
        toColorspace,
        // Private
        _getBackgroundColourOption,
        _setBackgroundColourOption
      });
      Sharp.colourspace = colourspace;
      Sharp.colorspace = colourspace;
    };
  }
});

// ../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/channel.js
var require_channel = __commonJS({
  "../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/channel.js"(exports2, module2) {
    var is = require_is();
    var bool = {
      and: "and",
      or: "or",
      eor: "eor"
    };
    function removeAlpha() {
      this.options.removeAlpha = true;
      return this;
    }
    function ensureAlpha(alpha) {
      if (is.defined(alpha)) {
        if (is.number(alpha) && is.inRange(alpha, 0, 1)) {
          this.options.ensureAlpha = alpha;
        } else {
          throw is.invalidParameterError("alpha", "number between 0 and 1", alpha);
        }
      } else {
        this.options.ensureAlpha = 1;
      }
      return this;
    }
    function extractChannel(channel) {
      const channelMap = { red: 0, green: 1, blue: 2, alpha: 3 };
      if (Object.keys(channelMap).includes(channel)) {
        channel = channelMap[channel];
      }
      if (is.integer(channel) && is.inRange(channel, 0, 4)) {
        this.options.extractChannel = channel;
      } else {
        throw is.invalidParameterError("channel", "integer or one of: red, green, blue, alpha", channel);
      }
      return this;
    }
    function joinChannel(images, options) {
      if (Array.isArray(images)) {
        images.forEach(function(image) {
          this.options.joinChannelIn.push(this._createInputDescriptor(image, options));
        }, this);
      } else {
        this.options.joinChannelIn.push(this._createInputDescriptor(images, options));
      }
      return this;
    }
    function bandbool(boolOp) {
      if (is.string(boolOp) && is.inArray(boolOp, ["and", "or", "eor"])) {
        this.options.bandBoolOp = boolOp;
      } else {
        throw is.invalidParameterError("boolOp", "one of: and, or, eor", boolOp);
      }
      return this;
    }
    module2.exports = (Sharp) => {
      Object.assign(Sharp.prototype, {
        // Public instance functions
        removeAlpha,
        ensureAlpha,
        extractChannel,
        joinChannel,
        bandbool
      });
      Sharp.bool = bool;
    };
  }
});

// ../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/output.js
var require_output = __commonJS({
  "../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/output.js"(exports2, module2) {
    var path = require("node:path");
    var is = require_is();
    var sharp2 = require_sharp();
    var formats = /* @__PURE__ */ new Map([
      ["heic", "heif"],
      ["heif", "heif"],
      ["avif", "avif"],
      ["jpeg", "jpeg"],
      ["jpg", "jpeg"],
      ["jpe", "jpeg"],
      ["tile", "tile"],
      ["dz", "tile"],
      ["png", "png"],
      ["raw", "raw"],
      ["tiff", "tiff"],
      ["tif", "tiff"],
      ["webp", "webp"],
      ["gif", "gif"],
      ["jp2", "jp2"],
      ["jpx", "jp2"],
      ["j2k", "jp2"],
      ["j2c", "jp2"],
      ["jxl", "jxl"]
    ]);
    var jp2Regex = /\.(jp[2x]|j2[kc])$/i;
    var errJp2Save = () => new Error("JP2 output requires libvips with support for OpenJPEG");
    var bitdepthFromColourCount = (colours) => 1 << 31 - Math.clz32(Math.ceil(Math.log2(colours)));
    function toFile(fileOut, callback) {
      let err;
      if (!is.string(fileOut)) {
        err = new Error("Missing output file path");
      } else if (is.string(this.options.input.file) && path.resolve(this.options.input.file) === path.resolve(fileOut)) {
        err = new Error("Cannot use same file for input and output");
      } else if (jp2Regex.test(path.extname(fileOut)) && !this.constructor.format.jp2k.output.file) {
        err = errJp2Save();
      }
      if (err) {
        if (is.fn(callback)) {
          callback(err);
        } else {
          return Promise.reject(err);
        }
      } else {
        this.options.fileOut = fileOut;
        const stack = Error();
        return this._pipeline(callback, stack);
      }
      return this;
    }
    function toBuffer(options, callback) {
      if (is.object(options)) {
        this._setBooleanOption("resolveWithObject", options.resolveWithObject);
      } else if (this.options.resolveWithObject) {
        this.options.resolveWithObject = false;
      }
      this.options.fileOut = "";
      const stack = Error();
      return this._pipeline(is.fn(options) ? options : callback, stack);
    }
    function keepExif() {
      this.options.keepMetadata |= 1;
      return this;
    }
    function withExif(exif) {
      if (is.object(exif)) {
        for (const [ifd, entries] of Object.entries(exif)) {
          if (is.object(entries)) {
            for (const [k, v] of Object.entries(entries)) {
              if (is.string(v)) {
                this.options.withExif[`exif-${ifd.toLowerCase()}-${k}`] = v;
              } else {
                throw is.invalidParameterError(`${ifd}.${k}`, "string", v);
              }
            }
          } else {
            throw is.invalidParameterError(ifd, "object", entries);
          }
        }
      } else {
        throw is.invalidParameterError("exif", "object", exif);
      }
      this.options.withExifMerge = false;
      return this.keepExif();
    }
    function withExifMerge(exif) {
      this.withExif(exif);
      this.options.withExifMerge = true;
      return this;
    }
    function keepIccProfile() {
      this.options.keepMetadata |= 8;
      return this;
    }
    function withIccProfile(icc, options) {
      if (is.string(icc)) {
        this.options.withIccProfile = icc;
      } else {
        throw is.invalidParameterError("icc", "string", icc);
      }
      this.keepIccProfile();
      if (is.object(options)) {
        if (is.defined(options.attach)) {
          if (is.bool(options.attach)) {
            if (!options.attach) {
              this.options.keepMetadata &= ~8;
            }
          } else {
            throw is.invalidParameterError("attach", "boolean", options.attach);
          }
        }
      }
      return this;
    }
    function keepXmp() {
      this.options.keepMetadata |= 2;
      return this;
    }
    function withXmp(xmp) {
      if (is.string(xmp) && xmp.length > 0) {
        this.options.withXmp = xmp;
        this.options.keepMetadata |= 2;
      } else {
        throw is.invalidParameterError("xmp", "non-empty string", xmp);
      }
      return this;
    }
    function keepMetadata() {
      this.options.keepMetadata = 31;
      return this;
    }
    function withMetadata(options) {
      this.keepMetadata();
      this.withIccProfile("srgb");
      if (is.object(options)) {
        if (is.defined(options.orientation)) {
          if (is.integer(options.orientation) && is.inRange(options.orientation, 1, 8)) {
            this.options.withMetadataOrientation = options.orientation;
          } else {
            throw is.invalidParameterError("orientation", "integer between 1 and 8", options.orientation);
          }
        }
        if (is.defined(options.density)) {
          if (is.number(options.density) && options.density > 0) {
            this.options.withMetadataDensity = options.density;
          } else {
            throw is.invalidParameterError("density", "positive number", options.density);
          }
        }
        if (is.defined(options.icc)) {
          this.withIccProfile(options.icc);
        }
        if (is.defined(options.exif)) {
          this.withExifMerge(options.exif);
        }
      }
      return this;
    }
    function toFormat(format, options) {
      const actualFormat = formats.get((is.object(format) && is.string(format.id) ? format.id : format).toLowerCase());
      if (!actualFormat) {
        throw is.invalidParameterError("format", `one of: ${[...formats.keys()].join(", ")}`, format);
      }
      return this[actualFormat](options);
    }
    function jpeg(options) {
      if (is.object(options)) {
        if (is.defined(options.quality)) {
          if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
            this.options.jpegQuality = options.quality;
          } else {
            throw is.invalidParameterError("quality", "integer between 1 and 100", options.quality);
          }
        }
        if (is.defined(options.progressive)) {
          this._setBooleanOption("jpegProgressive", options.progressive);
        }
        if (is.defined(options.chromaSubsampling)) {
          if (is.string(options.chromaSubsampling) && is.inArray(options.chromaSubsampling, ["4:2:0", "4:4:4"])) {
            this.options.jpegChromaSubsampling = options.chromaSubsampling;
          } else {
            throw is.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", options.chromaSubsampling);
          }
        }
        const optimiseCoding = is.bool(options.optimizeCoding) ? options.optimizeCoding : options.optimiseCoding;
        if (is.defined(optimiseCoding)) {
          this._setBooleanOption("jpegOptimiseCoding", optimiseCoding);
        }
        if (is.defined(options.mozjpeg)) {
          if (is.bool(options.mozjpeg)) {
            if (options.mozjpeg) {
              this.options.jpegTrellisQuantisation = true;
              this.options.jpegOvershootDeringing = true;
              this.options.jpegOptimiseScans = true;
              this.options.jpegProgressive = true;
              this.options.jpegQuantisationTable = 3;
            }
          } else {
            throw is.invalidParameterError("mozjpeg", "boolean", options.mozjpeg);
          }
        }
        const trellisQuantisation = is.bool(options.trellisQuantization) ? options.trellisQuantization : options.trellisQuantisation;
        if (is.defined(trellisQuantisation)) {
          this._setBooleanOption("jpegTrellisQuantisation", trellisQuantisation);
        }
        if (is.defined(options.overshootDeringing)) {
          this._setBooleanOption("jpegOvershootDeringing", options.overshootDeringing);
        }
        const optimiseScans = is.bool(options.optimizeScans) ? options.optimizeScans : options.optimiseScans;
        if (is.defined(optimiseScans)) {
          this._setBooleanOption("jpegOptimiseScans", optimiseScans);
          if (optimiseScans) {
            this.options.jpegProgressive = true;
          }
        }
        const quantisationTable = is.number(options.quantizationTable) ? options.quantizationTable : options.quantisationTable;
        if (is.defined(quantisationTable)) {
          if (is.integer(quantisationTable) && is.inRange(quantisationTable, 0, 8)) {
            this.options.jpegQuantisationTable = quantisationTable;
          } else {
            throw is.invalidParameterError("quantisationTable", "integer between 0 and 8", quantisationTable);
          }
        }
      }
      return this._updateFormatOut("jpeg", options);
    }
    function png(options) {
      if (is.object(options)) {
        if (is.defined(options.progressive)) {
          this._setBooleanOption("pngProgressive", options.progressive);
        }
        if (is.defined(options.compressionLevel)) {
          if (is.integer(options.compressionLevel) && is.inRange(options.compressionLevel, 0, 9)) {
            this.options.pngCompressionLevel = options.compressionLevel;
          } else {
            throw is.invalidParameterError("compressionLevel", "integer between 0 and 9", options.compressionLevel);
          }
        }
        if (is.defined(options.adaptiveFiltering)) {
          this._setBooleanOption("pngAdaptiveFiltering", options.adaptiveFiltering);
        }
        const colours = options.colours || options.colors;
        if (is.defined(colours)) {
          if (is.integer(colours) && is.inRange(colours, 2, 256)) {
            this.options.pngBitdepth = bitdepthFromColourCount(colours);
          } else {
            throw is.invalidParameterError("colours", "integer between 2 and 256", colours);
          }
        }
        if (is.defined(options.palette)) {
          this._setBooleanOption("pngPalette", options.palette);
        } else if ([options.quality, options.effort, options.colours, options.colors, options.dither].some(is.defined)) {
          this._setBooleanOption("pngPalette", true);
        }
        if (this.options.pngPalette) {
          if (is.defined(options.quality)) {
            if (is.integer(options.quality) && is.inRange(options.quality, 0, 100)) {
              this.options.pngQuality = options.quality;
            } else {
              throw is.invalidParameterError("quality", "integer between 0 and 100", options.quality);
            }
          }
          if (is.defined(options.effort)) {
            if (is.integer(options.effort) && is.inRange(options.effort, 1, 10)) {
              this.options.pngEffort = options.effort;
            } else {
              throw is.invalidParameterError("effort", "integer between 1 and 10", options.effort);
            }
          }
          if (is.defined(options.dither)) {
            if (is.number(options.dither) && is.inRange(options.dither, 0, 1)) {
              this.options.pngDither = options.dither;
            } else {
              throw is.invalidParameterError("dither", "number between 0.0 and 1.0", options.dither);
            }
          }
        }
      }
      return this._updateFormatOut("png", options);
    }
    function webp(options) {
      if (is.object(options)) {
        if (is.defined(options.quality)) {
          if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
            this.options.webpQuality = options.quality;
          } else {
            throw is.invalidParameterError("quality", "integer between 1 and 100", options.quality);
          }
        }
        if (is.defined(options.alphaQuality)) {
          if (is.integer(options.alphaQuality) && is.inRange(options.alphaQuality, 0, 100)) {
            this.options.webpAlphaQuality = options.alphaQuality;
          } else {
            throw is.invalidParameterError("alphaQuality", "integer between 0 and 100", options.alphaQuality);
          }
        }
        if (is.defined(options.lossless)) {
          this._setBooleanOption("webpLossless", options.lossless);
        }
        if (is.defined(options.nearLossless)) {
          this._setBooleanOption("webpNearLossless", options.nearLossless);
        }
        if (is.defined(options.smartSubsample)) {
          this._setBooleanOption("webpSmartSubsample", options.smartSubsample);
        }
        if (is.defined(options.smartDeblock)) {
          this._setBooleanOption("webpSmartDeblock", options.smartDeblock);
        }
        if (is.defined(options.preset)) {
          if (is.string(options.preset) && is.inArray(options.preset, ["default", "photo", "picture", "drawing", "icon", "text"])) {
            this.options.webpPreset = options.preset;
          } else {
            throw is.invalidParameterError("preset", "one of: default, photo, picture, drawing, icon, text", options.preset);
          }
        }
        if (is.defined(options.effort)) {
          if (is.integer(options.effort) && is.inRange(options.effort, 0, 6)) {
            this.options.webpEffort = options.effort;
          } else {
            throw is.invalidParameterError("effort", "integer between 0 and 6", options.effort);
          }
        }
        if (is.defined(options.minSize)) {
          this._setBooleanOption("webpMinSize", options.minSize);
        }
        if (is.defined(options.mixed)) {
          this._setBooleanOption("webpMixed", options.mixed);
        }
      }
      trySetAnimationOptions(options, this.options);
      return this._updateFormatOut("webp", options);
    }
    function gif(options) {
      if (is.object(options)) {
        if (is.defined(options.reuse)) {
          this._setBooleanOption("gifReuse", options.reuse);
        }
        if (is.defined(options.progressive)) {
          this._setBooleanOption("gifProgressive", options.progressive);
        }
        const colours = options.colours || options.colors;
        if (is.defined(colours)) {
          if (is.integer(colours) && is.inRange(colours, 2, 256)) {
            this.options.gifBitdepth = bitdepthFromColourCount(colours);
          } else {
            throw is.invalidParameterError("colours", "integer between 2 and 256", colours);
          }
        }
        if (is.defined(options.effort)) {
          if (is.number(options.effort) && is.inRange(options.effort, 1, 10)) {
            this.options.gifEffort = options.effort;
          } else {
            throw is.invalidParameterError("effort", "integer between 1 and 10", options.effort);
          }
        }
        if (is.defined(options.dither)) {
          if (is.number(options.dither) && is.inRange(options.dither, 0, 1)) {
            this.options.gifDither = options.dither;
          } else {
            throw is.invalidParameterError("dither", "number between 0.0 and 1.0", options.dither);
          }
        }
        if (is.defined(options.interFrameMaxError)) {
          if (is.number(options.interFrameMaxError) && is.inRange(options.interFrameMaxError, 0, 32)) {
            this.options.gifInterFrameMaxError = options.interFrameMaxError;
          } else {
            throw is.invalidParameterError("interFrameMaxError", "number between 0.0 and 32.0", options.interFrameMaxError);
          }
        }
        if (is.defined(options.interPaletteMaxError)) {
          if (is.number(options.interPaletteMaxError) && is.inRange(options.interPaletteMaxError, 0, 256)) {
            this.options.gifInterPaletteMaxError = options.interPaletteMaxError;
          } else {
            throw is.invalidParameterError("interPaletteMaxError", "number between 0.0 and 256.0", options.interPaletteMaxError);
          }
        }
        if (is.defined(options.keepDuplicateFrames)) {
          if (is.bool(options.keepDuplicateFrames)) {
            this._setBooleanOption("gifKeepDuplicateFrames", options.keepDuplicateFrames);
          } else {
            throw is.invalidParameterError("keepDuplicateFrames", "boolean", options.keepDuplicateFrames);
          }
        }
      }
      trySetAnimationOptions(options, this.options);
      return this._updateFormatOut("gif", options);
    }
    function jp2(options) {
      if (!this.constructor.format.jp2k.output.buffer) {
        throw errJp2Save();
      }
      if (is.object(options)) {
        if (is.defined(options.quality)) {
          if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
            this.options.jp2Quality = options.quality;
          } else {
            throw is.invalidParameterError("quality", "integer between 1 and 100", options.quality);
          }
        }
        if (is.defined(options.lossless)) {
          if (is.bool(options.lossless)) {
            this.options.jp2Lossless = options.lossless;
          } else {
            throw is.invalidParameterError("lossless", "boolean", options.lossless);
          }
        }
        if (is.defined(options.tileWidth)) {
          if (is.integer(options.tileWidth) && is.inRange(options.tileWidth, 1, 32768)) {
            this.options.jp2TileWidth = options.tileWidth;
          } else {
            throw is.invalidParameterError("tileWidth", "integer between 1 and 32768", options.tileWidth);
          }
        }
        if (is.defined(options.tileHeight)) {
          if (is.integer(options.tileHeight) && is.inRange(options.tileHeight, 1, 32768)) {
            this.options.jp2TileHeight = options.tileHeight;
          } else {
            throw is.invalidParameterError("tileHeight", "integer between 1 and 32768", options.tileHeight);
          }
        }
        if (is.defined(options.chromaSubsampling)) {
          if (is.string(options.chromaSubsampling) && is.inArray(options.chromaSubsampling, ["4:2:0", "4:4:4"])) {
            this.options.jp2ChromaSubsampling = options.chromaSubsampling;
          } else {
            throw is.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", options.chromaSubsampling);
          }
        }
      }
      return this._updateFormatOut("jp2", options);
    }
    function trySetAnimationOptions(source, target) {
      if (is.object(source) && is.defined(source.loop)) {
        if (is.integer(source.loop) && is.inRange(source.loop, 0, 65535)) {
          target.loop = source.loop;
        } else {
          throw is.invalidParameterError("loop", "integer between 0 and 65535", source.loop);
        }
      }
      if (is.object(source) && is.defined(source.delay)) {
        if (is.integer(source.delay) && is.inRange(source.delay, 0, 65535)) {
          target.delay = [source.delay];
        } else if (Array.isArray(source.delay) && source.delay.every(is.integer) && source.delay.every((v) => is.inRange(v, 0, 65535))) {
          target.delay = source.delay;
        } else {
          throw is.invalidParameterError("delay", "integer or an array of integers between 0 and 65535", source.delay);
        }
      }
    }
    function tiff(options) {
      if (is.object(options)) {
        if (is.defined(options.quality)) {
          if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
            this.options.tiffQuality = options.quality;
          } else {
            throw is.invalidParameterError("quality", "integer between 1 and 100", options.quality);
          }
        }
        if (is.defined(options.bitdepth)) {
          if (is.integer(options.bitdepth) && is.inArray(options.bitdepth, [1, 2, 4, 8])) {
            this.options.tiffBitdepth = options.bitdepth;
          } else {
            throw is.invalidParameterError("bitdepth", "1, 2, 4 or 8", options.bitdepth);
          }
        }
        if (is.defined(options.tile)) {
          this._setBooleanOption("tiffTile", options.tile);
        }
        if (is.defined(options.tileWidth)) {
          if (is.integer(options.tileWidth) && options.tileWidth > 0) {
            this.options.tiffTileWidth = options.tileWidth;
          } else {
            throw is.invalidParameterError("tileWidth", "integer greater than zero", options.tileWidth);
          }
        }
        if (is.defined(options.tileHeight)) {
          if (is.integer(options.tileHeight) && options.tileHeight > 0) {
            this.options.tiffTileHeight = options.tileHeight;
          } else {
            throw is.invalidParameterError("tileHeight", "integer greater than zero", options.tileHeight);
          }
        }
        if (is.defined(options.miniswhite)) {
          this._setBooleanOption("tiffMiniswhite", options.miniswhite);
        }
        if (is.defined(options.pyramid)) {
          this._setBooleanOption("tiffPyramid", options.pyramid);
        }
        if (is.defined(options.xres)) {
          if (is.number(options.xres) && options.xres > 0) {
            this.options.tiffXres = options.xres;
          } else {
            throw is.invalidParameterError("xres", "number greater than zero", options.xres);
          }
        }
        if (is.defined(options.yres)) {
          if (is.number(options.yres) && options.yres > 0) {
            this.options.tiffYres = options.yres;
          } else {
            throw is.invalidParameterError("yres", "number greater than zero", options.yres);
          }
        }
        if (is.defined(options.compression)) {
          if (is.string(options.compression) && is.inArray(options.compression, ["none", "jpeg", "deflate", "packbits", "ccittfax4", "lzw", "webp", "zstd", "jp2k"])) {
            this.options.tiffCompression = options.compression;
          } else {
            throw is.invalidParameterError("compression", "one of: none, jpeg, deflate, packbits, ccittfax4, lzw, webp, zstd, jp2k", options.compression);
          }
        }
        if (is.defined(options.bigtiff)) {
          this._setBooleanOption("tiffBigtiff", options.bigtiff);
        }
        if (is.defined(options.predictor)) {
          if (is.string(options.predictor) && is.inArray(options.predictor, ["none", "horizontal", "float"])) {
            this.options.tiffPredictor = options.predictor;
          } else {
            throw is.invalidParameterError("predictor", "one of: none, horizontal, float", options.predictor);
          }
        }
        if (is.defined(options.resolutionUnit)) {
          if (is.string(options.resolutionUnit) && is.inArray(options.resolutionUnit, ["inch", "cm"])) {
            this.options.tiffResolutionUnit = options.resolutionUnit;
          } else {
            throw is.invalidParameterError("resolutionUnit", "one of: inch, cm", options.resolutionUnit);
          }
        }
      }
      return this._updateFormatOut("tiff", options);
    }
    function avif(options) {
      return this.heif({ ...options, compression: "av1" });
    }
    function heif(options) {
      if (is.object(options)) {
        if (is.string(options.compression) && is.inArray(options.compression, ["av1", "hevc"])) {
          this.options.heifCompression = options.compression;
        } else {
          throw is.invalidParameterError("compression", "one of: av1, hevc", options.compression);
        }
        if (is.defined(options.quality)) {
          if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
            this.options.heifQuality = options.quality;
          } else {
            throw is.invalidParameterError("quality", "integer between 1 and 100", options.quality);
          }
        }
        if (is.defined(options.lossless)) {
          if (is.bool(options.lossless)) {
            this.options.heifLossless = options.lossless;
          } else {
            throw is.invalidParameterError("lossless", "boolean", options.lossless);
          }
        }
        if (is.defined(options.effort)) {
          if (is.integer(options.effort) && is.inRange(options.effort, 0, 9)) {
            this.options.heifEffort = options.effort;
          } else {
            throw is.invalidParameterError("effort", "integer between 0 and 9", options.effort);
          }
        }
        if (is.defined(options.chromaSubsampling)) {
          if (is.string(options.chromaSubsampling) && is.inArray(options.chromaSubsampling, ["4:2:0", "4:4:4"])) {
            this.options.heifChromaSubsampling = options.chromaSubsampling;
          } else {
            throw is.invalidParameterError("chromaSubsampling", "one of: 4:2:0, 4:4:4", options.chromaSubsampling);
          }
        }
        if (is.defined(options.bitdepth)) {
          if (is.integer(options.bitdepth) && is.inArray(options.bitdepth, [8, 10, 12])) {
            if (options.bitdepth !== 8 && this.constructor.versions.heif) {
              throw is.invalidParameterError("bitdepth when using prebuilt binaries", 8, options.bitdepth);
            }
            this.options.heifBitdepth = options.bitdepth;
          } else {
            throw is.invalidParameterError("bitdepth", "8, 10 or 12", options.bitdepth);
          }
        }
      } else {
        throw is.invalidParameterError("options", "Object", options);
      }
      return this._updateFormatOut("heif", options);
    }
    function jxl(options) {
      if (is.object(options)) {
        if (is.defined(options.quality)) {
          if (is.integer(options.quality) && is.inRange(options.quality, 1, 100)) {
            this.options.jxlDistance = options.quality >= 30 ? 0.1 + (100 - options.quality) * 0.09 : 53 / 3e3 * options.quality * options.quality - 23 / 20 * options.quality + 25;
          } else {
            throw is.invalidParameterError("quality", "integer between 1 and 100", options.quality);
          }
        } else if (is.defined(options.distance)) {
          if (is.number(options.distance) && is.inRange(options.distance, 0, 15)) {
            this.options.jxlDistance = options.distance;
          } else {
            throw is.invalidParameterError("distance", "number between 0.0 and 15.0", options.distance);
          }
        }
        if (is.defined(options.decodingTier)) {
          if (is.integer(options.decodingTier) && is.inRange(options.decodingTier, 0, 4)) {
            this.options.jxlDecodingTier = options.decodingTier;
          } else {
            throw is.invalidParameterError("decodingTier", "integer between 0 and 4", options.decodingTier);
          }
        }
        if (is.defined(options.lossless)) {
          if (is.bool(options.lossless)) {
            this.options.jxlLossless = options.lossless;
          } else {
            throw is.invalidParameterError("lossless", "boolean", options.lossless);
          }
        }
        if (is.defined(options.effort)) {
          if (is.integer(options.effort) && is.inRange(options.effort, 1, 9)) {
            this.options.jxlEffort = options.effort;
          } else {
            throw is.invalidParameterError("effort", "integer between 1 and 9", options.effort);
          }
        }
      }
      trySetAnimationOptions(options, this.options);
      return this._updateFormatOut("jxl", options);
    }
    function raw(options) {
      if (is.object(options)) {
        if (is.defined(options.depth)) {
          if (is.string(options.depth) && is.inArray(
            options.depth,
            ["char", "uchar", "short", "ushort", "int", "uint", "float", "complex", "double", "dpcomplex"]
          )) {
            this.options.rawDepth = options.depth;
          } else {
            throw is.invalidParameterError("depth", "one of: char, uchar, short, ushort, int, uint, float, complex, double, dpcomplex", options.depth);
          }
        }
      }
      return this._updateFormatOut("raw");
    }
    function tile(options) {
      if (is.object(options)) {
        if (is.defined(options.size)) {
          if (is.integer(options.size) && is.inRange(options.size, 1, 8192)) {
            this.options.tileSize = options.size;
          } else {
            throw is.invalidParameterError("size", "integer between 1 and 8192", options.size);
          }
        }
        if (is.defined(options.overlap)) {
          if (is.integer(options.overlap) && is.inRange(options.overlap, 0, 8192)) {
            if (options.overlap > this.options.tileSize) {
              throw is.invalidParameterError("overlap", `<= size (${this.options.tileSize})`, options.overlap);
            }
            this.options.tileOverlap = options.overlap;
          } else {
            throw is.invalidParameterError("overlap", "integer between 0 and 8192", options.overlap);
          }
        }
        if (is.defined(options.container)) {
          if (is.string(options.container) && is.inArray(options.container, ["fs", "zip"])) {
            this.options.tileContainer = options.container;
          } else {
            throw is.invalidParameterError("container", "one of: fs, zip", options.container);
          }
        }
        if (is.defined(options.layout)) {
          if (is.string(options.layout) && is.inArray(options.layout, ["dz", "google", "iiif", "iiif3", "zoomify"])) {
            this.options.tileLayout = options.layout;
          } else {
            throw is.invalidParameterError("layout", "one of: dz, google, iiif, iiif3, zoomify", options.layout);
          }
        }
        if (is.defined(options.angle)) {
          if (is.integer(options.angle) && !(options.angle % 90)) {
            this.options.tileAngle = options.angle;
          } else {
            throw is.invalidParameterError("angle", "positive/negative multiple of 90", options.angle);
          }
        }
        this._setBackgroundColourOption("tileBackground", options.background);
        if (is.defined(options.depth)) {
          if (is.string(options.depth) && is.inArray(options.depth, ["onepixel", "onetile", "one"])) {
            this.options.tileDepth = options.depth;
          } else {
            throw is.invalidParameterError("depth", "one of: onepixel, onetile, one", options.depth);
          }
        }
        if (is.defined(options.skipBlanks)) {
          if (is.integer(options.skipBlanks) && is.inRange(options.skipBlanks, -1, 65535)) {
            this.options.tileSkipBlanks = options.skipBlanks;
          } else {
            throw is.invalidParameterError("skipBlanks", "integer between -1 and 255/65535", options.skipBlanks);
          }
        } else if (is.defined(options.layout) && options.layout === "google") {
          this.options.tileSkipBlanks = 5;
        }
        const centre = is.bool(options.center) ? options.center : options.centre;
        if (is.defined(centre)) {
          this._setBooleanOption("tileCentre", centre);
        }
        if (is.defined(options.id)) {
          if (is.string(options.id)) {
            this.options.tileId = options.id;
          } else {
            throw is.invalidParameterError("id", "string", options.id);
          }
        }
        if (is.defined(options.basename)) {
          if (is.string(options.basename)) {
            this.options.tileBasename = options.basename;
          } else {
            throw is.invalidParameterError("basename", "string", options.basename);
          }
        }
      }
      if (is.inArray(this.options.formatOut, ["jpeg", "png", "webp"])) {
        this.options.tileFormat = this.options.formatOut;
      } else if (this.options.formatOut !== "input") {
        throw is.invalidParameterError("format", "one of: jpeg, png, webp", this.options.formatOut);
      }
      return this._updateFormatOut("dz");
    }
    function timeout(options) {
      if (!is.plainObject(options)) {
        throw is.invalidParameterError("options", "object", options);
      }
      if (is.integer(options.seconds) && is.inRange(options.seconds, 0, 3600)) {
        this.options.timeoutSeconds = options.seconds;
      } else {
        throw is.invalidParameterError("seconds", "integer between 0 and 3600", options.seconds);
      }
      return this;
    }
    function _updateFormatOut(formatOut, options) {
      if (!(is.object(options) && options.force === false)) {
        this.options.formatOut = formatOut;
      }
      return this;
    }
    function _setBooleanOption(key, val) {
      if (is.bool(val)) {
        this.options[key] = val;
      } else {
        throw is.invalidParameterError(key, "boolean", val);
      }
    }
    function _read() {
      if (!this.options.streamOut) {
        this.options.streamOut = true;
        const stack = Error();
        this._pipeline(void 0, stack);
      }
    }
    function _pipeline(callback, stack) {
      if (typeof callback === "function") {
        if (this._isStreamInput()) {
          this.on("finish", () => {
            this._flattenBufferIn();
            sharp2.pipeline(this.options, (err, data, info) => {
              if (err) {
                callback(is.nativeError(err, stack));
              } else {
                callback(null, data, info);
              }
            });
          });
        } else {
          sharp2.pipeline(this.options, (err, data, info) => {
            if (err) {
              callback(is.nativeError(err, stack));
            } else {
              callback(null, data, info);
            }
          });
        }
        return this;
      } else if (this.options.streamOut) {
        if (this._isStreamInput()) {
          this.once("finish", () => {
            this._flattenBufferIn();
            sharp2.pipeline(this.options, (err, data, info) => {
              if (err) {
                this.emit("error", is.nativeError(err, stack));
              } else {
                this.emit("info", info);
                this.push(data);
              }
              this.push(null);
              this.on("end", () => this.emit("close"));
            });
          });
          if (this.streamInFinished) {
            this.emit("finish");
          }
        } else {
          sharp2.pipeline(this.options, (err, data, info) => {
            if (err) {
              this.emit("error", is.nativeError(err, stack));
            } else {
              this.emit("info", info);
              this.push(data);
            }
            this.push(null);
            this.on("end", () => this.emit("close"));
          });
        }
        return this;
      } else {
        if (this._isStreamInput()) {
          return new Promise((resolve, reject) => {
            this.once("finish", () => {
              this._flattenBufferIn();
              sharp2.pipeline(this.options, (err, data, info) => {
                if (err) {
                  reject(is.nativeError(err, stack));
                } else {
                  if (this.options.resolveWithObject) {
                    resolve({ data, info });
                  } else {
                    resolve(data);
                  }
                }
              });
            });
          });
        } else {
          return new Promise((resolve, reject) => {
            sharp2.pipeline(this.options, (err, data, info) => {
              if (err) {
                reject(is.nativeError(err, stack));
              } else {
                if (this.options.resolveWithObject) {
                  resolve({ data, info });
                } else {
                  resolve(data);
                }
              }
            });
          });
        }
      }
    }
    module2.exports = (Sharp) => {
      Object.assign(Sharp.prototype, {
        // Public
        toFile,
        toBuffer,
        keepExif,
        withExif,
        withExifMerge,
        keepIccProfile,
        withIccProfile,
        keepXmp,
        withXmp,
        keepMetadata,
        withMetadata,
        toFormat,
        jpeg,
        jp2,
        png,
        webp,
        tiff,
        avif,
        heif,
        jxl,
        gif,
        raw,
        tile,
        timeout,
        // Private
        _updateFormatOut,
        _setBooleanOption,
        _read,
        _pipeline
      });
    };
  }
});

// ../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/utility.js
var require_utility = __commonJS({
  "../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/utility.js"(exports2, module2) {
    var events = require("node:events");
    var detectLibc = require_detect_libc();
    var is = require_is();
    var { runtimePlatformArch } = require_libvips();
    var sharp2 = require_sharp();
    var runtimePlatform = runtimePlatformArch();
    var libvipsVersion = sharp2.libvipsVersion();
    var format = sharp2.format();
    format.heif.output.alias = ["avif", "heic"];
    format.jpeg.output.alias = ["jpe", "jpg"];
    format.tiff.output.alias = ["tif"];
    format.jp2k.output.alias = ["j2c", "j2k", "jp2", "jpx"];
    var interpolators = {
      /** [Nearest neighbour interpolation](http://en.wikipedia.org/wiki/Nearest-neighbor_interpolation). Suitable for image enlargement only. */
      nearest: "nearest",
      /** [Bilinear interpolation](http://en.wikipedia.org/wiki/Bilinear_interpolation). Faster than bicubic but with less smooth results. */
      bilinear: "bilinear",
      /** [Bicubic interpolation](http://en.wikipedia.org/wiki/Bicubic_interpolation) (the default). */
      bicubic: "bicubic",
      /** [LBB interpolation](https://github.com/libvips/libvips/blob/master/libvips/resample/lbb.cpp#L100). Prevents some "[acutance](http://en.wikipedia.org/wiki/Acutance)" but typically reduces performance by a factor of 2. */
      locallyBoundedBicubic: "lbb",
      /** [Nohalo interpolation](http://eprints.soton.ac.uk/268086/). Prevents acutance but typically reduces performance by a factor of 3. */
      nohalo: "nohalo",
      /** [VSQBS interpolation](https://github.com/libvips/libvips/blob/master/libvips/resample/vsqbs.cpp#L48). Prevents "staircasing" when enlarging. */
      vertexSplitQuadraticBasisSpline: "vsqbs"
    };
    var versions = {
      vips: libvipsVersion.semver
    };
    if (!libvipsVersion.isGlobal) {
      if (!libvipsVersion.isWasm) {
        try {
          versions = require(`@img/sharp-${runtimePlatform}/versions`);
        } catch (_) {
          try {
            versions = require(`@img/sharp-libvips-${runtimePlatform}/versions`);
          } catch (_2) {
          }
        }
      } else {
        try {
          versions = require("@img/sharp-wasm32/versions");
        } catch (_) {
        }
      }
    }
    versions.sharp = require_package().version;
    if (versions.heif && format.heif) {
      format.heif.input.fileSuffix = [".avif"];
      format.heif.output.alias = ["avif"];
    }
    function cache(options) {
      if (is.bool(options)) {
        if (options) {
          return sharp2.cache(50, 20, 100);
        } else {
          return sharp2.cache(0, 0, 0);
        }
      } else if (is.object(options)) {
        return sharp2.cache(options.memory, options.files, options.items);
      } else {
        return sharp2.cache();
      }
    }
    cache(true);
    function concurrency(concurrency2) {
      return sharp2.concurrency(is.integer(concurrency2) ? concurrency2 : null);
    }
    if (detectLibc.familySync() === detectLibc.GLIBC && !sharp2._isUsingJemalloc()) {
      sharp2.concurrency(1);
    } else if (detectLibc.familySync() === detectLibc.MUSL && sharp2.concurrency() === 1024) {
      sharp2.concurrency(require("node:os").availableParallelism());
    }
    var queue = new events.EventEmitter();
    function counters() {
      return sharp2.counters();
    }
    function simd(simd2) {
      return sharp2.simd(is.bool(simd2) ? simd2 : null);
    }
    function block(options) {
      if (is.object(options)) {
        if (Array.isArray(options.operation) && options.operation.every(is.string)) {
          sharp2.block(options.operation, true);
        } else {
          throw is.invalidParameterError("operation", "Array<string>", options.operation);
        }
      } else {
        throw is.invalidParameterError("options", "object", options);
      }
    }
    function unblock(options) {
      if (is.object(options)) {
        if (Array.isArray(options.operation) && options.operation.every(is.string)) {
          sharp2.block(options.operation, false);
        } else {
          throw is.invalidParameterError("operation", "Array<string>", options.operation);
        }
      } else {
        throw is.invalidParameterError("options", "object", options);
      }
    }
    module2.exports = (Sharp) => {
      Sharp.cache = cache;
      Sharp.concurrency = concurrency;
      Sharp.counters = counters;
      Sharp.simd = simd;
      Sharp.format = format;
      Sharp.interpolators = interpolators;
      Sharp.versions = versions;
      Sharp.queue = queue;
      Sharp.block = block;
      Sharp.unblock = unblock;
    };
  }
});

// ../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js
var require_lib3 = __commonJS({
  "../../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js"(exports2, module2) {
    var Sharp = require_constructor();
    require_input()(Sharp);
    require_resize()(Sharp);
    require_composite()(Sharp);
    require_operation()(Sharp);
    require_colour2()(Sharp);
    require_channel()(Sharp);
    require_output()(Sharp);
    require_utility()(Sharp);
    module2.exports = Sharp;
  }
});

// src/node.ts
var node_exports = {};
__export(node_exports, {
  AL: () => AssetLoader2,
  API_CONFIG: () => API_CONFIG,
  API_ENDPOINTS: () => API_ENDPOINTS,
  ASSET_ENV_CONFIG: () => ASSET_ENV_CONFIG,
  ASSET_PATHS: () => ASSET_PATHS,
  ASSET_VALIDATION: () => ASSET_VALIDATION,
  ArtManager: () => ArtManager,
  AssetLoader: () => AssetLoader,
  AssetRegistry: () => AssetRegistry,
  BASE_ASSET_PATH: () => BASE_ASSET_PATH,
  BaseImageAnalyzer: () => BaseImageAnalyzer,
  BaseProgressTracker: () => BaseProgressTracker,
  BitReader: () => BitReader,
  BrowserImageAnalyzer: () => BrowserImageAnalyzer,
  BrowserTaskAdapter: () => BrowserTaskAdapter,
  CACHE_CONFIG: () => CACHE_CONFIG,
  CodeTable: () => CodeTable,
  CutEngine: () => CutEngine,
  ENVIRONMENT: () => ENVIRONMENT,
  EnhancedRetryHandler: () => EnhancedRetryHandler,
  FrameProcessor: () => FrameProcessor,
  GIFExtension: () => GIFExtension,
  GIFProcessor: () => GIFProcessor,
  GIFProgressTracker: () => GIFProgressTracker,
  GIFTools: () => GIFTools,
  GifAnalyzer: () => GifAnalyzer,
  GifExtension: () => GifExtension,
  GifFrame: () => GifFrame,
  GifImage: () => GifImage,
  GifLoader: () => GifLoader,
  Giffyness: () => Giffyness,
  ImageAnalyzer: () => ImageAnalyzer,
  ImageManager: () => ImageManager,
  LOADER_CONFIG: () => LOADER_CONFIG,
  NamedClipPlanner: () => NamedClipPlanner,
  NodeImageAnalyzer: () => NodeImageAnalyzer,
  NodeWorkerThreadsAdapter: () => NodeWorkerThreadsAdapter,
  PIXEL_ART_SETTINGS: () => PIXEL_ART_SETTINGS,
  PixelArtHandler: () => PixelArtHandler,
  PixelGifScaler: () => PixelGifScaler,
  PixelMatrixExporter: () => PixelMatrixExporter,
  PixelMatrixFileEmitter: () => PixelMatrixFileEmitter,
  PreprocessPipeline: () => PreprocessPipeline,
  ProcessingService: () => ProcessingService,
  ProgressManager: () => ProgressManager,
  QualityAnalyzer: () => QualityAnalyzer,
  QualityAnalyzerService: () => QualityAnalyzerService,
  QualityManager: () => QualityManager,
  RetryHandler: () => RetryHandler,
  RuntimeTaskRegistry: () => RuntimeTaskRegistry,
  SCANFORGE_PREPROCESS_TASKS: () => SCANFORGE_PREPROCESS_TASKS,
  SUPPORTED_FORMATS: () => SUPPORTED_FORMATS,
  ServerImageAnalyzer: () => ServerImageAnalyzer,
  SpriteAtlasExporter: () => SpriteAtlasExporter,
  TimelineBuilder: () => TimelineBuilder,
  VeraShellExporter: () => VeraShellExporter,
  VideoFrameExtractor: () => VideoFrameExtractor,
  WorkerManager: () => WorkerManager,
  WorkerPool: () => WorkerPool,
  alignImage: () => alignImage,
  alignImageSet: () => alignImageSet,
  autoCompressGIF: () => autoCompressGIF,
  backgroundImages: () => backgroundImages,
  buildAssetPath: () => buildAssetPath,
  compressGIFWithSettings: () => compressGIFWithSettings,
  createFlatBackgroundSpritePreprocess: () => createFlatBackgroundSpritePreprocess,
  createOverlay: () => createOverlay,
  downloadBlob: () => downloadBlob,
  executeTaskRequest: () => executeTaskRequest,
  fetchWithRetry: () => fetchWithRetry,
  fileDataToImage: () => fileDataToImage,
  generatePreview: () => generatePreview,
  getAssetRegistry: () => getAssetRegistry,
  getCurrentGIFFrame: () => getCurrentGIFFrame,
  getGifProcessor: () => getGifProcessor,
  getTimestamp: () => getTimestamp,
  handleGIFUpdates: () => handleGIFUpdates,
  imageManager: () => imageManager,
  overlayArray: () => overlayArray,
  overlayImages: () => overlayImages,
  pixelArtHandler: () => pixelArtHandler,
  qualityAnalyzerService: () => qualityAnalyzerService,
  read: () => read,
  registerScanForgePreprocessTasks: () => registerScanForgePreprocessTasks,
  renderGIFWithOverlays: () => renderGIFWithOverlays,
  runtime: () => runtime,
  scalePixelFrames: () => scalePixelFrames,
  selectFileAndCompress: () => selectFileAndCompress,
  setupLiveOverlayRendering: () => setupLiveOverlayRendering,
  splitMatrix: () => splitMatrix,
  toggleOverlay: () => toggleOverlay,
  useAssetSystem: () => useAssetSystem,
  useAssets: () => useAssets,
  useGIFProcessing: () => useGIFProcessing,
  useGifDecoder: () => useGifDecoder
});
module.exports = __toCommonJS(node_exports);

// src/utils/env.ts
function getImportMetaEnv() {
  if (typeof globalThis === "undefined") return void 0;
  const meta = globalThis.importMeta;
  if (meta?.env) return meta;
  return globalThis.import_meta;
}
var metaEnv = getImportMetaEnv()?.env ?? {};
function getEnvString(key, fallback = "") {
  const value = metaEnv[key];
  if (typeof value === "string") return value;
  if (typeof process !== "undefined") {
    const nodeValue = process?.env?.[key];
    if (typeof nodeValue === "string") return nodeValue;
  }
  return fallback;
}
function getEnvMode() {
  const mode = getEnvString("MODE", "");
  if (mode) return mode;
  const nodeEnv = typeof process !== "undefined" ? process.env?.NODE_ENV : "";
  return typeof nodeEnv === "string" ? nodeEnv : "";
}
function isDevMode() {
  const meta = getImportMetaEnv();
  if (typeof meta?.env?.DEV === "boolean") return meta.env.DEV;
  if (typeof meta?.DEV === "boolean") return meta.DEV;
  return getEnvMode() === "development";
}

// src/assets/config/asset.config.ts
var ENVIRONMENT = getEnvMode() || "development";
var isDev = isDevMode();
var API_CONFIG = {
  baseUrl: isDev ? "http://localhost:3000/api" : "/api",
  endpoints: {
    backgrounds: "/assets/backgrounds",
    overlays: "/assets/overlays",
    metadata: "/assets/metadata",
    validate: "/assets/validate",
    categories: "/assets/categories"
  },
  headers: {
    "Content-Type": "application/json",
    "X-Asset-Version": "1.0"
  }
};
var ASSET_ENV_CONFIG = {
  development: {
    apiUrl: "",
    // Empty string will use relative URLs in development
    assetUrl: "/_assets",
    cacheDuration: 3e5
  },
  staging: {
    apiUrl: getEnvString("NEXT_PUBLIC_API_URL", "http://localhost:3000"),
    assetUrl: getEnvString("NEXT_PUBLIC_ASSET_URL", "http://localhost:3000/_assets"),
    cacheDuration: 18e5
  },
  production: {
    apiUrl: getEnvString("NEXT_PUBLIC_API_URL", "https://api.sigilnet.com"),
    assetUrl: getEnvString("NEXT_PUBLIC_ASSET_URL", "https://cdn.sigilnet.com/assets"),
    cacheDuration: 36e5
  }
};
var BASE_ASSET_PATH = isDev ? "/assets" : "/api/_assets";
var ASSET_PATHS = {
  backgrounds: {
    animated: `${BASE_ASSET_PATH}/backgrounds/animated`,
    static: `${BASE_ASSET_PATH}/backgrounds/static`,
    pixel: `${BASE_ASSET_PATH}/backgrounds/pixel`
  },
  special: `${BASE_ASSET_PATH}/overlays/special`,
  overlays: {
    head: `${BASE_ASSET_PATH}/overlays/head`,
    clothes: `${BASE_ASSET_PATH}/overlays/clothes`,
    special: `${BASE_ASSET_PATH}/overlays/special`,
    frames: `${BASE_ASSET_PATH}/overlays/frames`,
    traits: `${BASE_ASSET_PATH}/overlays/traits`,
    accessories: `${BASE_ASSET_PATH}/overlays/accessories`
  }
};
var CACHE_CONFIG = {
  defaultDuration: 3600,
  overlayDuration: 1800,
  gifDuration: 7200,
  imageDuration: 3600
  // Add this line
};
var ASSET_VALIDATION = {
  images: {
    maxSize: 50 * 1024 * 1024,
    // 50MB
    allowedFormats: ["png", "jpg", "webp"],
    requiredDimensions: {
      width: 2800,
      height: 2800,
      aspectRatio: 1
    },
    allowCompression: true,
    isValid: true,
    message: "Image validation implemented"
  },
  models: {
    isValid: false,
    message: "Model validation not implemented",
    maxSize: 100 * 1024 * 1024,
    // 20MB
    allowedFormats: ["glb", "gltf"],
    allowCompression: false
  },
  animations: {
    isValid: true,
    message: "Animation validation implemented",
    maxSize: 50 * 1024 * 1024,
    // 10MB
    allowedFormats: ["gif"],
    allowCompression: true
  },
  textures: {
    isValid: false,
    message: "Texture validation not implemented",
    maxSize: 2 * 1024 * 1024,
    // 2MB
    allowedFormats: ["png", "jpg"],
    allowCompression: true
  }
};
var LOADER_CONFIG = {
  defaultTimeout: 3e4,
  maxRetries: 3,
  retryDelay: 1e3,
  defaultPriority: "medium",
  chunkSize: 1024 * 1024,
  // 1MB
  maxConcurrentLoads: 5,
  cacheDuration: CACHE_CONFIG.defaultDuration
};
var API_ENDPOINTS = {
  getAsset: (id) => `${API_CONFIG.baseUrl}/assets/${id}`,
  getMetadata: (id) => `${API_CONFIG.baseUrl}/assets/metadata/${id}`,
  validateAsset: (id) => `${API_CONFIG.baseUrl}/assets/validate/${id}`,
  getBackgrounds: (category) => `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.backgrounds}${category ? `?category=${category}` : ""}`,
  getOverlays: (category) => `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.overlays}${category ? `?category=${category}` : ""}`
};
var SUPPORTED_FORMATS = {
  images: [".png", ".jpg", ".jpeg", ".webp"],
  models: [".glb", ".gltf"],
  animations: [".fbx", ".bvh"],
  textures: [".png", ".jpg", ".jpeg"]
};

// src/assets/config/assetConfig.ts
var AssetLoader = class {
  cache = /* @__PURE__ */ new Map();
  async load(path, metadata) {
    const cacheKey = `${path}-${metadata.version}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    const asset = await fetch(`${BASE_ASSET_PATH}/${path}`);
    const buffer = Buffer.from(await asset.arrayBuffer());
    this.cache.set(cacheKey, buffer);
    return buffer;
  }
};
var runtime = "edge";

// src/assets/config/assetSource.ts
var backgroundImages = [
  {
    name: "Fire Background",
    url: "./@/assets/backgrounds/bg.gif",
    value: "Firey ApeFathers",
    category: "Animated",
    tags: ["fire", "action"]
  },
  {
    name: "Fire2 Background",
    url: "./@/assets/backgrounds/bg3.gif",
    value: "Firey ApeFathers 2",
    category: "Animated",
    tags: ["fire", "action"]
  },
  // {
  //   name: 'Space Background',
  //   url: './@/assets/backgrounds/space_bg.gif',
  //   value: 'Space',
  //   category: 'Animated',
  //   tags: ['stars', 'galaxy']
  // },
  {
    name: "Snowy Background",
    url: "./@/assets/backgrounds/snowy_bg.jpg",
    value: "Snow",
    category: "Static",
    tags: ["winter", "peaceful"]
  },
  {
    name: "Garage Background",
    url: "./@/assets/backgrounds/garage.png",
    value: "Garage",
    category: "Static",
    tags: ["home", "workshop"]
  },
  {
    name: "Backyard Background",
    url: "./@/assets/backgrounds/backyardpxl.gif",
    value: "Backyard",
    category: "Pixel Art",
    tags: ["outdoor", "nature"]
  },
  {
    name: "Path Background",
    url: "./@/assets/backgrounds/pixel_kawai_bg.gif",
    value: "Path",
    category: "Pixel Art",
    tags: ["trail", "kawaii"]
  },
  {
    name: "Winter Background",
    url: "./@/assets/backgrounds/winter_bg.gif",
    value: "Winter",
    category: "Animated",
    tags: ["snow", "cold"]
  }
];
var overlayImages = [
  {
    name: "Santa Hat",
    url: "./@/assets/overlay/traits/head/SantaHat.png",
    value: "Santa Hat",
    attribute: "Head",
    category: "Accessories",
    disAllowedTraits: { Head: ["Beer Hat", "Bed Head", "Bucket Hat", "Hardhat"] },
    dims: { x: 0, y: 0, width: 2800, height: 2800 },
    tags: ["holiday", "christmas"]
  },
  {
    name: "Xmas Sweater",
    url: "./@/assets/overlay/traits/clothes/XMas_Sweater.png",
    value: "Xmas Sweater",
    attribute: "Clothes",
    category: "Clothes",
    disAllowedTraits: { Mouth: ["Messy Beard"], Clothes: ["Puffer", "DadBod"] },
    dims: { x: 0, y: 0, width: 2800, height: 2800 },
    tags: ["holiday", "christmas"]
  },
  {
    name: "Holiday Sweater",
    url: "./@/assets/overlay/traits/clothes/Holiday_Sweater.png",
    value: "Holiday Sweater",
    attribute: "Clothes",
    category: "Clothes",
    disAllowedTraits: { Clothes: ["Puffer", "DadBod"] },
    dims: { x: 0, y: 0, width: 2800, height: 2800 },
    tags: ["holiday", "christmas"]
  },
  {
    name: "#1 Dad Hoodie",
    url: "./@/assets/overlay/traits/clothes/DadHoodie.png",
    value: "#1 Dad Hoodie",
    attribute: "Clothes",
    category: "Clothes",
    disAllowedTraits: { Clothes: ["Puffer", "DadBod"] },
    dims: { x: 0, y: 0, width: 2800, height: 2800 },
    tags: ["dad", "father", "hoodie"]
  }
];
var createOverlay = (props) => ({
  name: props.name,
  attribute: props.attribute,
  url: props.url,
  value: props.value,
  category: props.category,
  disAllowedTraits: props.disAllowedTraits,
  dims: props.dims,
  tags: props.tags
});
var createOverlayOG = (name, attribute, url, traits, value, disAllowedTraits, category) => ({
  name,
  attribute,
  url,
  value,
  category,
  disAllowedTraits,
  dims: {
    x: 0,
    y: 0,
    width: 2800,
    height: 2800
  }
});
var overlayArray = [
  createOverlayOG("Santa Hat", "Head", "/assets/traits/head/SantaHat.png", { Head: ["Santa Hat"] }, "Santa Hat", { Head: ["Beer Hat", "Santa Hat", "Bucket Hat", "Hardhat"] }),
  createOverlayOG("Xmas Sweater", "Clothes", "/assets/traits/clothes/Xmas_Sweater.png", { Clothes: ["Xmas Sweater"] }, "Xmas Sweater", { clothes: ["Puffer", "DadBod"], extra: ["Baby Carlos"] }),
  createOverlayOG("Holiday Sweater", "Clothes", "/assets/traits/clothes/Holiday_Sweater.png", { Clothes: ["Holiday Sweater"] }, "Holiday Sweater", { Clothes: ["Puffer", "DadBod"], extra: ["Baby Carlos"] }),
  createOverlayOG("#1 Dad Hoodie", "Clothes", "/assets/traits/clothes/DadHoodie.png", { Clothes: ["#1 Dad Hoodie"] }, "#1 Dad Hoodie", { Clothes: ["Puffer", "DadBod"], extra: ["Baby Carlos"] })
  //createOverlayOG('#1 Dad Hoodie', 'Clothes', '/assets/traits/clothes/DadHoodie.png',{ Clothes: ['#1 Dad Hoodie']} , '' , { clothes: ['Puffer', 'DadBod'], extra: ['Baby Carlos'] }),
];

// src/assets/hooks/useAssets.ts
var import_react = __toESM(require_react());

// src/assets/services/AssetRegistry.ts
function getTimestamp(date) {
  if (!date) return Date.now();
  return typeof date === "string" ? new Date(date).getTime() : date.getTime();
}
function buildAssetPath(assetType, category, fileName) {
  return `${BASE_ASSET_PATH}/${assetType}/${category}/${fileName}`;
}
var AssetRegistry = class _AssetRegistry {
  static instance;
  backgroundCache;
  overlayCache;
  environment;
  fetchPromises;
  initializedFromRegistry = false;
  constructor(backgroundCache, overlayCache) {
    this.backgroundCache = new Map(Object.entries(backgroundCache || {}));
    this.overlayCache = new Map(Object.entries(overlayCache || {}));
    this.environment = ENVIRONMENT;
    this.fetchPromises = /* @__PURE__ */ new Map();
    this.fetchUpdates();
    this.initializeFromRegistry();
  }
  initializeFromRegistry() {
    if (this.initializedFromRegistry) return;
    Object.values(this.backgroundCache).forEach((bg) => {
      const id = this.getAssetId(bg);
      this.backgroundCache.set(id, { ...bg, source: "registry" });
    });
    Object.values(this.overlayCache).forEach((overlay) => {
      const id = this.getAssetId(overlay);
      this.overlayCache.set(id, { ...overlay, source: "registry" });
    });
    this.initializedFromRegistry = true;
    console.log("\u{1F4E6} Initialized from registry:", {
      backgrounds: this.backgroundCache.size,
      overlays: this.overlayCache.size
    });
  }
  async getAssets() {
    return {
      backgrounds: Array.from(this.backgroundCache.values()),
      overlays: Array.from(this.overlayCache.values())
    };
  }
  getAssetId(asset) {
    const mainURL = globalThis?.importMeta?.env?.DEV ? "http://localhost:3000" : "https://apefathers.com";
    const baseName = asset.id || `${asset.type}-${asset.name.toLowerCase().replace(/\s+/g, "-")}`;
    const urlPath = new URL(asset.url, mainURL).pathname;
    return `${baseName}-${urlPath}`;
  }
  async fetchUpdates() {
    if (this.backgroundCache.size > 0 && this.overlayCache.size > 0) {
      console.log("\u{1F680} Cache already populated, skipping fetch.");
      return;
    }
    console.log("\u{1F504} Fetching new asset updates...");
    const [backgrounds, overlays] = await Promise.all([
      this.fetchBackgrounds(),
      this.fetchOverlays()
    ]);
    backgrounds.forEach(
      (bg) => this.backgroundCache.set(this.getAssetId(bg), bg)
    );
    overlays.forEach(
      (overlay) => this.overlayCache.set(this.getAssetId(overlay), overlay)
    );
  }
  async fetchBackgrounds() {
    try {
      console.log("\u{1F4CA} Environment:", this.environment);
      console.log("\u{1F4BE} Cache size:", this.backgroundCache.size);
      const url = API_ENDPOINTS.getBackgrounds();
      console.log("\u{1F50D} Fetching backgrounds from:", url);
      const response = await this.fetchWithCache(
        url,
        () => this.fetchWithTimeout(url, {
          headers: {
            ...API_CONFIG.headers,
            "X-Asset-Environment": this.environment
          }
        })
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const backgrounds = await response.json();
      const uniqueBackgrounds = backgrounds.filter((bg) => {
        const id = this.getAssetId(bg);
        return !this.backgroundCache.has(id) || bg.lastModified > (this.backgroundCache.get(id)?.lastModified || 0);
      });
      console.log("\u2705 Unique backgrounds:", uniqueBackgrounds.length);
      return uniqueBackgrounds;
    } catch (error) {
      console.warn("\u26A0\uFE0F Background update failed:", error);
      return [];
    }
  }
  async fetchOverlays() {
    try {
      console.log("\u{1F4CA} Environment:", this.environment);
      console.log("\u{1F4BE} Cache size:", this.overlayCache.size);
      const url = API_ENDPOINTS.getOverlays();
      console.log("\u{1F50D} Fetching overlays from:", url);
      const response = await this.fetchWithCache(
        url,
        () => this.fetchWithTimeout(url, {
          headers: {
            ...API_CONFIG.headers,
            "X-Asset-Environment": this.environment
          }
        })
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const overlays = await response.json();
      console.log("\u2705 Fetched overlays:", overlays.length);
      const uniqueOverlays = overlays.filter((overlay) => {
        const existingOverlay = Array.from(this.overlayCache.values()).find(
          (cached) => cached.url === overlay.url
        );
        return !existingOverlay;
      });
      console.log("\u2705 Unique overlays:", uniqueOverlays.length);
      return uniqueOverlays;
    } catch (error) {
      console.warn("\u26A0\uFE0F Overlay update failed:", error);
      return [];
    }
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new _AssetRegistry();
    }
    return this.instance;
  }
  async getAllBackgrounds() {
    const uniqueMap = /* @__PURE__ */ new Map();
    Array.from(this.backgroundCache.values()).forEach((bg) => {
      const key = this.getAssetId(bg);
      if (!uniqueMap.has(key) || bg.source === "api") {
        uniqueMap.set(key, bg);
      }
    });
    return Array.from(uniqueMap.values()).sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  }
  async getAllOverlays() {
    const uniqueMap = /* @__PURE__ */ new Map();
    Array.from(this.overlayCache.values()).forEach((overlay) => {
      const key = this.getAssetId(overlay);
      if (!uniqueMap.has(key) || overlay.source === "api") {
        uniqueMap.set(key, overlay);
      }
    });
    return Array.from(uniqueMap.values()).sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  }
  async fetchWithCache(key, fetchFn) {
    if (this.fetchPromises.has(key)) {
      console.log(`\u23F3 Returning in-flight request for ${key}`);
      return this.fetchPromises.get(key);
    }
    const promise = fetchFn().finally(() => this.fetchPromises.delete(key));
    this.fetchPromises.set(key, promise);
    return promise;
  }
  async fetchAssetMetadata(id) {
    try {
      const response = await this.fetchWithCache(
        id,
        () => fetch(API_ENDPOINTS.getMetadata(id), {
          headers: {
            ...API_CONFIG.headers,
            "X-Asset-Environment": this.environment
          }
        })
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch asset metadata: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching asset metadata:", error);
      throw error;
    }
  }
  async fetchWithTimeout(url, options, timeout = 3e4) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log(`\u231B Request timeout for ${url}`);
      controller.abort();
    }, timeout);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
          "Cache-Control": "no-cache",
          Pragma: "no-cache"
        }
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.warn(`\u26A0\uFE0F Request aborted for ${url} after ${timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
  async getCached(name) {
    const cached = this.backgroundCache.get(name);
    if (cached) return cached;
    try {
      const asset = await this.fetchAssetMetadata(name);
      if (this.isAvatar(asset)) {
        this.backgroundCache.set(name, asset);
        return asset;
      }
    } catch (error) {
      console.error(`Error fetching background ${name}:`, error);
    }
    return this.backgroundCache.get(name) || null;
  }
  async getBackgroundsByCategory(category) {
    const cachedBackgrounds = await this.getAllBackgrounds();
    if (cachedBackgrounds.length) {
      console.log(`\u2705 Using cached backgrounds for category: ${category}`);
      return cachedBackgrounds.filter((bg) => bg.bgCategory === category);
    }
    console.log(`\u{1F50D} Fetching backgrounds for category: ${category}`);
    return (await this.getAllBackgrounds()).filter(
      (bg) => bg.bgCategory === category
    );
  }
  async getOverlaysByCategory(category) {
    const cachedOverlays = await this.getAllOverlays();
    if (cachedOverlays.length) {
      console.log(`\u2705 Using cached backgrounds for category: ${category}`);
      return cachedOverlays.filter(
        (overlay) => overlay.overlayCategory === category
      );
    }
    console.log(`\u{1F50D} Fetching backgrounds for category: ${category}`);
    return (await this.getAllOverlays()).filter(
      (overlay) => overlay.overlayCategory === category
    );
  }
  isAvatar(asset) {
    return asset && asset.type === "avatar" && "bgCategory" in asset;
  }
  isOverlayAsset(asset) {
    return asset && asset.type === "overlay" && "overlayCategory" in asset;
  }
  clearCache() {
    this.backgroundCache.clear();
    this.overlayCache.clear();
  }
};
function getAssetRegistry() {
  return AssetRegistry.getInstance();
}

// src/assets/hooks/useAssets.ts
var assetRegistry = getAssetRegistry();
function useAssets() {
  const [loading, setLoading] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)(null);
  const [assets, setAssets] = (0, import_react.useState)({ backgrounds: [], overlays: [] });
  const cache = (0, import_react.useMemo)(() => /* @__PURE__ */ new Map(), []);
  (0, import_react.useEffect)(() => {
    return () => {
      cache.forEach((value) => {
        if (typeof value === "string") {
          URL.revokeObjectURL(value);
        }
      });
      cache.clear();
    };
  }, []);
  const loadAsset = (0, import_react.useCallback)(async (url) => {
    if (cache.has(url)) {
      return cache.get(url);
    }
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    cache.set(url, objectUrl);
    return objectUrl;
  }, [cache]);
  (0, import_react.useEffect)(() => {
    const fetchAssets = async () => {
      try {
        const { backgrounds, overlays } = await assetRegistry.getAssets();
        setAssets({
          backgrounds,
          overlays
        });
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);
  return {
    ...assets,
    loading,
    error,
    reload: () => assetRegistry.clearCache()
  };
}

// src/assets/hooks/useAssetSystem.ts
var import_react2 = __toESM(require_react());

// src/assets/services/AssetLoader.ts
var AssetLoader2 = class _AssetLoader {
  static cache;
  static environment;
  static loadingQueue;
  constructor(environment = ENVIRONMENT) {
    _AssetLoader.cache = /* @__PURE__ */ new Map();
    _AssetLoader.environment = environment;
    _AssetLoader.loadingQueue = /* @__PURE__ */ new Set();
  }
  static createAssetError(message, assetId, code) {
    return {
      name: "AssetError",
      message,
      code,
      context: {
        assetId,
        environment: _AssetLoader.environment,
        attempt: 0,
        timestamp: Date.now()
      }
    };
  }
  static async load(assetPath, metadata, options = {}) {
    const cacheKey = `${metadata.id}-${metadata.version}-${_AssetLoader.environment}`;
    const envConfig = ASSET_ENV_CONFIG[_AssetLoader.environment];
    if (options.cache !== false) {
      const cached = _AssetLoader.getCachedAsset(cacheKey, metadata);
      if (cached) return cached;
    }
    if (_AssetLoader.loadingQueue.has(cacheKey)) {
      throw _AssetLoader.createAssetError(
        "Asset is already being loaded",
        metadata.id,
        "ASSET_LOADING_DUPLICATE"
      );
    }
    _AssetLoader.loadingQueue.add(cacheKey);
    try {
      const url = assetPath || metadata.cdnUrl || metadata.url;
      const response = await _AssetLoader.fetchWithRetry(url, metadata, options);
      const buffer = Buffer.from(await response.arrayBuffer());
      _AssetLoader.cache.set(cacheKey, {
        data: buffer,
        metadata: {
          ...metadata,
          lastModified: Date.now()
        }
      });
      return buffer;
    } finally {
      _AssetLoader.loadingQueue.delete(cacheKey);
    }
  }
  static async fetchWithRetry(url, metadata, options) {
    const maxRetries = options.retries ?? LOADER_CONFIG.maxRetries;
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const response = await fetch(url, {
          headers: {
            "If-None-Match": metadata.etag,
            "If-Modified-Since": new Date(metadata.lastModified).toUTCString()
          },
          signal: AbortSignal.timeout(
            options.timeout || LOADER_CONFIG.defaultTimeout
          )
        });
        if (response.ok) return response;
        throw _AssetLoader.createAssetError(
          `Failed to load asset: ${response.statusText}`,
          metadata.id,
          `HTTP_${response.status}`
        );
      } catch (error) {
        attempt++;
        if (attempt === maxRetries) throw error;
        await new Promise(
          (resolve) => setTimeout(resolve, LOADER_CONFIG.retryDelay)
        );
      }
    }
    throw _AssetLoader.createAssetError(
      "Max retries exceeded",
      metadata.id,
      "MAX_RETRIES_EXCEEDED"
    );
  }
  static getCachedAsset(key, metadata) {
    const cached = _AssetLoader.cache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.metadata.lastModified > LOADER_CONFIG.cacheDuration) {
      _AssetLoader.cache.delete(key);
      return null;
    }
    return cached.data;
  }
  static clearCache() {
    _AssetLoader.cache.clear();
  }
};

// src/assets/hooks/useAssetSystem.ts
var useAssetSystem = ({ category, tag, type = "All", assetName }) => {
  const [backgrounds, setBackgrounds] = (0, import_react2.useState)([]);
  const [overlays, setOverlays] = (0, import_react2.useState)([]);
  const [loading, setLoading] = (0, import_react2.useState)(true);
  const [error, setError] = (0, import_react2.useState)(null);
  const [currentAsset, setCurrentAsset] = (0, import_react2.useState)(null);
  const assetRegistry2 = getAssetRegistry();
  const filteredAssets = (0, import_react2.useMemo)(() => {
    let filteredBgs = backgrounds;
    let filteredOverlays = overlays;
    if (category && category !== "All") {
      filteredBgs = filteredBgs.filter((bg) => bg.category === category);
      filteredOverlays = filteredOverlays.filter((overlay) => overlay.category === category);
    }
    if (tag) {
      filteredBgs = filteredBgs.filter((bg) => bg.tags?.includes(tag));
      filteredOverlays = filteredOverlays.filter((overlay) => overlay.tags?.includes(tag));
    }
    return {
      backgrounds: filteredBgs,
      overlays: filteredOverlays
    };
  }, [backgrounds, overlays, category, tag]);
  (0, import_react2.useEffect)(() => {
    const loadAssets = async () => {
      try {
        if (type === "All") {
          setBackgrounds(await assetRegistry2.getAllBackgrounds());
          setOverlays(await assetRegistry2.getAllOverlays());
        } else if (type === "background" || type === "backgrounds") {
          setBackgrounds(await assetRegistry2.getAllBackgrounds());
        } else if (type === "overlay" || type === "overlays") {
          setOverlays(await assetRegistry2.getAllOverlays());
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadAssets();
  }, [type]);
  (0, import_react2.useEffect)(() => {
    if (!assetName) return;
    const loadSpecificAsset = async () => {
      try {
        setLoading(true);
        const asset = await assetRegistry2.getCached(assetName);
        if (!asset) throw new Error(`Asset ${assetName} not found`);
        const assetData = await AssetLoader2.load(
          asset.url,
          asset,
          { cache: true }
        );
        setCurrentAsset(assetData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadSpecificAsset();
  }, [assetName, type]);
  return {
    assets: filteredAssets,
    currentAsset,
    loading,
    error,
    registry: assetRegistry2,
    loader: new AssetLoader2()
  };
};

// src/analyzers/GifAnalyzer.ts
var import_gifuct_js = __toESM(require_lib2());

// src/constants/gif.constants.ts
var CONSTANTS = {
  MAX_CANVAS_SIZE: 2800,
  WORKING_SIZE: 800,
  NFT_SIZE: 2800,
  POOL_SIZE: 15,
  CANVAS_PER_SIZE: 5,
  MEMORY_LIMIT: 800 * 1024 * 1024,
  QUALITY: 1,
  BATCH_SIZE: 5,
  MEMORY_THRESHOLD: 0.8,
  SCALE_DOWN_FACTOR: 0.5,
  MAX_WORKERS: Math.ceil(navigator.hardwareConcurrency || 6),
  TARGET_SIZE: 800,
  MIN_SIZE: 400,
  DITHER: false,
  DELAY: 100,
  WORKER_PATH: "/gif.worker.js",
  MAX_FRAME_SIZE: 4096,
  MAX_FRAME_COUNT: 300
};
var QUALITY_PRESETS = {
  LOW: {
    quality: 10,
    dither: false,
    frameSkip: 2,
    colors: 128,
    preserveAlpha: true,
    alphaThreshold: 128,
    smoothing: true,
    blendMode: "source-over",
    colorEnhancement: {
      red: 0.8,
      green: 0.8,
      blue: 0.8
    }
  },
  MEDIUM: {
    quality: 5,
    dither: "FloydSteinberg",
    frameSkip: 1,
    colors: 256,
    preserveAlpha: true,
    alphaThreshold: 128,
    smoothing: true,
    blendMode: "source-over",
    colorEnhancement: {
      red: 1.1,
      green: 1.1,
      blue: 1.1
    }
  },
  HIGH: {
    quality: 1,
    //dither: false,
    frameSkip: 0,
    colors: 256,
    preserveAlpha: true,
    alphaThreshold: 220
    // Increased from 220 for better transparency handling
    //smoothing: true,
    //blendMode: 'source-over',
    //disposalMethod: 2, // Clear frame before drawing next
    // colorQuantization: {
    //   method: 'neuquant',
    //   colors: 256
    // },
    // transparencyMode: 'preserve',
    // frameCompositing: 'blend'
  },
  FIRE: {
    quality: 1,
    dither: false,
    frameSkip: 0,
    colors: 256,
    preserveAlpha: true,
    alphaThreshold: 220,
    smoothing: true,
    blendMode: "screen",
    colorEnhancement: {
      red: 1.2,
      green: 0.9,
      blue: 0.8,
      alpha: 1.2
    }
  },
  PIXEL: {
    quality: 1,
    dither: false,
    // No dithering to preserve clean pixel edges
    frameSkip: 0,
    // Process all frames
    colors: 256,
    // Preserve original colors
    preserveAlpha: true,
    // Maintain transparency
    alphaThreshold: 128,
    // Minimum alpha value for transparency
    smoothing: false,
    // Disable anti-aliasing
    blendMode: "copy",
    // Directly copy frames without blending
    disposalMethod: 1,
    // Clear to background between frames
    synchronizeFrames: true,
    // Synchronize frame timings
    pixelSnapping: true,
    // Align pixels to the grid
    colorQuantization: {
      method: "octree",
      // Use octree for better color accuracy
      colors: 256
    }
  },
  HIGHRES: {
    quality: 1,
    dither: false,
    frameSkip: 0,
    colors: 256,
    preserveAlpha: true,
    alphaThreshold: 128,
    smoothing: true,
    blendMode: "source-over",
    disposalMethod: 2,
    synchronizeFrames: true,
    colorQuantization: {
      method: "neuquant",
      colors: 256
    },
    transparencyMode: "precise",
    frameCompositing: "replace"
  },
  HIGHRESPIXEL: {
    quality: 1,
    dither: false,
    frameSkip: 0,
    colors: 256,
    preserveAlpha: true,
    alphaThreshold: 128,
    smoothing: false,
    // Keep pixel sharpness
    blendMode: "copy",
    disposalMethod: 2,
    synchronizeFrames: true,
    pixelSnapping: true,
    colorQuantization: {
      method: "neuquant",
      colors: 256
    },
    transparencyMode: "precise",
    frameCompositing: "replace"
  }
};

// src/handlers/PixelArtHandler.ts
var PIXEL_ART_SETTINGS = {
  colorEnhancement: {
    red: 1.2,
    green: 1.2,
    blue: 1.2,
    alpha: 1
  },
  blendMode: "normal",
  smoothing: false,
  pixelSnapping: true,
  colorQuantization: {
    method: "median-cut",
    colors: 256
  },
  scalingMethod: "pixelated",
  maxScale: 4,
  preservePixelRatio: true,
  minimumPixelSize: 2
};
var PixelArtHandler = class _PixelArtHandler {
  static instance = null;
  static getInstance() {
    if (!this.instance) {
      this.instance = new _PixelArtHandler();
    }
    return this.instance;
  }
  destroyInstance() {
    _PixelArtHandler.instance = null;
  }
  detectPixelArt(frame) {
    const { width, height } = frame.dims;
    const totalPixels = width * height;
    const uniqueColors = /* @__PURE__ */ new Set();
    let transparentPixelCount = 0;
    for (let i = 0; i < frame.patch.length; i += 4) {
      if (frame.patch[i + 3] === 0) {
        transparentPixelCount++;
        continue;
      }
      uniqueColors.add(
        `${frame.patch[i]},${frame.patch[i + 1]},${frame.patch[i + 2]}`
      );
    }
    const colorDensityRatio = uniqueColors.size / (totalPixels - transparentPixelCount);
    const isSmall = totalPixels <= 256 * 256;
    const hasLowColorDensity = colorDensityRatio <= 0.1;
    const hasSharpEdges = this.detectSharpEdges(frame);
    return isSmall && hasLowColorDensity && hasSharpEdges;
  }
  detectSharpEdges(frame) {
    const { width, height } = frame.dims;
    let sharpEdgeCount = 0;
    let totalEdges = 0;
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const up = ((y - 1) * width + x) * 4;
        const down = ((y + 1) * width + x) * 4;
        const left = (y * width + (x - 1)) * 4;
        const right = (y * width + (x + 1)) * 4;
        if (frame.patch[idx + 3] > 0) {
          totalEdges++;
          if (this.isSharpTransition(frame.patch, idx, up) || this.isSharpTransition(frame.patch, idx, down) || this.isSharpTransition(frame.patch, idx, left) || this.isSharpTransition(frame.patch, idx, right)) {
            sharpEdgeCount++;
          }
        }
      }
    }
    return totalEdges > 0 && sharpEdgeCount / totalEdges > 0.4;
  }
  isSharpTransition(patch, idx1, idx2) {
    if (patch[idx2 + 3] === 0) return false;
    const threshold = 32;
    return Math.abs(patch[idx1] - patch[idx2]) > threshold || Math.abs(patch[idx1 + 1] - patch[idx2 + 1]) > threshold || Math.abs(patch[idx1 + 2] - patch[idx2 + 2]) > threshold;
  }
  analyzePixelArtFrame(frame) {
    const { width, height } = frame.dims;
    const totalPixels = width * height;
    const colorMap = /* @__PURE__ */ new Map();
    let transparentPixels = 0;
    let partiallyTransparentPixels = 0;
    for (let i = 0; i < frame.patch.length; i += 4) {
      if (frame.patch[i + 3] === 0) {
        transparentPixels++;
        continue;
      }
      if (frame.patch[i + 3] < 255) partiallyTransparentPixels++;
      const colorKey = `${frame.patch[i]},${frame.patch[i + 1]},${frame.patch[i + 2]}`;
      colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
    }
    const uniqueColors = colorMap.size;
    const visiblePixels = totalPixels - transparentPixels;
    const uniqueRatio = visiblePixels > 0 ? uniqueColors / visiblePixels : 1;
    const isSmall = width <= 256 && height <= 256;
    const hasLowColorDensity = uniqueRatio < 0.1;
    const isPixelArt = isSmall && hasLowColorDensity;
    const isFire = isPixelArt ? "Pixel Art" : "FIRE";
    return {
      ...frame,
      colors: uniqueColors,
      uniqueColors,
      totalPixels,
      uniqueRatio,
      isPixelArt,
      hasTransparency: transparentPixels > 0 || partiallyTransparentPixels > 0,
      needsDisposal: partiallyTransparentPixels > 0 || transparentPixels > 0 && transparentPixels < totalPixels,
      disposalType: partiallyTransparentPixels > 0 ? 2 : 1
    };
  }
  processPixelArtFrame(frame, frameAnalysis, frameIndex) {
    if (!frame.dims || !frame.patch) {
      throw new Error("Invalid frame data");
    }
    const { maxWidth, maxHeight, scaleFactors } = frameAnalysis;
    const baseScale = Math.max(
      1,
      Math.floor(CONSTANTS.TARGET_SIZE / Math.max(maxWidth, maxHeight))
    );
    const originalFrameData = {
      width: frame.dims.width,
      height: frame.dims.height,
      top: frame.dims.top || 0,
      left: frame.dims.left || 0
    };
    const scaledDimensions = {
      width: Math.floor(originalFrameData.width * baseScale),
      height: Math.floor(originalFrameData.height * baseScale),
      targetWidth: Math.floor(maxWidth * baseScale),
      targetHeight: Math.floor(maxHeight * baseScale)
    };
    const position = {
      x: originalFrameData.left * baseScale,
      y: originalFrameData.top * baseScale
    };
    if (originalFrameData.left === 0 && originalFrameData.top === 0) {
      position.x = Math.floor(
        (scaledDimensions.targetWidth - scaledDimensions.width) / 2
      );
      position.y = Math.floor(
        (scaledDimensions.targetHeight - scaledDimensions.height) / 2
      );
    }
    const alignedPosition = {
      x: Math.floor(position.x / baseScale) * baseScale,
      y: Math.floor(position.y / baseScale) * baseScale
    };
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = frame.dims.width;
    tempCanvas.height = frame.dims.height;
    const tempCtx = tempCanvas.getContext("2d", { alpha: true });
    if (!tempCtx) throw new Error("Failed to get temp context");
    tempCtx.imageSmoothingEnabled = false;
    tempCtx.imageSmoothingQuality = "low";
    const sourceData = new ImageData(
      new Uint8ClampedArray(frame.patch),
      frame.dims.width,
      frame.dims.height
    );
    tempCtx.putImageData(sourceData, 0, 0);
    const outCanvas = document.createElement("canvas");
    outCanvas.width = scaledDimensions.targetWidth;
    outCanvas.height = scaledDimensions.targetHeight;
    const outCtx = outCanvas.getContext("2d", { alpha: true });
    if (!outCtx) throw new Error("Failed to get output context");
    outCtx.imageSmoothingEnabled = false;
    outCtx.imageSmoothingQuality = "low";
    outCtx.drawImage(
      tempCanvas,
      0,
      0,
      originalFrameData.width,
      originalFrameData.height,
      // Source rect
      alignedPosition.x,
      alignedPosition.y,
      // Destination position
      scaledDimensions.width,
      scaledDimensions.height
      // Destination size
    );
    const finalData = outCtx.getImageData(
      0,
      0,
      scaledDimensions.targetWidth,
      scaledDimensions.targetHeight
    );
    tempCanvas.remove();
    outCanvas.remove();
    return {
      ...frame,
      patch: finalData.data,
      dims: {
        width: scaledDimensions.targetWidth,
        height: scaledDimensions.targetHeight,
        top: 0,
        left: 0
      },
      disposalType: frame.disposalType || 2
    };
  }
};
var pixelArtHandler = PixelArtHandler.getInstance();

// src/analyzers/GifAnalyzer.ts
var GifAnalyzer = class _GifAnalyzer {
  static instance = null;
  static getInstance() {
    if (!this.instance) {
      this.instance = new _GifAnalyzer();
    }
    return this.instance;
  }
  destroyInstance() {
    _GifAnalyzer.instance = null;
  }
  async analyzeImageFromGif(buffer) {
    const bytes = new Uint8Array(buffer);
    const isGif = bytes.length >= 6 && (String.fromCharCode(...bytes.slice(0, 6)) === "GIF87a" || String.fromCharCode(...bytes.slice(0, 6)) === "GIF89a");
    if (isGif) {
      const metadata = await _GifAnalyzer.instance.analyzeGIF(buffer);
      const uniqueColorCount = Math.max(1, 2 ** metadata.colorDepth);
      const visiblePixels = Math.max(1, metadata.width * metadata.height);
      const colorDensityRatio = uniqueColorCount / visiblePixels;
      const dominantColors = this.extractDominantColorsFromGifMetadata(metadata);
      return {
        isPixelArt: metadata.isPixelArt,
        isAnimated: metadata.frames > 1,
        hasTransparency: metadata.hasTransparency,
        hasPartialTransparency: metadata.frameExtras.frameDelays.some((delay) => delay > 0) && metadata.frameExtras.frameColors.some(
          (colorSet) => colorSet.size > 0
        ),
        uniqueColorCount,
        colorDensityRatio,
        dominantColors,
        isFireLike: dominantColors.some(
          (c) => c.frequency > 0.15 && c.r > c.g * 1.5 && c.r > c.b * 1.5 && c.r > 200
        ),
        isHighRes: metadata.frameExtras.individualFrameSizes.some(
          (s) => s.width * s.height > 512 * 512
        ),
        hasVariableFrameSizes: metadata.frameExtras.individualFrameSizes.some(
          (s) => s.width !== metadata.width || s.height !== metadata.height
        )
      };
    }
    return {
      isPixelArt: false,
      isAnimated: false,
      hasTransparency: false,
      hasPartialTransparency: false,
      uniqueColorCount: 0,
      colorDensityRatio: 0,
      isHighRes: false,
      hasVariableFrameSizes: false
    };
  }
  async detectPixelArtInAllFrames(frames) {
    return frames.some((frame) => this.detectPixelArt(frame));
  }
  extractDominantColorsFromGifMetadata(metadata) {
    const colorFrequencyMap = {};
    metadata.frameExtras.frameColors.forEach((colorSet) => {
      colorSet.forEach((color) => {
        const key = color.toString();
        colorFrequencyMap[key] = (colorFrequencyMap[key] || 0) + 1;
      });
    });
    const totalColors = Object.values(colorFrequencyMap).reduce(
      (sum, freq) => sum + freq,
      0
    );
    const dominantColors = Object.entries(colorFrequencyMap).map(([key, frequency]) => {
      const [r, g, b] = key.split(",").map(Number);
      return { r, g, b, frequency: frequency / totalColors };
    }).sort((a, b) => b.frequency - a.frequency).slice(0, 5);
    return dominantColors;
  }
  /**
   * ✅ Enhanced Pixel Art Detection using color density and edge transitions.
   */
  detectPixelArt(frame) {
    const { width, height } = frame.dims;
    const totalPixels = width * height;
    const uniqueColors = /* @__PURE__ */ new Set();
    let transparentPixels = 0;
    for (let i = 0; i < frame.patch.length; i += 4) {
      const r = frame.patch[i];
      const g = frame.patch[i + 1];
      const b = frame.patch[i + 2];
      const a = frame.patch[i + 3];
      if (a === 0) {
        transparentPixels++;
        continue;
      }
      uniqueColors.add(`${r},${g},${b}`);
    }
    const visiblePixels = totalPixels - transparentPixels;
    const colorDensityRatio = uniqueColors.size / visiblePixels;
    const isSmallEnough = totalPixels <= 256 * 256;
    const hasLowColorDensity = colorDensityRatio <= 0.15;
    const usesLimitedPalette = uniqueColors.size <= 256;
    return isSmallEnough && (hasLowColorDensity || usesLimitedPalette);
  }
  async analyzeGIF(buffer) {
    const gif = (0, import_gifuct_js.parseGIF)(buffer);
    const frames = (0, import_gifuct_js.decompressFrames)(gif, true);
    const isHighRes = frames.some(
      (frame) => frame.dims.width * frame.dims.height > 512 * 512
    );
    let isPixelArt = false;
    isPixelArt = frames.some((frame) => this.detectPixelArt(frame));
    let hasTransparency = false;
    let totalUniqueColors = /* @__PURE__ */ new Set();
    const frameMetrics = frames.map((frame) => {
      const metrics = PixelArtHandler.prototype.analyzePixelArtFrame(frame);
      hasTransparency = hasTransparency || metrics.hasTransparency;
      for (let i = 0; i < frame.patch.length; i += 4) {
        if (frame.patch[i + 3] > 0) {
          totalUniqueColors.add(
            `${frame.patch[i]},${frame.patch[i + 1]},${frame.patch[i + 2]}`
          );
        }
      }
      return metrics;
    });
    const frameExtras = {
      frameDelays: frames.map((f) => f.delay),
      individualFrameSizes: frames.map((f) => ({
        width: f.dims.width,
        height: f.dims.height
      })),
      frameDisposal: frames.map((f) => f.disposalType || 0),
      transparentIndex: frames.map((f) => f.transparentIndex || -1),
      framePatch: frames.map((f) => new Set(Array.from(f.patch))),
      frameColors: frames.map((f) => {
        const colors = /* @__PURE__ */ new Set();
        for (let i = 0; i < f.patch.length; i += 4) {
          if (f.patch[i + 3] > 0) {
            colors.add(
              f.patch[i] << 16 | f.patch[i + 1] << 8 | f.patch[i + 2]
            );
          }
        }
        return colors;
      }),
      framePixels: frames.map((f) => f.pixels || []),
      transparencyThresholds: frameMetrics.map(
        (m) => m.needsDisposal ? 220 : 128
      ),
      isHighRes,
      averageAlpha: frames.map((frame) => {
        let alphaSum = 0;
        let pixelCount = 0;
        for (let i = 3; i < frame.patch.length; i += 4) {
          if (frame.patch[i] > 0) {
            alphaSum += frame.patch[i];
            pixelCount++;
          }
        }
        return pixelCount > 0 ? alphaSum / pixelCount : 255;
      })
    };
    const gifExtras = {
      gifSignature: gif.header.signature,
      gifVersion: gif.header.version,
      backgroundColorIndex: gif.lsd.backgroundColorIndex,
      sort: Boolean(gif.lsd.gct.sort),
      globalColorTable: gif.gct || [],
      globalPalette: gif.lsd.gct.size,
      resolution: gif.lsd.gct.resolution,
      pixelAspectRatio: gif.lsd.pixelAspectRatio,
      globalPaletteDepth: gif.gct ? Math.ceil(Math.log2(gif.gct.length)) : 0
    };
    return {
      width: gif.lsd.width,
      height: gif.lsd.height,
      frames: frames.length,
      isPixelArt,
      hasTransparency,
      colorDepth: Math.ceil(Math.log2(totalUniqueColors.size)),
      frameExtras,
      gifExtras
    };
  }
  //public analyzeFrameDimensions(frames: ParsedFrame[]): FrameSizeMetadata {
  analyzeGIFFrameDimensions(frames) {
    const dimensions = frames.map((f) => ({
      width: f.dims.width,
      height: f.dims.height
    }));
    const maxWidth = Math.max(...dimensions.map((d) => d.width));
    const maxHeight = Math.max(...dimensions.map((d) => d.height));
    const hasVariableSize = dimensions.some(
      (d) => d.width !== maxWidth || d.height !== maxHeight
    );
    const scaleFactors = dimensions.map((d) => {
      const widthScale = maxWidth / d.width;
      const heightScale = maxHeight / d.height;
      return Math.min(widthScale, heightScale);
    });
    return { maxWidth, maxHeight, hasVariableSize, scaleFactors };
  }
};
var gifAnalyzer = GifAnalyzer.getInstance();

// src/managers/QualityManager.ts
var QualityManager = class _QualityManager {
  static instance = null;
  qualityOptions;
  constructor() {
    this.qualityOptions = {
      allowAutoDetect: true
    };
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new _QualityManager();
    }
    return this.instance;
  }
  destroyInstance() {
    _QualityManager.instance = null;
  }
  /**
   * ✅ Dynamically applies image quality settings based on detected GIF type.
   */
  applyImageQualitySettings(ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
  }
  selectOptimalQuality(metadata) {
    if (this.qualityOptions.forceQuality) {
      return this.qualityOptions.forceQuality;
    }
    if (!this.qualityOptions.allowAutoDetect) {
      return "HIGH";
    }
    if (metadata.isPixelArt) return "PIXEL";
    const totalPixels = metadata.width * metadata.height;
    const avgFrameSize = metadata.frameExtras.individualFrameSizes.reduce(
      (sum, size) => sum + size.width * size.height,
      0
    ) / metadata.frames;
    const isHighRes = totalPixels > 512 * 512 || avgFrameSize > 256 * 256;
    const hasHighColorDepth = metadata.colorDepth > 128;
    const hasComplexFrames = metadata.frameExtras.frameColors.some(
      (colors) => colors.size > 128
    );
    const dominantColorAnalysis = this.analyzeDominantColors(metadata);
    const hasFireCharacteristics = dominantColorAnalysis.isFireEffect;
    if (hasFireCharacteristics && metadata.frames > 1) {
      return "FIRE";
    }
    if (isHighRes) {
      if (hasHighColorDepth || hasComplexFrames) {
        return metadata.hasTransparency ? "HIGHRES" : "HIGH";
      }
      return "HIGH";
    }
    if (metadata.width * metadata.height > 1024 * 1024) {
      return metadata.hasTransparency ? "HIGHRES" : "HIGH";
    }
    if (metadata.colorDepth < 64) return "LOW";
    if (metadata.colorDepth < 128) return "MEDIUM";
    return "HIGH";
  }
  /**
   * ✅ Determines the best quality preset for the GIF using metadata analysis.
   */
  selectQuality(metadata) {
    if (this.qualityOptions.forceQuality) {
      return this.qualityOptions.forceQuality;
    }
    const dimensions = metadata.width * metadata.height;
    const characteristics = {
      isHighRes: dimensions > 512 * 512,
      isVeryHighRes: dimensions > 1024 * 1024,
      hasHighColorDepth: metadata.colorDepth > 128,
      hasLimitedPalette: metadata.colorDepth < 128,
      hasSharpEdges: this.detectSharpEdges(metadata),
      hasTransparency: metadata.hasTransparency
    };
    const dominantColors = this.analyzeDominantColors(metadata);
    const hasFireMotion = this.detectFireMotion(metadata);
    if (dominantColors.isFireEffect && hasFireMotion) {
      return "FIRE";
    }
    if (metadata.isPixelArt) {
      return characteristics.isHighRes ? "HIGHRESPIXEL" : "PIXEL";
    }
    if (characteristics.isHighRes || characteristics.isVeryHighRes) {
      if (characteristics.hasSharpEdges && characteristics.hasLimitedPalette) {
        return "HIGHRESPIXEL";
      }
      return "HIGHRES";
    }
    if (characteristics.hasHighColorDepth || metadata.frames > 30) {
      return "HIGH";
    }
    return "HIGH";
  }
  hasPixelArtCharacteristics(metadata) {
    const hasLimitedPalette = metadata.colorDepth < 128;
    const hasSharpEdges = metadata.frameExtras.frameColors.every(
      (colors) => colors.size < metadata.width * metadata.height * 0.1
    );
    return hasLimitedPalette && hasSharpEdges;
  }
  /**
   * 🔥 **Detects rapid red/orange shifts across frames (fire animation)**
   */
  detectFireMotion(metadata) {
    let fireCharacteristics = 0;
    const frames = metadata.frameExtras.frameColors;
    for (let i = 0; i < frames.length - 1; i++) {
      const currentFrame = Array.from(frames[i]);
      const nextFrame = Array.from(frames[i + 1]);
      const redChanges = currentFrame.filter((color, index) => {
        const currentRed = color >> 16 & 255;
        const nextRed = nextFrame[index] >> 16 & 255;
        return Math.abs(currentRed - nextRed) > 20;
      }).length;
      if (redChanges > currentFrame.length * 0.2) {
        fireCharacteristics++;
      }
    }
    return fireCharacteristics > frames.length * 0.5;
  }
  /**
   * 🎨 **Detects if the GIF has pixel art characteristics**
   */
  detectPixelArt(metadata) {
    return metadata.colorDepth < 128 && this.detectSharpEdges(metadata);
  }
  async detectArtType(metadata) {
    if (metadata.isPixelArt) {
      return "PIXEL_ART";
    }
    if (metadata.width * metadata.height > 512 * 512) {
      return "HIGH_RES";
    }
    return "STANDARD";
  }
  /**
   * 🌈 **Analyzes dominant colors to detect fire-like effects**
   */
  analyzeDominantColors(metadata) {
    const colorCounts = /* @__PURE__ */ new Map();
    let totalPixels = 0;
    metadata.frameExtras.frameColors.forEach((colors) => {
      colors.forEach((color) => {
        const r = color >> 16 & 255;
        const g = color >> 8 & 255;
        const b = color & 255;
        const key = `${r},${g},${b}`;
        colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
        totalPixels++;
      });
    });
    const dominantColors = Array.from(colorCounts.entries()).map(([key, count]) => {
      const [r, g, b] = key.split(",").map(Number);
      return { r, g, b, frequency: count / totalPixels };
    }).sort((a, b) => b.frequency - a.frequency).slice(0, 5);
    const isFireEffect = dominantColors.some(
      (color) => color.frequency > 0.15 && color.r > color.g * 1.5 && color.r > color.b * 1.5 && color.r > 200
    );
    return { isFireEffect, dominantColors };
  }
  /**
   * 🔍 **Checks for sharp color transitions in frames (pixel art or high-res)**
   */
  detectSharpEdges(metadata) {
    return metadata.frameExtras.frameColors.some((colors) => {
      const colorArray = Array.from(colors);
      let sharpTransitions = 0;
      for (let i = 0; i < colorArray.length - 1; i++) {
        const color1 = colorArray[i];
        const color2 = colorArray[i + 1];
        const r1 = color1 >> 16 & 255;
        const g1 = color1 >> 8 & 255;
        const b1 = color1 & 255;
        const r2 = color2 >> 16 & 255;
        const g2 = color2 >> 8 & 255;
        const b2 = color2 & 255;
        if (Math.abs(r1 - r2) > 32 || Math.abs(g1 - g2) > 32 || Math.abs(b1 - b2) > 32) {
          sharpTransitions++;
        }
      }
      return sharpTransitions > colorArray.length * 0.3;
    });
  }
};
var qualityManager = QualityManager.getInstance();
var QualityManager_default = QualityManager;

// src/analyzers/QualityAnalyzer.ts
var QualityAnalyzer = class _QualityAnalyzer {
  static instance = null;
  qualityManager;
  gifAnalyzer;
  constructor(qualityManager2, gifAnalyzer2) {
    this.qualityManager = qualityManager2;
    this.gifAnalyzer = gifAnalyzer2;
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new _QualityAnalyzer(
        new QualityManager(),
        GifAnalyzer.getInstance()
      );
    }
    return this.instance;
  }
  destroyInstance() {
    _QualityAnalyzer.instance = null;
  }
  async analyzeGifQuality(gifUrl) {
    try {
      const response = await fetch(gifUrl);
      const buffer = await response.arrayBuffer();
      const metadata = await this.gifAnalyzer.analyzeGIF(buffer);
      const quality = this.qualityManager.selectOptimalQuality(metadata);
      return {
        quality,
        metadata
      };
    } catch (error) {
      console.error("Error analyzing GIF quality:", error);
      throw error;
    }
  }
};

// src/handlers/FrameProcessor.ts
var FrameProcessor = class _FrameProcessor {
  static instance = null;
  pixelArtHandler;
  imageProcessor;
  canvasPool;
  gifAnalyzer;
  workerPool;
  workerCount;
  constructor(pixelArtHandler2, imageProcessor, canvasPool2, gifAnalyzer2, workerPool2, workerCount) {
    this.pixelArtHandler = pixelArtHandler2;
    this.imageProcessor = imageProcessor;
    this.canvasPool = canvasPool2;
    this.gifAnalyzer = gifAnalyzer2;
    this.workerPool = workerPool2;
    this.workerCount = workerCount;
  }
  static getInstance(pixelArtHandler2, imageProcessor, canvasPool2, gifAnalyzer2, workerPool2, workerCount) {
    if (!this.instance) {
      this.instance = new _FrameProcessor(
        pixelArtHandler2,
        imageProcessor,
        canvasPool2,
        gifAnalyzer2,
        workerPool2,
        workerCount
      );
    }
    return this.instance;
  }
  static destroyInstance() {
    this.instance = null;
  }
  calculateFrameSizeMetadata(metadata) {
    const { width, height, frames, isPixelArt } = metadata;
    const frameSizes = metadata.frameExtras.individualFrameSizes;
    const maxWidth = Math.max(...frameSizes.map((f) => f.width));
    const maxHeight = Math.max(...frameSizes.map((f) => f.height));
    const minWidth = Math.min(...frameSizes.map((f) => f.width));
    const minHeight = Math.min(...frameSizes.map((f) => f.height));
    const hasVariableSizes = frameSizes.some(
      (size) => size.width !== maxWidth || size.height !== maxHeight
    );
    const aspectRatios = frameSizes.map((frame) => frame.width / frame.height);
    const baseAspectRatio = width / height;
    let targetSize;
    if (isPixelArt) {
      const maxDimension = Math.max(maxWidth, maxHeight);
      const scale = Math.floor(CONSTANTS.TARGET_SIZE / maxDimension);
      targetSize = {
        width: maxWidth * scale,
        height: maxHeight * scale,
        scale
      };
    } else {
      const scale = CONSTANTS.TARGET_SIZE / Math.max(maxWidth, maxHeight);
      targetSize = {
        width: Math.round(maxWidth * scale),
        height: Math.round(maxHeight * scale),
        scale
      };
    }
    return {
      maxWidth,
      maxHeight,
      minWidth,
      minHeight,
      hasVariableSizes,
      aspectRatios,
      targetSize
    };
  }
  // Add this new helper method for calculating frame fit dimensions
  calculateGifFitDimensions(frameWidth, frameHeight) {
    const targetSize = CONSTANTS.TARGET_SIZE;
    const aspectRatio = frameWidth / frameHeight;
    const targetAspectRatio = 1;
    let scaledWidth, scaledHeight;
    let sourceX = 0, sourceY = 0;
    let sourceWidth = frameWidth, sourceHeight = frameHeight;
    if (aspectRatio > targetAspectRatio) {
      scaledHeight = targetSize;
      scaledWidth = targetSize;
      sourceHeight = frameHeight;
      sourceWidth = Math.round(frameHeight);
      sourceX = Math.round((frameWidth - sourceWidth) / 2);
    } else {
      scaledWidth = targetSize;
      scaledHeight = targetSize;
      sourceWidth = frameWidth;
      sourceHeight = Math.round(frameWidth);
      sourceY = Math.round((frameHeight - sourceHeight) / 2);
    }
    return {
      width: scaledWidth,
      height: scaledHeight,
      x: 0,
      // No need to center since we're filling the canvas
      y: 0,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight
    };
  }
  // Add this new method to determine consistent dimensions for all frames
  calculateConsistentDimensions(frames) {
    const maxWidth = Math.max(...frames.map((f) => f.dims.width));
    const maxHeight = Math.max(...frames.map((f) => f.dims.height));
    const scale = Math.min(
      CONSTANTS.TARGET_SIZE / maxWidth,
      CONSTANTS.TARGET_SIZE / maxHeight
    );
    const scaledWidth = Math.round(maxWidth * scale);
    const scaledHeight = Math.round(maxHeight * scale);
    const offsetX = Math.floor((CONSTANTS.TARGET_SIZE - scaledWidth) / 2);
    const offsetY = Math.floor((CONSTANTS.TARGET_SIZE - scaledHeight) / 2);
    return {
      width: scaledWidth,
      height: scaledHeight,
      scale,
      offsetX,
      offsetY
    };
  }
  async processFrame(frame, staticImage) {
    try {
      const isPixelArt = this.gifAnalyzer.detectPixelArt(frame);
      const { width, height } = frame.dims;
      if (isPixelArt) {
        const frameAnalysis = this.gifAnalyzer.analyzeGIFFrameDimensions([
          frame
        ]);
        const processedFrame = this.pixelArtHandler.processPixelArtFrame(
          frame,
          frameAnalysis,
          0
        );
        const bitmap2 = await createImageBitmap(
          new ImageData(
            new Uint8ClampedArray(processedFrame.patch),
            processedFrame.dims.width,
            processedFrame.dims.height
          )
        );
        return { bitmap: bitmap2, originalFrame: processedFrame };
      }
      const frameCanvas = this.canvasPool.getCanvas(
        width,
        height,
        false
      );
      const ctx = frameCanvas.getContext("2d", { alpha: true });
      if (!ctx) throw new Error("Failed to get canvas context");
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = !isPixelArt;
      ctx.imageSmoothingQuality = isPixelArt ? "low" : "high";
      const frameImageData = new ImageData(
        new Uint8ClampedArray(frame.patch),
        width,
        height
      );
      ctx.putImageData(frameImageData, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      if (staticImage) {
        ctx.drawImage(staticImage, 0, 0, width, height);
      }
      const bitmap = await createImageBitmap(frameCanvas);
      return { bitmap, originalFrame: frame };
    } catch (error) {
      console.error("Error processing frame:", error);
      throw error;
    }
  }
  async processFrameOG(frame) {
    try {
      const isPixelArt = this.gifAnalyzer.detectPixelArt(frame);
      const { width, height } = frame.dims;
      const {
        width: scaledWidth,
        height: scaledHeight,
        x,
        y
      } = this.calculateGifFitDimensions(width, height);
      const frameCanvas = this.imageProcessor.createCanvas(
        scaledWidth,
        scaledHeight
      );
      const ctx = this.imageProcessor.getCanvasContext(frameCanvas);
      ctx.clearRect(0, 0, scaledWidth, scaledHeight);
      ctx.globalCompositeOperation = "source-over";
      const tempCanvas = this.imageProcessor.createCanvas(width, height);
      const tempCtx = this.imageProcessor.getCanvasContext(tempCanvas);
      const frameImageData = new ImageData(
        new Uint8ClampedArray(frame.patch),
        width,
        height
      );
      const alphaThreshold = 220;
      for (let i = 3; i < frameImageData.data.length; i += 4) {
        if (frameImageData.data[i] < alphaThreshold) {
          frameImageData.data[i] = 0;
        }
      }
      tempCtx.putImageData(frameImageData, 0, 0);
      ctx.drawImage(tempCanvas, x, y, scaledWidth, scaledHeight);
      const newImageData = ctx.getImageData(
        0,
        0,
        frameCanvas.width,
        frameCanvas.height
      );
      return {
        ...frame,
        patch: newImageData.data,
        // Store updated pixel data
        dims: {
          width: frameCanvas.width,
          height: frameCanvas.height,
          top: 0,
          left: 0
        }
      };
    } catch (error) {
      throw new Error(`Failed to process frame: ${error}`);
    }
  }
  optimizeFrameDimensions(frame, metadata) {
    const isPixelArt = metadata.isPixelArt;
    const { width, height } = frame.dims;
    if (isPixelArt) {
      const pixelSize = Math.max(
        PIXEL_ART_SETTINGS.minimumPixelSize,
        Math.floor(CONSTANTS.TARGET_SIZE / Math.max(width, height))
      );
      const scale2 = Math.min(pixelSize, PIXEL_ART_SETTINGS.maxScale);
      return {
        width: width * scale2,
        height: height * scale2,
        scale: scale2,
        offsetX: Math.floor((CONSTANTS.TARGET_SIZE - width * scale2) / 2),
        offsetY: Math.floor((CONSTANTS.TARGET_SIZE - height * scale2) / 2)
      };
    }
    const scale = Math.min(
      CONSTANTS.TARGET_SIZE / width,
      CONSTANTS.TARGET_SIZE / height
    );
    return this.calculateConsistentDimensions([frame]);
  }
  async processFrame1(frame, staticImage, metadata) {
    if (!metadata) {
      return frame;
    }
    const {
      width: scaledWidth1,
      height: scaledHeight1,
      sourceX,
      sourceY
    } = this.calculateGifFitDimensions(frame.dims.width, frame.dims.height);
    const sizeMetadata = this.calculateFrameSizeMetadata(metadata);
    const isPixelArt = metadata.isPixelArt;
    const frameCanvas = document.createElement("canvas");
    frameCanvas.width = sizeMetadata.targetSize.width;
    frameCanvas.height = sizeMetadata.targetSize.height;
    const ctx = frameCanvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("Failed to get canvas context");
    const { width, height, scale } = this.imageProcessor.calculateUniformDimensions(metadata);
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      if (frameCanvas instanceof HTMLCanvasElement) {
        frameCanvas.style.imageRendering = "pixelated";
      }
      const x2 = (width - frame.dims.width * scale) / 2;
      const y2 = (height - frame.dims.height * scale) / 2;
      const tempCanvas2 = document.createElement("canvas");
      tempCanvas2.width = frame.dims.width;
      tempCanvas2.height = frame.dims.height;
      const tempCtx2 = tempCanvas2.getContext("2d", { alpha: true });
      if (!tempCtx2) throw new Error("Failed to get temp context");
      tempCtx2.putImageData(
        new ImageData(
          new Uint8ClampedArray(frame.patch),
          frame.dims.width,
          frame.dims.height
        ),
        0,
        0
      );
      ctx.drawImage(
        tempCanvas2,
        x2,
        y2,
        frame.dims.width * scale,
        frame.dims.height * scale
      );
    }
    ctx.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
    const scaledWidth = frame.dims.width * sizeMetadata.targetSize.scale;
    const scaledHeight = frame.dims.height * sizeMetadata.targetSize.scale;
    const x = (sizeMetadata.targetSize.width - scaledWidth) / 2;
    const y = (sizeMetadata.targetSize.height - scaledHeight) / 2;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = frame.dims.width;
    tempCanvas.height = frame.dims.height;
    const tempCtx = tempCanvas.getContext("2d", { alpha: true });
    if (!tempCtx) throw new Error("Failed to get temp context");
    tempCtx.putImageData(
      new ImageData(
        new Uint8ClampedArray(frame.patch),
        frame.dims.width,
        frame.dims.height
      ),
      0,
      0
    );
    ctx.drawImage(tempCanvas, x, y, scaledWidth, scaledHeight);
    const newImageData = ctx.getImageData(
      0,
      0,
      frameCanvas.width,
      frameCanvas.height
    );
    return {
      ...frame,
      patch: newImageData.data,
      dims: {
        width: frameCanvas.width,
        height: frameCanvas.height,
        top: 0,
        left: 0
      }
    };
  }
  processHighResFrame(frame, metadata) {
    const { width, height } = frame.dims;
    const alphaCanvas = document.createElement("canvas");
    alphaCanvas.width = width;
    alphaCanvas.height = height;
    const alphaCtx = alphaCanvas.getContext("2d", { alpha: true });
    if (!alphaCtx) throw new Error("Failed to get alpha context");
    const imageData = new ImageData(
      new Uint8ClampedArray(frame.patch),
      width,
      height
    );
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] > 0 && imageData.data[i] < 255) {
        continue;
      }
      if (imageData.data[i] === 0) {
        imageData.data[i - 3] = 0;
        imageData.data[i - 2] = 0;
        imageData.data[i - 1] = 0;
      }
    }
    alphaCtx.putImageData(imageData, 0, 0);
    const { width: targetWidth, height: targetHeight } = this.calculateGifFitDimensions(width, height);
    const outCanvas = document.createElement("canvas");
    outCanvas.width = targetWidth;
    outCanvas.height = targetHeight;
    const outCtx = outCanvas.getContext("2d", { alpha: true });
    if (!outCtx) throw new Error("Failed to get output context");
    outCtx.imageSmoothingEnabled = true;
    outCtx.imageSmoothingQuality = "high";
    outCtx.drawImage(alphaCanvas, 0, 0, targetWidth, targetHeight);
    const finalData = outCtx.getImageData(0, 0, targetWidth, targetHeight);
    alphaCanvas.remove();
    outCanvas.remove();
    return {
      ...frame,
      patch: finalData.data,
      dims: {
        width: targetWidth,
        height: targetHeight,
        top: 0,
        left: 0
      },
      disposalType: 2
    };
  }
  async processFramesInWorkers(frames, staticImage) {
    const isPixelArt = await this.gifAnalyzer.detectPixelArtInAllFrames(frames);
    const chunkSize = Math.ceil(frames.length / this.workerCount);
    const frameChunks = [];
    for (let i = 0; i < frames.length; i += chunkSize) {
      frameChunks.push(frames.slice(i, i + chunkSize));
    }
    return (await Promise.all(
      frameChunks.map(
        async (chunk) => this.workerPool.addTask(
          () => Promise.all(
            chunk.map(
              async (frame) => this.processFrame(frame, staticImage ?? null)
            )
          )
        )
      )
    )).flat();
  }
};
var FrameProcessor_default = FrameProcessor;

// src/managers/ArtManager.ts
var ArtManager = class _ArtManager {
  static instance = null;
  qualityOptions;
  constructor() {
    this.qualityOptions = {
      checkQuality: "HIGH",
      allowAutoDetect: true
    };
  }
  extractCharacteristics(metadata) {
    return {
      name: metadata.name,
      format: metadata.format,
      type: metadata.type,
      width: metadata.width,
      height: metadata.height,
      isMap: metadata.isMap,
      loading: metadata.loading,
      naturalHeight: metadata.naturalHeight,
      naturalWidth: metadata.naturalWidth,
      sizes: metadata.sizes,
      useMap: metadata.useMap,
      x: metadata.x,
      y: metadata.y
    };
  }
  selectOptimalQuality(metadata) {
    const characteristics = this.extractCharacteristics(metadata);
    if (!this.qualityOptions.allowAutoDetect) {
      return this.qualityOptions.checkQuality;
    }
    if (characteristics.format === "gif") {
      if (characteristics.type === "ANIMATION") {
        return "HIGH";
      }
      if (characteristics.type === "image") {
        return "PIXEL";
      }
    }
    if (characteristics.format === "png" && characteristics.type === "image") {
      return "HIGHRES";
    }
    if (characteristics.format === "jpg" && characteristics.type === "image") {
      return "HIGHRESPIXEL";
    }
    return "HIGH";
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new _ArtManager();
    }
    return this.instance;
  }
  static destroyInstance() {
    this.instance = null;
  }
};

// src/runtime/taskProtocol.ts
var INVALID_REQUEST_ID = "invalid-request";
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function getRequestId(request) {
  if (isRecord(request) && isNonEmptyString(request.id)) {
    return request.id;
  }
  return INVALID_REQUEST_ID;
}
function assertValidTaskRequest(request) {
  if (!isRecord(request)) {
    throw new Error("Runtime task request must be an object");
  }
  if (!isNonEmptyString(request.id)) {
    throw new Error("Runtime task request id must be a non-empty string");
  }
  if (!isNonEmptyString(request.taskName)) {
    throw new Error("Runtime task request taskName must be a non-empty string");
  }
  if (!("payload" in request)) {
    throw new Error("Runtime task request payload must be present");
  }
}
var RuntimeTaskRegistry = class {
  handlers = /* @__PURE__ */ new Map();
  register(taskName, handler) {
    if (!isNonEmptyString(taskName)) {
      throw new Error("Runtime task name must be a non-empty string");
    }
    if (typeof handler !== "function") {
      throw new Error(
        `Runtime task handler for ${taskName} must be a function`
      );
    }
    if (this.handlers.has(taskName)) {
      throw new Error(`Runtime task ${taskName} is already registered`);
    }
    this.handlers.set(taskName, handler);
  }
  has(taskName) {
    return this.handlers.has(taskName);
  }
  async run(taskName, payload) {
    const handler = this.handlers.get(taskName);
    if (!handler) {
      throw new Error(`No runtime task registered for ${taskName}`);
    }
    return await handler(payload);
  }
};
async function executeTaskRequest(registry, request) {
  try {
    assertValidTaskRequest(request);
    const result = await registry.run(
      request.taskName,
      request.payload
    );
    return {
      id: request.id,
      ok: true,
      result
    };
  } catch (error) {
    return {
      id: getRequestId(request),
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// src/runtime/WorkerPool.ts
function getDefaultConcurrency() {
  if (typeof navigator !== "undefined" && navigator.hardwareConcurrency) {
    return navigator.hardwareConcurrency;
  }
  return 4;
}
var WorkerPool = class _WorkerPool {
  constructor(maxWorkers = Math.max(
    1,
    Math.ceil(getDefaultConcurrency())
  ), workerScript) {
    this.maxWorkers = maxWorkers;
    this.workerScript = workerScript;
  }
  maxWorkers;
  workerScript;
  static instance = null;
  executingTasks = /* @__PURE__ */ new Map();
  availableWorkers = /* @__PURE__ */ new Set();
  taskRegistry = new RuntimeTaskRegistry();
  queue = [];
  initialized = false;
  shutdownRequested = false;
  static getInstance(maxWorkers, workerScript) {
    if (!this.instance) {
      this.instance = new _WorkerPool(maxWorkers, workerScript);
    }
    return this.instance;
  }
  static destroyInstance() {
    this.instance = null;
  }
  get stats() {
    return {
      activeWorkers: this.executingTasks.size,
      availableWorkers: this.availableWorkers.size,
      maxWorkers: this.maxWorkers,
      queuedTasks: this.queue.length
    };
  }
  async initialize() {
    if (this.initialized) {
      return;
    }
    for (let workerId = 0; workerId < this.maxWorkers; workerId += 1) {
      this.availableWorkers.add(workerId);
    }
    this.shutdownRequested = false;
    this.initialized = true;
  }
  async registerTask(taskName, taskFunction) {
    this.taskRegistry.register(taskName, taskFunction);
  }
  hasTask(taskName) {
    return this.taskRegistry.has(taskName);
  }
  async runTask(taskName, payload, timeout = 3e4) {
    if (!this.taskRegistry.has(taskName)) {
      throw new Error(`Unknown worker task: ${taskName}`);
    }
    return this.addTask(
      () => this.taskRegistry.run(taskName, payload),
      timeout
    );
  }
  async addTask(task, timeout = 3e4) {
    if (!this.initialized) {
      await this.initialize();
    }
    if (this.shutdownRequested) {
      throw new Error("Worker pool is shutting down");
    }
    return new Promise((resolve, reject) => {
      this.queue.push({
        task,
        resolve,
        reject,
        timeoutMs: timeout
      });
      this.processQueue();
    });
  }
  markWorkerAvailable(workerId) {
    this.availableWorkers.add(workerId);
  }
  async terminate(force = false) {
    this.shutdownRequested = true;
    if (force) {
      while (this.queue.length > 0) {
        const task = this.queue.shift();
        task?.reject(new Error("Worker pool terminated"));
      }
    }
    for (const [, task] of this.executingTasks) {
      clearTimeout(task.timeoutId);
      if (force) {
        task.reject(new Error("Worker pool terminated"));
      }
    }
    this.executingTasks.clear();
    this.availableWorkers.clear();
    this.initialized = false;
  }
  processQueue() {
    while (this.queue.length > 0 && this.availableWorkers.size > 0) {
      const workerId = this.availableWorkers.values().next().value;
      if (workerId === void 0) {
        return;
      }
      this.availableWorkers.delete(workerId);
      const queuedTask = this.queue.shift();
      if (!queuedTask) {
        this.availableWorkers.add(workerId);
        return;
      }
      const timeoutId = setTimeout(() => {
        const executing = this.executingTasks.get(workerId);
        if (!executing) {
          return;
        }
        this.executingTasks.delete(workerId);
        executing.reject(new Error("Task timed out"));
        this.markWorkerAvailable(workerId);
        this.processQueue();
      }, queuedTask.timeoutMs);
      this.executingTasks.set(workerId, {
        ...queuedTask,
        timeoutId
      });
      void this.executeTask(workerId, queuedTask, timeoutId);
    }
  }
  async executeTask(workerId, queuedTask, timeoutId) {
    try {
      const result = await queuedTask.task();
      clearTimeout(timeoutId);
      if (this.executingTasks.has(workerId)) {
        queuedTask.resolve(result);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (this.executingTasks.has(workerId)) {
        queuedTask.reject(error);
      }
    } finally {
      this.executingTasks.delete(workerId);
      if (!this.shutdownRequested) {
        this.markWorkerAvailable(workerId);
        this.processQueue();
      }
    }
  }
};
var workerPool = WorkerPool.getInstance();

// src/runtime/BrowserTaskAdapter.ts
var BrowserTaskAdapter = class {
  workerScriptUrl;
  pendingRequests = /* @__PURE__ */ new Map();
  nextRequestId = 0;
  worker = null;
  constructor(options = {}) {
    this.pool = options.pool ?? WorkerPool.getInstance();
    this.registry = options.registry ?? new RuntimeTaskRegistry();
    this.workerScriptUrl = options.workerScriptUrl;
  }
  pool;
  registry;
  registerTask(taskName, handler) {
    this.registry.register(taskName, handler);
    void this.pool.registerTask(taskName, handler);
  }
  async runTask(taskName, payload, timeoutMs = 3e4) {
    if (this.registry.has(taskName)) {
      return this.pool.runTask(taskName, payload, timeoutMs);
    }
    if (typeof Worker !== "undefined" && this.workerScriptUrl) {
      return this.runTaskInWorker(
        taskName,
        payload,
        timeoutMs
      );
    }
    return this.pool.runTask(taskName, payload, timeoutMs);
  }
  get taskRegistry() {
    return this.registry;
  }
  terminate() {
    for (const pending of this.pendingRequests.values()) {
      clearTimeout(pending.timeoutId);
      pending.reject(new Error("Browser task adapter terminated"));
    }
    this.pendingRequests.clear();
    this.worker?.terminate();
    this.worker = null;
  }
  async runTaskInWorker(taskName, payload, timeoutMs) {
    const worker = this.ensureWorker();
    const requestId = `task-${this.nextRequestId++}`;
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error(`Task timed out: ${taskName}`));
      }, timeoutMs);
      this.pendingRequests.set(requestId, {
        resolve: (value) => resolve(value),
        reject,
        timeoutId
      });
      worker.postMessage({
        id: requestId,
        taskName,
        payload
      });
    });
  }
  ensureWorker() {
    if (this.worker) {
      return this.worker;
    }
    if (!this.workerScriptUrl) {
      throw new Error(
        "BrowserTaskAdapter requires workerScriptUrl for off-main-thread execution"
      );
    }
    this.worker = new Worker(this.workerScriptUrl, { type: "module" });
    this.worker.onmessage = (event) => {
      const response = event.data;
      const pending = this.pendingRequests.get(response.id);
      if (!pending) {
        return;
      }
      clearTimeout(pending.timeoutId);
      this.pendingRequests.delete(response.id);
      if (response.ok) {
        pending.resolve(response.result);
        return;
      }
      pending.reject(new Error(response.error ?? "Task failed"));
    };
    this.worker.onerror = (error) => {
      for (const pending of this.pendingRequests.values()) {
        clearTimeout(pending.timeoutId);
        pending.reject(error);
      }
      this.pendingRequests.clear();
      this.worker?.terminate();
      this.worker = null;
    };
    return this.worker;
  }
};
var browserTaskAdapter = new BrowserTaskAdapter();

// src/runtime/CanvasPool.ts
function createCanvasElement(width, height) {
  if (typeof document === "undefined") {
    throw new Error(
      "CanvasPool requires a DOM-like environment with document.createElement"
    );
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
var CanvasPool = class _CanvasPool {
  constructor(maxPoolSize = 5, maxCanvasesPerSize = 2, memoryLimit = 500 * 1024 * 1024) {
    this.maxPoolSize = maxPoolSize;
    this.maxCanvasesPerSize = maxCanvasesPerSize;
    this.memoryLimit = memoryLimit;
  }
  maxPoolSize;
  maxCanvasesPerSize;
  memoryLimit;
  static instance = null;
  pool = /* @__PURE__ */ new Map();
  usage = /* @__PURE__ */ new Map();
  metrics = /* @__PURE__ */ new Map();
  static getInstance() {
    if (!this.instance) {
      this.instance = new _CanvasPool();
    }
    return this.instance;
  }
  static destroyInstance() {
    this.instance = null;
  }
  getCanvas(width, height, _useFabric = false) {
    const key = this.getKey(width, height);
    const poolForSize = this.pool.get(key);
    if (poolForSize && poolForSize.length > 0) {
      this.incrementUsage(key);
      this.updateMetrics(key);
      return poolForSize.pop();
    }
    this.incrementUsage(key);
    this.updateMetrics(key);
    return createCanvasElement(width, height);
  }
  releaseCanvas(canvas) {
    const key = this.getKey(canvas.width, canvas.height);
    if (!this.shouldAddToPool(key)) {
      this.disposeCanvas(canvas);
      return;
    }
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    const poolForSize = this.pool.get(key) ?? [];
    poolForSize.push(canvas);
    this.pool.set(key, poolForSize);
    this.updateMetrics(key);
  }
  clear() {
    for (const canvases of this.pool.values()) {
      canvases.forEach((canvas) => this.disposeCanvas(canvas));
    }
    this.pool.clear();
    this.usage.clear();
    this.metrics.clear();
  }
  terminate() {
    this.clear();
  }
  getPoolSize() {
    return this.pool.size;
  }
  getUsageStats() {
    return this.usage;
  }
  getKey(width, height) {
    return `${width}x${height}`;
  }
  incrementUsage(key) {
    this.usage.set(key, (this.usage.get(key) ?? 0) + 1);
  }
  shouldAddToPool(key) {
    const currentSize = this.pool.get(key)?.length ?? 0;
    const totalCanvases = Array.from(this.pool.values()).reduce(
      (count, canvases) => count + canvases.length,
      0
    );
    return currentSize < this.maxCanvasesPerSize && totalCanvases < this.maxPoolSize && this.getCurrentMemoryUsage() < this.memoryLimit;
  }
  getCurrentMemoryUsage() {
    return Array.from(this.pool.entries()).reduce((total, [key, canvases]) => {
      const [width, height] = key.split("x").map(Number);
      return total + canvases.length * width * height * 4;
    }, 0);
  }
  updateMetrics(key) {
    const metric = this.metrics.get(key) ?? { usage: 0, lastUsed: 0 };
    metric.usage += 1;
    metric.lastUsed = Date.now();
    this.metrics.set(key, metric);
  }
  disposeCanvas(canvas) {
    canvas.width = 0;
    canvas.height = 0;
    canvas.remove();
  }
};
var canvasPool = CanvasPool.getInstance();

// src/managers/ProgressManager.ts
var ProgressDebouncer = class {
  // Minimum time between updates
  constructor(callback) {
    this.callback = callback;
  }
  callback;
  timeout = null;
  lastUpdate = 0;
  minInterval = 1e3;
  update(...args) {
    const now = performance.now();
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (now - this.lastUpdate > this.minInterval) {
      this.lastUpdate = now;
      this.callback(...args);
      return;
    }
    this.timeout = setTimeout(() => {
      this.lastUpdate = performance.now();
      this.callback(...args);
    }, this.minInterval);
  }
  cancel() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
};
var ProgressManager = class {
  phases = {};
  initialized = false;
  progressDebouncer;
  processingStartTime = 0;
  framesProcessed = 0;
  averageFrameTime = 0;
  totalFrames = 0;
  frameStartTime = 0;
  frameProcessingTimes = [];
  totalFramesCount = 0;
  processedFramesCount = 0;
  phaseStartTimes = /* @__PURE__ */ new Map();
  completedPhases = /* @__PURE__ */ new Set();
  significantOperations = /* @__PURE__ */ new Set(["processing", "encoding"]);
  constructor() {
    this.progressDebouncer = new ProgressDebouncer((data) => {
      window.dispatchEvent(
        new CustomEvent("gif-phase-update", { detail: data })
      );
    });
    if (!this.initialized) {
      this.initializePhases();
      this.initialized = true;
    }
  }
  initializePhases() {
    Object.entries(GIF_PHASES).forEach(([key, phase]) => {
      this.phases[phase.id] = {
        progress: 0,
        message: `${phase.name} reset`,
        operation: "processing",
        processed: 0,
        total: 0,
        status: "pending"
      };
    });
  }
  /**
   * 🚀 Tracks frame processing time and calculates progress/ETA dynamically.
   */
  trackFrameProcessing(frameIndex, totalFrames) {
    const now = performance.now();
    if (frameIndex === 0) {
      this.frameStartTime = now;
      this.frameProcessingTimes = [];
      this.totalFramesCount = totalFrames;
      this.processedFramesCount = 0;
      this.processingStartTime = now;
    }
    const frameTime = now - this.frameStartTime;
    this.frameProcessingTimes.push(frameTime);
    this.processedFramesCount++;
    const recentFrames = this.frameProcessingTimes.slice(-5);
    const avgTimePerFrame = recentFrames.reduce((a, b) => a + b, 0) / recentFrames.length;
    const remainingFrames = totalFrames - (frameIndex + 1);
    const estimatedRemainingTime = remainingFrames * avgTimePerFrame;
    this.frameStartTime = now;
    return {
      progress: Math.round((frameIndex + 1) / totalFrames * 100),
      estimatedRemainingTime,
      avgTimePerFrame,
      elapsedTime: now - this.processingStartTime
    };
  }
  /**
   * 📥 Tracks overall loading progress.
   */
  updateLoadingProgress(current, total, assetUrl) {
    const progress = Math.round(current / total * 100);
    this.updatePhase(
      GIF_PHASES.LOADING.id,
      progress,
      `Loading assets (${current}/${total}): ${assetUrl.split("/").pop()}`
    );
  }
  /**
   * ⏳ Calculates ETA dynamically.
   */
  calculateETA(currentFrame, totalFrames) {
    const now = performance.now();
    const elapsed = now - this.processingStartTime;
    if (currentFrame === 0) {
      this.processingStartTime = now;
      return "Calculating...";
    }
    this.framesProcessed = currentFrame;
    this.averageFrameTime = elapsed / currentFrame;
    const remainingFrames = totalFrames - currentFrame;
    const estimatedRemainingMs = remainingFrames * this.averageFrameTime;
    if (estimatedRemainingMs < 1e3) {
      return "Less than a second";
    }
    const seconds = Math.round(estimatedRemainingMs / 1e3);
    if (seconds < 60) {
      return `~${seconds} seconds`;
    }
    const minutes = Math.round(seconds / 60);
    return `~${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
  /**
   * 🔄 Resets all progress tracking data.
   */
  // Modify the reset method to be more selective
  resetProgress(phaseId) {
    if (phaseId) {
      const phase = GIF_PHASES[phaseId];
      if (phase) {
        this.phases[phase.id] = {
          progress: 0,
          message: `${phase.name} reset`,
          operation: "processing",
          processed: 0,
          total: 0,
          status: "pending"
        };
      }
    } else {
      const needsReset = Object.values(this.phases).some(
        (phase) => phase.progress !== 0 || phase.processed !== 0 || phase.total !== 0 || phase.status !== "pending"
      );
      if (needsReset) {
        this.initializePhases();
      }
    }
  }
  /**
   * 📊 Updates the progress of a specific GIF processing phase.
   */
  updatePhase(phaseId, progress, message, operation = "processing", assetName, totalItems, estimatedRemainingTime) {
    if (!this.significantOperations.has(operation)) {
      return;
    }
    const now = performance.now();
    if (!this.phaseStartTimes.has(phaseId)) {
      this.phaseStartTimes.set(phaseId, now);
    }
    const phaseElapsed = now - (this.phaseStartTimes.get(phaseId) || now);
    const phaseSpeed = this.processedFramesCount ? phaseElapsed / this.processedFramesCount : 0;
    const remainingInPhase = totalItems ? (totalItems - this.processedFramesCount) * phaseSpeed : 0;
    const phaseData = {
      phaseId,
      currentProgress: progress,
      message,
      operation,
      assetName,
      timestamp: now,
      totalItems,
      estimatedRemainingTime: estimatedRemainingTime || remainingInPhase,
      elapsedTime: phaseElapsed,
      speed: phaseSpeed,
      processed: this.processedFramesCount,
      total: totalItems || this.totalFramesCount,
      isCompleted: progress >= 100
    };
    this.progressDebouncer.update(phaseData);
    if (progress >= 100) {
      this.completedPhases.add(phaseId);
    }
    Object.values(GIF_PHASES).forEach((phase) => {
      if (phase.id !== phaseId && !this.completedPhases.has(phase.id)) {
        const isEarlierPhase = Object.values(GIF_PHASES).indexOf(phase) < Object.values(GIF_PHASES).findIndex((p) => p.id === phaseId);
        if (isEarlierPhase) {
          this.completedPhases.add(phase.id);
          window.dispatchEvent(
            new CustomEvent("gif-phase-update", {
              detail: {
                phaseId: phase.id,
                currentProgress: 100,
                message: `${phase.name} complete`,
                timestamp: now
              }
            })
          );
        }
      }
    });
    console.debug(`[GIF Phase Update] ${phaseId}:`, {
      progress,
      message,
      operation,
      processed: this.processedFramesCount,
      total: this.totalFramesCount,
      avgTime: Math.round(phaseData.speed)
    });
  }
  destroy() {
    this.progressDebouncer.cancel();
  }
};
var ProgressManager_default = ProgressManager;

// src/trackers/BaseProgressTracker.ts
var BaseProgressTracker = class {
  phases = {};
  phaseOrder = [];
  startTime = 0;
  phaseStartTimes = {};
  currentPhase = "";
  constructor(phases, phaseOrder) {
    this.phases = { ...phases };
    this.phaseOrder = phaseOrder;
  }
  emitProgress(detail) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("progress-update", { detail }));
    }
  }
  calculateTotalProgress() {
    let totalProgress = 0;
    let activePhaseFound = false;
    for (const phaseId of this.phaseOrder) {
      const phase = this.phases[phaseId];
      if (phase.status === "completed") {
        totalProgress += phase.weight;
      } else if (phase.status === "active" && !activePhaseFound) {
        totalProgress += (phase.progress ?? 0) * phase.weight / 100;
        activePhaseFound = true;
      }
      if (activePhaseFound) break;
    }
    const totalWeight = this.phaseOrder.reduce((sum, id) => sum + this.phases[id].weight, 0);
    return totalWeight > 0 ? Math.round(totalProgress / totalWeight * 100) : 0;
  }
  startTracking() {
    this.startTime = Date.now();
    this.reset();
  }
  updatePhaseProgress(phaseId, progress, message) {
    const phase = this.phases[phaseId];
    if (phase) {
      phase.progress = progress;
      phase.message = message || "";
      this.emitProgress({
        phase: phaseId,
        phaseProgress: progress,
        totalProgress: this.getTotalProgress(),
        currentPhase: this.currentPhase,
        status: phase.status,
        timestamp: Date.now(),
        elapsedTime: this.getElapsedTime()
      });
    }
  }
  reset() {
    this.startTime = 0;
    this.phaseStartTimes = {};
    this.currentPhase = this.phaseOrder[0];
    Object.values(this.phases).forEach((phase) => {
      phase.progress = 0;
      phase.status = void 0;
      phase.message = "";
      phase.startTime = void 0;
      phase.eta = void 0;
      phase.processedItems = void 0;
      phase.totalItems = void 0;
      phase.averageTimePerItem = void 0;
    });
  }
  getPhaseInfo(phaseId) {
    return this.phases[phaseId];
  }
  getAllPhases() {
    return Object.values(this.phases);
  }
  getCurrentPhase() {
    return this.phases[this.currentPhase];
  }
  getTotalProgress() {
    return this.calculateTotalProgress();
  }
  getElapsedTime() {
    return this.startTime ? Date.now() - this.startTime : 0;
  }
};

// src/trackers/GIFProgressTracker.ts
var GIF_PHASES = {
  LOADING: {
    id: "loading",
    name: "Loading Assets",
    weight: 5,
    color: "bg-blue-600"
  },
  CREATE_STATIC: {
    id: "create_static",
    name: "Creating Static Layer",
    weight: 5,
    color: "bg-teal-600"
  },
  EXTRACTING: {
    id: "extracting",
    name: "Extracting Frames",
    weight: 15,
    color: "bg-purple-600"
  },
  PROCESSING: {
    id: "processing",
    name: "Processing Frames",
    weight: 25,
    color: "bg-yellow-600"
  },
  ENCODING: {
    id: "encoding",
    name: "Encoding GIF",
    weight: 50,
    color: "bg-green-600"
  }
};
var GIF_PHASE_ORDER = [
  "loading",
  "create_static",
  "extracting",
  "processing",
  "encoding"
];
var GIFProgressTracker = class extends BaseProgressTracker {
  encodingStartTime = 0;
  frameCount = 0;
  processedFrames = 0;
  completedPhases = /* @__PURE__ */ new Set();
  phaseTimings = /* @__PURE__ */ new Map();
  progressDebouncer;
  constructor() {
    super(GIF_PHASES, GIF_PHASE_ORDER);
    this.startTime = Date.now();
    this.progressDebouncer = new ProgressDebouncer((data) => {
      this.emitProgress(data);
    });
  }
  updateProgress(phase, progress, details, totalItems, processedItems, estimatedRemainingTime) {
    const now = Date.now();
    if (!this.phases[phase]) {
      console.error(`Invalid phase: ${phase}`);
      return;
    }
    if (!this.phaseTimings.has(phase)) {
      this.phaseTimings.set(phase, { start: now });
    }
    if (phase !== this.currentPhase) {
      if (this.currentPhase) {
        const prevTiming = this.phaseTimings.get(this.currentPhase);
        if (prevTiming) {
          prevTiming.end = now;
          this.phaseTimings.set(this.currentPhase, prevTiming);
        }
      }
      this.currentPhase = phase;
    }
    const currentPhase = this.phases[phase];
    if (!currentPhase) return;
    currentPhase.status = "active";
    currentPhase.progress = Math.min(100, Math.max(0, progress));
    currentPhase.message = details || currentPhase.message;
    currentPhase.startTime = this.phaseTimings.get(phase)?.start;
    currentPhase.totalItems = totalItems;
    currentPhase.processedItems = processedItems;
    if (phase === "encoding") {
      this.handleEncodingPhase(progress, now, totalItems, processedItems);
    }
    const phaseElapsed = this.calculatePhaseElapsed(phase, now);
    const totalElapsed = now - this.startTime;
    const processingSpeed = this.calculateProcessingSpeed(
      phase,
      processedItems,
      phaseElapsed
    );
    const eta = this.calculateEta(
      phase,
      processedItems,
      totalItems,
      phaseElapsed
    );
    this.progressDebouncer.update({
      phase,
      phaseProgress: progress,
      totalProgress: this.calculateTotalProgress(),
      message: currentPhase.message,
      currentPhase: currentPhase.name,
      status: currentPhase.status,
      timestamp: now,
      totalItems,
      processedItems,
      estimatedRemainingTime: eta,
      elapsedTime: totalElapsed,
      isActive: true,
      processingSpeed
    });
    if (progress >= 100) {
      this.completePhase(phase, now).then(() => {
        this.updateProgress(
          phase,
          0,
          details,
          totalItems,
          processedItems,
          estimatedRemainingTime
        );
      });
    }
  }
  handleEncodingPhase(progress, now, totalItems, processedItems) {
    if (!this.encodingStartTime) {
      this.encodingStartTime = now;
      this.frameCount = totalItems || 0;
    }
    this.processedFrames = processedItems || 0;
  }
  calculatePhaseElapsed(phase, now) {
    const timing = this.phaseTimings.get(phase);
    if (!timing) return 0;
    return now - timing.start;
  }
  calculateProcessingSpeed(phase, processedItems, elapsed) {
    if (!processedItems || !elapsed) return "";
    const itemsPerSecond = processedItems / elapsed * 1e3;
    return phase === "encoding" ? `${itemsPerSecond.toFixed(1)} fps` : `${itemsPerSecond.toFixed(1)}/s`;
  }
  calculateEta(phase, processed, total, elapsed) {
    if (!processed || !total || !elapsed) return 0;
    const itemsPerMs = processed / elapsed;
    const remaining = total - processed;
    return remaining / itemsPerMs;
  }
  async completePhase(phaseId, timestamp = Date.now()) {
    const phase = this.phases[phaseId];
    if (!phase) return;
    const timing = this.phaseTimings.get(phaseId);
    if (timing) {
      timing.end = timestamp;
      this.phaseTimings.set(phaseId, timing);
    }
    phase.status = "completed";
    phase.progress = 100;
    phase.endTime = timestamp;
    phase.duration = timing ? timing.end - timing.start : 0;
    this.completedPhases.add(phaseId);
    const nextPhaseIndex = this.phaseOrder.indexOf(phaseId) + 1;
    if (nextPhaseIndex < this.phaseOrder.length) {
      const nextPhaseId = this.phaseOrder[nextPhaseIndex];
      this.phaseTimings.set(nextPhaseId, { start: timestamp });
    }
  }
  getTotalElapsedTime() {
    return Date.now() - this.startTime;
  }
  reset() {
    super.reset();
    this.startTime = Date.now();
    this.encodingStartTime = 0;
    this.frameCount = 0;
    this.processedFrames = 0;
    this.completedPhases.clear();
    this.phaseTimings.clear();
  }
  destroy() {
    this.progressDebouncer.cancel();
  }
};

// src/managers/ImageManager.ts
var ImageManager = class _ImageManager {
  static instance = null;
  progManager;
  workerPool;
  memoryUsage;
  completedPhases;
  canvasPool;
  constructor(progManager, workerPool2, canvasPool2) {
    this.progManager = progManager;
    this.workerPool = workerPool2;
    this.canvasPool = canvasPool2;
    this.completedPhases = /* @__PURE__ */ new Set();
  }
  static getInstance(progManager, workerPool2, canvasPool2) {
    if (!this.instance) {
      this.instance = new _ImageManager(progManager, workerPool2, canvasPool2);
    }
    return this.instance;
  }
  static destroyInstance() {
    this.instance = null;
  }
  async loadAndCreateStaticImage(bglessUrl, overlays) {
    try {
      this.progManager.updatePhase(
        GIF_PHASES.CREATE_STATIC.id,
        0,
        "Loading background image...",
        "processing",
        bglessUrl
      );
      const bglessImage = await this.loadImage(bglessUrl);
      this.progManager.updatePhase(
        GIF_PHASES.CREATE_STATIC.id,
        20,
        "Background loaded"
      );
      const canvas = document.createElement("canvas");
      canvas.width = CONSTANTS.TARGET_SIZE;
      canvas.height = CONSTANTS.TARGET_SIZE;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Failed to get canvas context");
      const scale = Math.min(
        CONSTANTS.TARGET_SIZE / CONSTANTS.NFT_SIZE,
        CONSTANTS.TARGET_SIZE / CONSTANTS.NFT_SIZE
      );
      const scaledWidth = Math.round(CONSTANTS.NFT_SIZE * scale);
      const scaledHeight = Math.round(CONSTANTS.NFT_SIZE * scale);
      const x = this.calculateCenteredPosition(
        CONSTANTS.TARGET_SIZE,
        scaledWidth
      );
      const y = this.calculateCenteredPosition(
        CONSTANTS.TARGET_SIZE,
        scaledHeight
      );
      ctx.drawImage(bglessImage, x, y, scaledWidth, scaledHeight);
      if (overlays?.length) {
        for (let i = 0; i < overlays.length; i++) {
          const overlay = overlays[i];
          this.progManager.updatePhase(
            GIF_PHASES.CREATE_STATIC.id,
            20 + Math.round((i + 1) / overlays.length * 80),
            `Loading overlay ${i + 1}/${overlays.length}`,
            "processing",
            overlay.name
          );
          const overlayImage = await this.loadImage(overlay.url);
          ctx.drawImage(overlayImage, x, y, scaledWidth, scaledHeight);
        }
      }
      this.progManager.updatePhase(
        GIF_PHASES.CREATE_STATIC.id,
        100,
        "Static layer complete"
      );
      return canvas;
    } catch (error) {
      console.error("Error creating static image:", error);
      throw error;
    }
  }
  getCacheKey(gifUrl) {
    return gifUrl;
  }
  optimizeGifFrame(frame, enhanceColors = false) {
    const optimizedCanvas = document.createElement("canvas");
    optimizedCanvas.width = CONSTANTS.TARGET_SIZE;
    optimizedCanvas.height = CONSTANTS.TARGET_SIZE;
    const ctx = optimizedCanvas.getContext("2d", {
      willReadFrequently: true,
      alpha: true
    });
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.globalCompositeOperation = "copy";
      ctx.drawImage(frame, 0, 0, optimizedCanvas.width, optimizedCanvas.height);
    }
    return optimizedCanvas;
  }
  async logBatchProgress(startIndex, currentBatchSize, totalFrames) {
    const batchStart = startIndex;
    const batchEnd = Math.min(startIndex + currentBatchSize, totalFrames);
    const stats = this.workerPool.stats;
    console.debug(`[BatchProcessor] Progress:
        Batch: ${Math.floor(startIndex / currentBatchSize) + 1}/${Math.ceil(totalFrames / currentBatchSize)}
        Workers: ${stats.activeWorkers}/${stats.maxWorkers} (${stats.availableWorkers} available)
        Memory: ${Math.round(this.memoryUsage.usedJSHeapSize / (1024 * 1024))}MB
        Frames: ${batchStart + 1}-${batchEnd}/${totalFrames}
      `);
    if (batchEnd === totalFrames) {
      this.progManager.updatePhase(
        GIF_PHASES.PROCESSING.id,
        100,
        "Frame processing complete"
      );
    }
  }
  loadedAssetCount = 0;
  loadWithProgress = async (src, totalAssets) => {
    try {
      const img = await this.loadImage(src);
      this.loadedAssetCount++;
      const progress = Math.round(this.loadedAssetCount / totalAssets * 100);
      this.progManager.updatePhase(
        GIF_PHASES.LOADING.id,
        progress,
        `Loading asset ${this.loadedAssetCount}/${totalAssets}: ${src}`
      );
      return img;
    } catch (error) {
      console.error("Asset loading failed:", error);
      throw error;
    } finally {
      if (this.loadedAssetCount === totalAssets) {
        this.loadedAssetCount = 0;
      }
    }
  };
  async loadAsset(img) {
    const totalAssets = img.length || 0;
    const assets = await Promise.all(
      img?.map(
        async (overlay) => await this.loadWithProgress(overlay.url, totalAssets)
      ) || []
    );
    return assets;
  }
  async loadAssets(bglessUrl, overlays) {
    const totalAssets = (overlays?.length || 0) + 1;
    let loadedCount = 0;
    try {
      this.progManager.updatePhase(
        GIF_PHASES.LOADING.id,
        0,
        "Starting asset load..."
      );
      const bglessImage = await this.loadImage(bglessUrl);
      loadedCount++;
      const baseProgress = loadedCount / totalAssets * 100;
      this.progManager.updatePhase(
        GIF_PHASES.LOADING.id,
        baseProgress,
        "Base image loaded",
        "processing",
        bglessUrl
      );
      if (!overlays?.length) {
        this.progManager.updatePhase(
          GIF_PHASES.LOADING.id,
          100,
          "Assets loaded"
        );
        this.completedPhases.add(GIF_PHASES.LOADING.id);
        return { bglessImage, overlayImages: [] };
      }
      const overlayImages2 = await Promise.all(
        overlays.map(async (overlay, index) => {
          const img = await this.loadImage(overlay.url);
          loadedCount++;
          const progress = loadedCount / totalAssets * 100;
          this.progManager.updatePhase(
            GIF_PHASES.LOADING.id,
            progress,
            `Loading OverlayAsset ${index + 1}/${overlays.length}`,
            "processing",
            overlay.name
          );
          return img;
        })
      );
      this.progManager.updatePhase(
        GIF_PHASES.LOADING.id,
        100,
        "All assets loaded"
      );
      this.completedPhases.add(GIF_PHASES.LOADING.id);
      return { bglessImage, overlayImages: overlayImages2 };
    } catch (error) {
      console.error("Asset loading failed:", error);
      this.completedPhases.delete(GIF_PHASES.LOADING.id);
      throw error;
    }
  }
  async loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (error) => {
        console.error(`Failed to load image: ${src}`, error);
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });
  }
  calculateCenteredPosition(containerSize, imageSize) {
    return Math.floor((containerSize - imageSize) / 2);
  }
  drawOverlay(ctx, overlayImage, position, size) {
    const { x, y } = position;
    if (size) {
      const { width, height } = size;
      ctx.drawImage(overlayImage, x, y, width, height);
    } else {
      ctx.drawImage(overlayImage, x, y);
    }
  }
  loadStaticImage = async (bglessUrl, overlays) => {
    const metricsKey = `static-image-${Date.now()}`;
    try {
      if (!overlays) {
        this.progManager.updatePhase(
          GIF_PHASES.LOADING.id,
          0,
          "Loading base image..."
        );
        const bglessImage2 = await this.loadImage(bglessUrl);
        this.progManager.updatePhase(
          GIF_PHASES.LOADING.id,
          100,
          "Base image loaded"
        );
        return this.createStaticImage(bglessImage2);
      }
      const totalAssets = overlays.length + 1;
      this.progManager.updatePhase(
        GIF_PHASES.LOADING.id,
        0,
        "Loading assets..."
      );
      const bglessImage = await this.loadImage(bglessUrl);
      this.progManager.updatePhase(
        GIF_PHASES.LOADING.id,
        1 / totalAssets * 100,
        "Base image loaded"
      );
      const overlayImages2 = await Promise.all(
        overlays.map(async (overlay, index) => {
          const img = await this.loadImage(overlay.url);
          const progress = (index + 2) / totalAssets * 100;
          this.progManager.updatePhase(
            GIF_PHASES.LOADING.id,
            progress,
            `Loading overlay ${index + 1}/${overlays.length}`
          );
          return img;
        })
      );
      this.progManager.updatePhase(
        GIF_PHASES.LOADING.id,
        100,
        "All assets loaded"
      );
      return this.createStaticImage(bglessImage, overlayImages2);
    } catch (error) {
      console.error("Failed to load static image:", error);
      throw error;
    }
  };
  async createStaticImage(bglessImage, overlayImages2) {
    if (!bglessImage) {
      throw new Error("No images provided for creating a static image.");
    }
    if (!overlayImages2?.length) {
      const canvas = this.canvasPool.getCanvas(
        bglessImage.width,
        bglessImage.height,
        false
      );
      const ctx2 = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx2) {
        throw new Error("Failed to get canvas context for static image.");
      }
      ctx2.drawImage(bglessImage, 0, 0, bglessImage.width, bglessImage.height);
      return canvas;
    }
    const canvasWidth = bglessImage?.width || CONSTANTS.MAX_CANVAS_SIZE;
    const canvasHeight = bglessImage?.height || CONSTANTS.MAX_CANVAS_SIZE;
    const staticCanvas = this.canvasPool.getCanvas(
      canvasWidth,
      canvasHeight,
      false
    );
    const ctx = staticCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      throw new Error("Failed to get canvas context for static image.");
    }
    staticCanvas.width = canvasWidth;
    staticCanvas.height = canvasHeight;
    const loadedOverlays = await Promise.all(
      overlayImages2.map(async (overlay) => ({
        ...overlay,
        image: await this.loadImage(overlay.src).catch((err) => {
          console.error(`Failed to load overlay image: ${overlay.src}`, err);
          return null;
        })
      }))
    );
    await this.workerPool.addTask(async () => {
      if (bglessImage) {
        ctx.drawImage(bglessImage, 0, 0, canvasWidth, canvasHeight);
      }
      for (const overlay of loadedOverlays) {
        if (overlay.image) {
          this.drawOverlay(
            ctx,
            overlay.image,
            { x: overlay.x, y: overlay.y },
            overlay.width ? { width: overlay.width, height: overlay.height ?? canvasHeight } : void 0
          );
        }
      }
    });
    return staticCanvas;
  }
};
var imageManager = ImageManager.getInstance(
  new ProgressManager_default(),
  WorkerPool.getInstance(),
  CanvasPool.getInstance()
);

// src/managers/WorkerManager.ts
var PROCESS_FRAME_TASK = "gif.process-frame";
var ENCODE_GIF_TASK = "gif.encode";
var WorkerManager = class _WorkerManager {
  static instance = null;
  workerPool;
  isInitialized = false;
  activeWorkers = /* @__PURE__ */ new Set();
  constructor(workerPool2) {
    this.workerPool = workerPool2;
  }
  static getInstance(workerPool2) {
    if (!this.instance) {
      this.instance = new _WorkerManager(workerPool2);
    }
    return this.instance;
  }
  static destroyInstance() {
    this.instance?.cleanup();
    this.instance = null;
  }
  async initialize() {
    if (this.isInitialized) return;
    await this.workerPool.initialize();
    await this.registerWorkerTasks();
    this.isInitialized = true;
  }
  async processFrameInWorker(frame) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.workerPool.runTask(PROCESS_FRAME_TASK, frame, 3e4);
  }
  cleanupWorker(worker) {
    this.activeWorkers.delete(worker);
    worker.terminate();
  }
  async cleanup() {
    this.activeWorkers.forEach((worker) => {
      worker.terminate();
    });
    this.activeWorkers.clear();
    this.isInitialized = false;
  }
  handleWorkerMessage(workerId, e) {
    const task = this.workerPool.executingTasks.get(workerId);
    if (!task) return;
    clearTimeout(task.timeoutId);
    this.workerPool.executingTasks.delete(workerId);
    this.workerPool.markWorkerAvailable(workerId);
    if (e.data.type === "success") {
      task.resolve(e.data.result);
    } else if (e.data.type === "error") {
      task.reject(new Error(e.data.error));
    }
  }
  async encodeGIFInWorker(frames) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.workerPool.runTask(ENCODE_GIF_TASK, frames, 3e4);
  }
  async registerWorkerTasks() {
    if (!this.workerPool.hasTask(PROCESS_FRAME_TASK)) {
      await this.workerPool.registerTask(
        PROCESS_FRAME_TASK,
        async (frame) => {
          return this.dispatchToBrowserWorker({
            type: "processFrame",
            frame
          });
        }
      );
    }
    if (!this.workerPool.hasTask(ENCODE_GIF_TASK)) {
      await this.workerPool.registerTask(
        ENCODE_GIF_TASK,
        async (frames) => {
          return this.dispatchToBrowserWorker(frames);
        }
      );
    }
  }
  async dispatchToBrowserWorker(payload) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(CONSTANTS.WORKER_PATH);
      this.activeWorkers.add(worker);
      worker.onmessage = (event) => {
        resolve(event.data);
        this.cleanupWorker(worker);
      };
      worker.onerror = (error) => {
        reject(error);
        this.cleanupWorker(worker);
      };
      worker.postMessage(payload);
    });
  }
};

// src/managers/MemoryManager.ts
var MemoryManager = class _MemoryManager {
  static instance = null;
  static sessionId;
  resources = /* @__PURE__ */ new Set();
  cache;
  static activeMetrics = /* @__PURE__ */ new Map();
  static processingDelay = 10;
  qualityOptions;
  workerCount;
  progTracker;
  workerPool;
  currentMemoryStrategy;
  completedPhases = /* @__PURE__ */ new Set();
  isProcessing;
  processingStartTime = 0;
  framesProcessed = 0;
  averageFrameTime = 0;
  totalFrames = 0;
  frameStartTime = 0;
  frameProcessingTimes = [];
  totalFramesCount = 0;
  processedFramesCount = 0;
  processedFramesCache;
  abort;
  gifWorkerPool;
  constructor(sessionId, progTracker, poolSize, workerPool2, gifWorkerPool, qualityOptions, workerCount) {
    _MemoryManager.sessionId = sessionId;
    this.progTracker = progTracker;
    this.workerCount = workerCount;
    this.cache = /* @__PURE__ */ new Map();
    this.currentMemoryStrategy = this.MEMORY_STRATEGIES.MEDIUM;
    this.qualityOptions = qualityOptions;
    this.workerPool = workerPool2;
    this.gifWorkerPool = gifWorkerPool;
    this.processedFramesCache = /* @__PURE__ */ new Map();
    this.isProcessing = false;
    this.abort = new AbortController();
  }
  static getInstance(sessionId, progTracker, poolSize, workerPool2, gifWorkerPool, qualityOptions, workerCount) {
    if (!this.instance) {
      this.instance = new _MemoryManager(
        sessionId,
        progTracker,
        poolSize,
        workerPool2,
        gifWorkerPool,
        qualityOptions,
        workerCount
      );
    }
    return this.instance;
  }
  static destroyInstance() {
    this.instance = null;
  }
  // Add to class properties
  MEMORY_STRATEGIES = {
    LOW: {
      maxMemoryUsage: 512 * 1024 * 1024,
      // 512MB
      batchSize: 3,
      workerCount: 2,
      cleanupThreshold: 0.7
    },
    MEDIUM: {
      maxMemoryUsage: 1024 * 1024 * 1024,
      // 1GB
      batchSize: 5,
      workerCount: 4,
      cleanupThreshold: 0.8
    },
    HIGH: {
      maxMemoryUsage: 2048 * 1024 * 1024,
      // 2GB
      batchSize: 8,
      workerCount: 6,
      cleanupThreshold: 0.9
    }
  };
  registerResource(cleanup) {
    const resource = { cleanup };
    this.resources.add(resource);
    return () => {
      resource.cleanup();
      this.resources.delete(resource);
    };
  }
  get(key) {
    return this.cache.get(key);
  }
  set(key, value) {
    this.cache.set(key, value);
  }
  clear() {
    this.cache.clear();
  }
  setProcessingDelay(delay) {
    _MemoryManager.processingDelay = delay;
  }
  // Add public method to set quality options
  setQualityOptions(options) {
    this.qualityOptions = {
      ...this.qualityOptions,
      ...options
    };
    console.debug("Quality options updated:", this.qualityOptions);
  }
  // Add these new methods
  async handleMemoryPressure(usage) {
    const totalMemory = performance?.memory?.jsHeapSizeLimit || 2048 * 1024 * 1024;
    const usageRatio = usage / totalMemory;
    if (usageRatio > this.currentMemoryStrategy.cleanupThreshold) {
      if (usageRatio > 0.9) {
        this.currentMemoryStrategy = this.MEMORY_STRATEGIES.LOW;
        this.workerCount = this.currentMemoryStrategy.workerCount;
      }
    }
  }
  async cleanup() {
    this.resources.forEach((resource) => resource.cleanup());
    this.resources.clear();
    this.isProcessing = false;
    this.abort.abort();
    this.abort = new AbortController();
    this.clear();
    this.clearCache();
    this.completedPhases.clear();
    this.progTracker.reset();
  }
  validateInput(frames, bglessUrl, overlays) {
    if (!frames?.length) throw new Error("No frames provided");
    if (!bglessUrl) throw new Error("No background image URL provided");
    if (overlays !== void 0 && !Array.isArray(overlays)) {
      throw new Error("Invalid overlays format");
    }
  }
  async cancel() {
    this.abort.abort();
    await this.cleanup();
    this.abort = new AbortController();
  }
  async clearCache() {
    this.processedFramesCache.clear();
  }
};
var MemoryManager_default = MemoryManager;

// ../../node_modules/.pnpm/nanoid@3.3.11/node_modules/nanoid/index.js
var import_crypto = __toESM(require("crypto"), 1);

// ../../node_modules/.pnpm/nanoid@3.3.11/node_modules/nanoid/url-alphabet/index.js
var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

// ../../node_modules/.pnpm/nanoid@3.3.11/node_modules/nanoid/index.js
var POOL_SIZE_MULTIPLIER = 128;
var pool;
var poolOffset;
var fillPool = (bytes) => {
  if (!pool || pool.length < bytes) {
    pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
    import_crypto.default.randomFillSync(pool);
    poolOffset = 0;
  } else if (poolOffset + bytes > pool.length) {
    import_crypto.default.randomFillSync(pool);
    poolOffset = 0;
  }
  poolOffset += bytes;
};
var nanoid = (size = 21) => {
  fillPool(size |= 0);
  let id = "";
  for (let i = poolOffset - size; i < poolOffset; i++) {
    id += urlAlphabet[pool[i] & 63];
  }
  return id;
};

// src/managers/SessionManager.ts
var SessionManager = class _SessionManager {
  static instance = null;
  activeSessions = /* @__PURE__ */ new Map();
  static getInstance() {
    if (!this.instance) {
      this.instance = new _SessionManager();
    }
    return this.instance;
  }
  static destroyInstance() {
    this.instance = null;
  }
  createSession() {
    const sessionId = nanoid();
    this.activeSessions.set(sessionId, Date.now());
    return sessionId;
  }
  endSession(sessionId) {
    if (this.isValidSession(sessionId)) {
      this.activeSessions.delete(sessionId);
    }
  }
  isValidSession(sessionId) {
    return this.activeSessions.has(sessionId);
  }
  cleanup() {
    this.activeSessions.forEach((_, sessionId) => {
      this.endSession(sessionId);
    });
    this.activeSessions.clear();
  }
};
var sessionManager = SessionManager.getInstance();

// src/services/ImageProcessingServicev1.ts
var ImageProcessingService = class _ImageProcessingService {
  static instance = null;
  workerCount;
  pixelArtHandler;
  gifAnalyzer;
  constructor(workerCount, pixelArtHandler2, gifAnalyzer2) {
    this.workerCount = workerCount;
    this.pixelArtHandler = pixelArtHandler2;
    this.gifAnalyzer = gifAnalyzer2;
  }
  static getInstance(workerCount, pixelArtHandler2, gifAnalyzer2) {
    if (!this.instance) {
      this.instance = new _ImageProcessingService(
        workerCount,
        pixelArtHandler2,
        gifAnalyzer2
      );
    }
    return this.instance;
  }
  destroyInstance() {
    _ImageProcessingService.instance = null;
  }
  normalizePatchForImageData(patch) {
    if (patch.buffer instanceof ArrayBuffer) {
      return patch;
    }
    return new Uint8ClampedArray(patch);
  }
  /**
   * Enhances the color table based on quality and enhancement settings.
   * @param colorTable - The original color table.
   * @param enhanceColors - Whether to enhance colors.
   * @param quality - The quality preset (e.g., 'LOW', 'MEDIUM', 'HIGH', 'FIRE').
   * @returns The enhanced color table.
   */
  enhanceColorTable(colorTable, enhanceColors, quality) {
    const settings = QUALITY_PRESETS[quality];
    return colorTable.map((color) => {
      const [r, g, b] = color;
      if (quality === "FIRE" && enhanceColors && r > g && r > b) {
        return [Math.min(255, r * 1.2), g * 0.9, b * 0.8];
      }
      if (enhanceColors) {
        const factor = settings.colors / 256;
        return [
          Math.min(255, r * factor),
          Math.min(255, g * factor),
          Math.min(255, b * factor)
        ];
      }
      return [r, g, b];
    });
  }
  async createImgBitmap(frames, staticImage) {
    const isPixelArt = await this.gifAnalyzer.detectPixelArtInAllFrames(frames);
    if (isPixelArt) {
      const frameAnalysis = this.gifAnalyzer.analyzeGIFFrameDimensions(frames);
      frames = frames.map(
        (frame, i) => this.pixelArtHandler.processPixelArtFrame(frame, frameAnalysis, i)
      );
    }
    const bufferCanvas = document.createElement("canvas");
    bufferCanvas.width = CONSTANTS.TARGET_SIZE;
    bufferCanvas.height = CONSTANTS.TARGET_SIZE;
    const bufferCtx = bufferCanvas.getContext("2d", {
      alpha: true,
      willReadFrequently: true
    });
    if (!bufferCtx) throw new Error("Failed to get buffer context");
    return Promise.all(
      frames.map(async (frame, index) => {
        const { width, height, left, top } = frame.dims;
        const frameCanvas = document.createElement("canvas");
        frameCanvas.width = width;
        frameCanvas.height = height;
        const frameCtx = frameCanvas.getContext("2d", {
          alpha: true,
          willReadFrequently: true
        });
        if (!frameCtx) throw new Error("Failed to get frame context");
        frameCtx.putImageData(
          new ImageData(
            this.normalizePatchForImageData(frame.patch),
            width,
            height
          ),
          0,
          0
        );
        const compositeCanvas = document.createElement("canvas");
        compositeCanvas.width = CONSTANTS.TARGET_SIZE;
        compositeCanvas.height = CONSTANTS.TARGET_SIZE;
        const compositeCtx = compositeCanvas.getContext("2d", {
          alpha: true,
          willReadFrequently: true
        });
        if (!compositeCtx) throw new Error("Failed to get composite context");
        if (frame.disposalType === 2) {
          compositeCtx.clearRect(
            0,
            0,
            compositeCanvas.width,
            compositeCanvas.height
          );
        } else {
          compositeCtx.drawImage(bufferCanvas, 0, 0);
        }
        if (isPixelArt) {
          compositeCtx.imageSmoothingEnabled = false;
          compositeCtx.drawImage(frameCanvas, left, top, width, height);
        } else {
          compositeCtx.imageSmoothingEnabled = true;
          compositeCtx.imageSmoothingQuality = "high";
          compositeCtx.drawImage(frameCanvas, left, top, width, height);
        }
        if (staticImage) {
          compositeCtx.globalCompositeOperation = "source-over";
          compositeCtx.drawImage(
            staticImage,
            0,
            0,
            CONSTANTS.TARGET_SIZE,
            CONSTANTS.TARGET_SIZE
          );
        }
        bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
        bufferCtx.drawImage(compositeCanvas, 0, 0);
        try {
          return {
            bitmap: await createImageBitmap(compositeCanvas),
            originalFrame: {
              ...frame,
              delay: frame.delay,
              dims: {
                width: CONSTANTS.TARGET_SIZE,
                height: CONSTANTS.TARGET_SIZE,
                top: 0,
                left: 0
              }
            }
          };
        } finally {
          frameCanvas.remove();
          compositeCanvas.remove();
        }
      })
    );
  }
  createCanvas(width, height) {
    if (typeof OffscreenCanvas !== "undefined") {
      return new OffscreenCanvas(width, height);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  getCanvasContext(canvas) {
    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
      alpha: true
    });
    if (!ctx) throw new Error("Failed to get canvas context");
    return ctx;
  }
  scaleFramePatch(frame, ctx) {
    const tempCanvas = this.createCanvas(frame.dims.width, frame.dims.height);
    const tempCtx = this.getCanvasContext(tempCanvas);
    const imageData = new ImageData(
      this.normalizePatchForImageData(frame.patch),
      frame.dims.width,
      frame.dims.height
    );
    tempCtx.putImageData(imageData, 0, 0);
    ctx.drawImage(
      tempCanvas,
      0,
      0,
      CONSTANTS.TARGET_SIZE,
      CONSTANTS.TARGET_SIZE
    );
    if (tempCanvas instanceof OffscreenCanvas) {
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = tempCanvas.width;
      finalCanvas.height = tempCanvas.height;
      const finalCtx = finalCanvas.getContext("2d", {
        willReadFrequently: true
      });
      if (finalCtx) {
        finalCtx.drawImage(tempCanvas, 0, 0);
        return finalCanvas;
      }
    }
    return tempCanvas;
  }
  overlayStaticImage(ctx, staticImage) {
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(
      staticImage,
      0,
      0,
      CONSTANTS.TARGET_SIZE,
      CONSTANTS.TARGET_SIZE
    );
  }
  /**
   * Pre-optimizes a GIF frame by enhancing its color table and updating its patch.
   * @param frame - The parsed GIF frame to optimize.
   * @param enhanceColors - Whether to enhance colors.
   * @param quality - The quality preset (e.g., 'LOW', 'MEDIUM', 'HIGH', 'FIRE').
   * @returns The optimized frame.
   */
  async preOptimizeGifFrame(frame, enhanceColors = false, quality = "HIGH") {
    const metrics = PixelArtHandler.prototype.analyzePixelArtFrame(frame);
    if (metrics.isPixelArt) {
      return {
        ...frame,
        patch: frame.patch,
        // Keep original patch data
        disposalType: metrics.disposalType,
        delay: frame.delay
      };
    }
    const settings = { ...QUALITY_PRESETS[quality] };
    if (metrics.hasTransparency) {
      settings.preserveAlpha = true;
      settings.alphaThreshold = metrics.needsDisposal ? 220 : 128;
      settings.disposalMethod = metrics.needsDisposal ? 2 : 1;
    }
    const optimizedPatch = await this.optimizePatch(
      frame.patch,
      frame.transparentIndex,
      quality,
      metrics
    );
    if (!enhanceColors || !frame.colorTable) {
      return { ...frame, patch: optimizedPatch };
    }
    const enhancedColorTable = this.enhanceColorTable(
      frame.colorTable,
      enhanceColors,
      quality
    );
    return {
      ...frame,
      colorTable: enhancedColorTable,
      patch: optimizedPatch,
      disposalType: frame.disposalType ? frame.disposalType : settings?.disposalMethod ? settings.disposalMethod : 2
    };
  }
  calculateUniformDimensions(metadata) {
    const frameSizes = metadata.frameExtras.individualFrameSizes;
    const maxWidth = Math.max(...frameSizes.map((s) => s.width));
    const maxHeight = Math.max(...frameSizes.map((s) => s.height));
    const scale = Math.min(
      CONSTANTS.TARGET_SIZE / maxWidth,
      CONSTANTS.TARGET_SIZE / maxHeight
    );
    return {
      width: Math.round(maxWidth * scale),
      height: Math.round(maxHeight * scale),
      scale
    };
  }
  /**
   * Optimizes the patch array by handling transparency with worker pools.
   */
  async optimizePatch(patch, transparentIndex, quality, metrics) {
    const settings = QUALITY_PRESETS[quality];
    const chunkSize = Math.ceil(patch.length / (this.workerCount * 4)) * 4;
    const chunks = [];
    for (let i = 0; i < patch.length; i += chunkSize) {
      chunks.push(patch.subarray(i, Math.min(i + chunkSize, patch.length)));
    }
    const processedChunks = await Promise.all(
      chunks.map(
        (chunk) => this.processChunk(chunk, transparentIndex, settings, metrics)
      )
    );
    const newPatch = new Uint8ClampedArray(patch.length);
    let offset = 0;
    for (const chunk of processedChunks) {
      newPatch.set(chunk, offset);
      offset += chunk.length;
    }
    return newPatch;
  }
  /**
   * Process a single chunk of the patch data
   */
  processChunk(chunk, transparentIndex, settings, metrics) {
    const newChunk = new Uint8ClampedArray(chunk.length);
    if (metrics.isPixelArt) {
      newChunk.set(chunk);
      return newChunk;
    }
    const alphaThreshold = 220;
    const { colorEnhancement } = settings;
    for (let i = 0; i < chunk.length; i += 4) {
      const alpha = chunk[i + 3];
      const r = chunk[i];
      const g = chunk[i + 1];
      const b = chunk[i + 2];
      if (alpha < alphaThreshold || transparentIndex === r) {
        newChunk[i] = 0;
        newChunk[i + 1] = 0;
        newChunk[i + 2] = 0;
        newChunk[i + 3] = 0;
      } else {
        newChunk[i] = Math.min(255, r * (colorEnhancement?.red ?? 1));
        newChunk[i + 1] = Math.min(255, g * (colorEnhancement?.green ?? 1));
        newChunk[i + 2] = Math.min(255, b * (colorEnhancement?.blue ?? 1));
        newChunk[i + 3] = 255;
      }
    }
    return newChunk;
  }
};
var ImageProcessingServicev1_default = ImageProcessingService;

// src/utils/RetryHandler.ts
var RetryHandler = class {
  retries;
  delay;
  backoffFactor;
  constructor(retries = 3, delay = 500, backoffFactor = 2) {
    this.retries = retries;
    this.delay = delay;
    this.backoffFactor = backoffFactor;
  }
  async execute(fn) {
    let attempts = 0;
    let currentDelay = this.delay;
    while (attempts < this.retries) {
      try {
        return await fn();
      } catch (error) {
        attempts++;
        if (attempts >= this.retries) throw error;
        await this.delayExecution(currentDelay);
        currentDelay *= this.backoffFactor;
      }
    }
    throw new Error("RetryHandler exhausted all retries");
  }
  delayExecution(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};
var EnhancedRetryHandler = class extends RetryHandler {
  jitterFactor;
  constructor(retries = 3, delay = 500, backoffFactor = 2, jitterFactor = 0.1) {
    super(retries, delay, backoffFactor);
    this.jitterFactor = jitterFactor;
  }
  applyJitter(delay) {
    const jitter = delay * this.jitterFactor * (Math.random() - 0.5);
    return delay + jitter;
  }
  async execute(fn) {
    let attempts = 0;
    let currentDelay = this.delay;
    while (attempts < this.retries) {
      try {
        return await fn();
      } catch (error) {
        attempts++;
        if (attempts >= this.retries) throw error;
        const jitteredDelay = this.applyJitter(currentDelay);
        await this.delayExecution(jitteredDelay);
        currentDelay *= this.backoffFactor;
      }
    }
    throw new Error("EnhancedRetryHandler exhausted all retries");
  }
};
async function fetchWithRetry(url, options, retries = 3, delay = 500) {
  const retryHandler = new RetryHandler(retries, delay);
  return retryHandler.execute(() => fetch(url, options));
}

// src/GifProcessor/index.ts
var import_gif_js = __toESM(require_gif2());
var import_gifuct_js2 = __toESM(require_lib2());
function getHardwareConcurrency() {
  if (typeof navigator !== "undefined" && navigator.hardwareConcurrency) {
    return navigator.hardwareConcurrency;
  }
  return 4;
}
var GIFProcessor = class _GIFProcessor {
  static instance = null;
  static sharedWorkerPool = null;
  static sharedGifWorkerPool = null;
  static activeInstanceCount = 0;
  sessionId;
  CONSTANTS = CONSTANTS;
  workerPath = CONSTANTS.WORKER_PATH;
  workerScript;
  imageProcessor;
  imgManager;
  progTracker;
  pixelArtHandler;
  workerManager;
  qualityManager;
  memoryManager;
  progManager;
  frameProcessor;
  sessionManager;
  qualityAnalyzer;
  //private readonly rwp: RobustWorkerPool;
  gifWorkerPool;
  workerPool;
  canvas;
  //private webWrkr: Worker;
  abort;
  completedPhases;
  processedFramesCache;
  canvasPool;
  workerCount;
  isProcessing = false;
  processingStartTime = 0;
  framesProcessed = 0;
  averageFrameTime = 0;
  totalFrames = 0;
  frameStartTime = 0;
  frameProcessingTimes = [];
  totalFramesCount = 0;
  processedFramesCount = 0;
  phaseStartTimes = {};
  streamController = null;
  qualityOptions = {
    allowAutoDetect: true,
    memoryAware: true
  };
  static getInstance(poolSize, script) {
    if (!_GIFProcessor.instance) {
      _GIFProcessor.instance = new _GIFProcessor(poolSize, script);
    }
    return _GIFProcessor.instance;
  }
  static async destroyInstance() {
    if (_GIFProcessor.instance) {
      await _GIFProcessor.instance.cleanup();
      _GIFProcessor.instance = null;
    }
  }
  constructor(poolSize = Math.min(6, getHardwareConcurrency()), script) {
    this.isProcessing = false;
    const isBrowser = typeof window !== "undefined";
    const workerScript = script ?? (isBrowser ? void 0 : this.workerPath);
    this.workerScript = workerScript;
    _GIFProcessor.activeInstanceCount += 1;
    this.sessionManager = new SessionManager();
    this.sessionId = this.sessionManager.createSession();
    this.workerPool = _GIFProcessor.sharedWorkerPool ?? new WorkerPool(poolSize, workerScript);
    _GIFProcessor.sharedWorkerPool = this.workerPool;
    if (typeof window !== "undefined") {
      console.debug("[GIFProcessor] Worker paths:", {
        requested: workerScript ?? "(inline)",
        current: window.location.pathname,
        full: workerScript ? new URL(workerScript, window.location.origin).href : "(inline)"
      });
    }
    this.progTracker = new GIFProgressTracker();
    this.progManager = new ProgressManager_default();
    this.workerManager = new WorkerManager(this.workerPool);
    this.abort = new AbortController();
    this.completedPhases = /* @__PURE__ */ new Set();
    this.gifWorkerPool = _GIFProcessor.sharedGifWorkerPool ?? new WorkerPool(Math.ceil(poolSize / 2), workerScript);
    _GIFProcessor.sharedGifWorkerPool = this.gifWorkerPool;
    console.debug("GifWorkerPool initialized:", this.gifWorkerPool.stats);
    this.workerCount = Math.min(getHardwareConcurrency(), poolSize);
    this.memoryManager = new MemoryManager_default(
      this.sessionId,
      this.progTracker,
      poolSize,
      this.workerPool,
      this.gifWorkerPool,
      this.qualityOptions,
      this.workerCount
    );
    this.pixelArtHandler = new PixelArtHandler();
    this.qualityManager = new QualityManager_default();
    this.canvasPool = new CanvasPool(
      CONSTANTS.POOL_SIZE,
      CONSTANTS.CANVAS_PER_SIZE,
      CONSTANTS.MEMORY_LIMIT
    );
    this.imageProcessor = new ImageProcessingServicev1_default(
      this.workerCount,
      this.pixelArtHandler,
      gifAnalyzer
    );
    this.frameProcessor = new FrameProcessor_default(
      this.pixelArtHandler,
      this.imageProcessor,
      this.canvasPool,
      gifAnalyzer,
      this.workerPool,
      this.workerCount
    );
    this.imgManager = new ImageManager(
      this.progManager,
      this.workerPool,
      this.canvasPool
    );
    this.qualityAnalyzer = new QualityAnalyzer(
      this.qualityManager,
      gifAnalyzer
    );
    this.processedFramesCache = /* @__PURE__ */ new Map();
    this.canvas = this.canvasPool.getCanvas(
      CONSTANTS.WORKING_SIZE,
      CONSTANTS.WORKING_SIZE
    );
    console.debug(
      "GIFProcessor initialized with pool size:",
      poolSize,
      "Workercount:",
      this.workerCount
    );
    this.memoryManager.currentMemoryStrategy = this.memoryManager.MEMORY_STRATEGIES.MEDIUM;
  }
  createGIF(frames, enhanceColors = false) {
    if (!frames.length) throw new Error("No frames provided");
    const gifOptions = {
      workers: this.workerScript ? this.workerCount : 0,
      quality: 1,
      transparent: null,
      background: null,
      // Keep background null
      dispose: 2,
      // Use dispose 2 to properly clear between frames
      dither: false,
      debug: true,
      repeat: 0,
      width: CONSTANTS.TARGET_SIZE,
      height: CONSTANTS.TARGET_SIZE
    };
    if (this.workerScript) {
      gifOptions.workerScript = this.workerScript;
    }
    const gif = new import_gif_js.default(gifOptions);
    return new Promise((resolve, reject) => {
      gif.on("progress", (progress) => {
        const encodingProgress = Math.round(progress * 100);
        this.progManager.updatePhase(
          GIF_PHASES.ENCODING.id,
          encodingProgress,
          `Encoding: ${encodingProgress}%`
        );
      });
      gif.on("finished", (blob) => {
        if (!blob || !blob.size) {
          reject(new Error("Generated GIF is empty"));
          return;
        }
        console.debug("[GIF] Generation complete:", {
          size: `${Math.round(blob.size / 1024)}KB`,
          type: blob.type
        });
        frames.forEach((frame) => frame.bitmap.close());
        this.progManager.resetProgress();
        this.progTracker.completePhase(GIF_PHASES.ENCODING.id);
        resolve(blob);
      });
      gif.on("error", (error) => {
        console.error("[GIF] Encoding error:", error);
        this.progManager.resetProgress();
        reject(error);
      });
      const frameTasks = frames.map(
        (frame) => this.workerPool.addTask(async () => {
          const frameCanvas = document.createElement("canvas");
          frameCanvas.width = CONSTANTS.TARGET_SIZE;
          frameCanvas.height = CONSTANTS.TARGET_SIZE;
          const ctx = frameCanvas.getContext("2d", {
            alpha: true,
            willReadFrequently: true
          });
          if (ctx) {
            ctx.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
            ctx.globalCompositeOperation = "copy";
            ctx.drawImage(frame.bitmap, 0, 0);
            gif.addFrame(frameCanvas, {
              delay: frame.originalFrame.delay,
              // Use consistent delay
              dispose: frame.originalFrame.disposalType || 2,
              transparent: true
            });
          }
        })
      );
      Promise.all(frameTasks).then(() => {
        console.debug("[GIF] Starting render...");
        gif.render();
      }).catch(reject);
    });
  }
  async processFramesFromFrameProcessor(frames, staticImage) {
    const processedFrames = await this.frameProcessor.processFramesInWorkers(
      frames,
      staticImage
    );
    return processedFrames;
  }
  async streamGIF(gifUrl, bglessUrl, overlays, onError) {
    if (this.isProcessing)
      return Promise.reject(new Error("GIF processing already in progress"));
    this.isProcessing = true;
    try {
      const { frames, metadata, quality } = await this.analyzeGIF(gifUrl);
      this.memoryManager.validateInput(frames, bglessUrl, overlays);
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      (async () => {
        try {
          const optimizedFrames = [];
          let processedFrames;
          const staticImage = await this.imgManager.loadAndCreateStaticImage(
            bglessUrl,
            overlays
          );
          const frameAnalysis = gifAnalyzer.analyzeGIFFrameDimensions(frames);
          if (metadata.isPixelArt || frameAnalysis.hasVariableSize) {
            const normalizedFrames = frames.map(
              (frame, i) => this.pixelArtHandler.processPixelArtFrame(
                frame,
                frameAnalysis,
                i
              )
            );
            const optimizedFrames2 = await Promise.all(
              normalizedFrames.map(
                async (frame) => this.frameProcessor.processFrameOG(
                  await this.imageProcessor.preOptimizeGifFrame(
                    frame,
                    true,
                    "PIXEL"
                  )
                )
              )
            );
            processedFrames = await this.imageProcessor.createImgBitmap(
              optimizedFrames2,
              staticImage
            );
          } else {
            const optimizedFrames2 = await Promise.all(
              frames.map(
                async (frame) => this.frameProcessor.processFrameOG(
                  await this.imageProcessor.preOptimizeGifFrame(
                    frame,
                    true,
                    quality || "HIGH"
                  )
                )
              )
            );
            processedFrames = await this.imageProcessor.createImgBitmap(
              optimizedFrames2,
              staticImage
            );
          }
          writer.write(
            new TextEncoder().encode(
              JSON.stringify({
                status: "Processing frame",
                frameIndex: optimizedFrames.length
              }) + "\n"
            )
          );
          this.progManager.updatePhase(
            GIF_PHASES.PROCESSING.id,
            100,
            "Frame processing complete"
          );
          await this.createGIFStream(processedFrames, writer);
        } catch (error) {
          console.error("GIF streaming failed:", error);
          writer.abort(error);
          onError?.(error instanceof Error ? error : new Error(String(error)));
        }
      })();
      return readable;
    } catch (error) {
      console.error("GIF streaming initialization failed:", error);
      onError?.(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }
  async createGIFStream(frames, writer, previewSize = {
    width: 400,
    height: 300
  }) {
    let frameCanvas = null;
    let ctx = null;
    const originalFrames = frames.map((frame) => frame.originalFrame);
    const imgBitmapFrames = frames.map((frame) => frame.bitmap);
    try {
      const frameAnalysis = gifAnalyzer.analyzeGIFFrameDimensions(originalFrames);
      const firstFrame = frames[0];
      if (!firstFrame?.bitmap) {
        throw new Error("No valid frames to process");
      }
      const scale = Math.min(
        previewSize.width / frameAnalysis.maxWidth,
        previewSize.height / frameAnalysis.maxHeight
      );
      const targetWidth = Math.round(firstFrame.bitmap.width * scale);
      const targetHeight = Math.round(firstFrame.bitmap.height * scale);
      const xOffset = Math.floor((previewSize.width - targetWidth) / 2);
      const yOffset = Math.floor((previewSize.height - targetHeight) / 2);
      const encoderOptions = {
        workers: this.workerScript ? this.workerCount : 0,
        quality: 10,
        width: previewSize.width,
        height: previewSize.height,
        transparent: true,
        background: null,
        dispose: 2
      };
      if (this.workerScript) {
        encoderOptions.workerScript = this.workerScript;
      }
      const gifEncoder = new import_gif_js.default(encoderOptions);
      frameCanvas = document.createElement("canvas");
      frameCanvas.width = previewSize.width;
      frameCanvas.height = previewSize.height;
      ctx = frameCanvas.getContext("2d", {
        alpha: true,
        willReadFrequently: true
      });
      if (!ctx) throw new Error("Failed to get canvas context");
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        if (!frame.bitmap) continue;
        ctx.clearRect(0, 0, previewSize.width, previewSize.height);
        ctx.drawImage(
          frame.bitmap,
          xOffset,
          yOffset,
          targetWidth,
          targetHeight
        );
        gifEncoder.addFrame(ctx, {
          copy: true,
          delay: frame.originalFrame?.delay || 100,
          dispose: frame.originalFrame?.disposalType || 2
        });
        writer.write(
          new TextEncoder().encode(
            JSON.stringify({
              type: "progress",
              frameIndex: i + 1,
              total: frames.length,
              dimensions: {
                width: targetWidth,
                height: targetHeight,
                containerWidth: previewSize.width,
                containerHeight: previewSize.height,
                xOffset,
                yOffset
              }
            }) + "\n"
          )
        );
      }
      return new Promise((resolve, reject) => {
        gifEncoder.on("finished", async (blob) => {
          try {
            const url = URL.createObjectURL(blob);
            await writer.write(
              new TextEncoder().encode(
                JSON.stringify({
                  type: "complete",
                  url,
                  dimensions: { width: targetWidth, height: targetHeight }
                }) + "\n"
              )
            );
            await writer.close();
            resolve();
          } catch (error) {
            reject(error);
          }
        });
        gifEncoder.on("error", reject);
        gifEncoder.render();
      });
    } catch (error) {
      console.error("GIF stream error:", error);
      writer.abort(error);
      throw error;
    } finally {
      if (frameCanvas && ctx) {
        ctx.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
        frameCanvas.width = 0;
        frameCanvas.height = 0;
      }
      frames.forEach((frame) => {
        if (frame.bitmap) {
          frame.bitmap.close();
        }
      });
    }
  }
  async generateGIF(frames, bglessUrl, overlays, quality, options = {}, onError) {
    if (options.forceQuality || options.allowAutoDetect !== void 0) {
      this.memoryManager.setQualityOptions(options);
    }
    this.totalFramesCount = frames.length;
    this.processedFramesCount = 0;
    try {
      this.memoryManager.validateInput(frames, bglessUrl, overlays);
      const frameAnalysis = gifAnalyzer.analyzeGIFFrameDimensions(frames);
      const isPixelArt = await gifAnalyzer.detectPixelArtInAllFrames(frames);
      if (!quality) {
        const hasLargeFrames = frameAnalysis.maxWidth > CONSTANTS.TARGET_SIZE || frameAnalysis.maxHeight > CONSTANTS.TARGET_SIZE;
        if (isPixelArt) {
          quality = hasLargeFrames || frameAnalysis.hasVariableSize ? "HIGHRESPIXEL" : "PIXEL";
        } else {
          quality = hasLargeFrames || frameAnalysis.hasVariableSize ? "HIGHRES" : "HIGH";
        }
      }
      const settings = QUALITY_PRESETS[quality];
      if (options.optimizeFrames) {
        settings.disposalMethod = 1;
        settings.synchronizeFrames = true;
        settings.blendMode = "copy";
      }
      console.debug("Selected quality settings:", settings);
      let processedFrames;
      const staticImage = await this.imgManager.loadAndCreateStaticImage(
        bglessUrl,
        overlays
      );
      if (isPixelArt || frameAnalysis.hasVariableSize) {
        const normalizedFrames = frames.map(
          (frame, i) => this.pixelArtHandler.processPixelArtFrame(frame, frameAnalysis, i)
        );
        const optimizedFrames = await Promise.all(
          normalizedFrames.map(
            async (frame) => this.frameProcessor.processFrameOG(
              await this.imageProcessor.preOptimizeGifFrame(
                frame,
                true,
                "PIXEL"
              )
            )
          )
        );
        processedFrames = await this.imageProcessor.createImgBitmap(
          optimizedFrames,
          staticImage
        );
      } else {
        const optimizedFrames = await Promise.all(
          frames.map(
            async (frame) => this.frameProcessor.processFrameOG(
              await this.imageProcessor.preOptimizeGifFrame(
                frame,
                true,
                quality || "HIGH"
              )
            )
          )
        );
        processedFrames = await this.imageProcessor.createImgBitmap(
          optimizedFrames,
          staticImage
        );
      }
      const blob = await this.createGIF(processedFrames, false);
      Object.values(GIF_PHASES).forEach((phase) => {
        if (!this.completedPhases.has(phase.id)) {
          this.progManager.updatePhase(phase.id, 100, `${phase.name} complete`);
        }
      });
      this.progManager.resetProgress();
      this.memoryManager.clear();
      return blob;
    } catch (error) {
      console.error("GIF generation failed:", error);
      onError?.(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }
  async extractFrames(gifUrl) {
    try {
      const cacheKey = this.imgManager.getCacheKey(gifUrl);
      if (this.processedFramesCache.has(cacheKey)) {
        console.debug("Using cached frames for:", gifUrl);
        return this.processedFramesCache.get(cacheKey);
      }
      this.progManager.updatePhase(
        GIF_PHASES.EXTRACTING.id,
        0,
        "Starting frame extraction..."
      );
      const response = await fetchWithRetry(gifUrl);
      const buffer = await response.arrayBuffer();
      const metadata = await gifAnalyzer.analyzeGIF(buffer);
      console.debug("GIF Analysis:", metadata);
      this.progManager.updatePhase(
        GIF_PHASES.EXTRACTING.id,
        20,
        "Decompressing frames..."
      );
      const rawFrames = (0, import_gifuct_js2.decompressFrames)((0, import_gifuct_js2.parseGIF)(buffer), true);
      const qualityPreset = this.qualityManager.selectOptimalQuality(metadata);
      console.debug("Selected quality preset:", qualityPreset);
      this.processedFramesCache.set(cacheKey, rawFrames);
      this.progManager.updatePhase(
        GIF_PHASES.EXTRACTING.id,
        100,
        "Frame extraction complete"
      );
      return rawFrames;
    } catch (error) {
      console.error("Frame extraction failed:", error);
      throw error;
    }
  }
  async analyzeGIF(gifUrl) {
    try {
      const response = await fetchWithRetry(gifUrl);
      const buffer = await response.arrayBuffer();
      const { quality, metadata } = await this.qualityAnalyzer.analyzeGifQuality(gifUrl);
      console.debug("[GIF Analysis]", metadata, "Quality:", quality);
      const rawFrames = (0, import_gifuct_js2.decompressFrames)((0, import_gifuct_js2.parseGIF)(buffer), true);
      return { metadata, quality, frames: rawFrames };
    } catch (error) {
      console.error("GIF analysis failed:", error);
      throw error;
    }
  }
  CHUNK_SIZE = 5;
  // Process frames in smaller chunks
  MEMORY_LIMIT = 500 * 1024 * 1024;
  // 500MB limit
  async processFramesInChunks(frames) {
    const processedFrames = [];
    for (let i = 0; i < frames.length; i += this.CHUNK_SIZE) {
      const chunk = frames.slice(i, i + this.CHUNK_SIZE);
      const processedChunk = await Promise.all(
        chunk.map((frame) => this.frameProcessor.processFrameOG(frame))
      );
      processedFrames.push(...processedChunk);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    return processedFrames;
  }
  async processFramesInWorkers(frames) {
    const frameAnalysis = gifAnalyzer.analyzeGIFFrameDimensions(frames);
    const normalizedFrames = frames.map(
      (frame) => this.pixelArtHandler.processPixelArtFrame(frame, frameAnalysis, 0)
    );
    const chunkSize = Math.ceil(normalizedFrames.length / this.workerCount);
    const frameChunks = [];
    for (let i = 0; i < normalizedFrames.length; i += chunkSize) {
      frameChunks.push(normalizedFrames.slice(i, i + chunkSize));
    }
    return (await Promise.all(
      frameChunks.map(async (chunk) => {
        return this.workerPool.addTask(async () => {
          return Promise.all(
            chunk.map(
              async (frame) => this.frameProcessor.processFrame(
                await this.imageProcessor.preOptimizeGifFrame(
                  frame,
                  true,
                  "HIGH"
                ),
                null
              )
            )
          );
        });
      })
    )).flat();
  }
  cleanup() {
    this.isProcessing = false;
    this.completedPhases.clear();
    this.processedFramesCache.clear();
    this.progManager.resetProgress();
    this.memoryManager.cleanup?.();
    if (this.sessionId) {
      this.sessionManager.endSession(this.sessionId);
    }
    this.sessionManager.cleanup();
    _GIFProcessor.activeInstanceCount = Math.max(
      0,
      _GIFProcessor.activeInstanceCount - 1
    );
    if (_GIFProcessor.activeInstanceCount === 0) {
      this.workerPool.terminate?.(true);
      this.gifWorkerPool.terminate?.(true);
      _GIFProcessor.sharedWorkerPool = null;
      _GIFProcessor.sharedGifWorkerPool = null;
    }
  }
};
function getGifProcessor(poolSize, script) {
  return GIFProcessor.getInstance(poolSize, script);
}

// src/decoder/BitReader.ts
var BitReader = class {
  nextBitToRead;
  numberOfBitsToRead;
  bitMask;
  bytes;
  constructor(bytes = new Uint8Array(0)) {
    this.nextBitToRead = 0;
    this.numberOfBitsToRead = 0;
    this.bitMask = 0;
    this.bytes = bytes;
  }
  init(bytes) {
    this.bytes = bytes;
    this.nextBitToRead = 0;
  }
  read() {
    let byteIndex = this.nextBitToRead >>> 3;
    const bitsToShiftRight = this.nextBitToRead & 7;
    const byte0 = this.bytes[byteIndex++] & 255;
    const byte1 = this.bytes[byteIndex++] & 255;
    const byte2 = this.bytes[byteIndex] & 255;
    const buffer = ((byte2 << 8 | byte1) << 8 | byte0) >>> bitsToShiftRight;
    this.nextBitToRead += this.numberOfBitsToRead;
    return buffer & this.bitMask;
  }
  setNumberOfBitsToRead(numberOfBitsToRead) {
    this.numberOfBitsToRead = numberOfBitsToRead;
    this.bitMask = (1 << numberOfBitsToRead) - 1;
  }
};

// src/decoder/CodeTable.ts
var CodeTable = class {
  table;
  initTableSize;
  initCodeSize;
  initCodeLimit;
  codeSize;
  nextCode;
  nextCodeLimit;
  bitReader;
  constructor(table) {
    if (!table) {
      this.table = new Array(4096).fill(0).map(() => []);
      this.initTableSize = 0;
      this.initCodeSize = 0;
      this.initCodeLimit = 0;
      this.codeSize = 0;
      this.nextCode = 0;
      this.nextCodeLimit = 0;
      this.bitReader = new BitReader();
      return;
    }
    this.table = table.table;
    this.initTableSize = this.table.length;
    this.initCodeSize = table.initCodeSize;
    this.initCodeLimit = table.initCodeLimit;
    this.codeSize = table.codeSize;
    this.nextCode = table.nextCode;
    this.nextCodeLimit = table.nextCodeLimit;
    this.bitReader = new BitReader();
  }
  add(indices) {
    if (this.nextCode < 4096) {
      if (this.nextCode === this.nextCodeLimit && this.codeSize < 12) {
        this.codeSize++;
        this.bitReader.setNumberOfBitsToRead(this.codeSize);
        this.nextCodeLimit = (1 << this.codeSize) - 1;
      }
      this.table[this.nextCode++] = indices;
    }
    return this.codeSize;
  }
  clear() {
    this.codeSize = this.initCodeSize;
    this.bitReader.setNumberOfBitsToRead(this.codeSize);
    this.nextCodeLimit = this.initCodeLimit;
    this.nextCode = this.initTableSize;
    return this.codeSize;
  }
  init(fr, activeColTbl, br) {
    this.bitReader = br;
    const numColors = activeColTbl.length;
    this.initCodeSize = fr.firstCodeSize;
    this.initCodeLimit = (1 << this.initCodeSize) - 1;
    this.initTableSize = fr.endOfInfoCode + 1;
    this.nextCode = this.initTableSize;
    for (let c = numColors - 1; c >= 0; c--) {
      this.table[c][0] = activeColTbl[c];
    }
    this.table[fr.clearCode] = [fr.clearCode];
    this.table[fr.endOfInfoCode] = [fr.endOfInfoCode];
    if (fr.transpColFlag && fr.transpColIndex < numColors) {
      this.table[fr.transpColIndex][0] = 0;
    }
  }
};

// src/decoder/GifFrame.ts
var GifFrame = class {
  disposalMethod = 0;
  transpColFlag = false;
  delay = 0;
  transpColIndex = 0;
  x = 0;
  y = 0;
  w = 0;
  h = 0;
  wh = 0;
  hasLocColTbl = false;
  interlaceFlag = false;
  sortFlag = false;
  sizeOfLocColTbl = 0;
  localColTbl = [];
  firstCodeSize = 0;
  clearCode = 0;
  endOfInfoCode = 0;
  data = new Uint8Array(0);
  img = new ImageData(0, 0);
  constructor(gifFrame) {
    if (!gifFrame) {
      this.setDefaultValues();
      return;
    }
    this.disposalMethod = gifFrame.disposalMethod;
    this.transpColFlag = gifFrame.transpColFlag;
    this.delay = gifFrame.delay;
    this.transpColIndex = gifFrame.transpColIndex;
    this.x = gifFrame.x;
    this.y = gifFrame.y;
    this.w = gifFrame.w;
    this.h = gifFrame.h;
    this.wh = gifFrame.wh;
    this.hasLocColTbl = gifFrame.hasLocColTbl;
    this.interlaceFlag = gifFrame.interlaceFlag;
    this.sortFlag = gifFrame.sortFlag;
    this.sizeOfLocColTbl = gifFrame.sizeOfLocColTbl;
    this.localColTbl = gifFrame.localColTbl;
    this.firstCodeSize = gifFrame.firstCodeSize;
    this.clearCode = gifFrame.clearCode;
    this.endOfInfoCode = gifFrame.endOfInfoCode;
    this.data = gifFrame.data || new Uint8Array(0);
    this.img = gifFrame.img || new ImageData(0, 0);
  }
  setDefaultValues() {
    this.disposalMethod = 0;
    this.transpColFlag = false;
    this.delay = 0;
    this.transpColIndex = 0;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.wh = 0;
    this.hasLocColTbl = false;
    this.interlaceFlag = false;
    this.sortFlag = false;
    this.sizeOfLocColTbl = 0;
    this.localColTbl = [];
    this.firstCodeSize = 0;
    this.clearCode = 0;
    this.endOfInfoCode = 0;
    this.data = new Uint8Array(0);
    this.img = new ImageData(0, 0);
  }
};

// src/decoder/GifImage.ts
var GifImage = class {
  header = "";
  w = 0;
  h = 0;
  wh = 0;
  hasGlobColTbl = false;
  colorResolution = 0;
  sortFlag = false;
  sizeOfGlobColTbl = 0;
  bgColIndex = 0;
  pxAspectRatio = 0;
  globalColTbl = [];
  frames = [];
  appId = "";
  appAuthCode = "";
  repetitions = 0;
  img = null;
  bits = new BitReader();
  codes = new CodeTable();
  g = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  constructor(gifImg) {
    if (!gifImg) {
      return;
    }
    Object.assign(this, gifImg);
    this.header = gifImg.header;
    this.w = gifImg.w;
    this.h = gifImg.h;
    this.wh = gifImg.wh;
    this.hasGlobColTbl = gifImg.hasGlobColTbl;
    this.colorResolution = gifImg.colorResolution;
    this.sortFlag = gifImg.sortFlag;
    this.sizeOfGlobColTbl = gifImg.sizeOfGlobColTbl;
    this.bgColIndex = gifImg.bgColIndex;
    this.pxAspectRatio = gifImg.pxAspectRatio;
    this.globalColTbl = gifImg.globalColTbl;
    this.g = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  }
  processCode1(code, out, outPos) {
    const tbl = this.codes.table;
    if (code < this.codes.nextCode) {
      const pixels = tbl[code];
      pixels.forEach((pixel, index) => out[outPos + index] = pixel);
      return pixels.length;
    } else {
      throw new Error(`Invalid code encountered: ${code}`);
    }
  }
  processCode(code, clearCode, endCode, tbl, out, outPos) {
    if (code === clearCode) {
      this.codes.clear();
      return { pixels: [], outPos };
    } else if (code === endCode) {
      throw new Error("End of GIF decoding");
    }
    let pixels;
    const prevCode = this.bits.read();
    const prevVals = tbl[prevCode];
    const prevValsAndK = [...prevVals, 0];
    if (code < this.codes.nextCode) {
      pixels = tbl[code];
      prevValsAndK[prevVals.length] = pixels[0];
    } else {
      prevValsAndK[prevVals.length] = prevVals[0];
      pixels = prevValsAndK;
    }
    this.codes.add(prevValsAndK);
    pixels.forEach((pixel, index) => {
      out[outPos + index] = pixel;
    });
    return { pixels, outPos: outPos + pixels.length };
  }
  decode(fr, activeColTbl) {
    this.codes.init(fr, activeColTbl, this.bits);
    this.bits.init(fr.data);
    const clearCode = fr.clearCode, endCode = fr.endOfInfoCode;
    const out = new Array(this.wh).fill(0);
    const tbl = this.codes.table;
    let outPos = 0;
    this.codes.clear();
    this.bits.read();
    let code = this.bits.read();
    let pixels = tbl[code];
    pixels.forEach((pixel, index) => out[outPos + index] = pixel);
    outPos += pixels.length;
    try {
      while (true) {
        const prevCode = code;
        code = this.bits.read();
        if (code === clearCode) {
          this.codes.clear();
          code = this.bits.read();
          pixels = tbl[code];
          pixels.forEach((pixel, index) => out[outPos + index] = pixel);
          outPos += pixels.length;
          continue;
        } else if (code === endCode) {
          break;
        }
        const prevVals = tbl[prevCode];
        const prevValsAndK = [...prevVals, 0];
        if (code < this.codes.nextCode) {
          pixels = tbl[code];
          pixels.forEach((pixel, index) => out[outPos + index] = pixel);
          outPos += pixels.length;
          prevValsAndK[prevVals.length] = tbl[code][0];
        } else {
          prevValsAndK[prevVals.length] = prevVals[0];
          prevValsAndK.forEach((pixel, index) => out[outPos + index] = pixel);
          outPos += prevValsAndK.length;
        }
        this.codes.add(prevValsAndK);
      }
    } catch (ignored) {
    }
    return out;
  }
  deinterlace(src, fr) {
    const w = fr.w, h = fr.h, wh = fr.wh;
    const dest = new Array(src.length).fill(0);
    const set2Y = h + 7 >>> 3;
    const set3Y = set2Y + (h + 3 >>> 3);
    const set4Y = set3Y + (h + 1 >>> 2);
    const set2 = w * set2Y, set3 = w * set3Y, set4 = w * set4Y;
    const w2 = w << 1, w4 = w2 << 1, w8 = w4 << 1;
    let from = 0, to = 0;
    for (; from < set2; from += w, to += w8) {
      src.slice(from, from + w).forEach((pixel, index) => dest[to + index] = pixel);
    }
    for (to = w4; from < set3; from += w, to += w8) {
      src.slice(from, from + w).forEach((pixel, index) => dest[to + index] = pixel);
    }
    for (to = w2; from < set4; from += w, to += w4) {
      src.slice(from, from + w).forEach((pixel, index) => dest[to + index] = pixel);
    }
    for (to = w; from < wh; from += w, to += w2) {
      src.slice(from, from + w).forEach((pixel, index) => dest[to + index] = pixel);
    }
    return dest;
  }
  drawFrame(fr) {
    const activeColTbl = fr.hasLocColTbl ? fr.localColTbl : this.globalColTbl;
    let pixels = this.decode(fr, activeColTbl);
    if (fr.interlaceFlag) {
      pixels = this.deinterlace(pixels, fr);
    }
    const frame = new ImageData(new Uint8ClampedArray(pixels), fr.w, fr.h);
    this.g.putImageData(frame, fr.x, fr.y);
    const prevPx = new Array(this.wh).fill(0);
    if (this.img) {
      this.img.data.forEach((pixel, index) => prevPx[index] = pixel);
    }
    fr.img = new ImageData(new Uint8ClampedArray(prevPx), this.w, this.h);
    if (fr.disposalMethod === 2) {
      this.g.clearRect(fr.x, fr.y, fr.w, fr.h);
    } else if (fr.disposalMethod === 3) {
      if (this.img) {
        if (this.img) {
          prevPx.forEach((pixel, index) => this.img.data[index] = pixel);
        }
      }
    }
  }
  getBackgroundColor() {
    const frame = this.frames[0];
    if (frame.hasLocColTbl) {
      return frame.localColTbl[this.bgColIndex];
    } else if (this.hasGlobColTbl) {
      return this.globalColTbl[this.bgColIndex];
    }
    return 0;
  }
  getDelay(index) {
    return this.frames[index].delay;
  }
  getFrame(index) {
    if (this.img === null) {
      this.img = new ImageData(this.w, this.h);
      const canvas = document.createElement("canvas");
      canvas.width = this.w;
      canvas.height = this.h;
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Failed to get 2D context");
      }
      this.g = context;
      this.g.fillStyle = "rgba(0,0,0,0)";
    }
    let fr = this.frames[index];
    if (fr.img === null) {
      for (let i = 0; i <= index; i++) {
        fr = this.frames[i];
        if (fr.img === null) {
          this.drawFrame(fr);
        }
      }
    }
    return fr.img;
  }
  getFrames() {
    const frames = [];
    for (let i = 0; i < this.frames.length; i++) {
      frames.push(this.getFrame(i));
    }
    return frames;
  }
  getFrameCount() {
    return this.frames.length;
  }
  getHeight() {
    return this.h;
  }
  getWidth() {
    return this.w;
  }
  getFrameData(index) {
    const frame = this.frames[index];
    const imageData = this.getFrame(index);
    return {
      width: frame.w,
      height: frame.h,
      data: imageData.data,
      delay: frame.delay,
      disposalMethod: frame.disposalMethod,
      transparencyIndex: frame.transpColFlag ? frame.transpColIndex : null
    };
  }
  getAllFramesData() {
    return this.frames.map((_, index) => this.getFrameData(index));
  }
};

// src/decoder/utils.ts
function read(uintA) {
  const img = new GifImage();
  let frame = null;
  let pos = readHeader(uintA, img);
  pos = readLogicalScreenDescriptor(img, uintA, pos);
  if (img.hasGlobColTbl) {
    img.globalColTbl = new Array(img.sizeOfGlobColTbl).fill(0);
    pos = readColTbl(uintA, img.globalColTbl, pos);
  }
  while (pos < uintA.length) {
    const block = uintA[pos] & 255;
    switch (block) {
      case 33:
        if (pos + 1 >= uintA.length) {
          throw new Error("Unexpected end of file.");
        }
        switch (uintA[pos + 1] & 255) {
          case 254:
            pos = readTextExtension(uintA, pos);
            break;
          case 255:
            pos = readAppExt(img, uintA, pos);
            break;
          case 1:
            frame = null;
            pos = readTextExtension(uintA, pos);
            break;
          case 249:
            if (frame === null) {
              frame = new GifFrame();
              img.frames.push(frame);
            }
            pos = readGraphicControlExt(frame, uintA, pos);
            break;
          default:
            throw new Error("Unknown extension at " + pos);
        }
        break;
      case 44:
        if (frame === null) {
          frame = new GifFrame();
          img.frames.push(frame);
        }
        pos = readImgDescr(frame, uintA, pos);
        if (frame.hasLocColTbl) {
          frame.localColTbl = new Array(frame.sizeOfLocColTbl).fill(0);
          pos = readColTbl(uintA, frame.localColTbl, pos);
        }
        pos = readImgData(frame, uintA, pos);
        frame = null;
        break;
      case 59:
        return img;
      default:
        const progress = 1 * pos / uintA.length;
        if (progress < 0.9) {
          throw new Error("Unknown block at: " + pos);
        }
        pos = uintA.length;
    }
  }
  return img;
}
function readAppExt(img, uintA, i) {
  img.appId = String.fromCharCode(...Array.from(uintA.slice(i + 3, i + 11)));
  img.appAuthCode = String.fromCharCode(
    ...Array.from(uintA.slice(i + 11, i + 14))
  );
  i += 14;
  const subBlockSize = uintA[i] & 255;
  if (subBlockSize === 3) {
    img.repetitions = uintA[i + 2] & 255 | (uintA[i + 3] & 255) << 8;
    return i + 5;
  }
  while ((uintA[i] & 255) !== 0) {
    i += (uintA[i] & 255) + 1;
  }
  return i + 1;
}
function readColTbl(uintA, colors, i) {
  const numColors = colors.length;
  for (let c = 0; c < numColors; c++) {
    const a = 255;
    const r = uintA[i++] & 255;
    const g = uintA[i++] & 255;
    const b = uintA[i++] & 255;
    colors[c] = ((a << 8 | r) << 8 | g) << 8 | b;
  }
  return i;
}
function readGraphicControlExt(fr, uintA, i) {
  fr.disposalMethod = (uintA[i + 3] & 28) >>> 2;
  fr.transpColFlag = (uintA[i + 3] & 1) === 1;
  fr.delay = uintA[i + 4] & 255 | (uintA[i + 5] & 255) << 8;
  fr.transpColIndex = uintA[i + 6] & 255;
  return i + 8;
}
function readHeader(uintA, img) {
  if (uintA.length < 6) {
    throw new Error("Image is truncated.");
  }
  img.header = String.fromCharCode(...Array.from(uintA.slice(0, 6)));
  if (img.header !== "GIF87a" && img.header !== "GIF89a") {
    throw new Error("Invalid GIF header.");
  }
  return 6;
}
function readImgData(fr, uintA, i) {
  const fileSize = uintA.length;
  const minCodeSize = uintA[i++] & 255;
  const clearCode = 1 << minCodeSize;
  fr.firstCodeSize = minCodeSize + 1;
  fr.clearCode = clearCode;
  fr.endOfInfoCode = clearCode + 1;
  const imgDataSize = readImgDataSize(uintA, i);
  const imgData = new Uint8Array(imgDataSize + 2);
  let imgDataPos = 0;
  let subBlockSize = uintA[i] & 255;
  while (subBlockSize > 0) {
    try {
      const nextSubBlockSizePos = i + subBlockSize + 1;
      const nextSubBlockSize = uintA[nextSubBlockSizePos] & 255;
      imgData.set(uintA.slice(i + 1, i + 1 + subBlockSize), imgDataPos);
      imgDataPos += subBlockSize;
      i = nextSubBlockSizePos;
      subBlockSize = nextSubBlockSize;
    } catch (e) {
      subBlockSize = fileSize - i - 1;
      imgData.set(uintA.slice(i + 1, i + 1 + subBlockSize), imgDataPos);
      imgDataPos += subBlockSize;
      i += subBlockSize + 1;
      break;
    }
  }
  fr.data = imgData;
  i++;
  return i;
}
function readImgDataSize(uintA, i) {
  const fileSize = uintA.length;
  let imgDataPos = 0;
  let subBlockSize = uintA[i] & 255;
  while (subBlockSize > 0) {
    try {
      const nextSubBlockSizePos = i + subBlockSize + 1;
      const nextSubBlockSize = uintA[nextSubBlockSizePos] & 255;
      imgDataPos += subBlockSize;
      i = nextSubBlockSizePos;
      subBlockSize = nextSubBlockSize;
    } catch (e) {
      subBlockSize = fileSize - i - 1;
      imgDataPos += subBlockSize;
      break;
    }
  }
  return imgDataPos;
}
function readImgDescr(fr, uintA, i) {
  fr.x = uintA[++i] & 255 | (uintA[++i] & 255) << 8;
  fr.y = uintA[++i] & 255 | (uintA[++i] & 255) << 8;
  fr.w = uintA[++i] & 255 | (uintA[++i] & 255) << 8;
  fr.h = uintA[++i] & 255 | (uintA[++i] & 255) << 8;
  fr.wh = fr.w * fr.h;
  const b = uintA[++i];
  fr.hasLocColTbl = (b & 128) >>> 7 === 1;
  fr.interlaceFlag = (b & 64) >>> 6 === 1;
  fr.sortFlag = (b & 32) >>> 5 === 1;
  const colTblSizePower = (b & 7) + 1;
  fr.sizeOfLocColTbl = 1 << colTblSizePower;
  return i + 1;
}
function readLogicalScreenDescriptor(img, uintA, i) {
  img.w = uintA[i++] & 255 | (uintA[i++] & 255) << 8;
  img.h = uintA[i++] & 255 | (uintA[i++] & 255) << 8;
  img.wh = img.w * img.h;
  const b = uintA[i++];
  img.hasGlobColTbl = (b & 128) >>> 7 === 1;
  img.colorResolution = (b & 112) >>> 4;
  img.sortFlag = (b & 8) >>> 3 === 1;
  const colTblSizePower = (b & 7) + 1;
  img.sizeOfGlobColTbl = 1 << colTblSizePower;
  img.bgColIndex = uintA[i++] & 255;
  img.pxAspectRatio = uintA[i++] & 255;
  return i;
}
function readTextExtension(uintA, i) {
  while ((uintA[i] & 255) !== 0) {
    i += (uintA[i] & 255) + 1;
  }
  return i + 1;
}

// src/decoder/GifExtension.ts
var import_gifuct_js3 = __toESM(require_lib2());
var GifExtension = class extends GifImage {
  readGif = async (url) => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return read(new Uint8Array(buffer));
  };
  readGifReturnBuffer = async (url) => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  };
  returnGifDetails = async (url) => {
    const buffer = await this.readGifReturnBuffer(url);
    return read(buffer);
  };
  readGifFromBuffer = (buffer) => {
    return read(buffer);
  };
  readGifFromBlob = async (blob) => {
    const buffer = await blob.arrayBuffer();
    return read(new Uint8Array(buffer));
  };
  processGif = async (gifUrl, processor) => {
    const gifImage = async () => {
      return await this.readGifReturnBuffer(gifUrl);
    };
    const gifBuffer = await gifImage();
    const parsedGif = (0, import_gifuct_js3.parseGIF)(gifBuffer.buffer);
    const frames = (0, import_gifuct_js3.decompressFrames)(parsedGif, true);
    return processor.generateGIF(frames, "", []);
  };
  processGifWithProcessor = async (gifUrl, img, processor, overlays) => {
    const fetchGif = async () => {
      const response = await fetchWithRetry(gifUrl);
      return await response.arrayBuffer();
    };
    const gifBuffer = await fetchGif();
    const parsedGif = (0, import_gifuct_js3.parseGIF)(gifBuffer);
    const frames = (0, import_gifuct_js3.decompressFrames)(parsedGif, true);
    return processor.generateGIF(frames, img, overlays);
  };
};

// src/decoder/useGifDecoder.ts
async function useGifDecoder(input) {
  const data = await normalizeInput(input);
  const gif = read(data);
  return {
    width: gif.getWidth(),
    height: gif.getHeight(),
    background: gif.getBackgroundColor(),
    frameCount: gif.getFrameCount(),
    frames: gif.getAllFramesData(),
    delays: gif.frames.map((f) => f.delay)
  };
}
async function normalizeInput(input) {
  if (typeof input === "string") {
    const response = await fetch(input);
    if (!response.ok)
      throw new Error(`Failed to fetch GIF: ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  }
  if (input instanceof Blob) {
    const buffer = await input.arrayBuffer();
    return new Uint8Array(buffer);
  }
  return input;
}

// src/GifExtension/index.ts
var import_gifuct_js4 = __toESM(require_lib2());
var GIFExtension = class extends GifImage {
  readGif = async (url) => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return read(new Uint8Array(buffer));
  };
  readGifReturnBuffer = async (url) => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  };
  returnGifDetails = async (url) => {
    const buffer = await this.readGifReturnBuffer(url);
    return read(buffer);
  };
  readGifFromBuffer = (buffer) => {
    return read(buffer);
  };
  readGifFromBlob = async (blob) => {
    const buffer = await blob.arrayBuffer();
    return read(new Uint8Array(buffer));
  };
  processGif = async (gifUrl, processor) => {
    const gifImage = async () => {
      return await this.readGifReturnBuffer(gifUrl);
    };
    const gifBuffer = await gifImage();
    const parsedGif = (0, import_gifuct_js4.parseGIF)(gifBuffer.buffer);
    const frames = (0, import_gifuct_js4.decompressFrames)(parsedGif, true);
    return processor.generateGIF(frames, "", []);
  };
  processGifWithProcessor = async (gifUrl, img, processor, overlays) => {
    const fetchGif = async () => {
      const response = await fetchWithRetry(gifUrl);
      return await response.arrayBuffer();
    };
    const gifBuffer = await fetchGif();
    const parsedGif = (0, import_gifuct_js4.parseGIF)(gifBuffer);
    const frames = (0, import_gifuct_js4.decompressFrames)(parsedGif, true);
    return processor.generateGIF(frames, img, overlays);
  };
};
var Giffyness = class extends GIFProcessor {
  gifExtension;
  processor;
  constructor() {
    super();
    this.gifExtension = new GIFExtension();
    this.processor = new GIFProcessor();
  }
  processGiffy = async (gifUrl) => {
    return await this.gifExtension.processGif(gifUrl, this.processor);
  };
  processGiffyWithProcessor = async (gifUrl, img, overlays) => {
    return await this.gifExtension.processGifWithProcessor(
      gifUrl,
      img,
      this.processor,
      overlays
    );
  };
};

// src/pipeline/CutEngine.ts
function cloneFrames(frames) {
  return frames.map((frame, index) => ({
    ...frame,
    index
  }));
}
function recalcTiming(frames) {
  let timestampMs = 0;
  const normalized = frames.map((frame, index) => {
    const durationMs2 = Math.max(1, Math.round(frame.durationMs || 0));
    const next = {
      ...frame,
      index,
      timestampMs,
      durationMs: durationMs2
    };
    timestampMs += durationMs2;
    return next;
  });
  const durationMs = timestampMs;
  const fps = normalized.length > 0 && durationMs > 0 ? Math.max(1, Math.round(normalized.length * 1e3 / durationMs)) : 1;
  return { frames: normalized, durationMs, fps };
}
var CutEngine = class {
  static cutByFrame(timeline, startFrame, endFrameInclusive, clipName = "clip") {
    if (timeline.frames.length === 0) {
      throw new Error("Cannot cut an empty timeline");
    }
    const start = Math.max(0, startFrame);
    const end = Math.min(timeline.frames.length - 1, endFrameInclusive);
    if (end < start) {
      throw new Error(
        `Invalid frame range: ${startFrame}-${endFrameInclusive}`
      );
    }
    const slice = cloneFrames(timeline.frames.slice(start, end + 1));
    const timing = recalcTiming(slice);
    const clip = {
      name: clipName,
      startFrame: 0,
      endFrame: timing.frames.length - 1
    };
    return {
      ...timeline,
      id: `${timeline.id}:${clipName}`,
      fps: timing.fps,
      durationMs: timing.durationMs,
      frames: timing.frames,
      clips: [clip]
    };
  }
  static cutByTime(timeline, startMs, endMs, clipName = "clip") {
    if (timeline.frames.length === 0) {
      throw new Error("Cannot cut an empty timeline");
    }
    const start = Math.max(0, startMs);
    const end = Math.max(start, endMs);
    const selected = timeline.frames.filter((frame) => {
      const frameStart = frame.timestampMs;
      const frameEnd = frame.timestampMs + frame.durationMs;
      return frameEnd > start && frameStart <= end;
    });
    if (selected.length === 0) {
      throw new Error(`No frames found in range ${startMs}-${endMs}ms`);
    }
    return this.cutByFrame(
      { ...timeline, frames: selected },
      0,
      selected.length - 1,
      clipName
    );
  }
  static sampleEvery(timeline, step, clipName = "sampled") {
    if (step <= 0) {
      throw new Error("step must be greater than 0");
    }
    const sampled = timeline.frames.filter((_, index) => index % step === 0);
    if (sampled.length === 0) {
      throw new Error("Sampling removed all frames");
    }
    return this.cutByFrame(
      { ...timeline, frames: sampled },
      0,
      sampled.length - 1,
      clipName
    );
  }
};

// src/pipeline/NamedClipPlanner.ts
var DEFAULT_ORDER = ["idle", "walk", "blink", "react"];
var DEFAULT_RATIOS = {
  idle: [0, 0.35],
  walk: [0.35, 0.7],
  blink: [0.7, 0.85],
  react: [0.85, 1]
};
function clampFrame(frame, maxFrame) {
  return Math.max(0, Math.min(maxFrame, frame));
}
function durationForClip(timeline, range) {
  let total = 0;
  for (let i = range.startFrame; i <= range.endFrame; i += 1) {
    total += timeline.frames[i]?.durationMs ?? 0;
  }
  return total;
}
var NamedClipPlanner = class {
  static plan(timeline, options = {}) {
    if (!timeline.frames.length) {
      throw new Error("Cannot plan clips for an empty timeline");
    }
    const maxFrame = timeline.frames.length - 1;
    const minClipFrames = Math.max(1, options.minClipFrames ?? 1);
    return DEFAULT_ORDER.map((name) => {
      const override = options.clips?.[name];
      if (override?.startFrame !== void 0 || override?.endFrame !== void 0) {
        const start = clampFrame(override.startFrame ?? 0, maxFrame);
        const end = clampFrame(
          override.endFrame ?? Math.max(start, start + minClipFrames - 1),
          maxFrame
        );
        return {
          name,
          startFrame: Math.min(start, end),
          endFrame: Math.max(start, end)
        };
      }
      const [startRatio, endRatio] = DEFAULT_RATIOS[name];
      const startFrame = clampFrame(
        Math.floor(startRatio * timeline.frames.length),
        maxFrame
      );
      const endFrame = clampFrame(
        Math.max(
          startFrame + minClipFrames - 1,
          Math.ceil(endRatio * timeline.frames.length) - 1
        ),
        maxFrame
      );
      return {
        name,
        startFrame,
        endFrame
      };
    });
  }
  static split(timeline, options = {}) {
    const plan = this.plan(timeline, options);
    const result = {};
    for (const clip of plan) {
      result[clip.name] = CutEngine.cutByFrame(
        timeline,
        clip.startFrame,
        clip.endFrame,
        clip.name
      );
    }
    return result;
  }
  static summarize(timeline, options = {}) {
    return this.plan(timeline, options).map((clip) => ({
      ...clip,
      durationMs: durationForClip(timeline, clip)
    }));
  }
};

// src/pipeline/PixelMatrixExporter.ts
function toBinaryValue(r, g, b, a, threshold) {
  if (a === 0) return 0;
  const luminance = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
  return luminance >= threshold ? 1 : 0;
}
function toGrayscaleValue(r, g, b, a) {
  if (a === 0) return 0;
  return Math.round(r * 0.299 + g * 0.587 + b * 0.114);
}
function sanitizeConstToken(value) {
  const replaced = value.replace(/[^a-zA-Z0-9_]/g, "_");
  if (!replaced) return "FRAME";
  return /^[0-9]/.test(replaced) ? `_${replaced}` : replaced;
}
function imageDataToMatrix(imageData, mode, threshold) {
  const { data, width, height } = imageData;
  const rows = new Array(height);
  for (let y = 0; y < height; y += 1) {
    const row = new Array(width);
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (mode === "alpha-mask") {
        row[x] = a > 0 ? 1 : 0;
      } else if (mode === "binary") {
        row[x] = toBinaryValue(r, g, b, a, threshold);
      } else {
        row[x] = toGrayscaleValue(r, g, b, a);
      }
    }
    rows[y] = row;
  }
  return rows;
}
function selectFrameIndexes(totalFrames, options) {
  const explicit = options.frameIndexes?.filter(
    (index) => Number.isInteger(index) && index >= 0 && index < totalFrames
  );
  if (explicit && explicit.length > 0) {
    return Array.from(new Set(explicit)).sort((a, b) => a - b);
  }
  const stride = Math.max(1, options.frameStride ?? 1);
  const maxFrames = options.maxFrames ?? totalFrames;
  const indexes = [];
  for (let i = 0; i < totalFrames && indexes.length < maxFrames; i += stride) {
    indexes.push(i);
  }
  return indexes;
}
function serializeNumberMatrix(matrix) {
  const rows = matrix.map((row) => `  [${row.join(", ")}]`).join(",\n");
  return `[
${rows}
]`;
}
function flattenMatrix(matrix) {
  const flat = [];
  for (const row of matrix) {
    for (const value of row) {
      flat.push(value);
    }
  }
  return flat;
}
function packBits(values) {
  const bytes = new Uint8Array(Math.ceil(values.length / 8));
  for (let i = 0; i < values.length; i += 1) {
    if (values[i] > 0) {
      bytes[Math.floor(i / 8)] |= 1 << 7 - i % 8;
    }
  }
  return bytes;
}
function serializeBytes(bytes) {
  if (!bytes.length) return "";
  const chunkSize = 32;
  const chunks = [];
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = Array.from(bytes.slice(i, i + chunkSize));
    chunks.push(`  ${slice.join(", ")}`);
  }
  return `
${chunks.join(",\n")}
`;
}
function buildMatrixModule(constPrefix, timeline, mode, threshold, frames, includeMetadataConst) {
  const constChunks = frames.map((frame) => {
    const constName = `${constPrefix}_FRAME_${frame.index}`;
    return `export const ${constName}: number[][] = ${serializeNumberMatrix(frame.pixels)};`;
  });
  const metadataConst = includeMetadataConst ? `export const ${constPrefix}_META = ${JSON.stringify(
    {
      mode,
      threshold,
      frameCount: frames.length,
      sourceTimelineId: timeline.id,
      width: timeline.width,
      height: timeline.height
    },
    null,
    2
  )} as const;` : "";
  const allFramesConst = `export const ${constPrefix}_FRAMES: number[][][] = [
${frames.map((frame) => `  ${constPrefix}_FRAME_${frame.index}`).join(",\n")}
];`;
  return [metadataConst, ...constChunks, allFramesConst].filter(Boolean).join("\n\n");
}
function buildPackedModule(constPrefix, timeline, mode, threshold, packedFrames, includeMetadataConst) {
  const metadataConst = includeMetadataConst ? `export const ${constPrefix}_PACKED_META = ${JSON.stringify(
    {
      mode,
      threshold,
      frameCount: packedFrames.length,
      sourceTimelineId: timeline.id,
      width: timeline.width,
      height: timeline.height,
      encoding: "bit-packed-msb"
    },
    null,
    2
  )} as const;` : "";
  const decodeHelper = `export function decodeBitPackedFrame(bytes: Uint8Array, width: number, height: number): number[][] {
  const rows: number[][] = new Array(height);
  for (let y = 0; y < height; y += 1) {
    const row: number[] = new Array(width);
    for (let x = 0; x < width; x += 1) {
      const bitIndex = y * width + x;
      const byte = bytes[Math.floor(bitIndex / 8)] ?? 0;
      const bit = (byte >> (7 - (bitIndex % 8))) & 1;
      row[x] = bit;
    }
    rows[y] = row;
  }
  return rows;
}`;
  const constChunks = packedFrames.map((frame) => {
    const constName = `${constPrefix}_FRAME_${frame.index}_BITS`;
    return `export const ${constName} = new Uint8Array([${serializeBytes(frame.bytes)}]);`;
  });
  const payloadConst = `export const ${constPrefix}_PACKED_FRAMES = [
${packedFrames.map((frame) => {
    const bitsName = `${constPrefix}_FRAME_${frame.index}_BITS`;
    return `  { index: ${frame.index}, width: ${frame.width}, height: ${frame.height}, timestampMs: ${frame.timestampMs}, durationMs: ${frame.durationMs}, bitLength: ${frame.bitLength}, bytes: ${bitsName} }`;
  }).join(",\n")}
] as const;`;
  return [metadataConst, decodeHelper, ...constChunks, payloadConst].filter(Boolean).join("\n\n");
}
var PixelMatrixExporter = class {
  static exportTimeline(timeline, options = {}) {
    const mode = options.mode ?? "binary";
    const outputFormat = options.outputFormat ?? "matrix";
    const threshold = Math.max(0, Math.min(255, options.threshold ?? 128));
    const constPrefix = sanitizeConstToken(
      (options.constPrefix ?? timeline.id).toUpperCase()
    );
    const includeMetadataConst = options.includeMetadataConst !== false;
    if (outputFormat !== "matrix" && mode === "grayscale") {
      throw new Error(
        "Bit-packed output supports only binary/alpha-mask modes. Use mode 'binary' or 'alpha-mask'."
      );
    }
    const indexes = selectFrameIndexes(timeline.frames.length, options);
    const frames = indexes.map((frameIndex) => {
      const frame = timeline.frames[frameIndex];
      return {
        index: frame.index,
        width: frame.width,
        height: frame.height,
        timestampMs: frame.timestampMs,
        durationMs: frame.durationMs,
        pixels: imageDataToMatrix(frame.imageData, mode, threshold)
      };
    });
    const matrixModule = outputFormat === "bit-packed" ? void 0 : buildMatrixModule(
      constPrefix,
      timeline,
      mode,
      threshold,
      frames,
      includeMetadataConst
    );
    const packedFrames = outputFormat === "matrix" ? void 0 : frames.map((frame) => {
      const bits = packBits(flattenMatrix(frame.pixels));
      return {
        index: frame.index,
        width: frame.width,
        height: frame.height,
        timestampMs: frame.timestampMs,
        durationMs: frame.durationMs,
        bitLength: frame.width * frame.height,
        bytes: bits
      };
    });
    const packedModule = packedFrames ? buildPackedModule(
      constPrefix,
      timeline,
      mode,
      threshold,
      packedFrames,
      includeMetadataConst
    ) : void 0;
    const constModule = outputFormat === "matrix" ? matrixModule ?? "" : outputFormat === "bit-packed" ? packedModule ?? "" : [matrixModule, packedModule].filter(Boolean).join("\n\n");
    return {
      format: outputFormat,
      constModule,
      frames,
      packedFrames,
      matrixModule,
      packedModule
    };
  }
};

// src/pipeline/PixelMatrixFileEmitter.ts
function sanitizeFileToken(value) {
  const replaced = value.replace(/[^a-zA-Z0-9_-]/g, "_");
  return replaced || "pixel_matrix";
}
function ensureTsExtension(fileName) {
  return fileName.endsWith(".ts") ? fileName : `${fileName}.ts`;
}
var PixelMatrixFileEmitter = class {
  static emitModules(timeline, pixelOptions = {}, options = {}) {
    const base = sanitizeFileToken(options.baseFileName ?? timeline.id);
    const splitByClip = options.splitByClip ?? false;
    const includeIndexFile = options.includeIndexFile ?? splitByClip;
    if (!splitByClip) {
      const result = PixelMatrixExporter.exportTimeline(timeline, pixelOptions);
      return [
        {
          fileName: ensureTsExtension(`${base}.pixels`),
          content: result.constModule,
          format: result.format,
          frameCount: result.frames.length
        }
      ];
    }
    const files = [];
    const exportLines = [];
    for (const clip of timeline.clips) {
      const frameIndexes = [];
      for (let i = clip.startFrame; i <= clip.endFrame; i += 1) {
        if (i >= 0 && i < timeline.frames.length) frameIndexes.push(i);
      }
      if (!frameIndexes.length) continue;
      const result = PixelMatrixExporter.exportTimeline(timeline, {
        ...pixelOptions,
        frameIndexes
      });
      const safeClip = sanitizeFileToken(clip.name.toLowerCase());
      const fileStem = `${base}.${safeClip}.pixels`;
      const fileName = ensureTsExtension(fileStem);
      files.push({
        fileName,
        content: result.constModule,
        format: result.format,
        clipName: clip.name,
        frameCount: result.frames.length
      });
      exportLines.push(`export * from "./${fileStem}";`);
    }
    if (includeIndexFile && exportLines.length > 0) {
      files.push({
        fileName: ensureTsExtension(`${base}.pixels.index`),
        content: exportLines.join("\n"),
        format: "matrix",
        frameCount: 0
      });
    }
    return files;
  }
};

// src/pipeline/PreprocessPipeline.ts
function cloneFrame(frame) {
  return {
    ...frame,
    preprocess: frame.preprocess ? { ...frame.preprocess } : void 0
  };
}
function clamp8(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}
function toKeyColor(value) {
  return value ?? [24, 24, 24];
}
function rgbaAt(data, index) {
  return [data[index], data[index + 1], data[index + 2], data[index + 3]];
}
function colorDistance(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}
function estimateCornerKeyColor(imageData) {
  const { data, width, height } = imageData;
  const corners = [
    0,
    (width - 1) * 4,
    (height - 1) * width * 4,
    ((height - 1) * width + (width - 1)) * 4
  ];
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (const idx of corners) {
    const [cr, cg, cb] = rgbaAt(data, idx);
    r += cr;
    g += cg;
    b += cb;
    n += 1;
  }
  return [
    clamp8(r / Math.max(1, n)),
    clamp8(g / Math.max(1, n)),
    clamp8(b / Math.max(1, n))
  ];
}
function applyChromaKeyMask(args) {
  const { imageData, tolerance } = args;
  const keyColor = toKeyColor(args.keyColor) ?? estimateCornerKeyColor(imageData);
  const out = new Uint8ClampedArray(imageData.width * imageData.height);
  const { data } = imageData;
  for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
    const alpha = data[i + 3];
    if (alpha <= 0) {
      out[p] = 0;
      continue;
    }
    const dist = colorDistance([data[i], data[i + 1], data[i + 2]], keyColor);
    out[p] = dist <= tolerance ? 0 : alpha;
  }
  return out;
}
function featherMask(mask, width, height, radius) {
  if (radius <= 0) return mask;
  const next = new Uint8ClampedArray(mask.length);
  const diameter = radius * 2 + 1;
  const area = diameter * diameter;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let sum = 0;
      for (let dy = -radius; dy <= radius; dy += 1) {
        const yy = Math.max(0, Math.min(height - 1, y + dy));
        for (let dx = -radius; dx <= radius; dx += 1) {
          const xx = Math.max(0, Math.min(width - 1, x + dx));
          sum += mask[yy * width + xx];
        }
      }
      next[y * width + x] = clamp8(sum / area);
    }
  }
  return next;
}
function maskToImageData(imageData, mask) {
  const next = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
  for (let i = 0, p = 0; i < next.data.length; i += 4, p += 1) {
    next.data[i + 3] = mask[p];
  }
  return next;
}
function subjectBoxFromMask(mask, width, height, alphaThreshold) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (mask[y * width + x] < alphaThreshold) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < minX || maxY < minY) {
    return {
      x: 0,
      y: 0,
      width,
      height,
      confidence: 0
    };
  }
  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    confidence: 1
  };
}
function centerFrameOnCanvas(args) {
  const { frame, targetWidth, targetHeight, keepFrameSize, subjectBox } = args;
  const outWidth = keepFrameSize ? frame.width : targetWidth;
  const outHeight = keepFrameSize ? frame.height : targetHeight;
  const canvas = document.createElement("canvas");
  canvas.width = outWidth;
  canvas.height = outHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return {
      imageData: frame.imageData,
      width: frame.width,
      height: frame.height,
      anchor: {
        x: frame.width / 2,
        y: frame.height / 2,
        confidence: 0,
        label: "fallback-center"
      }
    };
  }
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = frame.width;
  sourceCanvas.height = frame.height;
  const sctx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!sctx) {
    return {
      imageData: frame.imageData,
      width: frame.width,
      height: frame.height,
      anchor: {
        x: frame.width / 2,
        y: frame.height / 2,
        confidence: 0,
        label: "fallback-center"
      }
    };
  }
  sctx.putImageData(frame.imageData, 0, 0);
  const box = subjectBox ?? {
    x: 0,
    y: 0,
    width: frame.width,
    height: frame.height
  };
  const sourceCenterX = box.x + box.width / 2;
  const sourceCenterY = box.y + box.height / 2;
  const targetCenterX = outWidth / 2;
  const targetCenterY = outHeight / 2;
  const dx = targetCenterX - sourceCenterX;
  const dy = targetCenterY - sourceCenterY;
  ctx.clearRect(0, 0, outWidth, outHeight);
  ctx.drawImage(sourceCanvas, dx, dy);
  return {
    imageData: ctx.getImageData(0, 0, outWidth, outHeight),
    width: outWidth,
    height: outHeight,
    anchor: {
      x: targetCenterX,
      y: targetCenterY,
      confidence: 1,
      label: "subject-center"
    }
  };
}
function createFlatBackgroundSpritePreprocess(options) {
  const tolerance = Math.max(0, Math.min(441, options.keyTolerance ?? 42));
  const featherRadius = Math.max(
    0,
    Math.min(4, Math.round(options.featherRadius ?? 1))
  );
  const alphaThreshold = Math.max(
    0,
    Math.min(255, Math.round(options.alphaThreshold ?? 18))
  );
  return {
    enabled: true,
    stages: [
      {
        id: "segment-foreground",
        run: (frame) => {
          const computedKey = options.keyColor ?? estimateCornerKeyColor(frame.imageData);
          const rawMask = applyChromaKeyMask({
            imageData: frame.imageData,
            keyColor: computedKey,
            tolerance
          });
          const smoothMask = featherMask(
            rawMask,
            frame.width,
            frame.height,
            featherRadius
          );
          const imageData = maskToImageData(frame.imageData, smoothMask);
          const subjectBox = subjectBoxFromMask(
            smoothMask,
            frame.width,
            frame.height,
            alphaThreshold
          );
          return {
            imageData,
            preprocess: {
              alphaMask: smoothMask,
              subjectBox,
              diagnostics: {
                stage: "segment-foreground",
                keyColor: computedKey,
                tolerance
              }
            }
          };
        }
      },
      {
        id: "center-canvas",
        run: (frame) => {
          const centered = centerFrameOnCanvas({
            frame,
            targetWidth: options.targetWidth,
            targetHeight: options.targetHeight,
            keepFrameSize: options.keepFrameSize ?? false,
            subjectBox: frame.preprocess?.subjectBox
          });
          return {
            imageData: centered.imageData,
            width: centered.width,
            height: centered.height,
            preprocess: {
              ...frame.preprocess ?? {},
              anchor: centered.anchor
            }
          };
        }
      }
    ]
  };
}
var PreprocessPipeline = class {
  static async run(timeline, options) {
    const enabled = options?.enabled !== false;
    const stages = enabled ? options?.stages ?? [] : [];
    if (!enabled || stages.length === 0 || timeline.frames.length === 0) {
      return {
        timeline,
        report: {
          enabled,
          stagesRun: stages.map((stage) => stage.id),
          frameCount: timeline.frames.length
        }
      };
    }
    const frames = [];
    for (let frameIndex = 0; frameIndex < timeline.frames.length; frameIndex += 1) {
      let nextFrame = cloneFrame(timeline.frames[frameIndex]);
      for (const stage of stages) {
        const result = await stage.run(nextFrame, {
          stageId: stage.id,
          frameIndex,
          frameCount: timeline.frames.length,
          timeline
        });
        if (!result) continue;
        if (result.imageData) {
          nextFrame.imageData = result.imageData;
        }
        if (typeof result.width === "number") {
          nextFrame.width = Math.max(1, Math.round(result.width));
        }
        if (typeof result.height === "number") {
          nextFrame.height = Math.max(1, Math.round(result.height));
        }
        if (result.preprocess) {
          nextFrame.preprocess = {
            ...nextFrame.preprocess ?? {},
            ...result.preprocess
          };
        }
      }
      frames.push({
        ...nextFrame,
        index: frames.length
      });
    }
    const processedTimeline = {
      ...timeline,
      id: `${timeline.id}-preprocessed`,
      frames
    };
    return {
      timeline: processedTimeline,
      report: {
        enabled: true,
        stagesRun: stages.map((stage) => stage.id),
        frameCount: frames.length
      }
    };
  }
};

// src/pipeline/SpriteAtlasExporter.ts
function ceilDiv(a, b) {
  return Math.floor((a + b - 1) / b);
}
var SpriteAtlasExporter = class {
  static async exportTimeline(timeline, options = {}) {
    if (!timeline.frames.length) {
      throw new Error("Cannot export atlas from empty timeline");
    }
    const framePadding = options.framePadding ?? 2;
    const maxAtlasWidth = options.maxAtlasWidth ?? 4096;
    const maxAtlasHeight = options.maxAtlasHeight ?? 4096;
    const frameScale = Math.max(0.1, options.frameScale ?? 1);
    const fitMode = options.fitMode ?? "contain";
    const backgroundFill = options.backgroundFill ?? "";
    const frameWidth = Math.max(...timeline.frames.map((f) => f.width));
    const frameHeight = Math.max(...timeline.frames.map((f) => f.height));
    const scaledFrameWidth = Math.max(1, Math.round(frameWidth * frameScale));
    const scaledFrameHeight = Math.max(1, Math.round(frameHeight * frameScale));
    const targetFrameWidth = Math.max(
      1,
      Math.round(options.targetFrameWidth ?? scaledFrameWidth)
    );
    const targetFrameHeight = Math.max(
      1,
      Math.round(options.targetFrameHeight ?? scaledFrameHeight)
    );
    const cellWidth = targetFrameWidth + framePadding * 2;
    const cellHeight = targetFrameHeight + framePadding * 2;
    const columns = Math.max(1, Math.floor(maxAtlasWidth / cellWidth));
    const rows = ceilDiv(timeline.frames.length, columns);
    const atlasWidth = Math.min(maxAtlasWidth, columns * cellWidth);
    const atlasHeight = rows * cellHeight;
    if (atlasHeight > maxAtlasHeight) {
      throw new Error(
        `Atlas height ${atlasHeight}px exceeds max ${maxAtlasHeight}px. Reduce frame count or increase limits.`
      );
    }
    const canvas = document.createElement("canvas");
    canvas.width = atlasWidth;
    canvas.height = atlasHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      throw new Error("Failed to acquire canvas context for atlas export");
    }
    ctx.clearRect(0, 0, atlasWidth, atlasHeight);
    const frames = timeline.frames.map((frame, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = column * cellWidth + framePadding;
      const y = row * cellHeight + framePadding;
      const frameCanvas = document.createElement("canvas");
      frameCanvas.width = frame.width;
      frameCanvas.height = frame.height;
      const frameCtx = frameCanvas.getContext("2d");
      if (!frameCtx) {
        throw new Error("Failed to acquire frame canvas context");
      }
      frameCtx.putImageData(frame.imageData, 0, 0);
      if (backgroundFill) {
        ctx.fillStyle = backgroundFill;
        ctx.fillRect(x, y, targetFrameWidth, targetFrameHeight);
      }
      const scaleX = targetFrameWidth / frame.width * frameScale;
      const scaleY = targetFrameHeight / frame.height * frameScale;
      const scale = fitMode === "cover" ? Math.max(scaleX, scaleY) : fitMode === "contain" ? Math.min(scaleX, scaleY) : 1;
      const drawWidth = fitMode === "stretch" ? targetFrameWidth : frame.width * scale;
      const drawHeight = fitMode === "stretch" ? targetFrameHeight : frame.height * scale;
      const drawX = x + (targetFrameWidth - drawWidth) / 2;
      const drawY = y + (targetFrameHeight - drawHeight) / 2;
      if (fitMode === "cover") {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, targetFrameWidth, targetFrameHeight);
        ctx.clip();
        ctx.drawImage(frameCanvas, drawX, drawY, drawWidth, drawHeight);
        ctx.restore();
      } else {
        ctx.drawImage(frameCanvas, drawX, drawY, drawWidth, drawHeight);
      }
      return {
        index,
        x,
        y,
        width: targetFrameWidth,
        height: targetFrameHeight,
        durationMs: frame.durationMs,
        timestampMs: frame.timestampMs
      };
    });
    const manifest = {
      version: "1.0.0",
      frameCount: timeline.frames.length,
      atlasWidth,
      atlasHeight,
      frameWidth: targetFrameWidth,
      frameHeight: targetFrameHeight,
      framePadding,
      cellWidth,
      cellHeight,
      columns,
      rows,
      clips: options.clipName ? [
        {
          name: options.clipName,
          startFrame: 0,
          endFrame: timeline.frames.length - 1
        }
      ] : timeline.clips,
      frames
    };
    const imageType = options.imageType ?? "image/png";
    const imageQuality = options.imageQuality ?? 0.92;
    const imageBlob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to encode atlas image"));
            return;
          }
          resolve(blob);
        },
        imageType,
        imageQuality
      );
    });
    return { imageBlob, manifest };
  }
};

// src/pipeline/VideoFrameExtractor.ts
function waitForEvent(target, eventName) {
  return new Promise((resolve, reject) => {
    const onResolve = () => {
      cleanup();
      resolve();
    };
    const onReject = () => {
      cleanup();
      reject(new Error(`Video event failed: ${eventName}`));
    };
    const cleanup = () => {
      target.removeEventListener(eventName, onResolve);
      target.removeEventListener("error", onReject);
    };
    target.addEventListener(eventName, onResolve, {
      once: true
    });
    target.addEventListener("error", onReject, { once: true });
  });
}
var VideoFrameExtractor = class {
  static async extractFrames(options, timelineId = "video-timeline") {
    const {
      src,
      fps = 12,
      startMs = 0,
      endMs,
      maxFrames = 240,
      crossOrigin = "anonymous"
    } = options;
    if (!src) {
      throw new Error("Video source is required");
    }
    const video = document.createElement("video");
    video.preload = "auto";
    video.crossOrigin = crossOrigin;
    video.muted = true;
    video.playsInline = true;
    video.src = src;
    await waitForEvent(video, "loadedmetadata");
    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) {
      throw new Error("Failed to load video dimensions");
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      throw new Error("Failed to acquire canvas context for video extraction");
    }
    const effectiveEndMs = Math.max(
      startMs,
      endMs ?? Math.floor(video.duration * 1e3)
    );
    const intervalMs = Math.max(1, Math.floor(1e3 / fps));
    const frames = [];
    let t = Math.max(0, startMs);
    while (t <= effectiveEndMs && frames.length < maxFrames) {
      video.currentTime = t / 1e3;
      await waitForEvent(video, "seeked");
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(video, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      frames.push({
        index: frames.length,
        timestampMs: t,
        durationMs: intervalMs,
        width,
        height,
        imageData
      });
      t += intervalMs;
    }
    if (!frames.length) {
      throw new Error("No frames extracted from video source");
    }
    const totalDurationMs = frames.reduce(
      (sum, frame) => sum + frame.durationMs,
      0
    );
    const clip = {
      name: "full",
      startFrame: 0,
      endFrame: frames.length - 1
    };
    return {
      id: timelineId,
      sourceKind: "video",
      fps,
      durationMs: totalDurationMs,
      width,
      height,
      frames,
      clips: [clip]
    };
  }
};

// src/pipeline/TimelineBuilder.ts
function normalizePatch(patch) {
  if (patch.buffer instanceof ArrayBuffer) {
    return patch;
  }
  return new Uint8ClampedArray(patch);
}
function createTimeline(id, sourceKind, frames, width, height) {
  const durationMs = frames.reduce((sum, frame) => sum + frame.durationMs, 0);
  const fps = frames.length > 0 && durationMs > 0 ? Math.max(1, Math.round(frames.length * 1e3 / durationMs)) : 1;
  const clip = {
    name: "full",
    startFrame: 0,
    endFrame: Math.max(0, frames.length - 1)
  };
  return {
    id,
    sourceKind,
    fps,
    durationMs,
    width,
    height,
    frames,
    clips: [clip]
  };
}
var TimelineBuilder = class {
  static fromGifFrames(frames, id = "gif-timeline") {
    if (!frames.length) {
      throw new Error("No GIF frames provided");
    }
    let timestampMs = 0;
    const timelineFrames = frames.map((frame, index) => {
      const durationMs = Math.max(10, Number(frame.delay) || 100);
      const imageData = new ImageData(
        normalizePatch(frame.patch),
        frame.dims.width,
        frame.dims.height
      );
      const out = {
        index,
        timestampMs,
        durationMs,
        width: frame.dims.width,
        height: frame.dims.height,
        imageData
      };
      timestampMs += durationMs;
      return out;
    });
    const first = timelineFrames[0];
    return createTimeline(id, "gif", timelineFrames, first.width, first.height);
  }
  static async fromImageSource(source, id = "image-timeline", durationMs = 1e3) {
    const width = source.width || source.width;
    const height = source.height || source.height;
    if (!width || !height) {
      throw new Error("Unable to derive dimensions from image source");
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      throw new Error("Failed to acquire 2D context for image timeline");
    }
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(source, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    return createTimeline(
      id,
      "image",
      [
        {
          index: 0,
          timestampMs: 0,
          durationMs: Math.max(1, durationMs),
          width,
          height,
          imageData
        }
      ],
      width,
      height
    );
  }
  static async fromVideo(options, id = "video-timeline") {
    return VideoFrameExtractor.extractFrames(options, id);
  }
};

// src/pipeline/VeraShellExporter.ts
var DEFAULT_CLIP_TO_EXPRESSION = {
  normal: "idle",
  focused: "walk",
  tired: "walk",
  alarmed: "react",
  sleeping: "blink",
  offline: "react"
};
function frameToSheetCell(frameIndex, columns) {
  return [frameIndex % columns, Math.floor(frameIndex / columns)];
}
function downsampleTimeline(timeline, stride) {
  if (stride <= 1) return timeline;
  const frames = [];
  for (let i = 0; i < timeline.frames.length; i += stride) {
    const chunk = timeline.frames.slice(i, i + stride);
    if (!chunk.length) continue;
    const durationMs = chunk.reduce((sum, frame) => sum + frame.durationMs, 0);
    const first = chunk[0];
    frames.push({
      ...first,
      index: frames.length,
      durationMs
    });
  }
  const maxFrame = Math.max(0, frames.length - 1);
  const clips = timeline.clips.map((clip) => {
    const startFrame = Math.min(maxFrame, Math.floor(clip.startFrame / stride));
    const endFrame = Math.min(maxFrame, Math.floor(clip.endFrame / stride));
    return {
      ...clip,
      startFrame: Math.min(startFrame, endFrame),
      endFrame: Math.max(startFrame, endFrame)
    };
  });
  return {
    ...timeline,
    id: `${timeline.id}-ds${stride}`,
    fps: timeline.fps / stride,
    frames,
    clips
  };
}
var VeraShellExporter = class {
  static async exportSpriteSheet(timeline, options) {
    const preprocessResult = await PreprocessPipeline.run(
      timeline,
      options.preprocess
    );
    const preprocessTimeline = preprocessResult.timeline;
    const maxFrames = options.maxFrames ?? 0;
    const frameStrideOption = options.frameStride ?? 1;
    const computedStride = maxFrames > 0 ? Math.max(
      frameStrideOption,
      Math.ceil(preprocessTimeline.frames.length / maxFrames)
    ) : frameStrideOption;
    const exportTimeline = downsampleTimeline(
      preprocessTimeline,
      computedStride
    );
    const atlas = await SpriteAtlasExporter.exportTimeline(
      exportTimeline,
      options
    );
    const clipPlan = NamedClipPlanner.summarize(exportTimeline);
    const clipStarts = /* @__PURE__ */ new Map();
    for (const clip of clipPlan) {
      clipStarts.set(clip.name, clip.startFrame);
    }
    const mapping = {
      ...DEFAULT_CLIP_TO_EXPRESSION,
      ...options.clipToExpression ?? {}
    };
    const frames = {};
    for (const expression of Object.keys(mapping)) {
      const clipName = mapping[expression];
      const start = clipStarts.get(clipName) ?? 0;
      frames[expression] = frameToSheetCell(start, atlas.manifest.columns);
    }
    const spriteConfig = {
      type: "sheet",
      url: options.atlasUrl,
      cellWidth: atlas.manifest.cellWidth,
      cellHeight: atlas.manifest.cellHeight,
      frames
    };
    const pixelMatrix = options.pixelMatrix?.enabled ? PixelMatrixExporter.exportTimeline(exportTimeline, options.pixelMatrix) : void 0;
    return {
      ...atlas,
      veraShellManifest: {
        schema: "vera-shell.sprite-sheet.v1",
        timelineId: exportTimeline.id,
        atlas: atlas.manifest,
        sprite: spriteConfig,
        clips: clipPlan.map((clip) => ({
          name: clip.name,
          startFrame: clip.startFrame,
          endFrame: clip.endFrame,
          durationMs: clip.durationMs
        }))
      },
      pixelMatrix,
      preprocess: preprocessResult.report
    };
  }
};

// src/QuantumManager/src/config/constants.ts
var BaseURL = "https://apefathersnft.nyc3.cdn.digitaloceanspaces.com";
var S3_BUCKET = `${BaseURL}/afbgless`;
var BASE_URL = `${BaseURL}/afnft/public`;
var CONTRACT_ADDRESS = getEnvString(
  "NEXT_PUBLIC_APEFATHERS_ADDRESS",
  "0xE128cA01CcEb08f1b0a58C628d841Bc0EF0A4b80"
);

// src/services/ProcessingService.ts
var ProcessingService = class {
  gifProcessor;
  canvasPool;
  CONSTANTS = {
    TARGET_SIZE: 2800
  };
  canvasRefs;
  constructor() {
    this.gifProcessor = GIFProcessor.getInstance();
    this.canvasPool = new CanvasPool();
    this.canvasRefs = Array.from(
      { length: 4 },
      () => this.canvasPool.getCanvas(
        this.CONSTANTS.TARGET_SIZE,
        this.CONSTANTS.TARGET_SIZE,
        false
      )
    );
  }
  async processImage(tokenId, background, overlays, format) {
    if (background !== null && background?.format.includes("gif")) {
      return this.processGIF(tokenId, background, overlays);
    } else {
      return this.processStatic(tokenId, background, overlays, format);
    }
  }
  calculateGifFitDimensions(frame) {
    const { width: frameWidth, height: frameHeight } = frame.dims;
    const targetSize = this.CONSTANTS.TARGET_SIZE;
    const frameAspectRatio = frameWidth / frameHeight;
    let scaledWidth = targetSize;
    let scaledHeight = targetSize;
    let sourceX = 0, sourceY = 0, sourceWidth = frameWidth, sourceHeight = frameHeight;
    if (frameAspectRatio > 1) {
      sourceWidth = Math.round(frameHeight * targetSize / targetSize);
      sourceX = Math.round((frameWidth - sourceWidth) / 2);
    } else if (frameAspectRatio < 1) {
      sourceHeight = Math.round(frameWidth * targetSize / targetSize);
      sourceY = Math.round((frameHeight - sourceHeight) / 2);
    }
    return {
      width: scaledWidth,
      height: scaledHeight,
      x: 0,
      // Centered in target canvas
      y: 0,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight
    };
  }
  detectPixelArt(frame) {
    if (!frame.patch || !frame.dims) return false;
    const { width, height } = frame.dims;
    const totalPixels = width * height;
    const uniqueColors = /* @__PURE__ */ new Set();
    let transparentPixelCount = 0;
    for (let i = 0; i < frame.patch.length; i += 4) {
      if (frame.patch[i + 3] === 0) {
        transparentPixelCount++;
        continue;
      }
      const color = `${frame.patch[i]},${frame.patch[i + 1]},${frame.patch[i + 2]}`;
      uniqueColors.add(color);
    }
    const transparencyRatio = transparentPixelCount / totalPixels;
    const colorDensityRatio = uniqueColors.size / totalPixels;
    const isSmallDimension = totalPixels <= 512 * 512;
    const hasLowColorDensity = colorDensityRatio < 0.15;
    const hasHighTransparency = transparencyRatio >= 0.2;
    return isSmallDimension && (hasLowColorDensity || hasHighTransparency);
  }
  async processGIF(tokenId, background, overlays) {
    const bglessUrl = `${S3_BUCKET}/${tokenId}.png`;
    const frames = await this.gifProcessor.extractFrames(background.url);
    const isPixelArt = this.detectPixelArt(frames[0]);
    const quality = isPixelArt ? "PIXEL" : "HIGH";
    return this.gifProcessor.generateGIF(frames, bglessUrl, overlays, quality, {
      optimizeFrames: !isPixelArt,
      disposeToBackground: isPixelArt
    });
  }
  loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = (error) => {
        console.error(`Failed to load image: ${src}`, error);
        reject(error);
      };
      image.src = src;
    });
  };
  async processStatic(tokenId, background, overlays, format, index = 0) {
    const canvas = this.canvasRefs[index];
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (background === null && overlays === null) {
      throw new Error("No background or overlays selected");
    }
    if (!context) {
      throw new Error("Failed to get canvas context");
    }
    if (background) {
      const backgroundImage = await this.loadImage(background.url);
      context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }
    const backgroundlessImage = await this.loadImage(
      `${S3_BUCKET}/${tokenId}.png`
    );
    context.drawImage(backgroundlessImage, 0, 0, canvas.width, canvas.height);
    if (overlays !== null) {
      for (const overlay of overlays) {
        const overlayImage = await this.loadImage(overlay.url);
        context.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);
      }
    }
    const bgName = background?.name || "no-bg";
    const overlayNames = (overlays ?? []).length > 0 ? `_${overlays.map((o) => o?.name ?? "").join("-")}` : "";
    const fileName = `AF${tokenId}_${bgName}${overlayNames}.${format}`;
    const dataUrl = canvas.toDataURL(`image/${format}`);
    this.downloadDataUrl(dataUrl, fileName);
    const response = await fetch(dataUrl);
    return response.blob();
  }
  downloadBlob = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    requestAnimationFrame(() => {
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 5e3);
    });
  };
  downloadDataUrl = (dataUrl, fileName) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    requestAnimationFrame(() => {
      link.click();
      document.body.removeChild(link);
    });
  };
};

// src/services/QualityAnalyzerService.ts
var QualityAnalyzerService = class _QualityAnalyzerService {
  static qaInstance = null;
  gifAnalyzer;
  qualityManager;
  constructor() {
    this.gifAnalyzer = GifAnalyzer.getInstance();
    this.qualityManager = new QualityManager();
  }
  getInstance() {
    if (!_QualityAnalyzerService.qaInstance) {
      _QualityAnalyzerService.qaInstance = new _QualityAnalyzerService();
    }
    return _QualityAnalyzerService.qaInstance;
  }
  destroyInstance() {
    this.gifAnalyzer.destroyInstance();
    _QualityAnalyzerService.qaInstance = null;
  }
  async analyzeGif(url) {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      const metadata = await this.gifAnalyzer.analyzeGIF(buffer);
      const recommendedQuality = this.qualityManager.selectOptimalQuality(metadata);
      return {
        recommendedQuality,
        frameCount: metadata.frames,
        width: metadata.width,
        height: metadata.height,
        fps: Math.round(1e3 / Math.max(...metadata.frameExtras.frameDelays)),
        fileSize: buffer.byteLength,
        isPixelArt: metadata.isPixelArt,
        hasTransparency: metadata.hasTransparency,
        colorDepth: metadata.colorDepth
      };
    } catch (error) {
      console.error("Error analyzing GIF:", error);
      throw new Error("Failed to analyze GIF");
    }
  }
  cleanup() {
    this.gifAnalyzer.destroyInstance();
  }
};
var qualityAnalyzerService = new QualityAnalyzerService().getInstance();

// src/tasks/scanforgePreprocess.ts
var SCANFORGE_PREPROCESS_TASKS = {
  MATRIX_SPLIT: "scanforge.matrix.split",
  IMAGE_ALIGN: "scanforge.image.align",
  PREVIEW_GENERATE: "scanforge.preview.generate"
};
function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function clamp01(value) {
  return clampNumber(value, 0, 1);
}
function pixelOffset(width, x, y) {
  return (y * width + x) * 4;
}
function createImage(width, height, fillColor = [0, 0, 0, 0], label) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let index = 0; index < data.length; index += 4) {
    data[index] = fillColor[0];
    data[index + 1] = fillColor[1];
    data[index + 2] = fillColor[2];
    data[index + 3] = fillColor[3];
  }
  return { width, height, data, label };
}
function cropImage(image, x, y, width, height, label) {
  const cropped = new Uint8ClampedArray(width * height * 4);
  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const sourceOffset = pixelOffset(image.width, x + col, y + row);
      const targetOffset = pixelOffset(width, col, row);
      cropped[targetOffset] = image.data[sourceOffset];
      cropped[targetOffset + 1] = image.data[sourceOffset + 1];
      cropped[targetOffset + 2] = image.data[sourceOffset + 2];
      cropped[targetOffset + 3] = image.data[sourceOffset + 3];
    }
  }
  return { width, height, data: cropped, label };
}
function isBackgroundPixel(image, x, y, alphaThreshold, colorKey, colorTolerance = 24) {
  const offset = pixelOffset(image.width, x, y);
  const alpha = image.data[offset + 3];
  if (alpha <= alphaThreshold) {
    return true;
  }
  if (!colorKey) {
    return false;
  }
  const dr = image.data[offset] - colorKey[0];
  const dg = image.data[offset + 1] - colorKey[1];
  const db = image.data[offset + 2] - colorKey[2];
  const distance = Math.sqrt(dr * dr + dg * dg + db * db);
  return distance <= colorTolerance;
}
function detectSubjectBounds(image, alphaThreshold, colorKey, colorTolerance) {
  let minX = image.width;
  let minY = image.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      if (isBackgroundPixel(image, x, y, alphaThreshold, colorKey, colorTolerance)) {
        continue;
      }
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < minX || maxY < minY) {
    return { x: 0, y: 0, width: image.width, height: image.height };
  }
  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  };
}
function trimSubjectBounds(subjectBox, trimPx = 0) {
  if (trimPx <= 0) {
    return subjectBox;
  }
  const maxTrimX = Math.max(0, Math.floor((subjectBox.width - 1) / 2));
  const maxTrimY = Math.max(0, Math.floor((subjectBox.height - 1) / 2));
  const safeTrimX = Math.min(trimPx, maxTrimX);
  const safeTrimY = Math.min(trimPx, maxTrimY);
  return {
    x: subjectBox.x + safeTrimX,
    y: subjectBox.y + safeTrimY,
    width: Math.max(1, subjectBox.width - safeTrimX * 2),
    height: Math.max(1, subjectBox.height - safeTrimY * 2)
  };
}
function computeAlignPlacement(args) {
  const safePadding = Math.max(0, args.padding ?? 0);
  const safeAnchorX = clamp01(args.anchorX ?? 0.5);
  const safeAnchorY = clamp01(args.anchorY ?? 0.5);
  const fitCoverage = clamp01(args.coverage ?? 0.92);
  const subjectScale = Math.max(0.01, args.subjectScale ?? 1);
  const availableWidth = Math.max(1, args.targetWidth - safePadding * 2);
  const availableHeight = Math.max(1, args.targetHeight - safePadding * 2);
  const maxFitScale = Math.min(
    availableWidth / Math.max(1, args.subjectWidth),
    availableHeight / Math.max(1, args.subjectHeight)
  );
  const scale = args.scaleOverride ?? maxFitScale * clampNumber(fitCoverage * subjectScale, 0.01, 1);
  const drawWidth = Math.max(1, Math.floor(args.subjectWidth * scale));
  const drawHeight = Math.max(1, Math.floor(args.subjectHeight * scale));
  const minOffsetX = safePadding;
  const minOffsetY = safePadding;
  const maxOffsetX = Math.max(
    safePadding,
    args.targetWidth - safePadding - drawWidth
  );
  const maxOffsetY = Math.max(
    safePadding,
    args.targetHeight - safePadding - drawHeight
  );
  const offsetX = Math.round(
    clampNumber(
      safeAnchorX * args.targetWidth - drawWidth / 2,
      minOffsetX,
      maxOffsetX
    )
  );
  const offsetY = Math.round(
    clampNumber(
      safeAnchorY * args.targetHeight - drawHeight / 2,
      minOffsetY,
      maxOffsetY
    )
  );
  return {
    offsetX,
    offsetY,
    drawWidth,
    drawHeight,
    scale
  };
}
function alignImageToPlacement(args) {
  const cropped = cropImage(
    args.image,
    args.subjectBox.x,
    args.subjectBox.y,
    args.subjectBox.width,
    args.subjectBox.height,
    args.image.label
  );
  const target = createImage(
    args.targetWidth,
    args.targetHeight,
    args.fillColor ?? [0, 0, 0, 0],
    args.image.label
  );
  drawScaledImage(
    cropped,
    target,
    args.placement.offsetX,
    args.placement.offsetY,
    args.placement.drawWidth,
    args.placement.drawHeight
  );
  return target;
}
function drawScaledImage(source, target, destinationX, destinationY, destinationWidth, destinationHeight) {
  for (let y = 0; y < destinationHeight; y += 1) {
    for (let x = 0; x < destinationWidth; x += 1) {
      const sourceX = Math.min(
        source.width - 1,
        Math.max(0, Math.floor(x / destinationWidth * source.width))
      );
      const sourceY = Math.min(
        source.height - 1,
        Math.max(0, Math.floor(y / destinationHeight * source.height))
      );
      const sourceOffset = pixelOffset(source.width, sourceX, sourceY);
      const targetOffset = pixelOffset(
        target.width,
        destinationX + x,
        destinationY + y
      );
      target.data[targetOffset] = source.data[sourceOffset];
      target.data[targetOffset + 1] = source.data[sourceOffset + 1];
      target.data[targetOffset + 2] = source.data[sourceOffset + 2];
      target.data[targetOffset + 3] = source.data[sourceOffset + 3];
    }
  }
}
function splitMatrix(input) {
  const gapX = input.gapX ?? 0;
  const gapY = input.gapY ?? 0;
  const marginX = input.marginX ?? 0;
  const marginY = input.marginY ?? 0;
  const cellWidth = input.cellWidth ?? Math.floor(
    (input.image.width - marginX * 2 - gapX * (input.cols - 1)) / input.cols
  );
  const cellHeight = input.cellHeight ?? Math.floor(
    (input.image.height - marginY * 2 - gapY * (input.rows - 1)) / input.rows
  );
  const cells = [];
  for (let row = 0; row < input.rows; row += 1) {
    for (let col = 0; col < input.cols; col += 1) {
      const x = marginX + col * (cellWidth + gapX);
      const y = marginY + row * (cellHeight + gapY);
      cells.push({
        id: `r${row}c${col}`,
        row,
        col,
        x,
        y,
        image: cropImage(
          input.image,
          x,
          y,
          cellWidth,
          cellHeight,
          `r${row}c${col}`
        )
      });
    }
  }
  return {
    task: SCANFORGE_PREPROCESS_TASKS.MATRIX_SPLIT,
    rows: input.rows,
    cols: input.cols,
    cellWidth,
    cellHeight,
    cells
  };
}
function alignImage(input) {
  const alphaThreshold = input.alphaThreshold ?? 8;
  const subjectBox = trimSubjectBounds(
    detectSubjectBounds(
      input.image,
      alphaThreshold,
      input.colorKey,
      input.colorTolerance
    ),
    input.trimPx ?? 0
  );
  const placement = computeAlignPlacement({
    subjectWidth: subjectBox.width,
    subjectHeight: subjectBox.height,
    targetWidth: input.targetWidth,
    targetHeight: input.targetHeight,
    padding: input.padding,
    anchorX: input.anchorX,
    anchorY: input.anchorY,
    coverage: input.coverage,
    subjectScale: input.subjectScale
  });
  const target = alignImageToPlacement({
    image: input.image,
    subjectBox,
    targetWidth: input.targetWidth,
    targetHeight: input.targetHeight,
    fillColor: input.fillColor,
    placement
  });
  return {
    task: SCANFORGE_PREPROCESS_TASKS.IMAGE_ALIGN,
    image: target,
    subjectBox,
    offsetX: placement.offsetX,
    offsetY: placement.offsetY,
    scale: placement.scale,
    drawWidth: placement.drawWidth,
    drawHeight: placement.drawHeight
  };
}
function alignImageSet(input) {
  if (input.images.length === 0) {
    return {
      images: [],
      subjectBoxes: [],
      placements: [],
      sharedScale: 1
    };
  }
  const alphaThreshold = input.alphaThreshold ?? 8;
  const subjectBoxes = input.images.map(
    (image) => trimSubjectBounds(
      detectSubjectBounds(
        image,
        alphaThreshold,
        input.colorKey,
        input.colorTolerance
      ),
      input.trimPx ?? 0
    )
  );
  const maxSubjectWidth = Math.max(...subjectBoxes.map((box) => box.width));
  const maxSubjectHeight = Math.max(...subjectBoxes.map((box) => box.height));
  const sharedPlacement = computeAlignPlacement({
    subjectWidth: maxSubjectWidth,
    subjectHeight: maxSubjectHeight,
    targetWidth: input.targetWidth,
    targetHeight: input.targetHeight,
    padding: input.padding,
    anchorX: input.anchorX,
    anchorY: input.anchorY,
    coverage: input.coverage,
    subjectScale: input.subjectScale
  });
  const placements = subjectBoxes.map(
    (subjectBox) => computeAlignPlacement({
      subjectWidth: subjectBox.width,
      subjectHeight: subjectBox.height,
      targetWidth: input.targetWidth,
      targetHeight: input.targetHeight,
      padding: input.padding,
      anchorX: input.anchorX,
      anchorY: input.anchorY,
      scaleOverride: sharedPlacement.scale
    })
  );
  const images = input.images.map(
    (image, index) => alignImageToPlacement({
      image,
      subjectBox: subjectBoxes[index],
      targetWidth: input.targetWidth,
      targetHeight: input.targetHeight,
      fillColor: input.fillColor,
      placement: placements[index]
    })
  );
  return {
    images,
    subjectBoxes,
    placements,
    sharedScale: sharedPlacement.scale
  };
}
function generatePreview(input) {
  if (input.images.length === 0) {
    throw new Error("preview.generate requires at least one image");
  }
  const padding = input.padding ?? 8;
  const cellWidth = input.cellWidth ?? Math.max(...input.images.map((image) => image.width));
  const cellHeight = input.cellHeight ?? Math.max(...input.images.map((image) => image.height));
  const columns = input.columns ?? Math.max(1, Math.ceil(Math.sqrt(input.images.length)));
  const rows = Math.ceil(input.images.length / columns);
  const preview = createImage(
    columns * cellWidth + (columns + 1) * padding,
    rows * cellHeight + (rows + 1) * padding,
    input.fillColor ?? [18, 20, 24, 255],
    "scanforge-preview"
  );
  const placements = input.images.map((image, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const scale = Math.min(cellWidth / image.width, cellHeight / image.height);
    const width = Math.max(1, Math.floor(image.width * scale));
    const height = Math.max(1, Math.floor(image.height * scale));
    const x = padding + column * (cellWidth + padding) + Math.floor((cellWidth - width) / 2);
    const y = padding + row * (cellHeight + padding) + Math.floor((cellHeight - height) / 2);
    drawScaledImage(image, preview, x, y, width, height);
    return { index, x, y, width, height };
  });
  return {
    task: SCANFORGE_PREPROCESS_TASKS.PREVIEW_GENERATE,
    image: preview,
    placements,
    columns,
    rows
  };
}
function registerScanForgePreprocessTasks(registry) {
  registry.register(SCANFORGE_PREPROCESS_TASKS.MATRIX_SPLIT, splitMatrix);
  registry.register(SCANFORGE_PREPROCESS_TASKS.IMAGE_ALIGN, alignImage);
  registry.register(
    SCANFORGE_PREPROCESS_TASKS.PREVIEW_GENERATE,
    generatePreview
  );
}

// ../../node_modules/.pnpm/@ffmpeg+ffmpeg@0.12.15/node_modules/@ffmpeg/ffmpeg/dist/esm/empty.mjs
var FFmpeg = class {
  constructor() {
    throw new Error("ffmpeg.wasm does not support nodejs");
  }
};

// ../../node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/errors.js
var ERROR_RESPONSE_BODY_READER = new Error("failed to get response body reader");
var ERROR_INCOMPLETED_DOWNLOAD = new Error("failed to complete download");

// ../../node_modules/.pnpm/@ffmpeg+util@0.12.2/node_modules/@ffmpeg/util/dist/esm/index.js
var readFromBlobOrFile = (blob) => new Promise((resolve, reject) => {
  const fileReader = new FileReader();
  fileReader.onload = () => {
    const { result } = fileReader;
    if (result instanceof ArrayBuffer) {
      resolve(new Uint8Array(result));
    } else {
      resolve(new Uint8Array());
    }
  };
  fileReader.onerror = (event) => {
    reject(Error(`File could not be read! Code=${event?.target?.error?.code || -1}`));
  };
  fileReader.readAsArrayBuffer(blob);
});
var fetchFile = async (file) => {
  let data;
  if (typeof file === "string") {
    if (/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(file)) {
      data = atob(file.split(",")[1]).split("").map((c) => c.charCodeAt(0));
    } else {
      data = await (await fetch(file)).arrayBuffer();
    }
  } else if (file instanceof URL) {
    data = await (await fetch(file)).arrayBuffer();
  } else if (file instanceof File || file instanceof Blob) {
    data = await readFromBlobOrFile(file);
  } else {
    return new Uint8Array();
  }
  return new Uint8Array(data);
};

// src/utils/GifCompressor.ts
var import_gif_js2 = __toESM(require_gif2());
async function autoCompressGIF(inputBlob, maxSizeMb = 10) {
  let widthScale = 1;
  let fps = 24;
  let quality = 10;
  let compressedBlob = inputBlob;
  let iteration = 0;
  while (compressedBlob.size > maxSizeMb * 1024 * 1024) {
    iteration++;
    widthScale -= 0.1;
    fps -= 5;
    quality += 10;
    console.log(
      `\u{1F6E0}\uFE0F Auto-Compress Iteration #${iteration}: Scale=${widthScale}, FPS=${fps}, Quality=${quality}`
    );
    compressedBlob = await compressGIFWithSettings(inputBlob, {
      widthScale,
      fps,
      quality,
      maxSizeMb
    });
    if (widthScale <= 0.4 || fps <= 10) break;
  }
  return compressedBlob;
}
async function compressGIFWithSettings(inputBlob, settings) {
  const { widthScale = 0.8, fps = 15, quality = 20, maxSizeMb = 10 } = settings;
  const inputImage = await createImageBitmap(inputBlob);
  const width = inputImage.width * widthScale;
  const height = inputImage.height * widthScale;
  const offscreenCanvas = new OffscreenCanvas(width, height);
  const ctx = offscreenCanvas.getContext("2d");
  ctx.drawImage(inputImage, 0, 0, width, height);
  const gif = new import_gif_js2.default({
    workers: 2,
    quality,
    debug: true,
    width,
    height
  });
  gif.addFrame(ctx, { delay: 100 });
  const gifJsBlob = await new Promise((resolve) => {
    gif.on("finished", (blob) => resolve(blob));
    gif.render();
  });
  console.log(
    `\u{1F4CF} gif.js.optimized compressed size: ${gifJsBlob.size / 1024 / 1024} MB`
  );
  const ffmpeg = new FFmpeg();
  if (!ffmpeg.loaded) await ffmpeg.load();
  const inputName = "input.gif";
  const outputName = "output.gif";
  await ffmpeg.writeFile(inputName, await fetchFile(gifJsBlob));
  await ffmpeg.exec([
    "-i",
    inputName,
    "-vf",
    `fps=${fps},scale=w=iw*${widthScale}:h=-1:flags=lanczos`,
    "-c:v",
    "gif",
    outputName
  ]);
  const data = await ffmpeg.readFile(outputName);
  const compressedBlob = fileDataToGifBlob(data);
  console.log(
    `\u2705 Final compressed size: ${compressedBlob.size / 1024 / 1024} MB`
  );
  if (compressedBlob.size > maxSizeMb * 1024 * 1024) {
    console.warn("\u26A0\uFE0F GIF size still exceeds limit after FFmpeg compression.");
  }
  return compressedBlob;
}
function selectFileAndCompress(autoCompress = true) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/gif";
  input.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    console.log(
      `\u{1F4C2} Selected File: ${file.name} (${file.size / 1024 / 1024} MB)`
    );
    let compressedBlob;
    if (autoCompress) {
      compressedBlob = await autoCompressGIF(file, 10);
    } else {
      compressedBlob = await compressGIFWithSettings(file, {
        widthScale: 0.7,
        fps: 10,
        quality: 30,
        maxSizeMb: 5
      });
    }
    downloadBlob(compressedBlob, "compressed_" + file.name);
  });
  input.click();
}
function fileDataToImage(fileData) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(fileDataToGifBlob(fileData));
  });
}
function fileDataToGifBlob(fileData) {
  if (typeof fileData === "string") {
    return new Blob([fileData], { type: "image/gif" });
  }
  if (fileData instanceof Uint8Array) {
    if (fileData.buffer instanceof ArrayBuffer) {
      const arrayBufferView = fileData;
      return new Blob([arrayBufferView], { type: "image/gif" });
    }
    const normalized = new Uint8Array(fileData.byteLength);
    normalized.set(fileData);
    return new Blob([normalized], { type: "image/gif" });
  }
  throw new Error(`Unsupported FFmpeg file data type: ${typeof fileData}`);
}
function downloadBlob(blob, fileName) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// src/utils/PixelGifScaler.ts
var PixelGifScaler = class {
  targetSize;
  constructor(targetSize) {
    this.targetSize = targetSize;
  }
  calculateScaling(frames) {
    const dimensions = frames.map((f) => ({
      width: f.dims.width,
      height: f.dims.height
    }));
    const maxWidth = Math.max(...dimensions.map((d) => d.width));
    const maxHeight = Math.max(...dimensions.map((d) => d.height));
    const baseScale = Math.floor(Math.min(
      this.targetSize / maxWidth,
      this.targetSize / maxHeight
    ));
    const frameScales = dimensions.map((d) => ({
      widthScale: maxWidth / d.width,
      heightScale: maxHeight / d.height
    })).map(
      ({ widthScale, heightScale }) => Math.min(widthScale, heightScale)
    );
    return {
      maxWidth,
      maxHeight,
      baseScale,
      frameScales
    };
  }
  scaleFrame(frame, frameIndex, metrics) {
    const { maxWidth, maxHeight, baseScale, frameScales } = metrics;
    const scale = frameScales[frameIndex] * baseScale;
    const scaledWidth = Math.round(frame.dims.width * scale);
    const scaledHeight = Math.round(frame.dims.height * scale);
    const x = Math.floor((maxWidth * baseScale - scaledWidth) / 2);
    const y = Math.floor((maxHeight * baseScale - scaledHeight) / 2);
    const scaledData = new ImageData(
      maxWidth * baseScale,
      maxHeight * baseScale
    );
    for (let sy = 0; sy < scaledHeight; sy++) {
      for (let sx = 0; sx < scaledWidth; sx++) {
        const sourceX = Math.floor(sx / scale);
        const sourceY = Math.floor(sy / scale);
        const sourceIndex = (sourceY * frame.dims.width + sourceX) * 4;
        const targetIndex = ((sy + y) * scaledData.width + (sx + x)) * 4;
        scaledData.data[targetIndex] = frame.patch[sourceIndex];
        scaledData.data[targetIndex + 1] = frame.patch[sourceIndex + 1];
        scaledData.data[targetIndex + 2] = frame.patch[sourceIndex + 2];
        scaledData.data[targetIndex + 3] = frame.patch[sourceIndex + 3];
      }
    }
    return scaledData;
  }
};
async function scalePixelFrames(frames, targetSize) {
  const scaler = new PixelGifScaler(targetSize);
  const metrics = scaler.calculateScaling(frames);
  return frames.map((frame, index) => {
    const scaledData = scaler.scaleFrame(frame, index, metrics);
    return {
      ...frame,
      patch: scaledData.data,
      dims: {
        width: scaledData.width,
        height: scaledData.height,
        top: 0,
        left: 0
      }
    };
  });
}

// src/utils/GifLoader.ts
var import_events = require("events");
var GifLoader = class extends import_events.EventEmitter {
  temporaryGif = null;
  config = {
    maxSizeInMB: 10,
    allowedFileType: ["image/gif"]
  };
  status = {
    isLoading: false,
    progress: 0
  };
  constructor(config) {
    super();
    this.config = {
      ...this.config,
      ...config
    };
  }
  isCanceled = false;
  cancelUpload() {
    if (this.status.isLoading) {
      this.isCanceled = true;
      this.status.isLoading = false;
      this.emit("statusChange", this.status);
    }
  }
  async uploadTemporaryGif(file) {
    this.status.isLoading = true;
    this.status.progress = 0;
    this.emit("statusChange", this.status);
    try {
      if (!this.validateFile(file)) {
        throw new Error("Invalid file format or size");
      }
      await this.simulateProgress(500);
      const gifUrl = await this.createObjectURL(file);
      this.temporaryGif = gifUrl;
      this.status.progress = 100;
      this.emit("statusChange", this.status);
      return gifUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred.";
      this.status.error = message;
      this.emit("statusChange", this.status);
      return null;
    } finally {
      this.status.isLoading = false;
      this.emit("statusChange", this.status);
    }
  }
  validateFile(file) {
    const isValidType = this.config.allowedFileType.includes(file.type);
    const isValidSize = file.size <= this.config.maxSizeInMB * 1024 * 1024;
    return isValidType && isValidSize;
  }
  async createObjectURL(file) {
    return URL.createObjectURL(file);
  }
  async simulateProgress(delay) {
    const increments = 10;
    for (let i = 0; i <= 100; i += increments) {
      this.status.progress = i;
      this.emit("statusChange", this.status);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  getTemporaryGif() {
    return this.temporaryGif;
  }
  cleanup() {
    if (this.temporaryGif) {
      URL.revokeObjectURL(this.temporaryGif);
      this.temporaryGif = null;
    }
  }
};

// src/utils/gifHook.ts
var import_react3 = __toESM(require_react());
var useGIFProcessing = () => {
  const [isProcessing, setIsProcessing] = (0, import_react3.useState)(false);
  const [currentBackground, setCurrentBackground] = (0, import_react3.useState)("");
  const [currentOverlays, setCurrentOverlays] = (0, import_react3.useState)([]);
  const processor = (0, import_react3.useMemo)(() => GIFProcessor.getInstance(), []);
  const processGIF = (0, import_react3.useCallback)(
    async (gifUrl, bglessUrl, overlays) => {
      setIsProcessing(true);
      try {
        const frames = await processor.extractFrames(gifUrl);
        if (!overlays) {
          const result2 = await processor.generateGIF(frames, bglessUrl);
          return result2;
        }
        const result = await processor.generateGIF(frames, bglessUrl, overlays);
        return result;
      } catch (error) {
        console.error("Error processing GIF:", error);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [processor]
  );
  return {
    processGIF,
    isProcessing,
    currentBackground,
    setCurrentBackground,
    currentOverlays,
    setCurrentOverlays
  };
};
var htmlToCanvas = (0, import_react3.useCallback)(async (html) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Could not create canvas context");
  }
  const img = new Image();
  img.src = html.src;
  await new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (err) => reject(err);
  });
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return canvas;
}, []);
var bulkHtmlToCanvas = (0, import_react3.useCallback)(async (htmls) => {
  const canvases = await Promise.all(htmls.map(async (html) => {
    return await htmlToCanvas(html);
  }));
  return canvases;
}, [htmlToCanvas]);

// src/utils/gifTools.ts
var GIFTools = class {
  constructor(progTracker) {
    this.progTracker = progTracker;
    this.completedPhases = /* @__PURE__ */ new Set();
  }
  progTracker;
  CONSTANTS = {
    MAX_CANVAS_SIZE: 2800,
    WORKING_SIZE: 800,
    NFT_SIZE: 2800,
    POOL_SIZE: 15,
    CANVAS_PER_SIZE: 5,
    MEMORY_LIMIT: 800 * 1024 * 1024,
    QUALITY: 1,
    BATCH_SIZE: 5,
    MEMORY_THRESHOLD: 0.8,
    SCALE_DOWN_FACTOR: 0.5,
    MAX_WORKERS: Math.ceil(navigator.hardwareConcurrency || 6),
    TARGET_SIZE: 800,
    MIN_SIZE: 400,
    DITHER: false,
    DELAY: 100,
    WORKER_PATH: "/gif.worker.js"
  };
  completedPhases;
  QUALITY_PRESETS = {
    LOW: {
      quality: 10,
      dither: false,
      frameSkip: 2,
      colors: 128,
      colorEnhancement: {
        red: 0.8,
        green: 0.8,
        blue: 0.8
      }
    },
    MEDIUM: {
      quality: 5,
      dither: "FloydSteinberg",
      frameSkip: 1,
      colors: 256,
      colorEnhancement: {
        red: 1.1,
        green: 1.1,
        blue: 1.1
      }
    },
    HIGH: {
      quality: 1,
      dither: "FloydSteinberg",
      frameSkip: 0,
      colors: 256,
      preserveAlpha: true,
      smoothing: true
    },
    FIRE: {
      quality: 1,
      dither: false,
      frameSkip: 0,
      colors: 256,
      preserveAlpha: true,
      smoothing: true,
      blendMode: "screen",
      colorEnhancement: {
        red: 1.2,
        green: 0.9,
        blue: 0.8,
        alpha: 1.2
      }
    }
  };
  async loadImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
  }
  /**
   * Generates a new patch based on the enhanced color table and frame data.
   * @param frame - The original frame.
   * @param enhancedColorTable - The enhanced color table.
   * @returns The new patch as a Uint8ClampedArray.
   */
  generatePatch(frame, enhancedColorTable) {
    const patchLength = frame.patch.length;
    const newPatch = new Uint8ClampedArray(patchLength);
    for (let i = 0; i < patchLength; i += 4) {
      const pixelIndex = Math.floor(i / 4);
      const colorIndex = frame.pixels[pixelIndex] || 0;
      const color = enhancedColorTable[colorIndex] || [255, 255, 255];
      newPatch[i] = color[0];
      newPatch[i + 1] = color[1];
      newPatch[i + 2] = color[2];
      newPatch[i + 3] = 255;
    }
    return newPatch;
  }
  /**
   * Pre-optimizes a GIF frame by enhancing its color table and updating its patch.
   * @param frame - The parsed GIF frame to optimize.
   * @param enhanceColors - Whether to enhance colors.
   * @param quality - The quality preset (e.g., 'LOW', 'MEDIUM', 'HIGH', 'FIRE').
   * @returns The optimized frame.
   */
  preOptimizeGifFrame(frame, enhanceColors = false, quality = "FIRE") {
    const qualitySettings = this.QUALITY_PRESETS[quality];
    const enhancedColorTable = this.enhanceColorTable(
      frame.colorTable,
      enhanceColors,
      quality
    );
    const newPatch = this.generatePatch(frame, enhancedColorTable);
    return {
      ...frame,
      colorTable: enhancedColorTable,
      patch: newPatch
    };
  }
  /**
   * Enhances the color table based on quality and enhancement settings.
   * @param colorTable - The original color table.
   * @param enhanceColors - Whether to enhance colors.
   * @param quality - The quality preset (e.g., 'LOW', 'MEDIUM', 'HIGH', 'FIRE').
   * @returns The enhanced color table.
   */
  enhanceColorTable(colorTable, enhanceColors, quality) {
    const settings = this.QUALITY_PRESETS[quality];
    return colorTable.map((color) => {
      if (!color || color.length !== 3) {
        return [255, 255, 255];
      }
      const [r, g, b] = color;
      if (quality === "FIRE" && enhanceColors && r > g && r > b) {
        return [Math.min(255, r * 1.2), g * 0.9, b * 0.8];
      }
      return [r, g, b];
    });
  }
  async loadAndCreateStaticImage(bglessUrl, overlays) {
    try {
      this.updatePhase(
        GIF_PHASES.CREATE_STATIC.id,
        0,
        "Starting static layer creation..."
      );
      const bglessImage = await this.loadImage(bglessUrl);
      this.updatePhase(GIF_PHASES.CREATE_STATIC.id, 20, "Background loaded");
      const canvas = document.createElement("canvas");
      canvas.width = this.CONSTANTS.TARGET_SIZE;
      canvas.height = this.CONSTANTS.TARGET_SIZE;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Failed to get canvas context");
      const scale = Math.min(
        this.CONSTANTS.TARGET_SIZE / this.CONSTANTS.NFT_SIZE,
        this.CONSTANTS.TARGET_SIZE / this.CONSTANTS.NFT_SIZE
      );
      const scaledWidth = Math.round(this.CONSTANTS.NFT_SIZE * scale);
      const scaledHeight = Math.round(this.CONSTANTS.NFT_SIZE * scale);
      const x = this.calculateCenteredPosition(
        this.CONSTANTS.TARGET_SIZE,
        scaledWidth
      );
      const y = this.calculateCenteredPosition(
        this.CONSTANTS.TARGET_SIZE,
        scaledHeight
      );
      ctx.drawImage(bglessImage, x, y, scaledWidth, scaledHeight);
      if (overlays?.length) {
        this.updatePhase(GIF_PHASES.CREATE_STATIC.id, 50, "Adding overlays...");
        for (let i = 0; i < overlays.length; i++) {
          const overlay = overlays[i];
          const overlayImage = await this.loadImage(overlay.url);
          ctx.drawImage(overlayImage, x, y, scaledWidth, scaledHeight);
          this.updatePhase(
            GIF_PHASES.CREATE_STATIC.id,
            20 + Math.round((i + 1) / overlays.length * 80),
            `Processing overlay ${i + 1}/${overlays.length}`
          );
        }
      }
      this.updatePhase(
        GIF_PHASES.CREATE_STATIC.id,
        100,
        "Static layer complete"
      );
      return canvas;
    } catch (error) {
      console.error("Error creating static image:", error);
      throw error;
    }
  }
  updatePhase(phaseId, progress, message, totalFrames) {
    this.progTracker.updateProgress(phaseId, progress, message);
    const overallProgress = Math.round(
      Object.values(GIF_PHASES).reduce((total, currentPhase) => {
        if (currentPhase.id === phaseId) {
          return total + currentPhase.weight * progress / 100;
        }
        if (this.completedPhases.has(currentPhase.id)) {
          return total + currentPhase.weight;
        }
        return total;
      }, 0)
    );
    this.progTracker.updateProgress(phaseId, progress, message);
    window.dispatchEvent(
      new CustomEvent("gif-phase-update", {
        detail: {
          phaseId,
          currentProgress: progress,
          overallProgress,
          message,
          timestamp: Date.now(),
          eta: totalFrames !== void 0 && (phaseId === GIF_PHASES.PROCESSING.id || phaseId === GIF_PHASES.ENCODING.id) ? this.calculateETA(
            Math.floor(progress / 100 * totalFrames),
            totalFrames
          ) : void 0
        }
      })
    );
    if (progress >= 100) {
      this.progTracker.updateProgress(phaseId, 100, message);
      this.completedPhases.add(phaseId);
    }
  }
  processingStartTime = 0;
  framesProcessed = 0;
  averageFrameTime = 0;
  // Add this method to calculate ETA
  calculateETA(currentFrame, totalFrames) {
    const now = Date.now();
    const elapsed = now - this.processingStartTime;
    if (currentFrame === 0) {
      this.processingStartTime = now;
      return "Calculating...";
    }
    this.framesProcessed = currentFrame;
    this.averageFrameTime = elapsed / currentFrame;
    const remainingFrames = totalFrames - currentFrame;
    const estimatedRemainingMs = remainingFrames * this.averageFrameTime;
    if (estimatedRemainingMs < 1e3) {
      return "Less than a second";
    }
    const seconds = Math.round(estimatedRemainingMs / 1e3);
    if (seconds < 60) {
      return `~${seconds} seconds`;
    }
    const minutes = Math.round(seconds / 60);
    return `~${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
  calculateCenteredPosition(containerSize, imageSize) {
    return Math.floor((containerSize - imageSize) / 2);
  }
  getCacheKey(gifUrl) {
    return gifUrl;
  }
  validateInput(frames, bglessUrl, overlays) {
    if (!frames?.length) throw new Error("No frames provided");
    if (!bglessUrl) throw new Error("No background image URL provided");
    if (!Array.isArray(overlays)) throw new Error("Invalid overlays format");
  }
  optimizeGifFrame(frame, enhanceColors = false) {
    const optimizedCanvas = document.createElement("canvas");
    optimizedCanvas.width = this.CONSTANTS.TARGET_SIZE;
    optimizedCanvas.height = this.CONSTANTS.TARGET_SIZE;
    const ctx = optimizedCanvas.getContext("2d", {
      willReadFrequently: true,
      alpha: false
    });
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, optimizedCanvas.width, optimizedCanvas.height);
      ctx.globalCompositeOperation = "copy";
      ctx.drawImage(frame, 0, 0, optimizedCanvas.width, optimizedCanvas.height);
      if (enhanceColors) {
        const imageData = ctx.getImageData(
          0,
          0,
          optimizedCanvas.width,
          optimizedCanvas.height
        );
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > data[i + 1] && data[i] > data[i + 2]) {
            data[i] = Math.min(255, data[i] * 1.2);
            data[i + 1] *= 0.9;
            data[i + 2] *= 0.8;
          }
          data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
      }
    }
    return optimizedCanvas;
  }
  // Add this new helper method for calculating frame fit dimensions
  calculateGifFitDimensions(frameWidth, frameHeight) {
    const targetSize = this.CONSTANTS.TARGET_SIZE;
    const aspectRatio = frameWidth / frameHeight;
    const targetAspectRatio = 1;
    let scaledWidth, scaledHeight;
    let sourceX = 0, sourceY = 0;
    let sourceWidth = frameWidth, sourceHeight = frameHeight;
    if (aspectRatio > targetAspectRatio) {
      scaledHeight = targetSize;
      scaledWidth = targetSize;
      sourceHeight = frameHeight;
      sourceWidth = Math.round(frameHeight);
      sourceX = Math.round((frameWidth - sourceWidth) / 2);
    } else {
      scaledWidth = targetSize;
      scaledHeight = targetSize;
      sourceWidth = frameWidth;
      sourceHeight = Math.round(frameWidth);
      sourceY = Math.round((frameHeight - sourceHeight) / 2);
    }
    return {
      width: scaledWidth,
      height: scaledHeight,
      x: 0,
      // No need to center since we're filling the canvas
      y: 0,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight
    };
  }
  normalizeFrameData(data, width, height) {
    const expectedLength = width * height * 4;
    const currentLength = data.length;
    if (currentLength === expectedLength) {
      return new Uint8ClampedArray(data);
    }
    console.debug(
      `Normalizing frame data: ${currentLength} -> ${expectedLength} bytes`
    );
    const normalized = new Uint8ClampedArray(expectedLength);
    if (currentLength === width * height * 3) {
      for (let i = 0, j = 0; i < currentLength; i += 3, j += 4) {
        normalized[j] = data[i];
        normalized[j + 1] = data[i + 1];
        normalized[j + 2] = data[i + 2];
        normalized[j + 3] = 255;
      }
    } else {
      const pixelCount = Math.floor(currentLength / 4);
      const validLength = pixelCount * 4;
      for (let i = 0; i < validLength; i++) {
        normalized[i] = data[i];
      }
      for (let i = validLength; i < expectedLength; i += 4) {
        normalized[i] = 0;
        normalized[i + 1] = 0;
        normalized[i + 2] = 0;
        normalized[i + 3] = 0;
      }
    }
    return normalized;
  }
};

// src/utils/gifUtils.ts
var selectedOverlays = [];
var gifCanvas;
var gifContext;
function initCanvas(canvasId) {
  gifCanvas = document.getElementById(canvasId);
  gifContext = gifCanvas.getContext("2d");
}
function getCurrentGIFFrame() {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = "path/to/current/gif/frame.png";
    img.onload = () => resolve(img);
  });
}
function toggleOverlay(overlay) {
  const overlayIndex = selectedOverlays.findIndex((o) => o.id === overlay.id);
  if (overlayIndex > -1) {
    selectedOverlays.splice(overlayIndex, 1);
  } else {
    selectedOverlays.push(overlay);
  }
  return renderGIFWithOverlays();
}
async function drawOverlays() {
  await Promise.all(
    selectedOverlays.map((overlay) => {
      return new Promise((resolve) => {
        const image = new Image();
        image.src = overlay.src;
        image.onload = () => {
          gifContext.drawImage(image, overlay.x, overlay.y, overlay.width, overlay.height);
          resolve();
        };
        image.onerror = () => resolve();
      });
    })
  );
}
async function renderGIFWithOverlays() {
  gifContext.clearRect(0, 0, gifCanvas.width, gifCanvas.height);
  const baseGifFrame = await getCurrentGIFFrame();
  gifContext.drawImage(baseGifFrame, 0, 0, gifCanvas.width, gifCanvas.height);
  const overlays = drawOverlays();
  return overlays;
}
async function handleGIFUpdates() {
  setInterval(async () => {
    renderGIFWithOverlays();
  }, 100);
}
function setupLiveOverlayRendering(canvasId) {
  initCanvas(canvasId);
  handleGIFUpdates();
}
document.querySelectorAll(".overlay-checkbox").forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    const target = event.target;
    const overlay = {
      id: target.id,
      src: target.dataset.src,
      x: parseInt(target.dataset.x ?? "0", 10),
      y: parseInt(target.dataset.y ?? "0", 10),
      width: parseInt(target.dataset.width ?? "0", 10),
      height: parseInt(target.dataset.height ?? "0", 10)
    };
    toggleOverlay(overlay);
  });
});

// src/analyzers/BaseImageAnalyzer.ts
var BaseImageAnalyzer = class {
  // ─── Core Analysis ────────────────────────────────────────────────────────
  async analyzeImage(buffer) {
    const decoded = await this.decodeImage(buffer);
    const { width, height, data } = this.getPixelData(decoded);
    const hasTransparency = this.detectTransparency(data);
    const hasPartialTransparency = this.detectPartialTransparency(data);
    const uniqueColorCount = this.countUniqueColors(data);
    const visiblePixels = this.countVisiblePixels(data);
    const colorDensityRatio = visiblePixels > 0 ? uniqueColorCount / visiblePixels : 0;
    const sharpEdgeRatio = this.computeSharpEdgeRatio(data, width, height);
    const dominantColors = this.extractDominantColors(data);
    const isHighRes = width * height > 512 * 512;
    const isPixelArt = width * height <= 256 * 256 && uniqueColorCount <= 256 && colorDensityRatio <= 0.12 && sharpEdgeRatio > 0.35;
    return {
      isPixelArt,
      isAnimated: false,
      hasTransparency,
      hasPartialTransparency,
      uniqueColorCount,
      colorDensityRatio,
      sharpEdgeRatio,
      dominantColors,
      isFireLike: this.detectFireLike(dominantColors),
      isHighRes,
      hasVariableFrameSizes: false
    };
  }
  // ─── ScanForge: Disk Cleanup Profile ──────────────────────────────────────
  /**
   * Classifies an image file in terms of its likely origin and cleanup priority.
   * Intended for use during ScanForge directory scans to flag images that are
   * safe to delete (generated/dep artifacts) vs. those that warrant preservation.
   */
  async profileForScanForge(buffer, filename) {
    const analysis = await this.analyzeImage(buffer);
    const bytes = buffer.byteLength;
    const style = this.determineStyle(analysis, filename);
    const origin = this.inferOrigin(analysis, filename, bytes);
    const deletionRisk = this.assessDeletionRisk(style, origin, analysis);
    return {
      filename,
      bytes,
      style,
      origin,
      deletionRisk,
      analysis,
      notes: this.buildNotes(style, origin, deletionRisk, analysis)
    };
  }
  // ─── Style / Origin / Risk ────────────────────────────────────────────────
  determineStyle(analysis, filename) {
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    if (analysis.isPixelArt) return "pixel-art";
    if (analysis.uniqueColorCount <= 8 && !analysis.hasPartialTransparency && !analysis.isHighRes)
      return "flat-icon";
    if (!analysis.hasTransparency && analysis.colorDensityRatio < 0.05 && analysis.uniqueColorCount < 512)
      return "generated-export";
    if (analysis.uniqueColorCount > 8e3 && !analysis.hasTransparency && ["jpg", "jpeg", "webp"].includes(ext))
      return "photograph";
    if (analysis.hasPartialTransparency && analysis.sharpEdgeRatio > 0.2) {
      return "illustrated-asset";
    }
    return "unknown";
  }
  inferOrigin(analysis, filename, bytes) {
    const lower = filename.toLowerCase();
    if (bytes < 4096 && analysis.uniqueColorCount <= 16)
      return "dependency-asset";
    if (/\.(min|chunk|bundle|hash|contenthash)/.test(lower) || /[-_]\w{8,}\.(png|jpg|webp)$/.test(lower))
      return "build-artifact";
    if (/\b(placeholder|fixture|mock|test|spec|sample)\b/.test(lower)) {
      return "test-fixture";
    }
    if (analysis.hasPartialTransparency || analysis.isPixelArt)
      return "source-asset";
    return "unknown";
  }
  assessDeletionRisk(style, origin, analysis) {
    if (origin === "build-artifact" || origin === "dependency-asset")
      return "low";
    if (origin === "test-fixture" && style !== "illustrated-asset")
      return "low";
    if (origin === "source-asset") return "high";
    if (analysis.hasPartialTransparency && analysis.sharpEdgeRatio > 0.3)
      return "high";
    if (style === "generated-export") return "medium";
    return "medium";
  }
  buildNotes(style, origin, risk, analysis) {
    const notes = [];
    if (risk === "high")
      notes.push("Likely hand-authored \u2014 verify before deleting");
    if (origin === "build-artifact")
      notes.push("Matches build output naming pattern");
    if (origin === "dependency-asset")
      notes.push("Tiny file consistent with npm-shipped asset");
    if (style === "pixel-art")
      notes.push("Pixel art detected \u2014 may be intentional game/UI asset");
    if (analysis.isFireLike)
      notes.push("Warm dominant palette \u2014 possibly a branded/themed asset");
    if (analysis.uniqueColorCount > 1e4)
      notes.push(
        "High color complexity \u2014 likely photograph or gradient-heavy export"
      );
    return notes;
  }
  // ─── Pixel Primitives ─────────────────────────────────────────────────────
  detectTransparency(data) {
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) return true;
    }
    return false;
  }
  detectPartialTransparency(data) {
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0 && data[i] < 255) return true;
    }
    return false;
  }
  countVisiblePixels(data) {
    let count = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) count++;
    }
    return count;
  }
  // Packs r/g/b into a single integer — faster than string-keyed Set
  countUniqueColors(data) {
    const colors = /* @__PURE__ */ new Set();
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      colors.add(data[i] << 16 | data[i + 1] << 8 | data[i + 2]);
    }
    return colors.size;
  }
  computeSharpEdgeRatio(data, width, height) {
    let total = 0;
    let sharp2 = 0;
    const threshold = 32;
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        if (data[idx + 3] === 0) continue;
        total++;
        const right = (y * width + (x + 1)) * 4;
        const down = ((y + 1) * width + x) * 4;
        const isSharp = (base, neighbor) => data[neighbor + 3] > 0 && (Math.abs(data[base] - data[neighbor]) > threshold || Math.abs(data[base + 1] - data[neighbor + 1]) > threshold || Math.abs(data[base + 2] - data[neighbor + 2]) > threshold);
        if (isSharp(idx, right) || isSharp(idx, down)) sharp2++;
      }
    }
    return total > 0 ? sharp2 / total : 0;
  }
  extractDominantColors(data) {
    const counts = /* @__PURE__ */ new Map();
    let total = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      const key = `${Math.floor(data[i] / 16) * 16},${Math.floor(data[i + 1] / 16) * 16},${Math.floor(data[i + 2] / 16) * 16}`;
      counts.set(key, (counts.get(key) || 0) + 1);
      total++;
    }
    return Array.from(counts.entries()).map(([key, count]) => {
      const [r, g, b] = key.split(",").map(Number);
      return { r, g, b, frequency: total > 0 ? count / total : 0 };
    }).sort((a, b) => b.frequency - a.frequency).slice(0, 5);
  }
  detectFireLike(dominantColors) {
    return dominantColors.some(
      (c) => c.frequency > 0.15 && c.r > c.g * 1.4 && c.r > c.b * 1.4 && c.r > 180
    );
  }
};

// src/analyzers/BrowserImageAnalyzer.ts
var BrowserImageAnalyzer = class _BrowserImageAnalyzer extends BaseImageAnalyzer {
  static instance = null;
  constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new _BrowserImageAnalyzer();
    }
    return this.instance;
  }
  destroyInstance() {
    _BrowserImageAnalyzer.instance = null;
  }
  // ─── Runtime: browser canvas ──────────────────────────────────────────────
  async decodeImage(buffer) {
    return createImageBitmap(new Blob([buffer]));
  }
  getPixelData(bitmap) {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Failed to get 2D context");
    ctx.drawImage(bitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
    return { width: bitmap.width, height: bitmap.height, data: imageData.data };
  }
};

// src/analyzers/ServerImageAnalyzer.ts
var import_sharp = __toESM(require_lib3());
var ServerImageAnalyzer = class _ServerImageAnalyzer extends BaseImageAnalyzer {
  static instance = null;
  constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new _ServerImageAnalyzer();
    }
    return this.instance;
  }
  destroyInstance() {
    _ServerImageAnalyzer.instance = null;
  }
  // ─── Runtime: sharp ───────────────────────────────────────────────────────
  async decodeImage(buffer) {
    const nodeBuffer = Buffer.from(buffer);
    const { data, info } = await (0, import_sharp.default)(nodeBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    return { data, info };
  }
  getPixelData(decoded) {
    return {
      width: decoded.info.width,
      height: decoded.info.height,
      // sharp returns a Buffer; wrap without copy
      data: new Uint8ClampedArray(
        decoded.data.buffer,
        decoded.data.byteOffset,
        decoded.data.byteLength
      )
    };
  }
};

// src/analyzers/NodeImageAnalyzer.ts
var import_canvas = require("canvas");
var NodeImageAnalyzer = class _NodeImageAnalyzer extends BaseImageAnalyzer {
  static instance = null;
  constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new _NodeImageAnalyzer();
    }
    return this.instance;
  }
  destroyInstance() {
    _NodeImageAnalyzer.instance = null;
  }
  // ─── Runtime: node-canvas ─────────────────────────────────────────────────
  async decodeImage(buffer) {
    const nodeBuffer = Buffer.from(buffer);
    const image = await (0, import_canvas.loadImage)(nodeBuffer);
    const canvas = (0, import_canvas.createCanvas)(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    return {
      width: image.width,
      height: image.height,
      data: imageData.data
    };
  }
  getPixelData(decoded) {
    return decoded;
  }
};

// src/analyzers/ImageAnalyzer.ts
var ImageAnalyzer = class _ImageAnalyzer {
  static instance = null;
  constructor() {
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new _ImageAnalyzer();
    }
    return this.instance;
  }
  destroyInstance() {
    _ImageAnalyzer.instance = null;
  }
  // ─── Core Analysis ────────────────────────────────────────────────────────
  async analyzeImage(buffer) {
    const bitmap = await this.decodeImage(buffer);
    const { width, height, data } = this.getPixelData(bitmap);
    const hasTransparency = this.detectTransparency(data);
    const hasPartialTransparency = this.detectPartialTransparency(data);
    const uniqueColorCount = this.countUniqueColors(data);
    const visiblePixels = this.countVisiblePixels(data);
    const colorDensityRatio = visiblePixels > 0 ? uniqueColorCount / visiblePixels : 0;
    const sharpEdgeRatio = this.computeSharpEdgeRatio(data, width, height);
    const dominantColors = this.extractDominantColors(data);
    const isHighRes = width * height > 512 * 512;
    const isPixelArt = width * height <= 256 * 256 && uniqueColorCount <= 256 && colorDensityRatio <= 0.12 && sharpEdgeRatio > 0.35;
    return {
      isPixelArt,
      isAnimated: false,
      hasTransparency,
      hasPartialTransparency,
      uniqueColorCount,
      colorDensityRatio,
      sharpEdgeRatio,
      dominantColors,
      isFireLike: this.detectFireLike(dominantColors),
      isHighRes,
      hasVariableFrameSizes: false
    };
  }
  // ─── ScanForge: Disk Cleanup Profile ──────────────────────────────────────
  /**
   * Classifies an image file in terms of its likely origin and cleanup priority.
   * Intended for use during ScanForge directory scans to flag images that are
   * safe to delete (generated/dep artifacts) vs. those that warrant preservation.
   */
  async profileForScanForge(buffer, filename) {
    const analysis = await this.analyzeImage(buffer);
    const bytes = buffer.byteLength;
    const style = this.determineStyle(analysis, filename);
    const origin = this.inferOrigin(analysis, filename, bytes);
    const deletionRisk = this.assessDeletionRisk(style, origin, analysis);
    return {
      filename,
      bytes,
      style,
      origin,
      deletionRisk,
      analysis,
      notes: this.buildNotes(style, origin, deletionRisk, analysis)
    };
  }
  /**
   * Style classification: what kind of image is this visually?
   */
  determineStyle(analysis, filename) {
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    if (analysis.isPixelArt) return "pixel-art";
    if (analysis.uniqueColorCount <= 8 && !analysis.hasPartialTransparency && analysis.isHighRes === false)
      return "flat-icon";
    if (!analysis.hasTransparency && analysis.colorDensityRatio < 0.05 && analysis.uniqueColorCount < 512)
      return "generated-export";
    if (analysis.uniqueColorCount > 8e3 && !analysis.hasTransparency && ["jpg", "jpeg", "webp"].includes(ext))
      return "photograph";
    if (analysis.hasPartialTransparency && analysis.sharpEdgeRatio > 0.2) {
      return "illustrated-asset";
    }
    return "unknown";
  }
  /**
   * Origin inference: where did this image likely come from?
   */
  inferOrigin(analysis, filename, bytes) {
    const lower = filename.toLowerCase();
    if (bytes < 4096 && analysis.uniqueColorCount <= 16)
      return "dependency-asset";
    if (/\.(min|chunk|bundle|hash|contenthash)/.test(lower) || /[-_]\w{8,}\.(png|jpg|webp)$/.test(lower))
      return "build-artifact";
    if (/\b(placeholder|fixture|mock|test|spec|sample)\b/.test(lower)) {
      return "test-fixture";
    }
    if (analysis.hasPartialTransparency || analysis.isPixelArt)
      return "source-asset";
    return "unknown";
  }
  /**
   * Deletion risk: how safe is it to remove this during cleanup?
   */
  assessDeletionRisk(style, origin, analysis) {
    if (origin === "build-artifact" || origin === "dependency-asset")
      return "low";
    if (origin === "test-fixture" && style !== "illustrated-asset")
      return "low";
    if (origin === "source-asset") return "high";
    if (analysis.hasPartialTransparency && analysis.sharpEdgeRatio > 0.3)
      return "high";
    if (style === "generated-export") return "medium";
    return "medium";
  }
  buildNotes(style, origin, risk, analysis) {
    const notes = [];
    if (risk === "high")
      notes.push("Likely hand-authored \u2014 verify before deleting");
    if (origin === "build-artifact")
      notes.push("Matches build output naming pattern");
    if (origin === "dependency-asset")
      notes.push("Tiny file consistent with npm-shipped asset");
    if (style === "pixel-art")
      notes.push("Pixel art detected \u2014 may be intentional game/UI asset");
    if (analysis.isFireLike)
      notes.push("Warm dominant palette \u2014 possibly a branded/themed asset");
    if (analysis.uniqueColorCount > 1e4)
      notes.push(
        "High color complexity \u2014 likely photograph or gradient-heavy export"
      );
    return notes;
  }
  // ─── Pixel Primitives ─────────────────────────────────────────────────────
  async decodeImage(buffer) {
    return await createImageBitmap(new Blob([buffer]));
  }
  getPixelData(bitmap) {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Failed to get 2D context");
    ctx.drawImage(bitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
    return { width: bitmap.width, height: bitmap.height, data: imageData.data };
  }
  detectTransparency(data) {
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) return true;
    }
    return false;
  }
  detectPartialTransparency(data) {
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0 && data[i] < 255) return true;
    }
    return false;
  }
  countVisiblePixels(data) {
    let count = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) count++;
    }
    return count;
  }
  // Faster than string-keyed Set — packs r/g/b into a single integer
  countUniqueColors(data) {
    const colors = /* @__PURE__ */ new Set();
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      colors.add(data[i] << 16 | data[i + 1] << 8 | data[i + 2]);
    }
    return colors.size;
  }
  computeSharpEdgeRatio(data, width, height) {
    let total = 0;
    let sharp2 = 0;
    const threshold = 32;
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        if (data[idx + 3] === 0) continue;
        total++;
        const right = (y * width + (x + 1)) * 4;
        const down = ((y + 1) * width + x) * 4;
        const isSharp = (base, neighbor) => data[neighbor + 3] > 0 && (Math.abs(data[base] - data[neighbor]) > threshold || Math.abs(data[base + 1] - data[neighbor + 1]) > threshold || Math.abs(data[base + 2] - data[neighbor + 2]) > threshold);
        if (isSharp(idx, right) || isSharp(idx, down)) sharp2++;
      }
    }
    return total > 0 ? sharp2 / total : 0;
  }
  extractDominantColors(data) {
    const counts = /* @__PURE__ */ new Map();
    let total = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      const key = `${Math.floor(data[i] / 16) * 16},${Math.floor(data[i + 1] / 16) * 16},${Math.floor(data[i + 2] / 16) * 16}`;
      counts.set(key, (counts.get(key) || 0) + 1);
      total++;
    }
    return Array.from(counts.entries()).map(([key, count]) => {
      const [r, g, b] = key.split(",").map(Number);
      return { r, g, b, frequency: total > 0 ? count / total : 0 };
    }).sort((a, b) => b.frequency - a.frequency).slice(0, 5);
  }
  detectFireLike(dominantColors) {
    return dominantColors.some(
      (c) => c.frequency > 0.15 && c.r > c.g * 1.4 && c.r > c.b * 1.4 && c.r > 180
    );
  }
};

// src/runtime/NodeWorkerThreadsAdapter.ts
var import_node_crypto = require("node:crypto");
var NodeWorkerThreadsAdapter = class {
  constructor(workerPath) {
    this.workerPath = workerPath;
  }
  workerPath;
  async runTask(taskName, payload) {
    const workerThreadsModule = await import("node:worker_threads");
    const request = {
      id: (0, import_node_crypto.randomUUID)(),
      taskName,
      payload
    };
    const workerPath = this.resolveWorkerPath();
    return new Promise((resolve, reject) => {
      const worker = new workerThreadsModule.Worker(workerPath);
      let settled = false;
      worker.once("message", (response) => {
        settled = true;
        worker.terminate().catch(() => void 0);
        if (response.ok === true) {
          resolve(response.result);
          return;
        }
        reject(new Error(response.error));
      });
      worker.once("error", (error) => {
        settled = true;
        worker.terminate().catch(() => void 0);
        reject(error);
      });
      worker.once("exit", (code) => {
        if (!settled && code !== 0) {
          reject(new Error(`Node worker exited before responding (code ${code})`));
        }
      });
      worker.postMessage(request);
    });
  }
  resolveWorkerPath() {
    if (this.workerPath) {
      return this.workerPath;
    }
    throw new Error(
      "NodeWorkerThreadsAdapter requires an explicit workerPath. Use the built ./node-worker entry output when wiring the adapter."
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AL,
  API_CONFIG,
  API_ENDPOINTS,
  ASSET_ENV_CONFIG,
  ASSET_PATHS,
  ASSET_VALIDATION,
  ArtManager,
  AssetLoader,
  AssetRegistry,
  BASE_ASSET_PATH,
  BaseImageAnalyzer,
  BaseProgressTracker,
  BitReader,
  BrowserImageAnalyzer,
  BrowserTaskAdapter,
  CACHE_CONFIG,
  CodeTable,
  CutEngine,
  ENVIRONMENT,
  EnhancedRetryHandler,
  FrameProcessor,
  GIFExtension,
  GIFProcessor,
  GIFProgressTracker,
  GIFTools,
  GifAnalyzer,
  GifExtension,
  GifFrame,
  GifImage,
  GifLoader,
  Giffyness,
  ImageAnalyzer,
  ImageManager,
  LOADER_CONFIG,
  NamedClipPlanner,
  NodeImageAnalyzer,
  NodeWorkerThreadsAdapter,
  PIXEL_ART_SETTINGS,
  PixelArtHandler,
  PixelGifScaler,
  PixelMatrixExporter,
  PixelMatrixFileEmitter,
  PreprocessPipeline,
  ProcessingService,
  ProgressManager,
  QualityAnalyzer,
  QualityAnalyzerService,
  QualityManager,
  RetryHandler,
  RuntimeTaskRegistry,
  SCANFORGE_PREPROCESS_TASKS,
  SUPPORTED_FORMATS,
  ServerImageAnalyzer,
  SpriteAtlasExporter,
  TimelineBuilder,
  VeraShellExporter,
  VideoFrameExtractor,
  WorkerManager,
  WorkerPool,
  alignImage,
  alignImageSet,
  autoCompressGIF,
  backgroundImages,
  buildAssetPath,
  compressGIFWithSettings,
  createFlatBackgroundSpritePreprocess,
  createOverlay,
  downloadBlob,
  executeTaskRequest,
  fetchWithRetry,
  fileDataToImage,
  generatePreview,
  getAssetRegistry,
  getCurrentGIFFrame,
  getGifProcessor,
  getTimestamp,
  handleGIFUpdates,
  imageManager,
  overlayArray,
  overlayImages,
  pixelArtHandler,
  qualityAnalyzerService,
  read,
  registerScanForgePreprocessTasks,
  renderGIFWithOverlays,
  runtime,
  scalePixelFrames,
  selectFileAndCompress,
  setupLiveOverlayRendering,
  splitMatrix,
  toggleOverlay,
  useAssetSystem,
  useAssets,
  useGIFProcessing,
  useGifDecoder
});
/*! Bundled license information:

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

sharp/lib/is.js:
sharp/lib/libvips.js:
sharp/lib/sharp.js:
sharp/lib/constructor.js:
sharp/lib/input.js:
sharp/lib/resize.js:
sharp/lib/composite.js:
sharp/lib/operation.js:
sharp/lib/colour.js:
sharp/lib/channel.js:
sharp/lib/output.js:
sharp/lib/utility.js:
sharp/lib/index.js:
  (*!
    Copyright 2013 Lovell Fuller and others.
    SPDX-License-Identifier: Apache-2.0
  *)
*/
