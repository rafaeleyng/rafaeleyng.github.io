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
  var script = "\nvar disqus_config = function () {\n  this.page.url = 'https://rafaeleyng.github.io".concat(pageData.url, "';\n  this.page.identifier = '").concat(pageData.url, "';\n};\n\n");
  return __jsx(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, __jsx("div", {
    id: "disqus_thread",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  }), __jsx("script", {
    type: "text/javascript",
    dangerouslySetInnerHTML: {
      __html: script
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }), __jsx("noscript", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, "Please enable JavaScript to view the ", __jsx("a", {
    href: "https://disqus.com/?ref_noscript",
    rel: "nofollow",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, "comments powered by Disqus.")));
};

/* harmony default export */ __webpack_exports__["default"] = (Disqus);

/***/ }),

/***/ "./pages/post.js":
/*!***********************!*\
  !*** ./pages/post.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "../node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "../node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var gray_matter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! gray-matter */ "../node_modules/gray-matter/index.js");
/* harmony import */ var gray_matter__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(gray_matter__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_markdown__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-markdown */ "../node_modules/react-markdown/lib/react-markdown.js");
/* harmony import */ var react_markdown__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_markdown__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _components_Layout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/Layout */ "./components/Layout.js");
/* harmony import */ var _components_Disqus__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/Disqus */ "./components/Disqus.js");
/* harmony import */ var _utils_date__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/date */ "./utils/date.js");
/* harmony import */ var _utils_getPosts__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/getPosts */ "./utils/getPosts.js");


var _jsxFileName = "/Users/rafael.eyng/code/rafael/rafaeleyng.github.io/src/pages/post.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement;







var Post = function Post(_ref) {
  var post = _ref.post;

  // TODO temp fix for `favicon.ico` error
  if (!post) {
    return null;
  }

  var title = post.document.data.title;
  var pageData = {
    title: title,
    url: "/".concat(post.slug)
  };

  var contentHeader = __jsx(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, __jsx("p", {
    className: "post-meta",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: this
  }, __jsx("time", {
    itemProp: "datePublished",
    dateTime: Object(_utils_date__WEBPACK_IMPORTED_MODULE_7__["dateMachine"])(post.document.data.date),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }, Object(_utils_date__WEBPACK_IMPORTED_MODULE_7__["dateHuman"])(post.document.data.date))));
  /*
    TODO add syntax highlighting:
    https://gist.github.com/ibrahima/d21950a95aee3212e991a8404e238093
    https://github.com/rexxars/react-markdown/issues/191
    https://medium.com/young-developer/react-markdown-code-and-syntax-highlighting-632d2f9b4ada
  */


  var main = __jsx("section", {
    className: "post",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: this
  }, __jsx("span", {
    className: "hidden",
    itemProp: "publisher",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    },
    __self: this
  }, "Rafael Eyng"), __jsx("span", {
    className: "hidden",
    itemProp: "keywords",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
    },
    __self: this
  }, post.document.data.keywords), __jsx("article", {
    className: "post-content",
    itemProp: "articleBody",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40
    },
    __self: this
  }, __jsx(react_markdown__WEBPACK_IMPORTED_MODULE_4___default.a, {
    escapeHtml: false,
    source: post.document.content,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41
    },
    __self: this
  })), __jsx(_components_Disqus__WEBPACK_IMPORTED_MODULE_6__["default"], {
    pageData: pageData,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  }));

  return __jsx(_components_Layout__WEBPACK_IMPORTED_MODULE_5__["default"], {
    contentHeader: contentHeader,
    contentTitle: title,
    main: main,
    pageData: pageData,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: this
  });
};

Post.getInitialProps =
/*#__PURE__*/
function () {
  var _ref2 = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
  /*#__PURE__*/
  _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(context) {
    var slug, posts, post;
    return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            slug = context.query.slug;
            posts = Object(_utils_getPosts__WEBPACK_IMPORTED_MODULE_8__["default"])();
            post = posts.find(function (p) {
              return p.slug === slug;
            });
            return _context.abrupt("return", {
              post: post
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

/* harmony default export */ __webpack_exports__["default"] = (Post);

/***/ })

})
//# sourceMappingURL=post.js.df39010f168d97711dec.hot-update.js.map