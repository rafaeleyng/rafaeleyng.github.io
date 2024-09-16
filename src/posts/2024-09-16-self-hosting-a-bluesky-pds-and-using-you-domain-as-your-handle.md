---
title: "Self-hosting a Bluesky PDS and using you domain as your handle"
date: 2024-09-16
excerpt: >
  A complete guide to host your own PDS on Digital Ocean and use your domain name as your user handle.
---

For simplicity, this post is opinionated and uses [Namecheap](https://www.namecheap.com/), [Digital Ocean](https://digitalocean.com/), and [Resend](https://resend.com/).

Create an account on each one. It should be straightforward to replace them with your preferred services, doing the necessary adjustments.

## What we'll do

In this post, I will:
* Buy the domain `bskydemo.xyz`. **NOTE: I'll use this domain name throughout the post, use yours instead**.
* Run the Bluesky PDS (Personal Data Server) that will contain your own account data (including your posts) on a cloud platform. You can add other accounts if you want to, but it is out of scope here.
* Point `pds.bskydemo.xyz` to the PDS instance.
* Create an account on Bluesky using `pds.bskydemo.xyz` as the PDS.
* Use the custom domain `bskydemo.xyz` as the user handle on Bluesky (`@bskydemo.xyz`).
* Redirect `bskydemo.xyz` to the Bluesky profile (`https://bsky.app/profile/bskydemo.xyz`).

You can pick only the ones that you are interested in.

## Buy a domain name

Go to Namecheap and buy a domain name. We'll come back later to Namecheap to do DNS configurations.

Pick a cheap domain like `.xyz` or `.blog`, which cost around $2/year at the time of writing.

## Create your PDS instance

Go to Digital Ocean and create a project (just a wrapper to organize resources) called `bluesky-pds` and a create a new Droplet (what Digital Ocean calls their VMs).

Pick:
* In "Choose an image" -> Marketplace -> search for "BlueSky Social PDS".

  ![digital-ocean1](https://github.com/user-attachments/assets/86b1e8a7-1275-44e4-8ff5-cab7a2f122a9)

* In "Choose Size", get one of the cheapest and smallest options. I picked 1 GB of RAM, 1 CPU, 25 GB of SSD. At the time of writing, it costs $6/month.

  ![digital-ocean2](https://github.com/user-attachments/assets/54f4ee19-b17a-466e-824f-8e6278cde173)

* In "Choose Authentication Method", either configure access via SSH key or password. Later we'll need one of those to access the Droplet.

Create the Droplet, and once done, copy the IPv4 address of the Droplet. In my case, it is `167.172.254.26`. **NOTE: I'll use this IP throughout the post, use yours instead**

  ![digital-ocean3](https://github.com/user-attachments/assets/b3fdfc60-2a94-4b4a-a196-675621998061)

## Configure your domain name's DNS

Back to Namecheap, find your domain in "Domain List", click "Manage" -> "Advanced DNS".

  ![namecheap1](https://github.com/user-attachments/assets/9afa4191-a2c8-4e65-b3ae-6e1b5b8dbc33)

Create these 3 records. Note the `Host` in the first line is an `@`, which means the root domain:

  ![namecheap2](https://github.com/user-attachments/assets/ec8ba4da-1518-46b6-99d2-2c8f16dbaaf8)

Test that your DNS config is working by using https://dnschecker.org/#A/bskydemo.xyz. It should show the IP address you set. This might take a few minutes to propagate to all locations.

  ![dnschecker1](https://github.com/user-attachments/assets/c851cca6-79c0-46b2-b987-af32fd8cd476)

## Initialize the PDS

Connect to the Droplet using `ssh`:

```shell
ssh root@bskydemo.xyz
```

It will prompt you a few questions:
* `Enter your public DNS address (e.g. example.com)`: enter `pds.bskydemo.xyz`.
* `Enter an admin email address (e.g. you@example.com)`: enter your own email. At this point it will initialize the PDS, it will take a few seconds.
* `Create a PDS user account? (y/N)`: press enter for `N`.

## Configure a domain on Resend

In Resend, configure a domain. In my case, it is `bskydemo.xyz`.

Go back to Namecheap and add a record like this:

  ![namecheap3](https://github.com/user-attachments/assets/59fc9482-cfc7-4de6-bc8b-eee86a72df05)

## Create an API key on Resend

Go to Resend and create an API key. Copy that API key and store it somewhere safe, we'll need it soon. You can restrict it only to sending access and to the domain you configured above.

  ![resend1](https://github.com/user-attachments/assets/ad8f242e-f641-48a0-a662-06f51cab6f41)

The free plan should be enough for your needs.

## Configure SMTP on the PDS to be able to verify an account's email

Back to the `ssh` session, run this (**NOTE: first edit the 2 values as needed, the first with your Resend API key, the second with your email - has to be on the domain configured on Resend**).

```shell
echo 'PDS_EMAIL_SMTP_URL=smtps://resend:YOUR_API_KEY_HERE@smtp.resend.com:465/' >> /pds/pds.env
echo 'PDS_EMAIL_FROM_ADDRESS=admin@bskydemo.xyz' >> /pds/pds.env
reboot
```

You SSH session will close while the VM reboots. The PDS will restart with the new SMTP configuration.

Access the server again and run `pds create-invite-code`. It will output a code that you can use to create an account.

## Create a Bluesky account

Go to https://bsky.app/ (while being logged out), click "Sign up". Select "Hosting provider" -> "Custom", and enter `pds.bskydemo.xyz`

Enter the information requested. The invite code is the one you got from `pds create-invite-code`. You can use your personal email, even if you already have a Bluesky account. You'll need to verify the email, so use an address that you can access.

For the handle, enter anything for now, like `temp`. Your user handle will be `temp.pds.bskydemo.xyz`. We'll change it later.

## Verify your account's email

Go to https://bsky.app/settings, click "Verify My Email". You'll get an email with a code to input in the next step.

Tip: if you get an error here, check the network tab on the browser. The error is most likely happening on your PDS, and the full error will be there. You can access it with `docker logs -f pds` while you do the email verification process.

## Configure the domain name as your handle

Go to https://bsky.app/settings, click "Change Handle" -> "I have my own domain". Enter `bskydemo.xyz` as the handle you want to use.

Go to Namecheap and add this record (**NOTE: copy the DID value from the Bluesky settings page**, don't use the same as mine):

  ![namecheap4](https://github.com/user-attachments/assets/c45d819c-c7a3-4683-a007-3319b68f9576)

Check in https://dnschecker.org/#TXT/_atproto.bskydemo.xyz that your record is correctly configured (it should return the same DID value as in the Bluesky settings page):

  ![dnschecker2](https://github.com/user-attachments/assets/f3ee72f9-d215-4057-8e39-5964659c2874)

Back to the settings page, click "Verify DNS Record" and click to update your handle to `@bskydemo.xyz`.

If you have any issues doing this through the UI, try doing it through the API directly. From https://aaronparecki.com/2023/03/07/3/bluesky-custom-domain:

```sh
http post https://pds.bskydemo.xyz/xrpc/com.atproto.server.createSession identifier=YOUR_EMAIL password=YOUR_PASSWORD
# Use the value of "accessJwt" below
http post https://pds.bskydemo.xyz/xrpc/com.atproto.identity.updateHandle Authorization:"Bearer ACCESS_JWT_RETURNED ABOVE" handle=bskydemo.xyz
```

## Point your domain to your Bluesky profile

If you want to make https://bskydemo.xyz redirect to https://bsky.app/profile/bskydemo.xyz, you need to configure it on the Caddy server running alongside the PDS.

Connect to your Droplet again and run:

```shell
cat <<EOF >> /pds/caddy/etc/caddy/Caddyfile

bskydemo.xyz {
        redir https://bsky.app/profile/bskydemo.xyz
}

EOF

reboot
```

Once the reboot is done (and Caddy is running, so give it a minute), access https://bskydemo.xyz. It should redirect to the Bluesky profile.

## Conclusion

You now have a Bluesky PDS running on Digital Ocean, using your domain name as your user handle. You can post and interact with other Bluesky users.

Note how, even though `pds.bskydemo.xyz` and `bskydemo.xyz` resolve to the same IP address, they are used for different purposes. We want `https://bskydemo.xyz` to redirect to the profile, as it is the most user-friendly URL. So we need a different URL to access the PDS, hence `pds.bskydemo.xyz`, which won't redirect.
