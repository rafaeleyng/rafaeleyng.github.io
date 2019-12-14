---
title: "Optimizing Assets in Jekyll-generated gh-pages"
date: 2015-10-30T22:28:39-02:00
author: rafaeleyng
excerpt: >
  Learn how to optimize assets for your Jekyll site without having to rely on plugins.
---

## Jekyll + gh-pages

If you have some static site generated with [Jekyll](https://jekyllrb.com/), chances are that you are hosting your site with Github [gh-pages](https://help.github.com/articles/using-jekyll-with-pages/).

gh-pages are awesome for their simplicity to host and deploy your static site, but they lack the ability to allow you customize your build process. Github won't allow you to run arbitrary Jekyll plugins at their environment, because of security concerns.

In this post I've collected a bunch of techniques to optimize your assets at build time that you can use even when hosting your Jekyll site in gh-pages.


## Optimize HTML

### Minify HTML with Compress

[Jekyll Compress HTML](https://github.com/penibelst/jekyll-compress-html) is a Jekyll layout file that compresses HTML by removing unnecessary empty spaces characters and by removing [optional HTML tags](http://www.w3.org/TR/html5/syntax.html#optional-tags).

Is just a [single HTML file](https://github.com/penibelst/jekyll-compress-html/blob/master/site/_layouts/compress.html) that you download and put inside your `_layouts` folder. Then you reference it by putting

```
---
layout: compress
---
```

in the front-matter of your default layout, or in your HTML files. You can also remove empty spaces from a JSON/XML file that you generate, using the same approach.

You can check how it's done in [this commit](https://github.com/codeheaven-io/codeheaven.io/commit/96187be6c5c96c4785243c9ebf194823f5db9a35).

## Optimize CSS

Jekyll natively supports Sass, so you can concatenate your files into a single bundle out-of-the-box. But only doing this won't minify or inline your CSS.

### Inline CSS

It is a good idea to inline the CSS that is used to render the above-the-fold content of your site. But if you're running a simple blog or project page, probably your above-the-fold CSS is *all* of your CSS. So it might be a good idea to inline your whole CSS into a `<style>` tag in the head of your page. Specially if your HTML + inline CSS together are smaller that 14.6kb gzipped (gh-pages serves your site gzipped), because this is [how much data your client can receive in its first roundtrip to the server](https://developers.google.com/speed/docs/insights/mobile?hl=en).

To do this, you create a `inline.scss` file your `_includes` directory, and import whatever SCSS file you want to end up being inlined. Usually, will be as simple as importing a `main.scss` file (from your `_sass` directory):

```
@import "main";
```

Then, we include this file inside a `<style>` tag in the head of the document, passing it through Jekyll's built-in [scssify](http://www.rubydoc.info/github/jekyll/jekyll/Jekyll/Filters:scssify) filter:

{% raw %}
```
{% capture inline_css %}
  {% include inline.scss %}
{% endcapture %}
{{ inline_css | scssify }}
```
{% endraw %}

You can check how it's done in [this commit](https://github.com/codeheaven-io/codeheaven.io/commit/12ed5810d2edf6a967154cd14ee77b69ccf25c7f).

Of course you can choose to inline only a portion of your CSS and load a separate CSS file.

<small>
This technique I learned at this [Kevin Sweet post](http://www.kevinsweet.com/inline-scss-jekyll-github-pages/).
</small>

### Minify inline CSS

Remember our friend Jekyll Compress HTML? If your CSS is inline, Compress will remove empty spaces, which is basically how CSS is minified.

## Optimize JS

### Concatenate JS

Let's save some HTTP requests. Write all your JS in as many files you want and `include` all of them in a single file, and add a single `<script>` tag in your HTML requesting this file.

Jekyll's `include` will only look at the `_includes` folder, so it you want to keep your JS files in a separate folder, use [`include_relative`](http://jekyllrb.com/docs/templates/), which allows you to include relative to the file you are working on.

You can check how it's done in [this commit](https://github.com/CWISoftware/eventos/commit/b180160afb613287c50bcc2f8f411fc4fe0d6fe0).

### Minify JS

This is what I haven't discovered yet how to do without a plugin. If you know, please tell me in the comments box bellow.

Jekyll Compress won't do it: it only removes empty space, and that's not how JS is minified. Besides, if you use a `//` for a comment, all of your code after that will be commented out.

### Inline JS

A simple `include` or `include_relative` of your file inside a `<script>` tag will do it. But it **won't work** with Jekyll Compress HTML, so pick which is better for your case.
