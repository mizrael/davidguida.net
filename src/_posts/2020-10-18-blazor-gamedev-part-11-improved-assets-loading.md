---
description: >
  Welcome back to part 11 of our Blazor 2d Gamedev series. Today we're going to refactor and improve the code responsible for loading assets.
id: 7772
title: 'Blazor Gamedev  &#8211; part 11: improved assets loading'
date: 2020-10-18T21:50:32-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=7772
permalink: /blazor-gamedev-part-11-improved-assets-loading/
zakra_layout:
  - tg-site-layout--customizer
zakra_remove_content_margin:
  - "0"
zakra_transparent_header:
  - customizer
zakra_page_header:
  - "1"
zakra_logo:
  - "0"
image: /assets/uploads/2020/07/blazor-2d-game-dev.jpg
categories:
  - .NET
  - ASP.NET
  - Blazor
  - Gamedev
---
Hi All! Welcome back to part 11 of our **Blazor 2d Gamedev** series. Today we&#8217;re going to refactor and improve the code responsible for **loading assets**.

<a href="https://www.davidguida.net/blazor-gamedev-part-10-the-scene-graph/" target="_blank" rel="noreferrer noopener">Last time </a>we talked about **Scene Graphs** and how they can help us managing our Game Entities. We used the classic solar system example, with every planet represented by its own asset, loaded separately.

Our goal now is to have a centralized asset loading mechanism and avoid the hassle of having to reference all our assets in a Blazor page or component. Basically, we&#8217;ll be moving from this

<pre class="EnlighterJSRAW" data-enlighter-language="html" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">&lt;Spritesheet Source="assets/planet1.json" OnModelLoaded="@OnAssetsLoaded" />
&lt;Spritesheet Source="assets/planet2.json" OnModelLoaded="@OnAssetsLoaded" />
&lt;Spritesheet Source="assets/planet3.json" OnModelLoaded="@OnAssetsLoaded" />
&lt;Spritesheet Source="assets/planet4.json" OnModelLoaded="@OnAssetsLoaded" />
&lt;Spritesheet Source="assets/planet5.json" OnModelLoaded="@OnAssetsLoaded" />
&lt;Spritesheet Source="assets/planet6.json" OnModelLoaded="@OnAssetsLoaded" /></pre>

to something much more simple:

<pre class="EnlighterJSRAW" data-enlighter-language="html" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">&lt;Assets Source="assets/assets.json" OnLoaded="@OnAssetsLoaded" /></pre>

Nice, isn&#8217;t it? 

The idea is quite simple actually: instead of referencing each asset one by one (let it be a sprite, sound, animation, whatever), we&#8217;re going to load a <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example10/wwwroot/assets/assets.json" target="_blank" rel="noreferrer noopener">single JSON file </a>containing the assets list along with its type:

<pre class="EnlighterJSRAW" data-enlighter-language="json" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">[
  {
    "path": "assets/enemyRed1.png",
    "type": "sprite"
  },
  {
    "path": "assets/meteorBrown_big1.png",
    "type": "sprite"
  },
  {
    "path": "assets/playerShip2_green.png",
    "type": "sprite"
  }
]</pre>

At this point, all we have to do is implement a **Blazor Component** that can parse this data, download the files and inject them into our Game. You can find the <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example10/Shared/Assets.razor" target="_blank" rel="noreferrer noopener">full code here</a>, but let&#8217;s see the gist:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">protected override async Task OnInitializedAsync()
{
	var items = await Http.GetFromJsonAsync&lt;AssetData[]>(this.Source);

	foreach (var item in items)
	{
		IAsset asset = null;
		if (item.type == "sprite")
			asset = await this.AssetsResolver.Load&lt;Sprite>(item.path);

		if (null != asset)
			_items.Add(new Tuple&lt;IAsset, AssetData>(asset, item));
	}

	await this.OnLoaded.InvokeAsync(this);
}</pre>

Here we download the file pointed by the _**Source**_ property, loop over each item and use the **_AssetResolver_** instance to load it given the type. In our browser&#8217;s network tab we would see something like this:

<div class="wp-block-image">
  <figure class="aligncenter size-large"><img loading="lazy" width="598" height="378" src="/assets/uploads/2020/10/assets-loading.jpg?resize=598%2C378&#038;ssl=1" alt="" class="wp-image-7778" srcset="/assets/uploads/2020/10/assets-loading.jpg?w=598&ssl=1 598w, /assets/uploads/2020/10/assets-loading.jpg?resize=300%2C190&ssl=1 300w" sizes="(max-width: 598px) 100vw, 598px" data-recalc-dims="1" /></figure>
</div>

Once loaded, the items will be rendered into the page in a simple loop:

<pre class="EnlighterJSRAW" data-enlighter-language="html" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">&lt;div class="assets">
    @foreach (var item in _items)
    {
        // render item by type
    }
&lt;/div></pre>

The <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example10/Core/Assets/AssetsResolver.cs" target="_blank" rel="noreferrer noopener"><strong>AssetsResolver</strong> class </a>will basically serve two purposes: loading the assets from the server and, well, _resolve_ them when we need during the game (more on this later). Each asset type has to be registered in the **<a href="https://blog.ploeh.dk/2011/07/28/CompositionRoot/" target="_blank" rel="noreferrer noopener">Composition Root</a>**. An <a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example10/Core/Assets/Loaders/AssetLoaderFactory.cs" target="_blank" rel="noreferrer noopener"><em><strong>AssetLoaderFactory</strong></em> </a>will be leveraged to do the matching type/loader:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class AssetLoaderFactory : IAssetLoaderFactory
{
	private readonly IDictionary&lt;Type, object> _loaders;

	public AssetLoaderFactory()
	{
		_loaders = new Dictionary&lt;Type, object>();
	}

	public void Register&lt;TA>(IAssetLoader&lt;TA> loader) where TA : IAsset
	{
		var type = typeof(TA);
		if (!_loaders.ContainsKey(type)) _loaders.Add(type, null);
		_loaders[type] = loader;
	}

	public IAssetLoader&lt;TA> Get&lt;TA>() where TA : IAsset
	{
		var type = typeof(TA);
		if(!_loaders.ContainsKey(type))
			throw new ArgumentOutOfRangeException($"invalid asset type: {type.FullName}");

		return _loaders[type] as IAssetLoader&lt;TA>;
	}
}</pre>

In our demo we will have a single Asset Loader implementation, **<a href="https://github.com/mizrael/BlazorCanvas/blob/develop/BlazorCanvas.Example10/Core/Assets/Loaders/SpriteAssetLoader.cs" target="_blank" rel="noreferrer noopener">SpriteAssetLoader</a>**:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public class SpriteAssetLoader : IAssetLoader&lt;Sprite>
{
	private readonly HttpClient _httpClient;
	private readonly ILogger&lt;SpriteAssetLoader> _logger;

	public SpriteAssetLoader(HttpClient httpClient, ILogger&lt;SpriteAssetLoader> logger)
	{
		_httpClient = httpClient;
		_logger = logger;
	}

	public async ValueTask&lt;Sprite> Load(string path)
	{
		_logger.LogInformation($"loading sprite from path: {path}");

		var bytes = await _httpClient.GetByteArrayAsync(path);
		await using var stream = new MemoryStream(bytes);
		using var image = await SixLabors.ImageSharp.Image.LoadAsync(stream);
		var size = new Size(image.Width, image.Height);

		var elementRef = new ElementReference(Guid.NewGuid().ToString());
		return new Sprite(path, elementRef, size, bytes, ImageFormatUtils.FromPath(path));
	}
}</pre>

We first download the image from the server into a stream and then load it in memory. I&#8217;m using **<a href="https://github.com/SixLabors/ImageSharp" target="_blank" rel="noreferrer noopener">ImageSharp </a>**for now as seems to be the only library at the moment to work in WebAssembly. I was evaluating **<a href="https://github.com/mono/SkiaSharp" target="_blank" rel="noreferrer noopener">SkiaSharp </a>**as well, but when I wrote the sample it was still <a href="https://github.com/mono/SkiaSharp/issues/1194" target="_blank" rel="noreferrer noopener">not working properly</a>. 

#### The reason why we need to parse the image data is that we need some useful info, like width and height. Yes, we could add those as attributes elsewhere, but we might also want to do some processing, like changing contrast/saturation and so on. 

So, this covers the loading part. Now with the easy part: using the assets in our Game. The code is not that different from last time: all we have to do is initialize our Scene Graph and populate it with Game Objects:

<pre class="EnlighterJSRAW" data-enlighter-language="generic" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">var player = new GameObject();

player.Components.Add&lt;TransformComponent>();

var playerSpriteRenderer = player.Components.Add&lt;SpriteRenderComponent>();
playerSpriteRenderer.Sprite = AssetsResolver.Get&lt;Sprite>("assets/playerShip2_green.png");

SceneGraph.Root.AddChild(player);</pre>

Aaaand we&#8217;re done! The <a href="https://mizrael.github.io/BlazorCanvas/BlazorCanvas.Example10/" target="_blank" rel="noreferrer noopener">final result </a>is going to look like more or less like this:

<div class="wp-block-image">
  <figure class="aligncenter size-large"><img loading="lazy" width="600" height="330" src="/assets/uploads/2020/10/blazor-assets-loading.gif?resize=600%2C330&#038;ssl=1" alt="" class="wp-image-7780" data-recalc-dims="1" /></figure>
</div>

This is the last article of the Series. I really enjoyed writing again about gamedev stuff and seems a lot of people liked the articles. It also contributed to my <a href="https://mvp.microsoft.com/en-us/PublicProfile/5003878?fullName=Davide%20Guida" target="_blank" rel="noreferrer noopener">MVP award</a>, so that&#8217;s definitely a plus 🙂 

I&#8217;ll probably add something more in the not-so-distant future, who knows. For now, thank you very much for reading, see you next time!

**Update 7/2/2021**: I decided to add <a href="https://www.davidguida.net/blazor-gamedev-part-12-collision-detection/" target="_blank" rel="noreferrer noopener">another article</a> to the Series, this time we&#8217;ll talk about collision detection!

<div class="post-details-footer-widgets">
</div>