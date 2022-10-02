---
id: 405
title: ASP.NET Dropdownlist with groups
date: 2014-03-17T17:00:32-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=405
permalink: /asp-net-dropdownlist-with-groups/
dsq_thread_id:
  - "5201548123"
categories:
  - ASP.NET
  - Javascript
  - Programming
---
looks like it&#8217;s not possible to have optgroups in an ASP.NET Dropdownlist without subclassing. Today I found a <a href="http://stackoverflow.com/questions/16167862/how-can-i-add-option-groups-in-asp-dot-net-drop-down-list" target="_blank">very useful snippet</a> on stackoverflow that allows to group items on client side and I want to share it with the world:

**server:**

    private void AddItemToList(DropDownList list, string title, string value, string group = string.Empty) {
       ListItem item = new ListItem(title, value);
       if (!String.IsNullOrEmpty(group))
       {
           item.Attributes["data-category"] = group;
       }
       list.Items.Add(item);
    }
    

**` client:`**

    var groups = {};
    $("select option[data-category]").each(function () {
         groups[$.trim($(this).attr("data-category"))] = true;
    });
    $.each(groups, function (c) {
         $("select option[data-category='"+c+"']").wrapAll('<optgroup label="' + c + '">');
    });

Hope it helps!

<div class="post-details-footer-widgets">
</div>