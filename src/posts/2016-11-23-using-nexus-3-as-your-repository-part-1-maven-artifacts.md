---
title: "Using Nexus 3 as Your Repository - Part 1: Maven Artifacts"
date: 2016-11-23T19:55:08-02:00
keywords: nexus, repository, private, proxy, maven
author: rafaeleyng
excerpt: >
  Learn how to setup Nexus 3 and configure it to use it both as a Maven private repository and as a proxy to Maven Central and other repos
---

<small>
This is the first part of a series of posts on Nexus 3 and how to use it as repository for several technologies.
</small>

## Installation

Install it with docker:

```
docker run -d -p 8081:8081 -p 8082:8082 -p 8083:8083 --name my-nexus sonatype/nexus3:3.0.0
```

<small>
We are mapping all of those ports (8081-8083) because of the next posts in the series. For this post, we'll actually only need port 8081.
</small>

Nexus 3 will go up on port 8081. Default credentials are admin/admin123.

You might want to create a volume to map the Nexus data folder to your host, adding the option `-v /opt/my-nexus-data:/nexus-data`.

## Configuring Nexus as a Maven repo

What we will do:
  - create a private (hosted) repository for our snapshots
  - create a private (hosted) repository for our releases
  - create a proxy repository pointing to Maven Central
  - create a group repository to provide all of these repos under a single URL

I suggest you to create a new blob store for each new repo you want to create. That way, the data for every repo will be in a different folder in `/nexus-data` (inside the Docker container). But this is not mandatory for it to work.

### snapshots repo

A repository for Maven artifacts that you deploy **with** `-SNAPSHOT` in the end of the version tag of your pom.xml:

```
<version>1.0.0-SNAPSHOT</version>
```

Create a new maven (hosted) repository and configure it like:

![maven-snapshots0](https://cloud.githubusercontent.com/assets/4842605/20580349/f43cdad8-b1b8-11e6-8ff8-a9a02082197a.png)

### releases repo

A repository for Maven artifact that you deploy **without** `-SNAPSHOT` in the end of the version tag of your pom.xml:

```
<version>1.0.0</version>
```

Create a new maven (hosted) repository and configure it like:

![maven-releases0](https://cloud.githubusercontent.com/assets/4842605/20580348/f42e9964-b1b8-11e6-8e32-4a0dc717d7bf.png)

### proxy to Maven Central repo

A repository that proxies everything you download from Maven Central. Next time you download the same dependency, it will be cached in your Nexus.

Create a new maven (proxy) repository and configure it like:

![maven-central0](https://cloud.githubusercontent.com/assets/4842605/20580346/f40f4488-b1b8-11e6-8fce-33034ef14978.png)

![maven-central1](https://cloud.githubusercontent.com/assets/4842605/20580345/f40e387c-b1b8-11e6-8e4a-c314273bf1a0.png)

### group repo

This will group all the above repos and provide you a single URL to configure your clients to download from/deploy to.

Create a new maven (group) repository and configure it like:

![maven-group0](https://cloud.githubusercontent.com/assets/4842605/20580347/f427ce5e-b1b8-11e6-8a93-52cda1f49f59.png)

You can create as many repos as you need (like proxies to other public repos) and group them all in the group repo.


## Configuring your clients and projects to use your Nexus repos

Put this in your `~/.m2/settings.xml` file. This will configure the credentials to publish to your hosted repos, and will tell your `mvn` to use your repo as a mirror of central:

```
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.1.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.1.0 http://maven.apache.org/xsd/settings-1.1.0.xsd">

  <servers>
    <server>
      <id>nexus-snapshots</id>
      <username>admin</username>
      <password>admin123</password>
    </server>
    <server>
      <id>nexus-releases</id>
      <username>admin</username>
      <password>admin123</password>
    </server>
  </servers>

  <mirrors>
    <mirror>
      <id>central</id>
      <name>central</name>
      <url>http://your-host:8081/repository/maven-group/</url>
      <mirrorOf>*</mirrorOf>
    </mirror>
  </mirrors>

</settings>
```

And now configure your projects.

If you want only to download dependencies from Nexus, put this in the `pom.xml`:

```
<project ...>

  ...

  <repositories>
    <repository>
      <id>maven-group</id>
      <url>http://your-host:8081/repository/maven-group/</url>
    </repository>
  </repositories>
</project>
```

And if you want also to publish your project, add:

```
<project ...>

  ...

  <distributionManagement>
    <snapshotRepository>
      <id>nexus-snapshots</id>
      <url>http://your-host:8081/repository/maven-snapshots/</url>
    </snapshotRepository>
    <repository>
      <id>nexus-releases</id>
      <url>http://your-host:8081/repository/maven-releases/</url>
    </repository>
  </distributionManagement>
</project>
```

Now if you run in your projects:

```
mvn install
# or
mvn deploy
```

your `mvn` will point to your Nexus instance.
