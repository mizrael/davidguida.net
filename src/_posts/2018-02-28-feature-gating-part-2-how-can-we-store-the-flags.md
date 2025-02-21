---
description: >
  In the first article of this series we discussed the general concept behind Feature Gating, now we will talk a little about how we can store the flags. A very naive approach is using a simple file per environment but are there better alternatives?
id: 6436
title: 'Feature Gating part 2 : how can we store the flags?'
date: 2018-02-28T11:25:08-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6436
permalink: /feature-gating-part-2-how-can-we-store-the-flags/
image: /assets/uploads/2018/02/feature_gating-e1519643864384.jpg
categories:
  - Programming
  - Software Architecture
---
In the <a href="https://www.davidguida.net/feature-gating-part-1-what-is-it/" target="_blank" rel="noopener">first article of this series</a> we discussed the general concept behind **Feature Gating**, now we will talk a little about how we can **store the flags**.

A very naive approach is using a **simple file** per environment. You can serialize your flags in any way you want, json, xml, <a href="https://en.wikipedia.org/wiki/INI_file" target="_blank" rel="noopener">ini</a>&#8230; then all you have to do is reading this configuration during the application startup and you&#8217;re done.&nbsp;  
It&#8217;s a very simple method and works very well for small applications and prototypes. Of course you have to remember to deploy the configuration every time something changes. Also you&#8217;ll have to implement some sort of flags hot-reloading in the application, otherwise the only option is restarting it (or if you&#8217;re under IIS, waiting for app pool recycling).  
I said &#8220;one file per environment&#8221; because I&#8217;m pretty sure you have different configurations on DEV, UAT and production. Maybe you want all your flags to be on on DEV and only a small subset on production. Whatever suits your needs.

The next obvious step is persisting the flags in the&nbsp;**application database**. You can start with a simple table with the flag name and the boolean value.  
Later on it will be possible to extend the system by creating relationships to the other tables according to your specific **business logic.&nbsp;**For example you might want to link flags to user profiles/permissions to allow only subsets of user accessing the features.&nbsp;  
This approach gives more flexibility during deployment, although you still need the hot-reloading. Also, linking the flags table to others might create unnecessary clutter and prevent <a href="https://martinfowler.com/bliki/MonolithFirst.html" target="_blank" rel="noopener">splitting the monolith</a>.

Let&#8217;s move forward to another approach: a **key/value storage.&nbsp;**<a href="https://redis.io/" target="_blank" rel="noopener">Redis</a> can be a very good candidate but <a href="https://db-engines.com/en/ranking/key-value+store" target="_blank" rel="noopener">here&#8217;s a list</a>, just in case.&nbsp;  
Using this kind of databases you have few nice advantages: first of all you can decouple the feature gating from your application using a microservice.  
Also, it would be possible to easily store different types of data not just boolean flags. Suppose for example that you want a feature to be enabled only for users in Canada and Japan. A solution could be storing the country codes in the flag value instead of true/false.

The last step is using a third party service. That means you&#8217;ll have to write the integration but most of the times there will be libraries already. Just make sure to pick a product with good documentation and decent user base.  
Of course you won&#8217;t have anymore control over your data and in the worst case you might have to &#8220;bend&#8221; a little the system to accommodate your application needs. It&#8217;s something that happens every time an external solution is used: might cover 90% of the functionalities you need&#8230;but that 10% could require a lot of refactoring on your side.

In <a href="https://www.davidguida.net/feature-gating-part-3-how-check-the-gates/" target="_blank" rel="noopener">the next article</a> I&#8217;ll show some design patterns you can use in your code to check the feature gates. Stay tuned!