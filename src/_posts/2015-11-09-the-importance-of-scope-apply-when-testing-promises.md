---
id: 6083
title: the importance of scope.apply() when testing promises
date: 2015-11-09T22:34:17-05:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6083
permalink: /the-importance-of-scope-apply-when-testing-promises/
dsq_thread_id:
  - "5140949506"
image: /assets/uploads/2014/09/angularjs.png
categories:
  - AngularJS
  - Javascript
  - Programming
---
"remember kids, Jasmine likes to apply"

&#8230;sorry, what?

Well, basically, it's simple: when writing unit tests on promises with <a href="http://jasmine.github.io/" target="_blank">Jasmine</a>, remember to call <a href="https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$apply" target="_blank">$scope.apply()</a>, it will save you some headaches!

take a look at this AngularJs controller. Look at it.

<div style="tab-size: 8" id="gist27867970" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-controller-promise-js" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-javascript  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-controller-promise-js-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-controller-promise-js-LC1" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>var</span> <span class=pl-s1>myApp</span> <span class=pl-c1>=</span> <span class=pl-s1>angular</span><span class=pl-kos>.</span><span class=pl-en>module</span><span class=pl-kos>(</span><span class=pl-s>'myApp'</span><span class=pl-kos>,</span><span class=pl-kos>[</span><span class=pl-kos>]</span><span class=pl-kos>)</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-controller-promise-js-LC2" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-controller-promise-js-LC3" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-s1>myApp</span><span class=pl-kos>.</span><span class=pl-en>controller</span><span class=pl-kos>(</span><span class=pl-s>'FooController'</span><span class=pl-kos>,</span> <span class=pl-kos>[</span><span class=pl-s>'$scope'</span><span class=pl-kos>,</span> <span class=pl-s>'fooService'</span><span class=pl-kos>,</span> <span class=pl-k>function</span><span class=pl-kos>(</span><span class=pl-s1>$scope</span><span class=pl-kos>,</span> <span class=pl-s1>fooService</span><span class=pl-kos>)</span> <span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-controller-promise-js-LC4" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-k>var</span> <span class=pl-s1>instance</span> <span class=pl-c1>=</span> <span class=pl-smi>this</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-controller-promise-js-LC5" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-controller-promise-js-LC6" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-s1>$scope</span><span class=pl-kos>.</span><span class=pl-c1>loadingStatus</span> <span class=pl-c1>=</span> <span class=pl-s>'none'</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L7" class="blob-num js-line-number" data-line-number="7">
                </td>
                
                <td id="file-controller-promise-js-LC7" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L8" class="blob-num js-line-number" data-line-number="8">
                </td>
                
                <td id="file-controller-promise-js-LC8" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-s1>instance</span><span class=pl-kos>.</span><span class=pl-en>onBarCompleted</span> <span class=pl-c1>=</span> <span class=pl-k>function</span><span class=pl-kos>(</span><span class=pl-kos>)</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L9" class="blob-num js-line-number" data-line-number="9">
                </td>
                
                <td id="file-controller-promise-js-LC9" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-s1>$scope</span><span class=pl-kos>.</span><span class=pl-c1>loadingStatus</span> <span class=pl-c1>=</span> <span class=pl-s>'completed'</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L10" class="blob-num js-line-number" data-line-number="10">
                </td>
                
                <td id="file-controller-promise-js-LC10" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L11" class="blob-num js-line-number" data-line-number="11">
                </td>
                
                <td id="file-controller-promise-js-LC11" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-s1>instance</span><span class=pl-kos>.</span><span class=pl-en>onBarError</span> <span class=pl-c1>=</span> <span class=pl-k>function</span><span class=pl-kos>(</span><span class=pl-kos>)</span><span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L12" class="blob-num js-line-number" data-line-number="12">
                </td>
                
                <td id="file-controller-promise-js-LC12" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-s1>$scope</span><span class=pl-kos>.</span><span class=pl-c1>loadingStatus</span> <span class=pl-c1>=</span> <span class=pl-s>'error'</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L13" class="blob-num js-line-number" data-line-number="13">
                </td>
                
                <td id="file-controller-promise-js-LC13" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L14" class="blob-num js-line-number" data-line-number="14">
                </td>
                
                <td id="file-controller-promise-js-LC14" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L15" class="blob-num js-line-number" data-line-number="15">
                </td>
                
                <td id="file-controller-promise-js-LC15" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-s1>$scope</span><span class=pl-kos>.</span><span class=pl-en>callBar</span> <span class=pl-c1>=</span> <span class=pl-k>function</span><span class=pl-kos>(</span><span class=pl-kos>)</span> <span class=pl-kos>{</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L16" class="blob-num js-line-number" data-line-number="16">
                </td>
                
                <td id="file-controller-promise-js-LC16" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-s1>$scope</span><span class=pl-kos>.</span><span class=pl-c1>loadingStatus</span> <span class=pl-c1>=</span> <span class=pl-s>'loading&#8230;'</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L17" class="blob-num js-line-number" data-line-number="17">
                </td>
                
                <td id="file-controller-promise-js-LC17" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L18" class="blob-num js-line-number" data-line-number="18">
                </td>
                
                <td id="file-controller-promise-js-LC18" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-s1>fooService</span><span class=pl-kos>.</span><span class=pl-en>bar</span><span class=pl-kos>(</span><span class=pl-kos>)</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L19" class="blob-num js-line-number" data-line-number="19">
                </td>
                
                <td id="file-controller-promise-js-LC19" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>.</span><span class=pl-en>then</span><span class=pl-kos>(</span><span class=pl-s1>instance</span><span class=pl-kos>.</span><span class=pl-c1>onBarCompleted</span><span class=pl-kos>)</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L20" class="blob-num js-line-number" data-line-number="20">
                </td>
                
                <td id="file-controller-promise-js-LC20" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>.</span><span class=pl-en>catch</span><span class=pl-kos>(</span><span class=pl-s1>instance</span><span class=pl-kos>.</span><span class=pl-c1>onBarError</span><span class=pl-kos>)</span><span class=pl-kos>;</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L21" class="blob-num js-line-number" data-line-number="21">
                </td>
                
                <td id="file-controller-promise-js-LC21" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span>
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promise-js-L22" class="blob-num js-line-number" data-line-number="22">
                </td>
                
                <td id="file-controller-promise-js-LC22" class="blob-code blob-code-inner js-file-line">
                  <span class=pl-kos>}</span><span class=pl-kos>]</span><span class=pl-kos>)</span><span class=pl-kos>;</span>
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/b5cb8a35ce4d27004183/raw/f22720fcc561a2a6c0d4b01d81ab7c7b9254c131/controller-promise.js" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/b5cb8a35ce4d27004183#file-controller-promise-js">controller-promise.js</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

as you can see, on line 18 there's a call to fooService.bar() and two callbacks are used to handle the success and error cases.

Here instead, there's an example of how you could test the error case:

<div style="tab-size: 8" id="gist27868213" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-controller-promises-unit-test-js" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-text  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-controller-promises-unit-test-js-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC1" class="blob-code blob-code-inner js-file-line">
                  var mockFooService,
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC2" class="blob-code blob-code-inner js-file-line">
                  sut;
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC3" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC4" class="blob-code blob-code-inner js-file-line">
                  describe('FooController tests', function () {
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC5" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC6" class="blob-code blob-code-inner js-file-line">
                  beforeEach(function($q, $controller){
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L7" class="blob-num js-line-number" data-line-number="7">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC7" class="blob-code blob-code-inner js-file-line">
                  mockFooService = {
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L8" class="blob-num js-line-number" data-line-number="8">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC8" class="blob-code blob-code-inner js-file-line">
                  bar: function() {
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L9" class="blob-num js-line-number" data-line-number="9">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC9" class="blob-code blob-code-inner js-file-line">
                  return $q.reject({ data: { message: 'Error message' } });
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L10" class="blob-num js-line-number" data-line-number="10">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC10" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L11" class="blob-num js-line-number" data-line-number="11">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC11" class="blob-code blob-code-inner js-file-line">
                  };
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L12" class="blob-num js-line-number" data-line-number="12">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC12" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L13" class="blob-num js-line-number" data-line-number="13">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC13" class="blob-code blob-code-inner js-file-line">
                  var $scope = {};
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L14" class="blob-num js-line-number" data-line-number="14">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC14" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L15" class="blob-num js-line-number" data-line-number="15">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC15" class="blob-code blob-code-inner js-file-line">
                  sut = $controller('FooController', { $scope: $scope, fooService: mockFooService });
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L16" class="blob-num js-line-number" data-line-number="16">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC16" class="blob-code blob-code-inner js-file-line">
                  });
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L17" class="blob-num js-line-number" data-line-number="17">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC17" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L18" class="blob-num js-line-number" data-line-number="18">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC18" class="blob-code blob-code-inner js-file-line">
                  it('callBar() should call onBarError() if an error is thrown', function () {
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L19" class="blob-num js-line-number" data-line-number="19">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC19" class="blob-code blob-code-inner js-file-line">
                  spyOn(sut, 'onBarError').andCallThrough();
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L20" class="blob-num js-line-number" data-line-number="20">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC20" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L21" class="blob-num js-line-number" data-line-number="21">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC21" class="blob-code blob-code-inner js-file-line">
                  scope.callBar();
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L22" class="blob-num js-line-number" data-line-number="22">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC22" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L23" class="blob-num js-line-number" data-line-number="23">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC23" class="blob-code blob-code-inner js-file-line">
                  scope.$apply(); // without the promise will not be evaluated
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L24" class="blob-num js-line-number" data-line-number="24">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC24" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L25" class="blob-num js-line-number" data-line-number="25">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC25" class="blob-code blob-code-inner js-file-line">
                  expect(sut.onBarError).toHaveBeenCalled();
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L26" class="blob-num js-line-number" data-line-number="26">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC26" class="blob-code blob-code-inner js-file-line">
                  });
                </td>
              </tr>
              
              <tr>
                <td id="file-controller-promises-unit-test-js-L27" class="blob-num js-line-number" data-line-number="27">
                </td>
                
                <td id="file-controller-promises-unit-test-js-LC27" class="blob-code blob-code-inner js-file-line">
                  });
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/896b8f47fbf8b783b2f5/raw/de3f1f119a0004363dfb443b480b5d264c576821/controller-promises-unit-test-js" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/896b8f47fbf8b783b2f5#file-controller-promises-unit-test-js">controller-promises-unit-test-js</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

in the beforeEach() block a mock service is created with a rejected promise (line 9) and on line 15 the controller is instantiated with the mocked dependencies.

On line 23 there's the core of the test: a call to $scope.apply().  
Without it the promise will not be resolved and any method chain will not be executed.  
The reason is simple: the promises implementation is tied to the digest cycle, which is not handled by Jasmine. Calling $scope.apply() will update the internal status and take care of digest for you.

Cheers!

<div class="post-details-footer-widgets">
</div>