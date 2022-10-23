---
description: >
  In the second article of this Series, we will continue our discussion about Managed System Identities on Azure and how they can be used to grant access to an Azure KeyVault.
id: 8028
title: 'Azure Functions with Managed Identities - Part 2: access to KeyVaults'
date: 2022-10-22T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8028
permalink: /azure-managed-identities-functions-part-2
image: /assets/uploads/2022/10/azure-managed-identities-functions-part-2.jpg
categories:  
  - Azure
---

Hi All! In this second article of this Series, we will continue our discussion about <a href='/azure-managed-identities-functions-part-1' target='_blank'>**Managed System Identities**</a> on Azure and see how they can be used to grant access to an Azure KeyVault.

So without further ado, let's take a look at our ARM template:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "parameters": {    
    // same as last time
  },
  "variables": {
    "keyVaultName": "[toLower(concat(parameters('serviceName'), '-', parameters('environment')))]"
    // the rest is the same as last time
  },
  "resources": [
    // keyvault
    {
      "type": "Microsoft.KeyVault/vaults",
      "name": "[variables('keyVaultName')]",
      "apiVersion": "2019-09-01",
      "location": "[parameters('location')]",
      "dependsOn": [
          "[variables('identityResourceId')]"
        ],
      "properties": {
        "enabledForDeployment": false,
        "enabledForDiskEncryption": false,
        "enabledForTemplateDeployment": true,
        "tenantId": "[tenant().tenantId]",     
        "sku": {
          "name": "Standard",
          "family": "A"
        },
        "networkAcls": {
          "defaultAction": "Allow",
          "bypass": "AzureServices"
        },
        "accessPolicies": [             
          {
            "tenantId": "[tenant().tenantId]",   
            "objectId": "[reference(concat('Microsoft.ManagedIdentity/userAssignedIdentities/', variables('identityName')), '2018-11-30').principalId]",
            "permissions": {
              "secrets": [
                "list",
                "get"
              ]
            }
          }
        ]
      }
    },

    // function app
    {
      "name": "[variables('funcAppName')]",            
      "properties": {
        "keyVaultReferenceIdentity": "[variables('identityResourceId')]"
      }
      // all the rest is the same as last time
    }
  ]
}
```
I've omitted __a lot__ of code here, so be careful. I've added only the important bits. First of all, we declare a new variable, `keyVaultName`, which we'll use immediately after when we define our KeyVault resource. In this one, as you may have noticed, we take a dependency on the MSI resource. This is necessary, so that we can later on create an Access Policy for it. 

### This is extremely important, as it allows the MSI to have access to the KeyVault, with whatever permissions we decide to specify there.

Then we go with another very important piece: we need to add the `keyVaultReferenceIdentity` property to our Function App. 
This will instruct the App to use the assigned MSI when pulling references from the KeyVault. **Don't miss it!**

As bonus point, now we can actually use the KeyVault to store secrets and reference them from the Function App. Let's see how:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "parameters": {    
    // omitted for brevity
  },
  "variables": {    
    // omitted for brevity
  },
  "resources": [
    // Storage Account secret
    {
      "type": "Microsoft.KeyVault/vaults/secrets",
      "name": "[concat(variables('keyVaultName'),'/','StorageAccountConnStr')]",
      "apiVersion": "2021-10-01",
      "properties": {
        "contentType": "text/plain",
        "value": "[concat('DefaultEndpointsProtocol=https;AccountName=', variables('storageAccountName'), ';AccountKey=', listKeys(variables('storageAccountResourceId'), '2017-10-01').keys[0].value, ';EndpointSuffix=', 'core.windows.net')]"
      },
      "dependsOn": [
        "[variables('keyVaultResourceId')]",
        "[variables('storageAccountResourceId')]"
      ]
    },

    // Function App settings
    {
      "name": "[concat(variables('funcAppName'), '/appsettings')]",
      "type": "Microsoft.Web/sites/config",
      "apiVersion": "2021-03-01",
      "dependsOn": [
        "[variables('keyVaultResourceId')]",        
        "[resourceId('Microsoft.Web/sites', variables('funcAppName'))]"        
      ],
      "properties": {
        "AzureWebJobsStorage": "[concat('@Microsoft.KeyVault(SecretUri=https://', variables('keyVaultName'), '.vault.azure.net/secrets/StorageAccountConnStr)')]",
        // add any other settings you need
      }
    },

    // rest is omitted for brevity
  ]
}
```
The first thing we do here is to create a new secret for the Storage Account connection string. At this point we can create the Function App settings (which was missing the last time), adding the reference to the Secret to the KeyVault.

That's all!
