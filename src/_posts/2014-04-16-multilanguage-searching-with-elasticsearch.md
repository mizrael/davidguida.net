---
id: 450
title: Multilanguage searching with Elasticsearch
date: 2014-04-16T18:00:20-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=450
permalink: /multilanguage-searching-with-elasticsearch/
dsq_thread_id:
  - "5329015859"
image: /assets/uploads/2014/04/elasticsearch.png
categories:
  - Elasticsearch
  - Programming
---
This time I'll start directly with the code.  First an utility method to create the connection:

[csharp]  
private ElasticClient Connect(IEnumerable contents)  
{  
var defaultLanguageCode = "eng";  
var uri = new System.Uri(ConfigurationManager.AppSettings["ElasticSearchServer"]);  
var settings = new ConnectionSettings(uri).SetDefaultIndex(defaultLanguageCode);  
var client = new ElasticClient(settings);  
}  
[/csharp]

And here's the interesting part:

[csharp]  
public IEnumerable<SearchItem> Search(string text, int page, int pageSize, IEnumerable<string> languages)  
{  
ElasticClient client = this.Connect();  
IQueryResponse<SearchItem> searchResults = client.Search<SearchItem>(s => this.GetIndexSearchDescriptor(s, languages)  
.QueryString(text)  
.Skip(System.Math.Max(0, page) * pageSize)  
.Take(pageSize));

if (searchResults.Total != 0 && searchResults.Hits != null && searchResults.Hits.Hits != null)  
{  
int totalPages = (int)System.Math.Ceiling((double)((float)searchResults.Total / (float)pageSize));  
var results = searchResults.Hits.Hits;

return results.Select(h => h.Source).ToArray();  
}  
return Enumerable.Empty<SearchItem>();  
}  
[/csharp]

<span style="line-height: 1.5;">As you may see, the Search method takes the text parameter and a list of languages. In <a title="Multilanguage indexing with Elasticsearch" href="/multilanguage-indexing-with-elasticsearch/" target="_blank">the last post</a> we indexed the content translations using language codes (eg: <em>eng</em>, <em>ita</em>, <em>esp</em> and so on&#8230;) as index names. So the idea here is to use the GetIndexSearchDescriptor method to get a SearchDescriptor instance from the language codes and run a query using the text in input.<br /> As a bonus I have added quick&dirty pagination just for the sake of it 😀</span>

[csharp]  
private SearchDescriptor<SearchItem> GetIndexSearchDescriptor(SearchDescriptor<SearchItem> s, IEnumerable<string> languages)  
{  
if (languages == null || !languages.Any<string>())  
return s.AllIndices();

return s.Indices(languages);  
}  
[/csharp]

<div class="post-details-footer-widgets">
</div>