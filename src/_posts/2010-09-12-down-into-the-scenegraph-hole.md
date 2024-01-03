---
id: 106
title: Down into the SceneGraph hole
date: 2010-09-12T19:34:54-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=106
permalink: /down-into-the-scenegraph-hole/
videourl:
  - ""
image: /assets/uploads/2014/08/computerprogramming_8406403-655x280.jpg
categories:
  - .NET
  - Gaming
  - Programming
  - XNA
---
Ok, this gonna be a very long post. This is my SceneGraph implementation, or, at least the most important parts of it. I thought it would be nice to share it with the world (and hear you scream, though), so let's start with some code!

`public abstract class ISceneNode<br />
{<br />
#region Members`

private ISceneNode _parent = null;

#endregion Members

public ISceneNode()  
{  
}

#region Methods

public void Update(GameTime gameTime)  
{  
if (!IsActive)  
return;

BeforeUpdate(gameTime);

int count = Children.Nodes.Count;  
for (int i = 0; i != count; ++i)  
Children.Nodes[i].Update(gameTime);

AfterUpdate(gameTime);  
}

#endregion Methods

#region Interface

protected virtual void BeforeUpdate(GameTime gameTime) { }  
protected virtual void AfterUpdate(GameTime gameTime) { }

#endregion Interface

#region Properties

public ISceneNode Parent { get { return \_parent; } internal set { \_parent = value; } }

internal SceneNodeCollection Children = new SceneNodeCollection();

public bool IsActive = true;

#endregion Properties  
}

&nbsp;

This is fairly standard, so I won't talk much about it. What I think is worth notice is the SceneNodeCollection Children, marked as internal. My intention was to not allow people to add/remove nodes freely from another node, but use the SceneGraphService (I'll show that later) for this job. Here's the implementation of SceneNodeCollection:

`public class SceneNodeCollection : IEnumerable<ISceneNode><br />
{<br />
internal List<ISceneNode> Nodes = new List<ISceneNode>();`

public IEnumerator<ISceneNode> GetEnumerator()  
{  
return Nodes.GetEnumerator();  
}

IEnumerator IEnumerable.GetEnumerator()  
{  
return Nodes.GetEnumerator();  
}  
}

As you can see, it inherits from`IEnumerable`to allow foreach and nothing more. Now the juicy part, the SceneGraphService. It's a GameComponent that implements this interface:  
`public interface ISceneGraphService<br />
{<br />
void AddNode(ISceneNode node, ISceneNode parent);<br />
void RemoveNode(ISceneNode node);<br />
ISceneNode Root { get; }<br />
}`

SceneGraphService is added to the Services collection and to the Components collection of the Game at the very beginning, and is used to handle all the entities in the game (player, enemies, lights, bullets, whatever). I usually use a "Level" class as the root and then build the whole three using ISceneNodes as collections to group entities when needed (for example, to keep togheter a group of enemy ships). Here's the code:

`public class SceneGraphService : GameComponent, ISceneGraphService<br />
{<br />
#region Members`

private ISceneNode _root = null;  
private Dictionary<string, ISceneNode> _nodes = null;

#endregion Members

public SceneGraphService(Game game)  
: base(game)  
{  
_nodes = new Dictionary<string, ISceneNode>();

game.Services.AddService(typeof(ISceneGraphService), this);  
}

#region Methods

public override void Update(GameTime gameTime)  
{  
if (null != _root)  
_root.Update(gameTime);  
}

public void AddNode(ISceneNode node, ISceneNode parent)  
{  
if (null != node.Parent)  
RemoveNodeFromParent(node);

if (null == parent)  
{  
if (null != Root)  
throw new Exception("Unable to add another root");  
_root = node;  
}  
else  
{  
node.Parent = parent;  
parent.Children.Nodes.Add(node);  
}  
}

public void RemoveNode(ISceneNode node)  
{  
if (null != node.Parent)  
{  
RemoveNodeFromParent(node);  
}  
else if (node == _root)  
_root = null;  
}

private void RemoveNodeFromParent(ISceneNode node)  
{  
node.Parent.Children.Nodes.Remove(node);  
node.Parent = null;  
}

#endregion Methods

#region Properties

public ISceneNode Root { get { return _root; } }

#endregion Properties

&nbsp;

Next step: Component Based Entities!

<div class="post-details-footer-widgets">
</div>