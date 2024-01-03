---
description: >
  Hi All! Today I want to show a quick'n'dirty way to easily deploy your Azure Function Apps using Powershell.
id: 7825
title: How to deploy Azure Function Apps with Powershell
date: 2020-11-07T22:24:58-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7825
permalink: /how-to-deploy-azure-function-apps-with-powershell/
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
image: /assets/uploads/2020/11/azure-deploy.png
categories:
  - Azure
  - Programming
tags:
  - .NET Core
  - ASP.NET Core
  - ci/cd
---
Hi All! Today I want to show a quick'n'dirty way to easily deploy your projects to Azure using Powershell.

I've been working a lot recently with Azure Functions and Web Apps. And of course, each time I'm confident with my code, I want to see it deployed on the Cloud.

Of course in an ideal world, we all would have a nice CI/CD pipeline, potentially on <a href="https://azure.microsoft.com/en-us/services/devops/?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">Azure DevOps</a>. It might happen, however, that for one reason or another, you can only get up to CI, without being able to deploy.

So the only option you have is to manually handle deployments, most likely from your local machine. But what happens if you have to deploy it to multiple destinations?

In my case, for example, I had to deploy a Function App and a Web App to multiple client subscriptions. Of course, you can always do this <a href="https://docs.microsoft.com/en-us/visualstudio/deployment/quickstart-deploy-to-azure?view=vs-2019&WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">directly from Visual Studio</a>, but it still feels like a lot of manual work.

#### What if instead you can have a very nice script that handles all the grunt work for you?

Moreover, you could potentially reuse it when you finally manage to get to the Continuous Deployment part.

So, the first step is to create the <a rel="noreferrer noopener" href="https://docs.microsoft.com/en-us/azure/devops/pipelines/artifacts/artifacts-overview?view=azure-devops&WT.mc_id=DOP-MVP-5003878" target="_blank">Release Artifact</a>. I am assuming, of course, that you've run already <a rel="noreferrer noopener" href="https://www.davidguida.net/testing-azure-functions-on-azure-devops-part-1-setup/" target="_blank">your Tests</a> and everything went fine.

My weapon of choice for these scripts today, will be Powershell:

<pre class="EnlighterJSRAW" data-enlighter-language="powershell" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">function publish{
    param(
        $projectName        
    )

    $projectPath="src/$($projectName)/$($projectName).csproj"
    $publishDestPath="publish/" + [guid]::NewGuid().ToString()

    log "publishing project '$($projectName)' in folder '$($publishDestPath)' ..." 
    dotnet publish $projectPath -c Release -o $publishDestPath

    $zipArchiveFullPath="$($publishDestPath).Zip"
    log "creating zip archive '$($zipArchiveFullPath)'"
    $compress = @{
        Path = $publishDestPath + "/*"
        CompressionLevel = "Fastest"
        DestinationPath = $zipArchiveFullPath
    }
    Compress-Archive @compress

    log "cleaning up ..."
    Remove-Item -path "$($publishDestPath)" -recurse

    return $zipArchiveFullPath
}</pre>

Here I'm building a temporary path using a GUID and calling _<a href="https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-publish?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">dotnet publish</a>_ to compile the Project and output the binaries to it. Then we generate a Zip archive and get rid of the publish folder.

The _log_ function is just a simple wrapper over _Write-Host_, I just added some fancy colors to highlight the text:

<pre class="EnlighterJSRAW" data-enlighter-language="powershell" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">function log{
    param(
        $text
    )

    write-host $text -ForegroundColor Yellow -BackgroundColor DarkGreen
}</pre>

Now that we have our Artifact, the next step is to deploy it to Azure. If you, like me, are working with Azure Functions, this is the script for you:

<pre class="EnlighterJSRAW" data-enlighter-language="powershell" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">function deploy{
    param(
        $zipArchiveFullPath,
        $subscription,
        $resourceGroup,        
        $appName
    )    

    log "deploying '$($appName)' to Resource Group '$($resourceGroup)' in Subscription '$($subscription)' from zip '$($zipArchiveFullPath)' ..."
    az functionapp deployment source config-zip -g "$($resourceGroup)" -n "$($appName)" --src "$($zipArchiveFullPath)" --subscription "$($subscription)"   
}</pre>

It simply takes the full path to the zip archive we produced before and the name of the destination Azure Subscription, Resource Group and Application. Easy peasy.

Now, I've found particularly handy to set some basic application settings, right after the deployment. For this, I keep a simple JSON file with key/value pairs and deploy it using this script:

<pre class="EnlighterJSRAW" data-enlighter-language="powershell" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">function setConfig{
    param(
        $subscription,
        $resourceGroup,        
        $appName,
        $configPath
    )
    log "updating application config..."
    az functionapp config appsettings set --name "$($appName)" --resource-group "$($resourceGroup)" --subscription "$($subscription)" --settings @$configPath
}</pre>

The config file can be something like this:

<pre class="EnlighterJSRAW" data-enlighter-language="json" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">{
  "FUNCTIONS_WORKER_RUNTIME": "dotnet",  
  "ASPNETCORE_ENVIRONMENT": "DEV",
  "Foo": "bar"
}
</pre>

The last step is to put everything together and call it. I would suggest creating a separate script with all the previous functions. We can use it as a "library" and if we're lucky enough, it won't even change much when we move to CD.

For our _local_ deployment script we will instead need two more helper functions. The first one will take care of the Artifact:

<pre class="EnlighterJSRAW" data-enlighter-language="powershell" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">function createArtifact {
    param(
        $appName
    )
    $zipPath = publish $appName
    if ($zipPath -is [array]) {
        $zipPath = $zipPath[$zipPath.Length - 1]
    }
    return $zipPath
}</pre>

We can't, unfortunately, call directly the _publish_ function because seems that the output from the _dotnet publish_ command will mess a bit with the return value. So we'll need to do some magic tricks, but not that much.

Then we can send the artifact to the cloud:

<pre class="EnlighterJSRAW" data-enlighter-language="powershell" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">function deployInstance {
    param(      
        $zipPath,  
        $subscription,
        $resourceGroup,        
        $appName,
        $configPath
    )

    deploy $zipPath $subscription $resourceGroup $appName

    if(![string]::IsNullOrEmpty($configPath)){
        setConfig $subscription $resourceGroup $appName $configPath
    }
}</pre>

If you remember, at the top of the post I said that we might have to deploy the same artifact to multiple destinations. Now that we have everything in place, all we have to do is just put the pieces together:

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">$zipPath = createArtifact "MyAwesomeProject" 
deployInstance $zipPath "MyFirstSubscription" "MyFirstResourceGroup" "MyAwesomeProject1" "DEV.settings.json"
deployInstance $zipPath "MySecondSubscription" "MySecondResourceGroup" "MyAwesomeProject2" "DEV.settings.json"
deployInstance $zipPath "MyThirdSubscription" "MyThirdResourceGroup" "MyAwesomeProject3" "DEV.settings.json"</pre>

&#8230;and so on and so forth. I think you got the idea. 

This should cover all the basic steps to deploy your code to Azure from your machine. Most of these scripts can be adapted quite easily to be executed on Azure DevOps. And that should be, ultimately, your goal: don't let this task sit on you for too long! They will create unnecessary clutter and noise, distracting from the real project!

<div class="post-details-footer-widgets">
</div>