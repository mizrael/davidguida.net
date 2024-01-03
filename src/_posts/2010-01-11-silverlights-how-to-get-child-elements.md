---
id: 91
title: 'Silverlight&#8217;s how to: get child elements'
date: 2010-01-11T19:26:31-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=91
permalink: /silverlights-how-to-get-child-elements/
videourl:
  - ""
image: /assets/uploads/2014/08/computerprogramming_8406403-655x280.jpg
categories:
  - .NET
  - Programming
---
I&#8217;ve started studing Silverlight a while ago, I don&#8217;t think I&#8217;ll do something special or some amazing eye-candy application&#8230; I just want to see how it works.

Well&#8230;.I don&#8217;t like it. I mean, it&#8217;s fantastic, allows you to do many wonderful things&#8230;.but I do really hate all that xaml thing.  I still have to try some tools  like [Expression Blend](http://www.microsoft.com/italy/products/expression/products/Blend_OverView.aspx) and [Sketchflow](http://www.microsoft.com/expression/products/SketchFlow_OverView.aspx) , so I feel free to change my mind.

Anyway, during my code-nights I found this snippet on a forum, and I think it&#8217;s very useful for who (like me) prefer C#-coding over the xml-way-of-life. In a nutshell it&#8217;s an [extension method ](http://msdn.microsoft.com/en-us/library/bb383977.aspx) that allows you to recursively get a list of children of a specific type from an element. Here you go!

<pre>public static class Extensions
 {
        public static IEnumerable&lt;T&gt; GetChildren&lt;T&gt;(this FrameworkElement element) where T : FrameworkElement
        {
            int count = VisualTreeHelper.GetChildrenCount(element);
            for (int i = 0; i &lt; count; i++)
            {
                var child = VisualTreeHelper.GetChild(element, i) as FrameworkElement;
                if (child is T) yield return (T)child;          
                var children = child.GetChildren&lt;T&gt;();
                foreach (T grandchild in children)  
                     yield return grandchild;
            }
        }
 }</pre>

<div class="post-details-footer-widgets">
</div>