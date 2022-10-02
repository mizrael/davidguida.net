---
id: 6065
title: Store and retrieve a class containing interfaces with JSON.NET
date: 2015-09-20T10:20:11-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6065
permalink: /store-and-retrieve-a-class-containing-interfaces-with-json-net/
dsq_thread_id:
  - "5198247362"
image: /assets/uploads/2015/09/json_logo-555px__1_.png
categories:
  - .NET
  - Programming
---
Suppose you have code like this:

<div style="tab-size: 8" id="gist26506161" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-json-interface-serialization-1-cs" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-c  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-json-interface-serialization-1-cs-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-json-interface-serialization-1-cs-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-k">interface</span> <span class="pl-en">IMyInterface</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-serialization-1-cs-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-json-interface-serialization-1-cs-LC2" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-serialization-1-cs-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-json-interface-serialization-1-cs-LC3" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-c"><span class="pl-c">//</span> blah</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-serialization-1-cs-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-json-interface-serialization-1-cs-LC4" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-serialization-1-cs-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-json-interface-serialization-1-cs-LC5" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-serialization-1-cs-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-json-interface-serialization-1-cs-LC6" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-k">class</span> <span class="pl-en">MyClass</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-serialization-1-cs-L7" class="blob-num js-line-number" data-line-number="7">
                </td>
                
                <td id="file-json-interface-serialization-1-cs-LC7" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-serialization-1-cs-L8" class="blob-num js-line-number" data-line-number="8">
                </td>
                
                <td id="file-json-interface-serialization-1-cs-LC8" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-en">IEnumerable</span><<span class="pl-en">IMyInterface</span>> <span class="pl-smi">TheItems</span> { <span class="pl-k">get</span>; <span class="pl-k">set</span>; }
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-serialization-1-cs-L9" class="blob-num js-line-number" data-line-number="9">
                </td>
                
                <td id="file-json-interface-serialization-1-cs-LC9" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/ebf9f2447146804fd1b4/raw/c9ee32e98b5232bc1ea8a8e109c42fd91c25e23d/json-interface-serialization-1.cs" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/ebf9f2447146804fd1b4#file-json-interface-serialization-1-cs">json-interface-serialization-1.cs</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

and you want to serialize in JSON an instance of MyClass. If you are using <a href="http://www.newtonsoft.com/json" target="_blank">JSON.NET </a>it is most likely that you will get this error when you try to get the data back:

> Newtonsoft.Json.JsonSerializationException: Could not create an instance of type IMyInterface. Type is an interface or abstract class and cannot be instantiated.

Worry you not! The solution is at hand ! Or, at least, you have several options.

  1. Write a custom serializer and tell the library EXACTLY how you want your data to be written. Depending on your structure and the time at your disposal, this can be a long task.
  2. Ask the library to encode information about the types directly into the JSON. Yay!

<div style="tab-size: 8" id="gist26506185" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-json-interface-serialization-2-cs" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-c  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-json-interface-serialization-2-cs-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-json-interface-serialization-2-cs-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">myClassInstance</span> <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">MyClass</span>();
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-serialization-2-cs-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-json-interface-serialization-2-cs-LC2" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-serialization-2-cs-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-json-interface-serialization-2-cs-LC3" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-c"><span class="pl-c">//</span> blah</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-serialization-2-cs-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-json-interface-serialization-2-cs-LC4" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-serialization-2-cs-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-json-interface-serialization-2-cs-LC5" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">string</span> <span class="pl-smi">jsonData</span> <span class="pl-k">=</span> <span class="pl-smi">JsonConvert</span>.<span class="pl-en">SerializeObject</span>(<span class="pl-smi">myClassInstance</span>, <span class="pl-smi">Formatting</span>.<span class="pl-smi">Indented</span>, <span class="pl-k">new</span> <span class="pl-en">JsonSerializerSettings</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-serialization-2-cs-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-json-interface-serialization-2-cs-LC6" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-serialization-2-cs-L7" class="blob-num js-line-number" data-line-number="7">
                </td>
                
                <td id="file-json-interface-serialization-2-cs-LC7" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-smi">TypeNameHandling</span> <span class="pl-k">=</span> <span class="pl-smi">TypeNameHandling</span>.<span class="pl-smi">Objects</span>,
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-serialization-2-cs-L8" class="blob-num js-line-number" data-line-number="8">
                </td>
                
                <td id="file-json-interface-serialization-2-cs-LC8" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-smi">TypeNameAssemblyFormat</span> <span class="pl-k">=</span> <span class="pl-smi">System</span>.<span class="pl-smi">Runtime</span>.<span class="pl-smi">Serialization</span>.<span class="pl-smi">Formatters</span>.<span class="pl-smi">FormatterAssemblyStyle</span>.<span class="pl-smi">Simple</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-serialization-2-cs-L9" class="blob-num js-line-number" data-line-number="9">
                </td>
                
                <td id="file-json-interface-serialization-2-cs-LC9" class="blob-code blob-code-inner js-file-line">
                  });
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/2e3739834a375c091729/raw/fe59d32c809946a12e05d00db387a1c2e1caa597/json-interface-serialization-2.cs" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/2e3739834a375c091729#file-json-interface-serialization-2-cs">json-interface-serialization-2.cs</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

the generated json data will contain all the info required to correctly de-serialize the data back. Of course this means that the string will be a little bit longer, so be advised (for more details take a look at the <a href="http://www.newtonsoft.com/json/help/html/SerializeTypeNameHandling.htm" target="_blank">docs here</a> ) ,

To get your instance back you have to tell the library that you have encoded type infos:

<div style="tab-size: 8" id="gist26506242" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-json-interface-deserialization-1-cs" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-c  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-json-interface-deserialization-1-cs-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-json-interface-deserialization-1-cs-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">myClassInstaceDeserialized</span> <span class="pl-k">=</span> <span class="pl-smi">JsonConvert</span>.<span class="pl-en">DeserializeObject</span><<span class="pl-en">MyClass</span>>(<span class="pl-smi">jsonData</span>, <span class="pl-k">new</span> <span class="pl-en">JsonSerializerSettings</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-deserialization-1-cs-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-json-interface-deserialization-1-cs-LC2" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-deserialization-1-cs-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-json-interface-deserialization-1-cs-LC3" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-smi">TypeNameHandling</span> <span class="pl-k">=</span> <span class="pl-smi">TypeNameHandling</span>.<span class="pl-smi">Objects</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-json-interface-deserialization-1-cs-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-json-interface-deserialization-1-cs-LC4" class="blob-code blob-code-inner js-file-line">
                  });
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/d50b5e999279b3ec60da/raw/d0159253bb3e43a3a23351f1323d2801ce951d21/json-interface-deserialization-1.cs" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/d50b5e999279b3ec60da#file-json-interface-deserialization-1-cs">json-interface-deserialization-1.cs</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

cheers 😀

<div class="post-details-footer-widgets">
</div>