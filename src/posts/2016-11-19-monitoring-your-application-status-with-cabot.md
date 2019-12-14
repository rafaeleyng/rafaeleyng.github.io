---
title: "Monitoring Your Application Status With Cabot"
date: 2016-11-19T19:05:26-02:00
keywords: cabot, monitoring, status, ping
author: rafaeleyng
excerpt: >
  How to setup a status check for your applications
---

Cabot is a application monitoring service. Basically a system that you deploy to your own infrastructure and configure it to check the URLs of your applications at a given interval, and possibly enable some kind of alert when things go down.

It looks like this:

![screen shot 2016-11-19 at 11 23 48 pm](https://cloud.githubusercontent.com/assets/4842605/20459783/9930e04a-aeb5-11e6-8fed-1ab2aa866d95.png)

There's a lot of services that offer similar functionality ([Pingdom](https://www.pingdom.com/), [Uptime Robot](https://uptimerobot.com/)), but Cabot is self-hosted, open-source and free, so you don't have to worry about constraints like a minimum check interval or a maximum number of applications that you can monitor.

This is a pretty basic "get started" that shows how to quickly get Cabot working. I will show only one way of doing each thing.

## Installation

Install with docker, using [cabot-docker](https://github.com/shoonoise/cabot-docker):

1. Install docker + docker-compose.

1. `git clone https://github.com/shoonoise/cabot-docker.git`

1. `cd cabot-docker` and take a look at `cabot_env` file. There's a lot of variables you can define there to configure your alerts and other integrations, just comment all of them so we don't have invalid values later.

1. `docker-compose up -d`

It should go up on port 8080 (change it on docker-compose.yml if you want). The default credentials are docker/docker.

## Concepts

3 major concepts in Cabot: check, instance and service.

**Check** is some particular task you want to run to check something. Checks can be of some predefined types, like:
  - ping: a ping to a host
  - HTTP: call an URL and check the HTTP status.

**Instance** is an actual instance of a machine that will have some service running. It will have a IP/hostname.

**Service** is the macro stuff you want to monitor.

Cabot's documentation is pretty obscure about those concepts, so here is my take on how to use them.

## Configuring

There's an N-N relationship between those 3 entities, so it can be pretty confusing how to organize and relate everything. This post is pretty opinionated about how to do it.

You can have a **service** with multiple **instances**, and multiple **checks** pointing to each instance.

I'm using Cabot to monitor both my front-end servers and my API, of multiple applications, running each on multiple servers.

I start by creating my **instances**. Every newly created instance will have an IP/hostname, and will automatically create a ping **check** to it. For each instance, I create an HTTP **check** that checks for HTTP status and some text match on the return. Then I create a **service** and group on it all of its instances.

## Automating

Clicking is tedious, error prone and slow. Mostly, it is the wrong way.

Unfortunately, Cabot doesn't have a REST API that we can use to configure our services automatically.

The way I see it, we have 2 options:

- [Edit 2016-12-23: deprecated. See cabot-db-config bellow] I've created [cabot-zombie](https://github.com/rafaeleyng/cabot-zombie), that spins up a headless browser and configures Cabot based on a Javascript object. Check out the project for more details.

- Access the Postgres instance that Cabot uses and make some inserts directly. The tables involved are:
  - cabotapp_instance_status_checks
  - cabotapp_instance
  - cabotapp_instancestatussnapshot
  - cabotapp_service_instances
  - cabotapp_service_status_checks
  - cabotapp_service
  - cabotapp_servicestatussnapshot
  - cabotapp_statuscheck
  - cabotapp_statuscheckresult

- I've created [cabot-db-config](https://www.npmjs.com/package/cabot-db-config), which uses a configuration similar to cabot-zombie, but is way faster and more reliable, because it connects directly to your Cabot database to insert the configuration.

Actually what I use currently is cabot-db-config to create stuff, and if I want to change something, I just delete everything from the tables above and rerun cabot-zombie with my changes.
