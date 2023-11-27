---
description: >
  Distributed Transactions Made Easy is my attempt at demistifying the issues that may arise when working with complex, distributed systems. Go check it out now!
id: 8037
title: 'Distributed Transactions Made Easy'
date: 2023-11-27T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8037
permalink: /distributed-transactions-made-easy
image: /assets/uploads/2023/11/distributed-transactions-made-easy.jpg
categories:  
  - Software Architecture
  - Design Patterns
  - Booklet
  
---

### Disclaimer
> This article contains a snippet from my last booklet: <a href='https://payhip.com/b/tezgU' target='_blank'>Distributed Transactions Made Easy</a>

In the world of microservices and globally distributed applications, we can find ourselves quite often in charge of juggling complex operations that span multiple services. 

Imagine a multi-platform booking system, or even a “simple” e-commerce, with its Inventory, Payments and Shipping microservices. 
How do we ensure data consistency across all the moving parts? 

In this chapter, we will see the basic concepts and some of the patterns that can help us build more resilient, robust and stable applications.

Let us begin by defining some basic terminology. A Transaction defines a sequence of data operations executed as a single unit of work. 
Its goal is to ensure the consistency and integrity of data stored in the database by either executing all the operations in the sequence or none of them.

In a monolith architecture, we normally have a single application server that communicates with a single database server. In this context, a transaction ensures consistency and integrity of data by either executing all the operations in the sequence or none of them.

Now, in simple architectures with a single application server and a single database server, transactions are relatively straightforward to implement. The application reads from and writes to a single database, and therefore the data will always be consistent. A transaction might of course fail and be rolled back, but since the source of truth is always the same, there is no chance for misalignment. 
So basically, the application server communicates with the database server and executes a series of database operations as a single, atomic unit of work. 

Things get more complicated once we start adding replicas, caching and so on. We will address those in another chapter.

In microservices architectures, handling transactions becomes more complex. This is due to the fact that transactions now span multiple microservices and multiple databases. 
Let's not forget though, that by definition, each microservice has its own database (some might not even have it). This means that we can't have "local" transactions spanning multiple DBs, with potentially even different technologies.

So now transactions span multiple microservices and multiple databases. Our goal, in this case, is "all or nothing". We need to ensure that all involved systems are either updated or none are updated in the event of a failure. 

Basically, each service has to remain in a consistent state, even if one of them fails during the transaction. 

> Don't miss the rest of the chapter! <a href='https://payhip.com/b/tezgU' target='_blank'>Distributed Transactions Made Easy</a> is available now!