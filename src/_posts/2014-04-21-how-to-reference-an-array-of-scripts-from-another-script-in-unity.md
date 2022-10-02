---
id: 451
title: How to reference an array of scripts from another script in Unity
date: 2014-04-21T21:26:46-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=451
permalink: /how-to-reference-an-array-of-scripts-from-another-script-in-unity/
dsq_thread_id:
  - "5157210617"
image: /assets/uploads/2014/04/logo-titled-672x297.png
categories:
  - Gaming
  - Programming
  - Unity
---
Just a quick and dirty tip (actually, more of a reminder for myself), probably there&#8217;s a better way but for now it worked for me&#8230; Basically in Unity I needed a quick way to reference a list of scripts from another script. The idea is to have a &#8220;main&#8221; script holding a list of sub-scripts used to create instances of different game objects (some kind of dynamic factory). The first step is to create a base class for the sub scripts:

[csharp]

using UnityEngine;

public abstract class HazardCreator : MonoBehaviour {  
public abstract GameObject CreateHazard ();  
}

[/csharp]

then some subclasses:

[csharp]

public class EnemyCreator : HazardCreator {  
public override GameObject CreateHazard(){ &#8230;.. }  
}

public class AsteroidCreator: HazardCreator {  
public override GameObject CreateHazard(){ &#8230;.. }  
}

[/csharp]

then in the game hierarchy I created a GameObject used as &#8220;controller&#8221; and a child GameObject that contains all the factory scripts. As last step I assigned a script to the &#8220;controller&#8221; GameObject:

[csharp]

public class GameController : MonoBehaviour {  
void Start ()  
{  
var factories = this.GetComponentsInChildren<HazardCreator>();  
if(null != factories && 0 != factories.Length)  
Debug.Log("Found " + factories.Length + " hazard creators");  
}  
}

[/csharp]

As you may easily notice, the call to <a title="GetComponentsInChildren" href="http://docs.unity3d.com/Documentation/ScriptReference/Component.GetComponentsInChildren.html" target="_blank">GetComponentsInChildren </a>is helping us getting all the scripts inheriting from the HazardCreator base class 🙂

&nbsp;

&nbsp;

<div class="post-details-footer-widgets">
</div>