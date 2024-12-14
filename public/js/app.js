/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(/*! process/browser.js */ "./node_modules/process/browser.js");


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");
var enhanceError = __webpack_require__(/*! ./core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var pkg = __webpack_require__(/*! ./../../package.json */ "./node_modules/axios/package.json");

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var perfect_scrollbar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! perfect-scrollbar */ "./node_modules/perfect-scrollbar/dist/perfect-scrollbar.esm.js");
/* harmony import */ var _fortawesome_fontawesome_free_css_all_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fortawesome/fontawesome-free/css/all.css */ "./node_modules/@fortawesome/fontawesome-free/css/all.css");


window.PerfectScrollbar = perfect_scrollbar__WEBPACK_IMPORTED_MODULE_0__["default"];
__webpack_require__(/*! ./bootstrap */ "./resources/js/bootstrap.js");
__webpack_require__(/*! ./custom */ "./resources/js/custom.js");
// Reference from published scripts

// Reference from vendor
__webpack_require__(/*! ../../vendor/livewire-ui/modal/resources/js/modal */ "./vendor/livewire-ui/modal/resources/js/modal.js");

/***/ }),

/***/ "./resources/js/bootstrap.js":
/*!***********************************!*\
  !*** ./resources/js/bootstrap.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

window._ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo';

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     forceTLS: true
// });

/***/ }),

/***/ "./resources/js/custom.js":
/*!********************************!*\
  !*** ./resources/js/custom.js ***!
  \********************************/
/***/ (() => {

"use strict";


(function () {
  var isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
  if (isWindows) {
    // if we are on windows OS we activate the perfectScrollbar function
    if (document.getElementsByClassName('main-content')[0]) {
      var mainpanel = document.querySelector('.main-content');
      var ps = new PerfectScrollbar(mainpanel);
    }
    ;
    if (document.getElementsByClassName('sidenav')[0]) {
      var sidebar = document.querySelector('.sidenav');
      var ps1 = new PerfectScrollbar(sidebar);
    }
    ;
    if (document.getElementsByClassName('navbar-collapse')[0]) {
      var fixedplugin = document.querySelector('.navbar:not(.navbar-expand-lg) .navbar-collapse');
      var ps2 = new PerfectScrollbar(fixedplugin);
    }
    ;
    if (document.getElementsByClassName('fixed-plugin')[0]) {
      var fixedplugin = document.querySelector('.fixed-plugin');
      var ps3 = new PerfectScrollbar(fixedplugin);
    }
    ;
  }
  ;
})();

// Verify navbar blur on scroll
navbarBlurOnScroll('navbarBlur');

// initialization of Tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Fixed Plugin

if (document.querySelector('.fixed-plugin')) {
  var fixedPlugin = document.querySelector('.fixed-plugin');
  var fixedPluginButton = document.querySelector('.fixed-plugin-button');
  var fixedPluginButtonNav = document.querySelector('.fixed-plugin-button-nav');
  var fixedPluginCard = document.querySelector('.fixed-plugin .card');
  var fixedPluginCloseButton = document.querySelectorAll('.fixed-plugin-close-button');
  var navbar = document.getElementById('navbarBlur');
  var buttonNavbarFixed = document.getElementById('navbarFixed');
  if (fixedPluginButton) {
    fixedPluginButton.onclick = function () {
      if (!fixedPlugin.classList.contains('show')) {
        fixedPlugin.classList.add('show');
      } else {
        fixedPlugin.classList.remove('show');
      }
    };
  }
  if (fixedPluginButtonNav) {
    fixedPluginButtonNav.onclick = function () {
      if (!fixedPlugin.classList.contains('show')) {
        fixedPlugin.classList.add('show');
      } else {
        fixedPlugin.classList.remove('show');
      }
    };
  }
  fixedPluginCloseButton.forEach(function (el) {
    el.onclick = function () {
      fixedPlugin.classList.remove('show');
    };
  });
  document.querySelector('body').onclick = function (e) {
    if (e.target != fixedPluginButton && e.target != fixedPluginButtonNav && e.target.closest('.fixed-plugin .card') != fixedPluginCard) {
      fixedPlugin.classList.remove('show');
    }
  };
  if (navbar) {
    if (navbar.getAttribute('navbar-scroll') == 'true') {
      buttonNavbarFixed.setAttribute("checked", "true");
    }
  }
}

// Tabs navigation

var total = document.querySelectorAll('.nav-pills');
total.forEach(function (item, i) {
  var moving_div = document.createElement('div');
  var first_li = item.querySelector('li:first-child .nav-link');
  var tab = first_li.cloneNode();
  tab.innerHTML = "-";
  moving_div.classList.add('moving-tab', 'position-absolute', 'nav-link');
  moving_div.appendChild(tab);
  item.appendChild(moving_div);
  var list_length = item.getElementsByTagName("li").length;
  moving_div.style.padding = '0px';
  moving_div.style.width = item.querySelector('li:nth-child(1)').offsetWidth + 'px';
  moving_div.style.transform = 'translate3d(0px, 0px, 0px)';
  moving_div.style.transition = '.5s ease';
  item.onmouseover = function (event) {
    var target = getEventTarget(event);
    var li = target.closest('li'); // get reference
    if (li) {
      var nodes = Array.from(li.closest('ul').children); // get array
      var index = nodes.indexOf(li) + 1;
      item.querySelector('li:nth-child(' + index + ') .nav-link').onclick = function () {
        moving_div = item.querySelector('.moving-tab');
        var sum = 0;
        if (item.classList.contains('flex-column')) {
          for (var j = 1; j <= nodes.indexOf(li); j++) {
            sum += item.querySelector('li:nth-child(' + j + ')').offsetHeight;
          }
          moving_div.style.transform = 'translate3d(0px,' + sum + 'px, 0px)';
          moving_div.style.height = item.querySelector('li:nth-child(' + j + ')').offsetHeight;
        } else {
          for (var j = 1; j <= nodes.indexOf(li); j++) {
            sum += item.querySelector('li:nth-child(' + j + ')').offsetWidth;
          }
          moving_div.style.transform = 'translate3d(' + sum + 'px, 0px, 0px)';
          moving_div.style.width = item.querySelector('li:nth-child(' + index + ')').offsetWidth + 'px';
        }
      };
    }
  };
});

// Tabs navigation resize

window.addEventListener('resize', function (event) {
  total.forEach(function (item, i) {
    item.querySelector('.moving-tab').remove();
    var moving_div = document.createElement('div');
    var tab = item.querySelector(".nav-link.active").cloneNode();
    tab.innerHTML = "-";
    moving_div.classList.add('moving-tab', 'position-absolute', 'nav-link');
    moving_div.appendChild(tab);
    item.appendChild(moving_div);
    moving_div.style.padding = '0px';
    moving_div.style.transition = '.5s ease';
    var li = item.querySelector(".nav-link.active").parentElement;
    if (li) {
      var nodes = Array.from(li.closest('ul').children); // get array
      var index = nodes.indexOf(li) + 1;
      var sum = 0;
      if (item.classList.contains('flex-column')) {
        for (var j = 1; j <= nodes.indexOf(li); j++) {
          sum += item.querySelector('li:nth-child(' + j + ')').offsetHeight;
        }
        moving_div.style.transform = 'translate3d(0px,' + sum + 'px, 0px)';
        moving_div.style.width = item.querySelector('li:nth-child(' + index + ')').offsetWidth + 'px';
        moving_div.style.height = item.querySelector('li:nth-child(' + j + ')').offsetHeight;
      } else {
        for (var j = 1; j <= nodes.indexOf(li); j++) {
          sum += item.querySelector('li:nth-child(' + j + ')').offsetWidth;
        }
        moving_div.style.transform = 'translate3d(' + sum + 'px, 0px, 0px)';
        moving_div.style.width = item.querySelector('li:nth-child(' + index + ')').offsetWidth + 'px';
      }
    }
  });
  if (window.innerWidth < 991) {
    total.forEach(function (item, i) {
      if (!item.classList.contains('flex-column')) {
        item.classList.add('flex-column', 'on-resize');
      }
    });
  } else {
    total.forEach(function (item, i) {
      if (item.classList.contains('on-resize')) {
        item.classList.remove('flex-column', 'on-resize');
      }
    });
  }
});
function getEventTarget(e) {
  e = e || window.event;
  return e.target || e.srcElement;
}

// End tabs navigation

//Set Sidebar Color
window.sidebarColor = function (a) {
  var parent = a.parentElement.children;
  var color = a.getAttribute("data-color");
  for (var i = 0; i < parent.length; i++) {
    parent[i].classList.remove('active');
  }
  if (!a.classList.contains('active')) {
    a.classList.add('active');
  } else {
    a.classList.remove('active');
  }
  var sidebar = document.querySelector('.sidenav');
  sidebar.setAttribute("data-color", color);
  if (document.querySelector('#sidenavCard')) {
    var _sidenavCard$classLis, _sidenavCardIcon$clas;
    var sidenavCard = document.querySelector('#sidenavCard');
    var sidenavCardClasses = ['card', 'card-background', 'shadow-none', 'card-background-mask-' + color];
    sidenavCard.className = '';
    (_sidenavCard$classLis = sidenavCard.classList).add.apply(_sidenavCard$classLis, sidenavCardClasses);
    var sidenavCardIcon = document.querySelector('#sidenavCardIcon');
    var sidenavCardIconClasses = ['ni', 'ni-diamond', 'text-gradient', 'text-lg', 'top-0', 'text-' + color];
    sidenavCardIcon.className = '';
    (_sidenavCardIcon$clas = sidenavCardIcon.classList).add.apply(_sidenavCardIcon$clas, sidenavCardIconClasses);
  }
};

// Set Navbar Fixed
window.navbarFixed = function (el) {
  var classes = ['position-sticky', 'blur', 'shadow-blur', 'mt-4', 'left-auto', 'top-1', 'z-index-sticky'];
  var navbar = document.getElementById('navbarBlur');
  if (!el.getAttribute("checked")) {
    var _navbar$classList;
    (_navbar$classList = navbar.classList).add.apply(_navbar$classList, classes);
    navbar.setAttribute('navbar-scroll', 'true');
    navbarBlurOnScroll('navbarBlur');
    el.setAttribute("checked", "true");
  } else {
    var _navbar$classList2;
    (_navbar$classList2 = navbar.classList).remove.apply(_navbar$classList2, classes);
    navbar.setAttribute('navbar-scroll', 'false');
    navbarBlurOnScroll('navbarBlur');
    el.removeAttribute("checked");
  }
};

// Navbar blur on scroll

function navbarBlurOnScroll(id) {
  var navbar = document.getElementById(id);
  var navbarScrollActive = navbar ? navbar.getAttribute("navbar-scroll") : false;
  var scrollDistance = 5;
  var classes = ['position-sticky', 'blur', 'shadow-blur', 'mt-4', 'left-auto', 'top-1', 'z-index-sticky'];
  var toggleClasses = ['shadow-none'];
  if (navbarScrollActive == 'true') {
    window.onscroll = debounce(function () {
      if (window.scrollY > scrollDistance) {
        blurNavbar();
      } else {
        transparentNavbar();
      }
    }, 10);
  } else {
    window.onscroll = debounce(function () {
      transparentNavbar();
    }, 10);
  }
  function blurNavbar() {
    var _navbar$classList3, _navbar$classList4;
    (_navbar$classList3 = navbar.classList).add.apply(_navbar$classList3, classes);
    (_navbar$classList4 = navbar.classList).remove.apply(_navbar$classList4, toggleClasses);
    toggleNavLinksColor('blur');
  }
  function transparentNavbar() {
    if (navbar) {
      var _navbar$classList5, _navbar$classList6;
      (_navbar$classList5 = navbar.classList).remove.apply(_navbar$classList5, classes);
      (_navbar$classList6 = navbar.classList).add.apply(_navbar$classList6, toggleClasses);
      toggleNavLinksColor('transparent');
    }
  }
  function toggleNavLinksColor(type) {
    var navLinks = document.querySelectorAll('.navbar-main .nav-link');
    var navLinksToggler = document.querySelectorAll('.navbar-main .sidenav-toggler-line');
    if (type === "blur") {
      navLinks.forEach(function (element) {
        element.classList.remove('text-body');
      });
      navLinksToggler.forEach(function (element) {
        element.classList.add('bg-dark');
      });
    } else if (type === "transparent") {
      navLinks.forEach(function (element) {
        element.classList.add('text-body');
      });
      navLinksToggler.forEach(function (element) {
        element.classList.remove('bg-dark');
      });
    }
  }
}

// Debounce Function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
;

//Set Sidebar Type
function sidebarType(a) {
  var parent = a.parentElement.children;
  var color = a.getAttribute("data-class");
  var colors = [];
  for (var i = 0; i < parent.length; i++) {
    parent[i].classList.remove('active');
    colors.push(parent[i].getAttribute('data-class'));
  }
  if (!a.classList.contains('active')) {
    a.classList.add('active');
  } else {
    a.classList.remove('active');
  }
  var sidebar = document.querySelector('.sidenav');
  for (var i = 0; i < colors.length; i++) {
    sidebar.classList.remove(colors[i]);
  }
  sidebar.classList.add(color);
}

// Toggle Sidenav
var iconNavbarSidenav = document.getElementById('iconNavbarSidenav');
var iconSidenav = document.getElementById('iconSidenav');
var sidenav = document.getElementById('sidenav-main');
var body = document.getElementsByTagName('body')[0];
var className = 'g-sidenav-pinned';
if (iconNavbarSidenav) {
  iconNavbarSidenav.addEventListener("click", toggleSidenav);
}
if (iconSidenav) {
  iconSidenav.addEventListener("click", toggleSidenav);
}
function toggleSidenav() {
  if (body.classList.contains(className)) {
    body.classList.remove(className);
    setTimeout(function () {
      sidenav.classList.remove('bg-white');
    }, 100);
    sidenav.classList.remove('bg-transparent');
  } else {
    body.classList.add(className);
    sidenav.classList.add('bg-white');
    sidenav.classList.remove('bg-transparent');
    iconSidenav.classList.remove('d-none');
  }
}

// Resize navbar color depends on configurator active type of sidenav

var referenceButtons = document.querySelector('[data-class]');
window.addEventListener("resize", navbarColorOnResize);
function navbarColorOnResize() {
  if (window.innerWidth > 1200) {
    if (referenceButtons.classList.contains('active') && referenceButtons.getAttribute('data-class') === 'bg-transparent') {
      sidenav.classList.remove('bg-white');
    } else {
      sidenav.classList.add('bg-white');
    }
  } else {
    sidenav.classList.add('bg-white');
    sidenav.classList.remove('bg-transparent');
  }
}

// Deactivate sidenav type buttons on resize and small screens
window.addEventListener("resize", sidenavTypeOnResize);
window.addEventListener("load", sidenavTypeOnResize);
function sidenavTypeOnResize() {
  var elements = document.querySelectorAll('[onclick="sidebarType(this)"]');
  if (window.innerWidth < 1200) {
    elements.forEach(function (el) {
      el.classList.add('disabled');
    });
  } else {
    elements.forEach(function (el) {
      el.classList.remove('disabled');
    });
  }
}

/***/ }),

/***/ "./vendor/livewire-ui/modal/resources/js/modal.js":
/*!********************************************************!*\
  !*** ./vendor/livewire-ui/modal/resources/js/modal.js ***!
  \********************************************************/
/***/ (() => {

window.LivewireUIModal = function () {
  return {
    show: false,
    showActiveComponent: true,
    activeComponent: false,
    componentHistory: [],
    modalWidth: null,
    getActiveComponentModalAttribute: function getActiveComponentModalAttribute(key) {
      if (this.$wire.get('components')[this.activeComponent] !== undefined) {
        return this.$wire.get('components')[this.activeComponent]['modalAttributes'][key];
      }
    },
    closeModalOnEscape: function closeModalOnEscape(trigger) {
      if (this.getActiveComponentModalAttribute('closeOnEscape') === false) {
        return;
      }
      var force = this.getActiveComponentModalAttribute('closeOnEscapeIsForceful') === true;
      this.closeModal(force);
    },
    closeModalOnClickAway: function closeModalOnClickAway(trigger) {
      if (this.getActiveComponentModalAttribute('closeOnClickAway') === false) {
        return;
      }
      this.closeModal(true);
    },
    closeModal: function closeModal() {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var skipPreviousModals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var destroySkipped = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      if (this.show === false) {
        return;
      }
      if (this.getActiveComponentModalAttribute('dispatchCloseEvent') === true) {
        var componentName = this.$wire.get('components')[this.activeComponent].name;
        Livewire.emit('modalClosed', componentName);
      }
      if (this.getActiveComponentModalAttribute('destroyOnClose') === true) {
        Livewire.emit('destroyComponent', this.activeComponent);
      }
      if (skipPreviousModals > 0) {
        for (var i = 0; i < skipPreviousModals; i++) {
          if (destroySkipped) {
            var _id = this.componentHistory[this.componentHistory.length - 1];
            Livewire.emit('destroyComponent', _id);
          }
          this.componentHistory.pop();
        }
      }
      var id = this.componentHistory.pop();
      if (id && force === false) {
        if (id) {
          this.setActiveModalComponent(id, true);
        } else {
          this.setShowPropertyTo(false);
        }
      } else {
        this.setShowPropertyTo(false);
      }
    },
    setActiveModalComponent: function setActiveModalComponent(id) {
      var _this = this;
      var skip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.setShowPropertyTo(true);
      if (this.activeComponent === id) {
        return;
      }
      if (this.activeComponent !== false && skip === false) {
        this.componentHistory.push(this.activeComponent);
      }
      var focusableTimeout = 50;
      if (this.activeComponent === false) {
        this.activeComponent = id;
        this.showActiveComponent = true;
        this.modalWidth = this.getActiveComponentModalAttribute('maxWidthClass');
      } else {
        this.showActiveComponent = false;
        focusableTimeout = 400;
        setTimeout(function () {
          _this.activeComponent = id;
          _this.showActiveComponent = true;
          _this.modalWidth = _this.getActiveComponentModalAttribute('maxWidthClass');
        }, 300);
      }
    },
    setShowPropertyTo: function setShowPropertyTo(show) {
      var _this2 = this;
      this.show = show;
      if (show) {
        document.body.classList.add('overflow-y-hidden');
      } else {
        document.body.classList.remove('overflow-y-hidden');
        setTimeout(function () {
          _this2.activeComponent = false;
          _this2.$wire.resetState();
        }, 300);
      }
    },
    init: function init() {
      var _this3 = this;
      this.modalWidth = this.getActiveComponentModalAttribute('maxWidthClass');
      Livewire.on('closeModal', function () {
        var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var skipPreviousModals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var destroySkipped = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        _this3.closeModal(force, skipPreviousModals, destroySkipped);
      });
      Livewire.on('activeModalComponentChanged', function (id) {
        _this3.setActiveModalComponent(id);
      });
    }
  };
};

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./node_modules/@fortawesome/fontawesome-free/css/all.css":
/*!**************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./node_modules/@fortawesome/fontawesome-free/css/all.css ***!
  \**************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _webfonts_fa_brands_400_woff2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../webfonts/fa-brands-400.woff2 */ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2");
/* harmony import */ var _webfonts_fa_brands_400_ttf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../webfonts/fa-brands-400.ttf */ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.ttf");
/* harmony import */ var _webfonts_fa_regular_400_woff2__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../webfonts/fa-regular-400.woff2 */ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff2");
/* harmony import */ var _webfonts_fa_regular_400_ttf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../webfonts/fa-regular-400.ttf */ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.ttf");
/* harmony import */ var _webfonts_fa_solid_900_woff2__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../webfonts/fa-solid-900.woff2 */ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2");
/* harmony import */ var _webfonts_fa_solid_900_ttf__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../webfonts/fa-solid-900.ttf */ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf");
/* harmony import */ var _webfonts_fa_v4compatibility_woff2__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../webfonts/fa-v4compatibility.woff2 */ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-v4compatibility.woff2");
/* harmony import */ var _webfonts_fa_v4compatibility_ttf__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../webfonts/fa-v4compatibility.ttf */ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-v4compatibility.ttf");
// Imports










var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_webfonts_fa_brands_400_woff2__WEBPACK_IMPORTED_MODULE_2__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_webfonts_fa_brands_400_ttf__WEBPACK_IMPORTED_MODULE_3__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_webfonts_fa_regular_400_woff2__WEBPACK_IMPORTED_MODULE_4__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_webfonts_fa_regular_400_ttf__WEBPACK_IMPORTED_MODULE_5__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_webfonts_fa_solid_900_woff2__WEBPACK_IMPORTED_MODULE_6__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_5___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_webfonts_fa_solid_900_ttf__WEBPACK_IMPORTED_MODULE_7__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_6___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_webfonts_fa_v4compatibility_woff2__WEBPACK_IMPORTED_MODULE_8__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_7___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_1___default()(_webfonts_fa_v4compatibility_ttf__WEBPACK_IMPORTED_MODULE_9__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/*!\n * Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com\n * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)\n * Copyright 2024 Fonticons, Inc.\n */\n.fa {\n  font-family: var(--fa-style-family, \"Font Awesome 6 Free\");\n  font-weight: var(--fa-style, 900); }\n\n.fas,\n.far,\n.fab,\n.fa-solid,\n.fa-regular,\n.fa-brands,\n.fa {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  display: var(--fa-display, inline-block);\n  font-style: normal;\n  font-variant: normal;\n  line-height: 1;\n  text-rendering: auto; }\n\n.fas::before,\n.far::before,\n.fab::before,\n.fa-solid::before,\n.fa-regular::before,\n.fa-brands::before,\n.fa::before {\n  content: var(--fa); }\n\n.fa-classic,\n.fas,\n.fa-solid,\n.far,\n.fa-regular {\n  font-family: 'Font Awesome 6 Free'; }\n\n.fa-brands,\n.fab {\n  font-family: 'Font Awesome 6 Brands'; }\n\n.fa-1x {\n  font-size: 1em; }\n\n.fa-2x {\n  font-size: 2em; }\n\n.fa-3x {\n  font-size: 3em; }\n\n.fa-4x {\n  font-size: 4em; }\n\n.fa-5x {\n  font-size: 5em; }\n\n.fa-6x {\n  font-size: 6em; }\n\n.fa-7x {\n  font-size: 7em; }\n\n.fa-8x {\n  font-size: 8em; }\n\n.fa-9x {\n  font-size: 9em; }\n\n.fa-10x {\n  font-size: 10em; }\n\n.fa-2xs {\n  font-size: 0.625em;\n  line-height: 0.1em;\n  vertical-align: 0.225em; }\n\n.fa-xs {\n  font-size: 0.75em;\n  line-height: 0.08333em;\n  vertical-align: 0.125em; }\n\n.fa-sm {\n  font-size: 0.875em;\n  line-height: 0.07143em;\n  vertical-align: 0.05357em; }\n\n.fa-lg {\n  font-size: 1.25em;\n  line-height: 0.05em;\n  vertical-align: -0.075em; }\n\n.fa-xl {\n  font-size: 1.5em;\n  line-height: 0.04167em;\n  vertical-align: -0.125em; }\n\n.fa-2xl {\n  font-size: 2em;\n  line-height: 0.03125em;\n  vertical-align: -0.1875em; }\n\n.fa-fw {\n  text-align: center;\n  width: 1.25em; }\n\n.fa-ul {\n  list-style-type: none;\n  margin-left: var(--fa-li-margin, 2.5em);\n  padding-left: 0; }\n  .fa-ul > li {\n    position: relative; }\n\n.fa-li {\n  left: calc(-1 * var(--fa-li-width, 2em));\n  position: absolute;\n  text-align: center;\n  width: var(--fa-li-width, 2em);\n  line-height: inherit; }\n\n.fa-border {\n  border-color: var(--fa-border-color, #eee);\n  border-radius: var(--fa-border-radius, 0.1em);\n  border-style: var(--fa-border-style, solid);\n  border-width: var(--fa-border-width, 0.08em);\n  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em); }\n\n.fa-pull-left {\n  float: left;\n  margin-right: var(--fa-pull-margin, 0.3em); }\n\n.fa-pull-right {\n  float: right;\n  margin-left: var(--fa-pull-margin, 0.3em); }\n\n.fa-beat {\n  animation-name: fa-beat;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-in-out); }\n\n.fa-bounce {\n  animation-name: fa-bounce;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1)); }\n\n.fa-fade {\n  animation-name: fa-fade;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1)); }\n\n.fa-beat-fade {\n  animation-name: fa-beat-fade;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1)); }\n\n.fa-flip {\n  animation-name: fa-flip;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-in-out); }\n\n.fa-shake {\n  animation-name: fa-shake;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, linear); }\n\n.fa-spin {\n  animation-name: fa-spin;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 2s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, linear); }\n\n.fa-spin-reverse {\n  --fa-animation-direction: reverse; }\n\n.fa-pulse,\n.fa-spin-pulse {\n  animation-name: fa-spin;\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, steps(8)); }\n\n@media (prefers-reduced-motion: reduce) {\n  .fa-beat,\n  .fa-bounce,\n  .fa-fade,\n  .fa-beat-fade,\n  .fa-flip,\n  .fa-pulse,\n  .fa-shake,\n  .fa-spin,\n  .fa-spin-pulse {\n    animation-delay: -1ms;\n    animation-duration: 1ms;\n    animation-iteration-count: 1;\n    transition-delay: 0s;\n    transition-duration: 0s; } }\n\n@keyframes fa-beat {\n  0%, 90% {\n    transform: scale(1); }\n  45% {\n    transform: scale(var(--fa-beat-scale, 1.25)); } }\n\n@keyframes fa-bounce {\n  0% {\n    transform: scale(1, 1) translateY(0); }\n  10% {\n    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0); }\n  30% {\n    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em)); }\n  50% {\n    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0); }\n  57% {\n    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em)); }\n  64% {\n    transform: scale(1, 1) translateY(0); }\n  100% {\n    transform: scale(1, 1) translateY(0); } }\n\n@keyframes fa-fade {\n  50% {\n    opacity: var(--fa-fade-opacity, 0.4); } }\n\n@keyframes fa-beat-fade {\n  0%, 100% {\n    opacity: var(--fa-beat-fade-opacity, 0.4);\n    transform: scale(1); }\n  50% {\n    opacity: 1;\n    transform: scale(var(--fa-beat-fade-scale, 1.125)); } }\n\n@keyframes fa-flip {\n  50% {\n    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg)); } }\n\n@keyframes fa-shake {\n  0% {\n    transform: rotate(-15deg); }\n  4% {\n    transform: rotate(15deg); }\n  8%, 24% {\n    transform: rotate(-18deg); }\n  12%, 28% {\n    transform: rotate(18deg); }\n  16% {\n    transform: rotate(-22deg); }\n  20% {\n    transform: rotate(22deg); }\n  32% {\n    transform: rotate(-12deg); }\n  36% {\n    transform: rotate(12deg); }\n  40%, 100% {\n    transform: rotate(0deg); } }\n\n@keyframes fa-spin {\n  0% {\n    transform: rotate(0deg); }\n  100% {\n    transform: rotate(360deg); } }\n\n.fa-rotate-90 {\n  transform: rotate(90deg); }\n\n.fa-rotate-180 {\n  transform: rotate(180deg); }\n\n.fa-rotate-270 {\n  transform: rotate(270deg); }\n\n.fa-flip-horizontal {\n  transform: scale(-1, 1); }\n\n.fa-flip-vertical {\n  transform: scale(1, -1); }\n\n.fa-flip-both,\n.fa-flip-horizontal.fa-flip-vertical {\n  transform: scale(-1, -1); }\n\n.fa-rotate-by {\n  transform: rotate(var(--fa-rotate-angle, 0)); }\n\n.fa-stack {\n  display: inline-block;\n  height: 2em;\n  line-height: 2em;\n  position: relative;\n  vertical-align: middle;\n  width: 2.5em; }\n\n.fa-stack-1x,\n.fa-stack-2x {\n  left: 0;\n  position: absolute;\n  text-align: center;\n  width: 100%;\n  z-index: var(--fa-stack-z-index, auto); }\n\n.fa-stack-1x {\n  line-height: inherit; }\n\n.fa-stack-2x {\n  font-size: 2em; }\n\n.fa-inverse {\n  color: var(--fa-inverse, #fff); }\n\n/* Font Awesome uses the Unicode Private Use Area (PUA) to ensure screen\nreaders do not read off random characters that represent icons */\n\n.fa-0 {\n  --fa: \"\\30\";\n  --fa--fa: \"\\30\\30\"; }\n\n.fa-1 {\n  --fa: \"\\31\";\n  --fa--fa: \"\\31\\31\"; }\n\n.fa-2 {\n  --fa: \"\\32\";\n  --fa--fa: \"\\32\\32\"; }\n\n.fa-3 {\n  --fa: \"\\33\";\n  --fa--fa: \"\\33\\33\"; }\n\n.fa-4 {\n  --fa: \"\\34\";\n  --fa--fa: \"\\34\\34\"; }\n\n.fa-5 {\n  --fa: \"\\35\";\n  --fa--fa: \"\\35\\35\"; }\n\n.fa-6 {\n  --fa: \"\\36\";\n  --fa--fa: \"\\36\\36\"; }\n\n.fa-7 {\n  --fa: \"\\37\";\n  --fa--fa: \"\\37\\37\"; }\n\n.fa-8 {\n  --fa: \"\\38\";\n  --fa--fa: \"\\38\\38\"; }\n\n.fa-9 {\n  --fa: \"\\39\";\n  --fa--fa: \"\\39\\39\"; }\n\n.fa-fill-drip {\n  --fa: \"\\f576\";\n  --fa--fa: \"\\f576\\f576\"; }\n\n.fa-arrows-to-circle {\n  --fa: \"\\e4bd\";\n  --fa--fa: \"\\e4bd\\e4bd\"; }\n\n.fa-circle-chevron-right {\n  --fa: \"\\f138\";\n  --fa--fa: \"\\f138\\f138\"; }\n\n.fa-chevron-circle-right {\n  --fa: \"\\f138\";\n  --fa--fa: \"\\f138\\f138\"; }\n\n.fa-at {\n  --fa: \"\\40\";\n  --fa--fa: \"\\40\\40\"; }\n\n.fa-trash-can {\n  --fa: \"\\f2ed\";\n  --fa--fa: \"\\f2ed\\f2ed\"; }\n\n.fa-trash-alt {\n  --fa: \"\\f2ed\";\n  --fa--fa: \"\\f2ed\\f2ed\"; }\n\n.fa-text-height {\n  --fa: \"\\f034\";\n  --fa--fa: \"\\f034\\f034\"; }\n\n.fa-user-xmark {\n  --fa: \"\\f235\";\n  --fa--fa: \"\\f235\\f235\"; }\n\n.fa-user-times {\n  --fa: \"\\f235\";\n  --fa--fa: \"\\f235\\f235\"; }\n\n.fa-stethoscope {\n  --fa: \"\\f0f1\";\n  --fa--fa: \"\\f0f1\\f0f1\"; }\n\n.fa-message {\n  --fa: \"\\f27a\";\n  --fa--fa: \"\\f27a\\f27a\"; }\n\n.fa-comment-alt {\n  --fa: \"\\f27a\";\n  --fa--fa: \"\\f27a\\f27a\"; }\n\n.fa-info {\n  --fa: \"\\f129\";\n  --fa--fa: \"\\f129\\f129\"; }\n\n.fa-down-left-and-up-right-to-center {\n  --fa: \"\\f422\";\n  --fa--fa: \"\\f422\\f422\"; }\n\n.fa-compress-alt {\n  --fa: \"\\f422\";\n  --fa--fa: \"\\f422\\f422\"; }\n\n.fa-explosion {\n  --fa: \"\\e4e9\";\n  --fa--fa: \"\\e4e9\\e4e9\"; }\n\n.fa-file-lines {\n  --fa: \"\\f15c\";\n  --fa--fa: \"\\f15c\\f15c\"; }\n\n.fa-file-alt {\n  --fa: \"\\f15c\";\n  --fa--fa: \"\\f15c\\f15c\"; }\n\n.fa-file-text {\n  --fa: \"\\f15c\";\n  --fa--fa: \"\\f15c\\f15c\"; }\n\n.fa-wave-square {\n  --fa: \"\\f83e\";\n  --fa--fa: \"\\f83e\\f83e\"; }\n\n.fa-ring {\n  --fa: \"\\f70b\";\n  --fa--fa: \"\\f70b\\f70b\"; }\n\n.fa-building-un {\n  --fa: \"\\e4d9\";\n  --fa--fa: \"\\e4d9\\e4d9\"; }\n\n.fa-dice-three {\n  --fa: \"\\f527\";\n  --fa--fa: \"\\f527\\f527\"; }\n\n.fa-calendar-days {\n  --fa: \"\\f073\";\n  --fa--fa: \"\\f073\\f073\"; }\n\n.fa-calendar-alt {\n  --fa: \"\\f073\";\n  --fa--fa: \"\\f073\\f073\"; }\n\n.fa-anchor-circle-check {\n  --fa: \"\\e4aa\";\n  --fa--fa: \"\\e4aa\\e4aa\"; }\n\n.fa-building-circle-arrow-right {\n  --fa: \"\\e4d1\";\n  --fa--fa: \"\\e4d1\\e4d1\"; }\n\n.fa-volleyball {\n  --fa: \"\\f45f\";\n  --fa--fa: \"\\f45f\\f45f\"; }\n\n.fa-volleyball-ball {\n  --fa: \"\\f45f\";\n  --fa--fa: \"\\f45f\\f45f\"; }\n\n.fa-arrows-up-to-line {\n  --fa: \"\\e4c2\";\n  --fa--fa: \"\\e4c2\\e4c2\"; }\n\n.fa-sort-down {\n  --fa: \"\\f0dd\";\n  --fa--fa: \"\\f0dd\\f0dd\"; }\n\n.fa-sort-desc {\n  --fa: \"\\f0dd\";\n  --fa--fa: \"\\f0dd\\f0dd\"; }\n\n.fa-circle-minus {\n  --fa: \"\\f056\";\n  --fa--fa: \"\\f056\\f056\"; }\n\n.fa-minus-circle {\n  --fa: \"\\f056\";\n  --fa--fa: \"\\f056\\f056\"; }\n\n.fa-door-open {\n  --fa: \"\\f52b\";\n  --fa--fa: \"\\f52b\\f52b\"; }\n\n.fa-right-from-bracket {\n  --fa: \"\\f2f5\";\n  --fa--fa: \"\\f2f5\\f2f5\"; }\n\n.fa-sign-out-alt {\n  --fa: \"\\f2f5\";\n  --fa--fa: \"\\f2f5\\f2f5\"; }\n\n.fa-atom {\n  --fa: \"\\f5d2\";\n  --fa--fa: \"\\f5d2\\f5d2\"; }\n\n.fa-soap {\n  --fa: \"\\e06e\";\n  --fa--fa: \"\\e06e\\e06e\"; }\n\n.fa-icons {\n  --fa: \"\\f86d\";\n  --fa--fa: \"\\f86d\\f86d\"; }\n\n.fa-heart-music-camera-bolt {\n  --fa: \"\\f86d\";\n  --fa--fa: \"\\f86d\\f86d\"; }\n\n.fa-microphone-lines-slash {\n  --fa: \"\\f539\";\n  --fa--fa: \"\\f539\\f539\"; }\n\n.fa-microphone-alt-slash {\n  --fa: \"\\f539\";\n  --fa--fa: \"\\f539\\f539\"; }\n\n.fa-bridge-circle-check {\n  --fa: \"\\e4c9\";\n  --fa--fa: \"\\e4c9\\e4c9\"; }\n\n.fa-pump-medical {\n  --fa: \"\\e06a\";\n  --fa--fa: \"\\e06a\\e06a\"; }\n\n.fa-fingerprint {\n  --fa: \"\\f577\";\n  --fa--fa: \"\\f577\\f577\"; }\n\n.fa-hand-point-right {\n  --fa: \"\\f0a4\";\n  --fa--fa: \"\\f0a4\\f0a4\"; }\n\n.fa-magnifying-glass-location {\n  --fa: \"\\f689\";\n  --fa--fa: \"\\f689\\f689\"; }\n\n.fa-search-location {\n  --fa: \"\\f689\";\n  --fa--fa: \"\\f689\\f689\"; }\n\n.fa-forward-step {\n  --fa: \"\\f051\";\n  --fa--fa: \"\\f051\\f051\"; }\n\n.fa-step-forward {\n  --fa: \"\\f051\";\n  --fa--fa: \"\\f051\\f051\"; }\n\n.fa-face-smile-beam {\n  --fa: \"\\f5b8\";\n  --fa--fa: \"\\f5b8\\f5b8\"; }\n\n.fa-smile-beam {\n  --fa: \"\\f5b8\";\n  --fa--fa: \"\\f5b8\\f5b8\"; }\n\n.fa-flag-checkered {\n  --fa: \"\\f11e\";\n  --fa--fa: \"\\f11e\\f11e\"; }\n\n.fa-football {\n  --fa: \"\\f44e\";\n  --fa--fa: \"\\f44e\\f44e\"; }\n\n.fa-football-ball {\n  --fa: \"\\f44e\";\n  --fa--fa: \"\\f44e\\f44e\"; }\n\n.fa-school-circle-exclamation {\n  --fa: \"\\e56c\";\n  --fa--fa: \"\\e56c\\e56c\"; }\n\n.fa-crop {\n  --fa: \"\\f125\";\n  --fa--fa: \"\\f125\\f125\"; }\n\n.fa-angles-down {\n  --fa: \"\\f103\";\n  --fa--fa: \"\\f103\\f103\"; }\n\n.fa-angle-double-down {\n  --fa: \"\\f103\";\n  --fa--fa: \"\\f103\\f103\"; }\n\n.fa-users-rectangle {\n  --fa: \"\\e594\";\n  --fa--fa: \"\\e594\\e594\"; }\n\n.fa-people-roof {\n  --fa: \"\\e537\";\n  --fa--fa: \"\\e537\\e537\"; }\n\n.fa-people-line {\n  --fa: \"\\e534\";\n  --fa--fa: \"\\e534\\e534\"; }\n\n.fa-beer-mug-empty {\n  --fa: \"\\f0fc\";\n  --fa--fa: \"\\f0fc\\f0fc\"; }\n\n.fa-beer {\n  --fa: \"\\f0fc\";\n  --fa--fa: \"\\f0fc\\f0fc\"; }\n\n.fa-diagram-predecessor {\n  --fa: \"\\e477\";\n  --fa--fa: \"\\e477\\e477\"; }\n\n.fa-arrow-up-long {\n  --fa: \"\\f176\";\n  --fa--fa: \"\\f176\\f176\"; }\n\n.fa-long-arrow-up {\n  --fa: \"\\f176\";\n  --fa--fa: \"\\f176\\f176\"; }\n\n.fa-fire-flame-simple {\n  --fa: \"\\f46a\";\n  --fa--fa: \"\\f46a\\f46a\"; }\n\n.fa-burn {\n  --fa: \"\\f46a\";\n  --fa--fa: \"\\f46a\\f46a\"; }\n\n.fa-person {\n  --fa: \"\\f183\";\n  --fa--fa: \"\\f183\\f183\"; }\n\n.fa-male {\n  --fa: \"\\f183\";\n  --fa--fa: \"\\f183\\f183\"; }\n\n.fa-laptop {\n  --fa: \"\\f109\";\n  --fa--fa: \"\\f109\\f109\"; }\n\n.fa-file-csv {\n  --fa: \"\\f6dd\";\n  --fa--fa: \"\\f6dd\\f6dd\"; }\n\n.fa-menorah {\n  --fa: \"\\f676\";\n  --fa--fa: \"\\f676\\f676\"; }\n\n.fa-truck-plane {\n  --fa: \"\\e58f\";\n  --fa--fa: \"\\e58f\\e58f\"; }\n\n.fa-record-vinyl {\n  --fa: \"\\f8d9\";\n  --fa--fa: \"\\f8d9\\f8d9\"; }\n\n.fa-face-grin-stars {\n  --fa: \"\\f587\";\n  --fa--fa: \"\\f587\\f587\"; }\n\n.fa-grin-stars {\n  --fa: \"\\f587\";\n  --fa--fa: \"\\f587\\f587\"; }\n\n.fa-bong {\n  --fa: \"\\f55c\";\n  --fa--fa: \"\\f55c\\f55c\"; }\n\n.fa-spaghetti-monster-flying {\n  --fa: \"\\f67b\";\n  --fa--fa: \"\\f67b\\f67b\"; }\n\n.fa-pastafarianism {\n  --fa: \"\\f67b\";\n  --fa--fa: \"\\f67b\\f67b\"; }\n\n.fa-arrow-down-up-across-line {\n  --fa: \"\\e4af\";\n  --fa--fa: \"\\e4af\\e4af\"; }\n\n.fa-spoon {\n  --fa: \"\\f2e5\";\n  --fa--fa: \"\\f2e5\\f2e5\"; }\n\n.fa-utensil-spoon {\n  --fa: \"\\f2e5\";\n  --fa--fa: \"\\f2e5\\f2e5\"; }\n\n.fa-jar-wheat {\n  --fa: \"\\e517\";\n  --fa--fa: \"\\e517\\e517\"; }\n\n.fa-envelopes-bulk {\n  --fa: \"\\f674\";\n  --fa--fa: \"\\f674\\f674\"; }\n\n.fa-mail-bulk {\n  --fa: \"\\f674\";\n  --fa--fa: \"\\f674\\f674\"; }\n\n.fa-file-circle-exclamation {\n  --fa: \"\\e4eb\";\n  --fa--fa: \"\\e4eb\\e4eb\"; }\n\n.fa-circle-h {\n  --fa: \"\\f47e\";\n  --fa--fa: \"\\f47e\\f47e\"; }\n\n.fa-hospital-symbol {\n  --fa: \"\\f47e\";\n  --fa--fa: \"\\f47e\\f47e\"; }\n\n.fa-pager {\n  --fa: \"\\f815\";\n  --fa--fa: \"\\f815\\f815\"; }\n\n.fa-address-book {\n  --fa: \"\\f2b9\";\n  --fa--fa: \"\\f2b9\\f2b9\"; }\n\n.fa-contact-book {\n  --fa: \"\\f2b9\";\n  --fa--fa: \"\\f2b9\\f2b9\"; }\n\n.fa-strikethrough {\n  --fa: \"\\f0cc\";\n  --fa--fa: \"\\f0cc\\f0cc\"; }\n\n.fa-k {\n  --fa: \"\\4b\";\n  --fa--fa: \"\\4b\\4b\"; }\n\n.fa-landmark-flag {\n  --fa: \"\\e51c\";\n  --fa--fa: \"\\e51c\\e51c\"; }\n\n.fa-pencil {\n  --fa: \"\\f303\";\n  --fa--fa: \"\\f303\\f303\"; }\n\n.fa-pencil-alt {\n  --fa: \"\\f303\";\n  --fa--fa: \"\\f303\\f303\"; }\n\n.fa-backward {\n  --fa: \"\\f04a\";\n  --fa--fa: \"\\f04a\\f04a\"; }\n\n.fa-caret-right {\n  --fa: \"\\f0da\";\n  --fa--fa: \"\\f0da\\f0da\"; }\n\n.fa-comments {\n  --fa: \"\\f086\";\n  --fa--fa: \"\\f086\\f086\"; }\n\n.fa-paste {\n  --fa: \"\\f0ea\";\n  --fa--fa: \"\\f0ea\\f0ea\"; }\n\n.fa-file-clipboard {\n  --fa: \"\\f0ea\";\n  --fa--fa: \"\\f0ea\\f0ea\"; }\n\n.fa-code-pull-request {\n  --fa: \"\\e13c\";\n  --fa--fa: \"\\e13c\\e13c\"; }\n\n.fa-clipboard-list {\n  --fa: \"\\f46d\";\n  --fa--fa: \"\\f46d\\f46d\"; }\n\n.fa-truck-ramp-box {\n  --fa: \"\\f4de\";\n  --fa--fa: \"\\f4de\\f4de\"; }\n\n.fa-truck-loading {\n  --fa: \"\\f4de\";\n  --fa--fa: \"\\f4de\\f4de\"; }\n\n.fa-user-check {\n  --fa: \"\\f4fc\";\n  --fa--fa: \"\\f4fc\\f4fc\"; }\n\n.fa-vial-virus {\n  --fa: \"\\e597\";\n  --fa--fa: \"\\e597\\e597\"; }\n\n.fa-sheet-plastic {\n  --fa: \"\\e571\";\n  --fa--fa: \"\\e571\\e571\"; }\n\n.fa-blog {\n  --fa: \"\\f781\";\n  --fa--fa: \"\\f781\\f781\"; }\n\n.fa-user-ninja {\n  --fa: \"\\f504\";\n  --fa--fa: \"\\f504\\f504\"; }\n\n.fa-person-arrow-up-from-line {\n  --fa: \"\\e539\";\n  --fa--fa: \"\\e539\\e539\"; }\n\n.fa-scroll-torah {\n  --fa: \"\\f6a0\";\n  --fa--fa: \"\\f6a0\\f6a0\"; }\n\n.fa-torah {\n  --fa: \"\\f6a0\";\n  --fa--fa: \"\\f6a0\\f6a0\"; }\n\n.fa-broom-ball {\n  --fa: \"\\f458\";\n  --fa--fa: \"\\f458\\f458\"; }\n\n.fa-quidditch {\n  --fa: \"\\f458\";\n  --fa--fa: \"\\f458\\f458\"; }\n\n.fa-quidditch-broom-ball {\n  --fa: \"\\f458\";\n  --fa--fa: \"\\f458\\f458\"; }\n\n.fa-toggle-off {\n  --fa: \"\\f204\";\n  --fa--fa: \"\\f204\\f204\"; }\n\n.fa-box-archive {\n  --fa: \"\\f187\";\n  --fa--fa: \"\\f187\\f187\"; }\n\n.fa-archive {\n  --fa: \"\\f187\";\n  --fa--fa: \"\\f187\\f187\"; }\n\n.fa-person-drowning {\n  --fa: \"\\e545\";\n  --fa--fa: \"\\e545\\e545\"; }\n\n.fa-arrow-down-9-1 {\n  --fa: \"\\f886\";\n  --fa--fa: \"\\f886\\f886\"; }\n\n.fa-sort-numeric-desc {\n  --fa: \"\\f886\";\n  --fa--fa: \"\\f886\\f886\"; }\n\n.fa-sort-numeric-down-alt {\n  --fa: \"\\f886\";\n  --fa--fa: \"\\f886\\f886\"; }\n\n.fa-face-grin-tongue-squint {\n  --fa: \"\\f58a\";\n  --fa--fa: \"\\f58a\\f58a\"; }\n\n.fa-grin-tongue-squint {\n  --fa: \"\\f58a\";\n  --fa--fa: \"\\f58a\\f58a\"; }\n\n.fa-spray-can {\n  --fa: \"\\f5bd\";\n  --fa--fa: \"\\f5bd\\f5bd\"; }\n\n.fa-truck-monster {\n  --fa: \"\\f63b\";\n  --fa--fa: \"\\f63b\\f63b\"; }\n\n.fa-w {\n  --fa: \"\\57\";\n  --fa--fa: \"\\57\\57\"; }\n\n.fa-earth-africa {\n  --fa: \"\\f57c\";\n  --fa--fa: \"\\f57c\\f57c\"; }\n\n.fa-globe-africa {\n  --fa: \"\\f57c\";\n  --fa--fa: \"\\f57c\\f57c\"; }\n\n.fa-rainbow {\n  --fa: \"\\f75b\";\n  --fa--fa: \"\\f75b\\f75b\"; }\n\n.fa-circle-notch {\n  --fa: \"\\f1ce\";\n  --fa--fa: \"\\f1ce\\f1ce\"; }\n\n.fa-tablet-screen-button {\n  --fa: \"\\f3fa\";\n  --fa--fa: \"\\f3fa\\f3fa\"; }\n\n.fa-tablet-alt {\n  --fa: \"\\f3fa\";\n  --fa--fa: \"\\f3fa\\f3fa\"; }\n\n.fa-paw {\n  --fa: \"\\f1b0\";\n  --fa--fa: \"\\f1b0\\f1b0\"; }\n\n.fa-cloud {\n  --fa: \"\\f0c2\";\n  --fa--fa: \"\\f0c2\\f0c2\"; }\n\n.fa-trowel-bricks {\n  --fa: \"\\e58a\";\n  --fa--fa: \"\\e58a\\e58a\"; }\n\n.fa-face-flushed {\n  --fa: \"\\f579\";\n  --fa--fa: \"\\f579\\f579\"; }\n\n.fa-flushed {\n  --fa: \"\\f579\";\n  --fa--fa: \"\\f579\\f579\"; }\n\n.fa-hospital-user {\n  --fa: \"\\f80d\";\n  --fa--fa: \"\\f80d\\f80d\"; }\n\n.fa-tent-arrow-left-right {\n  --fa: \"\\e57f\";\n  --fa--fa: \"\\e57f\\e57f\"; }\n\n.fa-gavel {\n  --fa: \"\\f0e3\";\n  --fa--fa: \"\\f0e3\\f0e3\"; }\n\n.fa-legal {\n  --fa: \"\\f0e3\";\n  --fa--fa: \"\\f0e3\\f0e3\"; }\n\n.fa-binoculars {\n  --fa: \"\\f1e5\";\n  --fa--fa: \"\\f1e5\\f1e5\"; }\n\n.fa-microphone-slash {\n  --fa: \"\\f131\";\n  --fa--fa: \"\\f131\\f131\"; }\n\n.fa-box-tissue {\n  --fa: \"\\e05b\";\n  --fa--fa: \"\\e05b\\e05b\"; }\n\n.fa-motorcycle {\n  --fa: \"\\f21c\";\n  --fa--fa: \"\\f21c\\f21c\"; }\n\n.fa-bell-concierge {\n  --fa: \"\\f562\";\n  --fa--fa: \"\\f562\\f562\"; }\n\n.fa-concierge-bell {\n  --fa: \"\\f562\";\n  --fa--fa: \"\\f562\\f562\"; }\n\n.fa-pen-ruler {\n  --fa: \"\\f5ae\";\n  --fa--fa: \"\\f5ae\\f5ae\"; }\n\n.fa-pencil-ruler {\n  --fa: \"\\f5ae\";\n  --fa--fa: \"\\f5ae\\f5ae\"; }\n\n.fa-people-arrows {\n  --fa: \"\\e068\";\n  --fa--fa: \"\\e068\\e068\"; }\n\n.fa-people-arrows-left-right {\n  --fa: \"\\e068\";\n  --fa--fa: \"\\e068\\e068\"; }\n\n.fa-mars-and-venus-burst {\n  --fa: \"\\e523\";\n  --fa--fa: \"\\e523\\e523\"; }\n\n.fa-square-caret-right {\n  --fa: \"\\f152\";\n  --fa--fa: \"\\f152\\f152\"; }\n\n.fa-caret-square-right {\n  --fa: \"\\f152\";\n  --fa--fa: \"\\f152\\f152\"; }\n\n.fa-scissors {\n  --fa: \"\\f0c4\";\n  --fa--fa: \"\\f0c4\\f0c4\"; }\n\n.fa-cut {\n  --fa: \"\\f0c4\";\n  --fa--fa: \"\\f0c4\\f0c4\"; }\n\n.fa-sun-plant-wilt {\n  --fa: \"\\e57a\";\n  --fa--fa: \"\\e57a\\e57a\"; }\n\n.fa-toilets-portable {\n  --fa: \"\\e584\";\n  --fa--fa: \"\\e584\\e584\"; }\n\n.fa-hockey-puck {\n  --fa: \"\\f453\";\n  --fa--fa: \"\\f453\\f453\"; }\n\n.fa-table {\n  --fa: \"\\f0ce\";\n  --fa--fa: \"\\f0ce\\f0ce\"; }\n\n.fa-magnifying-glass-arrow-right {\n  --fa: \"\\e521\";\n  --fa--fa: \"\\e521\\e521\"; }\n\n.fa-tachograph-digital {\n  --fa: \"\\f566\";\n  --fa--fa: \"\\f566\\f566\"; }\n\n.fa-digital-tachograph {\n  --fa: \"\\f566\";\n  --fa--fa: \"\\f566\\f566\"; }\n\n.fa-users-slash {\n  --fa: \"\\e073\";\n  --fa--fa: \"\\e073\\e073\"; }\n\n.fa-clover {\n  --fa: \"\\e139\";\n  --fa--fa: \"\\e139\\e139\"; }\n\n.fa-reply {\n  --fa: \"\\f3e5\";\n  --fa--fa: \"\\f3e5\\f3e5\"; }\n\n.fa-mail-reply {\n  --fa: \"\\f3e5\";\n  --fa--fa: \"\\f3e5\\f3e5\"; }\n\n.fa-star-and-crescent {\n  --fa: \"\\f699\";\n  --fa--fa: \"\\f699\\f699\"; }\n\n.fa-house-fire {\n  --fa: \"\\e50c\";\n  --fa--fa: \"\\e50c\\e50c\"; }\n\n.fa-square-minus {\n  --fa: \"\\f146\";\n  --fa--fa: \"\\f146\\f146\"; }\n\n.fa-minus-square {\n  --fa: \"\\f146\";\n  --fa--fa: \"\\f146\\f146\"; }\n\n.fa-helicopter {\n  --fa: \"\\f533\";\n  --fa--fa: \"\\f533\\f533\"; }\n\n.fa-compass {\n  --fa: \"\\f14e\";\n  --fa--fa: \"\\f14e\\f14e\"; }\n\n.fa-square-caret-down {\n  --fa: \"\\f150\";\n  --fa--fa: \"\\f150\\f150\"; }\n\n.fa-caret-square-down {\n  --fa: \"\\f150\";\n  --fa--fa: \"\\f150\\f150\"; }\n\n.fa-file-circle-question {\n  --fa: \"\\e4ef\";\n  --fa--fa: \"\\e4ef\\e4ef\"; }\n\n.fa-laptop-code {\n  --fa: \"\\f5fc\";\n  --fa--fa: \"\\f5fc\\f5fc\"; }\n\n.fa-swatchbook {\n  --fa: \"\\f5c3\";\n  --fa--fa: \"\\f5c3\\f5c3\"; }\n\n.fa-prescription-bottle {\n  --fa: \"\\f485\";\n  --fa--fa: \"\\f485\\f485\"; }\n\n.fa-bars {\n  --fa: \"\\f0c9\";\n  --fa--fa: \"\\f0c9\\f0c9\"; }\n\n.fa-navicon {\n  --fa: \"\\f0c9\";\n  --fa--fa: \"\\f0c9\\f0c9\"; }\n\n.fa-people-group {\n  --fa: \"\\e533\";\n  --fa--fa: \"\\e533\\e533\"; }\n\n.fa-hourglass-end {\n  --fa: \"\\f253\";\n  --fa--fa: \"\\f253\\f253\"; }\n\n.fa-hourglass-3 {\n  --fa: \"\\f253\";\n  --fa--fa: \"\\f253\\f253\"; }\n\n.fa-heart-crack {\n  --fa: \"\\f7a9\";\n  --fa--fa: \"\\f7a9\\f7a9\"; }\n\n.fa-heart-broken {\n  --fa: \"\\f7a9\";\n  --fa--fa: \"\\f7a9\\f7a9\"; }\n\n.fa-square-up-right {\n  --fa: \"\\f360\";\n  --fa--fa: \"\\f360\\f360\"; }\n\n.fa-external-link-square-alt {\n  --fa: \"\\f360\";\n  --fa--fa: \"\\f360\\f360\"; }\n\n.fa-face-kiss-beam {\n  --fa: \"\\f597\";\n  --fa--fa: \"\\f597\\f597\"; }\n\n.fa-kiss-beam {\n  --fa: \"\\f597\";\n  --fa--fa: \"\\f597\\f597\"; }\n\n.fa-film {\n  --fa: \"\\f008\";\n  --fa--fa: \"\\f008\\f008\"; }\n\n.fa-ruler-horizontal {\n  --fa: \"\\f547\";\n  --fa--fa: \"\\f547\\f547\"; }\n\n.fa-people-robbery {\n  --fa: \"\\e536\";\n  --fa--fa: \"\\e536\\e536\"; }\n\n.fa-lightbulb {\n  --fa: \"\\f0eb\";\n  --fa--fa: \"\\f0eb\\f0eb\"; }\n\n.fa-caret-left {\n  --fa: \"\\f0d9\";\n  --fa--fa: \"\\f0d9\\f0d9\"; }\n\n.fa-circle-exclamation {\n  --fa: \"\\f06a\";\n  --fa--fa: \"\\f06a\\f06a\"; }\n\n.fa-exclamation-circle {\n  --fa: \"\\f06a\";\n  --fa--fa: \"\\f06a\\f06a\"; }\n\n.fa-school-circle-xmark {\n  --fa: \"\\e56d\";\n  --fa--fa: \"\\e56d\\e56d\"; }\n\n.fa-arrow-right-from-bracket {\n  --fa: \"\\f08b\";\n  --fa--fa: \"\\f08b\\f08b\"; }\n\n.fa-sign-out {\n  --fa: \"\\f08b\";\n  --fa--fa: \"\\f08b\\f08b\"; }\n\n.fa-circle-chevron-down {\n  --fa: \"\\f13a\";\n  --fa--fa: \"\\f13a\\f13a\"; }\n\n.fa-chevron-circle-down {\n  --fa: \"\\f13a\";\n  --fa--fa: \"\\f13a\\f13a\"; }\n\n.fa-unlock-keyhole {\n  --fa: \"\\f13e\";\n  --fa--fa: \"\\f13e\\f13e\"; }\n\n.fa-unlock-alt {\n  --fa: \"\\f13e\";\n  --fa--fa: \"\\f13e\\f13e\"; }\n\n.fa-cloud-showers-heavy {\n  --fa: \"\\f740\";\n  --fa--fa: \"\\f740\\f740\"; }\n\n.fa-headphones-simple {\n  --fa: \"\\f58f\";\n  --fa--fa: \"\\f58f\\f58f\"; }\n\n.fa-headphones-alt {\n  --fa: \"\\f58f\";\n  --fa--fa: \"\\f58f\\f58f\"; }\n\n.fa-sitemap {\n  --fa: \"\\f0e8\";\n  --fa--fa: \"\\f0e8\\f0e8\"; }\n\n.fa-circle-dollar-to-slot {\n  --fa: \"\\f4b9\";\n  --fa--fa: \"\\f4b9\\f4b9\"; }\n\n.fa-donate {\n  --fa: \"\\f4b9\";\n  --fa--fa: \"\\f4b9\\f4b9\"; }\n\n.fa-memory {\n  --fa: \"\\f538\";\n  --fa--fa: \"\\f538\\f538\"; }\n\n.fa-road-spikes {\n  --fa: \"\\e568\";\n  --fa--fa: \"\\e568\\e568\"; }\n\n.fa-fire-burner {\n  --fa: \"\\e4f1\";\n  --fa--fa: \"\\e4f1\\e4f1\"; }\n\n.fa-flag {\n  --fa: \"\\f024\";\n  --fa--fa: \"\\f024\\f024\"; }\n\n.fa-hanukiah {\n  --fa: \"\\f6e6\";\n  --fa--fa: \"\\f6e6\\f6e6\"; }\n\n.fa-feather {\n  --fa: \"\\f52d\";\n  --fa--fa: \"\\f52d\\f52d\"; }\n\n.fa-volume-low {\n  --fa: \"\\f027\";\n  --fa--fa: \"\\f027\\f027\"; }\n\n.fa-volume-down {\n  --fa: \"\\f027\";\n  --fa--fa: \"\\f027\\f027\"; }\n\n.fa-comment-slash {\n  --fa: \"\\f4b3\";\n  --fa--fa: \"\\f4b3\\f4b3\"; }\n\n.fa-cloud-sun-rain {\n  --fa: \"\\f743\";\n  --fa--fa: \"\\f743\\f743\"; }\n\n.fa-compress {\n  --fa: \"\\f066\";\n  --fa--fa: \"\\f066\\f066\"; }\n\n.fa-wheat-awn {\n  --fa: \"\\e2cd\";\n  --fa--fa: \"\\e2cd\\e2cd\"; }\n\n.fa-wheat-alt {\n  --fa: \"\\e2cd\";\n  --fa--fa: \"\\e2cd\\e2cd\"; }\n\n.fa-ankh {\n  --fa: \"\\f644\";\n  --fa--fa: \"\\f644\\f644\"; }\n\n.fa-hands-holding-child {\n  --fa: \"\\e4fa\";\n  --fa--fa: \"\\e4fa\\e4fa\"; }\n\n.fa-asterisk {\n  --fa: \"\\2a\";\n  --fa--fa: \"\\2a\\2a\"; }\n\n.fa-square-check {\n  --fa: \"\\f14a\";\n  --fa--fa: \"\\f14a\\f14a\"; }\n\n.fa-check-square {\n  --fa: \"\\f14a\";\n  --fa--fa: \"\\f14a\\f14a\"; }\n\n.fa-peseta-sign {\n  --fa: \"\\e221\";\n  --fa--fa: \"\\e221\\e221\"; }\n\n.fa-heading {\n  --fa: \"\\f1dc\";\n  --fa--fa: \"\\f1dc\\f1dc\"; }\n\n.fa-header {\n  --fa: \"\\f1dc\";\n  --fa--fa: \"\\f1dc\\f1dc\"; }\n\n.fa-ghost {\n  --fa: \"\\f6e2\";\n  --fa--fa: \"\\f6e2\\f6e2\"; }\n\n.fa-list {\n  --fa: \"\\f03a\";\n  --fa--fa: \"\\f03a\\f03a\"; }\n\n.fa-list-squares {\n  --fa: \"\\f03a\";\n  --fa--fa: \"\\f03a\\f03a\"; }\n\n.fa-square-phone-flip {\n  --fa: \"\\f87b\";\n  --fa--fa: \"\\f87b\\f87b\"; }\n\n.fa-phone-square-alt {\n  --fa: \"\\f87b\";\n  --fa--fa: \"\\f87b\\f87b\"; }\n\n.fa-cart-plus {\n  --fa: \"\\f217\";\n  --fa--fa: \"\\f217\\f217\"; }\n\n.fa-gamepad {\n  --fa: \"\\f11b\";\n  --fa--fa: \"\\f11b\\f11b\"; }\n\n.fa-circle-dot {\n  --fa: \"\\f192\";\n  --fa--fa: \"\\f192\\f192\"; }\n\n.fa-dot-circle {\n  --fa: \"\\f192\";\n  --fa--fa: \"\\f192\\f192\"; }\n\n.fa-face-dizzy {\n  --fa: \"\\f567\";\n  --fa--fa: \"\\f567\\f567\"; }\n\n.fa-dizzy {\n  --fa: \"\\f567\";\n  --fa--fa: \"\\f567\\f567\"; }\n\n.fa-egg {\n  --fa: \"\\f7fb\";\n  --fa--fa: \"\\f7fb\\f7fb\"; }\n\n.fa-house-medical-circle-xmark {\n  --fa: \"\\e513\";\n  --fa--fa: \"\\e513\\e513\"; }\n\n.fa-campground {\n  --fa: \"\\f6bb\";\n  --fa--fa: \"\\f6bb\\f6bb\"; }\n\n.fa-folder-plus {\n  --fa: \"\\f65e\";\n  --fa--fa: \"\\f65e\\f65e\"; }\n\n.fa-futbol {\n  --fa: \"\\f1e3\";\n  --fa--fa: \"\\f1e3\\f1e3\"; }\n\n.fa-futbol-ball {\n  --fa: \"\\f1e3\";\n  --fa--fa: \"\\f1e3\\f1e3\"; }\n\n.fa-soccer-ball {\n  --fa: \"\\f1e3\";\n  --fa--fa: \"\\f1e3\\f1e3\"; }\n\n.fa-paintbrush {\n  --fa: \"\\f1fc\";\n  --fa--fa: \"\\f1fc\\f1fc\"; }\n\n.fa-paint-brush {\n  --fa: \"\\f1fc\";\n  --fa--fa: \"\\f1fc\\f1fc\"; }\n\n.fa-lock {\n  --fa: \"\\f023\";\n  --fa--fa: \"\\f023\\f023\"; }\n\n.fa-gas-pump {\n  --fa: \"\\f52f\";\n  --fa--fa: \"\\f52f\\f52f\"; }\n\n.fa-hot-tub-person {\n  --fa: \"\\f593\";\n  --fa--fa: \"\\f593\\f593\"; }\n\n.fa-hot-tub {\n  --fa: \"\\f593\";\n  --fa--fa: \"\\f593\\f593\"; }\n\n.fa-map-location {\n  --fa: \"\\f59f\";\n  --fa--fa: \"\\f59f\\f59f\"; }\n\n.fa-map-marked {\n  --fa: \"\\f59f\";\n  --fa--fa: \"\\f59f\\f59f\"; }\n\n.fa-house-flood-water {\n  --fa: \"\\e50e\";\n  --fa--fa: \"\\e50e\\e50e\"; }\n\n.fa-tree {\n  --fa: \"\\f1bb\";\n  --fa--fa: \"\\f1bb\\f1bb\"; }\n\n.fa-bridge-lock {\n  --fa: \"\\e4cc\";\n  --fa--fa: \"\\e4cc\\e4cc\"; }\n\n.fa-sack-dollar {\n  --fa: \"\\f81d\";\n  --fa--fa: \"\\f81d\\f81d\"; }\n\n.fa-pen-to-square {\n  --fa: \"\\f044\";\n  --fa--fa: \"\\f044\\f044\"; }\n\n.fa-edit {\n  --fa: \"\\f044\";\n  --fa--fa: \"\\f044\\f044\"; }\n\n.fa-car-side {\n  --fa: \"\\f5e4\";\n  --fa--fa: \"\\f5e4\\f5e4\"; }\n\n.fa-share-nodes {\n  --fa: \"\\f1e0\";\n  --fa--fa: \"\\f1e0\\f1e0\"; }\n\n.fa-share-alt {\n  --fa: \"\\f1e0\";\n  --fa--fa: \"\\f1e0\\f1e0\"; }\n\n.fa-heart-circle-minus {\n  --fa: \"\\e4ff\";\n  --fa--fa: \"\\e4ff\\e4ff\"; }\n\n.fa-hourglass-half {\n  --fa: \"\\f252\";\n  --fa--fa: \"\\f252\\f252\"; }\n\n.fa-hourglass-2 {\n  --fa: \"\\f252\";\n  --fa--fa: \"\\f252\\f252\"; }\n\n.fa-microscope {\n  --fa: \"\\f610\";\n  --fa--fa: \"\\f610\\f610\"; }\n\n.fa-sink {\n  --fa: \"\\e06d\";\n  --fa--fa: \"\\e06d\\e06d\"; }\n\n.fa-bag-shopping {\n  --fa: \"\\f290\";\n  --fa--fa: \"\\f290\\f290\"; }\n\n.fa-shopping-bag {\n  --fa: \"\\f290\";\n  --fa--fa: \"\\f290\\f290\"; }\n\n.fa-arrow-down-z-a {\n  --fa: \"\\f881\";\n  --fa--fa: \"\\f881\\f881\"; }\n\n.fa-sort-alpha-desc {\n  --fa: \"\\f881\";\n  --fa--fa: \"\\f881\\f881\"; }\n\n.fa-sort-alpha-down-alt {\n  --fa: \"\\f881\";\n  --fa--fa: \"\\f881\\f881\"; }\n\n.fa-mitten {\n  --fa: \"\\f7b5\";\n  --fa--fa: \"\\f7b5\\f7b5\"; }\n\n.fa-person-rays {\n  --fa: \"\\e54d\";\n  --fa--fa: \"\\e54d\\e54d\"; }\n\n.fa-users {\n  --fa: \"\\f0c0\";\n  --fa--fa: \"\\f0c0\\f0c0\"; }\n\n.fa-eye-slash {\n  --fa: \"\\f070\";\n  --fa--fa: \"\\f070\\f070\"; }\n\n.fa-flask-vial {\n  --fa: \"\\e4f3\";\n  --fa--fa: \"\\e4f3\\e4f3\"; }\n\n.fa-hand {\n  --fa: \"\\f256\";\n  --fa--fa: \"\\f256\\f256\"; }\n\n.fa-hand-paper {\n  --fa: \"\\f256\";\n  --fa--fa: \"\\f256\\f256\"; }\n\n.fa-om {\n  --fa: \"\\f679\";\n  --fa--fa: \"\\f679\\f679\"; }\n\n.fa-worm {\n  --fa: \"\\e599\";\n  --fa--fa: \"\\e599\\e599\"; }\n\n.fa-house-circle-xmark {\n  --fa: \"\\e50b\";\n  --fa--fa: \"\\e50b\\e50b\"; }\n\n.fa-plug {\n  --fa: \"\\f1e6\";\n  --fa--fa: \"\\f1e6\\f1e6\"; }\n\n.fa-chevron-up {\n  --fa: \"\\f077\";\n  --fa--fa: \"\\f077\\f077\"; }\n\n.fa-hand-spock {\n  --fa: \"\\f259\";\n  --fa--fa: \"\\f259\\f259\"; }\n\n.fa-stopwatch {\n  --fa: \"\\f2f2\";\n  --fa--fa: \"\\f2f2\\f2f2\"; }\n\n.fa-face-kiss {\n  --fa: \"\\f596\";\n  --fa--fa: \"\\f596\\f596\"; }\n\n.fa-kiss {\n  --fa: \"\\f596\";\n  --fa--fa: \"\\f596\\f596\"; }\n\n.fa-bridge-circle-xmark {\n  --fa: \"\\e4cb\";\n  --fa--fa: \"\\e4cb\\e4cb\"; }\n\n.fa-face-grin-tongue {\n  --fa: \"\\f589\";\n  --fa--fa: \"\\f589\\f589\"; }\n\n.fa-grin-tongue {\n  --fa: \"\\f589\";\n  --fa--fa: \"\\f589\\f589\"; }\n\n.fa-chess-bishop {\n  --fa: \"\\f43a\";\n  --fa--fa: \"\\f43a\\f43a\"; }\n\n.fa-face-grin-wink {\n  --fa: \"\\f58c\";\n  --fa--fa: \"\\f58c\\f58c\"; }\n\n.fa-grin-wink {\n  --fa: \"\\f58c\";\n  --fa--fa: \"\\f58c\\f58c\"; }\n\n.fa-ear-deaf {\n  --fa: \"\\f2a4\";\n  --fa--fa: \"\\f2a4\\f2a4\"; }\n\n.fa-deaf {\n  --fa: \"\\f2a4\";\n  --fa--fa: \"\\f2a4\\f2a4\"; }\n\n.fa-deafness {\n  --fa: \"\\f2a4\";\n  --fa--fa: \"\\f2a4\\f2a4\"; }\n\n.fa-hard-of-hearing {\n  --fa: \"\\f2a4\";\n  --fa--fa: \"\\f2a4\\f2a4\"; }\n\n.fa-road-circle-check {\n  --fa: \"\\e564\";\n  --fa--fa: \"\\e564\\e564\"; }\n\n.fa-dice-five {\n  --fa: \"\\f523\";\n  --fa--fa: \"\\f523\\f523\"; }\n\n.fa-square-rss {\n  --fa: \"\\f143\";\n  --fa--fa: \"\\f143\\f143\"; }\n\n.fa-rss-square {\n  --fa: \"\\f143\";\n  --fa--fa: \"\\f143\\f143\"; }\n\n.fa-land-mine-on {\n  --fa: \"\\e51b\";\n  --fa--fa: \"\\e51b\\e51b\"; }\n\n.fa-i-cursor {\n  --fa: \"\\f246\";\n  --fa--fa: \"\\f246\\f246\"; }\n\n.fa-stamp {\n  --fa: \"\\f5bf\";\n  --fa--fa: \"\\f5bf\\f5bf\"; }\n\n.fa-stairs {\n  --fa: \"\\e289\";\n  --fa--fa: \"\\e289\\e289\"; }\n\n.fa-i {\n  --fa: \"\\49\";\n  --fa--fa: \"\\49\\49\"; }\n\n.fa-hryvnia-sign {\n  --fa: \"\\f6f2\";\n  --fa--fa: \"\\f6f2\\f6f2\"; }\n\n.fa-hryvnia {\n  --fa: \"\\f6f2\";\n  --fa--fa: \"\\f6f2\\f6f2\"; }\n\n.fa-pills {\n  --fa: \"\\f484\";\n  --fa--fa: \"\\f484\\f484\"; }\n\n.fa-face-grin-wide {\n  --fa: \"\\f581\";\n  --fa--fa: \"\\f581\\f581\"; }\n\n.fa-grin-alt {\n  --fa: \"\\f581\";\n  --fa--fa: \"\\f581\\f581\"; }\n\n.fa-tooth {\n  --fa: \"\\f5c9\";\n  --fa--fa: \"\\f5c9\\f5c9\"; }\n\n.fa-v {\n  --fa: \"\\56\";\n  --fa--fa: \"\\56\\56\"; }\n\n.fa-bangladeshi-taka-sign {\n  --fa: \"\\e2e6\";\n  --fa--fa: \"\\e2e6\\e2e6\"; }\n\n.fa-bicycle {\n  --fa: \"\\f206\";\n  --fa--fa: \"\\f206\\f206\"; }\n\n.fa-staff-snake {\n  --fa: \"\\e579\";\n  --fa--fa: \"\\e579\\e579\"; }\n\n.fa-rod-asclepius {\n  --fa: \"\\e579\";\n  --fa--fa: \"\\e579\\e579\"; }\n\n.fa-rod-snake {\n  --fa: \"\\e579\";\n  --fa--fa: \"\\e579\\e579\"; }\n\n.fa-staff-aesculapius {\n  --fa: \"\\e579\";\n  --fa--fa: \"\\e579\\e579\"; }\n\n.fa-head-side-cough-slash {\n  --fa: \"\\e062\";\n  --fa--fa: \"\\e062\\e062\"; }\n\n.fa-truck-medical {\n  --fa: \"\\f0f9\";\n  --fa--fa: \"\\f0f9\\f0f9\"; }\n\n.fa-ambulance {\n  --fa: \"\\f0f9\";\n  --fa--fa: \"\\f0f9\\f0f9\"; }\n\n.fa-wheat-awn-circle-exclamation {\n  --fa: \"\\e598\";\n  --fa--fa: \"\\e598\\e598\"; }\n\n.fa-snowman {\n  --fa: \"\\f7d0\";\n  --fa--fa: \"\\f7d0\\f7d0\"; }\n\n.fa-mortar-pestle {\n  --fa: \"\\f5a7\";\n  --fa--fa: \"\\f5a7\\f5a7\"; }\n\n.fa-road-barrier {\n  --fa: \"\\e562\";\n  --fa--fa: \"\\e562\\e562\"; }\n\n.fa-school {\n  --fa: \"\\f549\";\n  --fa--fa: \"\\f549\\f549\"; }\n\n.fa-igloo {\n  --fa: \"\\f7ae\";\n  --fa--fa: \"\\f7ae\\f7ae\"; }\n\n.fa-joint {\n  --fa: \"\\f595\";\n  --fa--fa: \"\\f595\\f595\"; }\n\n.fa-angle-right {\n  --fa: \"\\f105\";\n  --fa--fa: \"\\f105\\f105\"; }\n\n.fa-horse {\n  --fa: \"\\f6f0\";\n  --fa--fa: \"\\f6f0\\f6f0\"; }\n\n.fa-q {\n  --fa: \"\\51\";\n  --fa--fa: \"\\51\\51\"; }\n\n.fa-g {\n  --fa: \"\\47\";\n  --fa--fa: \"\\47\\47\"; }\n\n.fa-notes-medical {\n  --fa: \"\\f481\";\n  --fa--fa: \"\\f481\\f481\"; }\n\n.fa-temperature-half {\n  --fa: \"\\f2c9\";\n  --fa--fa: \"\\f2c9\\f2c9\"; }\n\n.fa-temperature-2 {\n  --fa: \"\\f2c9\";\n  --fa--fa: \"\\f2c9\\f2c9\"; }\n\n.fa-thermometer-2 {\n  --fa: \"\\f2c9\";\n  --fa--fa: \"\\f2c9\\f2c9\"; }\n\n.fa-thermometer-half {\n  --fa: \"\\f2c9\";\n  --fa--fa: \"\\f2c9\\f2c9\"; }\n\n.fa-dong-sign {\n  --fa: \"\\e169\";\n  --fa--fa: \"\\e169\\e169\"; }\n\n.fa-capsules {\n  --fa: \"\\f46b\";\n  --fa--fa: \"\\f46b\\f46b\"; }\n\n.fa-poo-storm {\n  --fa: \"\\f75a\";\n  --fa--fa: \"\\f75a\\f75a\"; }\n\n.fa-poo-bolt {\n  --fa: \"\\f75a\";\n  --fa--fa: \"\\f75a\\f75a\"; }\n\n.fa-face-frown-open {\n  --fa: \"\\f57a\";\n  --fa--fa: \"\\f57a\\f57a\"; }\n\n.fa-frown-open {\n  --fa: \"\\f57a\";\n  --fa--fa: \"\\f57a\\f57a\"; }\n\n.fa-hand-point-up {\n  --fa: \"\\f0a6\";\n  --fa--fa: \"\\f0a6\\f0a6\"; }\n\n.fa-money-bill {\n  --fa: \"\\f0d6\";\n  --fa--fa: \"\\f0d6\\f0d6\"; }\n\n.fa-bookmark {\n  --fa: \"\\f02e\";\n  --fa--fa: \"\\f02e\\f02e\"; }\n\n.fa-align-justify {\n  --fa: \"\\f039\";\n  --fa--fa: \"\\f039\\f039\"; }\n\n.fa-umbrella-beach {\n  --fa: \"\\f5ca\";\n  --fa--fa: \"\\f5ca\\f5ca\"; }\n\n.fa-helmet-un {\n  --fa: \"\\e503\";\n  --fa--fa: \"\\e503\\e503\"; }\n\n.fa-bullseye {\n  --fa: \"\\f140\";\n  --fa--fa: \"\\f140\\f140\"; }\n\n.fa-bacon {\n  --fa: \"\\f7e5\";\n  --fa--fa: \"\\f7e5\\f7e5\"; }\n\n.fa-hand-point-down {\n  --fa: \"\\f0a7\";\n  --fa--fa: \"\\f0a7\\f0a7\"; }\n\n.fa-arrow-up-from-bracket {\n  --fa: \"\\e09a\";\n  --fa--fa: \"\\e09a\\e09a\"; }\n\n.fa-folder {\n  --fa: \"\\f07b\";\n  --fa--fa: \"\\f07b\\f07b\"; }\n\n.fa-folder-blank {\n  --fa: \"\\f07b\";\n  --fa--fa: \"\\f07b\\f07b\"; }\n\n.fa-file-waveform {\n  --fa: \"\\f478\";\n  --fa--fa: \"\\f478\\f478\"; }\n\n.fa-file-medical-alt {\n  --fa: \"\\f478\";\n  --fa--fa: \"\\f478\\f478\"; }\n\n.fa-radiation {\n  --fa: \"\\f7b9\";\n  --fa--fa: \"\\f7b9\\f7b9\"; }\n\n.fa-chart-simple {\n  --fa: \"\\e473\";\n  --fa--fa: \"\\e473\\e473\"; }\n\n.fa-mars-stroke {\n  --fa: \"\\f229\";\n  --fa--fa: \"\\f229\\f229\"; }\n\n.fa-vial {\n  --fa: \"\\f492\";\n  --fa--fa: \"\\f492\\f492\"; }\n\n.fa-gauge {\n  --fa: \"\\f624\";\n  --fa--fa: \"\\f624\\f624\"; }\n\n.fa-dashboard {\n  --fa: \"\\f624\";\n  --fa--fa: \"\\f624\\f624\"; }\n\n.fa-gauge-med {\n  --fa: \"\\f624\";\n  --fa--fa: \"\\f624\\f624\"; }\n\n.fa-tachometer-alt-average {\n  --fa: \"\\f624\";\n  --fa--fa: \"\\f624\\f624\"; }\n\n.fa-wand-magic-sparkles {\n  --fa: \"\\e2ca\";\n  --fa--fa: \"\\e2ca\\e2ca\"; }\n\n.fa-magic-wand-sparkles {\n  --fa: \"\\e2ca\";\n  --fa--fa: \"\\e2ca\\e2ca\"; }\n\n.fa-e {\n  --fa: \"\\45\";\n  --fa--fa: \"\\45\\45\"; }\n\n.fa-pen-clip {\n  --fa: \"\\f305\";\n  --fa--fa: \"\\f305\\f305\"; }\n\n.fa-pen-alt {\n  --fa: \"\\f305\";\n  --fa--fa: \"\\f305\\f305\"; }\n\n.fa-bridge-circle-exclamation {\n  --fa: \"\\e4ca\";\n  --fa--fa: \"\\e4ca\\e4ca\"; }\n\n.fa-user {\n  --fa: \"\\f007\";\n  --fa--fa: \"\\f007\\f007\"; }\n\n.fa-school-circle-check {\n  --fa: \"\\e56b\";\n  --fa--fa: \"\\e56b\\e56b\"; }\n\n.fa-dumpster {\n  --fa: \"\\f793\";\n  --fa--fa: \"\\f793\\f793\"; }\n\n.fa-van-shuttle {\n  --fa: \"\\f5b6\";\n  --fa--fa: \"\\f5b6\\f5b6\"; }\n\n.fa-shuttle-van {\n  --fa: \"\\f5b6\";\n  --fa--fa: \"\\f5b6\\f5b6\"; }\n\n.fa-building-user {\n  --fa: \"\\e4da\";\n  --fa--fa: \"\\e4da\\e4da\"; }\n\n.fa-square-caret-left {\n  --fa: \"\\f191\";\n  --fa--fa: \"\\f191\\f191\"; }\n\n.fa-caret-square-left {\n  --fa: \"\\f191\";\n  --fa--fa: \"\\f191\\f191\"; }\n\n.fa-highlighter {\n  --fa: \"\\f591\";\n  --fa--fa: \"\\f591\\f591\"; }\n\n.fa-key {\n  --fa: \"\\f084\";\n  --fa--fa: \"\\f084\\f084\"; }\n\n.fa-bullhorn {\n  --fa: \"\\f0a1\";\n  --fa--fa: \"\\f0a1\\f0a1\"; }\n\n.fa-globe {\n  --fa: \"\\f0ac\";\n  --fa--fa: \"\\f0ac\\f0ac\"; }\n\n.fa-synagogue {\n  --fa: \"\\f69b\";\n  --fa--fa: \"\\f69b\\f69b\"; }\n\n.fa-person-half-dress {\n  --fa: \"\\e548\";\n  --fa--fa: \"\\e548\\e548\"; }\n\n.fa-road-bridge {\n  --fa: \"\\e563\";\n  --fa--fa: \"\\e563\\e563\"; }\n\n.fa-location-arrow {\n  --fa: \"\\f124\";\n  --fa--fa: \"\\f124\\f124\"; }\n\n.fa-c {\n  --fa: \"\\43\";\n  --fa--fa: \"\\43\\43\"; }\n\n.fa-tablet-button {\n  --fa: \"\\f10a\";\n  --fa--fa: \"\\f10a\\f10a\"; }\n\n.fa-building-lock {\n  --fa: \"\\e4d6\";\n  --fa--fa: \"\\e4d6\\e4d6\"; }\n\n.fa-pizza-slice {\n  --fa: \"\\f818\";\n  --fa--fa: \"\\f818\\f818\"; }\n\n.fa-money-bill-wave {\n  --fa: \"\\f53a\";\n  --fa--fa: \"\\f53a\\f53a\"; }\n\n.fa-chart-area {\n  --fa: \"\\f1fe\";\n  --fa--fa: \"\\f1fe\\f1fe\"; }\n\n.fa-area-chart {\n  --fa: \"\\f1fe\";\n  --fa--fa: \"\\f1fe\\f1fe\"; }\n\n.fa-house-flag {\n  --fa: \"\\e50d\";\n  --fa--fa: \"\\e50d\\e50d\"; }\n\n.fa-person-circle-minus {\n  --fa: \"\\e540\";\n  --fa--fa: \"\\e540\\e540\"; }\n\n.fa-ban {\n  --fa: \"\\f05e\";\n  --fa--fa: \"\\f05e\\f05e\"; }\n\n.fa-cancel {\n  --fa: \"\\f05e\";\n  --fa--fa: \"\\f05e\\f05e\"; }\n\n.fa-camera-rotate {\n  --fa: \"\\e0d8\";\n  --fa--fa: \"\\e0d8\\e0d8\"; }\n\n.fa-spray-can-sparkles {\n  --fa: \"\\f5d0\";\n  --fa--fa: \"\\f5d0\\f5d0\"; }\n\n.fa-air-freshener {\n  --fa: \"\\f5d0\";\n  --fa--fa: \"\\f5d0\\f5d0\"; }\n\n.fa-star {\n  --fa: \"\\f005\";\n  --fa--fa: \"\\f005\\f005\"; }\n\n.fa-repeat {\n  --fa: \"\\f363\";\n  --fa--fa: \"\\f363\\f363\"; }\n\n.fa-cross {\n  --fa: \"\\f654\";\n  --fa--fa: \"\\f654\\f654\"; }\n\n.fa-box {\n  --fa: \"\\f466\";\n  --fa--fa: \"\\f466\\f466\"; }\n\n.fa-venus-mars {\n  --fa: \"\\f228\";\n  --fa--fa: \"\\f228\\f228\"; }\n\n.fa-arrow-pointer {\n  --fa: \"\\f245\";\n  --fa--fa: \"\\f245\\f245\"; }\n\n.fa-mouse-pointer {\n  --fa: \"\\f245\";\n  --fa--fa: \"\\f245\\f245\"; }\n\n.fa-maximize {\n  --fa: \"\\f31e\";\n  --fa--fa: \"\\f31e\\f31e\"; }\n\n.fa-expand-arrows-alt {\n  --fa: \"\\f31e\";\n  --fa--fa: \"\\f31e\\f31e\"; }\n\n.fa-charging-station {\n  --fa: \"\\f5e7\";\n  --fa--fa: \"\\f5e7\\f5e7\"; }\n\n.fa-shapes {\n  --fa: \"\\f61f\";\n  --fa--fa: \"\\f61f\\f61f\"; }\n\n.fa-triangle-circle-square {\n  --fa: \"\\f61f\";\n  --fa--fa: \"\\f61f\\f61f\"; }\n\n.fa-shuffle {\n  --fa: \"\\f074\";\n  --fa--fa: \"\\f074\\f074\"; }\n\n.fa-random {\n  --fa: \"\\f074\";\n  --fa--fa: \"\\f074\\f074\"; }\n\n.fa-person-running {\n  --fa: \"\\f70c\";\n  --fa--fa: \"\\f70c\\f70c\"; }\n\n.fa-running {\n  --fa: \"\\f70c\";\n  --fa--fa: \"\\f70c\\f70c\"; }\n\n.fa-mobile-retro {\n  --fa: \"\\e527\";\n  --fa--fa: \"\\e527\\e527\"; }\n\n.fa-grip-lines-vertical {\n  --fa: \"\\f7a5\";\n  --fa--fa: \"\\f7a5\\f7a5\"; }\n\n.fa-spider {\n  --fa: \"\\f717\";\n  --fa--fa: \"\\f717\\f717\"; }\n\n.fa-hands-bound {\n  --fa: \"\\e4f9\";\n  --fa--fa: \"\\e4f9\\e4f9\"; }\n\n.fa-file-invoice-dollar {\n  --fa: \"\\f571\";\n  --fa--fa: \"\\f571\\f571\"; }\n\n.fa-plane-circle-exclamation {\n  --fa: \"\\e556\";\n  --fa--fa: \"\\e556\\e556\"; }\n\n.fa-x-ray {\n  --fa: \"\\f497\";\n  --fa--fa: \"\\f497\\f497\"; }\n\n.fa-spell-check {\n  --fa: \"\\f891\";\n  --fa--fa: \"\\f891\\f891\"; }\n\n.fa-slash {\n  --fa: \"\\f715\";\n  --fa--fa: \"\\f715\\f715\"; }\n\n.fa-computer-mouse {\n  --fa: \"\\f8cc\";\n  --fa--fa: \"\\f8cc\\f8cc\"; }\n\n.fa-mouse {\n  --fa: \"\\f8cc\";\n  --fa--fa: \"\\f8cc\\f8cc\"; }\n\n.fa-arrow-right-to-bracket {\n  --fa: \"\\f090\";\n  --fa--fa: \"\\f090\\f090\"; }\n\n.fa-sign-in {\n  --fa: \"\\f090\";\n  --fa--fa: \"\\f090\\f090\"; }\n\n.fa-shop-slash {\n  --fa: \"\\e070\";\n  --fa--fa: \"\\e070\\e070\"; }\n\n.fa-store-alt-slash {\n  --fa: \"\\e070\";\n  --fa--fa: \"\\e070\\e070\"; }\n\n.fa-server {\n  --fa: \"\\f233\";\n  --fa--fa: \"\\f233\\f233\"; }\n\n.fa-virus-covid-slash {\n  --fa: \"\\e4a9\";\n  --fa--fa: \"\\e4a9\\e4a9\"; }\n\n.fa-shop-lock {\n  --fa: \"\\e4a5\";\n  --fa--fa: \"\\e4a5\\e4a5\"; }\n\n.fa-hourglass-start {\n  --fa: \"\\f251\";\n  --fa--fa: \"\\f251\\f251\"; }\n\n.fa-hourglass-1 {\n  --fa: \"\\f251\";\n  --fa--fa: \"\\f251\\f251\"; }\n\n.fa-blender-phone {\n  --fa: \"\\f6b6\";\n  --fa--fa: \"\\f6b6\\f6b6\"; }\n\n.fa-building-wheat {\n  --fa: \"\\e4db\";\n  --fa--fa: \"\\e4db\\e4db\"; }\n\n.fa-person-breastfeeding {\n  --fa: \"\\e53a\";\n  --fa--fa: \"\\e53a\\e53a\"; }\n\n.fa-right-to-bracket {\n  --fa: \"\\f2f6\";\n  --fa--fa: \"\\f2f6\\f2f6\"; }\n\n.fa-sign-in-alt {\n  --fa: \"\\f2f6\";\n  --fa--fa: \"\\f2f6\\f2f6\"; }\n\n.fa-venus {\n  --fa: \"\\f221\";\n  --fa--fa: \"\\f221\\f221\"; }\n\n.fa-passport {\n  --fa: \"\\f5ab\";\n  --fa--fa: \"\\f5ab\\f5ab\"; }\n\n.fa-thumbtack-slash {\n  --fa: \"\\e68f\";\n  --fa--fa: \"\\e68f\\e68f\"; }\n\n.fa-thumb-tack-slash {\n  --fa: \"\\e68f\";\n  --fa--fa: \"\\e68f\\e68f\"; }\n\n.fa-heart-pulse {\n  --fa: \"\\f21e\";\n  --fa--fa: \"\\f21e\\f21e\"; }\n\n.fa-heartbeat {\n  --fa: \"\\f21e\";\n  --fa--fa: \"\\f21e\\f21e\"; }\n\n.fa-people-carry-box {\n  --fa: \"\\f4ce\";\n  --fa--fa: \"\\f4ce\\f4ce\"; }\n\n.fa-people-carry {\n  --fa: \"\\f4ce\";\n  --fa--fa: \"\\f4ce\\f4ce\"; }\n\n.fa-temperature-high {\n  --fa: \"\\f769\";\n  --fa--fa: \"\\f769\\f769\"; }\n\n.fa-microchip {\n  --fa: \"\\f2db\";\n  --fa--fa: \"\\f2db\\f2db\"; }\n\n.fa-crown {\n  --fa: \"\\f521\";\n  --fa--fa: \"\\f521\\f521\"; }\n\n.fa-weight-hanging {\n  --fa: \"\\f5cd\";\n  --fa--fa: \"\\f5cd\\f5cd\"; }\n\n.fa-xmarks-lines {\n  --fa: \"\\e59a\";\n  --fa--fa: \"\\e59a\\e59a\"; }\n\n.fa-file-prescription {\n  --fa: \"\\f572\";\n  --fa--fa: \"\\f572\\f572\"; }\n\n.fa-weight-scale {\n  --fa: \"\\f496\";\n  --fa--fa: \"\\f496\\f496\"; }\n\n.fa-weight {\n  --fa: \"\\f496\";\n  --fa--fa: \"\\f496\\f496\"; }\n\n.fa-user-group {\n  --fa: \"\\f500\";\n  --fa--fa: \"\\f500\\f500\"; }\n\n.fa-user-friends {\n  --fa: \"\\f500\";\n  --fa--fa: \"\\f500\\f500\"; }\n\n.fa-arrow-up-a-z {\n  --fa: \"\\f15e\";\n  --fa--fa: \"\\f15e\\f15e\"; }\n\n.fa-sort-alpha-up {\n  --fa: \"\\f15e\";\n  --fa--fa: \"\\f15e\\f15e\"; }\n\n.fa-chess-knight {\n  --fa: \"\\f441\";\n  --fa--fa: \"\\f441\\f441\"; }\n\n.fa-face-laugh-squint {\n  --fa: \"\\f59b\";\n  --fa--fa: \"\\f59b\\f59b\"; }\n\n.fa-laugh-squint {\n  --fa: \"\\f59b\";\n  --fa--fa: \"\\f59b\\f59b\"; }\n\n.fa-wheelchair {\n  --fa: \"\\f193\";\n  --fa--fa: \"\\f193\\f193\"; }\n\n.fa-circle-arrow-up {\n  --fa: \"\\f0aa\";\n  --fa--fa: \"\\f0aa\\f0aa\"; }\n\n.fa-arrow-circle-up {\n  --fa: \"\\f0aa\";\n  --fa--fa: \"\\f0aa\\f0aa\"; }\n\n.fa-toggle-on {\n  --fa: \"\\f205\";\n  --fa--fa: \"\\f205\\f205\"; }\n\n.fa-person-walking {\n  --fa: \"\\f554\";\n  --fa--fa: \"\\f554\\f554\"; }\n\n.fa-walking {\n  --fa: \"\\f554\";\n  --fa--fa: \"\\f554\\f554\"; }\n\n.fa-l {\n  --fa: \"\\4c\";\n  --fa--fa: \"\\4c\\4c\"; }\n\n.fa-fire {\n  --fa: \"\\f06d\";\n  --fa--fa: \"\\f06d\\f06d\"; }\n\n.fa-bed-pulse {\n  --fa: \"\\f487\";\n  --fa--fa: \"\\f487\\f487\"; }\n\n.fa-procedures {\n  --fa: \"\\f487\";\n  --fa--fa: \"\\f487\\f487\"; }\n\n.fa-shuttle-space {\n  --fa: \"\\f197\";\n  --fa--fa: \"\\f197\\f197\"; }\n\n.fa-space-shuttle {\n  --fa: \"\\f197\";\n  --fa--fa: \"\\f197\\f197\"; }\n\n.fa-face-laugh {\n  --fa: \"\\f599\";\n  --fa--fa: \"\\f599\\f599\"; }\n\n.fa-laugh {\n  --fa: \"\\f599\";\n  --fa--fa: \"\\f599\\f599\"; }\n\n.fa-folder-open {\n  --fa: \"\\f07c\";\n  --fa--fa: \"\\f07c\\f07c\"; }\n\n.fa-heart-circle-plus {\n  --fa: \"\\e500\";\n  --fa--fa: \"\\e500\\e500\"; }\n\n.fa-code-fork {\n  --fa: \"\\e13b\";\n  --fa--fa: \"\\e13b\\e13b\"; }\n\n.fa-city {\n  --fa: \"\\f64f\";\n  --fa--fa: \"\\f64f\\f64f\"; }\n\n.fa-microphone-lines {\n  --fa: \"\\f3c9\";\n  --fa--fa: \"\\f3c9\\f3c9\"; }\n\n.fa-microphone-alt {\n  --fa: \"\\f3c9\";\n  --fa--fa: \"\\f3c9\\f3c9\"; }\n\n.fa-pepper-hot {\n  --fa: \"\\f816\";\n  --fa--fa: \"\\f816\\f816\"; }\n\n.fa-unlock {\n  --fa: \"\\f09c\";\n  --fa--fa: \"\\f09c\\f09c\"; }\n\n.fa-colon-sign {\n  --fa: \"\\e140\";\n  --fa--fa: \"\\e140\\e140\"; }\n\n.fa-headset {\n  --fa: \"\\f590\";\n  --fa--fa: \"\\f590\\f590\"; }\n\n.fa-store-slash {\n  --fa: \"\\e071\";\n  --fa--fa: \"\\e071\\e071\"; }\n\n.fa-road-circle-xmark {\n  --fa: \"\\e566\";\n  --fa--fa: \"\\e566\\e566\"; }\n\n.fa-user-minus {\n  --fa: \"\\f503\";\n  --fa--fa: \"\\f503\\f503\"; }\n\n.fa-mars-stroke-up {\n  --fa: \"\\f22a\";\n  --fa--fa: \"\\f22a\\f22a\"; }\n\n.fa-mars-stroke-v {\n  --fa: \"\\f22a\";\n  --fa--fa: \"\\f22a\\f22a\"; }\n\n.fa-champagne-glasses {\n  --fa: \"\\f79f\";\n  --fa--fa: \"\\f79f\\f79f\"; }\n\n.fa-glass-cheers {\n  --fa: \"\\f79f\";\n  --fa--fa: \"\\f79f\\f79f\"; }\n\n.fa-clipboard {\n  --fa: \"\\f328\";\n  --fa--fa: \"\\f328\\f328\"; }\n\n.fa-house-circle-exclamation {\n  --fa: \"\\e50a\";\n  --fa--fa: \"\\e50a\\e50a\"; }\n\n.fa-file-arrow-up {\n  --fa: \"\\f574\";\n  --fa--fa: \"\\f574\\f574\"; }\n\n.fa-file-upload {\n  --fa: \"\\f574\";\n  --fa--fa: \"\\f574\\f574\"; }\n\n.fa-wifi {\n  --fa: \"\\f1eb\";\n  --fa--fa: \"\\f1eb\\f1eb\"; }\n\n.fa-wifi-3 {\n  --fa: \"\\f1eb\";\n  --fa--fa: \"\\f1eb\\f1eb\"; }\n\n.fa-wifi-strong {\n  --fa: \"\\f1eb\";\n  --fa--fa: \"\\f1eb\\f1eb\"; }\n\n.fa-bath {\n  --fa: \"\\f2cd\";\n  --fa--fa: \"\\f2cd\\f2cd\"; }\n\n.fa-bathtub {\n  --fa: \"\\f2cd\";\n  --fa--fa: \"\\f2cd\\f2cd\"; }\n\n.fa-underline {\n  --fa: \"\\f0cd\";\n  --fa--fa: \"\\f0cd\\f0cd\"; }\n\n.fa-user-pen {\n  --fa: \"\\f4ff\";\n  --fa--fa: \"\\f4ff\\f4ff\"; }\n\n.fa-user-edit {\n  --fa: \"\\f4ff\";\n  --fa--fa: \"\\f4ff\\f4ff\"; }\n\n.fa-signature {\n  --fa: \"\\f5b7\";\n  --fa--fa: \"\\f5b7\\f5b7\"; }\n\n.fa-stroopwafel {\n  --fa: \"\\f551\";\n  --fa--fa: \"\\f551\\f551\"; }\n\n.fa-bold {\n  --fa: \"\\f032\";\n  --fa--fa: \"\\f032\\f032\"; }\n\n.fa-anchor-lock {\n  --fa: \"\\e4ad\";\n  --fa--fa: \"\\e4ad\\e4ad\"; }\n\n.fa-building-ngo {\n  --fa: \"\\e4d7\";\n  --fa--fa: \"\\e4d7\\e4d7\"; }\n\n.fa-manat-sign {\n  --fa: \"\\e1d5\";\n  --fa--fa: \"\\e1d5\\e1d5\"; }\n\n.fa-not-equal {\n  --fa: \"\\f53e\";\n  --fa--fa: \"\\f53e\\f53e\"; }\n\n.fa-border-top-left {\n  --fa: \"\\f853\";\n  --fa--fa: \"\\f853\\f853\"; }\n\n.fa-border-style {\n  --fa: \"\\f853\";\n  --fa--fa: \"\\f853\\f853\"; }\n\n.fa-map-location-dot {\n  --fa: \"\\f5a0\";\n  --fa--fa: \"\\f5a0\\f5a0\"; }\n\n.fa-map-marked-alt {\n  --fa: \"\\f5a0\";\n  --fa--fa: \"\\f5a0\\f5a0\"; }\n\n.fa-jedi {\n  --fa: \"\\f669\";\n  --fa--fa: \"\\f669\\f669\"; }\n\n.fa-square-poll-vertical {\n  --fa: \"\\f681\";\n  --fa--fa: \"\\f681\\f681\"; }\n\n.fa-poll {\n  --fa: \"\\f681\";\n  --fa--fa: \"\\f681\\f681\"; }\n\n.fa-mug-hot {\n  --fa: \"\\f7b6\";\n  --fa--fa: \"\\f7b6\\f7b6\"; }\n\n.fa-car-battery {\n  --fa: \"\\f5df\";\n  --fa--fa: \"\\f5df\\f5df\"; }\n\n.fa-battery-car {\n  --fa: \"\\f5df\";\n  --fa--fa: \"\\f5df\\f5df\"; }\n\n.fa-gift {\n  --fa: \"\\f06b\";\n  --fa--fa: \"\\f06b\\f06b\"; }\n\n.fa-dice-two {\n  --fa: \"\\f528\";\n  --fa--fa: \"\\f528\\f528\"; }\n\n.fa-chess-queen {\n  --fa: \"\\f445\";\n  --fa--fa: \"\\f445\\f445\"; }\n\n.fa-glasses {\n  --fa: \"\\f530\";\n  --fa--fa: \"\\f530\\f530\"; }\n\n.fa-chess-board {\n  --fa: \"\\f43c\";\n  --fa--fa: \"\\f43c\\f43c\"; }\n\n.fa-building-circle-check {\n  --fa: \"\\e4d2\";\n  --fa--fa: \"\\e4d2\\e4d2\"; }\n\n.fa-person-chalkboard {\n  --fa: \"\\e53d\";\n  --fa--fa: \"\\e53d\\e53d\"; }\n\n.fa-mars-stroke-right {\n  --fa: \"\\f22b\";\n  --fa--fa: \"\\f22b\\f22b\"; }\n\n.fa-mars-stroke-h {\n  --fa: \"\\f22b\";\n  --fa--fa: \"\\f22b\\f22b\"; }\n\n.fa-hand-back-fist {\n  --fa: \"\\f255\";\n  --fa--fa: \"\\f255\\f255\"; }\n\n.fa-hand-rock {\n  --fa: \"\\f255\";\n  --fa--fa: \"\\f255\\f255\"; }\n\n.fa-square-caret-up {\n  --fa: \"\\f151\";\n  --fa--fa: \"\\f151\\f151\"; }\n\n.fa-caret-square-up {\n  --fa: \"\\f151\";\n  --fa--fa: \"\\f151\\f151\"; }\n\n.fa-cloud-showers-water {\n  --fa: \"\\e4e4\";\n  --fa--fa: \"\\e4e4\\e4e4\"; }\n\n.fa-chart-bar {\n  --fa: \"\\f080\";\n  --fa--fa: \"\\f080\\f080\"; }\n\n.fa-bar-chart {\n  --fa: \"\\f080\";\n  --fa--fa: \"\\f080\\f080\"; }\n\n.fa-hands-bubbles {\n  --fa: \"\\e05e\";\n  --fa--fa: \"\\e05e\\e05e\"; }\n\n.fa-hands-wash {\n  --fa: \"\\e05e\";\n  --fa--fa: \"\\e05e\\e05e\"; }\n\n.fa-less-than-equal {\n  --fa: \"\\f537\";\n  --fa--fa: \"\\f537\\f537\"; }\n\n.fa-train {\n  --fa: \"\\f238\";\n  --fa--fa: \"\\f238\\f238\"; }\n\n.fa-eye-low-vision {\n  --fa: \"\\f2a8\";\n  --fa--fa: \"\\f2a8\\f2a8\"; }\n\n.fa-low-vision {\n  --fa: \"\\f2a8\";\n  --fa--fa: \"\\f2a8\\f2a8\"; }\n\n.fa-crow {\n  --fa: \"\\f520\";\n  --fa--fa: \"\\f520\\f520\"; }\n\n.fa-sailboat {\n  --fa: \"\\e445\";\n  --fa--fa: \"\\e445\\e445\"; }\n\n.fa-window-restore {\n  --fa: \"\\f2d2\";\n  --fa--fa: \"\\f2d2\\f2d2\"; }\n\n.fa-square-plus {\n  --fa: \"\\f0fe\";\n  --fa--fa: \"\\f0fe\\f0fe\"; }\n\n.fa-plus-square {\n  --fa: \"\\f0fe\";\n  --fa--fa: \"\\f0fe\\f0fe\"; }\n\n.fa-torii-gate {\n  --fa: \"\\f6a1\";\n  --fa--fa: \"\\f6a1\\f6a1\"; }\n\n.fa-frog {\n  --fa: \"\\f52e\";\n  --fa--fa: \"\\f52e\\f52e\"; }\n\n.fa-bucket {\n  --fa: \"\\e4cf\";\n  --fa--fa: \"\\e4cf\\e4cf\"; }\n\n.fa-image {\n  --fa: \"\\f03e\";\n  --fa--fa: \"\\f03e\\f03e\"; }\n\n.fa-microphone {\n  --fa: \"\\f130\";\n  --fa--fa: \"\\f130\\f130\"; }\n\n.fa-cow {\n  --fa: \"\\f6c8\";\n  --fa--fa: \"\\f6c8\\f6c8\"; }\n\n.fa-caret-up {\n  --fa: \"\\f0d8\";\n  --fa--fa: \"\\f0d8\\f0d8\"; }\n\n.fa-screwdriver {\n  --fa: \"\\f54a\";\n  --fa--fa: \"\\f54a\\f54a\"; }\n\n.fa-folder-closed {\n  --fa: \"\\e185\";\n  --fa--fa: \"\\e185\\e185\"; }\n\n.fa-house-tsunami {\n  --fa: \"\\e515\";\n  --fa--fa: \"\\e515\\e515\"; }\n\n.fa-square-nfi {\n  --fa: \"\\e576\";\n  --fa--fa: \"\\e576\\e576\"; }\n\n.fa-arrow-up-from-ground-water {\n  --fa: \"\\e4b5\";\n  --fa--fa: \"\\e4b5\\e4b5\"; }\n\n.fa-martini-glass {\n  --fa: \"\\f57b\";\n  --fa--fa: \"\\f57b\\f57b\"; }\n\n.fa-glass-martini-alt {\n  --fa: \"\\f57b\";\n  --fa--fa: \"\\f57b\\f57b\"; }\n\n.fa-square-binary {\n  --fa: \"\\e69b\";\n  --fa--fa: \"\\e69b\\e69b\"; }\n\n.fa-rotate-left {\n  --fa: \"\\f2ea\";\n  --fa--fa: \"\\f2ea\\f2ea\"; }\n\n.fa-rotate-back {\n  --fa: \"\\f2ea\";\n  --fa--fa: \"\\f2ea\\f2ea\"; }\n\n.fa-rotate-backward {\n  --fa: \"\\f2ea\";\n  --fa--fa: \"\\f2ea\\f2ea\"; }\n\n.fa-undo-alt {\n  --fa: \"\\f2ea\";\n  --fa--fa: \"\\f2ea\\f2ea\"; }\n\n.fa-table-columns {\n  --fa: \"\\f0db\";\n  --fa--fa: \"\\f0db\\f0db\"; }\n\n.fa-columns {\n  --fa: \"\\f0db\";\n  --fa--fa: \"\\f0db\\f0db\"; }\n\n.fa-lemon {\n  --fa: \"\\f094\";\n  --fa--fa: \"\\f094\\f094\"; }\n\n.fa-head-side-mask {\n  --fa: \"\\e063\";\n  --fa--fa: \"\\e063\\e063\"; }\n\n.fa-handshake {\n  --fa: \"\\f2b5\";\n  --fa--fa: \"\\f2b5\\f2b5\"; }\n\n.fa-gem {\n  --fa: \"\\f3a5\";\n  --fa--fa: \"\\f3a5\\f3a5\"; }\n\n.fa-dolly {\n  --fa: \"\\f472\";\n  --fa--fa: \"\\f472\\f472\"; }\n\n.fa-dolly-box {\n  --fa: \"\\f472\";\n  --fa--fa: \"\\f472\\f472\"; }\n\n.fa-smoking {\n  --fa: \"\\f48d\";\n  --fa--fa: \"\\f48d\\f48d\"; }\n\n.fa-minimize {\n  --fa: \"\\f78c\";\n  --fa--fa: \"\\f78c\\f78c\"; }\n\n.fa-compress-arrows-alt {\n  --fa: \"\\f78c\";\n  --fa--fa: \"\\f78c\\f78c\"; }\n\n.fa-monument {\n  --fa: \"\\f5a6\";\n  --fa--fa: \"\\f5a6\\f5a6\"; }\n\n.fa-snowplow {\n  --fa: \"\\f7d2\";\n  --fa--fa: \"\\f7d2\\f7d2\"; }\n\n.fa-angles-right {\n  --fa: \"\\f101\";\n  --fa--fa: \"\\f101\\f101\"; }\n\n.fa-angle-double-right {\n  --fa: \"\\f101\";\n  --fa--fa: \"\\f101\\f101\"; }\n\n.fa-cannabis {\n  --fa: \"\\f55f\";\n  --fa--fa: \"\\f55f\\f55f\"; }\n\n.fa-circle-play {\n  --fa: \"\\f144\";\n  --fa--fa: \"\\f144\\f144\"; }\n\n.fa-play-circle {\n  --fa: \"\\f144\";\n  --fa--fa: \"\\f144\\f144\"; }\n\n.fa-tablets {\n  --fa: \"\\f490\";\n  --fa--fa: \"\\f490\\f490\"; }\n\n.fa-ethernet {\n  --fa: \"\\f796\";\n  --fa--fa: \"\\f796\\f796\"; }\n\n.fa-euro-sign {\n  --fa: \"\\f153\";\n  --fa--fa: \"\\f153\\f153\"; }\n\n.fa-eur {\n  --fa: \"\\f153\";\n  --fa--fa: \"\\f153\\f153\"; }\n\n.fa-euro {\n  --fa: \"\\f153\";\n  --fa--fa: \"\\f153\\f153\"; }\n\n.fa-chair {\n  --fa: \"\\f6c0\";\n  --fa--fa: \"\\f6c0\\f6c0\"; }\n\n.fa-circle-check {\n  --fa: \"\\f058\";\n  --fa--fa: \"\\f058\\f058\"; }\n\n.fa-check-circle {\n  --fa: \"\\f058\";\n  --fa--fa: \"\\f058\\f058\"; }\n\n.fa-circle-stop {\n  --fa: \"\\f28d\";\n  --fa--fa: \"\\f28d\\f28d\"; }\n\n.fa-stop-circle {\n  --fa: \"\\f28d\";\n  --fa--fa: \"\\f28d\\f28d\"; }\n\n.fa-compass-drafting {\n  --fa: \"\\f568\";\n  --fa--fa: \"\\f568\\f568\"; }\n\n.fa-drafting-compass {\n  --fa: \"\\f568\";\n  --fa--fa: \"\\f568\\f568\"; }\n\n.fa-plate-wheat {\n  --fa: \"\\e55a\";\n  --fa--fa: \"\\e55a\\e55a\"; }\n\n.fa-icicles {\n  --fa: \"\\f7ad\";\n  --fa--fa: \"\\f7ad\\f7ad\"; }\n\n.fa-person-shelter {\n  --fa: \"\\e54f\";\n  --fa--fa: \"\\e54f\\e54f\"; }\n\n.fa-neuter {\n  --fa: \"\\f22c\";\n  --fa--fa: \"\\f22c\\f22c\"; }\n\n.fa-id-badge {\n  --fa: \"\\f2c1\";\n  --fa--fa: \"\\f2c1\\f2c1\"; }\n\n.fa-marker {\n  --fa: \"\\f5a1\";\n  --fa--fa: \"\\f5a1\\f5a1\"; }\n\n.fa-face-laugh-beam {\n  --fa: \"\\f59a\";\n  --fa--fa: \"\\f59a\\f59a\"; }\n\n.fa-laugh-beam {\n  --fa: \"\\f59a\";\n  --fa--fa: \"\\f59a\\f59a\"; }\n\n.fa-helicopter-symbol {\n  --fa: \"\\e502\";\n  --fa--fa: \"\\e502\\e502\"; }\n\n.fa-universal-access {\n  --fa: \"\\f29a\";\n  --fa--fa: \"\\f29a\\f29a\"; }\n\n.fa-circle-chevron-up {\n  --fa: \"\\f139\";\n  --fa--fa: \"\\f139\\f139\"; }\n\n.fa-chevron-circle-up {\n  --fa: \"\\f139\";\n  --fa--fa: \"\\f139\\f139\"; }\n\n.fa-lari-sign {\n  --fa: \"\\e1c8\";\n  --fa--fa: \"\\e1c8\\e1c8\"; }\n\n.fa-volcano {\n  --fa: \"\\f770\";\n  --fa--fa: \"\\f770\\f770\"; }\n\n.fa-person-walking-dashed-line-arrow-right {\n  --fa: \"\\e553\";\n  --fa--fa: \"\\e553\\e553\"; }\n\n.fa-sterling-sign {\n  --fa: \"\\f154\";\n  --fa--fa: \"\\f154\\f154\"; }\n\n.fa-gbp {\n  --fa: \"\\f154\";\n  --fa--fa: \"\\f154\\f154\"; }\n\n.fa-pound-sign {\n  --fa: \"\\f154\";\n  --fa--fa: \"\\f154\\f154\"; }\n\n.fa-viruses {\n  --fa: \"\\e076\";\n  --fa--fa: \"\\e076\\e076\"; }\n\n.fa-square-person-confined {\n  --fa: \"\\e577\";\n  --fa--fa: \"\\e577\\e577\"; }\n\n.fa-user-tie {\n  --fa: \"\\f508\";\n  --fa--fa: \"\\f508\\f508\"; }\n\n.fa-arrow-down-long {\n  --fa: \"\\f175\";\n  --fa--fa: \"\\f175\\f175\"; }\n\n.fa-long-arrow-down {\n  --fa: \"\\f175\";\n  --fa--fa: \"\\f175\\f175\"; }\n\n.fa-tent-arrow-down-to-line {\n  --fa: \"\\e57e\";\n  --fa--fa: \"\\e57e\\e57e\"; }\n\n.fa-certificate {\n  --fa: \"\\f0a3\";\n  --fa--fa: \"\\f0a3\\f0a3\"; }\n\n.fa-reply-all {\n  --fa: \"\\f122\";\n  --fa--fa: \"\\f122\\f122\"; }\n\n.fa-mail-reply-all {\n  --fa: \"\\f122\";\n  --fa--fa: \"\\f122\\f122\"; }\n\n.fa-suitcase {\n  --fa: \"\\f0f2\";\n  --fa--fa: \"\\f0f2\\f0f2\"; }\n\n.fa-person-skating {\n  --fa: \"\\f7c5\";\n  --fa--fa: \"\\f7c5\\f7c5\"; }\n\n.fa-skating {\n  --fa: \"\\f7c5\";\n  --fa--fa: \"\\f7c5\\f7c5\"; }\n\n.fa-filter-circle-dollar {\n  --fa: \"\\f662\";\n  --fa--fa: \"\\f662\\f662\"; }\n\n.fa-funnel-dollar {\n  --fa: \"\\f662\";\n  --fa--fa: \"\\f662\\f662\"; }\n\n.fa-camera-retro {\n  --fa: \"\\f083\";\n  --fa--fa: \"\\f083\\f083\"; }\n\n.fa-circle-arrow-down {\n  --fa: \"\\f0ab\";\n  --fa--fa: \"\\f0ab\\f0ab\"; }\n\n.fa-arrow-circle-down {\n  --fa: \"\\f0ab\";\n  --fa--fa: \"\\f0ab\\f0ab\"; }\n\n.fa-file-import {\n  --fa: \"\\f56f\";\n  --fa--fa: \"\\f56f\\f56f\"; }\n\n.fa-arrow-right-to-file {\n  --fa: \"\\f56f\";\n  --fa--fa: \"\\f56f\\f56f\"; }\n\n.fa-square-arrow-up-right {\n  --fa: \"\\f14c\";\n  --fa--fa: \"\\f14c\\f14c\"; }\n\n.fa-external-link-square {\n  --fa: \"\\f14c\";\n  --fa--fa: \"\\f14c\\f14c\"; }\n\n.fa-box-open {\n  --fa: \"\\f49e\";\n  --fa--fa: \"\\f49e\\f49e\"; }\n\n.fa-scroll {\n  --fa: \"\\f70e\";\n  --fa--fa: \"\\f70e\\f70e\"; }\n\n.fa-spa {\n  --fa: \"\\f5bb\";\n  --fa--fa: \"\\f5bb\\f5bb\"; }\n\n.fa-location-pin-lock {\n  --fa: \"\\e51f\";\n  --fa--fa: \"\\e51f\\e51f\"; }\n\n.fa-pause {\n  --fa: \"\\f04c\";\n  --fa--fa: \"\\f04c\\f04c\"; }\n\n.fa-hill-avalanche {\n  --fa: \"\\e507\";\n  --fa--fa: \"\\e507\\e507\"; }\n\n.fa-temperature-empty {\n  --fa: \"\\f2cb\";\n  --fa--fa: \"\\f2cb\\f2cb\"; }\n\n.fa-temperature-0 {\n  --fa: \"\\f2cb\";\n  --fa--fa: \"\\f2cb\\f2cb\"; }\n\n.fa-thermometer-0 {\n  --fa: \"\\f2cb\";\n  --fa--fa: \"\\f2cb\\f2cb\"; }\n\n.fa-thermometer-empty {\n  --fa: \"\\f2cb\";\n  --fa--fa: \"\\f2cb\\f2cb\"; }\n\n.fa-bomb {\n  --fa: \"\\f1e2\";\n  --fa--fa: \"\\f1e2\\f1e2\"; }\n\n.fa-registered {\n  --fa: \"\\f25d\";\n  --fa--fa: \"\\f25d\\f25d\"; }\n\n.fa-address-card {\n  --fa: \"\\f2bb\";\n  --fa--fa: \"\\f2bb\\f2bb\"; }\n\n.fa-contact-card {\n  --fa: \"\\f2bb\";\n  --fa--fa: \"\\f2bb\\f2bb\"; }\n\n.fa-vcard {\n  --fa: \"\\f2bb\";\n  --fa--fa: \"\\f2bb\\f2bb\"; }\n\n.fa-scale-unbalanced-flip {\n  --fa: \"\\f516\";\n  --fa--fa: \"\\f516\\f516\"; }\n\n.fa-balance-scale-right {\n  --fa: \"\\f516\";\n  --fa--fa: \"\\f516\\f516\"; }\n\n.fa-subscript {\n  --fa: \"\\f12c\";\n  --fa--fa: \"\\f12c\\f12c\"; }\n\n.fa-diamond-turn-right {\n  --fa: \"\\f5eb\";\n  --fa--fa: \"\\f5eb\\f5eb\"; }\n\n.fa-directions {\n  --fa: \"\\f5eb\";\n  --fa--fa: \"\\f5eb\\f5eb\"; }\n\n.fa-burst {\n  --fa: \"\\e4dc\";\n  --fa--fa: \"\\e4dc\\e4dc\"; }\n\n.fa-house-laptop {\n  --fa: \"\\e066\";\n  --fa--fa: \"\\e066\\e066\"; }\n\n.fa-laptop-house {\n  --fa: \"\\e066\";\n  --fa--fa: \"\\e066\\e066\"; }\n\n.fa-face-tired {\n  --fa: \"\\f5c8\";\n  --fa--fa: \"\\f5c8\\f5c8\"; }\n\n.fa-tired {\n  --fa: \"\\f5c8\";\n  --fa--fa: \"\\f5c8\\f5c8\"; }\n\n.fa-money-bills {\n  --fa: \"\\e1f3\";\n  --fa--fa: \"\\e1f3\\e1f3\"; }\n\n.fa-smog {\n  --fa: \"\\f75f\";\n  --fa--fa: \"\\f75f\\f75f\"; }\n\n.fa-crutch {\n  --fa: \"\\f7f7\";\n  --fa--fa: \"\\f7f7\\f7f7\"; }\n\n.fa-cloud-arrow-up {\n  --fa: \"\\f0ee\";\n  --fa--fa: \"\\f0ee\\f0ee\"; }\n\n.fa-cloud-upload {\n  --fa: \"\\f0ee\";\n  --fa--fa: \"\\f0ee\\f0ee\"; }\n\n.fa-cloud-upload-alt {\n  --fa: \"\\f0ee\";\n  --fa--fa: \"\\f0ee\\f0ee\"; }\n\n.fa-palette {\n  --fa: \"\\f53f\";\n  --fa--fa: \"\\f53f\\f53f\"; }\n\n.fa-arrows-turn-right {\n  --fa: \"\\e4c0\";\n  --fa--fa: \"\\e4c0\\e4c0\"; }\n\n.fa-vest {\n  --fa: \"\\e085\";\n  --fa--fa: \"\\e085\\e085\"; }\n\n.fa-ferry {\n  --fa: \"\\e4ea\";\n  --fa--fa: \"\\e4ea\\e4ea\"; }\n\n.fa-arrows-down-to-people {\n  --fa: \"\\e4b9\";\n  --fa--fa: \"\\e4b9\\e4b9\"; }\n\n.fa-seedling {\n  --fa: \"\\f4d8\";\n  --fa--fa: \"\\f4d8\\f4d8\"; }\n\n.fa-sprout {\n  --fa: \"\\f4d8\";\n  --fa--fa: \"\\f4d8\\f4d8\"; }\n\n.fa-left-right {\n  --fa: \"\\f337\";\n  --fa--fa: \"\\f337\\f337\"; }\n\n.fa-arrows-alt-h {\n  --fa: \"\\f337\";\n  --fa--fa: \"\\f337\\f337\"; }\n\n.fa-boxes-packing {\n  --fa: \"\\e4c7\";\n  --fa--fa: \"\\e4c7\\e4c7\"; }\n\n.fa-circle-arrow-left {\n  --fa: \"\\f0a8\";\n  --fa--fa: \"\\f0a8\\f0a8\"; }\n\n.fa-arrow-circle-left {\n  --fa: \"\\f0a8\";\n  --fa--fa: \"\\f0a8\\f0a8\"; }\n\n.fa-group-arrows-rotate {\n  --fa: \"\\e4f6\";\n  --fa--fa: \"\\e4f6\\e4f6\"; }\n\n.fa-bowl-food {\n  --fa: \"\\e4c6\";\n  --fa--fa: \"\\e4c6\\e4c6\"; }\n\n.fa-candy-cane {\n  --fa: \"\\f786\";\n  --fa--fa: \"\\f786\\f786\"; }\n\n.fa-arrow-down-wide-short {\n  --fa: \"\\f160\";\n  --fa--fa: \"\\f160\\f160\"; }\n\n.fa-sort-amount-asc {\n  --fa: \"\\f160\";\n  --fa--fa: \"\\f160\\f160\"; }\n\n.fa-sort-amount-down {\n  --fa: \"\\f160\";\n  --fa--fa: \"\\f160\\f160\"; }\n\n.fa-cloud-bolt {\n  --fa: \"\\f76c\";\n  --fa--fa: \"\\f76c\\f76c\"; }\n\n.fa-thunderstorm {\n  --fa: \"\\f76c\";\n  --fa--fa: \"\\f76c\\f76c\"; }\n\n.fa-text-slash {\n  --fa: \"\\f87d\";\n  --fa--fa: \"\\f87d\\f87d\"; }\n\n.fa-remove-format {\n  --fa: \"\\f87d\";\n  --fa--fa: \"\\f87d\\f87d\"; }\n\n.fa-face-smile-wink {\n  --fa: \"\\f4da\";\n  --fa--fa: \"\\f4da\\f4da\"; }\n\n.fa-smile-wink {\n  --fa: \"\\f4da\";\n  --fa--fa: \"\\f4da\\f4da\"; }\n\n.fa-file-word {\n  --fa: \"\\f1c2\";\n  --fa--fa: \"\\f1c2\\f1c2\"; }\n\n.fa-file-powerpoint {\n  --fa: \"\\f1c4\";\n  --fa--fa: \"\\f1c4\\f1c4\"; }\n\n.fa-arrows-left-right {\n  --fa: \"\\f07e\";\n  --fa--fa: \"\\f07e\\f07e\"; }\n\n.fa-arrows-h {\n  --fa: \"\\f07e\";\n  --fa--fa: \"\\f07e\\f07e\"; }\n\n.fa-house-lock {\n  --fa: \"\\e510\";\n  --fa--fa: \"\\e510\\e510\"; }\n\n.fa-cloud-arrow-down {\n  --fa: \"\\f0ed\";\n  --fa--fa: \"\\f0ed\\f0ed\"; }\n\n.fa-cloud-download {\n  --fa: \"\\f0ed\";\n  --fa--fa: \"\\f0ed\\f0ed\"; }\n\n.fa-cloud-download-alt {\n  --fa: \"\\f0ed\";\n  --fa--fa: \"\\f0ed\\f0ed\"; }\n\n.fa-children {\n  --fa: \"\\e4e1\";\n  --fa--fa: \"\\e4e1\\e4e1\"; }\n\n.fa-chalkboard {\n  --fa: \"\\f51b\";\n  --fa--fa: \"\\f51b\\f51b\"; }\n\n.fa-blackboard {\n  --fa: \"\\f51b\";\n  --fa--fa: \"\\f51b\\f51b\"; }\n\n.fa-user-large-slash {\n  --fa: \"\\f4fa\";\n  --fa--fa: \"\\f4fa\\f4fa\"; }\n\n.fa-user-alt-slash {\n  --fa: \"\\f4fa\";\n  --fa--fa: \"\\f4fa\\f4fa\"; }\n\n.fa-envelope-open {\n  --fa: \"\\f2b6\";\n  --fa--fa: \"\\f2b6\\f2b6\"; }\n\n.fa-handshake-simple-slash {\n  --fa: \"\\e05f\";\n  --fa--fa: \"\\e05f\\e05f\"; }\n\n.fa-handshake-alt-slash {\n  --fa: \"\\e05f\";\n  --fa--fa: \"\\e05f\\e05f\"; }\n\n.fa-mattress-pillow {\n  --fa: \"\\e525\";\n  --fa--fa: \"\\e525\\e525\"; }\n\n.fa-guarani-sign {\n  --fa: \"\\e19a\";\n  --fa--fa: \"\\e19a\\e19a\"; }\n\n.fa-arrows-rotate {\n  --fa: \"\\f021\";\n  --fa--fa: \"\\f021\\f021\"; }\n\n.fa-refresh {\n  --fa: \"\\f021\";\n  --fa--fa: \"\\f021\\f021\"; }\n\n.fa-sync {\n  --fa: \"\\f021\";\n  --fa--fa: \"\\f021\\f021\"; }\n\n.fa-fire-extinguisher {\n  --fa: \"\\f134\";\n  --fa--fa: \"\\f134\\f134\"; }\n\n.fa-cruzeiro-sign {\n  --fa: \"\\e152\";\n  --fa--fa: \"\\e152\\e152\"; }\n\n.fa-greater-than-equal {\n  --fa: \"\\f532\";\n  --fa--fa: \"\\f532\\f532\"; }\n\n.fa-shield-halved {\n  --fa: \"\\f3ed\";\n  --fa--fa: \"\\f3ed\\f3ed\"; }\n\n.fa-shield-alt {\n  --fa: \"\\f3ed\";\n  --fa--fa: \"\\f3ed\\f3ed\"; }\n\n.fa-book-atlas {\n  --fa: \"\\f558\";\n  --fa--fa: \"\\f558\\f558\"; }\n\n.fa-atlas {\n  --fa: \"\\f558\";\n  --fa--fa: \"\\f558\\f558\"; }\n\n.fa-virus {\n  --fa: \"\\e074\";\n  --fa--fa: \"\\e074\\e074\"; }\n\n.fa-envelope-circle-check {\n  --fa: \"\\e4e8\";\n  --fa--fa: \"\\e4e8\\e4e8\"; }\n\n.fa-layer-group {\n  --fa: \"\\f5fd\";\n  --fa--fa: \"\\f5fd\\f5fd\"; }\n\n.fa-arrows-to-dot {\n  --fa: \"\\e4be\";\n  --fa--fa: \"\\e4be\\e4be\"; }\n\n.fa-archway {\n  --fa: \"\\f557\";\n  --fa--fa: \"\\f557\\f557\"; }\n\n.fa-heart-circle-check {\n  --fa: \"\\e4fd\";\n  --fa--fa: \"\\e4fd\\e4fd\"; }\n\n.fa-house-chimney-crack {\n  --fa: \"\\f6f1\";\n  --fa--fa: \"\\f6f1\\f6f1\"; }\n\n.fa-house-damage {\n  --fa: \"\\f6f1\";\n  --fa--fa: \"\\f6f1\\f6f1\"; }\n\n.fa-file-zipper {\n  --fa: \"\\f1c6\";\n  --fa--fa: \"\\f1c6\\f1c6\"; }\n\n.fa-file-archive {\n  --fa: \"\\f1c6\";\n  --fa--fa: \"\\f1c6\\f1c6\"; }\n\n.fa-square {\n  --fa: \"\\f0c8\";\n  --fa--fa: \"\\f0c8\\f0c8\"; }\n\n.fa-martini-glass-empty {\n  --fa: \"\\f000\";\n  --fa--fa: \"\\f000\\f000\"; }\n\n.fa-glass-martini {\n  --fa: \"\\f000\";\n  --fa--fa: \"\\f000\\f000\"; }\n\n.fa-couch {\n  --fa: \"\\f4b8\";\n  --fa--fa: \"\\f4b8\\f4b8\"; }\n\n.fa-cedi-sign {\n  --fa: \"\\e0df\";\n  --fa--fa: \"\\e0df\\e0df\"; }\n\n.fa-italic {\n  --fa: \"\\f033\";\n  --fa--fa: \"\\f033\\f033\"; }\n\n.fa-table-cells-column-lock {\n  --fa: \"\\e678\";\n  --fa--fa: \"\\e678\\e678\"; }\n\n.fa-church {\n  --fa: \"\\f51d\";\n  --fa--fa: \"\\f51d\\f51d\"; }\n\n.fa-comments-dollar {\n  --fa: \"\\f653\";\n  --fa--fa: \"\\f653\\f653\"; }\n\n.fa-democrat {\n  --fa: \"\\f747\";\n  --fa--fa: \"\\f747\\f747\"; }\n\n.fa-z {\n  --fa: \"\\5a\";\n  --fa--fa: \"\\5a\\5a\"; }\n\n.fa-person-skiing {\n  --fa: \"\\f7c9\";\n  --fa--fa: \"\\f7c9\\f7c9\"; }\n\n.fa-skiing {\n  --fa: \"\\f7c9\";\n  --fa--fa: \"\\f7c9\\f7c9\"; }\n\n.fa-road-lock {\n  --fa: \"\\e567\";\n  --fa--fa: \"\\e567\\e567\"; }\n\n.fa-a {\n  --fa: \"\\41\";\n  --fa--fa: \"\\41\\41\"; }\n\n.fa-temperature-arrow-down {\n  --fa: \"\\e03f\";\n  --fa--fa: \"\\e03f\\e03f\"; }\n\n.fa-temperature-down {\n  --fa: \"\\e03f\";\n  --fa--fa: \"\\e03f\\e03f\"; }\n\n.fa-feather-pointed {\n  --fa: \"\\f56b\";\n  --fa--fa: \"\\f56b\\f56b\"; }\n\n.fa-feather-alt {\n  --fa: \"\\f56b\";\n  --fa--fa: \"\\f56b\\f56b\"; }\n\n.fa-p {\n  --fa: \"\\50\";\n  --fa--fa: \"\\50\\50\"; }\n\n.fa-snowflake {\n  --fa: \"\\f2dc\";\n  --fa--fa: \"\\f2dc\\f2dc\"; }\n\n.fa-newspaper {\n  --fa: \"\\f1ea\";\n  --fa--fa: \"\\f1ea\\f1ea\"; }\n\n.fa-rectangle-ad {\n  --fa: \"\\f641\";\n  --fa--fa: \"\\f641\\f641\"; }\n\n.fa-ad {\n  --fa: \"\\f641\";\n  --fa--fa: \"\\f641\\f641\"; }\n\n.fa-circle-arrow-right {\n  --fa: \"\\f0a9\";\n  --fa--fa: \"\\f0a9\\f0a9\"; }\n\n.fa-arrow-circle-right {\n  --fa: \"\\f0a9\";\n  --fa--fa: \"\\f0a9\\f0a9\"; }\n\n.fa-filter-circle-xmark {\n  --fa: \"\\e17b\";\n  --fa--fa: \"\\e17b\\e17b\"; }\n\n.fa-locust {\n  --fa: \"\\e520\";\n  --fa--fa: \"\\e520\\e520\"; }\n\n.fa-sort {\n  --fa: \"\\f0dc\";\n  --fa--fa: \"\\f0dc\\f0dc\"; }\n\n.fa-unsorted {\n  --fa: \"\\f0dc\";\n  --fa--fa: \"\\f0dc\\f0dc\"; }\n\n.fa-list-ol {\n  --fa: \"\\f0cb\";\n  --fa--fa: \"\\f0cb\\f0cb\"; }\n\n.fa-list-1-2 {\n  --fa: \"\\f0cb\";\n  --fa--fa: \"\\f0cb\\f0cb\"; }\n\n.fa-list-numeric {\n  --fa: \"\\f0cb\";\n  --fa--fa: \"\\f0cb\\f0cb\"; }\n\n.fa-person-dress-burst {\n  --fa: \"\\e544\";\n  --fa--fa: \"\\e544\\e544\"; }\n\n.fa-money-check-dollar {\n  --fa: \"\\f53d\";\n  --fa--fa: \"\\f53d\\f53d\"; }\n\n.fa-money-check-alt {\n  --fa: \"\\f53d\";\n  --fa--fa: \"\\f53d\\f53d\"; }\n\n.fa-vector-square {\n  --fa: \"\\f5cb\";\n  --fa--fa: \"\\f5cb\\f5cb\"; }\n\n.fa-bread-slice {\n  --fa: \"\\f7ec\";\n  --fa--fa: \"\\f7ec\\f7ec\"; }\n\n.fa-language {\n  --fa: \"\\f1ab\";\n  --fa--fa: \"\\f1ab\\f1ab\"; }\n\n.fa-face-kiss-wink-heart {\n  --fa: \"\\f598\";\n  --fa--fa: \"\\f598\\f598\"; }\n\n.fa-kiss-wink-heart {\n  --fa: \"\\f598\";\n  --fa--fa: \"\\f598\\f598\"; }\n\n.fa-filter {\n  --fa: \"\\f0b0\";\n  --fa--fa: \"\\f0b0\\f0b0\"; }\n\n.fa-question {\n  --fa: \"\\3f\";\n  --fa--fa: \"\\3f\\3f\"; }\n\n.fa-file-signature {\n  --fa: \"\\f573\";\n  --fa--fa: \"\\f573\\f573\"; }\n\n.fa-up-down-left-right {\n  --fa: \"\\f0b2\";\n  --fa--fa: \"\\f0b2\\f0b2\"; }\n\n.fa-arrows-alt {\n  --fa: \"\\f0b2\";\n  --fa--fa: \"\\f0b2\\f0b2\"; }\n\n.fa-house-chimney-user {\n  --fa: \"\\e065\";\n  --fa--fa: \"\\e065\\e065\"; }\n\n.fa-hand-holding-heart {\n  --fa: \"\\f4be\";\n  --fa--fa: \"\\f4be\\f4be\"; }\n\n.fa-puzzle-piece {\n  --fa: \"\\f12e\";\n  --fa--fa: \"\\f12e\\f12e\"; }\n\n.fa-money-check {\n  --fa: \"\\f53c\";\n  --fa--fa: \"\\f53c\\f53c\"; }\n\n.fa-star-half-stroke {\n  --fa: \"\\f5c0\";\n  --fa--fa: \"\\f5c0\\f5c0\"; }\n\n.fa-star-half-alt {\n  --fa: \"\\f5c0\";\n  --fa--fa: \"\\f5c0\\f5c0\"; }\n\n.fa-code {\n  --fa: \"\\f121\";\n  --fa--fa: \"\\f121\\f121\"; }\n\n.fa-whiskey-glass {\n  --fa: \"\\f7a0\";\n  --fa--fa: \"\\f7a0\\f7a0\"; }\n\n.fa-glass-whiskey {\n  --fa: \"\\f7a0\";\n  --fa--fa: \"\\f7a0\\f7a0\"; }\n\n.fa-building-circle-exclamation {\n  --fa: \"\\e4d3\";\n  --fa--fa: \"\\e4d3\\e4d3\"; }\n\n.fa-magnifying-glass-chart {\n  --fa: \"\\e522\";\n  --fa--fa: \"\\e522\\e522\"; }\n\n.fa-arrow-up-right-from-square {\n  --fa: \"\\f08e\";\n  --fa--fa: \"\\f08e\\f08e\"; }\n\n.fa-external-link {\n  --fa: \"\\f08e\";\n  --fa--fa: \"\\f08e\\f08e\"; }\n\n.fa-cubes-stacked {\n  --fa: \"\\e4e6\";\n  --fa--fa: \"\\e4e6\\e4e6\"; }\n\n.fa-won-sign {\n  --fa: \"\\f159\";\n  --fa--fa: \"\\f159\\f159\"; }\n\n.fa-krw {\n  --fa: \"\\f159\";\n  --fa--fa: \"\\f159\\f159\"; }\n\n.fa-won {\n  --fa: \"\\f159\";\n  --fa--fa: \"\\f159\\f159\"; }\n\n.fa-virus-covid {\n  --fa: \"\\e4a8\";\n  --fa--fa: \"\\e4a8\\e4a8\"; }\n\n.fa-austral-sign {\n  --fa: \"\\e0a9\";\n  --fa--fa: \"\\e0a9\\e0a9\"; }\n\n.fa-f {\n  --fa: \"\\46\";\n  --fa--fa: \"\\46\\46\"; }\n\n.fa-leaf {\n  --fa: \"\\f06c\";\n  --fa--fa: \"\\f06c\\f06c\"; }\n\n.fa-road {\n  --fa: \"\\f018\";\n  --fa--fa: \"\\f018\\f018\"; }\n\n.fa-taxi {\n  --fa: \"\\f1ba\";\n  --fa--fa: \"\\f1ba\\f1ba\"; }\n\n.fa-cab {\n  --fa: \"\\f1ba\";\n  --fa--fa: \"\\f1ba\\f1ba\"; }\n\n.fa-person-circle-plus {\n  --fa: \"\\e541\";\n  --fa--fa: \"\\e541\\e541\"; }\n\n.fa-chart-pie {\n  --fa: \"\\f200\";\n  --fa--fa: \"\\f200\\f200\"; }\n\n.fa-pie-chart {\n  --fa: \"\\f200\";\n  --fa--fa: \"\\f200\\f200\"; }\n\n.fa-bolt-lightning {\n  --fa: \"\\e0b7\";\n  --fa--fa: \"\\e0b7\\e0b7\"; }\n\n.fa-sack-xmark {\n  --fa: \"\\e56a\";\n  --fa--fa: \"\\e56a\\e56a\"; }\n\n.fa-file-excel {\n  --fa: \"\\f1c3\";\n  --fa--fa: \"\\f1c3\\f1c3\"; }\n\n.fa-file-contract {\n  --fa: \"\\f56c\";\n  --fa--fa: \"\\f56c\\f56c\"; }\n\n.fa-fish-fins {\n  --fa: \"\\e4f2\";\n  --fa--fa: \"\\e4f2\\e4f2\"; }\n\n.fa-building-flag {\n  --fa: \"\\e4d5\";\n  --fa--fa: \"\\e4d5\\e4d5\"; }\n\n.fa-face-grin-beam {\n  --fa: \"\\f582\";\n  --fa--fa: \"\\f582\\f582\"; }\n\n.fa-grin-beam {\n  --fa: \"\\f582\";\n  --fa--fa: \"\\f582\\f582\"; }\n\n.fa-object-ungroup {\n  --fa: \"\\f248\";\n  --fa--fa: \"\\f248\\f248\"; }\n\n.fa-poop {\n  --fa: \"\\f619\";\n  --fa--fa: \"\\f619\\f619\"; }\n\n.fa-location-pin {\n  --fa: \"\\f041\";\n  --fa--fa: \"\\f041\\f041\"; }\n\n.fa-map-marker {\n  --fa: \"\\f041\";\n  --fa--fa: \"\\f041\\f041\"; }\n\n.fa-kaaba {\n  --fa: \"\\f66b\";\n  --fa--fa: \"\\f66b\\f66b\"; }\n\n.fa-toilet-paper {\n  --fa: \"\\f71e\";\n  --fa--fa: \"\\f71e\\f71e\"; }\n\n.fa-helmet-safety {\n  --fa: \"\\f807\";\n  --fa--fa: \"\\f807\\f807\"; }\n\n.fa-hard-hat {\n  --fa: \"\\f807\";\n  --fa--fa: \"\\f807\\f807\"; }\n\n.fa-hat-hard {\n  --fa: \"\\f807\";\n  --fa--fa: \"\\f807\\f807\"; }\n\n.fa-eject {\n  --fa: \"\\f052\";\n  --fa--fa: \"\\f052\\f052\"; }\n\n.fa-circle-right {\n  --fa: \"\\f35a\";\n  --fa--fa: \"\\f35a\\f35a\"; }\n\n.fa-arrow-alt-circle-right {\n  --fa: \"\\f35a\";\n  --fa--fa: \"\\f35a\\f35a\"; }\n\n.fa-plane-circle-check {\n  --fa: \"\\e555\";\n  --fa--fa: \"\\e555\\e555\"; }\n\n.fa-face-rolling-eyes {\n  --fa: \"\\f5a5\";\n  --fa--fa: \"\\f5a5\\f5a5\"; }\n\n.fa-meh-rolling-eyes {\n  --fa: \"\\f5a5\";\n  --fa--fa: \"\\f5a5\\f5a5\"; }\n\n.fa-object-group {\n  --fa: \"\\f247\";\n  --fa--fa: \"\\f247\\f247\"; }\n\n.fa-chart-line {\n  --fa: \"\\f201\";\n  --fa--fa: \"\\f201\\f201\"; }\n\n.fa-line-chart {\n  --fa: \"\\f201\";\n  --fa--fa: \"\\f201\\f201\"; }\n\n.fa-mask-ventilator {\n  --fa: \"\\e524\";\n  --fa--fa: \"\\e524\\e524\"; }\n\n.fa-arrow-right {\n  --fa: \"\\f061\";\n  --fa--fa: \"\\f061\\f061\"; }\n\n.fa-signs-post {\n  --fa: \"\\f277\";\n  --fa--fa: \"\\f277\\f277\"; }\n\n.fa-map-signs {\n  --fa: \"\\f277\";\n  --fa--fa: \"\\f277\\f277\"; }\n\n.fa-cash-register {\n  --fa: \"\\f788\";\n  --fa--fa: \"\\f788\\f788\"; }\n\n.fa-person-circle-question {\n  --fa: \"\\e542\";\n  --fa--fa: \"\\e542\\e542\"; }\n\n.fa-h {\n  --fa: \"\\48\";\n  --fa--fa: \"\\48\\48\"; }\n\n.fa-tarp {\n  --fa: \"\\e57b\";\n  --fa--fa: \"\\e57b\\e57b\"; }\n\n.fa-screwdriver-wrench {\n  --fa: \"\\f7d9\";\n  --fa--fa: \"\\f7d9\\f7d9\"; }\n\n.fa-tools {\n  --fa: \"\\f7d9\";\n  --fa--fa: \"\\f7d9\\f7d9\"; }\n\n.fa-arrows-to-eye {\n  --fa: \"\\e4bf\";\n  --fa--fa: \"\\e4bf\\e4bf\"; }\n\n.fa-plug-circle-bolt {\n  --fa: \"\\e55b\";\n  --fa--fa: \"\\e55b\\e55b\"; }\n\n.fa-heart {\n  --fa: \"\\f004\";\n  --fa--fa: \"\\f004\\f004\"; }\n\n.fa-mars-and-venus {\n  --fa: \"\\f224\";\n  --fa--fa: \"\\f224\\f224\"; }\n\n.fa-house-user {\n  --fa: \"\\e1b0\";\n  --fa--fa: \"\\e1b0\\e1b0\"; }\n\n.fa-home-user {\n  --fa: \"\\e1b0\";\n  --fa--fa: \"\\e1b0\\e1b0\"; }\n\n.fa-dumpster-fire {\n  --fa: \"\\f794\";\n  --fa--fa: \"\\f794\\f794\"; }\n\n.fa-house-crack {\n  --fa: \"\\e3b1\";\n  --fa--fa: \"\\e3b1\\e3b1\"; }\n\n.fa-martini-glass-citrus {\n  --fa: \"\\f561\";\n  --fa--fa: \"\\f561\\f561\"; }\n\n.fa-cocktail {\n  --fa: \"\\f561\";\n  --fa--fa: \"\\f561\\f561\"; }\n\n.fa-face-surprise {\n  --fa: \"\\f5c2\";\n  --fa--fa: \"\\f5c2\\f5c2\"; }\n\n.fa-surprise {\n  --fa: \"\\f5c2\";\n  --fa--fa: \"\\f5c2\\f5c2\"; }\n\n.fa-bottle-water {\n  --fa: \"\\e4c5\";\n  --fa--fa: \"\\e4c5\\e4c5\"; }\n\n.fa-circle-pause {\n  --fa: \"\\f28b\";\n  --fa--fa: \"\\f28b\\f28b\"; }\n\n.fa-pause-circle {\n  --fa: \"\\f28b\";\n  --fa--fa: \"\\f28b\\f28b\"; }\n\n.fa-toilet-paper-slash {\n  --fa: \"\\e072\";\n  --fa--fa: \"\\e072\\e072\"; }\n\n.fa-apple-whole {\n  --fa: \"\\f5d1\";\n  --fa--fa: \"\\f5d1\\f5d1\"; }\n\n.fa-apple-alt {\n  --fa: \"\\f5d1\";\n  --fa--fa: \"\\f5d1\\f5d1\"; }\n\n.fa-kitchen-set {\n  --fa: \"\\e51a\";\n  --fa--fa: \"\\e51a\\e51a\"; }\n\n.fa-r {\n  --fa: \"\\52\";\n  --fa--fa: \"\\52\\52\"; }\n\n.fa-temperature-quarter {\n  --fa: \"\\f2ca\";\n  --fa--fa: \"\\f2ca\\f2ca\"; }\n\n.fa-temperature-1 {\n  --fa: \"\\f2ca\";\n  --fa--fa: \"\\f2ca\\f2ca\"; }\n\n.fa-thermometer-1 {\n  --fa: \"\\f2ca\";\n  --fa--fa: \"\\f2ca\\f2ca\"; }\n\n.fa-thermometer-quarter {\n  --fa: \"\\f2ca\";\n  --fa--fa: \"\\f2ca\\f2ca\"; }\n\n.fa-cube {\n  --fa: \"\\f1b2\";\n  --fa--fa: \"\\f1b2\\f1b2\"; }\n\n.fa-bitcoin-sign {\n  --fa: \"\\e0b4\";\n  --fa--fa: \"\\e0b4\\e0b4\"; }\n\n.fa-shield-dog {\n  --fa: \"\\e573\";\n  --fa--fa: \"\\e573\\e573\"; }\n\n.fa-solar-panel {\n  --fa: \"\\f5ba\";\n  --fa--fa: \"\\f5ba\\f5ba\"; }\n\n.fa-lock-open {\n  --fa: \"\\f3c1\";\n  --fa--fa: \"\\f3c1\\f3c1\"; }\n\n.fa-elevator {\n  --fa: \"\\e16d\";\n  --fa--fa: \"\\e16d\\e16d\"; }\n\n.fa-money-bill-transfer {\n  --fa: \"\\e528\";\n  --fa--fa: \"\\e528\\e528\"; }\n\n.fa-money-bill-trend-up {\n  --fa: \"\\e529\";\n  --fa--fa: \"\\e529\\e529\"; }\n\n.fa-house-flood-water-circle-arrow-right {\n  --fa: \"\\e50f\";\n  --fa--fa: \"\\e50f\\e50f\"; }\n\n.fa-square-poll-horizontal {\n  --fa: \"\\f682\";\n  --fa--fa: \"\\f682\\f682\"; }\n\n.fa-poll-h {\n  --fa: \"\\f682\";\n  --fa--fa: \"\\f682\\f682\"; }\n\n.fa-circle {\n  --fa: \"\\f111\";\n  --fa--fa: \"\\f111\\f111\"; }\n\n.fa-backward-fast {\n  --fa: \"\\f049\";\n  --fa--fa: \"\\f049\\f049\"; }\n\n.fa-fast-backward {\n  --fa: \"\\f049\";\n  --fa--fa: \"\\f049\\f049\"; }\n\n.fa-recycle {\n  --fa: \"\\f1b8\";\n  --fa--fa: \"\\f1b8\\f1b8\"; }\n\n.fa-user-astronaut {\n  --fa: \"\\f4fb\";\n  --fa--fa: \"\\f4fb\\f4fb\"; }\n\n.fa-plane-slash {\n  --fa: \"\\e069\";\n  --fa--fa: \"\\e069\\e069\"; }\n\n.fa-trademark {\n  --fa: \"\\f25c\";\n  --fa--fa: \"\\f25c\\f25c\"; }\n\n.fa-basketball {\n  --fa: \"\\f434\";\n  --fa--fa: \"\\f434\\f434\"; }\n\n.fa-basketball-ball {\n  --fa: \"\\f434\";\n  --fa--fa: \"\\f434\\f434\"; }\n\n.fa-satellite-dish {\n  --fa: \"\\f7c0\";\n  --fa--fa: \"\\f7c0\\f7c0\"; }\n\n.fa-circle-up {\n  --fa: \"\\f35b\";\n  --fa--fa: \"\\f35b\\f35b\"; }\n\n.fa-arrow-alt-circle-up {\n  --fa: \"\\f35b\";\n  --fa--fa: \"\\f35b\\f35b\"; }\n\n.fa-mobile-screen-button {\n  --fa: \"\\f3cd\";\n  --fa--fa: \"\\f3cd\\f3cd\"; }\n\n.fa-mobile-alt {\n  --fa: \"\\f3cd\";\n  --fa--fa: \"\\f3cd\\f3cd\"; }\n\n.fa-volume-high {\n  --fa: \"\\f028\";\n  --fa--fa: \"\\f028\\f028\"; }\n\n.fa-volume-up {\n  --fa: \"\\f028\";\n  --fa--fa: \"\\f028\\f028\"; }\n\n.fa-users-rays {\n  --fa: \"\\e593\";\n  --fa--fa: \"\\e593\\e593\"; }\n\n.fa-wallet {\n  --fa: \"\\f555\";\n  --fa--fa: \"\\f555\\f555\"; }\n\n.fa-clipboard-check {\n  --fa: \"\\f46c\";\n  --fa--fa: \"\\f46c\\f46c\"; }\n\n.fa-file-audio {\n  --fa: \"\\f1c7\";\n  --fa--fa: \"\\f1c7\\f1c7\"; }\n\n.fa-burger {\n  --fa: \"\\f805\";\n  --fa--fa: \"\\f805\\f805\"; }\n\n.fa-hamburger {\n  --fa: \"\\f805\";\n  --fa--fa: \"\\f805\\f805\"; }\n\n.fa-wrench {\n  --fa: \"\\f0ad\";\n  --fa--fa: \"\\f0ad\\f0ad\"; }\n\n.fa-bugs {\n  --fa: \"\\e4d0\";\n  --fa--fa: \"\\e4d0\\e4d0\"; }\n\n.fa-rupee-sign {\n  --fa: \"\\f156\";\n  --fa--fa: \"\\f156\\f156\"; }\n\n.fa-rupee {\n  --fa: \"\\f156\";\n  --fa--fa: \"\\f156\\f156\"; }\n\n.fa-file-image {\n  --fa: \"\\f1c5\";\n  --fa--fa: \"\\f1c5\\f1c5\"; }\n\n.fa-circle-question {\n  --fa: \"\\f059\";\n  --fa--fa: \"\\f059\\f059\"; }\n\n.fa-question-circle {\n  --fa: \"\\f059\";\n  --fa--fa: \"\\f059\\f059\"; }\n\n.fa-plane-departure {\n  --fa: \"\\f5b0\";\n  --fa--fa: \"\\f5b0\\f5b0\"; }\n\n.fa-handshake-slash {\n  --fa: \"\\e060\";\n  --fa--fa: \"\\e060\\e060\"; }\n\n.fa-book-bookmark {\n  --fa: \"\\e0bb\";\n  --fa--fa: \"\\e0bb\\e0bb\"; }\n\n.fa-code-branch {\n  --fa: \"\\f126\";\n  --fa--fa: \"\\f126\\f126\"; }\n\n.fa-hat-cowboy {\n  --fa: \"\\f8c0\";\n  --fa--fa: \"\\f8c0\\f8c0\"; }\n\n.fa-bridge {\n  --fa: \"\\e4c8\";\n  --fa--fa: \"\\e4c8\\e4c8\"; }\n\n.fa-phone-flip {\n  --fa: \"\\f879\";\n  --fa--fa: \"\\f879\\f879\"; }\n\n.fa-phone-alt {\n  --fa: \"\\f879\";\n  --fa--fa: \"\\f879\\f879\"; }\n\n.fa-truck-front {\n  --fa: \"\\e2b7\";\n  --fa--fa: \"\\e2b7\\e2b7\"; }\n\n.fa-cat {\n  --fa: \"\\f6be\";\n  --fa--fa: \"\\f6be\\f6be\"; }\n\n.fa-anchor-circle-exclamation {\n  --fa: \"\\e4ab\";\n  --fa--fa: \"\\e4ab\\e4ab\"; }\n\n.fa-truck-field {\n  --fa: \"\\e58d\";\n  --fa--fa: \"\\e58d\\e58d\"; }\n\n.fa-route {\n  --fa: \"\\f4d7\";\n  --fa--fa: \"\\f4d7\\f4d7\"; }\n\n.fa-clipboard-question {\n  --fa: \"\\e4e3\";\n  --fa--fa: \"\\e4e3\\e4e3\"; }\n\n.fa-panorama {\n  --fa: \"\\e209\";\n  --fa--fa: \"\\e209\\e209\"; }\n\n.fa-comment-medical {\n  --fa: \"\\f7f5\";\n  --fa--fa: \"\\f7f5\\f7f5\"; }\n\n.fa-teeth-open {\n  --fa: \"\\f62f\";\n  --fa--fa: \"\\f62f\\f62f\"; }\n\n.fa-file-circle-minus {\n  --fa: \"\\e4ed\";\n  --fa--fa: \"\\e4ed\\e4ed\"; }\n\n.fa-tags {\n  --fa: \"\\f02c\";\n  --fa--fa: \"\\f02c\\f02c\"; }\n\n.fa-wine-glass {\n  --fa: \"\\f4e3\";\n  --fa--fa: \"\\f4e3\\f4e3\"; }\n\n.fa-forward-fast {\n  --fa: \"\\f050\";\n  --fa--fa: \"\\f050\\f050\"; }\n\n.fa-fast-forward {\n  --fa: \"\\f050\";\n  --fa--fa: \"\\f050\\f050\"; }\n\n.fa-face-meh-blank {\n  --fa: \"\\f5a4\";\n  --fa--fa: \"\\f5a4\\f5a4\"; }\n\n.fa-meh-blank {\n  --fa: \"\\f5a4\";\n  --fa--fa: \"\\f5a4\\f5a4\"; }\n\n.fa-square-parking {\n  --fa: \"\\f540\";\n  --fa--fa: \"\\f540\\f540\"; }\n\n.fa-parking {\n  --fa: \"\\f540\";\n  --fa--fa: \"\\f540\\f540\"; }\n\n.fa-house-signal {\n  --fa: \"\\e012\";\n  --fa--fa: \"\\e012\\e012\"; }\n\n.fa-bars-progress {\n  --fa: \"\\f828\";\n  --fa--fa: \"\\f828\\f828\"; }\n\n.fa-tasks-alt {\n  --fa: \"\\f828\";\n  --fa--fa: \"\\f828\\f828\"; }\n\n.fa-faucet-drip {\n  --fa: \"\\e006\";\n  --fa--fa: \"\\e006\\e006\"; }\n\n.fa-cart-flatbed {\n  --fa: \"\\f474\";\n  --fa--fa: \"\\f474\\f474\"; }\n\n.fa-dolly-flatbed {\n  --fa: \"\\f474\";\n  --fa--fa: \"\\f474\\f474\"; }\n\n.fa-ban-smoking {\n  --fa: \"\\f54d\";\n  --fa--fa: \"\\f54d\\f54d\"; }\n\n.fa-smoking-ban {\n  --fa: \"\\f54d\";\n  --fa--fa: \"\\f54d\\f54d\"; }\n\n.fa-terminal {\n  --fa: \"\\f120\";\n  --fa--fa: \"\\f120\\f120\"; }\n\n.fa-mobile-button {\n  --fa: \"\\f10b\";\n  --fa--fa: \"\\f10b\\f10b\"; }\n\n.fa-house-medical-flag {\n  --fa: \"\\e514\";\n  --fa--fa: \"\\e514\\e514\"; }\n\n.fa-basket-shopping {\n  --fa: \"\\f291\";\n  --fa--fa: \"\\f291\\f291\"; }\n\n.fa-shopping-basket {\n  --fa: \"\\f291\";\n  --fa--fa: \"\\f291\\f291\"; }\n\n.fa-tape {\n  --fa: \"\\f4db\";\n  --fa--fa: \"\\f4db\\f4db\"; }\n\n.fa-bus-simple {\n  --fa: \"\\f55e\";\n  --fa--fa: \"\\f55e\\f55e\"; }\n\n.fa-bus-alt {\n  --fa: \"\\f55e\";\n  --fa--fa: \"\\f55e\\f55e\"; }\n\n.fa-eye {\n  --fa: \"\\f06e\";\n  --fa--fa: \"\\f06e\\f06e\"; }\n\n.fa-face-sad-cry {\n  --fa: \"\\f5b3\";\n  --fa--fa: \"\\f5b3\\f5b3\"; }\n\n.fa-sad-cry {\n  --fa: \"\\f5b3\";\n  --fa--fa: \"\\f5b3\\f5b3\"; }\n\n.fa-audio-description {\n  --fa: \"\\f29e\";\n  --fa--fa: \"\\f29e\\f29e\"; }\n\n.fa-person-military-to-person {\n  --fa: \"\\e54c\";\n  --fa--fa: \"\\e54c\\e54c\"; }\n\n.fa-file-shield {\n  --fa: \"\\e4f0\";\n  --fa--fa: \"\\e4f0\\e4f0\"; }\n\n.fa-user-slash {\n  --fa: \"\\f506\";\n  --fa--fa: \"\\f506\\f506\"; }\n\n.fa-pen {\n  --fa: \"\\f304\";\n  --fa--fa: \"\\f304\\f304\"; }\n\n.fa-tower-observation {\n  --fa: \"\\e586\";\n  --fa--fa: \"\\e586\\e586\"; }\n\n.fa-file-code {\n  --fa: \"\\f1c9\";\n  --fa--fa: \"\\f1c9\\f1c9\"; }\n\n.fa-signal {\n  --fa: \"\\f012\";\n  --fa--fa: \"\\f012\\f012\"; }\n\n.fa-signal-5 {\n  --fa: \"\\f012\";\n  --fa--fa: \"\\f012\\f012\"; }\n\n.fa-signal-perfect {\n  --fa: \"\\f012\";\n  --fa--fa: \"\\f012\\f012\"; }\n\n.fa-bus {\n  --fa: \"\\f207\";\n  --fa--fa: \"\\f207\\f207\"; }\n\n.fa-heart-circle-xmark {\n  --fa: \"\\e501\";\n  --fa--fa: \"\\e501\\e501\"; }\n\n.fa-house-chimney {\n  --fa: \"\\e3af\";\n  --fa--fa: \"\\e3af\\e3af\"; }\n\n.fa-home-lg {\n  --fa: \"\\e3af\";\n  --fa--fa: \"\\e3af\\e3af\"; }\n\n.fa-window-maximize {\n  --fa: \"\\f2d0\";\n  --fa--fa: \"\\f2d0\\f2d0\"; }\n\n.fa-face-frown {\n  --fa: \"\\f119\";\n  --fa--fa: \"\\f119\\f119\"; }\n\n.fa-frown {\n  --fa: \"\\f119\";\n  --fa--fa: \"\\f119\\f119\"; }\n\n.fa-prescription {\n  --fa: \"\\f5b1\";\n  --fa--fa: \"\\f5b1\\f5b1\"; }\n\n.fa-shop {\n  --fa: \"\\f54f\";\n  --fa--fa: \"\\f54f\\f54f\"; }\n\n.fa-store-alt {\n  --fa: \"\\f54f\";\n  --fa--fa: \"\\f54f\\f54f\"; }\n\n.fa-floppy-disk {\n  --fa: \"\\f0c7\";\n  --fa--fa: \"\\f0c7\\f0c7\"; }\n\n.fa-save {\n  --fa: \"\\f0c7\";\n  --fa--fa: \"\\f0c7\\f0c7\"; }\n\n.fa-vihara {\n  --fa: \"\\f6a7\";\n  --fa--fa: \"\\f6a7\\f6a7\"; }\n\n.fa-scale-unbalanced {\n  --fa: \"\\f515\";\n  --fa--fa: \"\\f515\\f515\"; }\n\n.fa-balance-scale-left {\n  --fa: \"\\f515\";\n  --fa--fa: \"\\f515\\f515\"; }\n\n.fa-sort-up {\n  --fa: \"\\f0de\";\n  --fa--fa: \"\\f0de\\f0de\"; }\n\n.fa-sort-asc {\n  --fa: \"\\f0de\";\n  --fa--fa: \"\\f0de\\f0de\"; }\n\n.fa-comment-dots {\n  --fa: \"\\f4ad\";\n  --fa--fa: \"\\f4ad\\f4ad\"; }\n\n.fa-commenting {\n  --fa: \"\\f4ad\";\n  --fa--fa: \"\\f4ad\\f4ad\"; }\n\n.fa-plant-wilt {\n  --fa: \"\\e5aa\";\n  --fa--fa: \"\\e5aa\\e5aa\"; }\n\n.fa-diamond {\n  --fa: \"\\f219\";\n  --fa--fa: \"\\f219\\f219\"; }\n\n.fa-face-grin-squint {\n  --fa: \"\\f585\";\n  --fa--fa: \"\\f585\\f585\"; }\n\n.fa-grin-squint {\n  --fa: \"\\f585\";\n  --fa--fa: \"\\f585\\f585\"; }\n\n.fa-hand-holding-dollar {\n  --fa: \"\\f4c0\";\n  --fa--fa: \"\\f4c0\\f4c0\"; }\n\n.fa-hand-holding-usd {\n  --fa: \"\\f4c0\";\n  --fa--fa: \"\\f4c0\\f4c0\"; }\n\n.fa-chart-diagram {\n  --fa: \"\\e695\";\n  --fa--fa: \"\\e695\\e695\"; }\n\n.fa-bacterium {\n  --fa: \"\\e05a\";\n  --fa--fa: \"\\e05a\\e05a\"; }\n\n.fa-hand-pointer {\n  --fa: \"\\f25a\";\n  --fa--fa: \"\\f25a\\f25a\"; }\n\n.fa-drum-steelpan {\n  --fa: \"\\f56a\";\n  --fa--fa: \"\\f56a\\f56a\"; }\n\n.fa-hand-scissors {\n  --fa: \"\\f257\";\n  --fa--fa: \"\\f257\\f257\"; }\n\n.fa-hands-praying {\n  --fa: \"\\f684\";\n  --fa--fa: \"\\f684\\f684\"; }\n\n.fa-praying-hands {\n  --fa: \"\\f684\";\n  --fa--fa: \"\\f684\\f684\"; }\n\n.fa-arrow-rotate-right {\n  --fa: \"\\f01e\";\n  --fa--fa: \"\\f01e\\f01e\"; }\n\n.fa-arrow-right-rotate {\n  --fa: \"\\f01e\";\n  --fa--fa: \"\\f01e\\f01e\"; }\n\n.fa-arrow-rotate-forward {\n  --fa: \"\\f01e\";\n  --fa--fa: \"\\f01e\\f01e\"; }\n\n.fa-redo {\n  --fa: \"\\f01e\";\n  --fa--fa: \"\\f01e\\f01e\"; }\n\n.fa-biohazard {\n  --fa: \"\\f780\";\n  --fa--fa: \"\\f780\\f780\"; }\n\n.fa-location-crosshairs {\n  --fa: \"\\f601\";\n  --fa--fa: \"\\f601\\f601\"; }\n\n.fa-location {\n  --fa: \"\\f601\";\n  --fa--fa: \"\\f601\\f601\"; }\n\n.fa-mars-double {\n  --fa: \"\\f227\";\n  --fa--fa: \"\\f227\\f227\"; }\n\n.fa-child-dress {\n  --fa: \"\\e59c\";\n  --fa--fa: \"\\e59c\\e59c\"; }\n\n.fa-users-between-lines {\n  --fa: \"\\e591\";\n  --fa--fa: \"\\e591\\e591\"; }\n\n.fa-lungs-virus {\n  --fa: \"\\e067\";\n  --fa--fa: \"\\e067\\e067\"; }\n\n.fa-face-grin-tears {\n  --fa: \"\\f588\";\n  --fa--fa: \"\\f588\\f588\"; }\n\n.fa-grin-tears {\n  --fa: \"\\f588\";\n  --fa--fa: \"\\f588\\f588\"; }\n\n.fa-phone {\n  --fa: \"\\f095\";\n  --fa--fa: \"\\f095\\f095\"; }\n\n.fa-calendar-xmark {\n  --fa: \"\\f273\";\n  --fa--fa: \"\\f273\\f273\"; }\n\n.fa-calendar-times {\n  --fa: \"\\f273\";\n  --fa--fa: \"\\f273\\f273\"; }\n\n.fa-child-reaching {\n  --fa: \"\\e59d\";\n  --fa--fa: \"\\e59d\\e59d\"; }\n\n.fa-head-side-virus {\n  --fa: \"\\e064\";\n  --fa--fa: \"\\e064\\e064\"; }\n\n.fa-user-gear {\n  --fa: \"\\f4fe\";\n  --fa--fa: \"\\f4fe\\f4fe\"; }\n\n.fa-user-cog {\n  --fa: \"\\f4fe\";\n  --fa--fa: \"\\f4fe\\f4fe\"; }\n\n.fa-arrow-up-1-9 {\n  --fa: \"\\f163\";\n  --fa--fa: \"\\f163\\f163\"; }\n\n.fa-sort-numeric-up {\n  --fa: \"\\f163\";\n  --fa--fa: \"\\f163\\f163\"; }\n\n.fa-door-closed {\n  --fa: \"\\f52a\";\n  --fa--fa: \"\\f52a\\f52a\"; }\n\n.fa-shield-virus {\n  --fa: \"\\e06c\";\n  --fa--fa: \"\\e06c\\e06c\"; }\n\n.fa-dice-six {\n  --fa: \"\\f526\";\n  --fa--fa: \"\\f526\\f526\"; }\n\n.fa-mosquito-net {\n  --fa: \"\\e52c\";\n  --fa--fa: \"\\e52c\\e52c\"; }\n\n.fa-file-fragment {\n  --fa: \"\\e697\";\n  --fa--fa: \"\\e697\\e697\"; }\n\n.fa-bridge-water {\n  --fa: \"\\e4ce\";\n  --fa--fa: \"\\e4ce\\e4ce\"; }\n\n.fa-person-booth {\n  --fa: \"\\f756\";\n  --fa--fa: \"\\f756\\f756\"; }\n\n.fa-text-width {\n  --fa: \"\\f035\";\n  --fa--fa: \"\\f035\\f035\"; }\n\n.fa-hat-wizard {\n  --fa: \"\\f6e8\";\n  --fa--fa: \"\\f6e8\\f6e8\"; }\n\n.fa-pen-fancy {\n  --fa: \"\\f5ac\";\n  --fa--fa: \"\\f5ac\\f5ac\"; }\n\n.fa-person-digging {\n  --fa: \"\\f85e\";\n  --fa--fa: \"\\f85e\\f85e\"; }\n\n.fa-digging {\n  --fa: \"\\f85e\";\n  --fa--fa: \"\\f85e\\f85e\"; }\n\n.fa-trash {\n  --fa: \"\\f1f8\";\n  --fa--fa: \"\\f1f8\\f1f8\"; }\n\n.fa-gauge-simple {\n  --fa: \"\\f629\";\n  --fa--fa: \"\\f629\\f629\"; }\n\n.fa-gauge-simple-med {\n  --fa: \"\\f629\";\n  --fa--fa: \"\\f629\\f629\"; }\n\n.fa-tachometer-average {\n  --fa: \"\\f629\";\n  --fa--fa: \"\\f629\\f629\"; }\n\n.fa-book-medical {\n  --fa: \"\\f7e6\";\n  --fa--fa: \"\\f7e6\\f7e6\"; }\n\n.fa-poo {\n  --fa: \"\\f2fe\";\n  --fa--fa: \"\\f2fe\\f2fe\"; }\n\n.fa-quote-right {\n  --fa: \"\\f10e\";\n  --fa--fa: \"\\f10e\\f10e\"; }\n\n.fa-quote-right-alt {\n  --fa: \"\\f10e\";\n  --fa--fa: \"\\f10e\\f10e\"; }\n\n.fa-shirt {\n  --fa: \"\\f553\";\n  --fa--fa: \"\\f553\\f553\"; }\n\n.fa-t-shirt {\n  --fa: \"\\f553\";\n  --fa--fa: \"\\f553\\f553\"; }\n\n.fa-tshirt {\n  --fa: \"\\f553\";\n  --fa--fa: \"\\f553\\f553\"; }\n\n.fa-cubes {\n  --fa: \"\\f1b3\";\n  --fa--fa: \"\\f1b3\\f1b3\"; }\n\n.fa-divide {\n  --fa: \"\\f529\";\n  --fa--fa: \"\\f529\\f529\"; }\n\n.fa-tenge-sign {\n  --fa: \"\\f7d7\";\n  --fa--fa: \"\\f7d7\\f7d7\"; }\n\n.fa-tenge {\n  --fa: \"\\f7d7\";\n  --fa--fa: \"\\f7d7\\f7d7\"; }\n\n.fa-headphones {\n  --fa: \"\\f025\";\n  --fa--fa: \"\\f025\\f025\"; }\n\n.fa-hands-holding {\n  --fa: \"\\f4c2\";\n  --fa--fa: \"\\f4c2\\f4c2\"; }\n\n.fa-hands-clapping {\n  --fa: \"\\e1a8\";\n  --fa--fa: \"\\e1a8\\e1a8\"; }\n\n.fa-republican {\n  --fa: \"\\f75e\";\n  --fa--fa: \"\\f75e\\f75e\"; }\n\n.fa-arrow-left {\n  --fa: \"\\f060\";\n  --fa--fa: \"\\f060\\f060\"; }\n\n.fa-person-circle-xmark {\n  --fa: \"\\e543\";\n  --fa--fa: \"\\e543\\e543\"; }\n\n.fa-ruler {\n  --fa: \"\\f545\";\n  --fa--fa: \"\\f545\\f545\"; }\n\n.fa-align-left {\n  --fa: \"\\f036\";\n  --fa--fa: \"\\f036\\f036\"; }\n\n.fa-dice-d6 {\n  --fa: \"\\f6d1\";\n  --fa--fa: \"\\f6d1\\f6d1\"; }\n\n.fa-restroom {\n  --fa: \"\\f7bd\";\n  --fa--fa: \"\\f7bd\\f7bd\"; }\n\n.fa-j {\n  --fa: \"\\4a\";\n  --fa--fa: \"\\4a\\4a\"; }\n\n.fa-users-viewfinder {\n  --fa: \"\\e595\";\n  --fa--fa: \"\\e595\\e595\"; }\n\n.fa-file-video {\n  --fa: \"\\f1c8\";\n  --fa--fa: \"\\f1c8\\f1c8\"; }\n\n.fa-up-right-from-square {\n  --fa: \"\\f35d\";\n  --fa--fa: \"\\f35d\\f35d\"; }\n\n.fa-external-link-alt {\n  --fa: \"\\f35d\";\n  --fa--fa: \"\\f35d\\f35d\"; }\n\n.fa-table-cells {\n  --fa: \"\\f00a\";\n  --fa--fa: \"\\f00a\\f00a\"; }\n\n.fa-th {\n  --fa: \"\\f00a\";\n  --fa--fa: \"\\f00a\\f00a\"; }\n\n.fa-file-pdf {\n  --fa: \"\\f1c1\";\n  --fa--fa: \"\\f1c1\\f1c1\"; }\n\n.fa-book-bible {\n  --fa: \"\\f647\";\n  --fa--fa: \"\\f647\\f647\"; }\n\n.fa-bible {\n  --fa: \"\\f647\";\n  --fa--fa: \"\\f647\\f647\"; }\n\n.fa-o {\n  --fa: \"\\4f\";\n  --fa--fa: \"\\4f\\4f\"; }\n\n.fa-suitcase-medical {\n  --fa: \"\\f0fa\";\n  --fa--fa: \"\\f0fa\\f0fa\"; }\n\n.fa-medkit {\n  --fa: \"\\f0fa\";\n  --fa--fa: \"\\f0fa\\f0fa\"; }\n\n.fa-user-secret {\n  --fa: \"\\f21b\";\n  --fa--fa: \"\\f21b\\f21b\"; }\n\n.fa-otter {\n  --fa: \"\\f700\";\n  --fa--fa: \"\\f700\\f700\"; }\n\n.fa-person-dress {\n  --fa: \"\\f182\";\n  --fa--fa: \"\\f182\\f182\"; }\n\n.fa-female {\n  --fa: \"\\f182\";\n  --fa--fa: \"\\f182\\f182\"; }\n\n.fa-comment-dollar {\n  --fa: \"\\f651\";\n  --fa--fa: \"\\f651\\f651\"; }\n\n.fa-business-time {\n  --fa: \"\\f64a\";\n  --fa--fa: \"\\f64a\\f64a\"; }\n\n.fa-briefcase-clock {\n  --fa: \"\\f64a\";\n  --fa--fa: \"\\f64a\\f64a\"; }\n\n.fa-table-cells-large {\n  --fa: \"\\f009\";\n  --fa--fa: \"\\f009\\f009\"; }\n\n.fa-th-large {\n  --fa: \"\\f009\";\n  --fa--fa: \"\\f009\\f009\"; }\n\n.fa-book-tanakh {\n  --fa: \"\\f827\";\n  --fa--fa: \"\\f827\\f827\"; }\n\n.fa-tanakh {\n  --fa: \"\\f827\";\n  --fa--fa: \"\\f827\\f827\"; }\n\n.fa-phone-volume {\n  --fa: \"\\f2a0\";\n  --fa--fa: \"\\f2a0\\f2a0\"; }\n\n.fa-volume-control-phone {\n  --fa: \"\\f2a0\";\n  --fa--fa: \"\\f2a0\\f2a0\"; }\n\n.fa-hat-cowboy-side {\n  --fa: \"\\f8c1\";\n  --fa--fa: \"\\f8c1\\f8c1\"; }\n\n.fa-clipboard-user {\n  --fa: \"\\f7f3\";\n  --fa--fa: \"\\f7f3\\f7f3\"; }\n\n.fa-child {\n  --fa: \"\\f1ae\";\n  --fa--fa: \"\\f1ae\\f1ae\"; }\n\n.fa-lira-sign {\n  --fa: \"\\f195\";\n  --fa--fa: \"\\f195\\f195\"; }\n\n.fa-satellite {\n  --fa: \"\\f7bf\";\n  --fa--fa: \"\\f7bf\\f7bf\"; }\n\n.fa-plane-lock {\n  --fa: \"\\e558\";\n  --fa--fa: \"\\e558\\e558\"; }\n\n.fa-tag {\n  --fa: \"\\f02b\";\n  --fa--fa: \"\\f02b\\f02b\"; }\n\n.fa-comment {\n  --fa: \"\\f075\";\n  --fa--fa: \"\\f075\\f075\"; }\n\n.fa-cake-candles {\n  --fa: \"\\f1fd\";\n  --fa--fa: \"\\f1fd\\f1fd\"; }\n\n.fa-birthday-cake {\n  --fa: \"\\f1fd\";\n  --fa--fa: \"\\f1fd\\f1fd\"; }\n\n.fa-cake {\n  --fa: \"\\f1fd\";\n  --fa--fa: \"\\f1fd\\f1fd\"; }\n\n.fa-envelope {\n  --fa: \"\\f0e0\";\n  --fa--fa: \"\\f0e0\\f0e0\"; }\n\n.fa-angles-up {\n  --fa: \"\\f102\";\n  --fa--fa: \"\\f102\\f102\"; }\n\n.fa-angle-double-up {\n  --fa: \"\\f102\";\n  --fa--fa: \"\\f102\\f102\"; }\n\n.fa-paperclip {\n  --fa: \"\\f0c6\";\n  --fa--fa: \"\\f0c6\\f0c6\"; }\n\n.fa-arrow-right-to-city {\n  --fa: \"\\e4b3\";\n  --fa--fa: \"\\e4b3\\e4b3\"; }\n\n.fa-ribbon {\n  --fa: \"\\f4d6\";\n  --fa--fa: \"\\f4d6\\f4d6\"; }\n\n.fa-lungs {\n  --fa: \"\\f604\";\n  --fa--fa: \"\\f604\\f604\"; }\n\n.fa-arrow-up-9-1 {\n  --fa: \"\\f887\";\n  --fa--fa: \"\\f887\\f887\"; }\n\n.fa-sort-numeric-up-alt {\n  --fa: \"\\f887\";\n  --fa--fa: \"\\f887\\f887\"; }\n\n.fa-litecoin-sign {\n  --fa: \"\\e1d3\";\n  --fa--fa: \"\\e1d3\\e1d3\"; }\n\n.fa-border-none {\n  --fa: \"\\f850\";\n  --fa--fa: \"\\f850\\f850\"; }\n\n.fa-circle-nodes {\n  --fa: \"\\e4e2\";\n  --fa--fa: \"\\e4e2\\e4e2\"; }\n\n.fa-parachute-box {\n  --fa: \"\\f4cd\";\n  --fa--fa: \"\\f4cd\\f4cd\"; }\n\n.fa-indent {\n  --fa: \"\\f03c\";\n  --fa--fa: \"\\f03c\\f03c\"; }\n\n.fa-truck-field-un {\n  --fa: \"\\e58e\";\n  --fa--fa: \"\\e58e\\e58e\"; }\n\n.fa-hourglass {\n  --fa: \"\\f254\";\n  --fa--fa: \"\\f254\\f254\"; }\n\n.fa-hourglass-empty {\n  --fa: \"\\f254\";\n  --fa--fa: \"\\f254\\f254\"; }\n\n.fa-mountain {\n  --fa: \"\\f6fc\";\n  --fa--fa: \"\\f6fc\\f6fc\"; }\n\n.fa-user-doctor {\n  --fa: \"\\f0f0\";\n  --fa--fa: \"\\f0f0\\f0f0\"; }\n\n.fa-user-md {\n  --fa: \"\\f0f0\";\n  --fa--fa: \"\\f0f0\\f0f0\"; }\n\n.fa-circle-info {\n  --fa: \"\\f05a\";\n  --fa--fa: \"\\f05a\\f05a\"; }\n\n.fa-info-circle {\n  --fa: \"\\f05a\";\n  --fa--fa: \"\\f05a\\f05a\"; }\n\n.fa-cloud-meatball {\n  --fa: \"\\f73b\";\n  --fa--fa: \"\\f73b\\f73b\"; }\n\n.fa-camera {\n  --fa: \"\\f030\";\n  --fa--fa: \"\\f030\\f030\"; }\n\n.fa-camera-alt {\n  --fa: \"\\f030\";\n  --fa--fa: \"\\f030\\f030\"; }\n\n.fa-square-virus {\n  --fa: \"\\e578\";\n  --fa--fa: \"\\e578\\e578\"; }\n\n.fa-meteor {\n  --fa: \"\\f753\";\n  --fa--fa: \"\\f753\\f753\"; }\n\n.fa-car-on {\n  --fa: \"\\e4dd\";\n  --fa--fa: \"\\e4dd\\e4dd\"; }\n\n.fa-sleigh {\n  --fa: \"\\f7cc\";\n  --fa--fa: \"\\f7cc\\f7cc\"; }\n\n.fa-arrow-down-1-9 {\n  --fa: \"\\f162\";\n  --fa--fa: \"\\f162\\f162\"; }\n\n.fa-sort-numeric-asc {\n  --fa: \"\\f162\";\n  --fa--fa: \"\\f162\\f162\"; }\n\n.fa-sort-numeric-down {\n  --fa: \"\\f162\";\n  --fa--fa: \"\\f162\\f162\"; }\n\n.fa-hand-holding-droplet {\n  --fa: \"\\f4c1\";\n  --fa--fa: \"\\f4c1\\f4c1\"; }\n\n.fa-hand-holding-water {\n  --fa: \"\\f4c1\";\n  --fa--fa: \"\\f4c1\\f4c1\"; }\n\n.fa-water {\n  --fa: \"\\f773\";\n  --fa--fa: \"\\f773\\f773\"; }\n\n.fa-calendar-check {\n  --fa: \"\\f274\";\n  --fa--fa: \"\\f274\\f274\"; }\n\n.fa-braille {\n  --fa: \"\\f2a1\";\n  --fa--fa: \"\\f2a1\\f2a1\"; }\n\n.fa-prescription-bottle-medical {\n  --fa: \"\\f486\";\n  --fa--fa: \"\\f486\\f486\"; }\n\n.fa-prescription-bottle-alt {\n  --fa: \"\\f486\";\n  --fa--fa: \"\\f486\\f486\"; }\n\n.fa-landmark {\n  --fa: \"\\f66f\";\n  --fa--fa: \"\\f66f\\f66f\"; }\n\n.fa-truck {\n  --fa: \"\\f0d1\";\n  --fa--fa: \"\\f0d1\\f0d1\"; }\n\n.fa-crosshairs {\n  --fa: \"\\f05b\";\n  --fa--fa: \"\\f05b\\f05b\"; }\n\n.fa-person-cane {\n  --fa: \"\\e53c\";\n  --fa--fa: \"\\e53c\\e53c\"; }\n\n.fa-tent {\n  --fa: \"\\e57d\";\n  --fa--fa: \"\\e57d\\e57d\"; }\n\n.fa-vest-patches {\n  --fa: \"\\e086\";\n  --fa--fa: \"\\e086\\e086\"; }\n\n.fa-check-double {\n  --fa: \"\\f560\";\n  --fa--fa: \"\\f560\\f560\"; }\n\n.fa-arrow-down-a-z {\n  --fa: \"\\f15d\";\n  --fa--fa: \"\\f15d\\f15d\"; }\n\n.fa-sort-alpha-asc {\n  --fa: \"\\f15d\";\n  --fa--fa: \"\\f15d\\f15d\"; }\n\n.fa-sort-alpha-down {\n  --fa: \"\\f15d\";\n  --fa--fa: \"\\f15d\\f15d\"; }\n\n.fa-money-bill-wheat {\n  --fa: \"\\e52a\";\n  --fa--fa: \"\\e52a\\e52a\"; }\n\n.fa-cookie {\n  --fa: \"\\f563\";\n  --fa--fa: \"\\f563\\f563\"; }\n\n.fa-arrow-rotate-left {\n  --fa: \"\\f0e2\";\n  --fa--fa: \"\\f0e2\\f0e2\"; }\n\n.fa-arrow-left-rotate {\n  --fa: \"\\f0e2\";\n  --fa--fa: \"\\f0e2\\f0e2\"; }\n\n.fa-arrow-rotate-back {\n  --fa: \"\\f0e2\";\n  --fa--fa: \"\\f0e2\\f0e2\"; }\n\n.fa-arrow-rotate-backward {\n  --fa: \"\\f0e2\";\n  --fa--fa: \"\\f0e2\\f0e2\"; }\n\n.fa-undo {\n  --fa: \"\\f0e2\";\n  --fa--fa: \"\\f0e2\\f0e2\"; }\n\n.fa-hard-drive {\n  --fa: \"\\f0a0\";\n  --fa--fa: \"\\f0a0\\f0a0\"; }\n\n.fa-hdd {\n  --fa: \"\\f0a0\";\n  --fa--fa: \"\\f0a0\\f0a0\"; }\n\n.fa-face-grin-squint-tears {\n  --fa: \"\\f586\";\n  --fa--fa: \"\\f586\\f586\"; }\n\n.fa-grin-squint-tears {\n  --fa: \"\\f586\";\n  --fa--fa: \"\\f586\\f586\"; }\n\n.fa-dumbbell {\n  --fa: \"\\f44b\";\n  --fa--fa: \"\\f44b\\f44b\"; }\n\n.fa-rectangle-list {\n  --fa: \"\\f022\";\n  --fa--fa: \"\\f022\\f022\"; }\n\n.fa-list-alt {\n  --fa: \"\\f022\";\n  --fa--fa: \"\\f022\\f022\"; }\n\n.fa-tarp-droplet {\n  --fa: \"\\e57c\";\n  --fa--fa: \"\\e57c\\e57c\"; }\n\n.fa-house-medical-circle-check {\n  --fa: \"\\e511\";\n  --fa--fa: \"\\e511\\e511\"; }\n\n.fa-person-skiing-nordic {\n  --fa: \"\\f7ca\";\n  --fa--fa: \"\\f7ca\\f7ca\"; }\n\n.fa-skiing-nordic {\n  --fa: \"\\f7ca\";\n  --fa--fa: \"\\f7ca\\f7ca\"; }\n\n.fa-calendar-plus {\n  --fa: \"\\f271\";\n  --fa--fa: \"\\f271\\f271\"; }\n\n.fa-plane-arrival {\n  --fa: \"\\f5af\";\n  --fa--fa: \"\\f5af\\f5af\"; }\n\n.fa-circle-left {\n  --fa: \"\\f359\";\n  --fa--fa: \"\\f359\\f359\"; }\n\n.fa-arrow-alt-circle-left {\n  --fa: \"\\f359\";\n  --fa--fa: \"\\f359\\f359\"; }\n\n.fa-train-subway {\n  --fa: \"\\f239\";\n  --fa--fa: \"\\f239\\f239\"; }\n\n.fa-subway {\n  --fa: \"\\f239\";\n  --fa--fa: \"\\f239\\f239\"; }\n\n.fa-chart-gantt {\n  --fa: \"\\e0e4\";\n  --fa--fa: \"\\e0e4\\e0e4\"; }\n\n.fa-indian-rupee-sign {\n  --fa: \"\\e1bc\";\n  --fa--fa: \"\\e1bc\\e1bc\"; }\n\n.fa-indian-rupee {\n  --fa: \"\\e1bc\";\n  --fa--fa: \"\\e1bc\\e1bc\"; }\n\n.fa-inr {\n  --fa: \"\\e1bc\";\n  --fa--fa: \"\\e1bc\\e1bc\"; }\n\n.fa-crop-simple {\n  --fa: \"\\f565\";\n  --fa--fa: \"\\f565\\f565\"; }\n\n.fa-crop-alt {\n  --fa: \"\\f565\";\n  --fa--fa: \"\\f565\\f565\"; }\n\n.fa-money-bill-1 {\n  --fa: \"\\f3d1\";\n  --fa--fa: \"\\f3d1\\f3d1\"; }\n\n.fa-money-bill-alt {\n  --fa: \"\\f3d1\";\n  --fa--fa: \"\\f3d1\\f3d1\"; }\n\n.fa-left-long {\n  --fa: \"\\f30a\";\n  --fa--fa: \"\\f30a\\f30a\"; }\n\n.fa-long-arrow-alt-left {\n  --fa: \"\\f30a\";\n  --fa--fa: \"\\f30a\\f30a\"; }\n\n.fa-dna {\n  --fa: \"\\f471\";\n  --fa--fa: \"\\f471\\f471\"; }\n\n.fa-virus-slash {\n  --fa: \"\\e075\";\n  --fa--fa: \"\\e075\\e075\"; }\n\n.fa-minus {\n  --fa: \"\\f068\";\n  --fa--fa: \"\\f068\\f068\"; }\n\n.fa-subtract {\n  --fa: \"\\f068\";\n  --fa--fa: \"\\f068\\f068\"; }\n\n.fa-chess {\n  --fa: \"\\f439\";\n  --fa--fa: \"\\f439\\f439\"; }\n\n.fa-arrow-left-long {\n  --fa: \"\\f177\";\n  --fa--fa: \"\\f177\\f177\"; }\n\n.fa-long-arrow-left {\n  --fa: \"\\f177\";\n  --fa--fa: \"\\f177\\f177\"; }\n\n.fa-plug-circle-check {\n  --fa: \"\\e55c\";\n  --fa--fa: \"\\e55c\\e55c\"; }\n\n.fa-street-view {\n  --fa: \"\\f21d\";\n  --fa--fa: \"\\f21d\\f21d\"; }\n\n.fa-franc-sign {\n  --fa: \"\\e18f\";\n  --fa--fa: \"\\e18f\\e18f\"; }\n\n.fa-volume-off {\n  --fa: \"\\f026\";\n  --fa--fa: \"\\f026\\f026\"; }\n\n.fa-hands-asl-interpreting {\n  --fa: \"\\f2a3\";\n  --fa--fa: \"\\f2a3\\f2a3\"; }\n\n.fa-american-sign-language-interpreting {\n  --fa: \"\\f2a3\";\n  --fa--fa: \"\\f2a3\\f2a3\"; }\n\n.fa-asl-interpreting {\n  --fa: \"\\f2a3\";\n  --fa--fa: \"\\f2a3\\f2a3\"; }\n\n.fa-hands-american-sign-language-interpreting {\n  --fa: \"\\f2a3\";\n  --fa--fa: \"\\f2a3\\f2a3\"; }\n\n.fa-gear {\n  --fa: \"\\f013\";\n  --fa--fa: \"\\f013\\f013\"; }\n\n.fa-cog {\n  --fa: \"\\f013\";\n  --fa--fa: \"\\f013\\f013\"; }\n\n.fa-droplet-slash {\n  --fa: \"\\f5c7\";\n  --fa--fa: \"\\f5c7\\f5c7\"; }\n\n.fa-tint-slash {\n  --fa: \"\\f5c7\";\n  --fa--fa: \"\\f5c7\\f5c7\"; }\n\n.fa-mosque {\n  --fa: \"\\f678\";\n  --fa--fa: \"\\f678\\f678\"; }\n\n.fa-mosquito {\n  --fa: \"\\e52b\";\n  --fa--fa: \"\\e52b\\e52b\"; }\n\n.fa-star-of-david {\n  --fa: \"\\f69a\";\n  --fa--fa: \"\\f69a\\f69a\"; }\n\n.fa-person-military-rifle {\n  --fa: \"\\e54b\";\n  --fa--fa: \"\\e54b\\e54b\"; }\n\n.fa-cart-shopping {\n  --fa: \"\\f07a\";\n  --fa--fa: \"\\f07a\\f07a\"; }\n\n.fa-shopping-cart {\n  --fa: \"\\f07a\";\n  --fa--fa: \"\\f07a\\f07a\"; }\n\n.fa-vials {\n  --fa: \"\\f493\";\n  --fa--fa: \"\\f493\\f493\"; }\n\n.fa-plug-circle-plus {\n  --fa: \"\\e55f\";\n  --fa--fa: \"\\e55f\\e55f\"; }\n\n.fa-place-of-worship {\n  --fa: \"\\f67f\";\n  --fa--fa: \"\\f67f\\f67f\"; }\n\n.fa-grip-vertical {\n  --fa: \"\\f58e\";\n  --fa--fa: \"\\f58e\\f58e\"; }\n\n.fa-hexagon-nodes {\n  --fa: \"\\e699\";\n  --fa--fa: \"\\e699\\e699\"; }\n\n.fa-arrow-turn-up {\n  --fa: \"\\f148\";\n  --fa--fa: \"\\f148\\f148\"; }\n\n.fa-level-up {\n  --fa: \"\\f148\";\n  --fa--fa: \"\\f148\\f148\"; }\n\n.fa-u {\n  --fa: \"\\55\";\n  --fa--fa: \"\\55\\55\"; }\n\n.fa-square-root-variable {\n  --fa: \"\\f698\";\n  --fa--fa: \"\\f698\\f698\"; }\n\n.fa-square-root-alt {\n  --fa: \"\\f698\";\n  --fa--fa: \"\\f698\\f698\"; }\n\n.fa-clock {\n  --fa: \"\\f017\";\n  --fa--fa: \"\\f017\\f017\"; }\n\n.fa-clock-four {\n  --fa: \"\\f017\";\n  --fa--fa: \"\\f017\\f017\"; }\n\n.fa-backward-step {\n  --fa: \"\\f048\";\n  --fa--fa: \"\\f048\\f048\"; }\n\n.fa-step-backward {\n  --fa: \"\\f048\";\n  --fa--fa: \"\\f048\\f048\"; }\n\n.fa-pallet {\n  --fa: \"\\f482\";\n  --fa--fa: \"\\f482\\f482\"; }\n\n.fa-faucet {\n  --fa: \"\\e005\";\n  --fa--fa: \"\\e005\\e005\"; }\n\n.fa-baseball-bat-ball {\n  --fa: \"\\f432\";\n  --fa--fa: \"\\f432\\f432\"; }\n\n.fa-s {\n  --fa: \"\\53\";\n  --fa--fa: \"\\53\\53\"; }\n\n.fa-timeline {\n  --fa: \"\\e29c\";\n  --fa--fa: \"\\e29c\\e29c\"; }\n\n.fa-keyboard {\n  --fa: \"\\f11c\";\n  --fa--fa: \"\\f11c\\f11c\"; }\n\n.fa-caret-down {\n  --fa: \"\\f0d7\";\n  --fa--fa: \"\\f0d7\\f0d7\"; }\n\n.fa-house-chimney-medical {\n  --fa: \"\\f7f2\";\n  --fa--fa: \"\\f7f2\\f7f2\"; }\n\n.fa-clinic-medical {\n  --fa: \"\\f7f2\";\n  --fa--fa: \"\\f7f2\\f7f2\"; }\n\n.fa-temperature-three-quarters {\n  --fa: \"\\f2c8\";\n  --fa--fa: \"\\f2c8\\f2c8\"; }\n\n.fa-temperature-3 {\n  --fa: \"\\f2c8\";\n  --fa--fa: \"\\f2c8\\f2c8\"; }\n\n.fa-thermometer-3 {\n  --fa: \"\\f2c8\";\n  --fa--fa: \"\\f2c8\\f2c8\"; }\n\n.fa-thermometer-three-quarters {\n  --fa: \"\\f2c8\";\n  --fa--fa: \"\\f2c8\\f2c8\"; }\n\n.fa-mobile-screen {\n  --fa: \"\\f3cf\";\n  --fa--fa: \"\\f3cf\\f3cf\"; }\n\n.fa-mobile-android-alt {\n  --fa: \"\\f3cf\";\n  --fa--fa: \"\\f3cf\\f3cf\"; }\n\n.fa-plane-up {\n  --fa: \"\\e22d\";\n  --fa--fa: \"\\e22d\\e22d\"; }\n\n.fa-piggy-bank {\n  --fa: \"\\f4d3\";\n  --fa--fa: \"\\f4d3\\f4d3\"; }\n\n.fa-battery-half {\n  --fa: \"\\f242\";\n  --fa--fa: \"\\f242\\f242\"; }\n\n.fa-battery-3 {\n  --fa: \"\\f242\";\n  --fa--fa: \"\\f242\\f242\"; }\n\n.fa-mountain-city {\n  --fa: \"\\e52e\";\n  --fa--fa: \"\\e52e\\e52e\"; }\n\n.fa-coins {\n  --fa: \"\\f51e\";\n  --fa--fa: \"\\f51e\\f51e\"; }\n\n.fa-khanda {\n  --fa: \"\\f66d\";\n  --fa--fa: \"\\f66d\\f66d\"; }\n\n.fa-sliders {\n  --fa: \"\\f1de\";\n  --fa--fa: \"\\f1de\\f1de\"; }\n\n.fa-sliders-h {\n  --fa: \"\\f1de\";\n  --fa--fa: \"\\f1de\\f1de\"; }\n\n.fa-folder-tree {\n  --fa: \"\\f802\";\n  --fa--fa: \"\\f802\\f802\"; }\n\n.fa-network-wired {\n  --fa: \"\\f6ff\";\n  --fa--fa: \"\\f6ff\\f6ff\"; }\n\n.fa-map-pin {\n  --fa: \"\\f276\";\n  --fa--fa: \"\\f276\\f276\"; }\n\n.fa-hamsa {\n  --fa: \"\\f665\";\n  --fa--fa: \"\\f665\\f665\"; }\n\n.fa-cent-sign {\n  --fa: \"\\e3f5\";\n  --fa--fa: \"\\e3f5\\e3f5\"; }\n\n.fa-flask {\n  --fa: \"\\f0c3\";\n  --fa--fa: \"\\f0c3\\f0c3\"; }\n\n.fa-person-pregnant {\n  --fa: \"\\e31e\";\n  --fa--fa: \"\\e31e\\e31e\"; }\n\n.fa-wand-sparkles {\n  --fa: \"\\f72b\";\n  --fa--fa: \"\\f72b\\f72b\"; }\n\n.fa-ellipsis-vertical {\n  --fa: \"\\f142\";\n  --fa--fa: \"\\f142\\f142\"; }\n\n.fa-ellipsis-v {\n  --fa: \"\\f142\";\n  --fa--fa: \"\\f142\\f142\"; }\n\n.fa-ticket {\n  --fa: \"\\f145\";\n  --fa--fa: \"\\f145\\f145\"; }\n\n.fa-power-off {\n  --fa: \"\\f011\";\n  --fa--fa: \"\\f011\\f011\"; }\n\n.fa-right-long {\n  --fa: \"\\f30b\";\n  --fa--fa: \"\\f30b\\f30b\"; }\n\n.fa-long-arrow-alt-right {\n  --fa: \"\\f30b\";\n  --fa--fa: \"\\f30b\\f30b\"; }\n\n.fa-flag-usa {\n  --fa: \"\\f74d\";\n  --fa--fa: \"\\f74d\\f74d\"; }\n\n.fa-laptop-file {\n  --fa: \"\\e51d\";\n  --fa--fa: \"\\e51d\\e51d\"; }\n\n.fa-tty {\n  --fa: \"\\f1e4\";\n  --fa--fa: \"\\f1e4\\f1e4\"; }\n\n.fa-teletype {\n  --fa: \"\\f1e4\";\n  --fa--fa: \"\\f1e4\\f1e4\"; }\n\n.fa-diagram-next {\n  --fa: \"\\e476\";\n  --fa--fa: \"\\e476\\e476\"; }\n\n.fa-person-rifle {\n  --fa: \"\\e54e\";\n  --fa--fa: \"\\e54e\\e54e\"; }\n\n.fa-house-medical-circle-exclamation {\n  --fa: \"\\e512\";\n  --fa--fa: \"\\e512\\e512\"; }\n\n.fa-closed-captioning {\n  --fa: \"\\f20a\";\n  --fa--fa: \"\\f20a\\f20a\"; }\n\n.fa-person-hiking {\n  --fa: \"\\f6ec\";\n  --fa--fa: \"\\f6ec\\f6ec\"; }\n\n.fa-hiking {\n  --fa: \"\\f6ec\";\n  --fa--fa: \"\\f6ec\\f6ec\"; }\n\n.fa-venus-double {\n  --fa: \"\\f226\";\n  --fa--fa: \"\\f226\\f226\"; }\n\n.fa-images {\n  --fa: \"\\f302\";\n  --fa--fa: \"\\f302\\f302\"; }\n\n.fa-calculator {\n  --fa: \"\\f1ec\";\n  --fa--fa: \"\\f1ec\\f1ec\"; }\n\n.fa-people-pulling {\n  --fa: \"\\e535\";\n  --fa--fa: \"\\e535\\e535\"; }\n\n.fa-n {\n  --fa: \"\\4e\";\n  --fa--fa: \"\\4e\\4e\"; }\n\n.fa-cable-car {\n  --fa: \"\\f7da\";\n  --fa--fa: \"\\f7da\\f7da\"; }\n\n.fa-tram {\n  --fa: \"\\f7da\";\n  --fa--fa: \"\\f7da\\f7da\"; }\n\n.fa-cloud-rain {\n  --fa: \"\\f73d\";\n  --fa--fa: \"\\f73d\\f73d\"; }\n\n.fa-building-circle-xmark {\n  --fa: \"\\e4d4\";\n  --fa--fa: \"\\e4d4\\e4d4\"; }\n\n.fa-ship {\n  --fa: \"\\f21a\";\n  --fa--fa: \"\\f21a\\f21a\"; }\n\n.fa-arrows-down-to-line {\n  --fa: \"\\e4b8\";\n  --fa--fa: \"\\e4b8\\e4b8\"; }\n\n.fa-download {\n  --fa: \"\\f019\";\n  --fa--fa: \"\\f019\\f019\"; }\n\n.fa-face-grin {\n  --fa: \"\\f580\";\n  --fa--fa: \"\\f580\\f580\"; }\n\n.fa-grin {\n  --fa: \"\\f580\";\n  --fa--fa: \"\\f580\\f580\"; }\n\n.fa-delete-left {\n  --fa: \"\\f55a\";\n  --fa--fa: \"\\f55a\\f55a\"; }\n\n.fa-backspace {\n  --fa: \"\\f55a\";\n  --fa--fa: \"\\f55a\\f55a\"; }\n\n.fa-eye-dropper {\n  --fa: \"\\f1fb\";\n  --fa--fa: \"\\f1fb\\f1fb\"; }\n\n.fa-eye-dropper-empty {\n  --fa: \"\\f1fb\";\n  --fa--fa: \"\\f1fb\\f1fb\"; }\n\n.fa-eyedropper {\n  --fa: \"\\f1fb\";\n  --fa--fa: \"\\f1fb\\f1fb\"; }\n\n.fa-file-circle-check {\n  --fa: \"\\e5a0\";\n  --fa--fa: \"\\e5a0\\e5a0\"; }\n\n.fa-forward {\n  --fa: \"\\f04e\";\n  --fa--fa: \"\\f04e\\f04e\"; }\n\n.fa-mobile {\n  --fa: \"\\f3ce\";\n  --fa--fa: \"\\f3ce\\f3ce\"; }\n\n.fa-mobile-android {\n  --fa: \"\\f3ce\";\n  --fa--fa: \"\\f3ce\\f3ce\"; }\n\n.fa-mobile-phone {\n  --fa: \"\\f3ce\";\n  --fa--fa: \"\\f3ce\\f3ce\"; }\n\n.fa-face-meh {\n  --fa: \"\\f11a\";\n  --fa--fa: \"\\f11a\\f11a\"; }\n\n.fa-meh {\n  --fa: \"\\f11a\";\n  --fa--fa: \"\\f11a\\f11a\"; }\n\n.fa-align-center {\n  --fa: \"\\f037\";\n  --fa--fa: \"\\f037\\f037\"; }\n\n.fa-book-skull {\n  --fa: \"\\f6b7\";\n  --fa--fa: \"\\f6b7\\f6b7\"; }\n\n.fa-book-dead {\n  --fa: \"\\f6b7\";\n  --fa--fa: \"\\f6b7\\f6b7\"; }\n\n.fa-id-card {\n  --fa: \"\\f2c2\";\n  --fa--fa: \"\\f2c2\\f2c2\"; }\n\n.fa-drivers-license {\n  --fa: \"\\f2c2\";\n  --fa--fa: \"\\f2c2\\f2c2\"; }\n\n.fa-outdent {\n  --fa: \"\\f03b\";\n  --fa--fa: \"\\f03b\\f03b\"; }\n\n.fa-dedent {\n  --fa: \"\\f03b\";\n  --fa--fa: \"\\f03b\\f03b\"; }\n\n.fa-heart-circle-exclamation {\n  --fa: \"\\e4fe\";\n  --fa--fa: \"\\e4fe\\e4fe\"; }\n\n.fa-house {\n  --fa: \"\\f015\";\n  --fa--fa: \"\\f015\\f015\"; }\n\n.fa-home {\n  --fa: \"\\f015\";\n  --fa--fa: \"\\f015\\f015\"; }\n\n.fa-home-alt {\n  --fa: \"\\f015\";\n  --fa--fa: \"\\f015\\f015\"; }\n\n.fa-home-lg-alt {\n  --fa: \"\\f015\";\n  --fa--fa: \"\\f015\\f015\"; }\n\n.fa-calendar-week {\n  --fa: \"\\f784\";\n  --fa--fa: \"\\f784\\f784\"; }\n\n.fa-laptop-medical {\n  --fa: \"\\f812\";\n  --fa--fa: \"\\f812\\f812\"; }\n\n.fa-b {\n  --fa: \"\\42\";\n  --fa--fa: \"\\42\\42\"; }\n\n.fa-file-medical {\n  --fa: \"\\f477\";\n  --fa--fa: \"\\f477\\f477\"; }\n\n.fa-dice-one {\n  --fa: \"\\f525\";\n  --fa--fa: \"\\f525\\f525\"; }\n\n.fa-kiwi-bird {\n  --fa: \"\\f535\";\n  --fa--fa: \"\\f535\\f535\"; }\n\n.fa-arrow-right-arrow-left {\n  --fa: \"\\f0ec\";\n  --fa--fa: \"\\f0ec\\f0ec\"; }\n\n.fa-exchange {\n  --fa: \"\\f0ec\";\n  --fa--fa: \"\\f0ec\\f0ec\"; }\n\n.fa-rotate-right {\n  --fa: \"\\f2f9\";\n  --fa--fa: \"\\f2f9\\f2f9\"; }\n\n.fa-redo-alt {\n  --fa: \"\\f2f9\";\n  --fa--fa: \"\\f2f9\\f2f9\"; }\n\n.fa-rotate-forward {\n  --fa: \"\\f2f9\";\n  --fa--fa: \"\\f2f9\\f2f9\"; }\n\n.fa-utensils {\n  --fa: \"\\f2e7\";\n  --fa--fa: \"\\f2e7\\f2e7\"; }\n\n.fa-cutlery {\n  --fa: \"\\f2e7\";\n  --fa--fa: \"\\f2e7\\f2e7\"; }\n\n.fa-arrow-up-wide-short {\n  --fa: \"\\f161\";\n  --fa--fa: \"\\f161\\f161\"; }\n\n.fa-sort-amount-up {\n  --fa: \"\\f161\";\n  --fa--fa: \"\\f161\\f161\"; }\n\n.fa-mill-sign {\n  --fa: \"\\e1ed\";\n  --fa--fa: \"\\e1ed\\e1ed\"; }\n\n.fa-bowl-rice {\n  --fa: \"\\e2eb\";\n  --fa--fa: \"\\e2eb\\e2eb\"; }\n\n.fa-skull {\n  --fa: \"\\f54c\";\n  --fa--fa: \"\\f54c\\f54c\"; }\n\n.fa-tower-broadcast {\n  --fa: \"\\f519\";\n  --fa--fa: \"\\f519\\f519\"; }\n\n.fa-broadcast-tower {\n  --fa: \"\\f519\";\n  --fa--fa: \"\\f519\\f519\"; }\n\n.fa-truck-pickup {\n  --fa: \"\\f63c\";\n  --fa--fa: \"\\f63c\\f63c\"; }\n\n.fa-up-long {\n  --fa: \"\\f30c\";\n  --fa--fa: \"\\f30c\\f30c\"; }\n\n.fa-long-arrow-alt-up {\n  --fa: \"\\f30c\";\n  --fa--fa: \"\\f30c\\f30c\"; }\n\n.fa-stop {\n  --fa: \"\\f04d\";\n  --fa--fa: \"\\f04d\\f04d\"; }\n\n.fa-code-merge {\n  --fa: \"\\f387\";\n  --fa--fa: \"\\f387\\f387\"; }\n\n.fa-upload {\n  --fa: \"\\f093\";\n  --fa--fa: \"\\f093\\f093\"; }\n\n.fa-hurricane {\n  --fa: \"\\f751\";\n  --fa--fa: \"\\f751\\f751\"; }\n\n.fa-mound {\n  --fa: \"\\e52d\";\n  --fa--fa: \"\\e52d\\e52d\"; }\n\n.fa-toilet-portable {\n  --fa: \"\\e583\";\n  --fa--fa: \"\\e583\\e583\"; }\n\n.fa-compact-disc {\n  --fa: \"\\f51f\";\n  --fa--fa: \"\\f51f\\f51f\"; }\n\n.fa-file-arrow-down {\n  --fa: \"\\f56d\";\n  --fa--fa: \"\\f56d\\f56d\"; }\n\n.fa-file-download {\n  --fa: \"\\f56d\";\n  --fa--fa: \"\\f56d\\f56d\"; }\n\n.fa-caravan {\n  --fa: \"\\f8ff\";\n  --fa--fa: \"\\f8ff\\f8ff\"; }\n\n.fa-shield-cat {\n  --fa: \"\\e572\";\n  --fa--fa: \"\\e572\\e572\"; }\n\n.fa-bolt {\n  --fa: \"\\f0e7\";\n  --fa--fa: \"\\f0e7\\f0e7\"; }\n\n.fa-zap {\n  --fa: \"\\f0e7\";\n  --fa--fa: \"\\f0e7\\f0e7\"; }\n\n.fa-glass-water {\n  --fa: \"\\e4f4\";\n  --fa--fa: \"\\e4f4\\e4f4\"; }\n\n.fa-oil-well {\n  --fa: \"\\e532\";\n  --fa--fa: \"\\e532\\e532\"; }\n\n.fa-vault {\n  --fa: \"\\e2c5\";\n  --fa--fa: \"\\e2c5\\e2c5\"; }\n\n.fa-mars {\n  --fa: \"\\f222\";\n  --fa--fa: \"\\f222\\f222\"; }\n\n.fa-toilet {\n  --fa: \"\\f7d8\";\n  --fa--fa: \"\\f7d8\\f7d8\"; }\n\n.fa-plane-circle-xmark {\n  --fa: \"\\e557\";\n  --fa--fa: \"\\e557\\e557\"; }\n\n.fa-yen-sign {\n  --fa: \"\\f157\";\n  --fa--fa: \"\\f157\\f157\"; }\n\n.fa-cny {\n  --fa: \"\\f157\";\n  --fa--fa: \"\\f157\\f157\"; }\n\n.fa-jpy {\n  --fa: \"\\f157\";\n  --fa--fa: \"\\f157\\f157\"; }\n\n.fa-rmb {\n  --fa: \"\\f157\";\n  --fa--fa: \"\\f157\\f157\"; }\n\n.fa-yen {\n  --fa: \"\\f157\";\n  --fa--fa: \"\\f157\\f157\"; }\n\n.fa-ruble-sign {\n  --fa: \"\\f158\";\n  --fa--fa: \"\\f158\\f158\"; }\n\n.fa-rouble {\n  --fa: \"\\f158\";\n  --fa--fa: \"\\f158\\f158\"; }\n\n.fa-rub {\n  --fa: \"\\f158\";\n  --fa--fa: \"\\f158\\f158\"; }\n\n.fa-ruble {\n  --fa: \"\\f158\";\n  --fa--fa: \"\\f158\\f158\"; }\n\n.fa-sun {\n  --fa: \"\\f185\";\n  --fa--fa: \"\\f185\\f185\"; }\n\n.fa-guitar {\n  --fa: \"\\f7a6\";\n  --fa--fa: \"\\f7a6\\f7a6\"; }\n\n.fa-face-laugh-wink {\n  --fa: \"\\f59c\";\n  --fa--fa: \"\\f59c\\f59c\"; }\n\n.fa-laugh-wink {\n  --fa: \"\\f59c\";\n  --fa--fa: \"\\f59c\\f59c\"; }\n\n.fa-horse-head {\n  --fa: \"\\f7ab\";\n  --fa--fa: \"\\f7ab\\f7ab\"; }\n\n.fa-bore-hole {\n  --fa: \"\\e4c3\";\n  --fa--fa: \"\\e4c3\\e4c3\"; }\n\n.fa-industry {\n  --fa: \"\\f275\";\n  --fa--fa: \"\\f275\\f275\"; }\n\n.fa-circle-down {\n  --fa: \"\\f358\";\n  --fa--fa: \"\\f358\\f358\"; }\n\n.fa-arrow-alt-circle-down {\n  --fa: \"\\f358\";\n  --fa--fa: \"\\f358\\f358\"; }\n\n.fa-arrows-turn-to-dots {\n  --fa: \"\\e4c1\";\n  --fa--fa: \"\\e4c1\\e4c1\"; }\n\n.fa-florin-sign {\n  --fa: \"\\e184\";\n  --fa--fa: \"\\e184\\e184\"; }\n\n.fa-arrow-down-short-wide {\n  --fa: \"\\f884\";\n  --fa--fa: \"\\f884\\f884\"; }\n\n.fa-sort-amount-desc {\n  --fa: \"\\f884\";\n  --fa--fa: \"\\f884\\f884\"; }\n\n.fa-sort-amount-down-alt {\n  --fa: \"\\f884\";\n  --fa--fa: \"\\f884\\f884\"; }\n\n.fa-less-than {\n  --fa: \"\\3c\";\n  --fa--fa: \"\\3c\\3c\"; }\n\n.fa-angle-down {\n  --fa: \"\\f107\";\n  --fa--fa: \"\\f107\\f107\"; }\n\n.fa-car-tunnel {\n  --fa: \"\\e4de\";\n  --fa--fa: \"\\e4de\\e4de\"; }\n\n.fa-head-side-cough {\n  --fa: \"\\e061\";\n  --fa--fa: \"\\e061\\e061\"; }\n\n.fa-grip-lines {\n  --fa: \"\\f7a4\";\n  --fa--fa: \"\\f7a4\\f7a4\"; }\n\n.fa-thumbs-down {\n  --fa: \"\\f165\";\n  --fa--fa: \"\\f165\\f165\"; }\n\n.fa-user-lock {\n  --fa: \"\\f502\";\n  --fa--fa: \"\\f502\\f502\"; }\n\n.fa-arrow-right-long {\n  --fa: \"\\f178\";\n  --fa--fa: \"\\f178\\f178\"; }\n\n.fa-long-arrow-right {\n  --fa: \"\\f178\";\n  --fa--fa: \"\\f178\\f178\"; }\n\n.fa-anchor-circle-xmark {\n  --fa: \"\\e4ac\";\n  --fa--fa: \"\\e4ac\\e4ac\"; }\n\n.fa-ellipsis {\n  --fa: \"\\f141\";\n  --fa--fa: \"\\f141\\f141\"; }\n\n.fa-ellipsis-h {\n  --fa: \"\\f141\";\n  --fa--fa: \"\\f141\\f141\"; }\n\n.fa-chess-pawn {\n  --fa: \"\\f443\";\n  --fa--fa: \"\\f443\\f443\"; }\n\n.fa-kit-medical {\n  --fa: \"\\f479\";\n  --fa--fa: \"\\f479\\f479\"; }\n\n.fa-first-aid {\n  --fa: \"\\f479\";\n  --fa--fa: \"\\f479\\f479\"; }\n\n.fa-person-through-window {\n  --fa: \"\\e5a9\";\n  --fa--fa: \"\\e5a9\\e5a9\"; }\n\n.fa-toolbox {\n  --fa: \"\\f552\";\n  --fa--fa: \"\\f552\\f552\"; }\n\n.fa-hands-holding-circle {\n  --fa: \"\\e4fb\";\n  --fa--fa: \"\\e4fb\\e4fb\"; }\n\n.fa-bug {\n  --fa: \"\\f188\";\n  --fa--fa: \"\\f188\\f188\"; }\n\n.fa-credit-card {\n  --fa: \"\\f09d\";\n  --fa--fa: \"\\f09d\\f09d\"; }\n\n.fa-credit-card-alt {\n  --fa: \"\\f09d\";\n  --fa--fa: \"\\f09d\\f09d\"; }\n\n.fa-car {\n  --fa: \"\\f1b9\";\n  --fa--fa: \"\\f1b9\\f1b9\"; }\n\n.fa-automobile {\n  --fa: \"\\f1b9\";\n  --fa--fa: \"\\f1b9\\f1b9\"; }\n\n.fa-hand-holding-hand {\n  --fa: \"\\e4f7\";\n  --fa--fa: \"\\e4f7\\e4f7\"; }\n\n.fa-book-open-reader {\n  --fa: \"\\f5da\";\n  --fa--fa: \"\\f5da\\f5da\"; }\n\n.fa-book-reader {\n  --fa: \"\\f5da\";\n  --fa--fa: \"\\f5da\\f5da\"; }\n\n.fa-mountain-sun {\n  --fa: \"\\e52f\";\n  --fa--fa: \"\\e52f\\e52f\"; }\n\n.fa-arrows-left-right-to-line {\n  --fa: \"\\e4ba\";\n  --fa--fa: \"\\e4ba\\e4ba\"; }\n\n.fa-dice-d20 {\n  --fa: \"\\f6cf\";\n  --fa--fa: \"\\f6cf\\f6cf\"; }\n\n.fa-truck-droplet {\n  --fa: \"\\e58c\";\n  --fa--fa: \"\\e58c\\e58c\"; }\n\n.fa-file-circle-xmark {\n  --fa: \"\\e5a1\";\n  --fa--fa: \"\\e5a1\\e5a1\"; }\n\n.fa-temperature-arrow-up {\n  --fa: \"\\e040\";\n  --fa--fa: \"\\e040\\e040\"; }\n\n.fa-temperature-up {\n  --fa: \"\\e040\";\n  --fa--fa: \"\\e040\\e040\"; }\n\n.fa-medal {\n  --fa: \"\\f5a2\";\n  --fa--fa: \"\\f5a2\\f5a2\"; }\n\n.fa-bed {\n  --fa: \"\\f236\";\n  --fa--fa: \"\\f236\\f236\"; }\n\n.fa-square-h {\n  --fa: \"\\f0fd\";\n  --fa--fa: \"\\f0fd\\f0fd\"; }\n\n.fa-h-square {\n  --fa: \"\\f0fd\";\n  --fa--fa: \"\\f0fd\\f0fd\"; }\n\n.fa-podcast {\n  --fa: \"\\f2ce\";\n  --fa--fa: \"\\f2ce\\f2ce\"; }\n\n.fa-temperature-full {\n  --fa: \"\\f2c7\";\n  --fa--fa: \"\\f2c7\\f2c7\"; }\n\n.fa-temperature-4 {\n  --fa: \"\\f2c7\";\n  --fa--fa: \"\\f2c7\\f2c7\"; }\n\n.fa-thermometer-4 {\n  --fa: \"\\f2c7\";\n  --fa--fa: \"\\f2c7\\f2c7\"; }\n\n.fa-thermometer-full {\n  --fa: \"\\f2c7\";\n  --fa--fa: \"\\f2c7\\f2c7\"; }\n\n.fa-bell {\n  --fa: \"\\f0f3\";\n  --fa--fa: \"\\f0f3\\f0f3\"; }\n\n.fa-superscript {\n  --fa: \"\\f12b\";\n  --fa--fa: \"\\f12b\\f12b\"; }\n\n.fa-plug-circle-xmark {\n  --fa: \"\\e560\";\n  --fa--fa: \"\\e560\\e560\"; }\n\n.fa-star-of-life {\n  --fa: \"\\f621\";\n  --fa--fa: \"\\f621\\f621\"; }\n\n.fa-phone-slash {\n  --fa: \"\\f3dd\";\n  --fa--fa: \"\\f3dd\\f3dd\"; }\n\n.fa-paint-roller {\n  --fa: \"\\f5aa\";\n  --fa--fa: \"\\f5aa\\f5aa\"; }\n\n.fa-handshake-angle {\n  --fa: \"\\f4c4\";\n  --fa--fa: \"\\f4c4\\f4c4\"; }\n\n.fa-hands-helping {\n  --fa: \"\\f4c4\";\n  --fa--fa: \"\\f4c4\\f4c4\"; }\n\n.fa-location-dot {\n  --fa: \"\\f3c5\";\n  --fa--fa: \"\\f3c5\\f3c5\"; }\n\n.fa-map-marker-alt {\n  --fa: \"\\f3c5\";\n  --fa--fa: \"\\f3c5\\f3c5\"; }\n\n.fa-file {\n  --fa: \"\\f15b\";\n  --fa--fa: \"\\f15b\\f15b\"; }\n\n.fa-greater-than {\n  --fa: \"\\3e\";\n  --fa--fa: \"\\3e\\3e\"; }\n\n.fa-person-swimming {\n  --fa: \"\\f5c4\";\n  --fa--fa: \"\\f5c4\\f5c4\"; }\n\n.fa-swimmer {\n  --fa: \"\\f5c4\";\n  --fa--fa: \"\\f5c4\\f5c4\"; }\n\n.fa-arrow-down {\n  --fa: \"\\f063\";\n  --fa--fa: \"\\f063\\f063\"; }\n\n.fa-droplet {\n  --fa: \"\\f043\";\n  --fa--fa: \"\\f043\\f043\"; }\n\n.fa-tint {\n  --fa: \"\\f043\";\n  --fa--fa: \"\\f043\\f043\"; }\n\n.fa-eraser {\n  --fa: \"\\f12d\";\n  --fa--fa: \"\\f12d\\f12d\"; }\n\n.fa-earth-americas {\n  --fa: \"\\f57d\";\n  --fa--fa: \"\\f57d\\f57d\"; }\n\n.fa-earth {\n  --fa: \"\\f57d\";\n  --fa--fa: \"\\f57d\\f57d\"; }\n\n.fa-earth-america {\n  --fa: \"\\f57d\";\n  --fa--fa: \"\\f57d\\f57d\"; }\n\n.fa-globe-americas {\n  --fa: \"\\f57d\";\n  --fa--fa: \"\\f57d\\f57d\"; }\n\n.fa-person-burst {\n  --fa: \"\\e53b\";\n  --fa--fa: \"\\e53b\\e53b\"; }\n\n.fa-dove {\n  --fa: \"\\f4ba\";\n  --fa--fa: \"\\f4ba\\f4ba\"; }\n\n.fa-battery-empty {\n  --fa: \"\\f244\";\n  --fa--fa: \"\\f244\\f244\"; }\n\n.fa-battery-0 {\n  --fa: \"\\f244\";\n  --fa--fa: \"\\f244\\f244\"; }\n\n.fa-socks {\n  --fa: \"\\f696\";\n  --fa--fa: \"\\f696\\f696\"; }\n\n.fa-inbox {\n  --fa: \"\\f01c\";\n  --fa--fa: \"\\f01c\\f01c\"; }\n\n.fa-section {\n  --fa: \"\\e447\";\n  --fa--fa: \"\\e447\\e447\"; }\n\n.fa-gauge-high {\n  --fa: \"\\f625\";\n  --fa--fa: \"\\f625\\f625\"; }\n\n.fa-tachometer-alt {\n  --fa: \"\\f625\";\n  --fa--fa: \"\\f625\\f625\"; }\n\n.fa-tachometer-alt-fast {\n  --fa: \"\\f625\";\n  --fa--fa: \"\\f625\\f625\"; }\n\n.fa-envelope-open-text {\n  --fa: \"\\f658\";\n  --fa--fa: \"\\f658\\f658\"; }\n\n.fa-hospital {\n  --fa: \"\\f0f8\";\n  --fa--fa: \"\\f0f8\\f0f8\"; }\n\n.fa-hospital-alt {\n  --fa: \"\\f0f8\";\n  --fa--fa: \"\\f0f8\\f0f8\"; }\n\n.fa-hospital-wide {\n  --fa: \"\\f0f8\";\n  --fa--fa: \"\\f0f8\\f0f8\"; }\n\n.fa-wine-bottle {\n  --fa: \"\\f72f\";\n  --fa--fa: \"\\f72f\\f72f\"; }\n\n.fa-chess-rook {\n  --fa: \"\\f447\";\n  --fa--fa: \"\\f447\\f447\"; }\n\n.fa-bars-staggered {\n  --fa: \"\\f550\";\n  --fa--fa: \"\\f550\\f550\"; }\n\n.fa-reorder {\n  --fa: \"\\f550\";\n  --fa--fa: \"\\f550\\f550\"; }\n\n.fa-stream {\n  --fa: \"\\f550\";\n  --fa--fa: \"\\f550\\f550\"; }\n\n.fa-dharmachakra {\n  --fa: \"\\f655\";\n  --fa--fa: \"\\f655\\f655\"; }\n\n.fa-hotdog {\n  --fa: \"\\f80f\";\n  --fa--fa: \"\\f80f\\f80f\"; }\n\n.fa-person-walking-with-cane {\n  --fa: \"\\f29d\";\n  --fa--fa: \"\\f29d\\f29d\"; }\n\n.fa-blind {\n  --fa: \"\\f29d\";\n  --fa--fa: \"\\f29d\\f29d\"; }\n\n.fa-drum {\n  --fa: \"\\f569\";\n  --fa--fa: \"\\f569\\f569\"; }\n\n.fa-ice-cream {\n  --fa: \"\\f810\";\n  --fa--fa: \"\\f810\\f810\"; }\n\n.fa-heart-circle-bolt {\n  --fa: \"\\e4fc\";\n  --fa--fa: \"\\e4fc\\e4fc\"; }\n\n.fa-fax {\n  --fa: \"\\f1ac\";\n  --fa--fa: \"\\f1ac\\f1ac\"; }\n\n.fa-paragraph {\n  --fa: \"\\f1dd\";\n  --fa--fa: \"\\f1dd\\f1dd\"; }\n\n.fa-check-to-slot {\n  --fa: \"\\f772\";\n  --fa--fa: \"\\f772\\f772\"; }\n\n.fa-vote-yea {\n  --fa: \"\\f772\";\n  --fa--fa: \"\\f772\\f772\"; }\n\n.fa-star-half {\n  --fa: \"\\f089\";\n  --fa--fa: \"\\f089\\f089\"; }\n\n.fa-boxes-stacked {\n  --fa: \"\\f468\";\n  --fa--fa: \"\\f468\\f468\"; }\n\n.fa-boxes {\n  --fa: \"\\f468\";\n  --fa--fa: \"\\f468\\f468\"; }\n\n.fa-boxes-alt {\n  --fa: \"\\f468\";\n  --fa--fa: \"\\f468\\f468\"; }\n\n.fa-link {\n  --fa: \"\\f0c1\";\n  --fa--fa: \"\\f0c1\\f0c1\"; }\n\n.fa-chain {\n  --fa: \"\\f0c1\";\n  --fa--fa: \"\\f0c1\\f0c1\"; }\n\n.fa-ear-listen {\n  --fa: \"\\f2a2\";\n  --fa--fa: \"\\f2a2\\f2a2\"; }\n\n.fa-assistive-listening-systems {\n  --fa: \"\\f2a2\";\n  --fa--fa: \"\\f2a2\\f2a2\"; }\n\n.fa-tree-city {\n  --fa: \"\\e587\";\n  --fa--fa: \"\\e587\\e587\"; }\n\n.fa-play {\n  --fa: \"\\f04b\";\n  --fa--fa: \"\\f04b\\f04b\"; }\n\n.fa-font {\n  --fa: \"\\f031\";\n  --fa--fa: \"\\f031\\f031\"; }\n\n.fa-table-cells-row-lock {\n  --fa: \"\\e67a\";\n  --fa--fa: \"\\e67a\\e67a\"; }\n\n.fa-rupiah-sign {\n  --fa: \"\\e23d\";\n  --fa--fa: \"\\e23d\\e23d\"; }\n\n.fa-magnifying-glass {\n  --fa: \"\\f002\";\n  --fa--fa: \"\\f002\\f002\"; }\n\n.fa-search {\n  --fa: \"\\f002\";\n  --fa--fa: \"\\f002\\f002\"; }\n\n.fa-table-tennis-paddle-ball {\n  --fa: \"\\f45d\";\n  --fa--fa: \"\\f45d\\f45d\"; }\n\n.fa-ping-pong-paddle-ball {\n  --fa: \"\\f45d\";\n  --fa--fa: \"\\f45d\\f45d\"; }\n\n.fa-table-tennis {\n  --fa: \"\\f45d\";\n  --fa--fa: \"\\f45d\\f45d\"; }\n\n.fa-person-dots-from-line {\n  --fa: \"\\f470\";\n  --fa--fa: \"\\f470\\f470\"; }\n\n.fa-diagnoses {\n  --fa: \"\\f470\";\n  --fa--fa: \"\\f470\\f470\"; }\n\n.fa-trash-can-arrow-up {\n  --fa: \"\\f82a\";\n  --fa--fa: \"\\f82a\\f82a\"; }\n\n.fa-trash-restore-alt {\n  --fa: \"\\f82a\";\n  --fa--fa: \"\\f82a\\f82a\"; }\n\n.fa-naira-sign {\n  --fa: \"\\e1f6\";\n  --fa--fa: \"\\e1f6\\e1f6\"; }\n\n.fa-cart-arrow-down {\n  --fa: \"\\f218\";\n  --fa--fa: \"\\f218\\f218\"; }\n\n.fa-walkie-talkie {\n  --fa: \"\\f8ef\";\n  --fa--fa: \"\\f8ef\\f8ef\"; }\n\n.fa-file-pen {\n  --fa: \"\\f31c\";\n  --fa--fa: \"\\f31c\\f31c\"; }\n\n.fa-file-edit {\n  --fa: \"\\f31c\";\n  --fa--fa: \"\\f31c\\f31c\"; }\n\n.fa-receipt {\n  --fa: \"\\f543\";\n  --fa--fa: \"\\f543\\f543\"; }\n\n.fa-square-pen {\n  --fa: \"\\f14b\";\n  --fa--fa: \"\\f14b\\f14b\"; }\n\n.fa-pen-square {\n  --fa: \"\\f14b\";\n  --fa--fa: \"\\f14b\\f14b\"; }\n\n.fa-pencil-square {\n  --fa: \"\\f14b\";\n  --fa--fa: \"\\f14b\\f14b\"; }\n\n.fa-suitcase-rolling {\n  --fa: \"\\f5c1\";\n  --fa--fa: \"\\f5c1\\f5c1\"; }\n\n.fa-person-circle-exclamation {\n  --fa: \"\\e53f\";\n  --fa--fa: \"\\e53f\\e53f\"; }\n\n.fa-chevron-down {\n  --fa: \"\\f078\";\n  --fa--fa: \"\\f078\\f078\"; }\n\n.fa-battery-full {\n  --fa: \"\\f240\";\n  --fa--fa: \"\\f240\\f240\"; }\n\n.fa-battery {\n  --fa: \"\\f240\";\n  --fa--fa: \"\\f240\\f240\"; }\n\n.fa-battery-5 {\n  --fa: \"\\f240\";\n  --fa--fa: \"\\f240\\f240\"; }\n\n.fa-skull-crossbones {\n  --fa: \"\\f714\";\n  --fa--fa: \"\\f714\\f714\"; }\n\n.fa-code-compare {\n  --fa: \"\\e13a\";\n  --fa--fa: \"\\e13a\\e13a\"; }\n\n.fa-list-ul {\n  --fa: \"\\f0ca\";\n  --fa--fa: \"\\f0ca\\f0ca\"; }\n\n.fa-list-dots {\n  --fa: \"\\f0ca\";\n  --fa--fa: \"\\f0ca\\f0ca\"; }\n\n.fa-school-lock {\n  --fa: \"\\e56f\";\n  --fa--fa: \"\\e56f\\e56f\"; }\n\n.fa-tower-cell {\n  --fa: \"\\e585\";\n  --fa--fa: \"\\e585\\e585\"; }\n\n.fa-down-long {\n  --fa: \"\\f309\";\n  --fa--fa: \"\\f309\\f309\"; }\n\n.fa-long-arrow-alt-down {\n  --fa: \"\\f309\";\n  --fa--fa: \"\\f309\\f309\"; }\n\n.fa-ranking-star {\n  --fa: \"\\e561\";\n  --fa--fa: \"\\e561\\e561\"; }\n\n.fa-chess-king {\n  --fa: \"\\f43f\";\n  --fa--fa: \"\\f43f\\f43f\"; }\n\n.fa-person-harassing {\n  --fa: \"\\e549\";\n  --fa--fa: \"\\e549\\e549\"; }\n\n.fa-brazilian-real-sign {\n  --fa: \"\\e46c\";\n  --fa--fa: \"\\e46c\\e46c\"; }\n\n.fa-landmark-dome {\n  --fa: \"\\f752\";\n  --fa--fa: \"\\f752\\f752\"; }\n\n.fa-landmark-alt {\n  --fa: \"\\f752\";\n  --fa--fa: \"\\f752\\f752\"; }\n\n.fa-arrow-up {\n  --fa: \"\\f062\";\n  --fa--fa: \"\\f062\\f062\"; }\n\n.fa-tv {\n  --fa: \"\\f26c\";\n  --fa--fa: \"\\f26c\\f26c\"; }\n\n.fa-television {\n  --fa: \"\\f26c\";\n  --fa--fa: \"\\f26c\\f26c\"; }\n\n.fa-tv-alt {\n  --fa: \"\\f26c\";\n  --fa--fa: \"\\f26c\\f26c\"; }\n\n.fa-shrimp {\n  --fa: \"\\e448\";\n  --fa--fa: \"\\e448\\e448\"; }\n\n.fa-list-check {\n  --fa: \"\\f0ae\";\n  --fa--fa: \"\\f0ae\\f0ae\"; }\n\n.fa-tasks {\n  --fa: \"\\f0ae\";\n  --fa--fa: \"\\f0ae\\f0ae\"; }\n\n.fa-jug-detergent {\n  --fa: \"\\e519\";\n  --fa--fa: \"\\e519\\e519\"; }\n\n.fa-circle-user {\n  --fa: \"\\f2bd\";\n  --fa--fa: \"\\f2bd\\f2bd\"; }\n\n.fa-user-circle {\n  --fa: \"\\f2bd\";\n  --fa--fa: \"\\f2bd\\f2bd\"; }\n\n.fa-user-shield {\n  --fa: \"\\f505\";\n  --fa--fa: \"\\f505\\f505\"; }\n\n.fa-wind {\n  --fa: \"\\f72e\";\n  --fa--fa: \"\\f72e\\f72e\"; }\n\n.fa-car-burst {\n  --fa: \"\\f5e1\";\n  --fa--fa: \"\\f5e1\\f5e1\"; }\n\n.fa-car-crash {\n  --fa: \"\\f5e1\";\n  --fa--fa: \"\\f5e1\\f5e1\"; }\n\n.fa-y {\n  --fa: \"\\59\";\n  --fa--fa: \"\\59\\59\"; }\n\n.fa-person-snowboarding {\n  --fa: \"\\f7ce\";\n  --fa--fa: \"\\f7ce\\f7ce\"; }\n\n.fa-snowboarding {\n  --fa: \"\\f7ce\";\n  --fa--fa: \"\\f7ce\\f7ce\"; }\n\n.fa-truck-fast {\n  --fa: \"\\f48b\";\n  --fa--fa: \"\\f48b\\f48b\"; }\n\n.fa-shipping-fast {\n  --fa: \"\\f48b\";\n  --fa--fa: \"\\f48b\\f48b\"; }\n\n.fa-fish {\n  --fa: \"\\f578\";\n  --fa--fa: \"\\f578\\f578\"; }\n\n.fa-user-graduate {\n  --fa: \"\\f501\";\n  --fa--fa: \"\\f501\\f501\"; }\n\n.fa-circle-half-stroke {\n  --fa: \"\\f042\";\n  --fa--fa: \"\\f042\\f042\"; }\n\n.fa-adjust {\n  --fa: \"\\f042\";\n  --fa--fa: \"\\f042\\f042\"; }\n\n.fa-clapperboard {\n  --fa: \"\\e131\";\n  --fa--fa: \"\\e131\\e131\"; }\n\n.fa-circle-radiation {\n  --fa: \"\\f7ba\";\n  --fa--fa: \"\\f7ba\\f7ba\"; }\n\n.fa-radiation-alt {\n  --fa: \"\\f7ba\";\n  --fa--fa: \"\\f7ba\\f7ba\"; }\n\n.fa-baseball {\n  --fa: \"\\f433\";\n  --fa--fa: \"\\f433\\f433\"; }\n\n.fa-baseball-ball {\n  --fa: \"\\f433\";\n  --fa--fa: \"\\f433\\f433\"; }\n\n.fa-jet-fighter-up {\n  --fa: \"\\e518\";\n  --fa--fa: \"\\e518\\e518\"; }\n\n.fa-diagram-project {\n  --fa: \"\\f542\";\n  --fa--fa: \"\\f542\\f542\"; }\n\n.fa-project-diagram {\n  --fa: \"\\f542\";\n  --fa--fa: \"\\f542\\f542\"; }\n\n.fa-copy {\n  --fa: \"\\f0c5\";\n  --fa--fa: \"\\f0c5\\f0c5\"; }\n\n.fa-volume-xmark {\n  --fa: \"\\f6a9\";\n  --fa--fa: \"\\f6a9\\f6a9\"; }\n\n.fa-volume-mute {\n  --fa: \"\\f6a9\";\n  --fa--fa: \"\\f6a9\\f6a9\"; }\n\n.fa-volume-times {\n  --fa: \"\\f6a9\";\n  --fa--fa: \"\\f6a9\\f6a9\"; }\n\n.fa-hand-sparkles {\n  --fa: \"\\e05d\";\n  --fa--fa: \"\\e05d\\e05d\"; }\n\n.fa-grip {\n  --fa: \"\\f58d\";\n  --fa--fa: \"\\f58d\\f58d\"; }\n\n.fa-grip-horizontal {\n  --fa: \"\\f58d\";\n  --fa--fa: \"\\f58d\\f58d\"; }\n\n.fa-share-from-square {\n  --fa: \"\\f14d\";\n  --fa--fa: \"\\f14d\\f14d\"; }\n\n.fa-share-square {\n  --fa: \"\\f14d\";\n  --fa--fa: \"\\f14d\\f14d\"; }\n\n.fa-child-combatant {\n  --fa: \"\\e4e0\";\n  --fa--fa: \"\\e4e0\\e4e0\"; }\n\n.fa-child-rifle {\n  --fa: \"\\e4e0\";\n  --fa--fa: \"\\e4e0\\e4e0\"; }\n\n.fa-gun {\n  --fa: \"\\e19b\";\n  --fa--fa: \"\\e19b\\e19b\"; }\n\n.fa-square-phone {\n  --fa: \"\\f098\";\n  --fa--fa: \"\\f098\\f098\"; }\n\n.fa-phone-square {\n  --fa: \"\\f098\";\n  --fa--fa: \"\\f098\\f098\"; }\n\n.fa-plus {\n  --fa: \"\\2b\";\n  --fa--fa: \"\\2b\\2b\"; }\n\n.fa-add {\n  --fa: \"\\2b\";\n  --fa--fa: \"\\2b\\2b\"; }\n\n.fa-expand {\n  --fa: \"\\f065\";\n  --fa--fa: \"\\f065\\f065\"; }\n\n.fa-computer {\n  --fa: \"\\e4e5\";\n  --fa--fa: \"\\e4e5\\e4e5\"; }\n\n.fa-xmark {\n  --fa: \"\\f00d\";\n  --fa--fa: \"\\f00d\\f00d\"; }\n\n.fa-close {\n  --fa: \"\\f00d\";\n  --fa--fa: \"\\f00d\\f00d\"; }\n\n.fa-multiply {\n  --fa: \"\\f00d\";\n  --fa--fa: \"\\f00d\\f00d\"; }\n\n.fa-remove {\n  --fa: \"\\f00d\";\n  --fa--fa: \"\\f00d\\f00d\"; }\n\n.fa-times {\n  --fa: \"\\f00d\";\n  --fa--fa: \"\\f00d\\f00d\"; }\n\n.fa-arrows-up-down-left-right {\n  --fa: \"\\f047\";\n  --fa--fa: \"\\f047\\f047\"; }\n\n.fa-arrows {\n  --fa: \"\\f047\";\n  --fa--fa: \"\\f047\\f047\"; }\n\n.fa-chalkboard-user {\n  --fa: \"\\f51c\";\n  --fa--fa: \"\\f51c\\f51c\"; }\n\n.fa-chalkboard-teacher {\n  --fa: \"\\f51c\";\n  --fa--fa: \"\\f51c\\f51c\"; }\n\n.fa-peso-sign {\n  --fa: \"\\e222\";\n  --fa--fa: \"\\e222\\e222\"; }\n\n.fa-building-shield {\n  --fa: \"\\e4d8\";\n  --fa--fa: \"\\e4d8\\e4d8\"; }\n\n.fa-baby {\n  --fa: \"\\f77c\";\n  --fa--fa: \"\\f77c\\f77c\"; }\n\n.fa-users-line {\n  --fa: \"\\e592\";\n  --fa--fa: \"\\e592\\e592\"; }\n\n.fa-quote-left {\n  --fa: \"\\f10d\";\n  --fa--fa: \"\\f10d\\f10d\"; }\n\n.fa-quote-left-alt {\n  --fa: \"\\f10d\";\n  --fa--fa: \"\\f10d\\f10d\"; }\n\n.fa-tractor {\n  --fa: \"\\f722\";\n  --fa--fa: \"\\f722\\f722\"; }\n\n.fa-trash-arrow-up {\n  --fa: \"\\f829\";\n  --fa--fa: \"\\f829\\f829\"; }\n\n.fa-trash-restore {\n  --fa: \"\\f829\";\n  --fa--fa: \"\\f829\\f829\"; }\n\n.fa-arrow-down-up-lock {\n  --fa: \"\\e4b0\";\n  --fa--fa: \"\\e4b0\\e4b0\"; }\n\n.fa-lines-leaning {\n  --fa: \"\\e51e\";\n  --fa--fa: \"\\e51e\\e51e\"; }\n\n.fa-ruler-combined {\n  --fa: \"\\f546\";\n  --fa--fa: \"\\f546\\f546\"; }\n\n.fa-copyright {\n  --fa: \"\\f1f9\";\n  --fa--fa: \"\\f1f9\\f1f9\"; }\n\n.fa-equals {\n  --fa: \"\\3d\";\n  --fa--fa: \"\\3d\\3d\"; }\n\n.fa-blender {\n  --fa: \"\\f517\";\n  --fa--fa: \"\\f517\\f517\"; }\n\n.fa-teeth {\n  --fa: \"\\f62e\";\n  --fa--fa: \"\\f62e\\f62e\"; }\n\n.fa-shekel-sign {\n  --fa: \"\\f20b\";\n  --fa--fa: \"\\f20b\\f20b\"; }\n\n.fa-ils {\n  --fa: \"\\f20b\";\n  --fa--fa: \"\\f20b\\f20b\"; }\n\n.fa-shekel {\n  --fa: \"\\f20b\";\n  --fa--fa: \"\\f20b\\f20b\"; }\n\n.fa-sheqel {\n  --fa: \"\\f20b\";\n  --fa--fa: \"\\f20b\\f20b\"; }\n\n.fa-sheqel-sign {\n  --fa: \"\\f20b\";\n  --fa--fa: \"\\f20b\\f20b\"; }\n\n.fa-map {\n  --fa: \"\\f279\";\n  --fa--fa: \"\\f279\\f279\"; }\n\n.fa-rocket {\n  --fa: \"\\f135\";\n  --fa--fa: \"\\f135\\f135\"; }\n\n.fa-photo-film {\n  --fa: \"\\f87c\";\n  --fa--fa: \"\\f87c\\f87c\"; }\n\n.fa-photo-video {\n  --fa: \"\\f87c\";\n  --fa--fa: \"\\f87c\\f87c\"; }\n\n.fa-folder-minus {\n  --fa: \"\\f65d\";\n  --fa--fa: \"\\f65d\\f65d\"; }\n\n.fa-hexagon-nodes-bolt {\n  --fa: \"\\e69a\";\n  --fa--fa: \"\\e69a\\e69a\"; }\n\n.fa-store {\n  --fa: \"\\f54e\";\n  --fa--fa: \"\\f54e\\f54e\"; }\n\n.fa-arrow-trend-up {\n  --fa: \"\\e098\";\n  --fa--fa: \"\\e098\\e098\"; }\n\n.fa-plug-circle-minus {\n  --fa: \"\\e55e\";\n  --fa--fa: \"\\e55e\\e55e\"; }\n\n.fa-sign-hanging {\n  --fa: \"\\f4d9\";\n  --fa--fa: \"\\f4d9\\f4d9\"; }\n\n.fa-sign {\n  --fa: \"\\f4d9\";\n  --fa--fa: \"\\f4d9\\f4d9\"; }\n\n.fa-bezier-curve {\n  --fa: \"\\f55b\";\n  --fa--fa: \"\\f55b\\f55b\"; }\n\n.fa-bell-slash {\n  --fa: \"\\f1f6\";\n  --fa--fa: \"\\f1f6\\f1f6\"; }\n\n.fa-tablet {\n  --fa: \"\\f3fb\";\n  --fa--fa: \"\\f3fb\\f3fb\"; }\n\n.fa-tablet-android {\n  --fa: \"\\f3fb\";\n  --fa--fa: \"\\f3fb\\f3fb\"; }\n\n.fa-school-flag {\n  --fa: \"\\e56e\";\n  --fa--fa: \"\\e56e\\e56e\"; }\n\n.fa-fill {\n  --fa: \"\\f575\";\n  --fa--fa: \"\\f575\\f575\"; }\n\n.fa-angle-up {\n  --fa: \"\\f106\";\n  --fa--fa: \"\\f106\\f106\"; }\n\n.fa-drumstick-bite {\n  --fa: \"\\f6d7\";\n  --fa--fa: \"\\f6d7\\f6d7\"; }\n\n.fa-holly-berry {\n  --fa: \"\\f7aa\";\n  --fa--fa: \"\\f7aa\\f7aa\"; }\n\n.fa-chevron-left {\n  --fa: \"\\f053\";\n  --fa--fa: \"\\f053\\f053\"; }\n\n.fa-bacteria {\n  --fa: \"\\e059\";\n  --fa--fa: \"\\e059\\e059\"; }\n\n.fa-hand-lizard {\n  --fa: \"\\f258\";\n  --fa--fa: \"\\f258\\f258\"; }\n\n.fa-notdef {\n  --fa: \"\\e1fe\";\n  --fa--fa: \"\\e1fe\\e1fe\"; }\n\n.fa-disease {\n  --fa: \"\\f7fa\";\n  --fa--fa: \"\\f7fa\\f7fa\"; }\n\n.fa-briefcase-medical {\n  --fa: \"\\f469\";\n  --fa--fa: \"\\f469\\f469\"; }\n\n.fa-genderless {\n  --fa: \"\\f22d\";\n  --fa--fa: \"\\f22d\\f22d\"; }\n\n.fa-chevron-right {\n  --fa: \"\\f054\";\n  --fa--fa: \"\\f054\\f054\"; }\n\n.fa-retweet {\n  --fa: \"\\f079\";\n  --fa--fa: \"\\f079\\f079\"; }\n\n.fa-car-rear {\n  --fa: \"\\f5de\";\n  --fa--fa: \"\\f5de\\f5de\"; }\n\n.fa-car-alt {\n  --fa: \"\\f5de\";\n  --fa--fa: \"\\f5de\\f5de\"; }\n\n.fa-pump-soap {\n  --fa: \"\\e06b\";\n  --fa--fa: \"\\e06b\\e06b\"; }\n\n.fa-video-slash {\n  --fa: \"\\f4e2\";\n  --fa--fa: \"\\f4e2\\f4e2\"; }\n\n.fa-battery-quarter {\n  --fa: \"\\f243\";\n  --fa--fa: \"\\f243\\f243\"; }\n\n.fa-battery-2 {\n  --fa: \"\\f243\";\n  --fa--fa: \"\\f243\\f243\"; }\n\n.fa-radio {\n  --fa: \"\\f8d7\";\n  --fa--fa: \"\\f8d7\\f8d7\"; }\n\n.fa-baby-carriage {\n  --fa: \"\\f77d\";\n  --fa--fa: \"\\f77d\\f77d\"; }\n\n.fa-carriage-baby {\n  --fa: \"\\f77d\";\n  --fa--fa: \"\\f77d\\f77d\"; }\n\n.fa-traffic-light {\n  --fa: \"\\f637\";\n  --fa--fa: \"\\f637\\f637\"; }\n\n.fa-thermometer {\n  --fa: \"\\f491\";\n  --fa--fa: \"\\f491\\f491\"; }\n\n.fa-vr-cardboard {\n  --fa: \"\\f729\";\n  --fa--fa: \"\\f729\\f729\"; }\n\n.fa-hand-middle-finger {\n  --fa: \"\\f806\";\n  --fa--fa: \"\\f806\\f806\"; }\n\n.fa-percent {\n  --fa: \"\\25\";\n  --fa--fa: \"\\25\\25\"; }\n\n.fa-percentage {\n  --fa: \"\\25\";\n  --fa--fa: \"\\25\\25\"; }\n\n.fa-truck-moving {\n  --fa: \"\\f4df\";\n  --fa--fa: \"\\f4df\\f4df\"; }\n\n.fa-glass-water-droplet {\n  --fa: \"\\e4f5\";\n  --fa--fa: \"\\e4f5\\e4f5\"; }\n\n.fa-display {\n  --fa: \"\\e163\";\n  --fa--fa: \"\\e163\\e163\"; }\n\n.fa-face-smile {\n  --fa: \"\\f118\";\n  --fa--fa: \"\\f118\\f118\"; }\n\n.fa-smile {\n  --fa: \"\\f118\";\n  --fa--fa: \"\\f118\\f118\"; }\n\n.fa-thumbtack {\n  --fa: \"\\f08d\";\n  --fa--fa: \"\\f08d\\f08d\"; }\n\n.fa-thumb-tack {\n  --fa: \"\\f08d\";\n  --fa--fa: \"\\f08d\\f08d\"; }\n\n.fa-trophy {\n  --fa: \"\\f091\";\n  --fa--fa: \"\\f091\\f091\"; }\n\n.fa-person-praying {\n  --fa: \"\\f683\";\n  --fa--fa: \"\\f683\\f683\"; }\n\n.fa-pray {\n  --fa: \"\\f683\";\n  --fa--fa: \"\\f683\\f683\"; }\n\n.fa-hammer {\n  --fa: \"\\f6e3\";\n  --fa--fa: \"\\f6e3\\f6e3\"; }\n\n.fa-hand-peace {\n  --fa: \"\\f25b\";\n  --fa--fa: \"\\f25b\\f25b\"; }\n\n.fa-rotate {\n  --fa: \"\\f2f1\";\n  --fa--fa: \"\\f2f1\\f2f1\"; }\n\n.fa-sync-alt {\n  --fa: \"\\f2f1\";\n  --fa--fa: \"\\f2f1\\f2f1\"; }\n\n.fa-spinner {\n  --fa: \"\\f110\";\n  --fa--fa: \"\\f110\\f110\"; }\n\n.fa-robot {\n  --fa: \"\\f544\";\n  --fa--fa: \"\\f544\\f544\"; }\n\n.fa-peace {\n  --fa: \"\\f67c\";\n  --fa--fa: \"\\f67c\\f67c\"; }\n\n.fa-gears {\n  --fa: \"\\f085\";\n  --fa--fa: \"\\f085\\f085\"; }\n\n.fa-cogs {\n  --fa: \"\\f085\";\n  --fa--fa: \"\\f085\\f085\"; }\n\n.fa-warehouse {\n  --fa: \"\\f494\";\n  --fa--fa: \"\\f494\\f494\"; }\n\n.fa-arrow-up-right-dots {\n  --fa: \"\\e4b7\";\n  --fa--fa: \"\\e4b7\\e4b7\"; }\n\n.fa-splotch {\n  --fa: \"\\f5bc\";\n  --fa--fa: \"\\f5bc\\f5bc\"; }\n\n.fa-face-grin-hearts {\n  --fa: \"\\f584\";\n  --fa--fa: \"\\f584\\f584\"; }\n\n.fa-grin-hearts {\n  --fa: \"\\f584\";\n  --fa--fa: \"\\f584\\f584\"; }\n\n.fa-dice-four {\n  --fa: \"\\f524\";\n  --fa--fa: \"\\f524\\f524\"; }\n\n.fa-sim-card {\n  --fa: \"\\f7c4\";\n  --fa--fa: \"\\f7c4\\f7c4\"; }\n\n.fa-transgender {\n  --fa: \"\\f225\";\n  --fa--fa: \"\\f225\\f225\"; }\n\n.fa-transgender-alt {\n  --fa: \"\\f225\";\n  --fa--fa: \"\\f225\\f225\"; }\n\n.fa-mercury {\n  --fa: \"\\f223\";\n  --fa--fa: \"\\f223\\f223\"; }\n\n.fa-arrow-turn-down {\n  --fa: \"\\f149\";\n  --fa--fa: \"\\f149\\f149\"; }\n\n.fa-level-down {\n  --fa: \"\\f149\";\n  --fa--fa: \"\\f149\\f149\"; }\n\n.fa-person-falling-burst {\n  --fa: \"\\e547\";\n  --fa--fa: \"\\e547\\e547\"; }\n\n.fa-award {\n  --fa: \"\\f559\";\n  --fa--fa: \"\\f559\\f559\"; }\n\n.fa-ticket-simple {\n  --fa: \"\\f3ff\";\n  --fa--fa: \"\\f3ff\\f3ff\"; }\n\n.fa-ticket-alt {\n  --fa: \"\\f3ff\";\n  --fa--fa: \"\\f3ff\\f3ff\"; }\n\n.fa-building {\n  --fa: \"\\f1ad\";\n  --fa--fa: \"\\f1ad\\f1ad\"; }\n\n.fa-angles-left {\n  --fa: \"\\f100\";\n  --fa--fa: \"\\f100\\f100\"; }\n\n.fa-angle-double-left {\n  --fa: \"\\f100\";\n  --fa--fa: \"\\f100\\f100\"; }\n\n.fa-qrcode {\n  --fa: \"\\f029\";\n  --fa--fa: \"\\f029\\f029\"; }\n\n.fa-clock-rotate-left {\n  --fa: \"\\f1da\";\n  --fa--fa: \"\\f1da\\f1da\"; }\n\n.fa-history {\n  --fa: \"\\f1da\";\n  --fa--fa: \"\\f1da\\f1da\"; }\n\n.fa-face-grin-beam-sweat {\n  --fa: \"\\f583\";\n  --fa--fa: \"\\f583\\f583\"; }\n\n.fa-grin-beam-sweat {\n  --fa: \"\\f583\";\n  --fa--fa: \"\\f583\\f583\"; }\n\n.fa-file-export {\n  --fa: \"\\f56e\";\n  --fa--fa: \"\\f56e\\f56e\"; }\n\n.fa-arrow-right-from-file {\n  --fa: \"\\f56e\";\n  --fa--fa: \"\\f56e\\f56e\"; }\n\n.fa-shield {\n  --fa: \"\\f132\";\n  --fa--fa: \"\\f132\\f132\"; }\n\n.fa-shield-blank {\n  --fa: \"\\f132\";\n  --fa--fa: \"\\f132\\f132\"; }\n\n.fa-arrow-up-short-wide {\n  --fa: \"\\f885\";\n  --fa--fa: \"\\f885\\f885\"; }\n\n.fa-sort-amount-up-alt {\n  --fa: \"\\f885\";\n  --fa--fa: \"\\f885\\f885\"; }\n\n.fa-comment-nodes {\n  --fa: \"\\e696\";\n  --fa--fa: \"\\e696\\e696\"; }\n\n.fa-house-medical {\n  --fa: \"\\e3b2\";\n  --fa--fa: \"\\e3b2\\e3b2\"; }\n\n.fa-golf-ball-tee {\n  --fa: \"\\f450\";\n  --fa--fa: \"\\f450\\f450\"; }\n\n.fa-golf-ball {\n  --fa: \"\\f450\";\n  --fa--fa: \"\\f450\\f450\"; }\n\n.fa-circle-chevron-left {\n  --fa: \"\\f137\";\n  --fa--fa: \"\\f137\\f137\"; }\n\n.fa-chevron-circle-left {\n  --fa: \"\\f137\";\n  --fa--fa: \"\\f137\\f137\"; }\n\n.fa-house-chimney-window {\n  --fa: \"\\e00d\";\n  --fa--fa: \"\\e00d\\e00d\"; }\n\n.fa-pen-nib {\n  --fa: \"\\f5ad\";\n  --fa--fa: \"\\f5ad\\f5ad\"; }\n\n.fa-tent-arrow-turn-left {\n  --fa: \"\\e580\";\n  --fa--fa: \"\\e580\\e580\"; }\n\n.fa-tents {\n  --fa: \"\\e582\";\n  --fa--fa: \"\\e582\\e582\"; }\n\n.fa-wand-magic {\n  --fa: \"\\f0d0\";\n  --fa--fa: \"\\f0d0\\f0d0\"; }\n\n.fa-magic {\n  --fa: \"\\f0d0\";\n  --fa--fa: \"\\f0d0\\f0d0\"; }\n\n.fa-dog {\n  --fa: \"\\f6d3\";\n  --fa--fa: \"\\f6d3\\f6d3\"; }\n\n.fa-carrot {\n  --fa: \"\\f787\";\n  --fa--fa: \"\\f787\\f787\"; }\n\n.fa-moon {\n  --fa: \"\\f186\";\n  --fa--fa: \"\\f186\\f186\"; }\n\n.fa-wine-glass-empty {\n  --fa: \"\\f5ce\";\n  --fa--fa: \"\\f5ce\\f5ce\"; }\n\n.fa-wine-glass-alt {\n  --fa: \"\\f5ce\";\n  --fa--fa: \"\\f5ce\\f5ce\"; }\n\n.fa-cheese {\n  --fa: \"\\f7ef\";\n  --fa--fa: \"\\f7ef\\f7ef\"; }\n\n.fa-yin-yang {\n  --fa: \"\\f6ad\";\n  --fa--fa: \"\\f6ad\\f6ad\"; }\n\n.fa-music {\n  --fa: \"\\f001\";\n  --fa--fa: \"\\f001\\f001\"; }\n\n.fa-code-commit {\n  --fa: \"\\f386\";\n  --fa--fa: \"\\f386\\f386\"; }\n\n.fa-temperature-low {\n  --fa: \"\\f76b\";\n  --fa--fa: \"\\f76b\\f76b\"; }\n\n.fa-person-biking {\n  --fa: \"\\f84a\";\n  --fa--fa: \"\\f84a\\f84a\"; }\n\n.fa-biking {\n  --fa: \"\\f84a\";\n  --fa--fa: \"\\f84a\\f84a\"; }\n\n.fa-broom {\n  --fa: \"\\f51a\";\n  --fa--fa: \"\\f51a\\f51a\"; }\n\n.fa-shield-heart {\n  --fa: \"\\e574\";\n  --fa--fa: \"\\e574\\e574\"; }\n\n.fa-gopuram {\n  --fa: \"\\f664\";\n  --fa--fa: \"\\f664\\f664\"; }\n\n.fa-earth-oceania {\n  --fa: \"\\e47b\";\n  --fa--fa: \"\\e47b\\e47b\"; }\n\n.fa-globe-oceania {\n  --fa: \"\\e47b\";\n  --fa--fa: \"\\e47b\\e47b\"; }\n\n.fa-square-xmark {\n  --fa: \"\\f2d3\";\n  --fa--fa: \"\\f2d3\\f2d3\"; }\n\n.fa-times-square {\n  --fa: \"\\f2d3\";\n  --fa--fa: \"\\f2d3\\f2d3\"; }\n\n.fa-xmark-square {\n  --fa: \"\\f2d3\";\n  --fa--fa: \"\\f2d3\\f2d3\"; }\n\n.fa-hashtag {\n  --fa: \"\\23\";\n  --fa--fa: \"\\23\\23\"; }\n\n.fa-up-right-and-down-left-from-center {\n  --fa: \"\\f424\";\n  --fa--fa: \"\\f424\\f424\"; }\n\n.fa-expand-alt {\n  --fa: \"\\f424\";\n  --fa--fa: \"\\f424\\f424\"; }\n\n.fa-oil-can {\n  --fa: \"\\f613\";\n  --fa--fa: \"\\f613\\f613\"; }\n\n.fa-t {\n  --fa: \"\\54\";\n  --fa--fa: \"\\54\\54\"; }\n\n.fa-hippo {\n  --fa: \"\\f6ed\";\n  --fa--fa: \"\\f6ed\\f6ed\"; }\n\n.fa-chart-column {\n  --fa: \"\\e0e3\";\n  --fa--fa: \"\\e0e3\\e0e3\"; }\n\n.fa-infinity {\n  --fa: \"\\f534\";\n  --fa--fa: \"\\f534\\f534\"; }\n\n.fa-vial-circle-check {\n  --fa: \"\\e596\";\n  --fa--fa: \"\\e596\\e596\"; }\n\n.fa-person-arrow-down-to-line {\n  --fa: \"\\e538\";\n  --fa--fa: \"\\e538\\e538\"; }\n\n.fa-voicemail {\n  --fa: \"\\f897\";\n  --fa--fa: \"\\f897\\f897\"; }\n\n.fa-fan {\n  --fa: \"\\f863\";\n  --fa--fa: \"\\f863\\f863\"; }\n\n.fa-person-walking-luggage {\n  --fa: \"\\e554\";\n  --fa--fa: \"\\e554\\e554\"; }\n\n.fa-up-down {\n  --fa: \"\\f338\";\n  --fa--fa: \"\\f338\\f338\"; }\n\n.fa-arrows-alt-v {\n  --fa: \"\\f338\";\n  --fa--fa: \"\\f338\\f338\"; }\n\n.fa-cloud-moon-rain {\n  --fa: \"\\f73c\";\n  --fa--fa: \"\\f73c\\f73c\"; }\n\n.fa-calendar {\n  --fa: \"\\f133\";\n  --fa--fa: \"\\f133\\f133\"; }\n\n.fa-trailer {\n  --fa: \"\\e041\";\n  --fa--fa: \"\\e041\\e041\"; }\n\n.fa-bahai {\n  --fa: \"\\f666\";\n  --fa--fa: \"\\f666\\f666\"; }\n\n.fa-haykal {\n  --fa: \"\\f666\";\n  --fa--fa: \"\\f666\\f666\"; }\n\n.fa-sd-card {\n  --fa: \"\\f7c2\";\n  --fa--fa: \"\\f7c2\\f7c2\"; }\n\n.fa-dragon {\n  --fa: \"\\f6d5\";\n  --fa--fa: \"\\f6d5\\f6d5\"; }\n\n.fa-shoe-prints {\n  --fa: \"\\f54b\";\n  --fa--fa: \"\\f54b\\f54b\"; }\n\n.fa-circle-plus {\n  --fa: \"\\f055\";\n  --fa--fa: \"\\f055\\f055\"; }\n\n.fa-plus-circle {\n  --fa: \"\\f055\";\n  --fa--fa: \"\\f055\\f055\"; }\n\n.fa-face-grin-tongue-wink {\n  --fa: \"\\f58b\";\n  --fa--fa: \"\\f58b\\f58b\"; }\n\n.fa-grin-tongue-wink {\n  --fa: \"\\f58b\";\n  --fa--fa: \"\\f58b\\f58b\"; }\n\n.fa-hand-holding {\n  --fa: \"\\f4bd\";\n  --fa--fa: \"\\f4bd\\f4bd\"; }\n\n.fa-plug-circle-exclamation {\n  --fa: \"\\e55d\";\n  --fa--fa: \"\\e55d\\e55d\"; }\n\n.fa-link-slash {\n  --fa: \"\\f127\";\n  --fa--fa: \"\\f127\\f127\"; }\n\n.fa-chain-broken {\n  --fa: \"\\f127\";\n  --fa--fa: \"\\f127\\f127\"; }\n\n.fa-chain-slash {\n  --fa: \"\\f127\";\n  --fa--fa: \"\\f127\\f127\"; }\n\n.fa-unlink {\n  --fa: \"\\f127\";\n  --fa--fa: \"\\f127\\f127\"; }\n\n.fa-clone {\n  --fa: \"\\f24d\";\n  --fa--fa: \"\\f24d\\f24d\"; }\n\n.fa-person-walking-arrow-loop-left {\n  --fa: \"\\e551\";\n  --fa--fa: \"\\e551\\e551\"; }\n\n.fa-arrow-up-z-a {\n  --fa: \"\\f882\";\n  --fa--fa: \"\\f882\\f882\"; }\n\n.fa-sort-alpha-up-alt {\n  --fa: \"\\f882\";\n  --fa--fa: \"\\f882\\f882\"; }\n\n.fa-fire-flame-curved {\n  --fa: \"\\f7e4\";\n  --fa--fa: \"\\f7e4\\f7e4\"; }\n\n.fa-fire-alt {\n  --fa: \"\\f7e4\";\n  --fa--fa: \"\\f7e4\\f7e4\"; }\n\n.fa-tornado {\n  --fa: \"\\f76f\";\n  --fa--fa: \"\\f76f\\f76f\"; }\n\n.fa-file-circle-plus {\n  --fa: \"\\e494\";\n  --fa--fa: \"\\e494\\e494\"; }\n\n.fa-book-quran {\n  --fa: \"\\f687\";\n  --fa--fa: \"\\f687\\f687\"; }\n\n.fa-quran {\n  --fa: \"\\f687\";\n  --fa--fa: \"\\f687\\f687\"; }\n\n.fa-anchor {\n  --fa: \"\\f13d\";\n  --fa--fa: \"\\f13d\\f13d\"; }\n\n.fa-border-all {\n  --fa: \"\\f84c\";\n  --fa--fa: \"\\f84c\\f84c\"; }\n\n.fa-face-angry {\n  --fa: \"\\f556\";\n  --fa--fa: \"\\f556\\f556\"; }\n\n.fa-angry {\n  --fa: \"\\f556\";\n  --fa--fa: \"\\f556\\f556\"; }\n\n.fa-cookie-bite {\n  --fa: \"\\f564\";\n  --fa--fa: \"\\f564\\f564\"; }\n\n.fa-arrow-trend-down {\n  --fa: \"\\e097\";\n  --fa--fa: \"\\e097\\e097\"; }\n\n.fa-rss {\n  --fa: \"\\f09e\";\n  --fa--fa: \"\\f09e\\f09e\"; }\n\n.fa-feed {\n  --fa: \"\\f09e\";\n  --fa--fa: \"\\f09e\\f09e\"; }\n\n.fa-draw-polygon {\n  --fa: \"\\f5ee\";\n  --fa--fa: \"\\f5ee\\f5ee\"; }\n\n.fa-scale-balanced {\n  --fa: \"\\f24e\";\n  --fa--fa: \"\\f24e\\f24e\"; }\n\n.fa-balance-scale {\n  --fa: \"\\f24e\";\n  --fa--fa: \"\\f24e\\f24e\"; }\n\n.fa-gauge-simple-high {\n  --fa: \"\\f62a\";\n  --fa--fa: \"\\f62a\\f62a\"; }\n\n.fa-tachometer {\n  --fa: \"\\f62a\";\n  --fa--fa: \"\\f62a\\f62a\"; }\n\n.fa-tachometer-fast {\n  --fa: \"\\f62a\";\n  --fa--fa: \"\\f62a\\f62a\"; }\n\n.fa-shower {\n  --fa: \"\\f2cc\";\n  --fa--fa: \"\\f2cc\\f2cc\"; }\n\n.fa-desktop {\n  --fa: \"\\f390\";\n  --fa--fa: \"\\f390\\f390\"; }\n\n.fa-desktop-alt {\n  --fa: \"\\f390\";\n  --fa--fa: \"\\f390\\f390\"; }\n\n.fa-m {\n  --fa: \"\\4d\";\n  --fa--fa: \"\\4d\\4d\"; }\n\n.fa-table-list {\n  --fa: \"\\f00b\";\n  --fa--fa: \"\\f00b\\f00b\"; }\n\n.fa-th-list {\n  --fa: \"\\f00b\";\n  --fa--fa: \"\\f00b\\f00b\"; }\n\n.fa-comment-sms {\n  --fa: \"\\f7cd\";\n  --fa--fa: \"\\f7cd\\f7cd\"; }\n\n.fa-sms {\n  --fa: \"\\f7cd\";\n  --fa--fa: \"\\f7cd\\f7cd\"; }\n\n.fa-book {\n  --fa: \"\\f02d\";\n  --fa--fa: \"\\f02d\\f02d\"; }\n\n.fa-user-plus {\n  --fa: \"\\f234\";\n  --fa--fa: \"\\f234\\f234\"; }\n\n.fa-check {\n  --fa: \"\\f00c\";\n  --fa--fa: \"\\f00c\\f00c\"; }\n\n.fa-battery-three-quarters {\n  --fa: \"\\f241\";\n  --fa--fa: \"\\f241\\f241\"; }\n\n.fa-battery-4 {\n  --fa: \"\\f241\";\n  --fa--fa: \"\\f241\\f241\"; }\n\n.fa-house-circle-check {\n  --fa: \"\\e509\";\n  --fa--fa: \"\\e509\\e509\"; }\n\n.fa-angle-left {\n  --fa: \"\\f104\";\n  --fa--fa: \"\\f104\\f104\"; }\n\n.fa-diagram-successor {\n  --fa: \"\\e47a\";\n  --fa--fa: \"\\e47a\\e47a\"; }\n\n.fa-truck-arrow-right {\n  --fa: \"\\e58b\";\n  --fa--fa: \"\\e58b\\e58b\"; }\n\n.fa-arrows-split-up-and-left {\n  --fa: \"\\e4bc\";\n  --fa--fa: \"\\e4bc\\e4bc\"; }\n\n.fa-hand-fist {\n  --fa: \"\\f6de\";\n  --fa--fa: \"\\f6de\\f6de\"; }\n\n.fa-fist-raised {\n  --fa: \"\\f6de\";\n  --fa--fa: \"\\f6de\\f6de\"; }\n\n.fa-cloud-moon {\n  --fa: \"\\f6c3\";\n  --fa--fa: \"\\f6c3\\f6c3\"; }\n\n.fa-briefcase {\n  --fa: \"\\f0b1\";\n  --fa--fa: \"\\f0b1\\f0b1\"; }\n\n.fa-person-falling {\n  --fa: \"\\e546\";\n  --fa--fa: \"\\e546\\e546\"; }\n\n.fa-image-portrait {\n  --fa: \"\\f3e0\";\n  --fa--fa: \"\\f3e0\\f3e0\"; }\n\n.fa-portrait {\n  --fa: \"\\f3e0\";\n  --fa--fa: \"\\f3e0\\f3e0\"; }\n\n.fa-user-tag {\n  --fa: \"\\f507\";\n  --fa--fa: \"\\f507\\f507\"; }\n\n.fa-rug {\n  --fa: \"\\e569\";\n  --fa--fa: \"\\e569\\e569\"; }\n\n.fa-earth-europe {\n  --fa: \"\\f7a2\";\n  --fa--fa: \"\\f7a2\\f7a2\"; }\n\n.fa-globe-europe {\n  --fa: \"\\f7a2\";\n  --fa--fa: \"\\f7a2\\f7a2\"; }\n\n.fa-cart-flatbed-suitcase {\n  --fa: \"\\f59d\";\n  --fa--fa: \"\\f59d\\f59d\"; }\n\n.fa-luggage-cart {\n  --fa: \"\\f59d\";\n  --fa--fa: \"\\f59d\\f59d\"; }\n\n.fa-rectangle-xmark {\n  --fa: \"\\f410\";\n  --fa--fa: \"\\f410\\f410\"; }\n\n.fa-rectangle-times {\n  --fa: \"\\f410\";\n  --fa--fa: \"\\f410\\f410\"; }\n\n.fa-times-rectangle {\n  --fa: \"\\f410\";\n  --fa--fa: \"\\f410\\f410\"; }\n\n.fa-window-close {\n  --fa: \"\\f410\";\n  --fa--fa: \"\\f410\\f410\"; }\n\n.fa-baht-sign {\n  --fa: \"\\e0ac\";\n  --fa--fa: \"\\e0ac\\e0ac\"; }\n\n.fa-book-open {\n  --fa: \"\\f518\";\n  --fa--fa: \"\\f518\\f518\"; }\n\n.fa-book-journal-whills {\n  --fa: \"\\f66a\";\n  --fa--fa: \"\\f66a\\f66a\"; }\n\n.fa-journal-whills {\n  --fa: \"\\f66a\";\n  --fa--fa: \"\\f66a\\f66a\"; }\n\n.fa-handcuffs {\n  --fa: \"\\e4f8\";\n  --fa--fa: \"\\e4f8\\e4f8\"; }\n\n.fa-triangle-exclamation {\n  --fa: \"\\f071\";\n  --fa--fa: \"\\f071\\f071\"; }\n\n.fa-exclamation-triangle {\n  --fa: \"\\f071\";\n  --fa--fa: \"\\f071\\f071\"; }\n\n.fa-warning {\n  --fa: \"\\f071\";\n  --fa--fa: \"\\f071\\f071\"; }\n\n.fa-database {\n  --fa: \"\\f1c0\";\n  --fa--fa: \"\\f1c0\\f1c0\"; }\n\n.fa-share {\n  --fa: \"\\f064\";\n  --fa--fa: \"\\f064\\f064\"; }\n\n.fa-mail-forward {\n  --fa: \"\\f064\";\n  --fa--fa: \"\\f064\\f064\"; }\n\n.fa-bottle-droplet {\n  --fa: \"\\e4c4\";\n  --fa--fa: \"\\e4c4\\e4c4\"; }\n\n.fa-mask-face {\n  --fa: \"\\e1d7\";\n  --fa--fa: \"\\e1d7\\e1d7\"; }\n\n.fa-hill-rockslide {\n  --fa: \"\\e508\";\n  --fa--fa: \"\\e508\\e508\"; }\n\n.fa-right-left {\n  --fa: \"\\f362\";\n  --fa--fa: \"\\f362\\f362\"; }\n\n.fa-exchange-alt {\n  --fa: \"\\f362\";\n  --fa--fa: \"\\f362\\f362\"; }\n\n.fa-paper-plane {\n  --fa: \"\\f1d8\";\n  --fa--fa: \"\\f1d8\\f1d8\"; }\n\n.fa-road-circle-exclamation {\n  --fa: \"\\e565\";\n  --fa--fa: \"\\e565\\e565\"; }\n\n.fa-dungeon {\n  --fa: \"\\f6d9\";\n  --fa--fa: \"\\f6d9\\f6d9\"; }\n\n.fa-align-right {\n  --fa: \"\\f038\";\n  --fa--fa: \"\\f038\\f038\"; }\n\n.fa-money-bill-1-wave {\n  --fa: \"\\f53b\";\n  --fa--fa: \"\\f53b\\f53b\"; }\n\n.fa-money-bill-wave-alt {\n  --fa: \"\\f53b\";\n  --fa--fa: \"\\f53b\\f53b\"; }\n\n.fa-life-ring {\n  --fa: \"\\f1cd\";\n  --fa--fa: \"\\f1cd\\f1cd\"; }\n\n.fa-hands {\n  --fa: \"\\f2a7\";\n  --fa--fa: \"\\f2a7\\f2a7\"; }\n\n.fa-sign-language {\n  --fa: \"\\f2a7\";\n  --fa--fa: \"\\f2a7\\f2a7\"; }\n\n.fa-signing {\n  --fa: \"\\f2a7\";\n  --fa--fa: \"\\f2a7\\f2a7\"; }\n\n.fa-calendar-day {\n  --fa: \"\\f783\";\n  --fa--fa: \"\\f783\\f783\"; }\n\n.fa-water-ladder {\n  --fa: \"\\f5c5\";\n  --fa--fa: \"\\f5c5\\f5c5\"; }\n\n.fa-ladder-water {\n  --fa: \"\\f5c5\";\n  --fa--fa: \"\\f5c5\\f5c5\"; }\n\n.fa-swimming-pool {\n  --fa: \"\\f5c5\";\n  --fa--fa: \"\\f5c5\\f5c5\"; }\n\n.fa-arrows-up-down {\n  --fa: \"\\f07d\";\n  --fa--fa: \"\\f07d\\f07d\"; }\n\n.fa-arrows-v {\n  --fa: \"\\f07d\";\n  --fa--fa: \"\\f07d\\f07d\"; }\n\n.fa-face-grimace {\n  --fa: \"\\f57f\";\n  --fa--fa: \"\\f57f\\f57f\"; }\n\n.fa-grimace {\n  --fa: \"\\f57f\";\n  --fa--fa: \"\\f57f\\f57f\"; }\n\n.fa-wheelchair-move {\n  --fa: \"\\e2ce\";\n  --fa--fa: \"\\e2ce\\e2ce\"; }\n\n.fa-wheelchair-alt {\n  --fa: \"\\e2ce\";\n  --fa--fa: \"\\e2ce\\e2ce\"; }\n\n.fa-turn-down {\n  --fa: \"\\f3be\";\n  --fa--fa: \"\\f3be\\f3be\"; }\n\n.fa-level-down-alt {\n  --fa: \"\\f3be\";\n  --fa--fa: \"\\f3be\\f3be\"; }\n\n.fa-person-walking-arrow-right {\n  --fa: \"\\e552\";\n  --fa--fa: \"\\e552\\e552\"; }\n\n.fa-square-envelope {\n  --fa: \"\\f199\";\n  --fa--fa: \"\\f199\\f199\"; }\n\n.fa-envelope-square {\n  --fa: \"\\f199\";\n  --fa--fa: \"\\f199\\f199\"; }\n\n.fa-dice {\n  --fa: \"\\f522\";\n  --fa--fa: \"\\f522\\f522\"; }\n\n.fa-bowling-ball {\n  --fa: \"\\f436\";\n  --fa--fa: \"\\f436\\f436\"; }\n\n.fa-brain {\n  --fa: \"\\f5dc\";\n  --fa--fa: \"\\f5dc\\f5dc\"; }\n\n.fa-bandage {\n  --fa: \"\\f462\";\n  --fa--fa: \"\\f462\\f462\"; }\n\n.fa-band-aid {\n  --fa: \"\\f462\";\n  --fa--fa: \"\\f462\\f462\"; }\n\n.fa-calendar-minus {\n  --fa: \"\\f272\";\n  --fa--fa: \"\\f272\\f272\"; }\n\n.fa-circle-xmark {\n  --fa: \"\\f057\";\n  --fa--fa: \"\\f057\\f057\"; }\n\n.fa-times-circle {\n  --fa: \"\\f057\";\n  --fa--fa: \"\\f057\\f057\"; }\n\n.fa-xmark-circle {\n  --fa: \"\\f057\";\n  --fa--fa: \"\\f057\\f057\"; }\n\n.fa-gifts {\n  --fa: \"\\f79c\";\n  --fa--fa: \"\\f79c\\f79c\"; }\n\n.fa-hotel {\n  --fa: \"\\f594\";\n  --fa--fa: \"\\f594\\f594\"; }\n\n.fa-earth-asia {\n  --fa: \"\\f57e\";\n  --fa--fa: \"\\f57e\\f57e\"; }\n\n.fa-globe-asia {\n  --fa: \"\\f57e\";\n  --fa--fa: \"\\f57e\\f57e\"; }\n\n.fa-id-card-clip {\n  --fa: \"\\f47f\";\n  --fa--fa: \"\\f47f\\f47f\"; }\n\n.fa-id-card-alt {\n  --fa: \"\\f47f\";\n  --fa--fa: \"\\f47f\\f47f\"; }\n\n.fa-magnifying-glass-plus {\n  --fa: \"\\f00e\";\n  --fa--fa: \"\\f00e\\f00e\"; }\n\n.fa-search-plus {\n  --fa: \"\\f00e\";\n  --fa--fa: \"\\f00e\\f00e\"; }\n\n.fa-thumbs-up {\n  --fa: \"\\f164\";\n  --fa--fa: \"\\f164\\f164\"; }\n\n.fa-user-clock {\n  --fa: \"\\f4fd\";\n  --fa--fa: \"\\f4fd\\f4fd\"; }\n\n.fa-hand-dots {\n  --fa: \"\\f461\";\n  --fa--fa: \"\\f461\\f461\"; }\n\n.fa-allergies {\n  --fa: \"\\f461\";\n  --fa--fa: \"\\f461\\f461\"; }\n\n.fa-file-invoice {\n  --fa: \"\\f570\";\n  --fa--fa: \"\\f570\\f570\"; }\n\n.fa-window-minimize {\n  --fa: \"\\f2d1\";\n  --fa--fa: \"\\f2d1\\f2d1\"; }\n\n.fa-mug-saucer {\n  --fa: \"\\f0f4\";\n  --fa--fa: \"\\f0f4\\f0f4\"; }\n\n.fa-coffee {\n  --fa: \"\\f0f4\";\n  --fa--fa: \"\\f0f4\\f0f4\"; }\n\n.fa-brush {\n  --fa: \"\\f55d\";\n  --fa--fa: \"\\f55d\\f55d\"; }\n\n.fa-file-half-dashed {\n  --fa: \"\\e698\";\n  --fa--fa: \"\\e698\\e698\"; }\n\n.fa-mask {\n  --fa: \"\\f6fa\";\n  --fa--fa: \"\\f6fa\\f6fa\"; }\n\n.fa-magnifying-glass-minus {\n  --fa: \"\\f010\";\n  --fa--fa: \"\\f010\\f010\"; }\n\n.fa-search-minus {\n  --fa: \"\\f010\";\n  --fa--fa: \"\\f010\\f010\"; }\n\n.fa-ruler-vertical {\n  --fa: \"\\f548\";\n  --fa--fa: \"\\f548\\f548\"; }\n\n.fa-user-large {\n  --fa: \"\\f406\";\n  --fa--fa: \"\\f406\\f406\"; }\n\n.fa-user-alt {\n  --fa: \"\\f406\";\n  --fa--fa: \"\\f406\\f406\"; }\n\n.fa-train-tram {\n  --fa: \"\\e5b4\";\n  --fa--fa: \"\\e5b4\\e5b4\"; }\n\n.fa-user-nurse {\n  --fa: \"\\f82f\";\n  --fa--fa: \"\\f82f\\f82f\"; }\n\n.fa-syringe {\n  --fa: \"\\f48e\";\n  --fa--fa: \"\\f48e\\f48e\"; }\n\n.fa-cloud-sun {\n  --fa: \"\\f6c4\";\n  --fa--fa: \"\\f6c4\\f6c4\"; }\n\n.fa-stopwatch-20 {\n  --fa: \"\\e06f\";\n  --fa--fa: \"\\e06f\\e06f\"; }\n\n.fa-square-full {\n  --fa: \"\\f45c\";\n  --fa--fa: \"\\f45c\\f45c\"; }\n\n.fa-magnet {\n  --fa: \"\\f076\";\n  --fa--fa: \"\\f076\\f076\"; }\n\n.fa-jar {\n  --fa: \"\\e516\";\n  --fa--fa: \"\\e516\\e516\"; }\n\n.fa-note-sticky {\n  --fa: \"\\f249\";\n  --fa--fa: \"\\f249\\f249\"; }\n\n.fa-sticky-note {\n  --fa: \"\\f249\";\n  --fa--fa: \"\\f249\\f249\"; }\n\n.fa-bug-slash {\n  --fa: \"\\e490\";\n  --fa--fa: \"\\e490\\e490\"; }\n\n.fa-arrow-up-from-water-pump {\n  --fa: \"\\e4b6\";\n  --fa--fa: \"\\e4b6\\e4b6\"; }\n\n.fa-bone {\n  --fa: \"\\f5d7\";\n  --fa--fa: \"\\f5d7\\f5d7\"; }\n\n.fa-table-cells-row-unlock {\n  --fa: \"\\e691\";\n  --fa--fa: \"\\e691\\e691\"; }\n\n.fa-user-injured {\n  --fa: \"\\f728\";\n  --fa--fa: \"\\f728\\f728\"; }\n\n.fa-face-sad-tear {\n  --fa: \"\\f5b4\";\n  --fa--fa: \"\\f5b4\\f5b4\"; }\n\n.fa-sad-tear {\n  --fa: \"\\f5b4\";\n  --fa--fa: \"\\f5b4\\f5b4\"; }\n\n.fa-plane {\n  --fa: \"\\f072\";\n  --fa--fa: \"\\f072\\f072\"; }\n\n.fa-tent-arrows-down {\n  --fa: \"\\e581\";\n  --fa--fa: \"\\e581\\e581\"; }\n\n.fa-exclamation {\n  --fa: \"\\21\";\n  --fa--fa: \"\\21\\21\"; }\n\n.fa-arrows-spin {\n  --fa: \"\\e4bb\";\n  --fa--fa: \"\\e4bb\\e4bb\"; }\n\n.fa-print {\n  --fa: \"\\f02f\";\n  --fa--fa: \"\\f02f\\f02f\"; }\n\n.fa-turkish-lira-sign {\n  --fa: \"\\e2bb\";\n  --fa--fa: \"\\e2bb\\e2bb\"; }\n\n.fa-try {\n  --fa: \"\\e2bb\";\n  --fa--fa: \"\\e2bb\\e2bb\"; }\n\n.fa-turkish-lira {\n  --fa: \"\\e2bb\";\n  --fa--fa: \"\\e2bb\\e2bb\"; }\n\n.fa-dollar-sign {\n  --fa: \"\\24\";\n  --fa--fa: \"\\24\\24\"; }\n\n.fa-dollar {\n  --fa: \"\\24\";\n  --fa--fa: \"\\24\\24\"; }\n\n.fa-usd {\n  --fa: \"\\24\";\n  --fa--fa: \"\\24\\24\"; }\n\n.fa-x {\n  --fa: \"\\58\";\n  --fa--fa: \"\\58\\58\"; }\n\n.fa-magnifying-glass-dollar {\n  --fa: \"\\f688\";\n  --fa--fa: \"\\f688\\f688\"; }\n\n.fa-search-dollar {\n  --fa: \"\\f688\";\n  --fa--fa: \"\\f688\\f688\"; }\n\n.fa-users-gear {\n  --fa: \"\\f509\";\n  --fa--fa: \"\\f509\\f509\"; }\n\n.fa-users-cog {\n  --fa: \"\\f509\";\n  --fa--fa: \"\\f509\\f509\"; }\n\n.fa-person-military-pointing {\n  --fa: \"\\e54a\";\n  --fa--fa: \"\\e54a\\e54a\"; }\n\n.fa-building-columns {\n  --fa: \"\\f19c\";\n  --fa--fa: \"\\f19c\\f19c\"; }\n\n.fa-bank {\n  --fa: \"\\f19c\";\n  --fa--fa: \"\\f19c\\f19c\"; }\n\n.fa-institution {\n  --fa: \"\\f19c\";\n  --fa--fa: \"\\f19c\\f19c\"; }\n\n.fa-museum {\n  --fa: \"\\f19c\";\n  --fa--fa: \"\\f19c\\f19c\"; }\n\n.fa-university {\n  --fa: \"\\f19c\";\n  --fa--fa: \"\\f19c\\f19c\"; }\n\n.fa-umbrella {\n  --fa: \"\\f0e9\";\n  --fa--fa: \"\\f0e9\\f0e9\"; }\n\n.fa-trowel {\n  --fa: \"\\e589\";\n  --fa--fa: \"\\e589\\e589\"; }\n\n.fa-d {\n  --fa: \"\\44\";\n  --fa--fa: \"\\44\\44\"; }\n\n.fa-stapler {\n  --fa: \"\\e5af\";\n  --fa--fa: \"\\e5af\\e5af\"; }\n\n.fa-masks-theater {\n  --fa: \"\\f630\";\n  --fa--fa: \"\\f630\\f630\"; }\n\n.fa-theater-masks {\n  --fa: \"\\f630\";\n  --fa--fa: \"\\f630\\f630\"; }\n\n.fa-kip-sign {\n  --fa: \"\\e1c4\";\n  --fa--fa: \"\\e1c4\\e1c4\"; }\n\n.fa-hand-point-left {\n  --fa: \"\\f0a5\";\n  --fa--fa: \"\\f0a5\\f0a5\"; }\n\n.fa-handshake-simple {\n  --fa: \"\\f4c6\";\n  --fa--fa: \"\\f4c6\\f4c6\"; }\n\n.fa-handshake-alt {\n  --fa: \"\\f4c6\";\n  --fa--fa: \"\\f4c6\\f4c6\"; }\n\n.fa-jet-fighter {\n  --fa: \"\\f0fb\";\n  --fa--fa: \"\\f0fb\\f0fb\"; }\n\n.fa-fighter-jet {\n  --fa: \"\\f0fb\";\n  --fa--fa: \"\\f0fb\\f0fb\"; }\n\n.fa-square-share-nodes {\n  --fa: \"\\f1e1\";\n  --fa--fa: \"\\f1e1\\f1e1\"; }\n\n.fa-share-alt-square {\n  --fa: \"\\f1e1\";\n  --fa--fa: \"\\f1e1\\f1e1\"; }\n\n.fa-barcode {\n  --fa: \"\\f02a\";\n  --fa--fa: \"\\f02a\\f02a\"; }\n\n.fa-plus-minus {\n  --fa: \"\\e43c\";\n  --fa--fa: \"\\e43c\\e43c\"; }\n\n.fa-video {\n  --fa: \"\\f03d\";\n  --fa--fa: \"\\f03d\\f03d\"; }\n\n.fa-video-camera {\n  --fa: \"\\f03d\";\n  --fa--fa: \"\\f03d\\f03d\"; }\n\n.fa-graduation-cap {\n  --fa: \"\\f19d\";\n  --fa--fa: \"\\f19d\\f19d\"; }\n\n.fa-mortar-board {\n  --fa: \"\\f19d\";\n  --fa--fa: \"\\f19d\\f19d\"; }\n\n.fa-hand-holding-medical {\n  --fa: \"\\e05c\";\n  --fa--fa: \"\\e05c\\e05c\"; }\n\n.fa-person-circle-check {\n  --fa: \"\\e53e\";\n  --fa--fa: \"\\e53e\\e53e\"; }\n\n.fa-turn-up {\n  --fa: \"\\f3bf\";\n  --fa--fa: \"\\f3bf\\f3bf\"; }\n\n.fa-level-up-alt {\n  --fa: \"\\f3bf\";\n  --fa--fa: \"\\f3bf\\f3bf\"; }\n\n.sr-only,\n.fa-sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0; }\n\n.sr-only-focusable:not(:focus),\n.fa-sr-only-focusable:not(:focus) {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0; }\n:root, :host {\n  --fa-style-family-brands: 'Font Awesome 6 Brands';\n  --fa-font-brands: normal 400 1em/1 'Font Awesome 6 Brands'; }\n\n@font-face {\n  font-family: 'Font Awesome 6 Brands';\n  font-style: normal;\n  font-weight: 400;\n  font-display: block;\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") format(\"woff2\"), url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ") format(\"truetype\"); }\n\n.fab,\n.fa-brands {\n  font-weight: 400; }\n\n.fa-monero {\n  --fa: \"\\f3d0\"; }\n\n.fa-hooli {\n  --fa: \"\\f427\"; }\n\n.fa-yelp {\n  --fa: \"\\f1e9\"; }\n\n.fa-cc-visa {\n  --fa: \"\\f1f0\"; }\n\n.fa-lastfm {\n  --fa: \"\\f202\"; }\n\n.fa-shopware {\n  --fa: \"\\f5b5\"; }\n\n.fa-creative-commons-nc {\n  --fa: \"\\f4e8\"; }\n\n.fa-aws {\n  --fa: \"\\f375\"; }\n\n.fa-redhat {\n  --fa: \"\\f7bc\"; }\n\n.fa-yoast {\n  --fa: \"\\f2b1\"; }\n\n.fa-cloudflare {\n  --fa: \"\\e07d\"; }\n\n.fa-ups {\n  --fa: \"\\f7e0\"; }\n\n.fa-pixiv {\n  --fa: \"\\e640\"; }\n\n.fa-wpexplorer {\n  --fa: \"\\f2de\"; }\n\n.fa-dyalog {\n  --fa: \"\\f399\"; }\n\n.fa-bity {\n  --fa: \"\\f37a\"; }\n\n.fa-stackpath {\n  --fa: \"\\f842\"; }\n\n.fa-buysellads {\n  --fa: \"\\f20d\"; }\n\n.fa-first-order {\n  --fa: \"\\f2b0\"; }\n\n.fa-modx {\n  --fa: \"\\f285\"; }\n\n.fa-guilded {\n  --fa: \"\\e07e\"; }\n\n.fa-vnv {\n  --fa: \"\\f40b\"; }\n\n.fa-square-js {\n  --fa: \"\\f3b9\"; }\n\n.fa-js-square {\n  --fa: \"\\f3b9\"; }\n\n.fa-microsoft {\n  --fa: \"\\f3ca\"; }\n\n.fa-qq {\n  --fa: \"\\f1d6\"; }\n\n.fa-orcid {\n  --fa: \"\\f8d2\"; }\n\n.fa-java {\n  --fa: \"\\f4e4\"; }\n\n.fa-invision {\n  --fa: \"\\f7b0\"; }\n\n.fa-creative-commons-pd-alt {\n  --fa: \"\\f4ed\"; }\n\n.fa-centercode {\n  --fa: \"\\f380\"; }\n\n.fa-glide-g {\n  --fa: \"\\f2a6\"; }\n\n.fa-drupal {\n  --fa: \"\\f1a9\"; }\n\n.fa-jxl {\n  --fa: \"\\e67b\"; }\n\n.fa-dart-lang {\n  --fa: \"\\e693\"; }\n\n.fa-hire-a-helper {\n  --fa: \"\\f3b0\"; }\n\n.fa-creative-commons-by {\n  --fa: \"\\f4e7\"; }\n\n.fa-unity {\n  --fa: \"\\e049\"; }\n\n.fa-whmcs {\n  --fa: \"\\f40d\"; }\n\n.fa-rocketchat {\n  --fa: \"\\f3e8\"; }\n\n.fa-vk {\n  --fa: \"\\f189\"; }\n\n.fa-untappd {\n  --fa: \"\\f405\"; }\n\n.fa-mailchimp {\n  --fa: \"\\f59e\"; }\n\n.fa-css3-alt {\n  --fa: \"\\f38b\"; }\n\n.fa-square-reddit {\n  --fa: \"\\f1a2\"; }\n\n.fa-reddit-square {\n  --fa: \"\\f1a2\"; }\n\n.fa-vimeo-v {\n  --fa: \"\\f27d\"; }\n\n.fa-contao {\n  --fa: \"\\f26d\"; }\n\n.fa-square-font-awesome {\n  --fa: \"\\e5ad\"; }\n\n.fa-deskpro {\n  --fa: \"\\f38f\"; }\n\n.fa-brave {\n  --fa: \"\\e63c\"; }\n\n.fa-sistrix {\n  --fa: \"\\f3ee\"; }\n\n.fa-square-instagram {\n  --fa: \"\\e055\"; }\n\n.fa-instagram-square {\n  --fa: \"\\e055\"; }\n\n.fa-battle-net {\n  --fa: \"\\f835\"; }\n\n.fa-the-red-yeti {\n  --fa: \"\\f69d\"; }\n\n.fa-square-hacker-news {\n  --fa: \"\\f3af\"; }\n\n.fa-hacker-news-square {\n  --fa: \"\\f3af\"; }\n\n.fa-edge {\n  --fa: \"\\f282\"; }\n\n.fa-threads {\n  --fa: \"\\e618\"; }\n\n.fa-napster {\n  --fa: \"\\f3d2\"; }\n\n.fa-square-snapchat {\n  --fa: \"\\f2ad\"; }\n\n.fa-snapchat-square {\n  --fa: \"\\f2ad\"; }\n\n.fa-google-plus-g {\n  --fa: \"\\f0d5\"; }\n\n.fa-artstation {\n  --fa: \"\\f77a\"; }\n\n.fa-markdown {\n  --fa: \"\\f60f\"; }\n\n.fa-sourcetree {\n  --fa: \"\\f7d3\"; }\n\n.fa-google-plus {\n  --fa: \"\\f2b3\"; }\n\n.fa-diaspora {\n  --fa: \"\\f791\"; }\n\n.fa-foursquare {\n  --fa: \"\\f180\"; }\n\n.fa-stack-overflow {\n  --fa: \"\\f16c\"; }\n\n.fa-github-alt {\n  --fa: \"\\f113\"; }\n\n.fa-phoenix-squadron {\n  --fa: \"\\f511\"; }\n\n.fa-pagelines {\n  --fa: \"\\f18c\"; }\n\n.fa-algolia {\n  --fa: \"\\f36c\"; }\n\n.fa-red-river {\n  --fa: \"\\f3e3\"; }\n\n.fa-creative-commons-sa {\n  --fa: \"\\f4ef\"; }\n\n.fa-safari {\n  --fa: \"\\f267\"; }\n\n.fa-google {\n  --fa: \"\\f1a0\"; }\n\n.fa-square-font-awesome-stroke {\n  --fa: \"\\f35c\"; }\n\n.fa-font-awesome-alt {\n  --fa: \"\\f35c\"; }\n\n.fa-atlassian {\n  --fa: \"\\f77b\"; }\n\n.fa-linkedin-in {\n  --fa: \"\\f0e1\"; }\n\n.fa-digital-ocean {\n  --fa: \"\\f391\"; }\n\n.fa-nimblr {\n  --fa: \"\\f5a8\"; }\n\n.fa-chromecast {\n  --fa: \"\\f838\"; }\n\n.fa-evernote {\n  --fa: \"\\f839\"; }\n\n.fa-hacker-news {\n  --fa: \"\\f1d4\"; }\n\n.fa-creative-commons-sampling {\n  --fa: \"\\f4f0\"; }\n\n.fa-adversal {\n  --fa: \"\\f36a\"; }\n\n.fa-creative-commons {\n  --fa: \"\\f25e\"; }\n\n.fa-watchman-monitoring {\n  --fa: \"\\e087\"; }\n\n.fa-fonticons {\n  --fa: \"\\f280\"; }\n\n.fa-weixin {\n  --fa: \"\\f1d7\"; }\n\n.fa-shirtsinbulk {\n  --fa: \"\\f214\"; }\n\n.fa-codepen {\n  --fa: \"\\f1cb\"; }\n\n.fa-git-alt {\n  --fa: \"\\f841\"; }\n\n.fa-lyft {\n  --fa: \"\\f3c3\"; }\n\n.fa-rev {\n  --fa: \"\\f5b2\"; }\n\n.fa-windows {\n  --fa: \"\\f17a\"; }\n\n.fa-wizards-of-the-coast {\n  --fa: \"\\f730\"; }\n\n.fa-square-viadeo {\n  --fa: \"\\f2aa\"; }\n\n.fa-viadeo-square {\n  --fa: \"\\f2aa\"; }\n\n.fa-meetup {\n  --fa: \"\\f2e0\"; }\n\n.fa-centos {\n  --fa: \"\\f789\"; }\n\n.fa-adn {\n  --fa: \"\\f170\"; }\n\n.fa-cloudsmith {\n  --fa: \"\\f384\"; }\n\n.fa-opensuse {\n  --fa: \"\\e62b\"; }\n\n.fa-pied-piper-alt {\n  --fa: \"\\f1a8\"; }\n\n.fa-square-dribbble {\n  --fa: \"\\f397\"; }\n\n.fa-dribbble-square {\n  --fa: \"\\f397\"; }\n\n.fa-codiepie {\n  --fa: \"\\f284\"; }\n\n.fa-node {\n  --fa: \"\\f419\"; }\n\n.fa-mix {\n  --fa: \"\\f3cb\"; }\n\n.fa-steam {\n  --fa: \"\\f1b6\"; }\n\n.fa-cc-apple-pay {\n  --fa: \"\\f416\"; }\n\n.fa-scribd {\n  --fa: \"\\f28a\"; }\n\n.fa-debian {\n  --fa: \"\\e60b\"; }\n\n.fa-openid {\n  --fa: \"\\f19b\"; }\n\n.fa-instalod {\n  --fa: \"\\e081\"; }\n\n.fa-files-pinwheel {\n  --fa: \"\\e69f\"; }\n\n.fa-expeditedssl {\n  --fa: \"\\f23e\"; }\n\n.fa-sellcast {\n  --fa: \"\\f2da\"; }\n\n.fa-square-twitter {\n  --fa: \"\\f081\"; }\n\n.fa-twitter-square {\n  --fa: \"\\f081\"; }\n\n.fa-r-project {\n  --fa: \"\\f4f7\"; }\n\n.fa-delicious {\n  --fa: \"\\f1a5\"; }\n\n.fa-freebsd {\n  --fa: \"\\f3a4\"; }\n\n.fa-vuejs {\n  --fa: \"\\f41f\"; }\n\n.fa-accusoft {\n  --fa: \"\\f369\"; }\n\n.fa-ioxhost {\n  --fa: \"\\f208\"; }\n\n.fa-fonticons-fi {\n  --fa: \"\\f3a2\"; }\n\n.fa-app-store {\n  --fa: \"\\f36f\"; }\n\n.fa-cc-mastercard {\n  --fa: \"\\f1f1\"; }\n\n.fa-itunes-note {\n  --fa: \"\\f3b5\"; }\n\n.fa-golang {\n  --fa: \"\\e40f\"; }\n\n.fa-kickstarter {\n  --fa: \"\\f3bb\"; }\n\n.fa-square-kickstarter {\n  --fa: \"\\f3bb\"; }\n\n.fa-grav {\n  --fa: \"\\f2d6\"; }\n\n.fa-weibo {\n  --fa: \"\\f18a\"; }\n\n.fa-uncharted {\n  --fa: \"\\e084\"; }\n\n.fa-firstdraft {\n  --fa: \"\\f3a1\"; }\n\n.fa-square-youtube {\n  --fa: \"\\f431\"; }\n\n.fa-youtube-square {\n  --fa: \"\\f431\"; }\n\n.fa-wikipedia-w {\n  --fa: \"\\f266\"; }\n\n.fa-wpressr {\n  --fa: \"\\f3e4\"; }\n\n.fa-rendact {\n  --fa: \"\\f3e4\"; }\n\n.fa-angellist {\n  --fa: \"\\f209\"; }\n\n.fa-galactic-republic {\n  --fa: \"\\f50c\"; }\n\n.fa-nfc-directional {\n  --fa: \"\\e530\"; }\n\n.fa-skype {\n  --fa: \"\\f17e\"; }\n\n.fa-joget {\n  --fa: \"\\f3b7\"; }\n\n.fa-fedora {\n  --fa: \"\\f798\"; }\n\n.fa-stripe-s {\n  --fa: \"\\f42a\"; }\n\n.fa-meta {\n  --fa: \"\\e49b\"; }\n\n.fa-laravel {\n  --fa: \"\\f3bd\"; }\n\n.fa-hotjar {\n  --fa: \"\\f3b1\"; }\n\n.fa-bluetooth-b {\n  --fa: \"\\f294\"; }\n\n.fa-square-letterboxd {\n  --fa: \"\\e62e\"; }\n\n.fa-sticker-mule {\n  --fa: \"\\f3f7\"; }\n\n.fa-creative-commons-zero {\n  --fa: \"\\f4f3\"; }\n\n.fa-hips {\n  --fa: \"\\f452\"; }\n\n.fa-css {\n  --fa: \"\\e6a2\"; }\n\n.fa-behance {\n  --fa: \"\\f1b4\"; }\n\n.fa-reddit {\n  --fa: \"\\f1a1\"; }\n\n.fa-discord {\n  --fa: \"\\f392\"; }\n\n.fa-chrome {\n  --fa: \"\\f268\"; }\n\n.fa-app-store-ios {\n  --fa: \"\\f370\"; }\n\n.fa-cc-discover {\n  --fa: \"\\f1f2\"; }\n\n.fa-wpbeginner {\n  --fa: \"\\f297\"; }\n\n.fa-confluence {\n  --fa: \"\\f78d\"; }\n\n.fa-shoelace {\n  --fa: \"\\e60c\"; }\n\n.fa-mdb {\n  --fa: \"\\f8ca\"; }\n\n.fa-dochub {\n  --fa: \"\\f394\"; }\n\n.fa-accessible-icon {\n  --fa: \"\\f368\"; }\n\n.fa-ebay {\n  --fa: \"\\f4f4\"; }\n\n.fa-amazon {\n  --fa: \"\\f270\"; }\n\n.fa-unsplash {\n  --fa: \"\\e07c\"; }\n\n.fa-yarn {\n  --fa: \"\\f7e3\"; }\n\n.fa-square-steam {\n  --fa: \"\\f1b7\"; }\n\n.fa-steam-square {\n  --fa: \"\\f1b7\"; }\n\n.fa-500px {\n  --fa: \"\\f26e\"; }\n\n.fa-square-vimeo {\n  --fa: \"\\f194\"; }\n\n.fa-vimeo-square {\n  --fa: \"\\f194\"; }\n\n.fa-asymmetrik {\n  --fa: \"\\f372\"; }\n\n.fa-font-awesome {\n  --fa: \"\\f2b4\"; }\n\n.fa-font-awesome-flag {\n  --fa: \"\\f2b4\"; }\n\n.fa-font-awesome-logo-full {\n  --fa: \"\\f2b4\"; }\n\n.fa-gratipay {\n  --fa: \"\\f184\"; }\n\n.fa-apple {\n  --fa: \"\\f179\"; }\n\n.fa-hive {\n  --fa: \"\\e07f\"; }\n\n.fa-gitkraken {\n  --fa: \"\\f3a6\"; }\n\n.fa-keybase {\n  --fa: \"\\f4f5\"; }\n\n.fa-apple-pay {\n  --fa: \"\\f415\"; }\n\n.fa-padlet {\n  --fa: \"\\e4a0\"; }\n\n.fa-amazon-pay {\n  --fa: \"\\f42c\"; }\n\n.fa-square-github {\n  --fa: \"\\f092\"; }\n\n.fa-github-square {\n  --fa: \"\\f092\"; }\n\n.fa-stumbleupon {\n  --fa: \"\\f1a4\"; }\n\n.fa-fedex {\n  --fa: \"\\f797\"; }\n\n.fa-phoenix-framework {\n  --fa: \"\\f3dc\"; }\n\n.fa-shopify {\n  --fa: \"\\e057\"; }\n\n.fa-neos {\n  --fa: \"\\f612\"; }\n\n.fa-square-threads {\n  --fa: \"\\e619\"; }\n\n.fa-hackerrank {\n  --fa: \"\\f5f7\"; }\n\n.fa-researchgate {\n  --fa: \"\\f4f8\"; }\n\n.fa-swift {\n  --fa: \"\\f8e1\"; }\n\n.fa-angular {\n  --fa: \"\\f420\"; }\n\n.fa-speakap {\n  --fa: \"\\f3f3\"; }\n\n.fa-angrycreative {\n  --fa: \"\\f36e\"; }\n\n.fa-y-combinator {\n  --fa: \"\\f23b\"; }\n\n.fa-empire {\n  --fa: \"\\f1d1\"; }\n\n.fa-envira {\n  --fa: \"\\f299\"; }\n\n.fa-google-scholar {\n  --fa: \"\\e63b\"; }\n\n.fa-square-gitlab {\n  --fa: \"\\e5ae\"; }\n\n.fa-gitlab-square {\n  --fa: \"\\e5ae\"; }\n\n.fa-studiovinari {\n  --fa: \"\\f3f8\"; }\n\n.fa-pied-piper {\n  --fa: \"\\f2ae\"; }\n\n.fa-wordpress {\n  --fa: \"\\f19a\"; }\n\n.fa-product-hunt {\n  --fa: \"\\f288\"; }\n\n.fa-firefox {\n  --fa: \"\\f269\"; }\n\n.fa-linode {\n  --fa: \"\\f2b8\"; }\n\n.fa-goodreads {\n  --fa: \"\\f3a8\"; }\n\n.fa-square-odnoklassniki {\n  --fa: \"\\f264\"; }\n\n.fa-odnoklassniki-square {\n  --fa: \"\\f264\"; }\n\n.fa-jsfiddle {\n  --fa: \"\\f1cc\"; }\n\n.fa-sith {\n  --fa: \"\\f512\"; }\n\n.fa-themeisle {\n  --fa: \"\\f2b2\"; }\n\n.fa-page4 {\n  --fa: \"\\f3d7\"; }\n\n.fa-hashnode {\n  --fa: \"\\e499\"; }\n\n.fa-react {\n  --fa: \"\\f41b\"; }\n\n.fa-cc-paypal {\n  --fa: \"\\f1f4\"; }\n\n.fa-squarespace {\n  --fa: \"\\f5be\"; }\n\n.fa-cc-stripe {\n  --fa: \"\\f1f5\"; }\n\n.fa-creative-commons-share {\n  --fa: \"\\f4f2\"; }\n\n.fa-bitcoin {\n  --fa: \"\\f379\"; }\n\n.fa-keycdn {\n  --fa: \"\\f3ba\"; }\n\n.fa-opera {\n  --fa: \"\\f26a\"; }\n\n.fa-itch-io {\n  --fa: \"\\f83a\"; }\n\n.fa-umbraco {\n  --fa: \"\\f8e8\"; }\n\n.fa-galactic-senate {\n  --fa: \"\\f50d\"; }\n\n.fa-ubuntu {\n  --fa: \"\\f7df\"; }\n\n.fa-draft2digital {\n  --fa: \"\\f396\"; }\n\n.fa-stripe {\n  --fa: \"\\f429\"; }\n\n.fa-houzz {\n  --fa: \"\\f27c\"; }\n\n.fa-gg {\n  --fa: \"\\f260\"; }\n\n.fa-dhl {\n  --fa: \"\\f790\"; }\n\n.fa-square-pinterest {\n  --fa: \"\\f0d3\"; }\n\n.fa-pinterest-square {\n  --fa: \"\\f0d3\"; }\n\n.fa-xing {\n  --fa: \"\\f168\"; }\n\n.fa-blackberry {\n  --fa: \"\\f37b\"; }\n\n.fa-creative-commons-pd {\n  --fa: \"\\f4ec\"; }\n\n.fa-playstation {\n  --fa: \"\\f3df\"; }\n\n.fa-quinscape {\n  --fa: \"\\f459\"; }\n\n.fa-less {\n  --fa: \"\\f41d\"; }\n\n.fa-blogger-b {\n  --fa: \"\\f37d\"; }\n\n.fa-opencart {\n  --fa: \"\\f23d\"; }\n\n.fa-vine {\n  --fa: \"\\f1ca\"; }\n\n.fa-signal-messenger {\n  --fa: \"\\e663\"; }\n\n.fa-paypal {\n  --fa: \"\\f1ed\"; }\n\n.fa-gitlab {\n  --fa: \"\\f296\"; }\n\n.fa-typo3 {\n  --fa: \"\\f42b\"; }\n\n.fa-reddit-alien {\n  --fa: \"\\f281\"; }\n\n.fa-yahoo {\n  --fa: \"\\f19e\"; }\n\n.fa-dailymotion {\n  --fa: \"\\e052\"; }\n\n.fa-affiliatetheme {\n  --fa: \"\\f36b\"; }\n\n.fa-pied-piper-pp {\n  --fa: \"\\f1a7\"; }\n\n.fa-bootstrap {\n  --fa: \"\\f836\"; }\n\n.fa-odnoklassniki {\n  --fa: \"\\f263\"; }\n\n.fa-nfc-symbol {\n  --fa: \"\\e531\"; }\n\n.fa-mintbit {\n  --fa: \"\\e62f\"; }\n\n.fa-ethereum {\n  --fa: \"\\f42e\"; }\n\n.fa-speaker-deck {\n  --fa: \"\\f83c\"; }\n\n.fa-creative-commons-nc-eu {\n  --fa: \"\\f4e9\"; }\n\n.fa-patreon {\n  --fa: \"\\f3d9\"; }\n\n.fa-avianex {\n  --fa: \"\\f374\"; }\n\n.fa-ello {\n  --fa: \"\\f5f1\"; }\n\n.fa-gofore {\n  --fa: \"\\f3a7\"; }\n\n.fa-bimobject {\n  --fa: \"\\f378\"; }\n\n.fa-brave-reverse {\n  --fa: \"\\e63d\"; }\n\n.fa-facebook-f {\n  --fa: \"\\f39e\"; }\n\n.fa-square-google-plus {\n  --fa: \"\\f0d4\"; }\n\n.fa-google-plus-square {\n  --fa: \"\\f0d4\"; }\n\n.fa-web-awesome {\n  --fa: \"\\e682\"; }\n\n.fa-mandalorian {\n  --fa: \"\\f50f\"; }\n\n.fa-first-order-alt {\n  --fa: \"\\f50a\"; }\n\n.fa-osi {\n  --fa: \"\\f41a\"; }\n\n.fa-google-wallet {\n  --fa: \"\\f1ee\"; }\n\n.fa-d-and-d-beyond {\n  --fa: \"\\f6ca\"; }\n\n.fa-periscope {\n  --fa: \"\\f3da\"; }\n\n.fa-fulcrum {\n  --fa: \"\\f50b\"; }\n\n.fa-cloudscale {\n  --fa: \"\\f383\"; }\n\n.fa-forumbee {\n  --fa: \"\\f211\"; }\n\n.fa-mizuni {\n  --fa: \"\\f3cc\"; }\n\n.fa-schlix {\n  --fa: \"\\f3ea\"; }\n\n.fa-square-xing {\n  --fa: \"\\f169\"; }\n\n.fa-xing-square {\n  --fa: \"\\f169\"; }\n\n.fa-bandcamp {\n  --fa: \"\\f2d5\"; }\n\n.fa-wpforms {\n  --fa: \"\\f298\"; }\n\n.fa-cloudversify {\n  --fa: \"\\f385\"; }\n\n.fa-usps {\n  --fa: \"\\f7e1\"; }\n\n.fa-megaport {\n  --fa: \"\\f5a3\"; }\n\n.fa-magento {\n  --fa: \"\\f3c4\"; }\n\n.fa-spotify {\n  --fa: \"\\f1bc\"; }\n\n.fa-optin-monster {\n  --fa: \"\\f23c\"; }\n\n.fa-fly {\n  --fa: \"\\f417\"; }\n\n.fa-square-bluesky {\n  --fa: \"\\e6a3\"; }\n\n.fa-aviato {\n  --fa: \"\\f421\"; }\n\n.fa-itunes {\n  --fa: \"\\f3b4\"; }\n\n.fa-cuttlefish {\n  --fa: \"\\f38c\"; }\n\n.fa-blogger {\n  --fa: \"\\f37c\"; }\n\n.fa-flickr {\n  --fa: \"\\f16e\"; }\n\n.fa-viber {\n  --fa: \"\\f409\"; }\n\n.fa-soundcloud {\n  --fa: \"\\f1be\"; }\n\n.fa-digg {\n  --fa: \"\\f1a6\"; }\n\n.fa-tencent-weibo {\n  --fa: \"\\f1d5\"; }\n\n.fa-letterboxd {\n  --fa: \"\\e62d\"; }\n\n.fa-symfony {\n  --fa: \"\\f83d\"; }\n\n.fa-maxcdn {\n  --fa: \"\\f136\"; }\n\n.fa-etsy {\n  --fa: \"\\f2d7\"; }\n\n.fa-facebook-messenger {\n  --fa: \"\\f39f\"; }\n\n.fa-audible {\n  --fa: \"\\f373\"; }\n\n.fa-think-peaks {\n  --fa: \"\\f731\"; }\n\n.fa-bilibili {\n  --fa: \"\\e3d9\"; }\n\n.fa-erlang {\n  --fa: \"\\f39d\"; }\n\n.fa-x-twitter {\n  --fa: \"\\e61b\"; }\n\n.fa-cotton-bureau {\n  --fa: \"\\f89e\"; }\n\n.fa-dashcube {\n  --fa: \"\\f210\"; }\n\n.fa-42-group {\n  --fa: \"\\e080\"; }\n\n.fa-innosoft {\n  --fa: \"\\e080\"; }\n\n.fa-stack-exchange {\n  --fa: \"\\f18d\"; }\n\n.fa-elementor {\n  --fa: \"\\f430\"; }\n\n.fa-square-pied-piper {\n  --fa: \"\\e01e\"; }\n\n.fa-pied-piper-square {\n  --fa: \"\\e01e\"; }\n\n.fa-creative-commons-nd {\n  --fa: \"\\f4eb\"; }\n\n.fa-palfed {\n  --fa: \"\\f3d8\"; }\n\n.fa-superpowers {\n  --fa: \"\\f2dd\"; }\n\n.fa-resolving {\n  --fa: \"\\f3e7\"; }\n\n.fa-xbox {\n  --fa: \"\\f412\"; }\n\n.fa-square-web-awesome-stroke {\n  --fa: \"\\e684\"; }\n\n.fa-searchengin {\n  --fa: \"\\f3eb\"; }\n\n.fa-tiktok {\n  --fa: \"\\e07b\"; }\n\n.fa-square-facebook {\n  --fa: \"\\f082\"; }\n\n.fa-facebook-square {\n  --fa: \"\\f082\"; }\n\n.fa-renren {\n  --fa: \"\\f18b\"; }\n\n.fa-linux {\n  --fa: \"\\f17c\"; }\n\n.fa-glide {\n  --fa: \"\\f2a5\"; }\n\n.fa-linkedin {\n  --fa: \"\\f08c\"; }\n\n.fa-hubspot {\n  --fa: \"\\f3b2\"; }\n\n.fa-deploydog {\n  --fa: \"\\f38e\"; }\n\n.fa-twitch {\n  --fa: \"\\f1e8\"; }\n\n.fa-flutter {\n  --fa: \"\\e694\"; }\n\n.fa-ravelry {\n  --fa: \"\\f2d9\"; }\n\n.fa-mixer {\n  --fa: \"\\e056\"; }\n\n.fa-square-lastfm {\n  --fa: \"\\f203\"; }\n\n.fa-lastfm-square {\n  --fa: \"\\f203\"; }\n\n.fa-vimeo {\n  --fa: \"\\f40a\"; }\n\n.fa-mendeley {\n  --fa: \"\\f7b3\"; }\n\n.fa-uniregistry {\n  --fa: \"\\f404\"; }\n\n.fa-figma {\n  --fa: \"\\f799\"; }\n\n.fa-creative-commons-remix {\n  --fa: \"\\f4ee\"; }\n\n.fa-cc-amazon-pay {\n  --fa: \"\\f42d\"; }\n\n.fa-dropbox {\n  --fa: \"\\f16b\"; }\n\n.fa-instagram {\n  --fa: \"\\f16d\"; }\n\n.fa-cmplid {\n  --fa: \"\\e360\"; }\n\n.fa-upwork {\n  --fa: \"\\e641\"; }\n\n.fa-facebook {\n  --fa: \"\\f09a\"; }\n\n.fa-gripfire {\n  --fa: \"\\f3ac\"; }\n\n.fa-jedi-order {\n  --fa: \"\\f50e\"; }\n\n.fa-uikit {\n  --fa: \"\\f403\"; }\n\n.fa-fort-awesome-alt {\n  --fa: \"\\f3a3\"; }\n\n.fa-phabricator {\n  --fa: \"\\f3db\"; }\n\n.fa-ussunnah {\n  --fa: \"\\f407\"; }\n\n.fa-earlybirds {\n  --fa: \"\\f39a\"; }\n\n.fa-trade-federation {\n  --fa: \"\\f513\"; }\n\n.fa-autoprefixer {\n  --fa: \"\\f41c\"; }\n\n.fa-whatsapp {\n  --fa: \"\\f232\"; }\n\n.fa-square-upwork {\n  --fa: \"\\e67c\"; }\n\n.fa-slideshare {\n  --fa: \"\\f1e7\"; }\n\n.fa-google-play {\n  --fa: \"\\f3ab\"; }\n\n.fa-viadeo {\n  --fa: \"\\f2a9\"; }\n\n.fa-line {\n  --fa: \"\\f3c0\"; }\n\n.fa-google-drive {\n  --fa: \"\\f3aa\"; }\n\n.fa-servicestack {\n  --fa: \"\\f3ec\"; }\n\n.fa-simplybuilt {\n  --fa: \"\\f215\"; }\n\n.fa-bitbucket {\n  --fa: \"\\f171\"; }\n\n.fa-imdb {\n  --fa: \"\\f2d8\"; }\n\n.fa-deezer {\n  --fa: \"\\e077\"; }\n\n.fa-raspberry-pi {\n  --fa: \"\\f7bb\"; }\n\n.fa-jira {\n  --fa: \"\\f7b1\"; }\n\n.fa-docker {\n  --fa: \"\\f395\"; }\n\n.fa-screenpal {\n  --fa: \"\\e570\"; }\n\n.fa-bluetooth {\n  --fa: \"\\f293\"; }\n\n.fa-gitter {\n  --fa: \"\\f426\"; }\n\n.fa-d-and-d {\n  --fa: \"\\f38d\"; }\n\n.fa-microblog {\n  --fa: \"\\e01a\"; }\n\n.fa-cc-diners-club {\n  --fa: \"\\f24c\"; }\n\n.fa-gg-circle {\n  --fa: \"\\f261\"; }\n\n.fa-pied-piper-hat {\n  --fa: \"\\f4e5\"; }\n\n.fa-kickstarter-k {\n  --fa: \"\\f3bc\"; }\n\n.fa-yandex {\n  --fa: \"\\f413\"; }\n\n.fa-readme {\n  --fa: \"\\f4d5\"; }\n\n.fa-html5 {\n  --fa: \"\\f13b\"; }\n\n.fa-sellsy {\n  --fa: \"\\f213\"; }\n\n.fa-square-web-awesome {\n  --fa: \"\\e683\"; }\n\n.fa-sass {\n  --fa: \"\\f41e\"; }\n\n.fa-wirsindhandwerk {\n  --fa: \"\\e2d0\"; }\n\n.fa-wsh {\n  --fa: \"\\e2d0\"; }\n\n.fa-buromobelexperte {\n  --fa: \"\\f37f\"; }\n\n.fa-salesforce {\n  --fa: \"\\f83b\"; }\n\n.fa-octopus-deploy {\n  --fa: \"\\e082\"; }\n\n.fa-medapps {\n  --fa: \"\\f3c6\"; }\n\n.fa-ns8 {\n  --fa: \"\\f3d5\"; }\n\n.fa-pinterest-p {\n  --fa: \"\\f231\"; }\n\n.fa-apper {\n  --fa: \"\\f371\"; }\n\n.fa-fort-awesome {\n  --fa: \"\\f286\"; }\n\n.fa-waze {\n  --fa: \"\\f83f\"; }\n\n.fa-bluesky {\n  --fa: \"\\e671\"; }\n\n.fa-cc-jcb {\n  --fa: \"\\f24b\"; }\n\n.fa-snapchat {\n  --fa: \"\\f2ab\"; }\n\n.fa-snapchat-ghost {\n  --fa: \"\\f2ab\"; }\n\n.fa-fantasy-flight-games {\n  --fa: \"\\f6dc\"; }\n\n.fa-rust {\n  --fa: \"\\e07a\"; }\n\n.fa-wix {\n  --fa: \"\\f5cf\"; }\n\n.fa-square-behance {\n  --fa: \"\\f1b5\"; }\n\n.fa-behance-square {\n  --fa: \"\\f1b5\"; }\n\n.fa-supple {\n  --fa: \"\\f3f9\"; }\n\n.fa-webflow {\n  --fa: \"\\e65c\"; }\n\n.fa-rebel {\n  --fa: \"\\f1d0\"; }\n\n.fa-css3 {\n  --fa: \"\\f13c\"; }\n\n.fa-staylinked {\n  --fa: \"\\f3f5\"; }\n\n.fa-kaggle {\n  --fa: \"\\f5fa\"; }\n\n.fa-space-awesome {\n  --fa: \"\\e5ac\"; }\n\n.fa-deviantart {\n  --fa: \"\\f1bd\"; }\n\n.fa-cpanel {\n  --fa: \"\\f388\"; }\n\n.fa-goodreads-g {\n  --fa: \"\\f3a9\"; }\n\n.fa-square-git {\n  --fa: \"\\f1d2\"; }\n\n.fa-git-square {\n  --fa: \"\\f1d2\"; }\n\n.fa-square-tumblr {\n  --fa: \"\\f174\"; }\n\n.fa-tumblr-square {\n  --fa: \"\\f174\"; }\n\n.fa-trello {\n  --fa: \"\\f181\"; }\n\n.fa-creative-commons-nc-jp {\n  --fa: \"\\f4ea\"; }\n\n.fa-get-pocket {\n  --fa: \"\\f265\"; }\n\n.fa-perbyte {\n  --fa: \"\\e083\"; }\n\n.fa-grunt {\n  --fa: \"\\f3ad\"; }\n\n.fa-weebly {\n  --fa: \"\\f5cc\"; }\n\n.fa-connectdevelop {\n  --fa: \"\\f20e\"; }\n\n.fa-leanpub {\n  --fa: \"\\f212\"; }\n\n.fa-black-tie {\n  --fa: \"\\f27e\"; }\n\n.fa-themeco {\n  --fa: \"\\f5c6\"; }\n\n.fa-python {\n  --fa: \"\\f3e2\"; }\n\n.fa-android {\n  --fa: \"\\f17b\"; }\n\n.fa-bots {\n  --fa: \"\\e340\"; }\n\n.fa-free-code-camp {\n  --fa: \"\\f2c5\"; }\n\n.fa-hornbill {\n  --fa: \"\\f592\"; }\n\n.fa-js {\n  --fa: \"\\f3b8\"; }\n\n.fa-ideal {\n  --fa: \"\\e013\"; }\n\n.fa-git {\n  --fa: \"\\f1d3\"; }\n\n.fa-dev {\n  --fa: \"\\f6cc\"; }\n\n.fa-sketch {\n  --fa: \"\\f7c6\"; }\n\n.fa-yandex-international {\n  --fa: \"\\f414\"; }\n\n.fa-cc-amex {\n  --fa: \"\\f1f3\"; }\n\n.fa-uber {\n  --fa: \"\\f402\"; }\n\n.fa-github {\n  --fa: \"\\f09b\"; }\n\n.fa-php {\n  --fa: \"\\f457\"; }\n\n.fa-alipay {\n  --fa: \"\\f642\"; }\n\n.fa-youtube {\n  --fa: \"\\f167\"; }\n\n.fa-skyatlas {\n  --fa: \"\\f216\"; }\n\n.fa-firefox-browser {\n  --fa: \"\\e007\"; }\n\n.fa-replyd {\n  --fa: \"\\f3e6\"; }\n\n.fa-suse {\n  --fa: \"\\f7d6\"; }\n\n.fa-jenkins {\n  --fa: \"\\f3b6\"; }\n\n.fa-twitter {\n  --fa: \"\\f099\"; }\n\n.fa-rockrms {\n  --fa: \"\\f3e9\"; }\n\n.fa-pinterest {\n  --fa: \"\\f0d2\"; }\n\n.fa-buffer {\n  --fa: \"\\f837\"; }\n\n.fa-npm {\n  --fa: \"\\f3d4\"; }\n\n.fa-yammer {\n  --fa: \"\\f840\"; }\n\n.fa-btc {\n  --fa: \"\\f15a\"; }\n\n.fa-dribbble {\n  --fa: \"\\f17d\"; }\n\n.fa-stumbleupon-circle {\n  --fa: \"\\f1a3\"; }\n\n.fa-internet-explorer {\n  --fa: \"\\f26b\"; }\n\n.fa-stubber {\n  --fa: \"\\e5c7\"; }\n\n.fa-telegram {\n  --fa: \"\\f2c6\"; }\n\n.fa-telegram-plane {\n  --fa: \"\\f2c6\"; }\n\n.fa-old-republic {\n  --fa: \"\\f510\"; }\n\n.fa-odysee {\n  --fa: \"\\e5c6\"; }\n\n.fa-square-whatsapp {\n  --fa: \"\\f40c\"; }\n\n.fa-whatsapp-square {\n  --fa: \"\\f40c\"; }\n\n.fa-node-js {\n  --fa: \"\\f3d3\"; }\n\n.fa-edge-legacy {\n  --fa: \"\\e078\"; }\n\n.fa-slack {\n  --fa: \"\\f198\"; }\n\n.fa-slack-hash {\n  --fa: \"\\f198\"; }\n\n.fa-medrt {\n  --fa: \"\\f3c8\"; }\n\n.fa-usb {\n  --fa: \"\\f287\"; }\n\n.fa-tumblr {\n  --fa: \"\\f173\"; }\n\n.fa-vaadin {\n  --fa: \"\\f408\"; }\n\n.fa-quora {\n  --fa: \"\\f2c4\"; }\n\n.fa-square-x-twitter {\n  --fa: \"\\e61a\"; }\n\n.fa-reacteurope {\n  --fa: \"\\f75d\"; }\n\n.fa-medium {\n  --fa: \"\\f23a\"; }\n\n.fa-medium-m {\n  --fa: \"\\f23a\"; }\n\n.fa-amilia {\n  --fa: \"\\f36d\"; }\n\n.fa-mixcloud {\n  --fa: \"\\f289\"; }\n\n.fa-flipboard {\n  --fa: \"\\f44d\"; }\n\n.fa-viacoin {\n  --fa: \"\\f237\"; }\n\n.fa-critical-role {\n  --fa: \"\\f6c9\"; }\n\n.fa-sitrox {\n  --fa: \"\\e44a\"; }\n\n.fa-discourse {\n  --fa: \"\\f393\"; }\n\n.fa-joomla {\n  --fa: \"\\f1aa\"; }\n\n.fa-mastodon {\n  --fa: \"\\f4f6\"; }\n\n.fa-airbnb {\n  --fa: \"\\f834\"; }\n\n.fa-wolf-pack-battalion {\n  --fa: \"\\f514\"; }\n\n.fa-buy-n-large {\n  --fa: \"\\f8a6\"; }\n\n.fa-gulp {\n  --fa: \"\\f3ae\"; }\n\n.fa-creative-commons-sampling-plus {\n  --fa: \"\\f4f1\"; }\n\n.fa-strava {\n  --fa: \"\\f428\"; }\n\n.fa-ember {\n  --fa: \"\\f423\"; }\n\n.fa-canadian-maple-leaf {\n  --fa: \"\\f785\"; }\n\n.fa-teamspeak {\n  --fa: \"\\f4f9\"; }\n\n.fa-pushed {\n  --fa: \"\\f3e1\"; }\n\n.fa-wordpress-simple {\n  --fa: \"\\f411\"; }\n\n.fa-nutritionix {\n  --fa: \"\\f3d6\"; }\n\n.fa-wodu {\n  --fa: \"\\e088\"; }\n\n.fa-google-pay {\n  --fa: \"\\e079\"; }\n\n.fa-intercom {\n  --fa: \"\\f7af\"; }\n\n.fa-zhihu {\n  --fa: \"\\f63f\"; }\n\n.fa-korvue {\n  --fa: \"\\f42f\"; }\n\n.fa-pix {\n  --fa: \"\\e43a\"; }\n\n.fa-steam-symbol {\n  --fa: \"\\f3f6\"; }\n:root, :host {\n  --fa-style-family-classic: 'Font Awesome 6 Free';\n  --fa-font-regular: normal 400 1em/1 'Font Awesome 6 Free'; }\n\n@font-face {\n  font-family: 'Font Awesome 6 Free';\n  font-style: normal;\n  font-weight: 400;\n  font-display: block;\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + ") format(\"woff2\"), url(" + ___CSS_LOADER_URL_REPLACEMENT_3___ + ") format(\"truetype\"); }\n\n.far,\n.fa-regular {\n  font-weight: 400; }\n:root, :host {\n  --fa-style-family-classic: 'Font Awesome 6 Free';\n  --fa-font-solid: normal 900 1em/1 'Font Awesome 6 Free'; }\n\n@font-face {\n  font-family: 'Font Awesome 6 Free';\n  font-style: normal;\n  font-weight: 900;\n  font-display: block;\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_4___ + ") format(\"woff2\"), url(" + ___CSS_LOADER_URL_REPLACEMENT_5___ + ") format(\"truetype\"); }\n\n.fas,\n.fa-solid {\n  font-weight: 900; }\n@font-face {\n  font-family: 'Font Awesome 5 Brands';\n  font-display: block;\n  font-weight: 400;\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") format(\"woff2\"), url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ") format(\"truetype\"); }\n\n@font-face {\n  font-family: 'Font Awesome 5 Free';\n  font-display: block;\n  font-weight: 900;\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_4___ + ") format(\"woff2\"), url(" + ___CSS_LOADER_URL_REPLACEMENT_5___ + ") format(\"truetype\"); }\n\n@font-face {\n  font-family: 'Font Awesome 5 Free';\n  font-display: block;\n  font-weight: 400;\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + ") format(\"woff2\"), url(" + ___CSS_LOADER_URL_REPLACEMENT_3___ + ") format(\"truetype\"); }\n@font-face {\n  font-family: 'FontAwesome';\n  font-display: block;\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_4___ + ") format(\"woff2\"), url(" + ___CSS_LOADER_URL_REPLACEMENT_5___ + ") format(\"truetype\"); }\n\n@font-face {\n  font-family: 'FontAwesome';\n  font-display: block;\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") format(\"woff2\"), url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ") format(\"truetype\"); }\n\n@font-face {\n  font-family: 'FontAwesome';\n  font-display: block;\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_2___ + ") format(\"woff2\"), url(" + ___CSS_LOADER_URL_REPLACEMENT_3___ + ") format(\"truetype\");\n  unicode-range: U+F003,U+F006,U+F014,U+F016-F017,U+F01A-F01B,U+F01D,U+F022,U+F03E,U+F044,U+F046,U+F05C-F05D,U+F06E,U+F070,U+F087-F088,U+F08A,U+F094,U+F096-F097,U+F09D,U+F0A0,U+F0A2,U+F0A4-F0A7,U+F0C5,U+F0C7,U+F0E5-F0E6,U+F0EB,U+F0F6-F0F8,U+F10C,U+F114-F115,U+F118-F11A,U+F11C-F11D,U+F133,U+F147,U+F14E,U+F150-F152,U+F185-F186,U+F18E,U+F190-F192,U+F196,U+F1C1-F1C9,U+F1D9,U+F1DB,U+F1E3,U+F1EA,U+F1F7,U+F1F9,U+F20A,U+F247-F248,U+F24A,U+F24D,U+F255-F25B,U+F25D,U+F271-F274,U+F278,U+F27B,U+F28C,U+F28E,U+F29C,U+F2B5,U+F2B7,U+F2BA,U+F2BC,U+F2BE,U+F2C0-F2C1,U+F2C3,U+F2D0,U+F2D2,U+F2D4,U+F2DC; }\n\n@font-face {\n  font-family: 'FontAwesome';\n  font-display: block;\n  src: url(" + ___CSS_LOADER_URL_REPLACEMENT_6___ + ") format(\"woff2\"), url(" + ___CSS_LOADER_URL_REPLACEMENT_7___ + ") format(\"truetype\");\n  unicode-range: U+F041,U+F047,U+F065-F066,U+F07D-F07E,U+F080,U+F08B,U+F08E,U+F090,U+F09A,U+F0AC,U+F0AE,U+F0B2,U+F0D0,U+F0D6,U+F0E4,U+F0EC,U+F10A-F10B,U+F123,U+F13E,U+F148-F149,U+F14C,U+F156,U+F15E,U+F160-F161,U+F163,U+F175-F178,U+F195,U+F1F8,U+F219,U+F27A; }\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    // eslint-disable-next-line no-param-reassign
    options = {};
  } // eslint-disable-next-line no-underscore-dangle, no-param-reassign


  url = url && url.__esModule ? url.default : url;

  if (typeof url !== "string") {
    return url;
  } // If url is already wrapped in quotes, remove them


  if (/^['"].*['"]$/.test(url)) {
    // eslint-disable-next-line no-param-reassign
    url = url.slice(1, -1);
  }

  if (options.hash) {
    // eslint-disable-next-line no-param-reassign
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),

/***/ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.ttf":
/*!*******************************************************************************!*\
  !*** ./node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.ttf ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/fonts/vendor/@fortawesome/fontawesome-free/webfa-brands-400.ttf?26b80c8830bebf340211aab79e0af067");

/***/ }),

/***/ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2":
/*!*********************************************************************************!*\
  !*** ./node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2 ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/fonts/vendor/@fortawesome/fontawesome-free/webfa-brands-400.woff2?fdbb558523a380307689b232cae05ef0");

/***/ }),

/***/ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.ttf":
/*!********************************************************************************!*\
  !*** ./node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.ttf ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/fonts/vendor/@fortawesome/fontawesome-free/webfa-regular-400.ttf?05fdd87be89f7f8f0a1efd58005150bd");

/***/ }),

/***/ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff2":
/*!**********************************************************************************!*\
  !*** ./node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff2 ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/fonts/vendor/@fortawesome/fontawesome-free/webfa-regular-400.woff2?4f6a2dabee9c092d09b9f8a79805fe62");

/***/ }),

/***/ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf":
/*!******************************************************************************!*\
  !*** ./node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/fonts/vendor/@fortawesome/fontawesome-free/webfa-solid-900.ttf?ad1782c70927ebc5bc87e5b45773ab1f");

/***/ }),

/***/ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2":
/*!********************************************************************************!*\
  !*** ./node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2 ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/fonts/vendor/@fortawesome/fontawesome-free/webfa-solid-900.woff2?83a538a018a9e44b023af45844c80e9e");

/***/ }),

/***/ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-v4compatibility.ttf":
/*!************************************************************************************!*\
  !*** ./node_modules/@fortawesome/fontawesome-free/webfonts/fa-v4compatibility.ttf ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/fonts/vendor/@fortawesome/fontawesome-free/webfa-v4compatibility.ttf?fa86b3c85e77abbd2ebd088102a05ecf");

/***/ }),

/***/ "./node_modules/@fortawesome/fontawesome-free/webfonts/fa-v4compatibility.woff2":
/*!**************************************************************************************!*\
  !*** ./node_modules/@fortawesome/fontawesome-free/webfonts/fa-v4compatibility.woff2 ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("/fonts/vendor/@fortawesome/fontawesome-free/webfa-v4compatibility.woff2?c3ea317a0f10f201597f903cf6a81913");

/***/ }),

/***/ "./node_modules/lodash/lodash.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/lodash.js ***!
  \***************************************/
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.17.21';

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Error message constants. */
  var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.',
      FUNC_ERROR_TEXT = 'Expected a function',
      INVALID_TEMPL_VAR_ERROR_TEXT = 'Invalid `variable` option passed into `_.template`';

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** Used to compose bitmasks for cloning. */
  var CLONE_DEEP_FLAG = 1,
      CLONE_FLAT_FLAG = 2,
      CLONE_SYMBOLS_FLAG = 4;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG = 1,
      WRAP_BIND_KEY_FLAG = 2,
      WRAP_CURRY_BOUND_FLAG = 4,
      WRAP_CURRY_FLAG = 8,
      WRAP_CURRY_RIGHT_FLAG = 16,
      WRAP_PARTIAL_FLAG = 32,
      WRAP_PARTIAL_RIGHT_FLAG = 64,
      WRAP_ARY_FLAG = 128,
      WRAP_REARG_FLAG = 256,
      WRAP_FLIP_FLAG = 512;

  /** Used as default options for `_.truncate`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2,
      LAZY_WHILE_FLAG = 3;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_INTEGER = 1.7976931348623157e+308,
      NAN = 0 / 0;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295,
      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

  /** Used to associate wrap methods with their bit flags. */
  var wrapFlags = [
    ['ary', WRAP_ARY_FLAG],
    ['bind', WRAP_BIND_FLAG],
    ['bindKey', WRAP_BIND_KEY_FLAG],
    ['curry', WRAP_CURRY_FLAG],
    ['curryRight', WRAP_CURRY_RIGHT_FLAG],
    ['flip', WRAP_FLIP_FLAG],
    ['partial', WRAP_PARTIAL_FLAG],
    ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
    ['rearg', WRAP_REARG_FLAG]
  ];

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      asyncTag = '[object AsyncFunction]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      domExcTag = '[object DOMException]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      nullTag = '[object Null]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      proxyTag = '[object Proxy]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      undefinedTag = '[object Undefined]',
      weakMapTag = '[object WeakMap]',
      weakSetTag = '[object WeakSet]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
      reUnescapedHtml = /[&<>"']/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
      reHasRegExpChar = RegExp(reRegExpChar.source);

  /** Used to match leading whitespace. */
  var reTrimStart = /^\s+/;

  /** Used to match a single whitespace character. */
  var reWhitespace = /\s/;

  /** Used to match wrap detail comments. */
  var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
      reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
      reSplitDetails = /,? & /;

  /** Used to match words composed of alphanumeric characters. */
  var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

  /**
   * Used to validate the `validate` option in `_.template` variable.
   *
   * Forbids characters which could potentially change the meaning of the function argument definition:
   * - "()," (modification of function parameters)
   * - "=" (default value)
   * - "[]{}" (destructuring of function parameters)
   * - "/" (beginning of a comment)
   * - whitespace
   */
  var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Used to match
   * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to match Latin Unicode letters (excluding mathematical operators). */
  var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to compose unicode character classes. */
  var rsAstralRange = '\\ud800-\\udfff',
      rsComboMarksRange = '\\u0300-\\u036f',
      reComboHalfMarksRange = '\\ufe20-\\ufe2f',
      rsComboSymbolsRange = '\\u20d0-\\u20ff',
      rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
      rsDingbatRange = '\\u2700-\\u27bf',
      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
      rsPunctuationRange = '\\u2000-\\u206f',
      rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
      rsVarRange = '\\ufe0e\\ufe0f',
      rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

  /** Used to compose unicode capture groups. */
  var rsApos = "['\u2019]",
      rsAstral = '[' + rsAstralRange + ']',
      rsBreak = '[' + rsBreakRange + ']',
      rsCombo = '[' + rsComboRange + ']',
      rsDigits = '\\d+',
      rsDingbat = '[' + rsDingbatRange + ']',
      rsLower = '[' + rsLowerRange + ']',
      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
      rsFitz = '\\ud83c[\\udffb-\\udfff]',
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsUpper = '[' + rsUpperRange + ']',
      rsZWJ = '\\u200d';

  /** Used to compose unicode regexes. */
  var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
      rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
      rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
      rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
      reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
      rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

  /** Used to match apostrophes. */
  var reApos = RegExp(rsApos, 'g');

  /**
   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
   */
  var reComboMark = RegExp(rsCombo, 'g');

  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

  /** Used to match complex or compound words. */
  var reUnicodeWord = RegExp([
    rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
    rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
    rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
    rsUpper + '+' + rsOptContrUpper,
    rsOrdUpper,
    rsOrdLower,
    rsDigits,
    rsEmoji
  ].join('|'), 'g');

  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

  /** Used to detect strings that need a more robust regexp to match words. */
  var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'Buffer', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
    'Promise', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap',
    '_', 'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
  cloneableTags[boolTag] = cloneableTags[dateTag] =
  cloneableTags[float32Tag] = cloneableTags[float64Tag] =
  cloneableTags[int8Tag] = cloneableTags[int16Tag] =
  cloneableTags[int32Tag] = cloneableTags[mapTag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[setTag] =
  cloneableTags[stringTag] = cloneableTags[symbolTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map Latin Unicode letters to basic Latin letters. */
  var deburredLetters = {
    // Latin-1 Supplement block.
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss',
    // Latin Extended-A block.
    '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
    '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
    '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
    '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
    '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
    '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
    '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
    '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
    '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
    '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
    '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
    '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
    '\u0134': 'J',  '\u0135': 'j',
    '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
    '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
    '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
    '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
    '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
    '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
    '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
    '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
    '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
    '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
    '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
    '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
    '\u0163': 't',  '\u0165': 't', '\u0167': 't',
    '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
    '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
    '\u0174': 'W',  '\u0175': 'w',
    '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
    '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
    '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
    '\u0132': 'IJ', '\u0133': 'ij',
    '\u0152': 'Oe', '\u0153': 'oe',
    '\u0149': "'n", '\u017f': 's'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Built-in method references without a dependency on `root`. */
  var freeParseFloat = parseFloat,
      freeParseInt = parseInt;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Detect free variable `exports`. */
  var freeExports =  true && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule && freeModule.require && freeModule.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  /* Node.js helper references. */
  var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
      nodeIsDate = nodeUtil && nodeUtil.isDate,
      nodeIsMap = nodeUtil && nodeUtil.isMap,
      nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
      nodeIsSet = nodeUtil && nodeUtil.isSet,
      nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

  /*--------------------------------------------------------------------------*/

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /**
   * A specialized version of `baseAggregator` for arrays.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} setter The function to set `accumulator` values.
   * @param {Function} iteratee The iteratee to transform keys.
   * @param {Object} accumulator The initial aggregated object.
   * @returns {Function} Returns `accumulator`.
   */
  function arrayAggregator(array, setter, iteratee, accumulator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.forEachRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEachRight(array, iteratee) {
    var length = array == null ? 0 : array.length;

    while (length--) {
      if (iteratee(array[length], length, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.every` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`.
   */
  function arrayEvery(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf(array, value, 0) > -1;
  }

  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludesWith(array, value, comparator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array == null ? 0 : array.length;

    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.reduceRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the last element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduceRight(array, iteratee, accumulator, initAccum) {
    var length = array == null ? 0 : array.length;
    if (initAccum && length) {
      accumulator = array[--length];
    }
    while (length--) {
      accumulator = iteratee(accumulator, array[length], length, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets the size of an ASCII `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  var asciiSize = baseProperty('length');

  /**
   * Converts an ASCII `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function asciiToArray(string) {
    return string.split('');
  }

  /**
   * Splits an ASCII `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function asciiWords(string) {
    return string.match(reAsciiWord) || [];
  }

  /**
   * The base implementation of methods like `_.findKey` and `_.findLastKey`,
   * without support for iteratee shorthands, which iterates over `collection`
   * using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the found element or its key, else `undefined`.
   */
  function baseFindKey(collection, predicate, eachFunc) {
    var result;
    eachFunc(collection, function(value, key, collection) {
      if (predicate(value, key, collection)) {
        result = key;
        return false;
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    return value === value
      ? strictIndexOf(array, value, fromIndex)
      : baseFindIndex(array, baseIsNaN, fromIndex);
  }

  /**
   * This function is like `baseIndexOf` except that it accepts a comparator.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOfWith(array, value, fromIndex, comparator) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (comparator(array[index], value)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */
  function baseIsNaN(value) {
    return value !== value;
  }

  /**
   * The base implementation of `_.mean` and `_.meanBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the mean.
   */
  function baseMean(array, iteratee) {
    var length = array == null ? 0 : array.length;
    return length ? (baseSum(array, iteratee) / length) : NAN;
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.propertyOf` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyOf(object) {
    return function(key) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initAccum Specify using the first or last element of
   *  `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection) {
      accumulator = initAccum
        ? (initAccum = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * The base implementation of `_.sortBy` which uses `comparer` to define the
   * sort order of `array` and replaces criteria objects with their corresponding
   * values.
   *
   * @private
   * @param {Array} array The array to sort.
   * @param {Function} comparer The function to define sort order.
   * @returns {Array} Returns `array`.
   */
  function baseSortBy(array, comparer) {
    var length = array.length;

    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  /**
   * The base implementation of `_.sum` and `_.sumBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the sum.
   */
  function baseSum(array, iteratee) {
    var result,
        index = -1,
        length = array.length;

    while (++index < length) {
      var current = iteratee(array[index]);
      if (current !== undefined) {
        result = result === undefined ? current : (result + current);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
   * of key-value pairs for `object` corresponding to the property names of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the key-value pairs.
   */
  function baseToPairs(object, props) {
    return arrayMap(props, function(key) {
      return [key, object[key]];
    });
  }

  /**
   * The base implementation of `_.trim`.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} Returns the trimmed string.
   */
  function baseTrim(string) {
    return string
      ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
      : string;
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  /**
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */
  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1,
        length = strSymbols.length;

    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */
  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Gets the number of `placeholder` occurrences in `array`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} placeholder The placeholder to search for.
   * @returns {number} Returns the placeholder count.
   */
  function countHolders(array, placeholder) {
    var length = array.length,
        result = 0;

    while (length--) {
      if (array[length] === placeholder) {
        ++result;
      }
    }
    return result;
  }

  /**
   * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
   * letters to basic Latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  var deburrLetter = basePropertyOf(deburredLetters);

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  var escapeHtmlChar = basePropertyOf(htmlEscapes);

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Checks if `string` contains Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a symbol is found, else `false`.
   */
  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }

  /**
   * Checks if `string` contains a word composed of Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a word is found, else `false`.
   */
  function hasUnicodeWord(string) {
    return reHasUnicodeWord.test(string);
  }

  /**
   * Converts `iterator` to an array.
   *
   * @private
   * @param {Object} iterator The iterator to convert.
   * @returns {Array} Returns the converted array.
   */
  function iteratorToArray(iterator) {
    var data,
        result = [];

    while (!(data = iterator.next()).done) {
      result.push(data.value);
    }
    return result;
  }

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value === placeholder || value === PLACEHOLDER) {
        array[index] = PLACEHOLDER;
        result[resIndex++] = index;
      }
    }
    return result;
  }

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /**
   * Converts `set` to its value-value pairs.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the value-value pairs.
   */
  function setToPairs(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = [value, value];
    });
    return result;
  }

  /**
   * A specialized version of `_.indexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * A specialized version of `_.lastIndexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictLastIndexOf(array, value, fromIndex) {
    var index = fromIndex + 1;
    while (index--) {
      if (array[index] === value) {
        return index;
      }
    }
    return index;
  }

  /**
   * Gets the number of symbols in `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the string size.
   */
  function stringSize(string) {
    return hasUnicode(string)
      ? unicodeSize(string)
      : asciiSize(string);
  }

  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function stringToArray(string) {
    return hasUnicode(string)
      ? unicodeToArray(string)
      : asciiToArray(string);
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedEndIndex(string) {
    var index = string.length;

    while (index-- && reWhitespace.test(string.charAt(index))) {}
    return index;
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

  /**
   * Gets the size of a Unicode `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  function unicodeSize(string) {
    var result = reUnicode.lastIndex = 0;
    while (reUnicode.test(string)) {
      ++result;
    }
    return result;
  }

  /**
   * Converts a Unicode `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function unicodeToArray(string) {
    return string.match(reUnicode) || [];
  }

  /**
   * Splits a Unicode `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function unicodeWords(string) {
    return string.match(reUnicodeWord) || [];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the `context` object.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Util
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // Create a suped-up `defer` in Node.js.
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  var runInContext = (function runInContext(context) {
    context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));

    /** Built-in constructor references. */
    var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = context['__core-js_shared__'];

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /** Used to infer the `Object` constructor. */
    var objectCtorString = funcToString.call(Object);

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? context.Buffer : undefined,
        Symbol = context.Symbol,
        Uint8Array = context.Uint8Array,
        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
        getPrototype = overArg(Object.getPrototypeOf, Object),
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice,
        spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined,
        symIterator = Symbol ? Symbol.iterator : undefined,
        symToStringTag = Symbol ? Symbol.toStringTag : undefined;

    var defineProperty = (function() {
      try {
        var func = getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    /** Mocked built-ins. */
    var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout,
        ctxNow = Date && Date.now !== root.Date.now && Date.now,
        ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeFloor = Math.floor,
        nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
        nativeIsFinite = context.isFinite,
        nativeJoin = arrayProto.join,
        nativeKeys = overArg(Object.keys, Object),
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = Date.now,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random,
        nativeReverse = arrayProto.reverse;

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(context, 'DataView'),
        Map = getNative(context, 'Map'),
        Promise = getNative(context, 'Promise'),
        Set = getNative(context, 'Set'),
        WeakMap = getNative(context, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Used to lookup unminified function names. */
    var realNames = {};

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
        symbolToString = symbolProto ? symbolProto.toString : undefined;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit method
     * chain sequences. Methods that operate on and return arrays, collections,
     * and functions can be chained together. Methods that retrieve a single value
     * or may return a primitive value will automatically end the chain sequence
     * and return the unwrapped value. Otherwise, the value must be unwrapped
     * with `_#value`.
     *
     * Explicit chain sequences, which must be unwrapped with `_#value`, may be
     * enabled using `_.chain`.
     *
     * The execution of chained methods is lazy, that is, it's deferred until
     * `_#value` is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion.
     * Shortcut fusion is an optimization to merge iteratee calls; this avoids
     * the creation of intermediate arrays and can greatly reduce the number of
     * iteratee executions. Sections of a chain sequence qualify for shortcut
     * fusion if the section is applied to an array and iteratees accept only
     * one argument. The heuristic for whether a section qualifies for shortcut
     * fusion is subject to change.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
     * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
     * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
     * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
     * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
     * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
     * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
     * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
     * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
     * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
     * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
     * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
     * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
     * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
     * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
     * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
     * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
     * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
     * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
     * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
     * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
     * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
     * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
     * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
     * `zipObject`, `zipObjectDeep`, and `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
     * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
     * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
     * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
     * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
     * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
     * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
     * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
     * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
     * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
     * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
     * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
     * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
     * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
     * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
     * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
     * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
     * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
     * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
     * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
     * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
     * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
     * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
     * `upperFirst`, `value`, and `words`
     *
     * @name _
     * @constructor
     * @category Seq
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // Returns an unwrapped value.
     * wrapped.reduce(_.add);
     * // => 6
     *
     * // Returns a wrapped value.
     * var squares = wrapped.map(square);
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} proto The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(proto) {
        if (!isObject(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object;
        object.prototype = undefined;
        return result;
      };
    }());

    /**
     * The function whose prototype chain sequence wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable explicit method chain sequences.
     */
    function LodashWrapper(value, chainAll) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__chain__ = !!chainAll;
      this.__index__ = 0;
      this.__values__ = undefined;
    }

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB) as well as ES2015 template strings. Change the
     * following template settings to use alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type {Object}
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type {string}
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type {Object}
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type {Function}
         */
        '_': lodash
      }
    };

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;
    lodash.prototype.constructor = lodash;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @constructor
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = MAX_ARRAY_LENGTH;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = copyArray(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = copyArray(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = copyArray(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || (!isRight && arrLength == length && takeCount == length)) {
        return baseWrapperValue(array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    // Ensure `LazyWrapper` is an instance of `baseLodash`.
    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values == null ? 0 : values.length;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }

    // Add methods to `SetCache`.
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache;
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value),
          isArg = !isArr && isArguments(value),
          isBuff = !isArr && !isArg && isBuffer(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.sample` for arrays.
     *
     * @private
     * @param {Array} array The array to sample.
     * @returns {*} Returns the random element.
     */
    function arraySample(array) {
      var length = array.length;
      return length ? array[baseRandom(0, length - 1)] : undefined;
    }

    /**
     * A specialized version of `_.sampleSize` for arrays.
     *
     * @private
     * @param {Array} array The array to sample.
     * @param {number} n The number of elements to sample.
     * @returns {Array} Returns the random elements.
     */
    function arraySampleSize(array, n) {
      return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
    }

    /**
     * A specialized version of `_.shuffle` for arrays.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    function arrayShuffle(array) {
      return shuffleSelf(copyArray(array));
    }

    /**
     * This function is like `assignValue` except that it doesn't assign
     * `undefined` values.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignMergeValue(object, key, value) {
      if ((value !== undefined && !eq(object[key], value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Aggregates elements of `collection` on `accumulator` with keys transformed
     * by `iteratee` and values set by `setter`.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform keys.
     * @param {Object} accumulator The initial aggregated object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseAggregator(collection, setter, iteratee, accumulator) {
      baseEach(collection, function(value, key, collection) {
        setter(accumulator, value, iteratee(value), collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }

    /**
     * The base implementation of `_.assignIn` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssignIn(object, source) {
      return object && copyObject(source, keysIn(source), object);
    }

    /**
     * The base implementation of `assignValue` and `assignMergeValue` without
     * value checks.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function baseAssignValue(object, key, value) {
      if (key == '__proto__' && defineProperty) {
        defineProperty(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }

    /**
     * The base implementation of `_.at` without support for individual paths.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {string[]} paths The property paths to pick.
     * @returns {Array} Returns the picked elements.
     */
    function baseAt(object, paths) {
      var index = -1,
          length = paths.length,
          result = Array(length),
          skip = object == null;

      while (++index < length) {
        result[index] = skip ? undefined : get(object, paths[index]);
      }
      return result;
    }

    /**
     * The base implementation of `_.clamp` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     */
    function baseClamp(number, lower, upper) {
      if (number === number) {
        if (upper !== undefined) {
          number = number <= upper ? number : upper;
        }
        if (lower !== undefined) {
          number = number >= lower ? number : lower;
        }
      }
      return number;
    }

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Deep clone
     *  2 - Flatten inherited properties
     *  4 - Clone symbols
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, bitmask, customizer, key, object, stack) {
      var result,
          isDeep = bitmask & CLONE_DEEP_FLAG,
          isFlat = bitmask & CLONE_FLAT_FLAG,
          isFull = bitmask & CLONE_SYMBOLS_FLAG;

      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = (isFlat || isFunc) ? {} : initCloneObject(value);
          if (!isDeep) {
            return isFlat
              ? copySymbolsIn(value, baseAssignIn(result, value))
              : copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      if (isSet(value)) {
        value.forEach(function(subValue) {
          result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
        });
      } else if (isMap(value)) {
        value.forEach(function(subValue, key) {
          result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
        });
      }

      var keysFunc = isFull
        ? (isFlat ? getAllKeysIn : getAllKeys)
        : (isFlat ? keysIn : keys);

      var props = isArr ? undefined : keysFunc(value);
      arrayEach(props || value, function(subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
      });
      return result;
    }

    /**
     * The base implementation of `_.conforms` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     */
    function baseConforms(source) {
      var props = keys(source);
      return function(object) {
        return baseConformsTo(object, source, props);
      };
    }

    /**
     * The base implementation of `_.conformsTo` which accepts `props` to check.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property predicates to conform to.
     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
     */
    function baseConformsTo(object, source, props) {
      var length = props.length;
      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (length--) {
        var key = props[length],
            predicate = source[key],
            value = object[key];

        if ((value === undefined && !(key in object)) || !predicate(value)) {
          return false;
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts `args`
     * to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Array} args The arguments to provide to `func`.
     * @returns {number|Object} Returns the timer id or timeout object.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * The base implementation of methods like `_.difference` without support
     * for excluding multiple arrays or iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          isCommon = true,
          length = array.length,
          result = [],
          valuesLength = values.length;

      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
      }
      if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
      }
      else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values = new SetCache(values);
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee == null ? value : iteratee(value);

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === computed) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (!includes(values, computed, comparator)) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * The base implementation of methods like `_.max` and `_.min` which accepts a
     * `comparator` to determine the extremum value.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The iteratee invoked per iteration.
     * @param {Function} comparator The comparator used to compare values.
     * @returns {*} Returns the extremum value.
     */
    function baseExtremum(array, iteratee, comparator) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index],
            current = iteratee(value);

        if (current != null && (computed === undefined
              ? (current === current && !isSymbol(current))
              : comparator(current, computed)
            )) {
          var computed = current,
              result = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill(array, value, start, end) {
      var length = array.length;

      start = toInteger(start);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : toInteger(end);
      if (end < 0) {
        end += length;
      }
      end = start > end ? 0 : toLength(end);
      while (start < end) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with support for restricting flattening.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {number} depth The maximum recursion depth.
     * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
     * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1,
          length = array.length;

      predicate || (predicate = isFlattenable);
      result || (result = []);

      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForOwn` which iterates over `object`
     * properties returned by `keysFunc` and invokes `iteratee` for each property.
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forOwn` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return object && baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from `props`.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the function names.
     */
    function baseFunctions(object, props) {
      return arrayFilter(props, function(key) {
        return isFunction(object[key]);
      });
    }

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path) {
      path = castPath(path, object);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[toKey(path[index++])];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * The base implementation of `_.gt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     */
    function baseGt(value, other) {
      return value > other;
    }

    /**
     * The base implementation of `_.has` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHas(object, key) {
      return object != null && hasOwnProperty.call(object, key);
    }

    /**
     * The base implementation of `_.hasIn` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHasIn(object, key) {
      return object != null && key in Object(object);
    }

    /**
     * The base implementation of `_.inRange` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to check.
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     */
    function baseInRange(number, start, end) {
      return number >= nativeMin(start, end) && number < nativeMax(start, end);
    }

    /**
     * The base implementation of methods like `_.intersection`, without support
     * for iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of shared values.
     */
    function baseIntersection(arrays, iteratee, comparator) {
      var includes = comparator ? arrayIncludesWith : arrayIncludes,
          length = arrays[0].length,
          othLength = arrays.length,
          othIndex = othLength,
          caches = Array(othLength),
          maxLength = Infinity,
          result = [];

      while (othIndex--) {
        var array = arrays[othIndex];
        if (othIndex && iteratee) {
          array = arrayMap(array, baseUnary(iteratee));
        }
        maxLength = nativeMin(array.length, maxLength);
        caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
          ? new SetCache(othIndex && array)
          : undefined;
      }
      array = arrays[0];

      var index = -1,
          seen = caches[0];

      outer:
      while (++index < length && result.length < maxLength) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (!(seen
              ? cacheHas(seen, computed)
              : includes(result, computed, comparator)
            )) {
          othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if (!(cache
                  ? cacheHas(cache, computed)
                  : includes(arrays[othIndex], computed, comparator))
                ) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.invert` and `_.invertBy` which inverts
     * `object` with values transformed by `iteratee` and set by `setter`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform values.
     * @param {Object} accumulator The initial inverted object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseInverter(object, setter, iteratee, accumulator) {
      baseForOwn(object, function(value, key, object) {
        setter(accumulator, iteratee(value), key, object);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.invoke` without support for individual
     * method arguments.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function baseInvoke(object, path, args) {
      path = castPath(path, object);
      object = parent(object, path);
      var func = object == null ? object : object[toKey(last(path))];
      return func == null ? undefined : apply(func, object, args);
    }

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }

    /**
     * The base implementation of `_.isArrayBuffer` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     */
    function baseIsArrayBuffer(value) {
      return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
    }

    /**
     * The base implementation of `_.isDate` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
     */
    function baseIsDate(value) {
      return isObjectLike(value) && baseGetTag(value) == dateTag;
    }

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Unordered comparison
     *  2 - Partial comparison
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = objIsArr ? arrayTag : getTag(object),
          othTag = othIsArr ? arrayTag : getTag(other);

      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;

      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack);
        return (objIsArr || isTypedArray(object))
          ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
          : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new Stack);
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack);
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }

    /**
     * The base implementation of `_.isMap` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     */
    function baseIsMap(value) {
      return isObjectLike(value) && getTag(value) == mapTag;
    }

    /**
     * The base implementation of `_.isMatch` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Array} matchData The property names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack;
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === undefined
                ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
                : result
              )) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * The base implementation of `_.isRegExp` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
     */
    function baseIsRegExp(value) {
      return isObjectLike(value) && baseGetTag(value) == regexpTag;
    }

    /**
     * The base implementation of `_.isSet` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     */
    function baseIsSet(value) {
      return isObjectLike(value) && getTag(value) == setTag;
    }

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return isObjectLike(value) &&
        isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }

    /**
     * The base implementation of `_.iteratee`.
     *
     * @private
     * @param {*} [value=_.identity] The value to convert to an iteratee.
     * @returns {Function} Returns the iteratee.
     */
    function baseIteratee(value) {
      // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
      // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
      if (typeof value == 'function') {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == 'object') {
        return isArray(value)
          ? baseMatchesProperty(value[0], value[1])
          : baseMatches(value);
      }
      return property(value);
    }

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeysIn(object) {
      if (!isObject(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object),
          result = [];

      for (var key in object) {
        if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.lt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     */
    function baseLt(value, other) {
      return value < other;
    }

    /**
     * The base implementation of `_.map` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatchesProperty(path, srcValue) {
      if (isKey(path) && isStrictComparable(srcValue)) {
        return matchesStrictComparable(toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get(object, path);
        return (objValue === undefined && objValue === srcValue)
          ? hasIn(object, path)
          : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
      };
    }

    /**
     * The base implementation of `_.merge` without support for multiple sources.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      baseFor(source, function(srcValue, key) {
        stack || (stack = new Stack);
        if (isObject(srcValue)) {
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        }
        else {
          var newValue = customizer
            ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
            : undefined;

          if (newValue === undefined) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      }, keysIn);
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = safeGet(object, key),
          srcValue = safeGet(source, key),
          stacked = stack.get(srcValue);

      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer
        ? customizer(objValue, srcValue, (key + ''), object, source, stack)
        : undefined;

      var isCommon = newValue === undefined;

      if (isCommon) {
        var isArr = isArray(srcValue),
            isBuff = !isArr && isBuffer(srcValue),
            isTyped = !isArr && !isBuff && isTypedArray(srcValue);

        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (isArray(objValue)) {
            newValue = objValue;
          }
          else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          }
          else if (isBuff) {
            isCommon = false;
            newValue = cloneBuffer(srcValue, true);
          }
          else if (isTyped) {
            isCommon = false;
            newValue = cloneTypedArray(srcValue, true);
          }
          else {
            newValue = [];
          }
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          newValue = objValue;
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          }
          else if (!isObject(objValue) || isFunction(objValue)) {
            newValue = initCloneObject(srcValue);
          }
        }
        else {
          isCommon = false;
        }
      }
      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack['delete'](srcValue);
      }
      assignMergeValue(object, key, newValue);
    }

    /**
     * The base implementation of `_.nth` which doesn't coerce arguments.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {number} n The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     */
    function baseNth(array, n) {
      var length = array.length;
      if (!length) {
        return;
      }
      n += n < 0 ? length : 0;
      return isIndex(n, length) ? array[n] : undefined;
    }

    /**
     * The base implementation of `_.orderBy` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {string[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseOrderBy(collection, iteratees, orders) {
      if (iteratees.length) {
        iteratees = arrayMap(iteratees, function(iteratee) {
          if (isArray(iteratee)) {
            return function(value) {
              return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
            }
          }
          return iteratee;
        });
      } else {
        iteratees = [identity];
      }

      var index = -1;
      iteratees = arrayMap(iteratees, baseUnary(getIteratee()));

      var result = baseMap(collection, function(value, key, collection) {
        var criteria = arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.pick` without support for individual
     * property identifiers.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} paths The property paths to pick.
     * @returns {Object} Returns the new object.
     */
    function basePick(object, paths) {
      return basePickBy(object, paths, function(value, path) {
        return hasIn(object, path);
      });
    }

    /**
     * The base implementation of  `_.pickBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} paths The property paths to pick.
     * @param {Function} predicate The function invoked per property.
     * @returns {Object} Returns the new object.
     */
    function basePickBy(object, paths, predicate) {
      var index = -1,
          length = paths.length,
          result = {};

      while (++index < length) {
        var path = paths[index],
            value = baseGet(object, path);

        if (predicate(value, path)) {
          baseSet(result, castPath(path, object), value);
        }
      }
      return result;
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }

    /**
     * The base implementation of `_.pullAllBy` without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     */
    function basePullAll(array, values, iteratee, comparator) {
      var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
          index = -1,
          length = values.length,
          seen = array;

      if (array === values) {
        values = copyArray(values);
      }
      if (iteratee) {
        seen = arrayMap(array, baseUnary(iteratee));
      }
      while (++index < length) {
        var fromIndex = 0,
            value = values[index],
            computed = iteratee ? iteratee(value) : value;

        while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
          if (seen !== array) {
            splice.call(seen, fromIndex, 1);
          }
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * indexes or capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0,
          lastIndex = length - 1;

      while (length--) {
        var index = indexes[length];
        if (length == lastIndex || index !== previous) {
          var previous = index;
          if (isIndex(index)) {
            splice.call(array, index, 1);
          } else {
            baseUnset(array, index);
          }
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for returning
     * floating-point numbers.
     *
     * @private
     * @param {number} lower The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the random number.
     */
    function baseRandom(lower, upper) {
      return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
    }

    /**
     * The base implementation of `_.range` and `_.rangeRight` which doesn't
     * coerce arguments.
     *
     * @private
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @param {number} step The value to increment or decrement by.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the range of numbers.
     */
    function baseRange(start, end, step, fromRight) {
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
      }
      return result;
    }

    /**
     * The base implementation of `_.repeat` which doesn't coerce arguments.
     *
     * @private
     * @param {string} string The string to repeat.
     * @param {number} n The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     */
    function baseRepeat(string, n) {
      var result = '';
      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        if (n) {
          string += string;
        }
      } while (n);

      return result;
    }

    /**
     * The base implementation of `_.rest` which doesn't validate or coerce arguments.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     */
    function baseRest(func, start) {
      return setToString(overRest(func, start, identity), func + '');
    }

    /**
     * The base implementation of `_.sample`.
     *
     * @private
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     */
    function baseSample(collection) {
      return arraySample(values(collection));
    }

    /**
     * The base implementation of `_.sampleSize` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to sample.
     * @param {number} n The number of elements to sample.
     * @returns {Array} Returns the random elements.
     */
    function baseSampleSize(collection, n) {
      var array = values(collection);
      return shuffleSelf(array, baseClamp(n, 0, array.length));
    }

    /**
     * The base implementation of `_.set`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseSet(object, path, value, customizer) {
      if (!isObject(object)) {
        return object;
      }
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = toKey(path[index]),
            newValue = value;

        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          return object;
        }

        if (index != lastIndex) {
          var objValue = nested[key];
          newValue = customizer ? customizer(objValue, key, nested) : undefined;
          if (newValue === undefined) {
            newValue = isObject(objValue)
              ? objValue
              : (isIndex(path[index + 1]) ? [] : {});
          }
        }
        assignValue(nested, key, newValue);
        nested = nested[key];
      }
      return object;
    }

    /**
     * The base implementation of `setData` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `setToString` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var baseSetToString = !defineProperty ? identity : function(func, string) {
      return defineProperty(func, 'toString', {
        'configurable': true,
        'enumerable': false,
        'value': constant(string),
        'writable': true
      });
    };

    /**
     * The base implementation of `_.shuffle`.
     *
     * @private
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    function baseShuffle(collection) {
      return shuffleSelf(values(collection));
    }

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
     * performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndex(array, value, retHighest) {
      var low = 0,
          high = array == null ? low : array.length;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if (computed !== null && !isSymbol(computed) &&
              (retHighest ? (computed <= value) : (computed < value))) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return baseSortedIndexBy(array, value, identity, retHighest);
    }

    /**
     * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
     * which invokes `iteratee` for `value` and each element of `array` to compute
     * their sort ranking. The iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The iteratee invoked per element.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndexBy(array, value, iteratee, retHighest) {
      var low = 0,
          high = array == null ? 0 : array.length;
      if (high === 0) {
        return 0;
      }

      value = iteratee(value);
      var valIsNaN = value !== value,
          valIsNull = value === null,
          valIsSymbol = isSymbol(value),
          valIsUndefined = value === undefined;

      while (low < high) {
        var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            othIsDefined = computed !== undefined,
            othIsNull = computed === null,
            othIsReflexive = computed === computed,
            othIsSymbol = isSymbol(computed);

        if (valIsNaN) {
          var setLow = retHighest || othIsReflexive;
        } else if (valIsUndefined) {
          setLow = othIsReflexive && (retHighest || othIsDefined);
        } else if (valIsNull) {
          setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
        } else if (valIsSymbol) {
          setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
        } else if (othIsNull || othIsSymbol) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * The base implementation of `_.sortedUniq` and `_.sortedUniqBy` without
     * support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseSortedUniq(array, iteratee) {
      var index = -1,
          length = array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        if (!index || !eq(computed, seen)) {
          var seen = computed;
          result[resIndex++] = value === 0 ? 0 : value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.toNumber` which doesn't ensure correct
     * conversions of binary, hexadecimal, or octal string values.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     */
    function baseToNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      return +value;
    }

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isArray(value)) {
        // Recursively convert values (susceptible to call stack limits).
        return arrayMap(value, baseToString) + '';
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * The base implementation of `_.uniqBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseUniq(array, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          length = array.length,
          isCommon = true,
          result = [],
          seen = result;

      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      }
      else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache;
      }
      else {
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (!includes(seen, computed, comparator)) {
          if (seen !== result) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.unset`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The property path to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     */
    function baseUnset(object, path) {
      path = castPath(path, object);
      object = parent(object, path);
      return object == null || delete object[toKey(last(path))];
    }

    /**
     * The base implementation of `_.update`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to update.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseUpdate(object, path, updater, customizer) {
      return baseSet(object, path, updater(baseGet(object, path)), customizer);
    }

    /**
     * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
     * without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile(array, predicate, isDrop, fromRight) {
      var length = array.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) &&
        predicate(array[index], index, array)) {}

      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to perform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      return arrayReduce(actions, function(result, action) {
        return action.func.apply(action.thisArg, arrayPush([result], action.args));
      }, result);
    }

    /**
     * The base implementation of methods like `_.xor`, without support for
     * iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of values.
     */
    function baseXor(arrays, iteratee, comparator) {
      var length = arrays.length;
      if (length < 2) {
        return length ? baseUniq(arrays[0]) : [];
      }
      var index = -1,
          result = Array(length);

      while (++index < length) {
        var array = arrays[index],
            othIndex = -1;

        while (++othIndex < length) {
          if (othIndex != index) {
            result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
          }
        }
      }
      return baseUniq(baseFlatten(result, 1), iteratee, comparator);
    }

    /**
     * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
     *
     * @private
     * @param {Array} props The property identifiers.
     * @param {Array} values The property values.
     * @param {Function} assignFunc The function to assign values.
     * @returns {Object} Returns the new object.
     */
    function baseZipObject(props, values, assignFunc) {
      var index = -1,
          length = props.length,
          valsLength = values.length,
          result = {};

      while (++index < length) {
        var value = index < valsLength ? values[index] : undefined;
        assignFunc(result, props[index], value);
      }
      return result;
    }

    /**
     * Casts `value` to an empty array if it's not an array like object.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array|Object} Returns the cast array-like object.
     */
    function castArrayLikeObject(value) {
      return isArrayLikeObject(value) ? value : [];
    }

    /**
     * Casts `value` to `identity` if it's not a function.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Function} Returns cast function.
     */
    function castFunction(value) {
      return typeof value == 'function' ? value : identity;
    }

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {Object} [object] The object to query keys on.
     * @returns {Array} Returns the cast property path array.
     */
    function castPath(value, object) {
      if (isArray(value)) {
        return value;
      }
      return isKey(value, object) ? [value] : stringToPath(toString(value));
    }

    /**
     * A `baseRest` alias which can be replaced with `identity` by module
     * replacement plugins.
     *
     * @private
     * @type {Function}
     * @param {Function} func The function to apply a rest parameter to.
     * @returns {Function} Returns the new function.
     */
    var castRest = baseRest;

    /**
     * Casts `array` to a slice if it's needed.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {number} start The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the cast slice.
     */
    function castSlice(array, start, end) {
      var length = array.length;
      end = end === undefined ? length : end;
      return (!start && end >= length) ? array : baseSlice(array, start, end);
    }

    /**
     * A simple wrapper around the global [`clearTimeout`](https://mdn.io/clearTimeout).
     *
     * @private
     * @param {number|Object} id The timer id or timeout object of the timer to clear.
     */
    var clearTimeout = ctxClearTimeout || function(id) {
      return root.clearTimeout(id);
    };

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length,
          result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

      buffer.copy(result);
      return result;
    }

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }

    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    /**
     * Compares values to sort them in ascending order.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {number} Returns the sort order indicator for `value`.
     */
    function compareAscending(value, other) {
      if (value !== other) {
        var valIsDefined = value !== undefined,
            valIsNull = value === null,
            valIsReflexive = value === value,
            valIsSymbol = isSymbol(value);

        var othIsDefined = other !== undefined,
            othIsNull = other === null,
            othIsReflexive = other === other,
            othIsSymbol = isSymbol(other);

        if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
            (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
            (valIsNull && othIsDefined && othIsReflexive) ||
            (!valIsDefined && othIsReflexive) ||
            !valIsReflexive) {
          return 1;
        }
        if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
            (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
            (othIsNull && valIsDefined && valIsReflexive) ||
            (!othIsDefined && valIsReflexive) ||
            !othIsReflexive) {
          return -1;
        }
      }
      return 0;
    }

    /**
     * Used by `_.orderBy` to compare multiple properties of a value to another
     * and stable sort them.
     *
     * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
     * specify an order of "desc" for descending or "asc" for ascending sort order
     * of corresponding values.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {boolean[]|string[]} orders The order to sort by for each property.
     * @returns {number} Returns the sort order indicator for `object`.
     */
    function compareMultiple(object, other, orders) {
      var index = -1,
          objCriteria = object.criteria,
          othCriteria = other.criteria,
          length = objCriteria.length,
          ordersLength = orders.length;

      while (++index < length) {
        var result = compareAscending(objCriteria[index], othCriteria[index]);
        if (result) {
          if (index >= ordersLength) {
            return result;
          }
          var order = orders[index];
          return result * (order == 'desc' ? -1 : 1);
        }
      }
      // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
      // that causes it, under certain circumstances, to provide the same value for
      // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
      // for more details.
      //
      // This also ensures a stable sort in V8 and other engines.
      // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
      return object.index - other.index;
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersLength = holders.length,
          leftIndex = -1,
          leftLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(leftLength + rangeLength),
          isUncurried = !isCurried;

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[holders[argsIndex]] = args[argsIndex];
        }
      }
      while (rangeLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersIndex = -1,
          holdersLength = holders.length,
          rightIndex = -1,
          rightLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(rangeLength + rightLength),
          isUncurried = !isCurried;

      while (++argsIndex < rangeLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[offset + holders[holdersIndex]] = args[argsIndex++];
        }
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : undefined;

        if (newValue === undefined) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }

    /**
     * Copies own symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }

    /**
     * Copies own and inherited symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbolsIn(source, object) {
      return copyObject(source, getSymbolsIn(source), object);
    }

    /**
     * Creates a function like `_.groupBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} [initializer] The accumulator object initializer.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee) {
        var func = isArray(collection) ? arrayAggregator : baseAggregator,
            accumulator = initializer ? initializer() : {};

        return func(collection, setter, getIteratee(iteratee, 2), accumulator);
      };
    }

    /**
     * Creates a function like `_.assign`.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return baseRest(function(object, sources) {
        var index = -1,
            length = sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined,
            guard = length > 2 ? sources[2] : undefined;

        customizer = (assigner.length > 3 && typeof customizer == 'function')
          ? (length--, customizer)
          : undefined;

        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length,
            index = fromRight ? length : -1,
            iterable = Object(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for methods like `_.forIn` and `_.forOwn`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1,
            iterable = Object(object),
            props = keysFunc(object),
            length = props.length;

        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` to invoke it with the optional `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createBind(func, bitmask, thisArg) {
      var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.lowerFirst`.
     *
     * @private
     * @param {string} methodName The name of the `String` case method to use.
     * @returns {Function} Returns the new case function.
     */
    function createCaseFirst(methodName) {
      return function(string) {
        string = toString(string);

        var strSymbols = hasUnicode(string)
          ? stringToArray(string)
          : undefined;

        var chr = strSymbols
          ? strSymbols[0]
          : string.charAt(0);

        var trailing = strSymbols
          ? castSlice(strSymbols, 1).join('')
          : string.slice(1);

        return chr[methodName]() + trailing;
      };
    }

    /**
     * Creates a function like `_.camelCase`.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtor(Ctor) {
      return function() {
        // Use a `switch` statement to work with class constructors. See
        // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // for more details.
        var args = arguments;
        switch (args.length) {
          case 0: return new Ctor;
          case 1: return new Ctor(args[0]);
          case 2: return new Ctor(args[0], args[1]);
          case 3: return new Ctor(args[0], args[1], args[2]);
          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 for more details.
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a function that wraps `func` to enable currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {number} arity The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCurry(func, bitmask, arity) {
      var Ctor = createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length,
            placeholder = getHolder(wrapper);

        while (index--) {
          args[index] = arguments[index];
        }
        var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
          ? []
          : replaceHolders(args, placeholder);

        length -= holders.length;
        if (length < arity) {
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, undefined,
            args, holders, undefined, undefined, arity - length);
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return apply(fn, this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.find` or `_.findLast` function.
     *
     * @private
     * @param {Function} findIndexFunc The function to find the collection index.
     * @returns {Function} Returns the new find function.
     */
    function createFind(findIndexFunc) {
      return function(collection, predicate, fromIndex) {
        var iterable = Object(collection);
        if (!isArrayLike(collection)) {
          var iteratee = getIteratee(predicate, 3);
          collection = keys(collection);
          predicate = function(key) { return iteratee(iterable[key], key, iterable); };
        }
        var index = findIndexFunc(collection, predicate, fromIndex);
        return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
      };
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow(fromRight) {
      return flatRest(function(funcs) {
        var length = funcs.length,
            index = length,
            prereq = LodashWrapper.prototype.thru;

        if (fromRight) {
          funcs.reverse();
        }
        while (index--) {
          var func = funcs[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
            var wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? index : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined;

          if (data && isLaziable(data[0]) &&
                data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) &&
                !data[4].length && data[9] == 1
              ) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func))
              ? wrapper[funcName]()
              : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 && isArray(value)) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      });
    }

    /**
     * Creates a function that wraps `func` to invoke it with optional `this`
     * binding of `thisArg`, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided
     *  to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & WRAP_ARY_FLAG,
          isBind = bitmask & WRAP_BIND_FLAG,
          isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
          isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
          isFlip = bitmask & WRAP_FLIP_FLAG,
          Ctor = isBindKey ? undefined : createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length;

        while (index--) {
          args[index] = arguments[index];
        }
        if (isCurried) {
          var placeholder = getHolder(wrapper),
              holdersCount = countHolders(args, placeholder);
        }
        if (partials) {
          args = composeArgs(args, partials, holders, isCurried);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
        }
        length -= holdersCount;
        if (isCurried && length < arity) {
          var newHolders = replaceHolders(args, placeholder);
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, thisArg,
            args, newHolders, argPos, ary, arity - length
          );
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        length = args.length;
        if (argPos) {
          args = reorder(args, argPos);
        } else if (isFlip && length > 1) {
          args.reverse();
        }
        if (isAry && ary < length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtor(fn);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.invertBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} toIteratee The function to resolve iteratees.
     * @returns {Function} Returns the new inverter function.
     */
    function createInverter(setter, toIteratee) {
      return function(object, iteratee) {
        return baseInverter(object, setter, toIteratee(iteratee), {});
      };
    }

    /**
     * Creates a function that performs a mathematical operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @param {number} [defaultValue] The value used for `undefined` arguments.
     * @returns {Function} Returns the new mathematical operation function.
     */
    function createMathOperation(operator, defaultValue) {
      return function(value, other) {
        var result;
        if (value === undefined && other === undefined) {
          return defaultValue;
        }
        if (value !== undefined) {
          result = value;
        }
        if (other !== undefined) {
          if (result === undefined) {
            return other;
          }
          if (typeof value == 'string' || typeof other == 'string') {
            value = baseToString(value);
            other = baseToString(other);
          } else {
            value = baseToNumber(value);
            other = baseToNumber(other);
          }
          result = operator(value, other);
        }
        return result;
      };
    }

    /**
     * Creates a function like `_.over`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over iteratees.
     * @returns {Function} Returns the new over function.
     */
    function createOver(arrayFunc) {
      return flatRest(function(iteratees) {
        iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
        return baseRest(function(args) {
          var thisArg = this;
          return arrayFunc(iteratees, function(iteratee) {
            return apply(iteratee, thisArg, args);
          });
        });
      });
    }

    /**
     * Creates the padding for `string` based on `length`. The `chars` string
     * is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {number} length The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padding for `string`.
     */
    function createPadding(length, chars) {
      chars = chars === undefined ? ' ' : baseToString(chars);

      var charsLength = chars.length;
      if (charsLength < 2) {
        return charsLength ? baseRepeat(chars, length) : chars;
      }
      var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
      return hasUnicode(chars)
        ? castSlice(stringToArray(result), 0, length).join('')
        : result.slice(0, length);
    }

    /**
     * Creates a function that wraps `func` to invoke it with the `this` binding
     * of `thisArg` and `partials` prepended to the arguments it receives.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to
     *  the new function.
     * @returns {Function} Returns the new wrapped function.
     */
    function createPartial(func, bitmask, thisArg, partials) {
      var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

      function wrapper() {
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength),
            fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        return apply(fn, isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.range` or `_.rangeRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new range function.
     */
    function createRange(fromRight) {
      return function(start, end, step) {
        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
          end = step = undefined;
        }
        // Ensure the sign of `-0` is preserved.
        start = toFinite(start);
        if (end === undefined) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
        return baseRange(start, end, step, fromRight);
      };
    }

    /**
     * Creates a function that performs a relational operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @returns {Function} Returns the new relational operation function.
     */
    function createRelationalOperation(operator) {
      return function(value, other) {
        if (!(typeof value == 'string' && typeof other == 'string')) {
          value = toNumber(value);
          other = toNumber(other);
        }
        return operator(value, other);
      };
    }

    /**
     * Creates a function that wraps `func` to continue currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {Function} wrapFunc The function to create the `func` wrapper.
     * @param {*} placeholder The placeholder value.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
      var isCurry = bitmask & WRAP_CURRY_FLAG,
          newHolders = isCurry ? holders : undefined,
          newHoldersRight = isCurry ? undefined : holders,
          newPartials = isCurry ? partials : undefined,
          newPartialsRight = isCurry ? undefined : partials;

      bitmask |= (isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG);
      bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);

      if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
        bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
      }
      var newData = [
        func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
        newHoldersRight, argPos, ary, arity
      ];

      var result = wrapFunc.apply(undefined, newData);
      if (isLaziable(func)) {
        setData(result, newData);
      }
      result.placeholder = placeholder;
      return setWrapToString(result, func, bitmask);
    }

    /**
     * Creates a function like `_.round`.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound(methodName) {
      var func = Math[methodName];
      return function(number, precision) {
        number = toNumber(number);
        precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
        if (precision && nativeIsFinite(number)) {
          // Shift with exponential notation to avoid floating-point issues.
          // See [MDN](https://mdn.io/round#Examples) for more details.
          var pair = (toString(number) + 'e').split('e'),
              value = func(pair[0] + 'e' + (+pair[1] + precision));

          pair = (toString(value) + 'e').split('e');
          return +(pair[0] + 'e' + (+pair[1] - precision));
        }
        return func(number);
      };
    }

    /**
     * Creates a set object of `values`.
     *
     * @private
     * @param {Array} values The values to add to the set.
     * @returns {Object} Returns the new set.
     */
    var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
      return new Set(values);
    };

    /**
     * Creates a `_.toPairs` or `_.toPairsIn` function.
     *
     * @private
     * @param {Function} keysFunc The function to get the keys of a given object.
     * @returns {Function} Returns the new pairs function.
     */
    function createToPairs(keysFunc) {
      return function(object) {
        var tag = getTag(object);
        if (tag == mapTag) {
          return mapToArray(object);
        }
        if (tag == setTag) {
          return setToPairs(object);
        }
        return baseToPairs(object, keysFunc(object));
      };
    }

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags.
     *    1 - `_.bind`
     *    2 - `_.bindKey`
     *    4 - `_.curry` or `_.curryRight` of a bound function
     *    8 - `_.curry`
     *   16 - `_.curryRight`
     *   32 - `_.partial`
     *   64 - `_.partialRight`
     *  128 - `_.rearg`
     *  256 - `_.ary`
     *  512 - `_.flip`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
      arity = arity === undefined ? arity : toInteger(arity);
      length -= holders ? holders.length : 0;

      if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined;
      }
      var data = isBindKey ? undefined : getData(func);

      var newData = [
        func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
        argPos, ary, arity
      ];

      if (data) {
        mergeData(newData, data);
      }
      func = newData[0];
      bitmask = newData[1];
      thisArg = newData[2];
      partials = newData[3];
      holders = newData[4];
      arity = newData[9] = newData[9] === undefined
        ? (isBindKey ? 0 : func.length)
        : nativeMax(newData[9] - length, 0);

      if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
        bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
      }
      if (!bitmask || bitmask == WRAP_BIND_FLAG) {
        var result = createBind(func, bitmask, thisArg);
      } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
        result = createCurry(func, bitmask, arity);
      } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
        result = createPartial(func, bitmask, thisArg, partials);
      } else {
        result = createHybrid.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setWrapToString(setter(result, newData), func, bitmask);
    }

    /**
     * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
     * of source objects to the destination object for all destination properties
     * that resolve to `undefined`.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to assign.
     * @param {Object} object The parent object of `objValue`.
     * @returns {*} Returns the value to assign.
     */
    function customDefaultsAssignIn(objValue, srcValue, key, object) {
      if (objValue === undefined ||
          (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
        return srcValue;
      }
      return objValue;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
     * objects into destination objects that are passed thru.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to merge.
     * @param {Object} object The parent object of `objValue`.
     * @param {Object} source The parent object of `srcValue`.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     * @returns {*} Returns the value to assign.
     */
    function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
      if (isObject(objValue) && isObject(srcValue)) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, objValue);
        baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
        stack['delete'](srcValue);
      }
      return objValue;
    }

    /**
     * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
     * objects.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {string} key The key of the property to inspect.
     * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
     */
    function customOmitClone(value) {
      return isPlainObject(value) ? undefined : value;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Check that cyclic values are equal.
      var arrStacked = stack.get(array);
      var othStacked = stack.get(other);
      if (arrStacked && othStacked) {
        return arrStacked == other && othStacked == array;
      }
      var index = -1,
          result = true,
          seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

      stack.set(array, other);
      stack.set(other, array);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (!arraySome(other, function(othValue, othIndex) {
                if (!cacheHas(seen, othIndex) &&
                    (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
            result = false;
            break;
          }
        } else if (!(
              arrValue === othValue ||
                equalFunc(arrValue, othValue, bitmask, customizer, stack)
            )) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if ((object.byteLength != other.byteLength) ||
              (object.byteOffset != other.byteOffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
        case numberTag:
          // Coerce booleans to `1` or `0` and dates to milliseconds.
          // Invalid dates are coerced to `NaN`.
          return eq(+object, +other);

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case mapTag:
          var convert = mapToArray;

        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;

          // Recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack['delete'](object);
          return result;

        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          objProps = getAllKeys(object),
          objLength = objProps.length,
          othProps = getAllKeys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      // Check that cyclic values are equal.
      var objStacked = stack.get(object);
      var othStacked = stack.get(other);
      if (objStacked && othStacked) {
        return objStacked == other && othStacked == object;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseRest` which flattens the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @returns {Function} Returns the new function.
     */
    function flatRest(func) {
      return setToString(overRest(func, undefined, flatten), func + '');
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /**
     * Creates an array of own and inherited enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeysIn(object) {
      return baseGetAllKeys(object, keysIn, getSymbolsIn);
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName(func) {
      var result = (func.name + ''),
          array = realNames[result],
          length = hasOwnProperty.call(realNames, result) ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the argument placeholder value for `func`.
     *
     * @private
     * @param {Function} func The function to inspect.
     * @returns {*} Returns the placeholder value.
     */
    function getHolder(func) {
      var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
      return object.placeholder;
    }

    /**
     * Gets the appropriate "iteratee" function. If `_.iteratee` is customized,
     * this function returns the custom method, otherwise it returns `baseIteratee`.
     * If arguments are provided, the chosen function is invoked with them and
     * its result is returned.
     *
     * @private
     * @param {*} [value] The value to convert to an iteratee.
     * @param {number} [arity] The arity of the created iteratee.
     * @returns {Function} Returns the chosen function or its result.
     */
    function getIteratee() {
      var result = lodash.iteratee || iteratee;
      result = result === iteratee ? baseIteratee : result;
      return arguments.length ? result(arguments[0], arguments[1]) : result;
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Gets the property names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = keys(object),
          length = result.length;

      while (length--) {
        var key = result[length],
            value = object[key];

        result[length] = [key, value, isStrictComparable(value)];
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag),
          tag = value[symToStringTag];

      try {
        value[symToStringTag] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

    /**
     * Creates an array of the own and inherited enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
      var result = [];
      while (object) {
        arrayPush(result, getSymbols(object));
        object = getPrototype(object);
      }
      return result;
    };

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (Map && getTag(new Map) != mapTag) ||
        (Promise && getTag(Promise.resolve()) != promiseTag) ||
        (Set && getTag(new Set) != setTag) ||
        (WeakMap && getTag(new WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag;
            case mapCtorString: return mapTag;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Extracts wrapper details from the `source` body comment.
     *
     * @private
     * @param {string} source The source to inspect.
     * @returns {Array} Returns the wrapper details.
     */
    function getWrapDetails(source) {
      var match = source.match(reWrapDetails);
      return match ? match[1].split(reSplitDetails) : [];
    }

    /**
     * Checks if `path` exists on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @param {Function} hasFunc The function to check properties.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     */
    function hasPath(object, path, hasFunc) {
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          result = false;

      while (++index < length) {
        var key = toKey(path[index]);
        if (!(result = object != null && hasFunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result || ++index != length) {
        return result;
      }
      length = object == null ? 0 : object.length;
      return !!length && isLength(length) && isIndex(key, length) &&
        (isArray(object) || isArguments(object));
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = new array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      return (typeof object.constructor == 'function' && !isPrototype(object))
        ? baseCreate(getPrototype(object))
        : {};
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case dataViewTag:
          return cloneDataView(object, isDeep);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          return cloneTypedArray(object, isDeep);

        case mapTag:
          return new Ctor;

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          return cloneRegExp(object);

        case setTag:
          return new Ctor;

        case symbolTag:
          return cloneSymbol(object);
      }
    }

    /**
     * Inserts wrapper `details` in a comment at the top of the `source` body.
     *
     * @private
     * @param {string} source The source to modify.
     * @returns {Array} details The details to insert.
     * @returns {string} Returns the modified source.
     */
    function insertWrapDetails(source, details) {
      var length = details.length;
      if (!length) {
        return source;
      }
      var lastIndex = length - 1;
      details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
      details = details.join(length > 2 ? ', ' : ' ');
      return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
    }

    /**
     * Checks if `value` is a flattenable `arguments` object or array.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
     */
    function isFlattenable(value) {
      return isArray(value) || isArguments(value) ||
        !!(spreadableSymbol && value && value[spreadableSymbol]);
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;

      return !!length &&
        (type == 'number' ||
          (type != 'symbol' && reIsUint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * Checks if the given arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
     *  else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
            ? (isArrayLike(object) && isIndex(index, object.length))
            : (type == 'string' && index in object)
          ) {
        return eq(object[index], value);
      }
      return false;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
          value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object));
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
     *  else `false`.
     */
    function isLaziable(func) {
      var funcName = getFuncName(func),
          other = lodash[funcName];

      if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
        return false;
      }
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /**
     * Checks if `func` is capable of being masked.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `func` is maskable, else `false`.
     */
    var isMaskable = coreJsData ? isFunction : stubFalse;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * A specialized version of `matchesProperty` for source values suitable
     * for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue &&
          (srcValue !== undefined || (key in Object(object)));
      };
    }

    /**
     * A specialized version of `_.memoize` which clears the memoized function's
     * cache when it exceeds `MAX_MEMOIZE_SIZE`.
     *
     * @private
     * @param {Function} func The function to have its output memoized.
     * @returns {Function} Returns the new memoized function.
     */
    function memoizeCapped(func) {
      var result = memoize(func, function(key) {
        if (cache.size === MAX_MEMOIZE_SIZE) {
          cache.clear();
        }
        return key;
      });

      var cache = result.cache;
      return result;
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers used to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and
     * `_.rearg` modify function arguments, making the order in which they are
     * executed important, preventing the merging of metadata. However, we make
     * an exception for a safe combined case where curried functions have `_.ary`
     * and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);

      var isCombo =
        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_CURRY_FLAG)) ||
        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_REARG_FLAG) && (data[7].length <= source[8])) ||
        ((srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG));

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & WRAP_BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : value;
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = value;
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & WRAP_ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * This function is like
     * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * except that it includes inherited enumerable properties.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    /**
     * A specialized version of `baseRest` which transforms the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @param {Function} transform The rest array transform.
     * @returns {Function} Returns the new function.
     */
    function overRest(func, start, transform) {
      start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return apply(func, this, otherArgs);
      };
    }

    /**
     * Gets the parent value at `path` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path to get the parent value of.
     * @returns {*} Returns the parent value.
     */
    function parent(object, path) {
      return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = copyArray(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function safeGet(object, key) {
      if (key === 'constructor' && typeof object[key] === 'function') {
        return;
      }

      if (key == '__proto__') {
        return;
      }

      return object[key];
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity
     * function to avoid garbage collection pauses in V8. See
     * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = shortOut(baseSetData);

    /**
     * A simple wrapper around the global [`setTimeout`](https://mdn.io/setTimeout).
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @returns {number|Object} Returns the timer id or timeout object.
     */
    var setTimeout = ctxSetTimeout || function(func, wait) {
      return root.setTimeout(func, wait);
    };

    /**
     * Sets the `toString` method of `func` to return `string`.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var setToString = shortOut(baseSetToString);

    /**
     * Sets the `toString` method of `wrapper` to mimic the source of `reference`
     * with wrapper details in a comment at the top of the source body.
     *
     * @private
     * @param {Function} wrapper The function to modify.
     * @param {Function} reference The reference function.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @returns {Function} Returns `wrapper`.
     */
    function setWrapToString(wrapper, reference, bitmask) {
      var source = (reference + '');
      return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
    }

    /**
     * Creates a function that'll short out and invoke `identity` instead
     * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
     * milliseconds.
     *
     * @private
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new shortable function.
     */
    function shortOut(func) {
      var count = 0,
          lastCalled = 0;

      return function() {
        var stamp = nativeNow(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(undefined, arguments);
      };
    }

    /**
     * A specialized version of `_.shuffle` which mutates and sets the size of `array`.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @param {number} [size=array.length] The size of `array`.
     * @returns {Array} Returns `array`.
     */
    function shuffleSelf(array, size) {
      var index = -1,
          length = array.length,
          lastIndex = length - 1;

      size = size === undefined ? length : size;
      while (++index < size) {
        var rand = baseRandom(index, lastIndex),
            value = array[rand];

        array[rand] = array[index];
        array[index] = value;
      }
      array.length = size;
      return array;
    }

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    var stringToPath = memoizeCapped(function(string) {
      var result = [];
      if (string.charCodeAt(0) === 46 /* . */) {
        result.push('');
      }
      string.replace(rePropName, function(match, number, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    });

    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey(value) {
      if (typeof value == 'string' || isSymbol(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Updates wrapper `details` based on `bitmask` flags.
     *
     * @private
     * @returns {Array} details The details to modify.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @returns {Array} Returns `details`.
     */
    function updateWrapDetails(details, bitmask) {
      arrayEach(wrapFlags, function(pair) {
        var value = '_.' + pair[0];
        if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
          details.push(value);
        }
      });
      return details.sort();
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone(wrapper) {
      if (wrapper instanceof LazyWrapper) {
        return wrapper.clone();
      }
      var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
      result.__actions__ = copyArray(wrapper.__actions__);
      result.__index__  = wrapper.__index__;
      result.__values__ = wrapper.__values__;
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `array` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the new array of chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size, guard) {
      if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
        size = 1;
      } else {
        size = nativeMax(toInteger(size), 0);
      }
      var length = array == null ? 0 : array.length;
      if (!length || size < 1) {
        return [];
      }
      var index = 0,
          resIndex = 0,
          result = Array(nativeCeil(length / size));

      while (index < length) {
        result[resIndex++] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * Creates a new array concatenating `array` with any additional arrays
     * and/or values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to concatenate.
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var other = _.concat(array, 2, [3], [[4]]);
     *
     * console.log(other);
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    function concat() {
      var length = arguments.length;
      if (!length) {
        return [];
      }
      var args = Array(length - 1),
          array = arguments[0],
          index = length;

      while (index--) {
        args[index - 1] = arguments[index];
      }
      return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
    }

    /**
     * Creates an array of `array` values not included in the other given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * **Note:** Unlike `_.pullAll`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.without, _.xor
     * @example
     *
     * _.difference([2, 1], [2, 3]);
     * // => [1]
     */
    var difference = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `iteratee` which
     * is invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * **Note:** Unlike `_.pullAllBy`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var differenceBy = baseRest(function(array, values) {
      var iteratee = last(values);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee, 2))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `comparator`
     * which is invoked to compare elements of `array` to `values`. The order and
     * references of result values are determined by the first array. The comparator
     * is invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.pullAllWith`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     *
     * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }]
     */
    var differenceWith = baseRest(function(array, values) {
      var comparator = last(values);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator)
        : [];
    });

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.dropRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropRightWhile(users, ['active', false]);
     * // => objects for ['barney']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropRightWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true, true)
        : [];
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.dropWhile(users, function(o) { return !o.active; });
     * // => objects for ['pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropWhile(users, ['active', false]);
     * // => objects for ['pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true)
        : [];
    }

    /**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8, 10], '*', 1, 3);
     * // => [4, '*', '*', 10]
     */
    function fill(array, value, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(o) { return o.user == 'barney'; });
     * // => 0
     *
     * // The `_.matches` iteratee shorthand.
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findIndex(users, ['active', false]);
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.findIndex(users, 'active');
     * // => 2
     */
    function findIndex(array, predicate, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseFindIndex(array, getIteratee(predicate, 3), index);
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
     * // => 2
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastIndex(users, ['active', false]);
     * // => 2
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    function findLastIndex(array, predicate, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length - 1;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = fromIndex < 0
          ? nativeMax(length + index, 0)
          : nativeMin(index, length - 1);
      }
      return baseFindIndex(array, getIteratee(predicate, 3), index, true);
    }

    /**
     * Flattens `array` a single level deep.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, [3, [4]], 5]]);
     * // => [1, 2, [3, [4]], 5]
     */
    function flatten(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, 1) : [];
    }

    /**
     * Recursively flattens `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, [3, [4]], 5]]);
     * // => [1, 2, 3, 4, 5]
     */
    function flattenDeep(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, INFINITY) : [];
    }

    /**
     * Recursively flatten `array` up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * var array = [1, [2, [3, [4]], 5]];
     *
     * _.flattenDepth(array, 1);
     * // => [1, 2, [3, [4]], 5]
     *
     * _.flattenDepth(array, 2);
     * // => [1, 2, 3, [4], 5]
     */
    function flattenDepth(array, depth) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(array, depth);
    }

    /**
     * The inverse of `_.toPairs`; this method returns an object composed
     * from key-value `pairs`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} pairs The key-value pairs.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.fromPairs([['a', 1], ['b', 2]]);
     * // => { 'a': 1, 'b': 2 }
     */
    function fromPairs(pairs) {
      var index = -1,
          length = pairs == null ? 0 : pairs.length,
          result = {};

      while (++index < length) {
        var pair = pairs[index];
        result[pair[0]] = pair[1];
      }
      return result;
    }

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias first
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.head([1, 2, 3]);
     * // => 1
     *
     * _.head([]);
     * // => undefined
     */
    function head(array) {
      return (array && array.length) ? array[0] : undefined;
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it's used as the
     * offset from the end of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // Search from the `fromIndex`.
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     */
    function indexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseIndexOf(array, value, index);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 0, -1) : [];
    }

    /**
     * Creates an array of unique values that are included in all given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersection([2, 1], [2, 3]);
     * // => [2]
     */
    var intersection = baseRest(function(arrays) {
      var mapped = arrayMap(arrays, castArrayLikeObject);
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped)
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `iteratee`
     * which is invoked for each element of each `arrays` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [2.1]
     *
     * // The `_.property` iteratee shorthand.
     * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }]
     */
    var intersectionBy = baseRest(function(arrays) {
      var iteratee = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      if (iteratee === last(mapped)) {
        iteratee = undefined;
      } else {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, getIteratee(iteratee, 2))
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `comparator`
     * which is invoked to compare elements of `arrays`. The order and references
     * of result values are determined by the first array. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.intersectionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }]
     */
    var intersectionWith = baseRest(function(arrays) {
      var comparator = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      comparator = typeof comparator == 'function' ? comparator : undefined;
      if (comparator) {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, undefined, comparator)
        : [];
    });

    /**
     * Converts all elements in `array` into a string separated by `separator`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to convert.
     * @param {string} [separator=','] The element separator.
     * @returns {string} Returns the joined string.
     * @example
     *
     * _.join(['a', 'b', 'c'], '~');
     * // => 'a~b~c'
     */
    function join(array, separator) {
      return array == null ? '' : nativeJoin.call(array, separator);
    }

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array == null ? 0 : array.length;
      return length ? array[length - 1] : undefined;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // Search from the `fromIndex`.
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
      }
      return value === value
        ? strictLastIndexOf(array, value, index)
        : baseFindIndex(array, baseIsNaN, index, true);
    }

    /**
     * Gets the element at index `n` of `array`. If `n` is negative, the nth
     * element from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.11.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=0] The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     *
     * _.nth(array, 1);
     * // => 'b'
     *
     * _.nth(array, -2);
     * // => 'c';
     */
    function nth(array, n) {
      return (array && array.length) ? baseNth(array, toInteger(n)) : undefined;
    }

    /**
     * Removes all given values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
     * to remove elements from an array by predicate.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pull(array, 'a', 'c');
     * console.log(array);
     * // => ['b', 'b']
     */
    var pull = baseRest(pullAll);

    /**
     * This method is like `_.pull` except that it accepts an array of values to remove.
     *
     * **Note:** Unlike `_.difference`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pullAll(array, ['a', 'c']);
     * console.log(array);
     * // => ['b', 'b']
     */
    function pullAll(array, values) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values)
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `iteratee` which is
     * invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The iteratee is invoked with one argument: (value).
     *
     * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
     *
     * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
     * console.log(array);
     * // => [{ 'x': 2 }]
     */
    function pullAllBy(array, values, iteratee) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, getIteratee(iteratee, 2))
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `comparator` which
     * is invoked to compare elements of `array` to `values`. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.differenceWith`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
     *
     * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
     * console.log(array);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
     */
    function pullAllWith(array, values, comparator) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, undefined, comparator)
        : array;
    }

    /**
     * Removes elements from `array` corresponding to `indexes` and returns an
     * array of removed elements.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     * var pulled = _.pullAt(array, [1, 3]);
     *
     * console.log(array);
     * // => ['a', 'c']
     *
     * console.log(pulled);
     * // => ['b', 'd']
     */
    var pullAt = flatRest(function(array, indexes) {
      var length = array == null ? 0 : array.length,
          result = baseAt(array, indexes);

      basePullAt(array, arrayMap(indexes, function(index) {
        return isIndex(index, length) ? +index : index;
      }).sort(compareAscending));

      return result;
    });

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is invoked
     * with three arguments: (value, index, array).
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
     * to pull elements from an array by value.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getIteratee(predicate, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * Reverses `array` so that the first element becomes the last, the second
     * element becomes the second to last, and so on.
     *
     * **Note:** This method mutates `array` and is based on
     * [`Array#reverse`](https://mdn.io/Array/reverse).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.reverse(array);
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function reverse(array) {
      return array == null ? array : nativeReverse.call(array);
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of
     * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
     * returned.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      else {
        start = start == null ? 0 : toInteger(start);
        end = end === undefined ? length : toInteger(end);
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     */
    function sortedIndex(array, value) {
      return baseSortedIndex(array, value);
    }

    /**
     * This method is like `_.sortedIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedIndexBy(objects, { 'x': 4 }, 'x');
     * // => 0
     */
    function sortedIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
    }

    /**
     * This method is like `_.indexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedIndexOf([4, 5, 5, 5, 6], 5);
     * // => 1
     */
    function sortedIndexOf(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = baseSortedIndex(array, value);
        if (index < length && eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 5, 5, 5, 6], 5);
     * // => 4
     */
    function sortedLastIndex(array, value) {
      return baseSortedIndex(array, value, true);
    }

    /**
     * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 1
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
     * // => 1
     */
    function sortedLastIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
    }

    /**
     * This method is like `_.lastIndexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
     * // => 3
     */
    function sortedLastIndexOf(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = baseSortedIndex(array, value, true) - 1;
        if (eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.uniq` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniq([1, 1, 2]);
     * // => [1, 2]
     */
    function sortedUniq(array) {
      return (array && array.length)
        ? baseSortedUniq(array)
        : [];
    }

    /**
     * This method is like `_.uniqBy` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
     * // => [1.1, 2.3]
     */
    function sortedUniqBy(array, iteratee) {
      return (array && array.length)
        ? baseSortedUniq(array, getIteratee(iteratee, 2))
        : [];
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.tail([1, 2, 3]);
     * // => [2, 3]
     */
    function tail(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 1, length) : [];
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      if (!(array && array.length)) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.takeRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeRightWhile(users, ['active', false]);
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeRightWhile(users, 'active');
     * // => []
     */
    function takeRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), false, true)
        : [];
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.takeWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeWhile(users, ['active', false]);
     * // => objects for ['barney', 'fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeWhile(users, 'active');
     * // => []
     */
    function takeWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3))
        : [];
    }

    /**
     * Creates an array of unique values, in order, from all given arrays using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([2], [1, 2]);
     * // => [2, 1]
     */
    var union = baseRest(function(arrays) {
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
    });

    /**
     * This method is like `_.union` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which uniqueness is computed. Result values are chosen from the first
     * array in which the value occurs. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.unionBy([2.1], [1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    var unionBy = baseRest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee, 2));
    });

    /**
     * This method is like `_.union` except that it accepts `comparator` which
     * is invoked to compare elements of `arrays`. Result values are chosen from
     * the first array in which the value occurs. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.unionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var unionWith = baseRest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
    });

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurrence of each element
     * is kept. The order of result values is determined by the order they occur
     * in the array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     */
    function uniq(array) {
      return (array && array.length) ? baseUniq(array) : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * uniqueness is computed. The order of result values is determined by the
     * order they occur in the array. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniqBy(array, iteratee) {
      return (array && array.length) ? baseUniq(array, getIteratee(iteratee, 2)) : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `comparator` which
     * is invoked to compare elements of `array`. The order of result values is
     * determined by the order they occur in the array.The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.uniqWith(objects, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
     */
    function uniqWith(array, comparator) {
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return (array && array.length) ? baseUniq(array, undefined, comparator) : [];
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @since 1.2.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     *
     * _.unzip(zipped);
     * // => [['a', 'b'], [1, 2], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var length = 0;
      array = arrayFilter(array, function(group) {
        if (isArrayLikeObject(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      return baseTimes(length, function(index) {
        return arrayMap(array, baseProperty(index));
      });
    }

    /**
     * This method is like `_.unzip` except that it accepts `iteratee` to specify
     * how regrouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  regrouped values.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith(array, iteratee) {
      if (!(array && array.length)) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      return arrayMap(result, function(group) {
        return apply(iteratee, undefined, group);
      });
    }

    /**
     * Creates an array excluding all given values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.pull`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.xor
     * @example
     *
     * _.without([2, 1, 2, 3], 1, 2);
     * // => [3]
     */
    var without = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * Creates an array of unique values that is the
     * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the given arrays. The order of result values is determined by the order
     * they occur in the arrays.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.without
     * @example
     *
     * _.xor([2, 1], [2, 3]);
     * // => [1, 3]
     */
    var xor = baseRest(function(arrays) {
      return baseXor(arrayFilter(arrays, isArrayLikeObject));
    });

    /**
     * This method is like `_.xor` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which by which they're compared. The order of result values is determined
     * by the order they occur in the arrays. The iteratee is invoked with one
     * argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2, 3.4]
     *
     * // The `_.property` iteratee shorthand.
     * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var xorBy = baseRest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2));
    });

    /**
     * This method is like `_.xor` except that it accepts `comparator` which is
     * invoked to compare elements of `arrays`. The order of result values is
     * determined by the order they occur in the arrays. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.xorWith(objects, others, _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var xorWith = baseRest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
    });

    /**
     * Creates an array of grouped elements, the first of which contains the
     * first elements of the given arrays, the second of which contains the
     * second elements of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     */
    var zip = baseRest(unzip);

    /**
     * This method is like `_.fromPairs` except that it accepts two arrays,
     * one of property identifiers and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 0.4.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject(['a', 'b'], [1, 2]);
     * // => { 'a': 1, 'b': 2 }
     */
    function zipObject(props, values) {
      return baseZipObject(props || [], values || [], assignValue);
    }

    /**
     * This method is like `_.zipObject` except that it supports property paths.
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
     * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
     */
    function zipObjectDeep(props, values) {
      return baseZipObject(props || [], values || [], baseSet);
    }

    /**
     * This method is like `_.zip` except that it accepts `iteratee` to specify
     * how grouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  grouped values.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
     *   return a + b + c;
     * });
     * // => [111, 222]
     */
    var zipWith = baseRest(function(arrays) {
      var length = arrays.length,
          iteratee = length > 1 ? arrays[length - 1] : undefined;

      iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
      return unzipWith(arrays, iteratee);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` wrapper instance that wraps `value` with explicit method
     * chain sequences enabled. The result of such sequences must be unwrapped
     * with `_#value`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Seq
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _
     *   .chain(users)
     *   .sortBy('age')
     *   .map(function(o) {
     *     return o.user + ' is ' + o.age;
     *   })
     *   .head()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor
     * is invoked with one argument; (value). The purpose of this method is to
     * "tap into" a method chain sequence in order to modify intermediate results.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    // Mutate input array.
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     * The purpose of this method is to "pass thru" values replacing intermediate
     * results in a method chain sequence.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor) {
      return interceptor(value);
    }

    /**
     * This method is the wrapper version of `_.at`.
     *
     * @name at
     * @memberOf _
     * @since 1.0.0
     * @category Seq
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _(object).at(['a[0].b.c', 'a[1]']).value();
     * // => [3, 4]
     */
    var wrapperAt = flatRest(function(paths) {
      var length = paths.length,
          start = length ? paths[0] : 0,
          value = this.__wrapped__,
          interceptor = function(object) { return baseAt(object, paths); };

      if (length > 1 || this.__actions__.length ||
          !(value instanceof LazyWrapper) || !isIndex(start)) {
        return this.thru(interceptor);
      }
      value = value.slice(start, +start + (length ? 1 : 0));
      value.__actions__.push({
        'func': thru,
        'args': [interceptor],
        'thisArg': undefined
      });
      return new LodashWrapper(value, this.__chain__).thru(function(array) {
        if (length && !array.length) {
          array.push(undefined);
        }
        return array;
      });
    });

    /**
     * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
     *
     * @name chain
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // A sequence without explicit chaining.
     * _(users).head();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // A sequence with explicit chaining.
     * _(users)
     *   .chain()
     *   .head()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Executes the chain sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit() {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * Gets the next value on a wrapped object following the
     * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
     *
     * @name next
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the next iterator value.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 1 }
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 2 }
     *
     * wrapped.next();
     * // => { 'done': true, 'value': undefined }
     */
    function wrapperNext() {
      if (this.__values__ === undefined) {
        this.__values__ = toArray(this.value());
      }
      var done = this.__index__ >= this.__values__.length,
          value = done ? undefined : this.__values__[this.__index__++];

      return { 'done': done, 'value': value };
    }

    /**
     * Enables the wrapper to be iterable.
     *
     * @name Symbol.iterator
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped[Symbol.iterator]() === wrapped;
     * // => true
     *
     * Array.from(wrapped);
     * // => [1, 2]
     */
    function wrapperToIterator() {
      return this;
    }

    /**
     * Creates a clone of the chain sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @param {*} value The value to plant.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2]).map(square);
     * var other = wrapped.plant([3, 4]);
     *
     * other.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant(value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone = wrapperClone(parent);
        clone.__index__ = 0;
        clone.__values__ = undefined;
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * This method is the wrapper version of `_.reverse`.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({
          'func': thru,
          'args': [reverse],
          'thisArg': undefined
        });
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(reverse);
    }

    /**
     * Executes the chain sequence to resolve the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @since 0.1.0
     * @alias toJSON, valueOf
     * @category Seq
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the number of times the key was returned by `iteratee`. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': 1, '6': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        ++result[key];
      } else {
        baseAssignValue(result, key, 1);
      }
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * Iteration is stopped once `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * **Note:** This method returns `true` for
     * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
     * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
     * elements of empty collections.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.every(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, guard) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * **Note:** Unlike `_.remove`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.reject
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, { 'age': 36, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.filter(users, 'active');
     * // => objects for ['barney']
     *
     * // Combining several predicates using `_.overEvery` or `_.overSome`.
     * _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
     * // => objects for ['fred', 'barney']
     */
    function filter(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.find(users, function(o) { return o.age < 40; });
     * // => object for 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.find(users, { 'age': 1, 'active': true });
     * // => object for 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.find(users, ['active', false]);
     * // => object for 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.find(users, 'active');
     * // => object for 'barney'
     */
    var find = createFind(findIndex);

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=collection.length-1] The index to search from.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    var findLast = createFind(findLastIndex);

    /**
     * Creates a flattened array of values by running each element in `collection`
     * thru `iteratee` and flattening the mapped results. The iteratee is invoked
     * with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [n, n];
     * }
     *
     * _.flatMap([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMap(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), 1);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDeep([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMapDeep(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), INFINITY);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDepth([1, 2], duplicate, 2);
     * // => [[1, 1], [2, 2]]
     */
    function flatMapDepth(collection, iteratee, depth) {
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(map(collection, iteratee), depth);
    }

    /**
     * Iterates over elements of `collection` and invokes `iteratee` for each element.
     * The iteratee is invoked with three arguments: (value, index|key, collection).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length"
     * property are iterated like arrays. To avoid this behavior use `_.forIn`
     * or `_.forOwn` for object iteration.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias each
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEachRight
     * @example
     *
     * _.forEach([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `1` then `2`.
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forEach(collection, iteratee) {
      var func = isArray(collection) ? arrayEach : baseEach;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @alias eachRight
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEach
     * @example
     *
     * _.forEachRight([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `2` then `1`.
     */
    function forEachRight(collection, iteratee) {
      var func = isArray(collection) ? arrayEachRight : baseEachRight;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The order of grouped values
     * is determined by the order they occur in `collection`. The corresponding
     * value of each key is an array of elements responsible for generating the
     * key. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': [4.2], '6': [6.1, 6.3] }
     *
     * // The `_.property` iteratee shorthand.
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        baseAssignValue(result, key, [value]);
      }
    });

    /**
     * Checks if `value` is in `collection`. If `collection` is a string, it's
     * checked for a substring of `value`, otherwise
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * is used for equality comparisons. If `fromIndex` is negative, it's used as
     * the offset from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {boolean} Returns `true` if `value` is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'a': 1, 'b': 2 }, 1);
     * // => true
     *
     * _.includes('abcd', 'bc');
     * // => true
     */
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection)
        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
    }

    /**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `path` is a function, it's invoked
     * for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke each method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invokeMap([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invokeMap = baseRest(function(collection, path, args) {
      var index = -1,
          isFunc = typeof path == 'function',
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value) {
        result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
      });
      return result;
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the last element responsible for generating the key. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var array = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.keyBy(array, function(o) {
     *   return String.fromCharCode(o.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.keyBy(array, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     */
    var keyBy = createAggregator(function(result, value, key) {
      baseAssignValue(result, key, value);
    });

    /**
     * Creates an array of values by running each element in `collection` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
     * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
     * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
     * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * _.map([4, 8], square);
     * // => [16, 64]
     *
     * _.map({ 'a': 4, 'b': 8 }, square);
     * // => [16, 64] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee) {
      var func = isArray(collection) ? arrayMap : baseMap;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.sortBy` except that it allows specifying the sort
     * orders of the iteratees to sort by. If `orders` is unspecified, all values
     * are sorted in ascending order. Otherwise, specify an order of "desc" for
     * descending or "asc" for ascending sort order of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @param {string[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 40 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // Sort by `user` in ascending order and by `age` in descending order.
     * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
     */
    function orderBy(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      orders = guard ? undefined : orders;
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseOrderBy(collection, iteratees, orders);
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, the second of which
     * contains elements `predicate` returns falsey for. The predicate is
     * invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * _.partition(users, function(o) { return o.active; });
     * // => objects for [['fred'], ['barney', 'pebbles']]
     *
     * // The `_.matches` iteratee shorthand.
     * _.partition(users, { 'age': 1, 'active': false });
     * // => objects for [['pebbles'], ['barney', 'fred']]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.partition(users, ['active', false]);
     * // => objects for [['barney', 'pebbles'], ['fred']]
     *
     * // The `_.property` iteratee shorthand.
     * _.partition(users, 'active');
     * // => objects for [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` thru `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not given, the first element of `collection` is used as the initial
     * value. The iteratee is invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
     * and `sortBy`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduceRight
     * @example
     *
     * _.reduce([1, 2], function(sum, n) {
     *   return sum + n;
     * }, 0);
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     *   return result;
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
     */
    function reduce(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduce : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduce
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduceRight : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
    }

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.filter
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * _.reject(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.reject(users, { 'age': 40, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.reject(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.reject(users, 'active');
     * // => objects for ['barney']
     */
    function reject(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, negate(getIteratee(predicate, 3)));
    }

    /**
     * Gets a random element from `collection`.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     */
    function sample(collection) {
      var func = isArray(collection) ? arraySample : baseSample;
      return func(collection);
    }

    /**
     * Gets `n` random elements at unique keys from `collection` up to the
     * size of `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @param {number} [n=1] The number of elements to sample.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the random elements.
     * @example
     *
     * _.sampleSize([1, 2, 3], 2);
     * // => [3, 1]
     *
     * _.sampleSize([1, 2, 3], 4);
     * // => [2, 3, 1]
     */
    function sampleSize(collection, n, guard) {
      if ((guard ? isIterateeCall(collection, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      var func = isArray(collection) ? arraySampleSize : baseSampleSize;
      return func(collection, n);
    }

    /**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      var func = isArray(collection) ? arrayShuffle : baseShuffle;
      return func(collection);
    }

    /**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable string keyed properties for objects.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns the collection size.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      if (collection == null) {
        return 0;
      }
      if (isArrayLike(collection)) {
        return isString(collection) ? stringSize(collection) : collection.length;
      }
      var tag = getTag(collection);
      if (tag == mapTag || tag == setTag) {
        return collection.size;
      }
      return baseKeys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * Iteration is stopped once `predicate` returns truthy. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.some(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, guard) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection thru each iteratee. This method
     * performs a stable sort, that is, it preserves the original sort order of
     * equal elements. The iteratees are invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {...(Function|Function[])} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 30 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.sortBy(users, [function(o) { return o.user; }]);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
     *
     * _.sortBy(users, ['user', 'age']);
     * // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
     */
    var sortBy = baseRest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees = [iteratees[0]];
      }
      return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => Logs the number of milliseconds it took for the deferred invocation.
     */
    var now = ctxNow || function() {
      return root.Date.now();
    };

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it's called `n` or more times.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => Logs 'done saving!' after the two async saves have completed.
     */
    function after(n, func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that invokes `func`, with up to `n` arguments,
     * ignoring any additional arguments.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      n = guard ? undefined : n;
      n = (func && n == null) ? func.length : n;
      return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it's called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery(element).on('click', _.before(5, addContactToList));
     * // => Allows adding up to 4 contacts to the list.
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and `partials` prepended to the arguments it receives.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * function greet(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * }
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = baseRest(function(func, thisArg, partials) {
      var bitmask = WRAP_BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bind));
        bitmask |= WRAP_PARTIAL_FLAG;
      }
      return createWrap(func, bitmask, thisArg, partials, holders);
    });

    /**
     * Creates a function that invokes the method at `object[key]` with `partials`
     * prepended to the arguments it receives.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist. See
     * [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Function
     * @param {Object} object The object to invoke the method on.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = baseRest(function(object, key, partials) {
      var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bindKey));
        bitmask |= WRAP_PARTIAL_FLAG;
      }
      return createWrap(key, bitmask, object, partials, holders);
    });

    /**
     * Creates a function that accepts arguments of `func` and either invokes
     * `func` returning its result, if at least `arity` number of arguments have
     * been provided, or returns a function that accepts the remaining `func`
     * arguments, and so on. The arity of `func` may be specified if `func.length`
     * is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    function curry(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrap(func, WRAP_CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curry.placeholder;
      return result;
    }

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    function curryRight(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curryRight.placeholder;
      return result;
    }

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide `options` to indicate whether `func` should be invoked on the
     * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent
     * calls to the debounced function return the result of the last `func`
     * invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the debounced function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=false]
     *  Specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxWait]
     *  The maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce(func, wait, options) {
      var lastArgs,
          lastThis,
          maxWait,
          result,
          timerId,
          lastCallTime,
          lastInvokeTime = 0,
          leading = false,
          maxing = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function invokeFunc(time) {
        var args = lastArgs,
            thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
      }

      function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
      }

      function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            timeWaiting = wait - timeSinceLastCall;

        return maxing
          ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
          : timeWaiting;
      }

      function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
      }

      function timerExpired() {
        var time = now();
        if (shouldInvoke(time)) {
          return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
      }

      function trailingEdge(time) {
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
          return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
      }

      function cancel() {
        if (timerId !== undefined) {
          clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
      }

      function flush() {
        return timerId === undefined ? result : trailingEdge(now());
      }

      function debounced() {
        var time = now(),
            isInvoking = shouldInvoke(time);

        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
          if (timerId === undefined) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            // Handle invocations in a tight loop.
            clearTimeout(timerId);
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === undefined) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // => Logs 'deferred' after one millisecond.
     */
    var defer = baseRest(function(func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => Logs 'later' after one second.
     */
    var delay = baseRest(function(func, wait, args) {
      return baseDelay(func, toNumber(wait) || 0, args);
    });

    /**
     * Creates a function that invokes `func` with arguments reversed.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to flip arguments for.
     * @returns {Function} Returns the new flipped function.
     * @example
     *
     * var flipped = _.flip(function() {
     *   return _.toArray(arguments);
     * });
     *
     * flipped('a', 'b', 'c', 'd');
     * // => ['d', 'c', 'b', 'a']
     */
    function flip(func) {
      return createWrap(func, WRAP_FLIP_FLAG);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `clear`, `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache);
      return memoized;
    }

    // Expose `MapCache`.
    memoize.Cache = MapCache;

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new negated function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        var args = arguments;
        switch (args.length) {
          case 0: return !predicate.call(this);
          case 1: return !predicate.call(this, args[0]);
          case 2: return !predicate.call(this, args[0], args[1]);
          case 3: return !predicate.call(this, args[0], args[1], args[2]);
        }
        return !predicate.apply(this, args);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first invocation. The `func` is
     * invoked with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // => `createApplication` is invoked once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * Creates a function that invokes `func` with its arguments transformed.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms=[_.identity]]
     *  The argument transforms.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var func = _.overArgs(function(x, y) {
     *   return [x, y];
     * }, [square, doubled]);
     *
     * func(9, 3);
     * // => [81, 6]
     *
     * func(10, 5);
     * // => [100, 10]
     */
    var overArgs = castRest(function(func, transforms) {
      transforms = (transforms.length == 1 && isArray(transforms[0]))
        ? arrayMap(transforms[0], baseUnary(getIteratee()))
        : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));

      var funcsLength = transforms.length;
      return baseRest(function(args) {
        var index = -1,
            length = nativeMin(args.length, funcsLength);

        while (++index < length) {
          args[index] = transforms[index].call(this, args[index]);
        }
        return apply(func, this, args);
      });
    });

    /**
     * Creates a function that invokes `func` with `partials` prepended to the
     * arguments it receives. This method is like `_.bind` except it does **not**
     * alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 0.2.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // Partially applied with placeholders.
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = baseRest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partial));
      return createWrap(func, WRAP_PARTIAL_FLAG, undefined, partials, holders);
    });

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to the arguments it receives.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // Partially applied with placeholders.
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = baseRest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partialRight));
      return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined, partials, holders);
    });

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified `indexes` where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, [2, 0, 1]);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     */
    var rearg = flatRest(function(func, indexes) {
      return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as
     * an array.
     *
     * **Note:** This method is based on the
     * [rest parameter](https://mdn.io/rest_parameters).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.rest(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function rest(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start === undefined ? start : toInteger(start);
      return baseRest(func, start);
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * create function and an array of arguments much like
     * [`Function#apply`](http://www.ecma-international.org/ecma-262/7.0/#sec-function.prototype.apply).
     *
     * **Note:** This method is based on the
     * [spread operator](https://mdn.io/spread_operator).
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @param {number} [start=0] The start position of the spread.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */
    function spread(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start == null ? 0 : nativeMax(toInteger(start), 0);
      return baseRest(function(args) {
        var array = args[start],
            otherArgs = castSlice(args, 0, start);

        if (array) {
          arrayPush(otherArgs, array);
        }
        return apply(func, this, otherArgs);
      });
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed `func` invocations and a `flush` method to
     * immediately invoke them. Provide `options` to indicate whether `func`
     * should be invoked on the leading and/or trailing edge of the `wait`
     * timeout. The `func` is invoked with the last arguments provided to the
     * throttled function. Subsequent calls to the throttled function return the
     * result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the throttled function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=true]
     *  Specify invoking on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // Avoid excessively updating the position while scrolling.
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
     * jQuery(element).on('click', throttled);
     *
     * // Cancel the trailing throttled invocation.
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, {
        'leading': leading,
        'maxWait': wait,
        'trailing': trailing
      });
    }

    /**
     * Creates a function that accepts up to one argument, ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.unary(parseInt));
     * // => [6, 8, 10]
     */
    function unary(func) {
      return ary(func, 1);
    }

    /**
     * Creates a function that provides `value` to `wrapper` as its first
     * argument. Any additional arguments provided to the function are appended
     * to those provided to the `wrapper`. The wrapper is invoked with the `this`
     * binding of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} [wrapper=identity] The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      return partial(castFunction(wrapper), value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Casts `value` as an array if it's not one.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Lang
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the cast array.
     * @example
     *
     * _.castArray(1);
     * // => [1]
     *
     * _.castArray({ 'a': 1 });
     * // => [{ 'a': 1 }]
     *
     * _.castArray('abc');
     * // => ['abc']
     *
     * _.castArray(null);
     * // => [null]
     *
     * _.castArray(undefined);
     * // => [undefined]
     *
     * _.castArray();
     * // => []
     *
     * var array = [1, 2, 3];
     * console.log(_.castArray(array) === array);
     * // => true
     */
    function castArray() {
      if (!arguments.length) {
        return [];
      }
      var value = arguments[0];
      return isArray(value) ? value : [value];
    }

    /**
     * Creates a shallow clone of `value`.
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
     * and supports cloning arrays, array buffers, booleans, date objects, maps,
     * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
     * arrays. The own enumerable properties of `arguments` objects are cloned
     * as plain objects. An empty object is returned for uncloneable values such
     * as error objects, functions, DOM nodes, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to clone.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeep
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var shallow = _.clone(objects);
     * console.log(shallow[0] === objects[0]);
     * // => true
     */
    function clone(value) {
      return baseClone(value, CLONE_SYMBOLS_FLAG);
    }

    /**
     * This method is like `_.clone` except that it accepts `customizer` which
     * is invoked to produce the cloned value. If `customizer` returns `undefined`,
     * cloning is handled by the method instead. The `customizer` is invoked with
     * up to four arguments; (value [, index|key, object, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeepWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * }
     *
     * var el = _.cloneWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 0
     */
    function cloneWith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
    }

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
    }

    /**
     * This method is like `_.cloneWith` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the deep cloned value.
     * @see _.cloneWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * }
     *
     * var el = _.cloneDeepWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 20
     */
    function cloneDeepWith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
    }

    /**
     * Checks if `object` conforms to `source` by invoking the predicate
     * properties of `source` with the corresponding property values of `object`.
     *
     * **Note:** This method is equivalent to `_.conforms` when `source` is
     * partially applied.
     *
     * @static
     * @memberOf _
     * @since 4.14.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property predicates to conform to.
     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.conformsTo(object, { 'b': function(n) { return n > 1; } });
     * // => true
     *
     * _.conformsTo(object, { 'b': function(n) { return n > 2; } });
     * // => false
     */
    function conformsTo(object, source) {
      return source == null || baseConformsTo(object, source, keys(source));
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     * @see _.lt
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    var gt = createRelationalOperation(baseGt);

    /**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to
     *  `other`, else `false`.
     * @see _.lte
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    var gte = createRelationalOperation(function(value, other) {
      return value >= other;
    });

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee');
    };

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is classified as an `ArrayBuffer` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     * @example
     *
     * _.isArrayBuffer(new ArrayBuffer(2));
     * // => true
     *
     * _.isArrayBuffer(new Array(2));
     * // => false
     */
    var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        (isObjectLike(value) && baseGetTag(value) == boolTag);
    }

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

    /**
     * Checks if `value` is likely a DOM element.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
    }

    /**
     * Checks if `value` is an empty object, collection, map, or set.
     *
     * Objects are considered empty if they have no own enumerable string keyed
     * properties.
     *
     * Array-like values such as `arguments` objects, arrays, buffers, strings, or
     * jQuery-like collections are considered empty if they have a `length` of `0`.
     * Similarly, maps and sets are considered empty if they have a `size` of `0`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (value == null) {
        return true;
      }
      if (isArrayLike(value) &&
          (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
            isBuffer(value) || isTypedArray(value) || isArguments(value))) {
        return !value.length;
      }
      var tag = getTag(value);
      if (tag == mapTag || tag == setTag) {
        return !value.size;
      }
      if (isPrototype(value)) {
        return !baseKeys(value).length;
      }
      for (var key in value) {
        if (hasOwnProperty.call(value, key)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **Note:** This method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexes,
     * sets, strings, symbols, and typed arrays. `Object` objects are compared
     * by their own, not inherited, enumerable properties. Functions and DOM
     * nodes are compared by strict equality, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.isEqual(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }

    /**
     * This method is like `_.isEqual` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with up to
     * six arguments: (objValue, othValue [, index|key, object, other, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, othValue) {
     *   if (isGreeting(objValue) && isGreeting(othValue)) {
     *     return true;
     *   }
     * }
     *
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqualWith(array, other, customizer);
     * // => true
     */
    function isEqualWith(value, other, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      if (!isObjectLike(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == errorTag || tag == domExcTag ||
        (typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value));
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on
     * [`Number.isFinite`](https://mdn.io/Number/isFinite).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(3);
     * // => true
     *
     * _.isFinite(Number.MIN_VALUE);
     * // => true
     *
     * _.isFinite(Infinity);
     * // => false
     *
     * _.isFinite('3');
     * // => false
     */
    function isFinite(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    /**
     * Checks if `value` is an integer.
     *
     * **Note:** This method is based on
     * [`Number.isInteger`](https://mdn.io/Number/isInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
     * @example
     *
     * _.isInteger(3);
     * // => true
     *
     * _.isInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isInteger(Infinity);
     * // => false
     *
     * _.isInteger('3');
     * // => false
     */
    function isInteger(value) {
      return typeof value == 'number' && value == toInteger(value);
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a `Map` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     * @example
     *
     * _.isMap(new Map);
     * // => true
     *
     * _.isMap(new WeakMap);
     * // => false
     */
    var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

    /**
     * Performs a partial deep comparison between `object` and `source` to
     * determine if `object` contains equivalent property values.
     *
     * **Note:** This method is equivalent to `_.matches` when `source` is
     * partially applied.
     *
     * Partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. See `_.isEqual`
     * for a list of supported value comparisons.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.isMatch(object, { 'b': 2 });
     * // => true
     *
     * _.isMatch(object, { 'b': 1 });
     * // => false
     */
    function isMatch(object, source) {
      return object === source || baseIsMatch(object, source, getMatchData(source));
    }

    /**
     * This method is like `_.isMatch` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with five
     * arguments: (objValue, srcValue, index|key, object, source).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, srcValue) {
     *   if (isGreeting(objValue) && isGreeting(srcValue)) {
     *     return true;
     *   }
     * }
     *
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatchWith(object, source, customizer);
     * // => true
     */
    function isMatchWith(object, source, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseIsMatch(object, source, getMatchData(source), customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is based on
     * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
     * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
     * `undefined` and other non-number values.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some
      // ActiveX objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a pristine native function.
     *
     * **Note:** This method can't reliably detect native functions in the presence
     * of the core-js package because core-js circumvents this kind of detection.
     * Despite multiple requests, the core-js maintainer has made it clear: any
     * attempt to fix the detection will be obstructed. As a result, we're left
     * with little choice but to throw an error. Unfortunately, this also affects
     * packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
     * which rely on core-js.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (isMaskable(value)) {
        throw new Error(CORE_ERROR_TEXT);
      }
      return baseIsNative(value);
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is `null` or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
     * @example
     *
     * _.isNil(null);
     * // => true
     *
     * _.isNil(void 0);
     * // => true
     *
     * _.isNil(NaN);
     * // => false
     */
    function isNil(value) {
      return value == null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
     * classified as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(3);
     * // => true
     *
     * _.isNumber(Number.MIN_VALUE);
     * // => true
     *
     * _.isNumber(Infinity);
     * // => true
     *
     * _.isNumber('3');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' ||
        (isObjectLike(value) && baseGetTag(value) == numberTag);
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * @static
     * @memberOf _
     * @since 0.8.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
      return typeof Ctor == 'function' && Ctor instanceof Ctor &&
        funcToString.call(Ctor) == objectCtorString;
    }

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

    /**
     * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
     * double precision number which isn't the result of a rounded unsafe integer.
     *
     * **Note:** This method is based on
     * [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
     * @example
     *
     * _.isSafeInteger(3);
     * // => true
     *
     * _.isSafeInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isSafeInteger(Infinity);
     * // => false
     *
     * _.isSafeInteger('3');
     * // => false
     */
    function isSafeInteger(value) {
      return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is classified as a `Set` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     * @example
     *
     * _.isSet(new Set);
     * // => true
     *
     * _.isSet(new WeakSet);
     * // => false
     */
    var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a string, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' ||
        (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && baseGetTag(value) == symbolTag);
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined;
    }

    /**
     * Checks if `value` is classified as a `WeakMap` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
     * @example
     *
     * _.isWeakMap(new WeakMap);
     * // => true
     *
     * _.isWeakMap(new Map);
     * // => false
     */
    function isWeakMap(value) {
      return isObjectLike(value) && getTag(value) == weakMapTag;
    }

    /**
     * Checks if `value` is classified as a `WeakSet` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a weak set, else `false`.
     * @example
     *
     * _.isWeakSet(new WeakSet);
     * // => true
     *
     * _.isWeakSet(new Set);
     * // => false
     */
    function isWeakSet(value) {
      return isObjectLike(value) && baseGetTag(value) == weakSetTag;
    }

    /**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     * @see _.gt
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    var lt = createRelationalOperation(baseLt);

    /**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to
     *  `other`, else `false`.
     * @see _.gte
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    var lte = createRelationalOperation(function(value, other) {
      return value <= other;
    });

    /**
     * Converts `value` to an array.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * _.toArray({ 'a': 1, 'b': 2 });
     * // => [1, 2]
     *
     * _.toArray('abc');
     * // => ['a', 'b', 'c']
     *
     * _.toArray(1);
     * // => []
     *
     * _.toArray(null);
     * // => []
     */
    function toArray(value) {
      if (!value) {
        return [];
      }
      if (isArrayLike(value)) {
        return isString(value) ? stringToArray(value) : copyArray(value);
      }
      if (symIterator && value[symIterator]) {
        return iteratorToArray(value[symIterator]());
      }
      var tag = getTag(value),
          func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

      return func(value);
    }

    /**
     * Converts `value` to a finite number.
     *
     * @static
     * @memberOf _
     * @since 4.12.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted number.
     * @example
     *
     * _.toFinite(3.2);
     * // => 3.2
     *
     * _.toFinite(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toFinite(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toFinite('3.2');
     * // => 3.2
     */
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }

    /**
     * Converts `value` to an integer.
     *
     * **Note:** This method is loosely based on
     * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toInteger(3.2);
     * // => 3
     *
     * _.toInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toInteger(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toInteger('3.2');
     * // => 3
     */
    function toInteger(value) {
      var result = toFinite(value),
          remainder = result % 1;

      return result === result ? (remainder ? result - remainder : result) : 0;
    }

    /**
     * Converts `value` to an integer suitable for use as the length of an
     * array-like object.
     *
     * **Note:** This method is based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toLength(3.2);
     * // => 3
     *
     * _.toLength(Number.MIN_VALUE);
     * // => 0
     *
     * _.toLength(Infinity);
     * // => 4294967295
     *
     * _.toLength('3.2');
     * // => 3
     */
    function toLength(value) {
      return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
    }

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = baseTrim(value);
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable string
     * keyed properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }

    /**
     * Converts `value` to a safe integer. A safe integer can be compared and
     * represented correctly.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toSafeInteger(3.2);
     * // => 3
     *
     * _.toSafeInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toSafeInteger(Infinity);
     * // => 9007199254740991
     *
     * _.toSafeInteger('3.2');
     * // => 3
     */
    function toSafeInteger(value) {
      return value
        ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
        : (value === 0 ? value : 0);
    }

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      return value == null ? '' : baseToString(value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable string keyed properties of source objects to the
     * destination object. Source objects are applied from left to right.
     * Subsequent sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object` and is loosely based on
     * [`Object.assign`](https://mdn.io/Object/assign).
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assignIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * function Bar() {
     *   this.c = 3;
     * }
     *
     * Foo.prototype.b = 2;
     * Bar.prototype.d = 4;
     *
     * _.assign({ 'a': 0 }, new Foo, new Bar);
     * // => { 'a': 1, 'c': 3 }
     */
    var assign = createAssigner(function(object, source) {
      if (isPrototype(source) || isArrayLike(source)) {
        copyObject(source, keys(source), object);
        return;
      }
      for (var key in source) {
        if (hasOwnProperty.call(source, key)) {
          assignValue(object, key, source[key]);
        }
      }
    });

    /**
     * This method is like `_.assign` except that it iterates over own and
     * inherited source properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assign
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * function Bar() {
     *   this.c = 3;
     * }
     *
     * Foo.prototype.b = 2;
     * Bar.prototype.d = 4;
     *
     * _.assignIn({ 'a': 0 }, new Foo, new Bar);
     * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
     */
    var assignIn = createAssigner(function(object, source) {
      copyObject(source, keysIn(source), object);
    });

    /**
     * This method is like `_.assignIn` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extendWith
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignInWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keysIn(source), object, customizer);
    });

    /**
     * This method is like `_.assign` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignInWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keys(source), object, customizer);
    });

    /**
     * Creates an array of values corresponding to `paths` of `object`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Array} Returns the picked values.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _.at(object, ['a[0].b.c', 'a[1]']);
     * // => [3, 4]
     */
    var at = flatRest(baseAt);

    /**
     * Creates an object that inherits from the `prototype` object. If a
     * `properties` object is given, its own enumerable string keyed properties
     * are assigned to the created object.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties == null ? result : baseAssign(result, properties);
    }

    /**
     * Assigns own and inherited enumerable string keyed properties of source
     * objects to the destination object for all destination properties that
     * resolve to `undefined`. Source objects are applied from left to right.
     * Once a property is set, additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaultsDeep
     * @example
     *
     * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var defaults = baseRest(function(object, sources) {
      object = Object(object);

      var index = -1;
      var length = sources.length;
      var guard = length > 2 ? sources[2] : undefined;

      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        length = 1;
      }

      while (++index < length) {
        var source = sources[index];
        var props = keysIn(source);
        var propsIndex = -1;
        var propsLength = props.length;

        while (++propsIndex < propsLength) {
          var key = props[propsIndex];
          var value = object[key];

          if (value === undefined ||
              (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
            object[key] = source[key];
          }
        }
      }

      return object;
    });

    /**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaults
     * @example
     *
     * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
     * // => { 'a': { 'b': 2, 'c': 3 } }
     */
    var defaultsDeep = baseRest(function(args) {
      args.push(undefined, customDefaultsMerge);
      return apply(mergeWith, undefined, args);
    });

    /**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(o) { return o.age < 40; });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // The `_.matches` iteratee shorthand.
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    function findKey(object, predicate) {
      return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(o) { return o.age < 40; });
     * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    function findLastKey(object, predicate) {
      return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
    }

    /**
     * Iterates over own and inherited enumerable string keyed properties of an
     * object and invokes `iteratee` for each property. The iteratee is invoked
     * with three arguments: (value, key, object). Iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forInRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
     */
    function forIn(object, iteratee) {
      return object == null
        ? object
        : baseFor(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
     */
    function forInRight(object, iteratee) {
      return object == null
        ? object
        : baseForRight(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * Iterates over own enumerable string keyed properties of an object and
     * invokes `iteratee` for each property. The iteratee is invoked with three
     * arguments: (value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwnRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forOwn(object, iteratee) {
      return object && baseForOwn(object, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
     */
    function forOwnRight(object, iteratee) {
      return object && baseForOwnRight(object, getIteratee(iteratee, 3));
    }

    /**
     * Creates an array of function property names from own enumerable properties
     * of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functionsIn
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functions(new Foo);
     * // => ['a', 'b']
     */
    function functions(object) {
      return object == null ? [] : baseFunctions(object, keys(object));
    }

    /**
     * Creates an array of function property names from own and inherited
     * enumerable properties of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functions
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functionsIn(new Foo);
     * // => ['a', 'b', 'c']
     */
    function functionsIn(object) {
      return object == null ? [] : baseFunctions(object, keysIn(object));
    }

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined`, the `defaultValue` is returned in its place.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    /**
     * Checks if `path` is a direct property of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': 2 } };
     * var other = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b');
     * // => true
     *
     * _.has(object, ['a', 'b']);
     * // => true
     *
     * _.has(other, 'a');
     * // => false
     */
    function has(object, path) {
      return object != null && hasPath(object, path, baseHas);
    }

    /**
     * Checks if `path` is a direct or inherited property of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.hasIn(object, 'a');
     * // => true
     *
     * _.hasIn(object, 'a.b');
     * // => true
     *
     * _.hasIn(object, ['a', 'b']);
     * // => true
     *
     * _.hasIn(object, 'b');
     * // => false
     */
    function hasIn(object, path) {
      return object != null && hasPath(object, path, baseHasIn);
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite
     * property assignments of previous values.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Object
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     */
    var invert = createInverter(function(result, value, key) {
      if (value != null &&
          typeof value.toString != 'function') {
        value = nativeObjectToString.call(value);
      }

      result[value] = key;
    }, constant(identity));

    /**
     * This method is like `_.invert` except that the inverted object is generated
     * from the results of running each element of `object` thru `iteratee`. The
     * corresponding inverted value of each inverted key is an array of keys
     * responsible for generating the inverted value. The iteratee is invoked
     * with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Object
     * @param {Object} object The object to invert.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invertBy(object);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     *
     * _.invertBy(object, function(value) {
     *   return 'group' + value;
     * });
     * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
     */
    var invertBy = createInverter(function(result, value, key) {
      if (value != null &&
          typeof value.toString != 'function') {
        value = nativeObjectToString.call(value);
      }

      if (hasOwnProperty.call(result, value)) {
        result[value].push(key);
      } else {
        result[value] = [key];
      }
    }, getIteratee);

    /**
     * Invokes the method at `path` of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
     *
     * _.invoke(object, 'a[0].b.c.slice', 1, 3);
     * // => [2, 3]
     */
    var invoke = baseRest(baseInvoke);

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * string keyed property of `object` thru `iteratee`. The iteratee is invoked
     * with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapValues
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    function mapKeys(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        baseAssignValue(result, iteratee(value, key, object), value);
      });
      return result;
    }

    /**
     * Creates an object with the same keys as `object` and values generated
     * by running each own enumerable string keyed property of `object` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapKeys
     * @example
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * _.mapValues(users, function(o) { return o.age; });
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     *
     * // The `_.property` iteratee shorthand.
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    function mapValues(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        baseAssignValue(result, key, iteratee(value, key, object));
      });
      return result;
    }

    /**
     * This method is like `_.assign` except that it recursively merges own and
     * inherited enumerable string keyed properties of source objects into the
     * destination object. Source properties that resolve to `undefined` are
     * skipped if a destination value exists. Array and plain object properties
     * are merged recursively. Other objects and value types are overridden by
     * assignment. Source objects are applied from left to right. Subsequent
     * sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {
     *   'a': [{ 'b': 2 }, { 'd': 4 }]
     * };
     *
     * var other = {
     *   'a': [{ 'c': 3 }, { 'e': 5 }]
     * };
     *
     * _.merge(object, other);
     * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
     */
    var merge = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });

    /**
     * This method is like `_.merge` except that it accepts `customizer` which
     * is invoked to produce the merged values of the destination and source
     * properties. If `customizer` returns `undefined`, merging is handled by the
     * method instead. The `customizer` is invoked with six arguments:
     * (objValue, srcValue, key, object, source, stack).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   if (_.isArray(objValue)) {
     *     return objValue.concat(srcValue);
     *   }
     * }
     *
     * var object = { 'a': [1], 'b': [2] };
     * var other = { 'a': [3], 'b': [4] };
     *
     * _.mergeWith(object, other, customizer);
     * // => { 'a': [1, 3], 'b': [2, 4] }
     */
    var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
      baseMerge(object, source, srcIndex, customizer);
    });

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable property paths of `object` that are not omitted.
     *
     * **Note:** This method is considerably slower than `_.pick`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [paths] The property paths to omit.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omit(object, ['a', 'c']);
     * // => { 'b': '2' }
     */
    var omit = flatRest(function(object, paths) {
      var result = {};
      if (object == null) {
        return result;
      }
      var isDeep = false;
      paths = arrayMap(paths, function(path) {
        path = castPath(path, object);
        isDeep || (isDeep = path.length > 1);
        return path;
      });
      copyObject(object, getAllKeysIn(object), result);
      if (isDeep) {
        result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
      }
      var length = paths.length;
      while (length--) {
        baseUnset(result, paths[length]);
      }
      return result;
    });

    /**
     * The opposite of `_.pickBy`; this method creates an object composed of
     * the own and inherited enumerable string keyed properties of `object` that
     * `predicate` doesn't return truthy for. The predicate is invoked with two
     * arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Function} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omitBy(object, _.isNumber);
     * // => { 'b': '2' }
     */
    function omitBy(object, predicate) {
      return pickBy(object, negate(getIteratee(predicate)));
    }

    /**
     * Creates an object composed of the picked `object` properties.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pick(object, ['a', 'c']);
     * // => { 'a': 1, 'c': 3 }
     */
    var pick = flatRest(function(object, paths) {
      return object == null ? {} : basePick(object, paths);
    });

    /**
     * Creates an object composed of the `object` properties `predicate` returns
     * truthy for. The predicate is invoked with two arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Function} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pickBy(object, _.isNumber);
     * // => { 'a': 1, 'c': 3 }
     */
    function pickBy(object, predicate) {
      if (object == null) {
        return {};
      }
      var props = arrayMap(getAllKeysIn(object), function(prop) {
        return [prop];
      });
      predicate = getIteratee(predicate);
      return basePickBy(object, props, function(value, path) {
        return predicate(value, path[0]);
      });
    }

    /**
     * This method is like `_.get` except that if the resolved value is a
     * function it's invoked with the `this` binding of its parent object and
     * its result is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a[0].b.c3', 'default');
     * // => 'default'
     *
     * _.result(object, 'a[0].b.c3', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultValue) {
      path = castPath(path, object);

      var index = -1,
          length = path.length;

      // Ensure the loop is entered when path is empty.
      if (!length) {
        length = 1;
        object = undefined;
      }
      while (++index < length) {
        var value = object == null ? undefined : object[toKey(path[index])];
        if (value === undefined) {
          index = length;
          value = defaultValue;
        }
        object = isFunction(value) ? value.call(object) : value;
      }
      return object;
    }

    /**
     * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
     * it's created. Arrays are created for missing index properties while objects
     * are created for all other missing properties. Use `_.setWith` to customize
     * `path` creation.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, ['x', '0', 'y', 'z'], 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      return object == null ? object : baseSet(object, path, value);
    }

    /**
     * This method is like `_.set` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.setWith(object, '[0][1]', 'a', Object);
     * // => { '0': { '1': 'a' } }
     */
    function setWith(object, path, value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseSet(object, path, value, customizer);
    }

    /**
     * Creates an array of own enumerable string keyed-value pairs for `object`
     * which can be consumed by `_.fromPairs`. If `object` is a map or set, its
     * entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entries
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairs(new Foo);
     * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
     */
    var toPairs = createToPairs(keys);

    /**
     * Creates an array of own and inherited enumerable string keyed-value pairs
     * for `object` which can be consumed by `_.fromPairs`. If `object` is a map
     * or set, its entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entriesIn
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairsIn(new Foo);
     * // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
     */
    var toPairsIn = createToPairs(keysIn);

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own
     * enumerable string keyed properties thru `iteratee`, with each invocation
     * potentially mutating the `accumulator` object. If `accumulator` is not
     * provided, a new object with the same `[[Prototype]]` will be used. The
     * iteratee is invoked with four arguments: (accumulator, value, key, object).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * }, []);
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function transform(object, iteratee, accumulator) {
      var isArr = isArray(object),
          isArrLike = isArr || isBuffer(object) || isTypedArray(object);

      iteratee = getIteratee(iteratee, 4);
      if (accumulator == null) {
        var Ctor = object && object.constructor;
        if (isArrLike) {
          accumulator = isArr ? new Ctor : [];
        }
        else if (isObject(object)) {
          accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
        }
        else {
          accumulator = {};
        }
      }
      (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Removes the property at `path` of `object`.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 7 } }] };
     * _.unset(object, 'a[0].b.c');
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     *
     * _.unset(object, ['a', '0', 'b', 'c']);
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     */
    function unset(object, path) {
      return object == null ? true : baseUnset(object, path);
    }

    /**
     * This method is like `_.set` except that accepts `updater` to produce the
     * value to set. Use `_.updateWith` to customize `path` creation. The `updater`
     * is invoked with one argument: (value).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.update(object, 'a[0].b.c', function(n) { return n * n; });
     * console.log(object.a[0].b.c);
     * // => 9
     *
     * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
     * console.log(object.x[0].y.z);
     * // => 0
     */
    function update(object, path, updater) {
      return object == null ? object : baseUpdate(object, path, castFunction(updater));
    }

    /**
     * This method is like `_.update` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.updateWith(object, '[0][1]', _.constant('a'), Object);
     * // => { '0': { '1': 'a' } }
     */
    function updateWith(object, path, updater, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
    }

    /**
     * Creates an array of the own enumerable string keyed property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return object == null ? [] : baseValues(object, keys(object));
    }

    /**
     * Creates an array of the own and inherited enumerable string keyed property
     * values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return object == null ? [] : baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Clamps `number` within the inclusive `lower` and `upper` bounds.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Number
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     * @example
     *
     * _.clamp(-10, -5, 5);
     * // => -5
     *
     * _.clamp(10, -5, 5);
     * // => 5
     */
    function clamp(number, lower, upper) {
      if (upper === undefined) {
        upper = lower;
        lower = undefined;
      }
      if (upper !== undefined) {
        upper = toNumber(upper);
        upper = upper === upper ? upper : 0;
      }
      if (lower !== undefined) {
        lower = toNumber(lower);
        lower = lower === lower ? lower : 0;
      }
      return baseClamp(toNumber(number), lower, upper);
    }

    /**
     * Checks if `n` is between `start` and up to, but not including, `end`. If
     * `end` is not specified, it's set to `start` with `start` then set to `0`.
     * If `start` is greater than `end` the params are swapped to support
     * negative ranges.
     *
     * @static
     * @memberOf _
     * @since 3.3.0
     * @category Number
     * @param {number} number The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     * @see _.range, _.rangeRight
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     *
     * _.inRange(-3, -2, -6);
     * // => true
     */
    function inRange(number, start, end) {
      start = toFinite(start);
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = toFinite(end);
      }
      number = toNumber(number);
      return baseInRange(number, start, end);
    }

    /**
     * Produces a random number between the inclusive `lower` and `upper` bounds.
     * If only one argument is provided a number between `0` and the given number
     * is returned. If `floating` is `true`, or either `lower` or `upper` are
     * floats, a floating-point number is returned instead of an integer.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Number
     * @param {number} [lower=0] The lower bound.
     * @param {number} [upper=1] The upper bound.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(lower, upper, floating) {
      if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
        upper = floating = undefined;
      }
      if (floating === undefined) {
        if (typeof upper == 'boolean') {
          floating = upper;
          upper = undefined;
        }
        else if (typeof lower == 'boolean') {
          floating = lower;
          lower = undefined;
        }
      }
      if (lower === undefined && upper === undefined) {
        lower = 0;
        upper = 1;
      }
      else {
        lower = toFinite(lower);
        if (upper === undefined) {
          upper = lower;
          lower = 0;
        } else {
          upper = toFinite(upper);
        }
      }
      if (lower > upper) {
        var temp = lower;
        lower = upper;
        upper = temp;
      }
      if (floating || lower % 1 || upper % 1) {
        var rand = nativeRandom();
        return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
      }
      return baseRandom(lower, upper);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar--');
     * // => 'fooBar'
     *
     * _.camelCase('__FOO_BAR__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? capitalize(word) : word);
    });

    /**
     * Converts the first character of `string` to upper case and the remaining
     * to lower case.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('FRED');
     * // => 'Fred'
     */
    function capitalize(string) {
      return upperFirst(toString(string).toLowerCase());
    }

    /**
     * Deburrs `string` by converting
     * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
     * letters to basic Latin letters and removing
     * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = toString(string);
      return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search up to.
     * @returns {boolean} Returns `true` if `string` ends with `target`,
     *  else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = toString(string);
      target = baseToString(target);

      var length = string.length;
      position = position === undefined
        ? length
        : baseClamp(toInteger(position), 0, length);

      var end = position;
      position -= target.length;
      return position >= 0 && string.slice(position, end) == target;
    }

    /**
     * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
     * corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional
     * characters use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value. See
     * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * When working with HTML you should always
     * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
     * XSS vectors.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      string = toString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
     * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https://lodash\.com/\)'
     */
    function escapeRegExp(string) {
      string = toString(string);
      return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : string;
    }

    /**
     * Converts `string` to
     * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__FOO_BAR__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Converts `string`, as space separated words, to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.lowerCase('--Foo-Bar--');
     * // => 'foo bar'
     *
     * _.lowerCase('fooBar');
     * // => 'foo bar'
     *
     * _.lowerCase('__FOO_BAR__');
     * // => 'foo bar'
     */
    var lowerCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toLowerCase();
    });

    /**
     * Converts the first character of `string` to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.lowerFirst('Fred');
     * // => 'fred'
     *
     * _.lowerFirst('FRED');
     * // => 'fRED'
     */
    var lowerFirst = createCaseFirst('toLowerCase');

    /**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      if (!length || strLength >= length) {
        return string;
      }
      var mid = (length - strLength) / 2;
      return (
        createPadding(nativeFloor(mid), chars) +
        string +
        createPadding(nativeCeil(mid), chars)
      );
    }

    /**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padEnd('abc', 6);
     * // => 'abc   '
     *
     * _.padEnd('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padEnd('abc', 3);
     * // => 'abc'
     */
    function padEnd(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (string + createPadding(length - strLength, chars))
        : string;
    }

    /**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padStart('abc', 6);
     * // => '   abc'
     *
     * _.padStart('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padStart('abc', 3);
     * // => 'abc'
     */
    function padStart(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (createPadding(length - strLength, chars) + string)
        : string;
    }

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a
     * hexadecimal, in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the
     * [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix=10] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      if (guard || radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=1] The number of times to repeat the string.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n, guard) {
      if ((guard ? isIterateeCall(string, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      return baseRepeat(toString(string), n);
    }

    /**
     * Replaces matches for `pattern` in `string` with `replacement`.
     *
     * **Note:** This method is based on
     * [`String#replace`](https://mdn.io/String/replace).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to modify.
     * @param {RegExp|string} pattern The pattern to replace.
     * @param {Function|string} replacement The match replacement.
     * @returns {string} Returns the modified string.
     * @example
     *
     * _.replace('Hi Fred', 'Fred', 'Barney');
     * // => 'Hi Barney'
     */
    function replace() {
      var args = arguments,
          string = toString(args[0]);

      return args.length < 3 ? string : string.replace(args[1], args[2]);
    }

    /**
     * Converts `string` to
     * [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--FOO-BAR--');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Splits `string` by `separator`.
     *
     * **Note:** This method is based on
     * [`String#split`](https://mdn.io/String/split).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to split.
     * @param {RegExp|string} separator The separator pattern to split by.
     * @param {number} [limit] The length to truncate results to.
     * @returns {Array} Returns the string segments.
     * @example
     *
     * _.split('a-b-c', '-', 2);
     * // => ['a', 'b']
     */
    function split(string, separator, limit) {
      if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
        separator = limit = undefined;
      }
      limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;
      if (!limit) {
        return [];
      }
      string = toString(string);
      if (string && (
            typeof separator == 'string' ||
            (separator != null && !isRegExp(separator))
          )) {
        separator = baseToString(separator);
        if (!separator && hasUnicode(string)) {
          return castSlice(stringToArray(string), 0, limit);
        }
      }
      return string.split(separator, limit);
    }

    /**
     * Converts `string` to
     * [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @since 3.1.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar--');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__FOO_BAR__');
     * // => 'FOO BAR'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + upperFirst(word);
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`,
     *  else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = toString(string);
      position = position == null
        ? 0
        : baseClamp(toInteger(position), 0, string.length);

      target = baseToString(target);
      return string.slice(position, position + target.length) == target;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is given, it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options={}] The options object.
     * @param {RegExp} [options.escape=_.templateSettings.escape]
     *  The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
     *  The "evaluate" delimiter.
     * @param {Object} [options.imports=_.templateSettings.imports]
     *  An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
     *  The "interpolate" delimiter.
     * @param {string} [options.sourceURL='lodash.templateSources[n]']
     *  The sourceURL of the compiled template.
     * @param {string} [options.variable='obj']
     *  The data object variable name.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // Use the "interpolate" delimiter to create a compiled template.
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // Use the HTML "escape" delimiter to escape data property values.
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the internal `print` function in "evaluate" delimiters.
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // Use the ES template literal delimiter as an "interpolate" delimiter.
     * // Disable support by replacing the "interpolate" delimiter.
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // Use backslashes to treat delimiters as plain text.
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // Use the `imports` option to import `jQuery` as `jq`.
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the `sourceURL` option to specify a custom sourceURL for the template.
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
     *
     * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // Use custom template delimiters.
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // Use the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and stack traces.
     * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, guard) {
      // Based on John Resig's `tmpl` implementation
      // (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined;
      }
      string = toString(string);
      options = assignInWith({}, options, settings, customDefaultsAssignIn);

      var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      // Use a sourceURL for easier debugging.
      // The sourceURL gets injected into the source that's eval-ed, so be careful
      // to normalize all kinds of whitespace, so e.g. newlines (and unicode versions of it) can't sneak in
      // and escape the comment, thus injecting code that gets evaled.
      var sourceURL = '//# sourceURL=' +
        (hasOwnProperty.call(options, 'sourceURL')
          ? (options.sourceURL + '').replace(/\s/g, ' ')
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products needs `match` returned in
        // order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = hasOwnProperty.call(options, 'variable') && options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Throw an error if a forbidden character was found in `variable`, to prevent
      // potential command injection attacks.
      else if (reForbiddenIdentifierChars.test(variable)) {
        throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
      }

      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source)
          .apply(undefined, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Converts `string`, as a whole, to lower case just like
     * [String#toLowerCase](https://mdn.io/toLowerCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.toLower('--Foo-Bar--');
     * // => '--foo-bar--'
     *
     * _.toLower('fooBar');
     * // => 'foobar'
     *
     * _.toLower('__FOO_BAR__');
     * // => '__foo_bar__'
     */
    function toLower(value) {
      return toString(value).toLowerCase();
    }

    /**
     * Converts `string`, as a whole, to upper case just like
     * [String#toUpperCase](https://mdn.io/toUpperCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.toUpper('--foo-bar--');
     * // => '--FOO-BAR--'
     *
     * _.toUpper('fooBar');
     * // => 'FOOBAR'
     *
     * _.toUpper('__foo_bar__');
     * // => '__FOO_BAR__'
     */
    function toUpper(value) {
      return toString(value).toUpperCase();
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return baseTrim(string);
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          chrSymbols = stringToArray(chars),
          start = charsStartIndex(strSymbols, chrSymbols),
          end = charsEndIndex(strSymbols, chrSymbols) + 1;

      return castSlice(strSymbols, start, end).join('');
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimEnd('  abc  ');
     * // => '  abc'
     *
     * _.trimEnd('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimEnd(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.slice(0, trimmedEndIndex(string) + 1);
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;

      return castSlice(strSymbols, 0, end).join('');
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimStart('  abc  ');
     * // => 'abc  '
     *
     * _.trimStart('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimStart(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.replace(reTrimStart, '');
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          start = charsStartIndex(strSymbols, stringToArray(chars));

      return castSlice(strSymbols, start).join('');
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object} [options={}] The options object.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.truncate('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function truncate(string, options) {
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (isObject(options)) {
        var separator = 'separator' in options ? options.separator : separator;
        length = 'length' in options ? toInteger(options.length) : length;
        omission = 'omission' in options ? baseToString(options.omission) : omission;
      }
      string = toString(string);

      var strLength = string.length;
      if (hasUnicode(string)) {
        var strSymbols = stringToArray(string);
        strLength = strSymbols.length;
      }
      if (length >= strLength) {
        return string;
      }
      var end = length - stringSize(omission);
      if (end < 1) {
        return omission;
      }
      var result = strSymbols
        ? castSlice(strSymbols, 0, end).join('')
        : string.slice(0, end);

      if (separator === undefined) {
        return result + omission;
      }
      if (strSymbols) {
        end += (result.length - end);
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              substring = result;

          if (!separator.global) {
            separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            var newEnd = match.index;
          }
          result = result.slice(0, newEnd === undefined ? end : newEnd);
        }
      } else if (string.indexOf(baseToString(separator), end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
     * their corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional
     * HTML entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @since 0.6.0
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = toString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Converts `string`, as space separated words, to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.upperCase('--foo-bar');
     * // => 'FOO BAR'
     *
     * _.upperCase('fooBar');
     * // => 'FOO BAR'
     *
     * _.upperCase('__foo_bar__');
     * // => 'FOO BAR'
     */
    var upperCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toUpperCase();
    });

    /**
     * Converts the first character of `string` to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.upperFirst('fred');
     * // => 'Fred'
     *
     * _.upperFirst('FRED');
     * // => 'FRED'
     */
    var upperFirst = createCaseFirst('toUpperCase');

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      string = toString(string);
      pattern = guard ? undefined : pattern;

      if (pattern === undefined) {
        return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
      }
      return string.match(pattern) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Function} func The function to attempt.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // Avoid throwing errors for invalid selectors.
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = baseRest(function(func, args) {
      try {
        return apply(func, undefined, args);
      } catch (e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method.
     *
     * **Note:** This method doesn't set the "length" property of bound functions.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} methodNames The object method names to bind.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'click': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view, ['click']);
     * jQuery(element).on('click', view.click);
     * // => Logs 'clicked docs' when clicked.
     */
    var bindAll = flatRest(function(object, methodNames) {
      arrayEach(methodNames, function(key) {
        key = toKey(key);
        baseAssignValue(object, key, bind(object[key], object));
      });
      return object;
    });

    /**
     * Creates a function that iterates over `pairs` and invokes the corresponding
     * function of the first predicate to return truthy. The predicate-function
     * pairs are invoked with the `this` binding and arguments of the created
     * function.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Array} pairs The predicate-function pairs.
     * @returns {Function} Returns the new composite function.
     * @example
     *
     * var func = _.cond([
     *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
     *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
     *   [_.stubTrue,                      _.constant('no match')]
     * ]);
     *
     * func({ 'a': 1, 'b': 2 });
     * // => 'matches A'
     *
     * func({ 'a': 0, 'b': 1 });
     * // => 'matches B'
     *
     * func({ 'a': '1', 'b': '2' });
     * // => 'no match'
     */
    function cond(pairs) {
      var length = pairs == null ? 0 : pairs.length,
          toIteratee = getIteratee();

      pairs = !length ? [] : arrayMap(pairs, function(pair) {
        if (typeof pair[1] != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        return [toIteratee(pair[0]), pair[1]];
      });

      return baseRest(function(args) {
        var index = -1;
        while (++index < length) {
          var pair = pairs[index];
          if (apply(pair[0], this, args)) {
            return apply(pair[1], this, args);
          }
        }
      });
    }

    /**
     * Creates a function that invokes the predicate properties of `source` with
     * the corresponding property values of a given object, returning `true` if
     * all predicates return truthy, else `false`.
     *
     * **Note:** The created function is equivalent to `_.conformsTo` with
     * `source` partially applied.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 2, 'b': 1 },
     *   { 'a': 1, 'b': 2 }
     * ];
     *
     * _.filter(objects, _.conforms({ 'b': function(n) { return n > 1; } }));
     * // => [{ 'a': 1, 'b': 2 }]
     */
    function conforms(source) {
      return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new constant function.
     * @example
     *
     * var objects = _.times(2, _.constant({ 'a': 1 }));
     *
     * console.log(objects);
     * // => [{ 'a': 1 }, { 'a': 1 }]
     *
     * console.log(objects[0] === objects[1]);
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Checks `value` to determine whether a default value should be returned in
     * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
     * or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.14.0
     * @category Util
     * @param {*} value The value to check.
     * @param {*} defaultValue The default value.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * _.defaultTo(1, 10);
     * // => 1
     *
     * _.defaultTo(undefined, 10);
     * // => 10
     */
    function defaultTo(value, defaultValue) {
      return (value == null || value !== value) ? defaultValue : value;
    }

    /**
     * Creates a function that returns the result of invoking the given functions
     * with the `this` binding of the created function, where each successive
     * invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {...(Function|Function[])} [funcs] The functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flowRight
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow([_.add, square]);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the given functions from right to left.
     *
     * @static
     * @since 3.0.0
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} [funcs] The functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flow
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight([square, _.add]);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * This method returns the first argument it receives.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'a': 1 };
     *
     * console.log(_.identity(object) === object);
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function that invokes `func` with the arguments of the created
     * function. If `func` is a property name, the created function returns the
     * property value for a given element. If `func` is an array or object, the
     * created function returns `true` for elements that contain the equivalent
     * source properties, otherwise it returns `false`.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Util
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
     * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, _.iteratee(['user', 'fred']));
     * // => [{ 'user': 'fred', 'age': 40 }]
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, _.iteratee('user'));
     * // => ['barney', 'fred']
     *
     * // Create custom iteratee shorthands.
     * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
     *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
     *     return func.test(string);
     *   };
     * });
     *
     * _.filter(['abc', 'def'], /ef/);
     * // => ['def']
     */
    function iteratee(func) {
      return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that performs a partial deep comparison between a given
     * object and `source`, returning `true` if the given object has equivalent
     * property values, else `false`.
     *
     * **Note:** The created function is equivalent to `_.isMatch` with `source`
     * partially applied.
     *
     * Partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. See `_.isEqual`
     * for a list of supported value comparisons.
     *
     * **Note:** Multiple values can be checked by combining several matchers
     * using `_.overSome`
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));
     * // => [{ 'a': 4, 'b': 5, 'c': 6 }]
     *
     * // Checking for several possible values
     * _.filter(objects, _.overSome([_.matches({ 'a': 1 }), _.matches({ 'a': 4 })]));
     * // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
     */
    function matches(source) {
      return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that performs a partial deep comparison between the
     * value at `path` of a given object to `srcValue`, returning `true` if the
     * object value is equivalent, else `false`.
     *
     * **Note:** Partial comparisons will match empty array and empty object
     * `srcValue` values against any array or object value, respectively. See
     * `_.isEqual` for a list of supported value comparisons.
     *
     * **Note:** Multiple values can be checked by combining several matchers
     * using `_.overSome`
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.find(objects, _.matchesProperty('a', 4));
     * // => { 'a': 4, 'b': 5, 'c': 6 }
     *
     * // Checking for several possible values
     * _.filter(objects, _.overSome([_.matchesProperty('a', 1), _.matchesProperty('a', 4)]));
     * // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
     */
    function matchesProperty(path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that invokes the method at `path` of a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': _.constant(2) } },
     *   { 'a': { 'b': _.constant(1) } }
     * ];
     *
     * _.map(objects, _.method('a.b'));
     * // => [2, 1]
     *
     * _.map(objects, _.method(['a', 'b']));
     * // => [2, 1]
     */
    var method = baseRest(function(path, args) {
      return function(object) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path of `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = baseRest(function(object, args) {
      return function(path) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * Adds all own enumerable string keyed function properties of a source
     * object to the destination object. If `object` is a function, then methods
     * are added to its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.chain=true] Specify whether mixins are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      var props = keys(source),
          methodNames = baseFunctions(source, props);

      if (options == null &&
          !(isObject(source) && (methodNames.length || !props.length))) {
        options = source;
        source = object;
        object = this;
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
          isFunc = isFunction(object);

      arrayEach(methodNames, function(methodName) {
        var func = source[methodName];
        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = function() {
            var chainAll = this.__chain__;
            if (chain || chainAll) {
              var result = object(this.__wrapped__),
                  actions = result.__actions__ = copyArray(this.__actions__);

              actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
              result.__chain__ = chainAll;
              return result;
            }
            return func.apply(object, arrayPush([this.value()], arguments));
          };
        }
      });

      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      if (root._ === this) {
        root._ = oldDash;
      }
      return this;
    }

    /**
     * This method returns `undefined`.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Util
     * @example
     *
     * _.times(2, _.noop);
     * // => [undefined, undefined]
     */
    function noop() {
      // No operation performed.
    }

    /**
     * Creates a function that gets the argument at index `n`. If `n` is negative,
     * the nth argument from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [n=0] The index of the argument to return.
     * @returns {Function} Returns the new pass-thru function.
     * @example
     *
     * var func = _.nthArg(1);
     * func('a', 'b', 'c', 'd');
     * // => 'b'
     *
     * var func = _.nthArg(-2);
     * func('a', 'b', 'c', 'd');
     * // => 'c'
     */
    function nthArg(n) {
      n = toInteger(n);
      return baseRest(function(args) {
        return baseNth(args, n);
      });
    }

    /**
     * Creates a function that invokes `iteratees` with the arguments it receives
     * and returns their results.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [iteratees=[_.identity]]
     *  The iteratees to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.over([Math.max, Math.min]);
     *
     * func(1, 2, 3, 4);
     * // => [4, 1]
     */
    var over = createOver(arrayMap);

    /**
     * Creates a function that checks if **all** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * Following shorthands are possible for providing predicates.
     * Pass an `Object` and it will be used as an parameter for `_.matches` to create the predicate.
     * Pass an `Array` of parameters for `_.matchesProperty` and the predicate will be created using them.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [predicates=[_.identity]]
     *  The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overEvery([Boolean, isFinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => false
     *
     * func(NaN);
     * // => false
     */
    var overEvery = createOver(arrayEvery);

    /**
     * Creates a function that checks if **any** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * Following shorthands are possible for providing predicates.
     * Pass an `Object` and it will be used as an parameter for `_.matches` to create the predicate.
     * Pass an `Array` of parameters for `_.matchesProperty` and the predicate will be created using them.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [predicates=[_.identity]]
     *  The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overSome([Boolean, isFinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => true
     *
     * func(NaN);
     * // => false
     *
     * var matchesFunc = _.overSome([{ 'a': 1 }, { 'a': 2 }])
     * var matchesPropertyFunc = _.overSome([['a', 1], ['a', 2]])
     */
    var overSome = createOver(arraySome);

    /**
     * Creates a function that returns the value at `path` of a given object.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': 2 } },
     *   { 'a': { 'b': 1 } }
     * ];
     *
     * _.map(objects, _.property('a.b'));
     * // => [2, 1]
     *
     * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the value at a given path of `object`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf(object) {
      return function(path) {
        return object == null ? undefined : baseGet(object, path);
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
     * `start` is specified without an `end` or `step`. If `end` is not specified,
     * it's set to `start` with `start` then set to `0`.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.rangeRight
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(-4);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    var range = createRange();

    /**
     * This method is like `_.range` except that it populates values in
     * descending order.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.range
     * @example
     *
     * _.rangeRight(4);
     * // => [3, 2, 1, 0]
     *
     * _.rangeRight(-4);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 5);
     * // => [4, 3, 2, 1]
     *
     * _.rangeRight(0, 20, 5);
     * // => [15, 10, 5, 0]
     *
     * _.rangeRight(0, -4, -1);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.rangeRight(0);
     * // => []
     */
    var rangeRight = createRange(true);

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    /**
     * This method returns a new empty object.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Object} Returns the new empty object.
     * @example
     *
     * var objects = _.times(2, _.stubObject);
     *
     * console.log(objects);
     * // => [{}, {}]
     *
     * console.log(objects[0] === objects[1]);
     * // => false
     */
    function stubObject() {
      return {};
    }

    /**
     * This method returns an empty string.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {string} Returns the empty string.
     * @example
     *
     * _.times(2, _.stubString);
     * // => ['', '']
     */
    function stubString() {
      return '';
    }

    /**
     * This method returns `true`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `true`.
     * @example
     *
     * _.times(2, _.stubTrue);
     * // => [true, true]
     */
    function stubTrue() {
      return true;
    }

    /**
     * Invokes the iteratee `n` times, returning an array of the results of
     * each invocation. The iteratee is invoked with one argument; (index).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.times(3, String);
     * // => ['0', '1', '2']
     *
     *  _.times(4, _.constant(0));
     * // => [0, 0, 0, 0]
     */
    function times(n, iteratee) {
      n = toInteger(n);
      if (n < 1 || n > MAX_SAFE_INTEGER) {
        return [];
      }
      var index = MAX_ARRAY_LENGTH,
          length = nativeMin(n, MAX_ARRAY_LENGTH);

      iteratee = getIteratee(iteratee);
      n -= MAX_ARRAY_LENGTH;

      var result = baseTimes(length, iteratee);
      while (++index < n) {
        iteratee(index);
      }
      return result;
    }

    /**
     * Converts `value` to a property path array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {*} value The value to convert.
     * @returns {Array} Returns the new property path array.
     * @example
     *
     * _.toPath('a.b.c');
     * // => ['a', 'b', 'c']
     *
     * _.toPath('a[0].b.c');
     * // => ['a', '0', 'b', 'c']
     */
    function toPath(value) {
      if (isArray(value)) {
        return arrayMap(value, toKey);
      }
      return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
    }

    /**
     * Generates a unique ID. If `prefix` is given, the ID is appended to it.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {string} [prefix=''] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return toString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {number} augend The first number in an addition.
     * @param {number} addend The second number in an addition.
     * @returns {number} Returns the total.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    var add = createMathOperation(function(augend, addend) {
      return augend + addend;
    }, 0);

    /**
     * Computes `number` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * Divide two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} dividend The first number in a division.
     * @param {number} divisor The second number in a division.
     * @returns {number} Returns the quotient.
     * @example
     *
     * _.divide(6, 4);
     * // => 1.5
     */
    var divide = createMathOperation(function(dividend, divisor) {
      return dividend / divisor;
    }, 1);

    /**
     * Computes `number` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * Computes the maximum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => undefined
     */
    function max(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseGt)
        : undefined;
    }

    /**
     * This method is like `_.max` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.maxBy(objects, function(o) { return o.n; });
     * // => { 'n': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.maxBy(objects, 'n');
     * // => { 'n': 2 }
     */
    function maxBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee, 2), baseGt)
        : undefined;
    }

    /**
     * Computes the mean of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the mean.
     * @example
     *
     * _.mean([4, 2, 8, 6]);
     * // => 5
     */
    function mean(array) {
      return baseMean(array, identity);
    }

    /**
     * This method is like `_.mean` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be averaged.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the mean.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.meanBy(objects, function(o) { return o.n; });
     * // => 5
     *
     * // The `_.property` iteratee shorthand.
     * _.meanBy(objects, 'n');
     * // => 5
     */
    function meanBy(array, iteratee) {
      return baseMean(array, getIteratee(iteratee, 2));
    }

    /**
     * Computes the minimum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => undefined
     */
    function min(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseLt)
        : undefined;
    }

    /**
     * This method is like `_.min` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.minBy(objects, function(o) { return o.n; });
     * // => { 'n': 1 }
     *
     * // The `_.property` iteratee shorthand.
     * _.minBy(objects, 'n');
     * // => { 'n': 1 }
     */
    function minBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee, 2), baseLt)
        : undefined;
    }

    /**
     * Multiply two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} multiplier The first number in a multiplication.
     * @param {number} multiplicand The second number in a multiplication.
     * @returns {number} Returns the product.
     * @example
     *
     * _.multiply(6, 4);
     * // => 24
     */
    var multiply = createMathOperation(function(multiplier, multiplicand) {
      return multiplier * multiplicand;
    }, 1);

    /**
     * Computes `number` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * Subtract two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {number} minuend The first number in a subtraction.
     * @param {number} subtrahend The second number in a subtraction.
     * @returns {number} Returns the difference.
     * @example
     *
     * _.subtract(6, 4);
     * // => 2
     */
    var subtract = createMathOperation(function(minuend, subtrahend) {
      return minuend - subtrahend;
    }, 0);

    /**
     * Computes the sum of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 2, 8, 6]);
     * // => 20
     */
    function sum(array) {
      return (array && array.length)
        ? baseSum(array, identity)
        : 0;
    }

    /**
     * This method is like `_.sum` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be summed.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the sum.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.sumBy(objects, function(o) { return o.n; });
     * // => 20
     *
     * // The `_.property` iteratee shorthand.
     * _.sumBy(objects, 'n');
     * // => 20
     */
    function sumBy(array, iteratee) {
      return (array && array.length)
        ? baseSum(array, getIteratee(iteratee, 2))
        : 0;
    }

    /*------------------------------------------------------------------------*/

    // Add methods that return wrapped values in chain sequences.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.assignIn = assignIn;
    lodash.assignInWith = assignInWith;
    lodash.assignWith = assignWith;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.castArray = castArray;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.concat = concat;
    lodash.cond = cond;
    lodash.conforms = conforms;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsDeep = defaultsDeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.differenceBy = differenceBy;
    lodash.differenceWith = differenceWith;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatMap = flatMap;
    lodash.flatMapDeep = flatMapDeep;
    lodash.flatMapDepth = flatMapDepth;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flattenDepth = flattenDepth;
    lodash.flip = flip;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.fromPairs = fromPairs;
    lodash.functions = functions;
    lodash.functionsIn = functionsIn;
    lodash.groupBy = groupBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.intersectionBy = intersectionBy;
    lodash.intersectionWith = intersectionWith;
    lodash.invert = invert;
    lodash.invertBy = invertBy;
    lodash.invokeMap = invokeMap;
    lodash.iteratee = iteratee;
    lodash.keyBy = keyBy;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapKeys = mapKeys;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.matchesProperty = matchesProperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.mergeWith = mergeWith;
    lodash.method = method;
    lodash.methodOf = methodOf;
    lodash.mixin = mixin;
    lodash.negate = negate;
    lodash.nthArg = nthArg;
    lodash.omit = omit;
    lodash.omitBy = omitBy;
    lodash.once = once;
    lodash.orderBy = orderBy;
    lodash.over = over;
    lodash.overArgs = overArgs;
    lodash.overEvery = overEvery;
    lodash.overSome = overSome;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pickBy = pickBy;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAll = pullAll;
    lodash.pullAllBy = pullAllBy;
    lodash.pullAllWith = pullAllWith;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rangeRight = rangeRight;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.reverse = reverse;
    lodash.sampleSize = sampleSize;
    lodash.set = set;
    lodash.setWith = setWith;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortedUniq = sortedUniq;
    lodash.sortedUniqBy = sortedUniqBy;
    lodash.split = split;
    lodash.spread = spread;
    lodash.tail = tail;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.toArray = toArray;
    lodash.toPairs = toPairs;
    lodash.toPairsIn = toPairsIn;
    lodash.toPath = toPath;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.unary = unary;
    lodash.union = union;
    lodash.unionBy = unionBy;
    lodash.unionWith = unionWith;
    lodash.uniq = uniq;
    lodash.uniqBy = uniqBy;
    lodash.uniqWith = uniqWith;
    lodash.unset = unset;
    lodash.unzip = unzip;
    lodash.unzipWith = unzipWith;
    lodash.update = update;
    lodash.updateWith = updateWith;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.without = without;
    lodash.words = words;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.xorBy = xorBy;
    lodash.xorWith = xorWith;
    lodash.zip = zip;
    lodash.zipObject = zipObject;
    lodash.zipObjectDeep = zipObjectDeep;
    lodash.zipWith = zipWith;

    // Add aliases.
    lodash.entries = toPairs;
    lodash.entriesIn = toPairsIn;
    lodash.extend = assignIn;
    lodash.extendWith = assignInWith;

    // Add methods to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add methods that return unwrapped values in chain sequences.
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clamp = clamp;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.cloneDeepWith = cloneDeepWith;
    lodash.cloneWith = cloneWith;
    lodash.conformsTo = conformsTo;
    lodash.deburr = deburr;
    lodash.defaultTo = defaultTo;
    lodash.divide = divide;
    lodash.endsWith = endsWith;
    lodash.eq = eq;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.floor = floor;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.hasIn = hasIn;
    lodash.head = head;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.inRange = inRange;
    lodash.invoke = invoke;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isArrayBuffer = isArrayBuffer;
    lodash.isArrayLike = isArrayLike;
    lodash.isArrayLikeObject = isArrayLikeObject;
    lodash.isBoolean = isBoolean;
    lodash.isBuffer = isBuffer;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isEqualWith = isEqualWith;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isInteger = isInteger;
    lodash.isLength = isLength;
    lodash.isMap = isMap;
    lodash.isMatch = isMatch;
    lodash.isMatchWith = isMatchWith;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNil = isNil;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isObjectLike = isObjectLike;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isSafeInteger = isSafeInteger;
    lodash.isSet = isSet;
    lodash.isString = isString;
    lodash.isSymbol = isSymbol;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.isWeakMap = isWeakMap;
    lodash.isWeakSet = isWeakSet;
    lodash.join = join;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.lowerCase = lowerCase;
    lodash.lowerFirst = lowerFirst;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.maxBy = maxBy;
    lodash.mean = mean;
    lodash.meanBy = meanBy;
    lodash.min = min;
    lodash.minBy = minBy;
    lodash.stubArray = stubArray;
    lodash.stubFalse = stubFalse;
    lodash.stubObject = stubObject;
    lodash.stubString = stubString;
    lodash.stubTrue = stubTrue;
    lodash.multiply = multiply;
    lodash.nth = nth;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padEnd = padEnd;
    lodash.padStart = padStart;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.replace = replace;
    lodash.result = result;
    lodash.round = round;
    lodash.runInContext = runInContext;
    lodash.sample = sample;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedIndexBy = sortedIndexBy;
    lodash.sortedIndexOf = sortedIndexOf;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.sortedLastIndexBy = sortedLastIndexBy;
    lodash.sortedLastIndexOf = sortedLastIndexOf;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.subtract = subtract;
    lodash.sum = sum;
    lodash.sumBy = sumBy;
    lodash.template = template;
    lodash.times = times;
    lodash.toFinite = toFinite;
    lodash.toInteger = toInteger;
    lodash.toLength = toLength;
    lodash.toLower = toLower;
    lodash.toNumber = toNumber;
    lodash.toSafeInteger = toSafeInteger;
    lodash.toString = toString;
    lodash.toUpper = toUpper;
    lodash.trim = trim;
    lodash.trimEnd = trimEnd;
    lodash.trimStart = trimStart;
    lodash.truncate = truncate;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.upperCase = upperCase;
    lodash.upperFirst = upperFirst;

    // Add aliases.
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.first = head;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!hasOwnProperty.call(lodash.prototype, methodName)) {
          source[methodName] = func;
        }
      });
      return source;
    }()), { 'chain': false });

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type {string}
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function(methodName, index) {
      LazyWrapper.prototype[methodName] = function(n) {
        n = n === undefined ? 1 : nativeMax(toInteger(n), 0);

        var result = (this.__filtered__ && !index)
          ? new LazyWrapper(this)
          : this.clone();

        if (result.__filtered__) {
          result.__takeCount__ = nativeMin(n, result.__takeCount__);
        } else {
          result.__views__.push({
            'size': nativeMin(n, MAX_ARRAY_LENGTH),
            'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
          });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var type = index + 1,
          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee) {
        var result = this.clone();
        result.__iteratees__.push({
          'iteratee': getIteratee(iteratee, 3),
          'type': type
        });
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.head` and `_.last`.
    arrayEach(['head', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.tail`.
    arrayEach(['initial', 'tail'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });

    LazyWrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    LazyWrapper.prototype.find = function(predicate) {
      return this.filter(predicate).head();
    };

    LazyWrapper.prototype.findLast = function(predicate) {
      return this.reverse().find(predicate);
    };

    LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
      if (typeof path == 'function') {
        return new LazyWrapper(this);
      }
      return this.map(function(value) {
        return baseInvoke(value, path, args);
      });
    });

    LazyWrapper.prototype.reject = function(predicate) {
      return this.filter(negate(getIteratee(predicate)));
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = toInteger(start);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end = toInteger(end);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function(predicate) {
      return this.reverse().takeWhile(predicate).reverse();
    };

    LazyWrapper.prototype.toArray = function() {
      return this.take(MAX_ARRAY_LENGTH);
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
          isTaker = /^(?:head|last)$/.test(methodName),
          lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],
          retUnwrapped = isTaker || /^find/.test(methodName);

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function() {
        var value = this.__wrapped__,
            args = isTaker ? [1] : arguments,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

        var interceptor = function(value) {
          var result = lodashFunc.apply(lodash, arrayPush([value], args));
          return (isTaker && chainAll) ? result[0] : result;
        };

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // Avoid lazy use if the iteratee has a "length" value other than `1`.
          isLazy = useLazy = false;
        }
        var chainAll = this.__chain__,
            isHybrid = !!this.__actions__.length,
            isUnwrapped = retUnwrapped && !chainAll,
            onlyLazy = isLazy && !isHybrid;

        if (!retUnwrapped && useLazy) {
          value = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
          return new LodashWrapper(result, chainAll);
        }
        if (isUnwrapped && onlyLazy) {
          return func.apply(this, args);
        }
        result = this.thru(interceptor);
        return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;
      };
    });

    // Add `Array` methods to `lodash.prototype`.
    arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
      var func = arrayProto[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:pop|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          var value = this.value();
          return func.apply(isArray(value) ? value : [], args);
        }
        return this[chainName](function(value) {
          return func.apply(isArray(value) ? value : [], args);
        });
      };
    });

    // Map minified method names to their real names.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key = lodashFunc.name + '';
        if (!hasOwnProperty.call(realNames, key)) {
          realNames[key] = [];
        }
        realNames[key].push({ 'name': methodName, 'func': lodashFunc });
      }
    });

    realNames[createHybrid(undefined, WRAP_BIND_KEY_FLAG).name] = [{
      'name': 'wrapper',
      'func': undefined
    }];

    // Add methods to `LazyWrapper`.
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;

    // Add chain sequence methods to the `lodash` wrapper.
    lodash.prototype.at = wrapperAt;
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.commit = wrapperCommit;
    lodash.prototype.next = wrapperNext;
    lodash.prototype.plant = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    // Add lazy aliases.
    lodash.prototype.first = lodash.prototype.head;

    if (symIterator) {
      lodash.prototype[symIterator] = wrapperToIterator;
    }
    return lodash;
  });

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Some AMD build optimizers, like r.js, check for condition patterns like:
  if (true) {
    // Expose Lodash on the global object to prevent errors when Lodash is
    // loaded by a script tag in the presence of an AMD loader.
    // See http://requirejs.org/docs/errors.html#mismatch for more details.
    // Use `_.noConflict` to remove Lodash from the global object.
    root._ = _;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return _;
    }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
  // Check for `exports` after `define` in case a build optimizer adds it.
  else {}
}.call(this));


/***/ }),

/***/ "./resources/css/app.css":
/*!*******************************!*\
  !*** ./resources/css/app.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/perfect-scrollbar/dist/perfect-scrollbar.esm.js":
/*!**********************************************************************!*\
  !*** ./node_modules/perfect-scrollbar/dist/perfect-scrollbar.esm.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*!
 * perfect-scrollbar v1.5.6
 * Copyright 2024 Hyunje Jun, MDBootstrap and Contributors
 * Licensed under MIT
 */

function get(element) {
  return getComputedStyle(element);
}

function set(element, obj) {
  for (var key in obj) {
    var val = obj[key];
    if (typeof val === 'number') {
      val = val + "px";
    }
    element.style[key] = val;
  }
  return element;
}

function div(className) {
  var div = document.createElement('div');
  div.className = className;
  return div;
}

var elMatches =
  typeof Element !== 'undefined' &&
  (Element.prototype.matches ||
    Element.prototype.webkitMatchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector);

function matches(element, query) {
  if (!elMatches) {
    throw new Error('No element matching method supported');
  }

  return elMatches.call(element, query);
}

function remove(element) {
  if (element.remove) {
    element.remove();
  } else {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
}

function queryChildren(element, selector) {
  return Array.prototype.filter.call(element.children, function (child) { return matches(child, selector); }
  );
}

var cls = {
  main: 'ps',
  rtl: 'ps__rtl',
  element: {
    thumb: function (x) { return ("ps__thumb-" + x); },
    rail: function (x) { return ("ps__rail-" + x); },
    consuming: 'ps__child--consume',
  },
  state: {
    focus: 'ps--focus',
    clicking: 'ps--clicking',
    active: function (x) { return ("ps--active-" + x); },
    scrolling: function (x) { return ("ps--scrolling-" + x); },
  },
};

/*
 * Helper methods
 */
var scrollingClassTimeout = { x: null, y: null };

function addScrollingClass(i, x) {
  var classList = i.element.classList;
  var className = cls.state.scrolling(x);

  if (classList.contains(className)) {
    clearTimeout(scrollingClassTimeout[x]);
  } else {
    classList.add(className);
  }
}

function removeScrollingClass(i, x) {
  scrollingClassTimeout[x] = setTimeout(
    function () { return i.isAlive && i.element.classList.remove(cls.state.scrolling(x)); },
    i.settings.scrollingThreshold
  );
}

function setScrollingClassInstantly(i, x) {
  addScrollingClass(i, x);
  removeScrollingClass(i, x);
}

var EventElement = function EventElement(element) {
  this.element = element;
  this.handlers = {};
};

var prototypeAccessors = { isEmpty: { configurable: true } };

EventElement.prototype.bind = function bind (eventName, handler) {
  if (typeof this.handlers[eventName] === 'undefined') {
    this.handlers[eventName] = [];
  }
  this.handlers[eventName].push(handler);
  this.element.addEventListener(eventName, handler, false);
};

EventElement.prototype.unbind = function unbind (eventName, target) {
    var this$1 = this;

  this.handlers[eventName] = this.handlers[eventName].filter(function (handler) {
    if (target && handler !== target) {
      return true;
    }
    this$1.element.removeEventListener(eventName, handler, false);
    return false;
  });
};

EventElement.prototype.unbindAll = function unbindAll () {
  for (var name in this.handlers) {
    this.unbind(name);
  }
};

prototypeAccessors.isEmpty.get = function () {
    var this$1 = this;

  return Object.keys(this.handlers).every(
    function (key) { return this$1.handlers[key].length === 0; }
  );
};

Object.defineProperties( EventElement.prototype, prototypeAccessors );

var EventManager = function EventManager() {
  this.eventElements = [];
};

EventManager.prototype.eventElement = function eventElement (element) {
  var ee = this.eventElements.filter(function (ee) { return ee.element === element; })[0];
  if (!ee) {
    ee = new EventElement(element);
    this.eventElements.push(ee);
  }
  return ee;
};

EventManager.prototype.bind = function bind (element, eventName, handler) {
  this.eventElement(element).bind(eventName, handler);
};

EventManager.prototype.unbind = function unbind (element, eventName, handler) {
  var ee = this.eventElement(element);
  ee.unbind(eventName, handler);

  if (ee.isEmpty) {
    // remove
    this.eventElements.splice(this.eventElements.indexOf(ee), 1);
  }
};

EventManager.prototype.unbindAll = function unbindAll () {
  this.eventElements.forEach(function (e) { return e.unbindAll(); });
  this.eventElements = [];
};

EventManager.prototype.once = function once (element, eventName, handler) {
  var ee = this.eventElement(element);
  var onceHandler = function (evt) {
    ee.unbind(eventName, onceHandler);
    handler(evt);
  };
  ee.bind(eventName, onceHandler);
};

function createEvent(name) {
  if (typeof window.CustomEvent === 'function') {
    return new CustomEvent(name);
  }

  var evt = document.createEvent('CustomEvent');
  evt.initCustomEvent(name, false, false, undefined);
  return evt;
}

function processScrollDiff (i, axis, diff, useScrollingClass, forceFireReachEvent) {
  if ( useScrollingClass === void 0 ) useScrollingClass = true;
  if ( forceFireReachEvent === void 0 ) forceFireReachEvent = false;

  var fields;
  if (axis === 'top') {
    fields = ['contentHeight', 'containerHeight', 'scrollTop', 'y', 'up', 'down'];
  } else if (axis === 'left') {
    fields = ['contentWidth', 'containerWidth', 'scrollLeft', 'x', 'left', 'right'];
  } else {
    throw new Error('A proper axis should be provided');
  }

  processScrollDiff$1(i, diff, fields, useScrollingClass, forceFireReachEvent);
}

function processScrollDiff$1(
  i,
  diff,
  ref,
  useScrollingClass,
  forceFireReachEvent
) {
  var contentHeight = ref[0];
  var containerHeight = ref[1];
  var scrollTop = ref[2];
  var y = ref[3];
  var up = ref[4];
  var down = ref[5];
  if ( useScrollingClass === void 0 ) useScrollingClass = true;
  if ( forceFireReachEvent === void 0 ) forceFireReachEvent = false;

  var element = i.element;

  // reset reach
  i.reach[y] = null;

  // 1 for subpixel rounding
  if (element[scrollTop] < 1) {
    i.reach[y] = 'start';
  }

  // 1 for subpixel rounding
  if (element[scrollTop] > i[contentHeight] - i[containerHeight] - 1) {
    i.reach[y] = 'end';
  }

  if (diff) {
    element.dispatchEvent(createEvent(("ps-scroll-" + y)));

    if (diff < 0) {
      element.dispatchEvent(createEvent(("ps-scroll-" + up)));
    } else if (diff > 0) {
      element.dispatchEvent(createEvent(("ps-scroll-" + down)));
    }

    if (useScrollingClass) {
      setScrollingClassInstantly(i, y);
    }
  }

  if (i.reach[y] && (diff || forceFireReachEvent)) {
    element.dispatchEvent(createEvent(("ps-" + y + "-reach-" + (i.reach[y]))));
  }
}

function toInt(x) {
  return parseInt(x, 10) || 0;
}

function isEditable(el) {
  return (
    matches(el, 'input,[contenteditable]') ||
    matches(el, 'select,[contenteditable]') ||
    matches(el, 'textarea,[contenteditable]') ||
    matches(el, 'button,[contenteditable]')
  );
}

function outerWidth(element) {
  var styles = get(element);
  return (
    toInt(styles.width) +
    toInt(styles.paddingLeft) +
    toInt(styles.paddingRight) +
    toInt(styles.borderLeftWidth) +
    toInt(styles.borderRightWidth)
  );
}

var env = {
  isWebKit:
    typeof document !== 'undefined' &&
    'WebkitAppearance' in document.documentElement.style,
  supportsTouch:
    typeof window !== 'undefined' &&
    ('ontouchstart' in window ||
      ('maxTouchPoints' in window.navigator &&
        window.navigator.maxTouchPoints > 0) ||
      (window.DocumentTouch && document instanceof window.DocumentTouch)),
  supportsIePointer:
    typeof navigator !== 'undefined' && navigator.msMaxTouchPoints,
  isChrome:
    typeof navigator !== 'undefined' &&
    /Chrome/i.test(navigator && navigator.userAgent),
};

/* eslint-disable no-lonely-if */

function updateGeometry (i) {
  var element = i.element;
  var roundedScrollTop = Math.floor(element.scrollTop);
  var rect = element.getBoundingClientRect();

  i.containerWidth = Math.floor(rect.width);
  i.containerHeight = Math.floor(rect.height);

  i.contentWidth = element.scrollWidth;
  i.contentHeight = element.scrollHeight;

  if (!element.contains(i.scrollbarXRail)) {
    // clean up and append
    queryChildren(element, cls.element.rail('x')).forEach(function (el) { return remove(el); });
    element.appendChild(i.scrollbarXRail);
  }
  if (!element.contains(i.scrollbarYRail)) {
    // clean up and append
    queryChildren(element, cls.element.rail('y')).forEach(function (el) { return remove(el); });
    element.appendChild(i.scrollbarYRail);
  }

  if (
    !i.settings.suppressScrollX &&
    i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth
  ) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize(i, toInt((i.railXWidth * i.containerWidth) / i.contentWidth));
    i.scrollbarXLeft = toInt(
      ((i.negativeScrollAdjustment + element.scrollLeft) * (i.railXWidth - i.scrollbarXWidth)) /
        (i.contentWidth - i.containerWidth)
    );
  } else {
    i.scrollbarXActive = false;
  }

  if (
    !i.settings.suppressScrollY &&
    i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight
  ) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;
    i.scrollbarYHeight = getThumbSize(
      i,
      toInt((i.railYHeight * i.containerHeight) / i.contentHeight)
    );
    i.scrollbarYTop = toInt(
      (roundedScrollTop * (i.railYHeight - i.scrollbarYHeight)) /
        (i.contentHeight - i.containerHeight)
    );
  } else {
    i.scrollbarYActive = false;
  }

  if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
    i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
  }
  if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
    i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
  }

  updateCss(element, i);

  if (i.scrollbarXActive) {
    element.classList.add(cls.state.active('x'));
  } else {
    element.classList.remove(cls.state.active('x'));
    i.scrollbarXWidth = 0;
    i.scrollbarXLeft = 0;
    element.scrollLeft = i.isRtl === true ? i.contentWidth : 0;
  }
  if (i.scrollbarYActive) {
    element.classList.add(cls.state.active('y'));
  } else {
    element.classList.remove(cls.state.active('y'));
    i.scrollbarYHeight = 0;
    i.scrollbarYTop = 0;
    element.scrollTop = 0;
  }
}

function getThumbSize(i, thumbSize) {
  if (i.settings.minScrollbarLength) {
    thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
  }
  if (i.settings.maxScrollbarLength) {
    thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
  }
  return thumbSize;
}

function updateCss(element, i) {
  var xRailOffset = { width: i.railXWidth };
  var roundedScrollTop = Math.floor(element.scrollTop);

  if (i.isRtl) {
    xRailOffset.left =
      i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth - i.contentWidth;
  } else {
    xRailOffset.left = element.scrollLeft;
  }
  if (i.isScrollbarXUsingBottom) {
    xRailOffset.bottom = i.scrollbarXBottom - roundedScrollTop;
  } else {
    xRailOffset.top = i.scrollbarXTop + roundedScrollTop;
  }
  set(i.scrollbarXRail, xRailOffset);

  var yRailOffset = { top: roundedScrollTop, height: i.railYHeight };
  if (i.isScrollbarYUsingRight) {
    if (i.isRtl) {
      yRailOffset.right =
        i.contentWidth -
        (i.negativeScrollAdjustment + element.scrollLeft) -
        i.scrollbarYRight -
        i.scrollbarYOuterWidth -
        9;
    } else {
      yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
    }
  } else {
    if (i.isRtl) {
      yRailOffset.left =
        i.negativeScrollAdjustment +
        element.scrollLeft +
        i.containerWidth * 2 -
        i.contentWidth -
        i.scrollbarYLeft -
        i.scrollbarYOuterWidth;
    } else {
      yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
    }
  }
  set(i.scrollbarYRail, yRailOffset);

  set(i.scrollbarX, {
    left: i.scrollbarXLeft,
    width: i.scrollbarXWidth - i.railBorderXWidth,
  });
  set(i.scrollbarY, {
    top: i.scrollbarYTop,
    height: i.scrollbarYHeight - i.railBorderYWidth,
  });
}

/* eslint-disable */

function clickRail (i) {
  // const element = i.element;

  i.event.bind(i.scrollbarY, 'mousedown', function (e) { return e.stopPropagation(); });
  i.event.bind(i.scrollbarYRail, 'mousedown', function (e) {
    var positionTop = e.pageY - window.pageYOffset - i.scrollbarYRail.getBoundingClientRect().top;
    var direction = positionTop > i.scrollbarYTop ? 1 : -1;

    i.element.scrollTop += direction * i.containerHeight;
    updateGeometry(i);

    e.stopPropagation();
  });

  i.event.bind(i.scrollbarX, 'mousedown', function (e) { return e.stopPropagation(); });
  i.event.bind(i.scrollbarXRail, 'mousedown', function (e) {
    var positionLeft =
      e.pageX - window.pageXOffset - i.scrollbarXRail.getBoundingClientRect().left;
    var direction = positionLeft > i.scrollbarXLeft ? 1 : -1;

    i.element.scrollLeft += direction * i.containerWidth;
    updateGeometry(i);

    e.stopPropagation();
  });
}

var activeSlider = null; // Variable to track the currently active slider

function setupScrollHandlers(i) {
  bindMouseScrollHandler(i, [
    'containerHeight',
    'contentHeight',
    'pageY',
    'railYHeight',
    'scrollbarY',
    'scrollbarYHeight',
    'scrollTop',
    'y',
    'scrollbarYRail' ]);

  bindMouseScrollHandler(i, [
    'containerWidth',
    'contentWidth',
    'pageX',
    'railXWidth',
    'scrollbarX',
    'scrollbarXWidth',
    'scrollLeft',
    'x',
    'scrollbarXRail' ]);
}

function bindMouseScrollHandler(
  i,
  ref
) {
  var containerDimension = ref[0];
  var contentDimension = ref[1];
  var pageAxis = ref[2];
  var railDimension = ref[3];
  var scrollbarAxis = ref[4];
  var scrollbarDimension = ref[5];
  var scrollAxis = ref[6];
  var axis = ref[7];
  var scrollbarRail = ref[8];

  var element = i.element;
  var startingScrollPosition = null;
  var startingMousePagePosition = null;
  var scrollBy = null;

  function moveHandler(e) {
    if (e.touches && e.touches[0]) {
      e[pageAxis] = e.touches[0][("page" + (axis.toUpperCase()))];
    }

    // Only move if the active slider is the one we started with
    if (activeSlider === scrollbarAxis) {
      element[scrollAxis] =
        startingScrollPosition + scrollBy * (e[pageAxis] - startingMousePagePosition);
      addScrollingClass(i, axis);
      updateGeometry(i);

      e.stopPropagation();
      e.preventDefault();
    }
  }

  function endHandler() {
    removeScrollingClass(i, axis);
    i[scrollbarRail].classList.remove(cls.state.clicking);
    document.removeEventListener('mousemove', moveHandler);
    document.removeEventListener('mouseup', endHandler);
    document.removeEventListener('touchmove', moveHandler);
    document.removeEventListener('touchend', endHandler);
    activeSlider = null; // Reset active slider when interaction ends
  }

  function bindMoves(e) {
    if (activeSlider === null) {
      // Only bind if no slider is currently active
      activeSlider = scrollbarAxis; // Set current slider as active

      startingScrollPosition = element[scrollAxis];
      if (e.touches) {
        e[pageAxis] = e.touches[0][("page" + (axis.toUpperCase()))];
      }
      startingMousePagePosition = e[pageAxis];
      scrollBy =
        (i[contentDimension] - i[containerDimension]) / (i[railDimension] - i[scrollbarDimension]);

      if (!e.touches) {
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', endHandler);
      } else {
        document.addEventListener('touchmove', moveHandler, { passive: false });
        document.addEventListener('touchend', endHandler);
      }

      i[scrollbarRail].classList.add(cls.state.clicking);
    }

    e.stopPropagation();
    if (e.cancelable) {
      e.preventDefault();
    }
  }

  i[scrollbarAxis].addEventListener('mousedown', bindMoves);
  i[scrollbarAxis].addEventListener('touchstart', bindMoves);
}

/* eslint-disable */

function keyboard (i) {
  var element = i.element;

  var elementHovered = function () { return matches(element, ':hover'); };
  var scrollbarFocused = function () { return matches(i.scrollbarX, ':focus') || matches(i.scrollbarY, ':focus'); };

  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = Math.floor(element.scrollTop);
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if (
        (scrollTop === 0 && deltaY > 0) ||
        (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)
      ) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if (
        (scrollLeft === 0 && deltaX < 0) ||
        (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)
      ) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  i.event.bind(i.ownerDocument, 'keydown', function (e) {
    if ((e.isDefaultPrevented && e.isDefaultPrevented()) || e.defaultPrevented) {
      return;
    }

    if (!elementHovered() && !scrollbarFocused()) {
      return;
    }

    var activeElement = document.activeElement
      ? document.activeElement
      : i.ownerDocument.activeElement;
    if (activeElement) {
      if (activeElement.tagName === 'IFRAME') {
        activeElement = activeElement.contentDocument.activeElement;
      } else {
        // go deeper if element is a webcomponent
        while (activeElement.shadowRoot) {
          activeElement = activeElement.shadowRoot.activeElement;
        }
      }
      if (isEditable(activeElement)) {
        return;
      }
    }

    var deltaX = 0;
    var deltaY = 0;

    switch (e.which) {
      case 37: // left
        if (e.metaKey) {
          deltaX = -i.contentWidth;
        } else if (e.altKey) {
          deltaX = -i.containerWidth;
        } else {
          deltaX = -30;
        }
        break;
      case 38: // up
        if (e.metaKey) {
          deltaY = i.contentHeight;
        } else if (e.altKey) {
          deltaY = i.containerHeight;
        } else {
          deltaY = 30;
        }
        break;
      case 39: // right
        if (e.metaKey) {
          deltaX = i.contentWidth;
        } else if (e.altKey) {
          deltaX = i.containerWidth;
        } else {
          deltaX = 30;
        }
        break;
      case 40: // down
        if (e.metaKey) {
          deltaY = -i.contentHeight;
        } else if (e.altKey) {
          deltaY = -i.containerHeight;
        } else {
          deltaY = -30;
        }
        break;
      case 32: // space bar
        if (e.shiftKey) {
          deltaY = i.containerHeight;
        } else {
          deltaY = -i.containerHeight;
        }
        break;
      case 33: // page up
        deltaY = i.containerHeight;
        break;
      case 34: // page down
        deltaY = -i.containerHeight;
        break;
      case 36: // home
        deltaY = i.contentHeight;
        break;
      case 35: // end
        deltaY = -i.contentHeight;
        break;
      default:
        return;
    }

    if (i.settings.suppressScrollX && deltaX !== 0) {
      return;
    }
    if (i.settings.suppressScrollY && deltaY !== 0) {
      return;
    }

    element.scrollTop -= deltaY;
    element.scrollLeft += deltaX;
    updateGeometry(i);

    if (shouldPreventDefault(deltaX, deltaY)) {
      e.preventDefault();
    }
  });
}

/* eslint-disable */

function wheel (i) {
  var element = i.element;

  function shouldPreventDefault(deltaX, deltaY) {
    var roundedScrollTop = Math.floor(element.scrollTop);
    var isTop = element.scrollTop === 0;
    var isBottom = roundedScrollTop + element.offsetHeight === element.scrollHeight;
    var isLeft = element.scrollLeft === 0;
    var isRight = element.scrollLeft + element.offsetWidth === element.scrollWidth;

    var hitsBound;

    // pick axis with primary direction
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      hitsBound = isTop || isBottom;
    } else {
      hitsBound = isLeft || isRight;
    }

    return hitsBound ? !i.settings.wheelPropagation : true;
  }

  function getDeltaFromEvent(e) {
    var deltaX = e.deltaX;
    var deltaY = -1 * e.deltaY;

    if (typeof deltaX === 'undefined' || typeof deltaY === 'undefined') {
      // OS X Safari
      deltaX = (-1 * e.wheelDeltaX) / 6;
      deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY /* NaN checks */) {
      // IE in some mouse drivers
      deltaX = 0;
      deltaY = e.wheelDelta;
    }

    if (e.shiftKey) {
      // reverse axis with shift key
      return [-deltaY, -deltaX];
    }
    return [deltaX, deltaY];
  }

  function shouldBeConsumedByChild(target, deltaX, deltaY) {
    // FIXME: this is a workaround for <select> issue in FF and IE #571
    if (!env.isWebKit && element.querySelector('select:focus')) {
      return true;
    }

    if (!element.contains(target)) {
      return false;
    }

    var cursor = target;

    while (cursor && cursor !== element) {
      if (cursor.classList.contains(cls.element.consuming)) {
        return true;
      }

      var style = get(cursor);

      // if deltaY && vertical scrollable
      if (deltaY && style.overflowY.match(/(scroll|auto)/)) {
        var maxScrollTop = cursor.scrollHeight - cursor.clientHeight;
        if (maxScrollTop > 0) {
          if (
            (cursor.scrollTop > 0 && deltaY < 0) ||
            (cursor.scrollTop < maxScrollTop && deltaY > 0)
          ) {
            return true;
          }
        }
      }
      // if deltaX && horizontal scrollable
      if (deltaX && style.overflowX.match(/(scroll|auto)/)) {
        var maxScrollLeft = cursor.scrollWidth - cursor.clientWidth;
        if (maxScrollLeft > 0) {
          if (
            (cursor.scrollLeft > 0 && deltaX < 0) ||
            (cursor.scrollLeft < maxScrollLeft && deltaX > 0)
          ) {
            return true;
          }
        }
      }

      cursor = cursor.parentNode;
    }

    return false;
  }

  function mousewheelHandler(e) {
    var ref = getDeltaFromEvent(e);
    var deltaX = ref[0];
    var deltaY = ref[1];

    if (shouldBeConsumedByChild(e.target, deltaX, deltaY)) {
      return;
    }

    var shouldPrevent = false;
    if (!i.settings.useBothWheelAxes) {
      // deltaX will only be used for horizontal scrolling and deltaY will
      // only be used for vertical scrolling - this is the default
      element.scrollTop -= deltaY * i.settings.wheelSpeed;
      element.scrollLeft += deltaX * i.settings.wheelSpeed;
    } else if (i.scrollbarYActive && !i.scrollbarXActive) {
      // only vertical scrollbar is active and useBothWheelAxes option is
      // active, so let's scroll vertical bar using both mouse wheel axes
      if (deltaY) {
        element.scrollTop -= deltaY * i.settings.wheelSpeed;
      } else {
        element.scrollTop += deltaX * i.settings.wheelSpeed;
      }
      shouldPrevent = true;
    } else if (i.scrollbarXActive && !i.scrollbarYActive) {
      // useBothWheelAxes and only horizontal bar is active, so use both
      // wheel axes for horizontal bar
      if (deltaX) {
        element.scrollLeft += deltaX * i.settings.wheelSpeed;
      } else {
        element.scrollLeft -= deltaY * i.settings.wheelSpeed;
      }
      shouldPrevent = true;
    }

    updateGeometry(i);

    shouldPrevent = shouldPrevent || shouldPreventDefault(deltaX, deltaY);
    if (shouldPrevent && !e.ctrlKey) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  if (typeof window.onwheel !== 'undefined') {
    i.event.bind(element, 'wheel', mousewheelHandler);
  } else if (typeof window.onmousewheel !== 'undefined') {
    i.event.bind(element, 'mousewheel', mousewheelHandler);
  }
}

function touch (i) {
  if (!env.supportsTouch && !env.supportsIePointer) {
    return;
  }

  var element = i.element;

  var state = {
    startOffset: {},
    startTime: 0,
    speed: {},
    easingLoop: null,
  };

  function shouldPrevent(deltaX, deltaY) {
    var scrollTop = Math.floor(element.scrollTop);
    var scrollLeft = element.scrollLeft;
    var magnitudeX = Math.abs(deltaX);
    var magnitudeY = Math.abs(deltaY);

    if (magnitudeY > magnitudeX) {
      // user is perhaps trying to swipe up/down the page

      if (
        (deltaY < 0 && scrollTop === i.contentHeight - i.containerHeight) ||
        (deltaY > 0 && scrollTop === 0)
      ) {
        // set prevent for mobile Chrome refresh
        return window.scrollY === 0 && deltaY > 0 && env.isChrome;
      }
    } else if (magnitudeX > magnitudeY) {
      // user is perhaps trying to swipe left/right across the page

      if (
        (deltaX < 0 && scrollLeft === i.contentWidth - i.containerWidth) ||
        (deltaX > 0 && scrollLeft === 0)
      ) {
        return true;
      }
    }

    return true;
  }

  function applyTouchMove(differenceX, differenceY) {
    element.scrollTop -= differenceY;
    element.scrollLeft -= differenceX;

    updateGeometry(i);
  }

  function getTouch(e) {
    if (e.targetTouches) {
      return e.targetTouches[0];
    }
    // Maybe IE pointer
    return e;
  }

  function shouldHandle(e) {
    if (e.target === i.scrollbarX || e.target === i.scrollbarY) {
      return false;
    }
    if (e.pointerType && e.pointerType === 'pen' && e.buttons === 0) {
      return false;
    }
    if (e.targetTouches && e.targetTouches.length === 1) {
      return true;
    }
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
      return true;
    }
    return false;
  }

  function touchStart(e) {
    if (!shouldHandle(e)) {
      return;
    }

    var touch = getTouch(e);

    state.startOffset.pageX = touch.pageX;
    state.startOffset.pageY = touch.pageY;

    state.startTime = new Date().getTime();

    if (state.easingLoop !== null) {
      clearInterval(state.easingLoop);
    }
  }

  function shouldBeConsumedByChild(target, deltaX, deltaY) {
    if (!element.contains(target)) {
      return false;
    }

    var cursor = target;

    while (cursor && cursor !== element) {
      if (cursor.classList.contains(cls.element.consuming)) {
        return true;
      }

      var style = get(cursor);

      // if deltaY && vertical scrollable
      if (deltaY && style.overflowY.match(/(scroll|auto)/)) {
        var maxScrollTop = cursor.scrollHeight - cursor.clientHeight;
        if (maxScrollTop > 0) {
          if (
            (cursor.scrollTop > 0 && deltaY < 0) ||
            (cursor.scrollTop < maxScrollTop && deltaY > 0)
          ) {
            return true;
          }
        }
      }
      // if deltaX && horizontal scrollable
      if (deltaX && style.overflowX.match(/(scroll|auto)/)) {
        var maxScrollLeft = cursor.scrollWidth - cursor.clientWidth;
        if (maxScrollLeft > 0) {
          if (
            (cursor.scrollLeft > 0 && deltaX < 0) ||
            (cursor.scrollLeft < maxScrollLeft && deltaX > 0)
          ) {
            return true;
          }
        }
      }

      cursor = cursor.parentNode;
    }

    return false;
  }

  function touchMove(e) {
    if (shouldHandle(e)) {
      var touch = getTouch(e);

      var currentOffset = { pageX: touch.pageX, pageY: touch.pageY };

      var differenceX = currentOffset.pageX - state.startOffset.pageX;
      var differenceY = currentOffset.pageY - state.startOffset.pageY;

      if (shouldBeConsumedByChild(e.target, differenceX, differenceY)) {
        return;
      }

      applyTouchMove(differenceX, differenceY);
      state.startOffset = currentOffset;

      var currentTime = new Date().getTime();

      var timeGap = currentTime - state.startTime;
      if (timeGap > 0) {
        state.speed.x = differenceX / timeGap;
        state.speed.y = differenceY / timeGap;
        state.startTime = currentTime;
      }

      if (shouldPrevent(differenceX, differenceY)) {
        // Prevent the default behavior if the event is cancelable
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    }
  }

  function touchEnd() {
    if (i.settings.swipeEasing) {
      clearInterval(state.easingLoop);
      state.easingLoop = setInterval(function () {
        if (i.isInitialized) {
          clearInterval(state.easingLoop);
          return;
        }

        if (!state.speed.x && !state.speed.y) {
          clearInterval(state.easingLoop);
          return;
        }

        if (Math.abs(state.speed.x) < 0.01 && Math.abs(state.speed.y) < 0.01) {
          clearInterval(state.easingLoop);
          return;
        }

        applyTouchMove(state.speed.x * 30, state.speed.y * 30);

        state.speed.x *= 0.8;
        state.speed.y *= 0.8;
      }, 10);
    }
  }

  if (env.supportsTouch) {
    i.event.bind(element, 'touchstart', touchStart);
    i.event.bind(element, 'touchmove', touchMove);
    i.event.bind(element, 'touchend', touchEnd);
  } else if (env.supportsIePointer) {
    if (window.PointerEvent) {
      i.event.bind(element, 'pointerdown', touchStart);
      i.event.bind(element, 'pointermove', touchMove);
      i.event.bind(element, 'pointerup', touchEnd);
    } else if (window.MSPointerEvent) {
      i.event.bind(element, 'MSPointerDown', touchStart);
      i.event.bind(element, 'MSPointerMove', touchMove);
      i.event.bind(element, 'MSPointerUp', touchEnd);
    }
  }
}

/* eslint-disable */

var defaultSettings = function () { return ({
  handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
  maxScrollbarLength: null,
  minScrollbarLength: null,
  scrollingThreshold: 1000,
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
  suppressScrollX: false,
  suppressScrollY: false,
  swipeEasing: true,
  useBothWheelAxes: false,
  wheelPropagation: true,
  wheelSpeed: 1,
}); };

var handlers = {
  'click-rail': clickRail,
  'drag-thumb': setupScrollHandlers,
  keyboard: keyboard,
  wheel: wheel,
  touch: touch,
};

var PerfectScrollbar = function PerfectScrollbar(element, userSettings) {
  var this$1 = this;
  if ( userSettings === void 0 ) userSettings = {};

  if (typeof element === 'string') {
    element = document.querySelector(element);
  }

  if (!element || !element.nodeName) {
    throw new Error('no element is specified to initialize PerfectScrollbar');
  }

  this.element = element;

  element.classList.add(cls.main);

  this.settings = defaultSettings();
  for (var key in userSettings) {
    this.settings[key] = userSettings[key];
  }

  this.containerWidth = null;
  this.containerHeight = null;
  this.contentWidth = null;
  this.contentHeight = null;

  var focus = function () { return element.classList.add(cls.state.focus); };
  var blur = function () { return element.classList.remove(cls.state.focus); };

  this.isRtl = get(element).direction === 'rtl';
  if (this.isRtl === true) {
    element.classList.add(cls.rtl);
  }
  this.isNegativeScroll = (function () {
    var originalScrollLeft = element.scrollLeft;
    var result = null;
    element.scrollLeft = -1;
    result = element.scrollLeft < 0;
    element.scrollLeft = originalScrollLeft;
    return result;
  })();
  this.negativeScrollAdjustment = this.isNegativeScroll
    ? element.scrollWidth - element.clientWidth
    : 0;
  this.event = new EventManager();
  this.ownerDocument = element.ownerDocument || document;

  this.scrollbarXRail = div(cls.element.rail('x'));
  element.appendChild(this.scrollbarXRail);
  this.scrollbarX = div(cls.element.thumb('x'));
  this.scrollbarXRail.appendChild(this.scrollbarX);
  this.scrollbarX.setAttribute('tabindex', 0);
  this.event.bind(this.scrollbarX, 'focus', focus);
  this.event.bind(this.scrollbarX, 'blur', blur);
  this.scrollbarXActive = null;
  this.scrollbarXWidth = null;
  this.scrollbarXLeft = null;
  var railXStyle = get(this.scrollbarXRail);
  this.scrollbarXBottom = parseInt(railXStyle.bottom, 10);
  if (isNaN(this.scrollbarXBottom)) {
    this.isScrollbarXUsingBottom = false;
    this.scrollbarXTop = toInt(railXStyle.top);
  } else {
    this.isScrollbarXUsingBottom = true;
  }
  this.railBorderXWidth = toInt(railXStyle.borderLeftWidth) + toInt(railXStyle.borderRightWidth);
  // Set rail to display:block to calculate margins
  set(this.scrollbarXRail, { display: 'block' });
  this.railXMarginWidth = toInt(railXStyle.marginLeft) + toInt(railXStyle.marginRight);
  set(this.scrollbarXRail, { display: '' });
  this.railXWidth = null;
  this.railXRatio = null;

  this.scrollbarYRail = div(cls.element.rail('y'));
  element.appendChild(this.scrollbarYRail);
  this.scrollbarY = div(cls.element.thumb('y'));
  this.scrollbarYRail.appendChild(this.scrollbarY);
  this.scrollbarY.setAttribute('tabindex', 0);
  this.event.bind(this.scrollbarY, 'focus', focus);
  this.event.bind(this.scrollbarY, 'blur', blur);
  this.scrollbarYActive = null;
  this.scrollbarYHeight = null;
  this.scrollbarYTop = null;
  var railYStyle = get(this.scrollbarYRail);
  this.scrollbarYRight = parseInt(railYStyle.right, 10);
  if (isNaN(this.scrollbarYRight)) {
    this.isScrollbarYUsingRight = false;
    this.scrollbarYLeft = toInt(railYStyle.left);
  } else {
    this.isScrollbarYUsingRight = true;
  }
  this.scrollbarYOuterWidth = this.isRtl ? outerWidth(this.scrollbarY) : null;
  this.railBorderYWidth = toInt(railYStyle.borderTopWidth) + toInt(railYStyle.borderBottomWidth);
  set(this.scrollbarYRail, { display: 'block' });
  this.railYMarginHeight = toInt(railYStyle.marginTop) + toInt(railYStyle.marginBottom);
  set(this.scrollbarYRail, { display: '' });
  this.railYHeight = null;
  this.railYRatio = null;

  this.reach = {
    x:
      element.scrollLeft <= 0
        ? 'start'
        : element.scrollLeft >= this.contentWidth - this.containerWidth
        ? 'end'
        : null,
    y:
      element.scrollTop <= 0
        ? 'start'
        : element.scrollTop >= this.contentHeight - this.containerHeight
        ? 'end'
        : null,
  };

  this.isAlive = true;

  this.settings.handlers.forEach(function (handlerName) { return handlers[handlerName](this$1); });

  this.lastScrollTop = Math.floor(element.scrollTop); // for onScroll only
  this.lastScrollLeft = element.scrollLeft; // for onScroll only
  this.event.bind(this.element, 'scroll', function (e) { return this$1.onScroll(e); });
  updateGeometry(this);
};

PerfectScrollbar.prototype.update = function update () {
  if (!this.isAlive) {
    return;
  }

  // Recalcuate negative scrollLeft adjustment
  this.negativeScrollAdjustment = this.isNegativeScroll
    ? this.element.scrollWidth - this.element.clientWidth
    : 0;

  // Recalculate rail margins
  set(this.scrollbarXRail, { display: 'block' });
  set(this.scrollbarYRail, { display: 'block' });
  this.railXMarginWidth =
    toInt(get(this.scrollbarXRail).marginLeft) +
    toInt(get(this.scrollbarXRail).marginRight);
  this.railYMarginHeight =
    toInt(get(this.scrollbarYRail).marginTop) +
    toInt(get(this.scrollbarYRail).marginBottom);

  // Hide scrollbars not to affect scrollWidth and scrollHeight
  set(this.scrollbarXRail, { display: 'none' });
  set(this.scrollbarYRail, { display: 'none' });

  updateGeometry(this);

  processScrollDiff(this, 'top', 0, false, true);
  processScrollDiff(this, 'left', 0, false, true);

  set(this.scrollbarXRail, { display: '' });
  set(this.scrollbarYRail, { display: '' });
};

PerfectScrollbar.prototype.onScroll = function onScroll (e) {
  if (!this.isAlive) {
    return;
  }

  updateGeometry(this);
  processScrollDiff(this, 'top', this.element.scrollTop - this.lastScrollTop);
  processScrollDiff(this, 'left', this.element.scrollLeft - this.lastScrollLeft);

  this.lastScrollTop = Math.floor(this.element.scrollTop);
  this.lastScrollLeft = this.element.scrollLeft;
};

PerfectScrollbar.prototype.destroy = function destroy () {
  if (!this.isAlive) {
    return;
  }

  this.event.unbindAll();
  remove(this.scrollbarX);
  remove(this.scrollbarY);
  remove(this.scrollbarXRail);
  remove(this.scrollbarYRail);
  this.removePsClasses();

  // unset elements
  this.element = null;
  this.scrollbarX = null;
  this.scrollbarY = null;
  this.scrollbarXRail = null;
  this.scrollbarYRail = null;

  this.isAlive = false;
};

PerfectScrollbar.prototype.removePsClasses = function removePsClasses () {
  this.element.className = this.element.className
    .split(' ')
    .filter(function (name) { return !name.match(/^ps([-_].+|)$/); })
    .join(' ');
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PerfectScrollbar);
//# sourceMappingURL=perfect-scrollbar.esm.js.map


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/@fortawesome/fontawesome-free/css/all.css":
/*!****************************************************************!*\
  !*** ./node_modules/@fortawesome/fontawesome-free/css/all.css ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_1_postcss_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_2_all_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!../../../postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./all.css */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./node_modules/@fortawesome/fontawesome-free/css/all.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_1_postcss_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_2_all_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_1_postcss_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_2_all_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/axios/package.json":
/*!*****************************************!*\
  !*** ./node_modules/axios/package.json ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"name":"axios","version":"0.21.4","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/js/app": 0,
/******/ 			"css/app": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/js/app.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/css/app.css")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;