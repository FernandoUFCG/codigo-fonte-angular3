'use strict';
///////////////////////////////////////
/**
 * @ngdoc service
 * @name $injector
 *
 * @description
 *
 * `$injector` is used to retrieve object instances as defined by
 * {@link auto.$provide provider}, instantiate types, invoke methods,
 * and load modules.
 *
 * The following always holds true:
 *
 * ```js
 *   var $injector = angular.injector();
 *   expect($injector.get('$injector')).toBe($injector);
 *   expect($injector.invoke(function($injector) {
 *     return $injector;
 *   })).toBe($injector);
 * ```
 *
 * ## Injection Function Annotation
 *
 * JavaScript does not have annotations, and annotations are needed for dependency injection. The
 * following are all valid ways of annotating function with injection arguments and are equivalent.
 *
 * ```js
 *   // inferred (only works if code not minified/obfuscated)
 *   $injector.invoke(function(serviceA){});
 *
 *   // annotated
 *   function explicit(serviceA) {};
 *   explicit.$inject = ['serviceA'];
 *   $injector.invoke(explicit);
 *
 *   // inline
 *   $injector.invoke(['serviceA', function(serviceA){}]);
 * ```
 *
 * ### Inference
 *
 * In JavaScript calling `toString()` on a function returns the function definition. The definition
 * can then be parsed and the function arguments can be extracted. This method of discovering
 * annotations is disallowed when the injector is in strict mode.
 * *NOTE:* This does not work with minification, and obfuscation tools since these tools change the
 * argument names.
 *
 * ### `$inject` Annotation
 * By adding an `$inject` property onto a function the injection parameters can be specified.
 *
 * ### Inline
 * As an array of injection names, where the last item in the array is the function to call.
 */
/**
 * @ngdoc property
 * @name $injector#modules
 * @type {Object}
 * @description
 * A hash containing all the modules that have been loaded into the
 * $injector.
 *
 * You can use this property to find out information about a module via the
 * {@link angular.Module#info `myModule.info(...)`} method.
 *
 * For example:
 *
 * ```
 * var info = $injector.modules['ngAnimate'].info();
 * ```
 *
 * **Do not use this property to attempt to modify the modules after the application
 * has been bootstrapped.**
 */
/**
 * @ngdoc method
 * @name $injector#get
 *
 * @description
 * Return an instance of the service.
 *
 * @param {string} name The name of the instance to retrieve.
 * @param {string=} caller An optional string to provide the origin of the function call for error messages.
 * @return {*} The instance.
 */
/**
 * @ngdoc method
 * @name $injector#invoke
 *
 * @description
 * Invoke the method and supply the method arguments from the `$injector`.
 *
 * @param {Function|Array.<string|Function>} fn The injectable function to invoke. Function parameters are
 *   injected according to the {@link guide/di $inject Annotation} rules.
 * @param {Object=} self The `this` for the invoked method.
 * @param {Object=} locals Optional object. If preset then any argument names are read from this
 *                         object first, before the `$injector` is consulted.
 * @returns {*} the value returned by the invoked `fn` function.
 */
/**
 * @ngdoc method
 * @name $injector#has
 *
 * @description
 * Allows the user to query if the particular service exists.
 *
 * @param {string} name Name of the service to query.
 * @returns {boolean} `true` if injector has given service.
 */
/**
 * @ngdoc method
 * @name $injector#instantiate
 * @description
 * Create a new instance of JS type. The method takes a constructor function, invokes the new
 * operator, and supplies all of the arguments to the constructor function as specified by the
 * constructor annotation.
 *
 * @param {Function} Type Annotated constructor function.
 * @param {Object=} locals Optional object. If preset then any argument names are read from this
 * object first, before the `$injector` is consulted.
 * @returns {Object} new instance of `Type`.
 */
/**
 * @ngdoc method
 * @name $injector#annotate
 *
 * @description
 * Returns an array of service names which the function is requesting for injection. This API is
 * used by the injector to determine which services need to be injected into the function when the
 * function is invoked. There are three ways in which the function can be annotated with the needed
 * dependencies.
 *
 * #### Argument names
 *
 * The simplest form is to extract the dependencies from the arguments of the function. This is done
 * by converting the function into a string using `toString()` method and extracting the argument
 * names.
 * ```js
 *   // Given
 *   function MyController($scope, $route) {
 *     // ...
 *   }
 *
 *   // Then
 *   expect(injector.annotate(MyController)).toEqual(['$scope', '$route']);
 * ```
 *
 * You can disallow this method by using strict injection mode.
 *
 * This method does not work with code minification / obfuscation. For this reason the following
 * annotation strategies are supported.
 *
 * #### The `$inject` property
 *
 * If a function has an `$inject` property and its value is an array of strings, then the strings
 * represent names of services to be injected into the function.
 * ```js
 *   // Given
 *   var MyController = function(obfuscatedScope, obfuscatedRoute) {
 *     // ...
 *   }
 *   // Define function dependencies
 *   MyController['$inject'] = ['$scope', '$route'];
 *
 *   // Then
 *   expect(injector.annotate(MyController)).toEqual(['$scope', '$route']);
 * ```
 *
 * #### The array notation
 *
 * It is often desirable to inline Injected functions and that's when setting the `$inject` property
 * is very inconvenient. In these situations using the array notation to specify the dependencies in
 * a way that survives minification is a better choice:
 *
 * ```js
 *   // We wish to write this (not minification / obfuscation safe)
 *   injector.invoke(function($compile, $rootScope) {
 *     // ...
 *   });
 *
 *   // We are forced to write break inlining
 *   var tmpFn = function(obfuscatedCompile, obfuscatedRootScope) {
 *     // ...
 *   };
 *   tmpFn.$inject = ['$compile', '$rootScope'];
 *   injector.invoke(tmpFn);
 *
 *   // To better support inline function the inline annotation is supported
 *   injector.invoke(['$compile', '$rootScope', function(obfCompile, obfRootScope) {
 *     // ...
 *   }]);
 *
 *   // Therefore
 *   expect(injector.annotate(
 *      ['$compile', '$rootScope', function(obfus_$compile, obfus_$rootScope) {}])
 *    ).toEqual(['$compile', '$rootScope']);
 * ```
 *
 * @param {Function|Array.<string|Function>} fn Function for which dependent service names need to
 * be retrieved as described above.
 *
 * @param {boolean=} [strictDi=false] Disallow argument name annotation inference.
 *
 * @returns {Array.<string>} The names of the services which the function requires.
 */
/**
 * @ngdoc method
 * @name $injector#loadNewModules
 *
 * @description
 *
 * **This is a dangerous API, which you use at your own risk!**
 *
 * Add the specified modules to the current injector.
 *
 * This method will add each of the injectables to the injector and execute all of the config and run
 * blocks for each module passed to the method.
 *
 * If a module has already been loaded into the injector then it will not be loaded again.
 *
 * * The application developer is responsible for loading the code containing the modules; and for
 * ensuring that lazy scripts are not downloaded and executed more often that desired.
 * * Previously compiled HTML will not be affected by newly loaded directives, filters and components.
 * * Modules cannot be unloaded.
 *
 * You can use {@link $injector#modules `$injector.modules`} to check whether a module has been loaded
 * into the injector, which may indicate whether the script has been executed already.
 *
 * @example
 * Here is an example of loading a bundle of modules, with a utility method called `getScript`:
 *
 * ```javascript
 * app.factory('loadModule', function($injector) {
 *   return function loadModule(moduleName, bundleUrl) {
 *     return getScript(bundleUrl).then(function() { $injector.loadNewModules([moduleName]); });
 *   };
 * })
 * ```
 *
 * @param {Array<String|Function|Array>=} mods an array of modules to load into the application.
 *     Each item in the array should be the name of a predefined module or a (DI annotated)
 *     function that will be invoked by the injector as a `config` block.
 *     See: {@link angular.module modules}
 */
/**
 * @ngdoc service
 * @name $provide
 *
 * @description
 *
 * The {@link auto.$provide $provide} service has a number of methods for registering components
 * with the {@link auto.$injector $injector}. Many of these functions are also exposed on
 * {@link angular.Module}.
 *
 * An AngularJS **service** is a singleton object created by a **service factory**.  These **service
 * factories** are functions which, in turn, are created by a **service provider**.
 * The **service providers** are constructor functions. When instantiated they must contain a
 * property called `$get`, which holds the **service factory** function.
 *
 * When you request a service, the {@link auto.$injector $injector} is responsible for finding the
 * correct **service provider**, instantiating it and then calling its `$get` **service factory**
 * function to get the instance of the **service**.
 *
 * Often services have no configuration options and there is no need to add methods to the service
 * provider.  The provider will be no more than a constructor function with a `$get` property. For
 * these cases the {@link auto.$provide $provide} service has additional helper methods to register
 * services without specifying a provider.
 *
 * * {@link auto.$provide#provider provider(name, provider)} - registers a **service provider** with the
 *     {@link auto.$injector $injector}
 * * {@link auto.$provide#constant constant(name, obj)} - registers a value/object that can be accessed by
 *     providers and services.
 * * {@link auto.$provide#value value(name, obj)} - registers a value/object that can only be accessed by
 *     services, not providers.
 * * {@link auto.$provide#factory factory(name, fn)} - registers a service **factory function**
 *     that will be wrapped in a **service provider** object, whose `$get` property will contain the
 *     given factory function.
 * * {@link auto.$provide#service service(name, Fn)} - registers a **constructor function**
 *     that will be wrapped in a **service provider** object, whose `$get` property will instantiate
 *      a new object using the given constructor function.
 * * {@link auto.$provide#decorator decorator(name, decorFn)} - registers a **decorator function** that
 *      will be able to modify or replace the implementation of another service.
 *
 * See the individual methods for more information and examples.
 */
/**
 * @ngdoc method
 * @name $provide#provider
 * @description
 *
 * Register a **provider function** with the {@link auto.$injector $injector}. Provider functions
 * are constructor functions, whose instances are responsible for "providing" a factory for a
 * service.
 *
 * Service provider names start with the name of the service they provide followed by `Provider`.
 * For example, the {@link ng.$log $log} service has a provider called
 * {@link ng.$logProvider $logProvider}.
 *
 * Service provider objects can have additional methods which allow configuration of the provider
 * and its service. Importantly, you can configure what kind of service is created by the `$get`
 * method, or how that service will act. For example, the {@link ng.$logProvider $logProvider} has a
 * method {@link ng.$logProvider#debugEnabled debugEnabled}
 * which lets you specify whether the {@link ng.$log $log} service will log debug messages to the
 * console or not.
 *
 * It is possible to inject other providers into the provider function,
 * but the injected provider must have been defined before the one that requires it.
 *
 * @param {string} name The name of the instance. NOTE: the provider will be available under `name +
                        'Provider'` key.
 * @param {(Object|function())} provider If the provider is:
 *
 *   - `Object`: then it should have a `$get` method. The `$get` method will be invoked using
 *     {@link auto.$injector#invoke $injector.invoke()} when an instance needs to be created.
 *   - `Constructor`: a new instance of the provider will be created using
 *     {@link auto.$injector#instantiate $injector.instantiate()}, then treated as `object`.
 *
 * @returns {Object} registered provider instance

 * @example
 *
 * The following example shows how to create a simple event tracking service and register it using
 * {@link auto.$provide#provider $provide.provider()}.
 *
 * ```js
 *  // Define the eventTracker provider
 *  function EventTrackerProvider() {
 *    var trackingUrl = '/track';
 *
 *    // A provider method for configuring where the tracked events should been saved
 *    this.setTrackingUrl = function(url) {
 *      trackingUrl = url;
 *    };
 *
 *    // The service factory function
 *    this.$get = ['$http', function($http) {
 *      var trackedEvents = {};
 *      return {
 *        // Call this to track an event
 *        event: function(event) {
 *          var count = trackedEvents[event] || 0;
 *          count += 1;
 *          trackedEvents[event] = count;
 *          return count;
 *        },
 *        // Call this to save the tracked events to the trackingUrl
 *        save: function() {
 *          $http.post(trackingUrl, trackedEvents);
 *        }
 *      };
 *    }];
 *  }
 *
 *  describe('eventTracker', function() {
 *    var postSpy;
 *
 *    beforeEach(module(function($provide) {
 *      // Register the eventTracker provider
 *      $provide.provider('eventTracker', EventTrackerProvider);
 *    }));
 *
 *    beforeEach(module(function(eventTrackerProvider) {
 *      // Configure eventTracker provider
 *      eventTrackerProvider.setTrackingUrl('/custom-track');
 *    }));
 *
 *    it('tracks events', inject(function(eventTracker) {
 *      expect(eventTracker.event('login')).toEqual(1);
 *      expect(eventTracker.event('login')).toEqual(2);
 *    }));
 *
 *    it('saves to the tracking url', inject(function(eventTracker, $http) {
 *      postSpy = spyOn($http, 'post');
 *      eventTracker.event('login');
 *      eventTracker.save();
 *      expect(postSpy).toHaveBeenCalled();
 *      expect(postSpy.mostRecentCall.args[0]).not.toEqual('/track');
 *      expect(postSpy.mostRecentCall.args[0]).toEqual('/custom-track');
 *      expect(postSpy.mostRecentCall.args[1]).toEqual({ 'login': 1 });
 *    }));
 *  });
 * ```
 */
/**
 * @ngdoc method
 * @name $provide#factory
 * @description
 *
 * Register a **service factory**, which will be called to return the service instance.
 * This is short for registering a service where its provider consists of only a `$get` property,
 * which is the given service factory function.
 * You should use {@link auto.$provide#factory $provide.factory(getFn)} if you do not need to
 * configure your service in a provider.
 *
 * @param {string} name The name of the instance.
 * @param {Function|Array.<string|Function>} $getFn The injectable $getFn for the instance creation.
 *                      Internally this is a short hand for `$provide.provider(name, {$get: $getFn})`.
 * @returns {Object} registered provider instance
 *
 * @example
 * Here is an example of registering a service
 * ```js
 *   $provide.factory('ping', ['$http', function($http) {
 *     return function ping() {
 *       return $http.send('/ping');
 *     };
 *   }]);
 * ```
 * You would then inject and use this service like this:
 * ```js
 *   someModule.controller('Ctrl', ['ping', function(ping) {
 *     ping();
 *   }]);
 * ```
 */
/**
 * @ngdoc method
 * @name $provide#service
 * @description
 *
 * Register a **service constructor**, which will be invoked with `new` to create the service
 * instance.
 * This is short for registering a service where its provider's `$get` property is a factory
 * function that returns an instance instantiated by the injector from the service constructor
 * function.
 *
 * Internally it looks a bit like this:
 *
 * ```
 * {
 *   $get: function() {
 *     return $injector.instantiate(constructor);
 *   }
 * }
 * ```
 *
 *
 * You should use {@link auto.$provide#service $provide.service(class)} if you define your service
 * as a type/class.
 *
 * @param {string} name The name of the instance.
 * @param {Function|Array.<string|Function>} constructor An injectable class (constructor function)
 *     that will be instantiated.
 * @returns {Object} registered provider instance
 *
 * @example
 * Here is an example of registering a service using
 * {@link auto.$provide#service $provide.service(class)}.
 * ```js
 *   var Ping = function($http) {
 *     this.$http = $http;
 *   };
 *
 *   Ping.$inject = ['$http'];
 *
 *   Ping.prototype.send = function() {
 *     return this.$http.get('/ping');
 *   };
 *   $provide.service('ping', Ping);
 * ```
 * You would then inject and use this service like this:
 * ```js
 *   someModule.controller('Ctrl', ['ping', function(ping) {
 *     ping.send();
 *   }]);
 * ```
 */
/**
 * @ngdoc method
 * @name $provide#value
 * @description
 *
 * Register a **value service** with the {@link auto.$injector $injector}, such as a string, a
 * number, an array, an object or a function. This is short for registering a service where its
 * provider's `$get` property is a factory function that takes no arguments and returns the **value
 * service**. That also means it is not possible to inject other services into a value service.
 *
 * Value services are similar to constant services, except that they cannot be injected into a
 * module configuration function (see {@link angular.Module#config}) but they can be overridden by
 * an AngularJS {@link auto.$provide#decorator decorator}.
 *
 * @param {string} name The name of the instance.
 * @param {*} value The value.
 * @returns {Object} registered provider instance
 *
 * @example
 * Here are some examples of creating value services.
 * ```js
 *   $provide.value('ADMIN_USER', 'admin');
 *
 *   $provide.value('RoleLookup', { admin: 0, writer: 1, reader: 2 });
 *
 *   $provide.value('halfOf', function(value) {
 *     return value / 2;
 *   });
 * ```
 */
/**
 * @ngdoc method
 * @name $provide#constant
 * @description
 *
 * Register a **constant service** with the {@link auto.$injector $injector}, such as a string,
 * a number, an array, an object or a function. Like the {@link auto.$provide#value value}, it is not
 * possible to inject other services into a constant.
 *
 * But unlike {@link auto.$provide#value value}, a constant can be
 * injected into a module configuration function (see {@link angular.Module#config}) and it cannot
 * be overridden by an AngularJS {@link auto.$provide#decorator decorator}.
 *
 * @param {string} name The name of the constant.
 * @param {*} value The constant value.
 * @returns {Object} registered instance
 *
 * @example
 * Here a some examples of creating constants:
 * ```js
 *   $provide.constant('SHARD_HEIGHT', 306);
 *
 *   $provide.constant('MY_COLOURS', ['red', 'blue', 'grey']);
 *
 *   $provide.constant('double', function(value) {
 *     return value * 2;
 *   });
 * ```
 */
/**
 * @ngdoc method
 * @name $provide#decorator
 * @description
 *
 * Register a **decorator function** with the {@link auto.$injector $injector}. A decorator function
 * intercepts the creation of a service, allowing it to override or modify the behavior of the
 * service. The return value of the decorator function may be the original service, or a new service
 * that replaces (or wraps and delegates to) the original service.
 *
 * You can find out more about using decorators in the {@link guide/decorators} guide.
 *
 * @param {string} name The name of the service to decorate.
 * @param {Function|Array.<string|Function>} decorator This function will be invoked when the service needs to be
 *    provided and should return the decorated service instance. The function is called using
 *    the {@link auto.$injector#invoke injector.invoke} method and is therefore fully injectable.
 *    Local injection arguments:
 *
 *    * `$delegate` - The original service instance, which can be replaced, monkey patched, configured,
 *      decorated or delegated to.
 *
 * @example
 * Here we decorate the {@link ng.$log $log} service to convert warnings to errors by intercepting
 * calls to {@link ng.$log#error $log.warn()}.
 * ```js
 *   $provide.decorator('$log', ['$delegate', function($delegate) {
 *     $delegate.warn = $delegate.error;
 *     return $delegate;
 *   }]);
 * ```
 */
function createInjector(modulesToLoad, strictDi) {
  strictDi = (strictDi === true);
  var INSTANTIATING = {},
    providerSuffix = 'Provider',
    path = [],
    loadedModules = new NgMap(),
    providerCache = {
      $provide: {
        provider: supportObject(provider),
        factory: supportObject(factory),
        service: supportObject(service),
        value: supportObject(value),
        constant: supportObject(constant),
        decorator: decorator
      }
    },
    providerInjector = (providerCache.$injector =
      createInternalInjector(providerCache, function (serviceName, caller) {
        if (angular.isString(caller)) {
          path.push(caller);
        }
        throw $injectorMinErr('unpr', 'Unknown provider: {0}', path.join(' <- '));
      })),
    instanceCache = {},
    protoInstanceInjector = createInternalInjector(instanceCache, function (serviceName, caller) {
      var provider = providerInjector.get(serviceName + providerSuffix, caller);
      return instanceInjector.invoke(
        provider.$get, provider, undefined, serviceName);
    }),
    instanceInjector = protoInstanceInjector;

  providerCache['$injector' + providerSuffix] = { $get: valueFn(protoInstanceInjector) };
  instanceInjector.modules = providerInjector.modules = createMap();
  var runBlocks = loadModules(modulesToLoad);
  instanceInjector = protoInstanceInjector.get('$injector');
  instanceInjector.strictDi = strictDi;
  forEach(runBlocks, function (fn) {
    if (fn)
      instanceInjector.invoke(fn);
  });

  instanceInjector.loadNewModules = function (mods) {
    forEach(loadModules(mods), function (fn) {
      if (fn)
        instanceInjector.invoke(fn);
    });
  };


  return instanceInjector;

  ////////////////////////////////////
  // $provider
  ////////////////////////////////////
  function supportObject(delegate) {
    return function (key, value) {
      if (isObject(key)) {
        forEach(key, reverseParams(delegate));
      } else {
        return delegate(key, value);
      }
    };
  }

  function provider(name, provider_) {
    assertNotHasOwnProperty(name, 'service');
    if (isFunction(provider_) || isArray(provider_)) {
      provider_ = providerInjector.instantiate(provider_);
    }
    if (!provider_.$get) {
      throw $injectorMinErr('pget', 'Provider \'{0}\' must define $get factory method.', name);
    }
    return (providerCache[name + providerSuffix] = provider_);
  }

  function enforceReturnValue(name, factory) {
    return /** @this */ function enforcedReturnValue() {
      var result = instanceInjector.invoke(factory, this);
      if (isUndefined(result)) {
        throw $injectorMinErr('undef', 'Provider \'{0}\' must return a value from $get factory method.', name);
      }
      return result;
    };
  }

  function factory(name, factoryFn, enforce) {
    return provider(name, {
      $get: enforce !== false ? enforceReturnValue(name, factoryFn) : factoryFn
    });
  }

  function service(name, constructor) {
    return factory(name, ['$injector', function ($injector) {
      return $injector.instantiate(constructor);
    }]);
  }

  function value(name, val) { return factory(name, valueFn(val), false); }

  function constant(name, value) {
    assertNotHasOwnProperty(name, 'constant');
    providerCache[name] = value;
    instanceCache[name] = value;
  }

  function decorator(serviceName, decorFn) {
    var origProvider = providerInjector.get(serviceName + providerSuffix),
      orig$get = origProvider.$get;

    origProvider.$get = function () {
      var origInstance = instanceInjector.invoke(orig$get, origProvider);
      return instanceInjector.invoke(decorFn, null, { $delegate: origInstance });
    };
  }

  ////////////////////////////////////
  // Module Loading
  ////////////////////////////////////
  function loadModules(modulesToLoad) {
    assertArg(isUndefined(modulesToLoad) || isArray(modulesToLoad), 'modulesToLoad', 'not an array');
    var runBlocks = [], moduleFn;
    forEach(modulesToLoad, function (module) {
      if (loadedModules.get(module))
        return;
      loadedModules.set(module, true);

      function runInvokeQueue(queue) {
        var i, ii;
        for (i = 0, ii = queue.length; i < ii; i++) {
          var invokeArgs = queue[i],
            provider = providerInjector.get(invokeArgs[0]);

          provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
        }
      }

      try {
        if (isString(module)) {
          moduleFn = angularModule(module);
          instanceInjector.modules[module] = moduleFn;
          runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);
          runInvokeQueue(moduleFn._invokeQueue);
          runInvokeQueue(moduleFn._configBlocks);
        } else if (isFunction(module)) {
          runBlocks.push(providerInjector.invoke(module));
        } else if (isArray(module)) {
          runBlocks.push(providerInjector.invoke(module));
        } else {
          assertArgFn(module, 'module');
        }
      } catch (e) {
        if (isArray(module)) {
          module = module[module.length - 1];
        }
        if (e.message && e.stack && e.stack.indexOf(e.message) === -1) {
          // Safari & FF's stack traces don't contain error.message content
          // unlike those of Chrome and IE
          // So if stack doesn't contain message, we create a new string that contains both.
          // Since error.stack is read-only in Safari, I'm overriding e and not e.stack here.
          // eslint-disable-next-line no-ex-assign
          e = e.message + '\n' + e.stack;
        }
        throw $injectorMinErr('modulerr', 'Failed to instantiate module {0} due to:\n{1}',
          module, e.stack || e.message || e);
      }
    });
    return runBlocks;
  }

  ////////////////////////////////////
  // internal Injector
  ////////////////////////////////////
  function createInternalInjector(cache, factory) {

    function getService(serviceName, caller) {
      if (cache.hasOwnProperty(serviceName)) {
        if (cache[serviceName] === INSTANTIATING) {
          throw $injectorMinErr('cdep', 'Circular dependency found: {0}',
            serviceName + ' <- ' + path.join(' <- '));
        }
        return cache[serviceName];
      } else {
        try {
          path.unshift(serviceName);
          cache[serviceName] = INSTANTIATING;
          cache[serviceName] = factory(serviceName, caller);
          return cache[serviceName];
        } catch (err) {
          if (cache[serviceName] === INSTANTIATING) {
            delete cache[serviceName];
          }
          throw err;
        } finally {
          path.shift();
        }
      }
    }


    function injectionArgs(fn, locals, serviceName) {
      var args = [],
        $inject = createInjector.$$annotate(fn, strictDi, serviceName);

      for (var i = 0, length = $inject.length; i < length; i++) {
        var key = $inject[i];
        if (typeof key !== 'string') {
          throw $injectorMinErr('itkn',
            'Incorrect injection token! Expected service name as string, got {0}', key);
        }
        args.push(locals && locals.hasOwnProperty(key) ? locals[key] :
          getService(key, serviceName));
      }
      return args;
    }

    function isClass(func) {
      // Support: IE 9-11 only
      // IE 9-11 do not support classes and IE9 leaks with the code below.
      if (msie || typeof func !== 'function') {
        return false;
      }
      var result = func.$$ngIsClass;
      if (!isBoolean(result)) {
        result = func.$$ngIsClass = /^class\b/.test(stringifyFn(func));
      }
      return result;
    }

    function invoke(fn, self, locals, serviceName) {
      if (typeof locals === 'string') {
        serviceName = locals;
        locals = null;
      }

      var args = injectionArgs(fn, locals, serviceName);
      if (isArray(fn)) {
        fn = fn[fn.length - 1];
      }

      if (!isClass(fn)) {
        // http://jsperf.com/angularjs-invoke-apply-vs-switch
        // #5388
        return fn.apply(self, args);
      } else {
        args.unshift(null);
        return new (Function.prototype.bind.apply(fn, args))();
      }
    }


    function instantiate(Type, locals, serviceName) {
      // Check if Type is annotated and use just the given function at n-1 as parameter
      // e.g. someModule.factory('greeter', ['$window', function(renamed$window) {}]);
      var ctor = (isArray(Type) ? Type[Type.length - 1] : Type);
      var args = injectionArgs(Type, locals, serviceName);
      // Empty object at position 0 is ignored for invocation with `new`, but required.
      args.unshift(null);
      return new (Function.prototype.bind.apply(ctor, args))();
    }


    return {
      invoke: invoke,
      instantiate: instantiate,
      get: getService,
      annotate: createInjector.$$annotate,
      has: function (name) {
        return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);
      }
    };
  }
}