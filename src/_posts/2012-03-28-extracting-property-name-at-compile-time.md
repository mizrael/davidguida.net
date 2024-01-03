---
id: 157
title: Extracting property name at compile time
date: 2012-03-28T15:29:07-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=157
permalink: /extracting-property-name-at-compile-time/
dsq_thread_id:
  - "5789511647"
categories:
  - Programming
---
<div>
  Just an extract from <a href="http://dotnet.dzone.com/articles/implementing?mz=57923-dotnet" target="_blank">this article</a>. It's something I always find VERY useful (in situations where speed is not one of our concerns, of course)
</div>

<div>
</div>

<div>
  <div>
    <code>protected string ExtractPropertyName&lt;T&gt;(Expression&lt;Func&lt;T&gt;&gt; propertyExpression) {</code>
  </div>
  
  <div>
    <code>    if (propertyExpression == null) {</code>
  </div>
  
  <div>
    <code>        throw new ArgumentNullException("propertyExpression");</code>
  </div>
  
  <div>
    <code>    }</code>
  </div>
  
  <div>
    <code> </code>
  </div>
  
  <div>
    <code>    var memberExpression = propertyExpression.Body as MemberExpression;</code>
  </div>
  
  <div>
    <code>    if (memberExpression == null) {</code>
  </div>
  
  <div>
    <code>        throw new ArgumentException("The expression is not a member access expression.", "propertyExpression");</code>
  </div>
  
  <div>
    <code>    }</code>
  </div>
  
  <div>
    <code> </code>
  </div>
  
  <div>
    <code>    var property = memberExpression.Member as PropertyInfo;</code>
  </div>
  
  <div>
    <code>    if (property == null) {</code>
  </div>
  
  <div>
    <code>        throw new ArgumentException("The member access expression does not access a property.", "propertyExpression");</code>
  </div>
  
  <div>
    <code>    }</code>
  </div>
  
  <div>
    <code> </code>
  </div>
  
  <div>
    <code>    if (!property.DeclaringType.IsAssignableFrom(this.GetType())) {</code>
  </div>
  
  <div>
    <code>        throw new ArgumentException("The referenced property belongs to a different type.", "propertyExpression");</code>
  </div>
  
  <div>
    <code>    }</code>
  </div>
  
  <div>
    <code> </code>
  </div>
  
  <div>
    <code>    var getMethod = property.GetGetMethod(true);</code>
  </div>
  
  <div>
    <code>    if (getMethod == null) {</code>
  </div>
  
  <div>
    <code>        // this shouldn't happen - the expression would reject the property before reaching this far</code>
  </div>
  
  <div>
    <code>        throw new ArgumentException("The referenced property does not have a get method.", "propertyExpression");</code>
  </div>
  
  <div>
    <code>    }</code>
  </div>
  
  <div>
    <code> </code>
  </div>
  
  <div>
    <code>    if (getMethod.IsStatic) {</code>
  </div>
  
  <div>
    <code>        throw new ArgumentException("The referenced property is a static property.", "propertyExpression");</code>
  </div>
  
  <div>
    <code>    }</code>
  </div>
  
  <div>
    <code> </code>
  </div>
  
  <div>
    <code>    return memberExpression.Member.Name;</code>
  </div>
  
  <div>
    <code>}    </code>
  </div>
</div>

<div class="post-details-footer-widgets">
</div>