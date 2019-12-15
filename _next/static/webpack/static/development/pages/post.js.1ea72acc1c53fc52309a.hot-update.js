webpackHotUpdate("static/development/pages/post.js",{

/***/ "./utils/getPosts.js":
/*!***************************!*\
  !*** ./utils/getPosts.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var gray_matter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gray-matter */ "../node_modules/gray-matter/index.js");
/* harmony import */ var gray_matter__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(gray_matter__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _slug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./slug */ "./utils/slug.js");

 // from https://dev.to/tinacms/creating-a-markdown-blog-with-next-js-52hk

var getPosts = function getPosts() {
  var context = __webpack_require__("./posts sync \\.md$");

  var keys = context.keys();
  var values = keys.map(context);
  return keys.map(function (key, index) {
    var value = values[index];
    var document = gray_matter__WEBPACK_IMPORTED_MODULE_0___default()(value["default"]);
    var slug = Object(_slug__WEBPACK_IMPORTED_MODULE_1__["slugify"])(key);
    console.log('### document', document);
    console.log('### slug', slug);
    delete document.orig;
    delete document.excerpt;
    delete document.isEmpty;
    return {
      document: document,
      slug: slug
    };
  }).sort(function (a, b) {
    return new Date(b.document.data.date) - new Date(a.document.data.date);
  });
};

/* harmony default export */ __webpack_exports__["default"] = (getPosts);

/***/ })

})
//# sourceMappingURL=post.js.1ea72acc1c53fc52309a.hot-update.js.map