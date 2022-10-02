---
description: >
  In this first article of the Series, we'll see how to build and setup the testing framework for our Azure Functions.
id: 7649
title: 'Testing Azure Functions on Azure DevOps &#8211; part 1: setup'
date: 2020-09-06T20:27:00-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7649
permalink: /testing-azure-functions-on-azure-devops-part-1-setup/
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
image: /assets/uploads/2020/09/azure-functions-testing.jpg
categories:
  - .NET
  - ASP.NET
  - Azure
  - Programming
  - Testing
tags:
  - .NET Core
  - Azure
  - Azure DevOps
  - Azure Functions
  - testing
---
Hi All! Today we&#8217;re going to talk a bit about testing strategies for Azure Functions. We&#8217;ll see how setup our test framework and in another article, we&#8217;ll see how to create a build pipeline on **<a href="https://azure.microsoft.com/en-us/services/devops/?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">Azure DevOps</a>.**

As part of my daily job, I&#8217;m spending a lot of time working with Azure and Azure Functions. These days I&#8217;m also working a lot with <a href="https://www.davidguida.net/how-to-use-azure-durable-entities-to-see-whos-the-strongest-avenger/" target="_blank" rel="noreferrer noopener">Durable Entities</a>, which open the door to even more scenarios. Anyways, no matter what&#8217;s the technology behind, one of the best ways to ensure that our software is reliable is to add automatic tests. And these tests **have to be part of the build pipeline**.

Now, based on my researches so far, we can&#8217;t create a Functions Host directly as <a rel="noreferrer noopener" href="https://www.davidguida.net/testing-boundaries-web-api/" target="_blank">we could do</a> for a &#8220;regular&#8221; WebAPI. What we can do instead is make use of the <a rel="noreferrer noopener" href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?WT.mc_id=DOP-MVP-5003878" target="_blank">Azure Function Core Tools</a> and manually (aka via code) spin up the host in an XUnit Fixture.

This has the only drawback that when running the tests locally we won&#8217;t be able to debug the Function code. However, keep in mind the goal here: we want to test the boundaries of our services by probing the various <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings?WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">Function Triggers</a>. 

#### And this is a form of _<a href="https://academic.microsoft.com/topic/24169984/publication/search?q=Black-box%20testing&qe=And(Composite(F.FId%253D24169984)%252CTy%253D%270%27)&f=&orderBy=0" target="_blank" rel="noreferrer noopener">Black Box Testing</a>_**:** we&#8217;re not supposed to know what&#8217;s inside the box, only how to operate it.

If we need to debug, we can always run the Function project directly from VS and check the behaviour via Postman (if it&#8217;s a REST endpoint). Just sayin&#8217;.

Moreover, as stated before, we will be executing those tests in our build pipeline, so debugging is not our primary interest.

Anyways, let&#8217;s just into the code! The first thing to do, assuming we already have an **Azure Functions** project, is to create the Test project, add a reference to XUnit and create a <a href="https://xunit.net/docs/shared-context" target="_blank" rel="noreferrer noopener">Fixture</a>:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class AzureFunctionsFixture : IDisposable
{
	private readonly Process _funcHostProcess;	

	public readonly HttpClient Client;

	public AzureFunctionsFixture()
	{		
		var port = /*get this from config*/
		var dotnetExePath = /*get this from config*/
		var functionHostPath = /*get this from config*/		
		var functionAppFolder = /*get this from config*/

		_funcHostProcess = new Process
		{
			StartInfo =
			{
				FileName = dotnetExePath,
				Arguments = $"\"{functionHostPath}\" start -p {port}",
				WorkingDirectory = functionAppFolder
			}
		};
		var success = _funcHostProcess.Start();
		if (!success || _funcHostProcess.HasExited)
			throw new InvalidOperationException("Could not start Azure Functions host.");

		this.Client = new HttpClient();
		this.Client.BaseAddress = new Uri($"http://localhost:{port}");
	}
}</pre>

As you can see, in the cTor we&#8217;re reading few values from the configuration:

  * the path to _dotnet.exe_
  * the path to _func.dll_ from the **Azure Functions Core Tools**
  * the path to our Azure Functions DLL
  * the port we want to use to expose the host 

The _Process_ class will be basically running something like:

<pre class="wp-block-preformatted"><em>dotnet "%APPDATA%\npm\node_modules\azure-functions-core-tools\bin\func.dll" start -p 7071</em> </pre>

from the _bin\Debug_ (or _Release_) directory of our Azure Functions project.

We&#8217;re also creating and publicly exposing an _HttpClient_: our tests will be using it to &#8220;talk&#8221; with the Functions Host. To keep things simple, I&#8217;m assuming that we&#8217;re using only HTTP Triggers. 

As some of you might have noticed, the Fixture class is also implementing _IDisposable_, to properly dispose of the _Process_ and of the _HttpClient_:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public void Dispose()
{
	this.Client?.Dispose();

	if (null != _funcHostProcess)
	{
		if (!_funcHostProcess.HasExited)
			_funcHostProcess.Kill();

		_funcHostProcess.Dispose();
	}
}</pre>

The next thing to do is to create our test class as usual. Now, it&#8217;s quite likely that we might want to split our tests into multiple classes. 

#### In this case, we have to make sure to not spin up more than one Functions Host. 

Luckily, XUnit comes to the rescue with _<a href="https://xunit.net/docs/shared-context#collection-fixture" target="_blank" rel="noreferrer noopener">Collection Fixtures</a>_. All we have to do is to create an empty class and mark it with the _CollectionDefinition_ attribute:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">[CollectionDefinition(nameof(AzureFunctionsTestsCollection ))]
public class AzureFunctionsTestsCollection : ICollectionFixture { }</pre>

Now we can decorate our test classes with all the necessary attributes and inject the _Fixture_:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">[Collection(nameof(AzureFunctionsTestsCollection))]
[Category("Contract")]
[Trait("Category", "Contract")]
public class TriggerWorkflowTests
{
	private readonly AzureFunctionsFixture _fixture;

	public TriggerWorkflowTests(AzureFunctionsFixture fixture)
	{
		_fixture = fixture;
	}

	[Fact]
	public async Task FooFunc_should_do_something_and_not_fail_miserably()
	{
		var response = await _fixture.Client.GetAsync("api/foo");
		response.IsSuccessStatusCode.Should().BeTrue();
	}
}</pre>

That&#8217;s all for today! <a href="https://www.davidguida.net/testing-azure-functions-on-azure-devops-part-2-the-pipeline/" target="_blank" rel="noreferrer noopener">Next time </a>we&#8217;ll push our Azure Functions to the repository and make sure the build pipeline runs fine. Ciao!

<div class="post-details-footer-widgets">
</div>