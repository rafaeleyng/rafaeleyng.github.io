webpackHotUpdate("static/development/pages/post.js",{

/***/ "./components/Disqus.js":
/*!******************************!*\
  !*** ./components/Disqus.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _jsxFileName = "/Users/rafael.eyng/code/rafael/rafaeleyng.github.io/src/components/Disqus.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;

var Disqus = function Disqus(_ref) {
  var pageData = _ref.pageData;
  console.log('####### pageData', pageData);
  var script = "\nvar disqus_config = function () {\n  this.page.url = 'https://rafaeleyng.github.io".concat(pageData.url, "';\n  this.page.identifier = '").concat(pageData.url, "';\n};\n\n");
  return __jsx(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, __jsx("div", {
    id: "disqus_thread",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }), __jsx("script", {
    type: "text/javascript",
    dangerouslySetInnerHTML: {
      __html: script
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  }), __jsx("noscript", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: this
  }, "Please enable JavaScript to view the ", __jsx("a", {
    href: "https://disqus.com/?ref_noscript",
    rel: "nofollow",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: this
  }, "comments powered by Disqus.")));
};

/* harmony default export */ __webpack_exports__["default"] = (Disqus);

/***/ })

})
//# sourceMappingURL=post.js.46864a4e0f2bb36d611e.hot-update.js.map