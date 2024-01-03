---
description: >
  In this last article of the Series, we're going to see how we can setup the testing pipeline for our Azure Functions on Azure DevOps.
id: 7716
title: 'Testing Azure Functions on Azure DevOps - part 2: the pipeline'
date: 2020-09-16T22:05:10-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7716
permalink: /testing-azure-functions-on-azure-devops-part-2-the-pipeline/
zakra_layout:
  - tg-site-layout--customizer
zakra_remove_content_margin:
  - "0"
zakra_transparent_header:
  - customizer
zakra_page_header:
  - "1"
zakra_logo:
  - "0"
image: /assets/uploads/2020/09/continuous-integration-delivery-deployment.jpg
categories:
  - .NET
  - Azure
  - Testing
tags:
  - .NET Core
  - Azure
  - Azure DevOps
  - Azure Functions
  - testing
---
Hi All! Welcome back to the second part of the Series. In this last article, we're going to see how we can setup the testing pipeline for our **Azure Functions** on <a href="https://azure.microsoft.com/en-us/services/devops/?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">Azure DevOps</a>.

<a href="https://www.davidguida.net/testing-azure-functions-on-azure-devops-part-1-setup/" target="_blank" rel="noreferrer noopener">Last time</a> we saw how we could structure our test project using XUnit Fixtures and how it is possible to launch the Function Host as an external tool to <a href="https://www.davidguida.net/testing-boundaries-web-api/" target="_blank" rel="noreferrer noopener">test the boundaries</a> of our services.

#### This is great on localhost, but now, of course, we want it to be part of our CI/CD pipeline. 

Now, I'm assuming you already know how to use Azure DevOps to build your pipelines. But in case you need a refresher, you can find a <a rel="noreferrer noopener" href="https://docs.microsoft.com/en-us/azure/devops/pipelines/create-first-pipeline?WT.mc_id=DOP-MVP-5003878&view=azure-devops&tabs=net%2Cyaml%2Cbrowser%2Ctfs-2018-2" target="_blank">lot of information here</a>.

So let's jump into the code, we'll discuss the details after:

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">pool:
  name: windows-2019

variables:  
  functionAppName: 'MyLovelyFunction'  
  workingDirectory: '$(System.DefaultWorkingDirectory)/$(functionAppName)'  
  ASPNETCORE_ENVIRONMENT: 'ci'

stages:
- stage: Build
  displayName: Build stage

  jobs:
  - job: Build
    displayName: Build

    steps:            
    - script: | 
        "%ProgramFiles(x86)%\Microsoft SDKs\Azure\Storage Emulator\AzureStorageEmulator.exe" init /server "(localdb)\MsSqlLocalDb"
        "%ProgramFiles(x86)%\Microsoft SDKs\Azure\Storage Emulator\AzureStorageEmulator" start
        cp '$(workingDirectory)\ci.settings.json' '$(workingDirectory)\local.settings.json'
        dotnet test
      workingDirectory: $(System.DefaultWorkingDirectory)
      displayName: Test 

    - task: DotNetCoreCLI@2
      displayName: Build Release
      inputs:
        command: 'build'
        projects: |
          $(workingDirectory)/*.csproj
        arguments: --output $(System.DefaultWorkingDirectory)/publish_output --configuration Release</pre>

So, the first thing is to specify the type of agent we want to use. Now, since we're going to rely on the <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Ccsharp%2Cbash&WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener"><strong>Azure Functions CLI</strong> </a>and the **<a href="https://docs.microsoft.com/en-us/azure/storage/common/storage-use-emulator?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">Azure Storage Emulator</a>**, we need an agent that has them installed. Luckily for us, Microsoft is offering <a href="https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/hosted?WT.mc_id=DOP-MVP-5003878&view=azure-devops&tabs=yaml" target="_blank" rel="noreferrer noopener">managed agents as well</a>, so we don't have to worry about this.

In our case, I've selected the _windows-2019_ agent, which comes with a quite comprehensive list of <a rel="noreferrer noopener" href="https://github.com/actions/virtual-environments/blob/main/images/win/Windows2019-Readme.md" target="_blank">software pre-installed</a>.

A note about the **Storage Emulator**: it has <a href="https://github.com/Azure/azure-sdk-for-net/issues/7208" target="_blank" rel="noreferrer noopener">been discontinued</a> in favor of <a href="https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azurite?toc=/azure/storage/blobs/toc.json&WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">Azurite</a>. However, I haven't been able to run my tests using the latter. I'll probably blog more about this in the next weeks.

### The first step in our pipeline contains all we need to setup the agent and start the tests. Let's analyze the script line by line.

The first two lines will instruct the **Storage Emulator** to init the local server and start the engine:

<pre class="wp-block-preformatted">%ProgramFiles(x86)%\Microsoft SDKs\Azure\Storage Emulator\AzureStorageEmulator.exe" init /server "(localdb)\MsSqlLocalDb"
"%ProgramFiles(x86)%\Microsoft SDKs\Azure\Storage Emulator\AzureStorageEmulator" start</pre>

This third line is actually optional. In case you have custom options for your CI environment, you can define a custom config file and replace _local.settings.json_, which is mandatory for the Functions Host to run:

<pre class="wp-block-preformatted">cp '$(workingDirectory)\ci.settings.json' '$(workingDirectory)\local.settings.json'</pre>

Aaaand at last:

<pre class="wp-block-preformatted">dotnet test</pre>

That's it! 

<div class="post-details-footer-widgets">
</div>