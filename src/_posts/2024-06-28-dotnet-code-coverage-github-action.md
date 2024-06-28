---
description: > 
  How can we generate Code Coverage for an entire .NET Solution? This article walks you through the steps and shows how to integrate them in a GitHub Actions workflow.
id: 8040
title: 'How to generate Code Coverage for a .NET Solution'
date: 2024-06-25T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8040
permalink: /dotnet-code-coverage-github-action
image: /assets/uploads/2024/06/dotnet-code-coverage-github-action.jpg
categories:  
  - .NET
  - GitHub
  - Code Coverage
  - Testing
---

I am a strenuous believer that a good code coverage is crucial for a project's success. That of course doesn't really apply to short lived applications, like prototypes or small apps that would be thrown away after a few days/weeks. But if you plan on keeping your creation alive for some time, and potentially doing maintenance and/or adding new features, having automated tests is definitely necessary.

Testing 100% of the codebase is in most cases impossible, and, to be honest, probably not that useful that much. I mean, testing values of properties on DTOs after setting tham doesn't provide much value.
Things are different when those properties are calculated based on a formula. When there's some logic behind, then it's a good time to write a test.

But how do we keep track of how good our coverage is? Lukily for us, in .NET we have a quite nifty tool called [Coverlet](https://github.com/coverlet-coverage/coverlet). Basic usage is pretty straightforward: the first thing to do is to add the necessary references to your test projects:

```xml
<ItemGroup>

    <PackageReference Include="coverlet.msbuild" Version="6.0.2">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>   

    <PackageReference Include="coverlet.collector" Version="6.0.0">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
  </ItemGroup>
```

Once you have that in place, all you need to do is to run the tests and ask for coverage generation:
```
dotnet test /p:CollectCoverage=true
```

The list of possible parameters is pretty long, and it's possible to configure literally any aspect of it.

### One nice thing though, is that you can generate the coverage during your build pipeline and then run any type of analysis you want on that.

For example, if you're using GitHub Actions, you can do something like this:

```yaml
name: .NET

on:
  push:
  
jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4
    - name: Setup .NET
      uses: actions/setup-dotnet@v4
      with:
        dotnet-version: 8.0.x
    - name: Restore dependencies
      run: |
        dotnet restore
    - name: Build
      run: |
        dotnet build --no-restore
    - name: Test
      run: |
        dotnet test --no-build -m:1 \
          /p:CollectCoverage=true \
          /p:CoverletOutput=../TestResults/ \
          /p:MergeWith="../TestResults/coverage.json" 
```          

We start with the usual process: we checkout the repo, setup .NET on the agent, restore the dependencies and build the solution.

At this point we can run `dotnet test` and skip the build, but we also instruct it to generate the coverage. 

### The interesting point here is that if you're doing this on _an entire Solution_, by specifying the `MergeWith` argument, all the results from each individual project are merged into one file and then saved into the `TestResults` folder.

We also pass `-m:1`, which will ensure that the tests projects are processed sequentially. This would avoid any type of _contamination_ that might occurr with parallel executions.

Now, let's say that you want to add a nice badge on your readme file, showing the coverage results. We have to update a bit the `Test` step and add an additional one:

```yaml
- name: Test
  run: |
    dotnet test --no-build -m:1 \
      /p:CollectCoverage=true \
      /p:CoverletOutput=../TestResults/ \
      /p:MergeWith="../TestResults/coverage.json" \
      /p:CoverletOutputFormat=\"opencover,json\"

- name: Create Test Coverage Badge
  uses: simon-k/dotnet-code-coverage-badge@v1.0.0
  id: create_coverage_badge
  with:
    label: Unit Test Coverage
    color: brightgreen
    path: ./tests/TestResults/coverage.opencover.xml
    gist-filename: [the file name from the gist]
    gist-id: [the gist id]
    gist-auth-token: ${{ secrets.GIST_AUTH_TOKEN }}
```        

We're specifying the output format and instructing the CLI to generate both `json` and `opencover`. We need `json` for the intermediate results, so that `MergeWith` would keep working. `opencover` instead will be used by `dotnet-code-coverage-badge`.

Now, there's a couple of things to do:
1. we need to create a new gist, with just one empty .json file in it, and copy the id
1. we need to create a new _Fine-Grained token_ with read and write access to gists. You can do it from [https://github.com/settings/tokens](https://github.com/settings/tokens).
1. register the token as secret in your repository and update the workflow code.

#### Bonus point
Some of you might have noticed that the coverage has been generated also for the _actual test projects_. But that's not exactly what we want. So how do we exclude them?

The solution is pretty simple: add a `.runsettings` file and pass it to `dotnet test`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<RunSettings>
  <!-- Configurations that affect the Test Framework -->
  <RunConfiguration>
    <MaxCpuCount>1</MaxCpuCount>
    <!-- Path relative to directory that contains .runsettings file-->
    <ResultsDirectory>.\TestResults</ResultsDirectory>
    
    <!-- true or false -->
    <!-- Value that specifies the exit code when no tests are discovered -->
    <TreatNoTestsAsError>true</TreatNoTestsAsError>
  </RunConfiguration>
  <DataCollectionRunSettings>
    <DataCollectors>
      <DataCollector friendlyName="Code Coverage" uri="datacollector://Microsoft/CodeCoverage/2.0" assemblyQualifiedName="Microsoft.VisualStudio.Coverage.DynamicCoverageDataCollector, Microsoft.VisualStudio.TraceCollector, Version=11.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a">
        <Configuration>
          <CodeCoverage>
            <ModulePaths>
                <Include>
                    <ModulePath>[your assembly name].*.dll</ModulePath>
                </Include>
                <Exclude>
                    <ModulePath>.*Tests.dll</ModulePath>
                </Exclude>
            </ModulePaths>
          </CodeCoverage>
        </Configuration>
      </DataCollector>
    </DataCollectors>
  </DataCollectionRunSettings>
</RunSettings>
```

The core lies in that `ModulePaths` node: we can specify which projects we want to _include_ in the coverage generation, and which ones we really don't want. Now all we have to do is update our workflow and pass this settings file using `-s`:

```yaml
- name: Test
      run: |
        cd ./src
        dotnet test --no-build -m:1 -s ../tests/tests.runsettings \
          /p:CollectCoverage=true \
          /p:CoverletOutput=../TestResults/ \
          /p:MergeWith="../TestResults/coverage.json" \
          /p:CoverletOutputFormat=\"opencover,json\"
```          

### If you want to see all of this in action, I'm using this method on my small DB engine, [Evenire](https://github.com/mizrael/EvenireDB).

Enjoy!