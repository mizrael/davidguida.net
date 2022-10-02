---
id: 6017
title: DynamicConfig updates
date: 2015-06-06T00:26:15-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6017
permalink: /dynamicconfig-updates/
videourl:
  - ""
image: /assets/uploads/2015/06/DynamicConfig_Git.png
categories:
  - .NET
  - Git
  - NuGet
  - Programming
---
Today I spent some time working on <a href="https://github.com/mizrael/DynamicConfig" target="_blank">DynamicConfig</a> , I had some minor/major refactorings in mind and also a couple of features I wanted to add.

Probably the most important update is the possibility now to save the configurations to file, operation performed directly by the library when a property changes. At the moment this feature is available only when a configuration was previously loaded from file, but I plan to extend this.

In a nutshell, all you have to do is load a configuration from file:

<div style="tab-size: 8" id="gist23117218" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-dynamicconfig_loading" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-text  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-dynamicconfig_loading-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-dynamicconfig_loading-LC1" class="blob-code blob-code-inner js-file-line">
                  var filename = "config.json";
                </td>
              </tr>
              
              <tr>
                <td id="file-dynamicconfig_loading-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-dynamicconfig_loading-LC2" class="blob-code blob-code-inner js-file-line">
                  var providerName = "json";
                </td>
              </tr>
              
              <tr>
                <td id="file-dynamicconfig_loading-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-dynamicconfig_loading-LC3" class="blob-code blob-code-inner js-file-line">
                  var configName = "myConfig";
                </td>
              </tr>
              
              <tr>
                <td id="file-dynamicconfig_loading-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-dynamicconfig_loading-LC4" class="blob-code blob-code-inner js-file-line">
                  dynamic config = Config.Load(providerName, configName, filename);
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/ea46621dbd7090919c6e/raw/a27835d46f73165daae4cf184bd469483d86ef70/DynamicConfig_loading" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/ea46621dbd7090919c6e#file-dynamicconfig_loading">DynamicConfig_loading</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

and then just update a property, the library will do the rest 🙂

Internally what is happening is that the configuration class ( <a href="http://www.codeproject.com/Articles/88278/Observer-in-NET-with-IObserver-T" target="_blank">ConfigObject</a> ) now implements the <a href="https://msdn.microsoft.com/en-us/library/vstudio/dd990377%28v=vs.100%29.aspx" target="_blank">IObservable<></a> interface,  so whenever a change occurs the registered observers will get a notification. The <a href="https://github.com/mizrael/DynamicConfig/blob/master/DynamicConfig/Providers/JsonConfigProvider.cs" target="_blank">JsonConfigProvider</a> instead implements <a href="https://msdn.microsoft.com/en-us/librAry/dd783449(v=vs.100).aspx" target="_blank">IObserver<></a> and subscribes to the events during file loading.

A quick description to the Observer pattern can be found on CodeProject <a href="http://www.codeproject.com/Articles/88278/Observer-in-NET-with-IObserver-T" target="_blank">here</a> ( although the pattern is very well know and I am sure doesn&#8217;t require introduction ). The idea is to maintain a list of objects that will be notified by the observer each time a specific event occurs on the observed class  itself.

On the ConfigObject class I also added a Parent property so that each message will be sent also to its subscribers.

Now I just have to add a couple of error checks and push the build to NuGet 🙂

<div class="post-details-footer-widgets">
</div>