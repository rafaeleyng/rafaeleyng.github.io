---
title: "Using Nexus 3 as Your Repository - Part 2: Npm Packages"
date: 2016-12-03T19:31:27-02:00
keywords: nexus, repository, private, proxy, npm
author: rafaeleyng
excerpt: >
  In this second post of the series, I'll show you how to setup Nexus 3 and configure it to use it as a private npm registry and as a proxy to the official registry.
---

<small>
This is the second part of a series of posts on Nexus 3 and how to use it as repository for several technologies.
</small>

`npm install` can take too long sometimes, so it might be a good idea to have a proxy in your own network. And if you can't just pay the 7 dollars/month to host your packages in the official npm private registry, then you'll probably benefit from this post.

## Installation

Check out the [first part](https://rafaeleyng.github.io/blog/using-nexus-3-as-your-repository-part-1-maven-artifacts/) of this series to see how we installed and ran Nexus 3 using a single docker command. Just do that and the installation is done.

## Configuring Nexus as a npm repo

What we will do:
  - create a private (hosted) repository for our own packages
  - create a proxy repository pointing to the official registry
  - create a group repository to provide all the above repos under a single URL

I suggest you to create a new blob store for each new repo you want to create. That way, the data for every repo will be in a different folder in `/nexus-data` (inside the Docker container). But this is not mandatory for it to work.

### private repo

A repository for npm packages that your team develops.

Create a new npm (hosted) repository and configure it like:

![npm-private0](https://cloud.githubusercontent.com/assets/4842605/20909966/d6f8101e-bb45-11e6-9791-0f2472866fdd.png)

The deployment policy "Allow redeploy" above might look somewhat polemic, so you might want to set it to "Disable redeploy". In my use case, it makes sense to use "Allow redeploy", since we keep a `latest` version on Nexus always updated with the status of the master branch, that is redeployed in our CI flow.

### proxy repo

A repository that proxies everything you download from the official npm registry. Next time you download the same dependency, it will be cached in your Nexus.

Create a new npm (proxy) repository and configure it like:

![npm-registry0](https://cloud.githubusercontent.com/assets/4842605/20909964/d6f6568e-bb45-11e6-9161-6e302ed1757f.png)

![npm-registry1](https://cloud.githubusercontent.com/assets/4842605/20909965/d6f7e9ea-bb45-11e6-86f1-c6ce957bf948.png)

### group repo

This will group all the above repos and provide you a single URL to configure your clients to download from/deploy to.

Create a new npm (group) repository and configure it like:

![npm-group0](https://cloud.githubusercontent.com/assets/4842605/20909963/d6f41e32-bb45-11e6-9134-848409b5d781.png)

You can create as many repos as you need and group them all in the group repo, but for npm I don't think that you will need more than 1 proxy and 1 private repos.

## Configuring your clients and projects to use your Nexus repos

For npm, we will configure the repository per project (unlike Maven, that have some global configs, for instance). I believe that you can configure the authentication globally in your machine, with `npm addUser`, but I didn't went that way for simplicity.

If you have a project where you only want to **download** dependencies from Nexus, create a `.npmrc` file at your project's root with:

```
registry=http://your-host:8081/repository/npm-group/
_auth=YWRtaW46YWRtaW4xMjM=
```

`_auth=YWRtaW46YWRtaW4xMjM=` is the base64 hash for the credentials (admin/admin123). If you use a different set of credentials, you should compute your own hash with:

```
echo -n 'myuser:mypassword' | openssl base64
```

You have to set a user so you can publish packages. If you do this from your local machine, `npm publish` will use your user configured in `~/.npmrc` (in your home, not in your project). If you don't have this configuration, or if you want to publish from CI, you can set an `email=any@email.com` configuration in your project's `.npmrc`. Really, any email.

If you have a project that you want to **publish** to your Nexus, put this in `package.json`:

```
{
  ...

  "publishConfig": {
    "registry": "http://your-host:8081/repository/npm-private/"
  }
}
```

Note that you publish to your private repo, but when you download, you can point to your group repo, so both your own packages and the packages from the official repo will be available from a single URL.

Now if you run in your projects:

```
npm install
# or
npm publish
```

your `npm` will point to your Nexus instance.

## Installing npm packages globally

Run:

```
npm --registry http://your-host:8081/repository/npm-group/ install -g your-package
```
