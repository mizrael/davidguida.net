---
description: >
  In this article, we'll see how to integrate Azure Key Vault in an Azure Function and use it as configuration provider
id: 8022
title: 'How to add Azure Key Vault to an Azure Function'
date: 2022-03-19T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8022
permalink: /how-to-add-keyvault-to-azure-function
image: /assets/uploads/2022/03/how-to-add-keyvault-to-azure-function.jpg
categories:  
  - Azure
  - Azure Functions
  - Security
  - .NET
---

Hi All! Today we'll see how to integrate **Azure Key Vault** in an **Azure Function** and use it as a configuration provider.

As a rule of thumb, things like connection strings, API keys, all sorts of credentials, should never be stored in plain text in our sources. 

Nowadays, it's all about _"thou shall have configuration-as-code"_, and that's absolutely true. 
But it's also true that storing sensitive data in a repository (and potentially deploying along with the artifacts) is equivalent to giving our house keys to every attacker.

> But how can we even connect to our databases if we can't have the connection string somewhere?

This is a job for <a href='https://azure.microsoft.com/en-us/services/key-vault/' target='_blank' title='Azure Key Vault'>Azure Key Vault</a>!

When configuring our Web App or our Function App, we can link to secrets stored in a Key Vault by using a _reference_. 
Just add your entry in your app settings and use this syntax for its value: 

`@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/)`

The only prerequisite, of course, is that your application has the necessary permissions to read secrets from the Key Vault. 
And this is extremely easy to do: give a <a href='https://docs.microsoft.com/en-us/azure/app-service/overview-managed-identity?tabs=portal%2Chttp' target='_blank' title='Managed Identity'>Managed Identity</a> to your app and then create an <a href='https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-nonaad' target='_blank' title='Access Policy'>Access Policy</a> on your Key Vault.

### Now, this works fine once deployed on Azure, but unfortunately, Key Vault references are not supported when working on localhost.

The other option we have is to configure our app to use the Key Vault directly as a <a href='https://docs.microsoft.com/en-us/dotnet/core/extensions/configuration-providers' target='_blank' title='configuration provider'> **configuration provider**</a>, as we normally do for JSON files or Environment Variables.

The first step is to add the **Azure.Extensions.AspNetCore.Configuration.Secrets** Nuget package to our csproj:

```
dotnet add package Azure.Extensions.AspNetCore.Configuration.Secrets
```

After that you'll have to tell your `IConfigurationBuilder` to pull entries from your Key Vault. This however, is a little bit of a chicken and the egg problem: how can we know the endpoint of our Key Vault without having a configuration loaded first?

Well, you can either hardcode it (yuk!) or you create a temporary config using the providers added so far. Something like this:

```csharp
builder.AddEnvironmentVariables();

var tmpConfig = builder.Build();
var vaultUri = tmpConfig["VaultUri"];
builder.AddAzureKeyVault(new Uri(vaultUri), new DefaultAzureCredential());
```

That's it, you're done. Now all the secrets on that Key Vault will be accessible through `IConfiguration`, no need for references anymore!

I've published a sample Function App on <a href='https://github.com/mizrael/AzureFunction-KeyVault' target='_blank' title='GitHub'>GitHub</a>. It loads the settings as explained before and makes them accessible through an HTTP trigger, which is absolutely **_NOT_** what you would do in a real application :)