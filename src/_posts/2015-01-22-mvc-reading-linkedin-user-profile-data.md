---
id: 608
title: 'MVC: reading LinkedIn user profile data'
date: 2015-01-22T19:44:02-05:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=608
permalink: /mvc-reading-linkedin-user-profile-data/
videourl:
  - ""
dsq_thread_id:
  - "5139530568"
image: /assets/uploads/2014/08/computerprogramming_8406403-655x280.jpg
categories:
  - .NET
  - ASP.NET
  - MVC
  - Programming
---
Suppose you have to login your users using an external provider. Maybe LinkedIn. Suppose you have to read the user profile data and do some stuff. Maybe you have to register the guy on your website.  
Maybe you know a bit of OAuth and you want to give it a try but maybe you don't want to bother writing a library from scratch.

What do you do? Search on NuGet of course! I have found a nice library that helps with this, named <a title="Sparkle.LinkedInNET" href="https://github.com/SparkleNetworks/LinkedInNET" target="_blank">Sparkle.LinkedInNET</a> 🙂

Here's a quick'N'dirty gist showing the bare minimum necessary to get the oauth token and reading  the profile data. Then use it wisely!

As you may imagine, the flow begins with the Profile action ( something like "http://mydomain/linkedin/profile" ). The user will be redirected to LinkedIn and from there back to your website, this time with a token that you can use to interact with the LinkedIn APIs.

Here's the full code, enjoy 🙂

<div style="tab-size: 8" id="gist18619379" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-linkedincontroller-cs" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-c  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-linkedincontroller-cs-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-linkedincontroller-cs-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-k">class</span> <span class="pl-en">LinkedInController</span> : <span class="pl-en">Controller</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-linkedincontroller-cs-LC2" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-linkedincontroller-cs-LC3" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-en">RedirectResult</span> <span class="pl-en">Profile</span>()
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-linkedincontroller-cs-LC4" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-linkedincontroller-cs-LC5" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">redirectUrl</span> <span class="pl-k">=</span> <span class="pl-s"><span class="pl-pds">"</span>http://mydomain/linkedin/profilereturn/<span class="pl-pds">"</span></span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-linkedincontroller-cs-LC6" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">url</span> <span class="pl-k">=</span> <span class="pl-en">GetAuthorizationUrl</span>(<span class="pl-smi">redirectUrl</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L7" class="blob-num js-line-number" data-line-number="7">
                </td>
                
                <td id="file-linkedincontroller-cs-LC7" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">return</span> <span class="pl-en">Redirect</span>(<span class="pl-smi">url</span>.<span class="pl-en">ToString</span>());
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L8" class="blob-num js-line-number" data-line-number="8">
                </td>
                
                <td id="file-linkedincontroller-cs-LC8" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L9" class="blob-num js-line-number" data-line-number="9">
                </td>
                
                <td id="file-linkedincontroller-cs-LC9" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L10" class="blob-num js-line-number" data-line-number="10">
                </td>
                
                <td id="file-linkedincontroller-cs-LC10" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">public</span> <span class="pl-en">ActionResult</span> <span class="pl-en">ProfileReturn</span>(<span class="pl-k">string</span> <span class="pl-smi">code</span>, <span class="pl-k">string</span> <span class="pl-smi">state</span>)
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L11" class="blob-num js-line-number" data-line-number="11">
                </td>
                
                <td id="file-linkedincontroller-cs-LC11" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L12" class="blob-num js-line-number" data-line-number="12">
                </td>
                
                <td id="file-linkedincontroller-cs-LC12" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">redirectUrl</span> <span class="pl-k">=</span> <span class="pl-s"><span class="pl-pds">"</span>http://mydomain/linkedin/profilereturn/<span class="pl-pds">"</span></span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L13" class="blob-num js-line-number" data-line-number="13">
                </td>
                
                <td id="file-linkedincontroller-cs-LC13" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">profile</span> <span class="pl-k">=</span> <span class="pl-en">ReadMyProfile</span>(<span class="pl-smi">code</span>, <span class="pl-smi">redirectUrl</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L14" class="blob-num js-line-number" data-line-number="14">
                </td>
                
                <td id="file-linkedincontroller-cs-LC14" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L15" class="blob-num js-line-number" data-line-number="15">
                </td>
                
                <td id="file-linkedincontroller-cs-LC15" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">jsonProfile</span> <span class="pl-k">=</span> <span class="pl-smi">Newtonsoft</span>.<span class="pl-smi">Json</span>.<span class="pl-smi">JsonConvert</span>.<span class="pl-en">SerializeObject</span>(<span class="pl-smi">profile</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L16" class="blob-num js-line-number" data-line-number="16">
                </td>
                
                <td id="file-linkedincontroller-cs-LC16" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">return</span> <span class="pl-en">Content</span>(<span class="pl-smi">jsonProfile</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L17" class="blob-num js-line-number" data-line-number="17">
                </td>
                
                <td id="file-linkedincontroller-cs-LC17" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L18" class="blob-num js-line-number" data-line-number="18">
                </td>
                
                <td id="file-linkedincontroller-cs-LC18" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L19" class="blob-num js-line-number" data-line-number="19">
                </td>
                
                <td id="file-linkedincontroller-cs-LC19" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">private</span> <span class="pl-k">static</span> <span class="pl-en">Uri</span> <span class="pl-en">GetAuthorizationUrl</span>(<span class="pl-k">string</span> <span class="pl-smi">redirectUrl</span>)
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L20" class="blob-num js-line-number" data-line-number="20">
                </td>
                
                <td id="file-linkedincontroller-cs-LC20" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L21" class="blob-num js-line-number" data-line-number="21">
                </td>
                
                <td id="file-linkedincontroller-cs-LC21" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">api</span> <span class="pl-k">=</span> <span class="pl-en">CreateAPI</span>();
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L22" class="blob-num js-line-number" data-line-number="22">
                </td>
                
                <td id="file-linkedincontroller-cs-LC22" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L23" class="blob-num js-line-number" data-line-number="23">
                </td>
                
                <td id="file-linkedincontroller-cs-LC23" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">scope</span> <span class="pl-k">=</span> <span class="pl-smi">Sparkle</span>.<span class="pl-smi">LinkedInNET</span>.<span class="pl-smi">OAuth2</span>.<span class="pl-smi">AuthorizationScope</span>.<span class="pl-smi">ReadBasicProfile</span> <span class="pl-k">|</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L24" class="blob-num js-line-number" data-line-number="24">
                </td>
                
                <td id="file-linkedincontroller-cs-LC24" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-smi">Sparkle</span>.<span class="pl-smi">LinkedInNET</span>.<span class="pl-smi">OAuth2</span>.<span class="pl-smi">AuthorizationScope</span>.<span class="pl-smi">ReadEmailAddress</span> <span class="pl-k">|</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L25" class="blob-num js-line-number" data-line-number="25">
                </td>
                
                <td id="file-linkedincontroller-cs-LC25" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-smi">Sparkle</span>.<span class="pl-smi">LinkedInNET</span>.<span class="pl-smi">OAuth2</span>.<span class="pl-smi">AuthorizationScope</span>.<span class="pl-smi">ReadContactInfo</span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L26" class="blob-num js-line-number" data-line-number="26">
                </td>
                
                <td id="file-linkedincontroller-cs-LC26" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L27" class="blob-num js-line-number" data-line-number="27">
                </td>
                
                <td id="file-linkedincontroller-cs-LC27" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">state</span> <span class="pl-k">=</span> <span class="pl-smi">Guid</span>.<span class="pl-en">NewGuid</span>().<span class="pl-en">ToString</span>();
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L28" class="blob-num js-line-number" data-line-number="28">
                </td>
                
                <td id="file-linkedincontroller-cs-LC28" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L29" class="blob-num js-line-number" data-line-number="29">
                </td>
                
                <td id="file-linkedincontroller-cs-LC29" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">url</span> <span class="pl-k">=</span> <span class="pl-smi">api</span>.<span class="pl-smi">OAuth2</span>.<span class="pl-en">GetAuthorizationUrl</span>(<span class="pl-smi">scope</span>, <span class="pl-smi">state</span>, <span class="pl-smi">redirectUrl</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L30" class="blob-num js-line-number" data-line-number="30">
                </td>
                
                <td id="file-linkedincontroller-cs-LC30" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">return</span> <span class="pl-smi">url</span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L31" class="blob-num js-line-number" data-line-number="31">
                </td>
                
                <td id="file-linkedincontroller-cs-LC31" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L32" class="blob-num js-line-number" data-line-number="32">
                </td>
                
                <td id="file-linkedincontroller-cs-LC32" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L33" class="blob-num js-line-number" data-line-number="33">
                </td>
                
                <td id="file-linkedincontroller-cs-LC33" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">private</span> <span class="pl-k">static</span> <span class="pl-en">Person</span> <span class="pl-en">ReadMyProfile</span>(<span class="pl-k">string</span> <span class="pl-smi">code</span>, <span class="pl-k">string</span> <span class="pl-smi">redirectUrl</span>)
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L34" class="blob-num js-line-number" data-line-number="34">
                </td>
                
                <td id="file-linkedincontroller-cs-LC34" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L35" class="blob-num js-line-number" data-line-number="35">
                </td>
                
                <td id="file-linkedincontroller-cs-LC35" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">api</span> <span class="pl-k">=</span> <span class="pl-en">CreateAPI</span>();
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L36" class="blob-num js-line-number" data-line-number="36">
                </td>
                
                <td id="file-linkedincontroller-cs-LC36" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L37" class="blob-num js-line-number" data-line-number="37">
                </td>
                
                <td id="file-linkedincontroller-cs-LC37" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">userToken</span> <span class="pl-k">=</span> <span class="pl-smi">api</span>.<span class="pl-smi">OAuth2</span>.<span class="pl-en">GetAccessToken</span>(<span class="pl-smi">code</span>, <span class="pl-smi">redirectUrl</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L38" class="blob-num js-line-number" data-line-number="38">
                </td>
                
                <td id="file-linkedincontroller-cs-LC38" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L39" class="blob-num js-line-number" data-line-number="39">
                </td>
                
                <td id="file-linkedincontroller-cs-LC39" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">user</span> <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-k">Sparkle</span>.<span class="pl-k">LinkedInNET</span>.<span class="pl-en">UserAuthorization</span>(<span class="pl-smi">userToken</span>.<span class="pl-smi">AccessToken</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L40" class="blob-num js-line-number" data-line-number="40">
                </td>
                
                <td id="file-linkedincontroller-cs-LC40" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L41" class="blob-num js-line-number" data-line-number="41">
                </td>
                
                <td id="file-linkedincontroller-cs-LC41" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">fieldSelector</span> <span class="pl-k">=</span> <span class="pl-smi">FieldSelector</span>.<span class="pl-en">For</span><<span class="pl-en">Person</span>>().<span class="pl-en">WithFirstName</span>()
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L42" class="blob-num js-line-number" data-line-number="42">
                </td>
                
                <td id="file-linkedincontroller-cs-LC42" class="blob-code blob-code-inner js-file-line">
                  .<span class="pl-en">WithLastName</span>()
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L43" class="blob-num js-line-number" data-line-number="43">
                </td>
                
                <td id="file-linkedincontroller-cs-LC43" class="blob-code blob-code-inner js-file-line">
                  .<span class="pl-en">WithEmailAddress</span>();
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L44" class="blob-num js-line-number" data-line-number="44">
                </td>
                
                <td id="file-linkedincontroller-cs-LC44" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L45" class="blob-num js-line-number" data-line-number="45">
                </td>
                
                <td id="file-linkedincontroller-cs-LC45" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">profile</span> <span class="pl-k">=</span> <span class="pl-smi">api</span>.<span class="pl-smi">Profiles</span>.<span class="pl-en">GetMyProfile</span>(<span class="pl-smi">user</span>, <span class="pl-c1">null</span>, <span class="pl-smi">fieldSelector</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L46" class="blob-num js-line-number" data-line-number="46">
                </td>
                
                <td id="file-linkedincontroller-cs-LC46" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L47" class="blob-num js-line-number" data-line-number="47">
                </td>
                
                <td id="file-linkedincontroller-cs-LC47" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">return</span> <span class="pl-smi">profile</span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L48" class="blob-num js-line-number" data-line-number="48">
                </td>
                
                <td id="file-linkedincontroller-cs-LC48" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L49" class="blob-num js-line-number" data-line-number="49">
                </td>
                
                <td id="file-linkedincontroller-cs-LC49" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L50" class="blob-num js-line-number" data-line-number="50">
                </td>
                
                <td id="file-linkedincontroller-cs-LC50" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">private</span> <span class="pl-k">static</span> <span class="pl-en">LinkedInApi</span> <span class="pl-en">CreateAPI</span>()
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L51" class="blob-num js-line-number" data-line-number="51">
                </td>
                
                <td id="file-linkedincontroller-cs-LC51" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L52" class="blob-num js-line-number" data-line-number="52">
                </td>
                
                <td id="file-linkedincontroller-cs-LC52" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">config</span> <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">LinkedInApiConfiguration</span>(<span class="pl-smi">ConfigurationManager</span>.<span class="pl-smi">AppSettings</span>[<span class="pl-s"><span class="pl-pds">"</span>LinkedIn_AppID<span class="pl-pds">"</span></span>],
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L53" class="blob-num js-line-number" data-line-number="53">
                </td>
                
                <td id="file-linkedincontroller-cs-LC53" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-smi">ConfigurationManager</span>.<span class="pl-smi">AppSettings</span>[<span class="pl-s"><span class="pl-pds">"</span>LinkedIn_AppSecret<span class="pl-pds">"</span></span>]);
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L54" class="blob-num js-line-number" data-line-number="54">
                </td>
                
                <td id="file-linkedincontroller-cs-LC54" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">var</span> <span class="pl-smi">api</span> <span class="pl-k">=</span> <span class="pl-k">new</span> <span class="pl-en">LinkedInApi</span>(<span class="pl-smi">config</span>);
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L55" class="blob-num js-line-number" data-line-number="55">
                </td>
                
                <td id="file-linkedincontroller-cs-LC55" class="blob-code blob-code-inner js-file-line">
                  <span class="pl-k">return</span> <span class="pl-smi">api</span>;
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L56" class="blob-num js-line-number" data-line-number="56">
                </td>
                
                <td id="file-linkedincontroller-cs-LC56" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
              
              <tr>
                <td id="file-linkedincontroller-cs-L57" class="blob-num js-line-number" data-line-number="57">
                </td>
                
                <td id="file-linkedincontroller-cs-LC57" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/74b4962ecf2a90d5cd36/raw/802c5b14608d3c5bd1b8e2095c848ed16746cef4/LinkedInController.cs" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/74b4962ecf2a90d5cd36#file-linkedincontroller-cs">LinkedInController.cs</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

<div class="post-details-footer-widgets">
</div>