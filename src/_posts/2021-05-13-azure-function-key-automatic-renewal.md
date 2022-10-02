---
description: >
  Let's see how we can automatically renew Function Keys on an Azure Function App using an Azure DevOps Pipeline
id: 8010
title: 'How to automate keys renewal on Azure Functions'
date: 2021-05-13T10:00:07-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8010
permalink: /azure-function-automatic-keys-renewal/
image: /assets/uploads/2021/05/azure-function-automatic-keys-renewal.jpg
tags:
  - Azure
  - Reliability
  - Security
---

Hi All! Today we'll see how we can automate the key renewal process on an **Azure Function App** using an **Azure DevOps Pipeline**.

But before all: why would we ever bother with renewing a Function Key? For the same reasons you would use Function Keys in the first place: security.

From the <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger?WT.mc_id=DOP-MVP-5003878&tabs=csharp#authorization-keys" target="_blank">official documentation</a> :

> Functions lets you use keys to make it harder to access your HTTP function endpoints during development. Unless the HTTP access level on an HTTP triggered function is set to `anonymous`, requests must include an API access key in the request.

Now, keys can get compromised after a while, so it's a good practice to renew them from time to time. This can be easily done directly from the Azure Portal, but being the laziest person in the world, I want this to be completely automated.

### Of course, once we have renewed a key, we would have to inform every possible consumer. While this *might* be possible for internal-facing Functions, it is not exactly the best strategy for internet-accessible ones.

A very simple and effective solution is to store the key in an **Azure KeyVault** secret. This way the consuming application will always retrieve the latest version available of a particular key, without worrying about it being outdated or expired.

Also, if you're writing an Azure Function or Web App, it is possible to store a reference to the secret as an **Application Setting**:

```
@Microsoft.KeyVault(SecretUri=https://[key vault name].vault.azure.net/secrets/[secret name])
```

This gets rid of the need to invoke the KeyVault APIs manually from code, definitely better. The only caveat is that the Application needs a <a href="https://docs.microsoft.com/en-us/azure/app-service/overview-managed-identity?tabs=dotnet&WT.mc_id=DOP-MVP-5003878" target="_blank">Managed Identity</a> with GET permissions on KeyVault secrets.

So, as usual, there are different ways to skin the cat: to automate the key renewal we could use <a href="https://docs.microsoft.com/en-us/azure/key-vault/general/event-grid-overview?WT.mc_id=DOP-MVP-5003878" target="_blank">the SecretNearExpiry event</a>, or a Logic App or a Function App with a *cron* trigger.

I decided instead to go with a quick'n'dirty solution with **Azure DevOps Pipelines** and a bit of bash scripting.

The idea is pretty simple: we can use a cron-triggered pipeline (eg. once every week) to run a script that will renew the Function key and update the secret value in the KeyVault.

Let's take a look at the script first:

```bash
#/bin/bash

subscription=$1
resourceGroup=$2
appName=$3
vaultName=$4
secretName=$5

echo "generating new default key for $subscription \ $resourceGroup \ $appName ..."

newKey=$(az functionapp keys set --key-name 'default' \
        --key-type functionKeys \
        --name $appName \
        --resource-group $resourceGroup \
        --subscription $subscription | jq '.value' | tr -d \" )

echo "updating value for secret $subscription \ $vaultName \ $secretName ..."

newSecretId=$(az keyvault secret set --subscription $subscription \
        --vault-name $vaultName \
        --name $secretName \
        --value $newKey | jq '.id')

echo "new secret id: $newSecretId"
```

We first use `az functionapp keys set` to generate a new key and store it in a variable. Then we call `az keyvault secret set` to update the secret value. 

The Pipeline's code, at this point, is quite straightforward:

```yaml
schedules:
- cron: "0 0 * * *"
  displayName: Renew Function key
  branches:
    include:
    - main

stages:
- stage: renew_key 
  displayName: Renew Function key

  jobs:    
  - job: renew_key    
    steps:        
    - task: AzureCLI@2
      displayName: Renew Function key
      inputs:
        azureSubscription: My_Subscription_Name
        scriptType: bash
        scriptLocation: inlineScript
        inlineScript: | 
          chmod +x .keyrotator.sh
          ./keyrotator.sh 'SubscriptionName' 'ResourceGroupName' 'FunctionAppName' 'KeyVaultName' 'SecretName'       
```

We use a cron expression to schedule the execution of an <a href="https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/deploy/azure-cli?view=azure-devops&WT.mc_id=DOP-MVP-5003878" target="_blank">AzureCLI</a> task. Inside this task we simply run the previous bash script with the proper parameters. 

### The nice thing is that beinng the script completely parametrized, we can easily add more steps, one per environment or for other Function Apps.

Ciao!