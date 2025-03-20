---
description: >
  In this article we'll see how to select the SKU of an Azure SQL Server using Aspire
id: 8047
title: 'How to set the SKU of an Azure SQL Server using Aspire'
date: 2025-03-20T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8047
permalink: /aspire-azure-sql-server-sku
image: /assets/uploads/2025/03/aspire-azure-sql-server-sku.jpg
categories:  
  - Aspire
  - Azure
  - SQL Server
---

I recently started using Aspire out of curiosity, and I immediately fell in love with it. Once you've grasped the main idea, assembling and provisioning applications becomes a breeze! 

I am currently using it to deploy [Riverdam](/riverdam-feature-gates-finally-made-easy), and I will be using it for all my other Azure projects from now on, for sure.

One of the things that took me a bit to figure out was how to select the SKU for a SQL Server instance. It is not super straightforward (at least not as of today), so I figured it was a good idea to write this post in case anyone else is looking for a solution.

Enough talking, let's get to the code:

```csharp
var db = builder.AddAzureSqlServer("sql")
        .ConfigureInfrastructure(infra =>
        {
          var resources = infra.GetProvisionableResources();

          var dbRes = resources.OfType<SqlDatabase>().Single();
          dbRes.Sku = new SqlSku()
          {
              Tier = "Basic",
              Name = "Basic",
          };
        }).AddDatabase("MyDatabase");
```

Luckily it's not a lot of code, so I guess there's no real need for an explanation. Enjoy!