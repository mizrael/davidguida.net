---
id: 432
title: Multilanguage indexing with Elasticsearch
date: 2014-04-14T11:09:20-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=432
permalink: /multilanguage-indexing-with-elasticsearch/
dsq_thread_id:
  - "5201084526"
image: /assets/uploads/2014/04/elasticsearch.png
categories:
  - Elasticsearch
  - Programming
---
This time I&#8217;m rambling about <a title="Elasticsearch" href="http://www.elasticsearch.org/" target="_blank">Elasticsearch</a>. For those who still don&#8217;t know, Elasticsearch is a very interesting search engine based on <a title="Lucene" href="http://en.wikipedia.org/wiki/Lucene" target="_blank">Lucene</a>. It&#8217;s structured to work as a NoSQL database and exposes a very nice <a title="Representational state transfer" href="http://en.wikipedia.org/wiki/Representational_state_transfer" target="_blank">RESTful</a> web interface.

Ok, that&#8217;s enough, let&#8217;s get started with the code!  
The first thing to do is download (manually or via Nuget) the <a title="Elasticsearch.Net & NEST" href="http://nest.azurewebsites.net/" target="_blank">NEST client </a>and add it to your project.  
Suppose you have a model like this in your application domain (yes, I&#8217;m using MongoDB as persistence layer):

[csharp]  
public class Content  
{  
public ObjectId Id {get;set;}  
public IEnumerable Translations { get; set; }  
}

public class ContentTranslation  
{  
public string Title { get; set; }  
public string FullText { get; set; }  
public string LanguageCode { get; set; }  
}  
[/csharp]

It&#8217;s a very simple document structure, modeled in order to store multilanguage contents. How can we store it in the search engine?  
The idea here is to create an index for each language and use an intermediary class that holds language-specific data. Something like this:

[csharp]  
public class SearchItem  
{  
public string Id { get; set; }  
public string Text { get; set; }  
}  
[/csharp]

and this is the indexing code:

[csharp]  
private void IndexContents(IEnumerable contents)  
{  
var defaultLanguageCode = "eng";  
var uri = new System.Uri(ConfigurationManager.AppSettings["ElasticSearchServer"]);  
var settings = new ConnectionSettings(uri).SetDefaultIndex(defaultLanguageCode);  
var client = new ElasticClient(settings);

foreach (var content in contents) {  
foreach (var translation in content.Translations) {  
var searchItem = new SearchItem()  
{  
Id = content.Id.ToString(),  
Text = string.Format("{0} {1}", translation.Title, translation.FullText)  
};  
client.Index(searchItem,  
translation.LanguageCode,  
typeof(Content).FullName,  
content.Id.ToString()  
);  
}  
}  
}  
[/csharp]

ok, let&#8217;s analyze the code:

  * lines 3 to 6 are responsible to initialize the ElasticSearch client and setting &#8220;eng&#8221; as default index.
  * lines 10 to 14 simply adapt the content translation to the intermediary class. Note on line 12 that we are specifying the Content Id.
  * And now the real indexing: lines 15 to 19: here we are telling the engine to index our searchItem, using translation.LanguageCode as index name,  the Content class type fullname as item type (this will be used somewhat like Collection name for a NoSQL db), and lastly we pass the current content Id.

That&#8217;s basically all 🙂

Bonus: the NEST client exposes also a nice ElasticClient.IndexMany, allowing to index multiple items in just one call.

Next: ok now I&#8217;ve indexed my contents. <a title="Multilanguage searching with Elasticsearch" href="/multilanguage-searching-with-elasticsearch/" target="_blank">How can I search them?</a>

<div class="post-details-footer-widgets">
</div>