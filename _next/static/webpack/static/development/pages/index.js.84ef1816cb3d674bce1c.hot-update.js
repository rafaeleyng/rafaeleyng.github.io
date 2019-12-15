webpackHotUpdate("static/development/pages/index.js",{

/***/ "./pages/index.js":
/*!************************!*\
  !*** ./pages/index.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "../node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "../node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/link */ "../node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_Layout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/Layout */ "./components/Layout.js");
/* harmony import */ var _utils_date__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/date */ "./utils/date.js");
/* harmony import */ var _utils_getPosts__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/getPosts */ "./utils/getPosts.js");


var _jsxFileName = "/Users/rafael.eyng/code/rafael/rafaeleyng.github.io/src/pages/index.js";
var __jsx = react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement;






var Index = function Index(_ref) {
  var posts = _ref.posts;

  var main = __jsx("ul", {
    className: "post-list",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: this
  }, posts.map(function (post) {
    var postData = post.document.data;
    return __jsx("li", {
      key: post.slug,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 16
      },
      __self: this
    }, __jsx("p", {
      className: "post-meta",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 17
      },
      __self: this
    }, __jsx("time", {
      dateTime: Object(_utils_date__WEBPACK_IMPORTED_MODULE_5__["dateMachine"])(postData.date),
      __source: {
        fileName: _jsxFileName,
        lineNumber: 18
      },
      __self: this
    }, Object(_utils_date__WEBPACK_IMPORTED_MODULE_5__["dateHuman"])(postData.date))), __jsx(next_link__WEBPACK_IMPORTED_MODULE_3___default.a, {
      href: {
        pathname: '/post',
        query: {
          slug: post.slug
        }
      },
      as: "/".concat(post.slug),
      __source: {
        fileName: _jsxFileName,
        lineNumber: 20
      },
      __self: this
    }, __jsx("a", {
      className: "post-link",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 21
      },
      __self: this
    }, __jsx("h2", {
      className: "post-title",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 22
      },
      __self: this
    }, postData.title), __jsx("p", {
      className: "post-summary",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 23
      },
      __self: this
    }, postData.excerpt))));
  }));

  return __jsx(_components_Layout__WEBPACK_IMPORTED_MODULE_4__["default"], {
    main: main,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: this
  });
};

/* harmony default export */ __webpack_exports__["default"] = (Index);
Index.getInitialProps =
/*#__PURE__*/
Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
/*#__PURE__*/
_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
  var posts;
  return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          posts = Object(_utils_getPosts__WEBPACK_IMPORTED_MODULE_6__["default"])();
          posts.forEach(function (p) {
            delete p.document.content;
          });
          console.log('### posts', posts);
          return _context.abrupt("return", {
            posts: posts
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}));

/***/ })

})
//# sourceMappingURL=index.js.84ef1816cb3d674bce1c.hot-update.js.map