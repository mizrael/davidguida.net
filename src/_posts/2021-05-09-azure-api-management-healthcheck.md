---
description: >
  Let's see how we can write an Azure Function App healthcheck to detect if an Azure API Management instance is alive
id: 8009
title: 'Azure API Management Healthcheck via Azure Functions'
date: 2021-05-09T10:00:07-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8009
permalink: /azure-api-management-healthcheck/
image: /assets/uploads/2021/05/azure-api-management-healthcheck.jpg
tags:
  - .NET Core
  - ASP.NET Core
  - Azure
  - API
  - Reliability
  - Microservices
  - Healthchecks
---
Hi All! Today we'll see how it's possible to programmatically check if an Azure API Management instance is alive (an'kickin).

### TR;DR;
#### A simple GET request to `https://[APIM-url-here]/status-0123456789abcdef`  will do the trick.

---

### Slightly longer version
In a world of <a href="/opensleigh-a-saga-management-library-for-net-core/" target="_blank">distributed transactions</a>, microservices, <a href="/improving-http-resilience-in-blazor-webassembly/" target="_blank">reliability</a>, and automation, it's extremely important to keep under control all the "moving parts" of our applications. Health monitoring and proper instrumentation play a vital role in achieving the success of a system in production.

On some occasions, your microservices might not depend "just" on the Database, but also rely on other internal services or third-party APIs. Luckily for us, .NET has nice support for different types of healthchecks, so we don't have to reinvent the wheel each time.

### But what happens when we have a dependency on something different?
Here's a real story. A friend of a cousin of an uncle of mine (yeah...) was working on an Azure Function App that had a dependency on an internal service handled by a different team. For some super-complex reasons, this team was not allowed to expose their service directly, but had to go through <a href="https://docs.microsoft.com/en-us/azure/api-management/?WT.mc_id=DOP-MVP-5003878" target="_blank">**Azure API Management**</a> instead.

Now, we can of course expose a GET endpoint with a policy that probes the underlying service. But this very distant friend got curious: how can we assert if the actual APIM is alive?

Well, turns out that APIM exposes a default healthcheck endpoint. All you have to do is a GET request to `/status-0123456789abcdef` and if everything is ok, you'll receive a 200 status back with an empty body. That's it!

Let's see how we can do this via code.
The first thing is to install the Nuget package `Microsoft.Extensions.Diagnostics.HealthChecks`.

Then we have to create a custom class to run the healthcheck :

```csharp
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace MyFunctionApp
{
    public class ApimHealthCheck : IHealthCheck
    {
        private readonly HttpClient _httpClient;

        public ApimHealthCheck(IHttpClientFactory httpClientFactory)
        {
            if (httpClientFactory is null)            
                throw new ArgumentNullException(nameof(httpClientFactory));            

            _httpClient = httpClientFactory.CreateClient("APIM");
        }

        public async Task<HealthCheckResult> CheckHealthAsync(
            HealthCheckContext context,
            CancellationToken cancellationToken = default)
        {
            var response = await _httpClient.GetAsync("/status-0123456789abcdef");
            return (response.StatusCode == System.Net.HttpStatusCode.OK) ?
                HealthCheckResult.Healthy() :
                HealthCheckResult.Unhealthy();
        }
    }
}
```
At this point we can register it in our `Startup.cs` :

```csharp
[assembly: FunctionsStartup(typeof(Startup))]
namespace MyFunctionApp
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
		{
			Services.AddHttpClient(); 
			
			Services.AddHttpClient("APIM", client =>
            {
                client.BaseAddress = new Uri(Environment.GetEnvironmentVariable("APIM_URL"));
            });
			
			Services.AddHealthChecks()
			        .AddCheck<ApimHealthCheck>("APIM");
		}
	}
}
```
Let's see what's happening here.
First of all, we're ensuring that `IHttpClientFactory` is available on our IoC Container. 
Then we're registering a <a href="https://docs.microsoft.com/en-us/aspnet/core/fundamentals/http-requests?view=aspnetcore-5.0&WT.mc_id=DOP-MVP-5003878#named-clients" target="_blank">named client</a> and configuring it with the APIM url. We can also include additional headers, like a Subscription key to handle authentication/authorization, for example.

And then, with the call to `AddHealthChecks()` we can start registering healthchecks for all our dependencies, including our custom `ApimHealthCheck`.

Now, since we're writing a Function App, we also have to create a Function to run the checks:

```csharp
public class HealthFunctions
{
    private readonly HealthCheckService _healthService;

    public HealthFunctions(HealthCheckService healthService)
    {
        _healthService = healthService ?? throw new System.ArgumentNullException(nameof(healthService));
    }

    [FunctionName(nameof(Healthcheck))]
    public async Task<IActionResult> Healthcheck(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "health")]
        HttpRequest req)
    {
        var healthResult = await _healthService.CheckHealthAsync();
        var status = (healthResult.Status == HealthStatus.Healthy) ? 200 : 500;

        return new JsonResult(new
        {
            status = healthResult.Status.ToString(),
            entries = healthResult.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString(),
                e.Value.Description,
                e.Value.Exception
            })
        })
        {
            StatusCode = status
        };
    }
}
```

When invoked, this will return a 200 or a 500 status with this payload:

```json
{"status":"Healthy","entries":[{"name":"APIM","status":"Healthy","description":null,"exception":null}]}
```

Ciao!