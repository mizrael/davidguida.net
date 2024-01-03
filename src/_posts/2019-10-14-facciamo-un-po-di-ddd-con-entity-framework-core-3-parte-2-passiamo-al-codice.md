---
description: >
  In this article we're going to take a look at how we can start modeling our classes and express our Domain and store our data using Entity Framework.
id: 6832
title: 'Facciamo un po’ di DDD con Entity Framework Core 3! - parte 2: passiamo al codice'
date: 2019-10-14T12:45:45-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6832
permalink: /it/facciamo-un-po-di-ddd-con-entity-framework-core-3-parte-2-passiamo-al-codice/
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
image: /assets/uploads/2018/01/Entity-Framework-Logo_2colors_Square_RGB-591x360.png
categories:
  - .NET
  - ASP.NET
  - Design Patterns
  - Programming
language: ita
---
<a rel="noreferrer noopener" aria-label="L'ultima volta (opens in a new tab)" href="https://www.davidguida.net/it/facciamo-un-po-di-ddd-con-entity-framework-core-3/" target="_blank">L'ultima volta</a> abbiamo parlato un po' della nuova versione di **Entity Framework Core 3** e fatto una breve introduzione al demo che ho preparato per testare le nuove funzionalitá. Ora diamo invece uno sguardo al codice.

Mi son preso la libertá di aggiornare il <a rel="noreferrer noopener" aria-label="repository on GitHub (opens in a new tab)" href="https://github.com/mizrael/EFCoreCommerceDemo" target="_blank">repository on GitHub</a> e dividerlo in due progetti. **Example 1** é una semplice console app, mentre **Example 2** ha piú o meno lo stesso codice ma all'interno di una Web API.

Iniziamo con Example 1. La cartella <a rel="noreferrer noopener" aria-label="Models (opens in a new tab)" href="https://github.com/mizrael/EFCoreCommerceDemo/tree/master/EFCoreCommerceDemo.Example1/EFCoreCommerceDemo.Example1/Models" target="_blank">Models</a> contiene il succo del progetto. Questo é il primo posto dove iniziare a scrivere codice quando si vuole fare DDD. Ovviamente é necessario avere una certa conoscenza del Dominio, altrimenti si finisce sicuramente con una <a rel="noreferrer noopener" aria-label="&quot;big ball of mud&quot; (opens in a new tab)" href="https://en.wikipedia.org/wiki/Big_ball_of_mud" target="_blank">"big ball of mud"</a>.

#### Fare TDD in questo caso puó aiutare: se la conoscenza del Dominio é carente o non si ha ancora una chiara idea del design finale del codice, scrivere i test prima dará sicuramente i giusti spunti per arrivare ad una soluzione chiara.

O almeno vi aiuterá a porre le domande giuste.

Tornando al codice, qui abbiamo 5 classi che modellano un semplice scenario di eCommerce:

  * Product: niente di particolare, solo properties e niente metodi. Praticamente un "<a rel="noreferrer noopener" aria-label="anemic model (opens in a new tab)" href="https://martinfowler.com/bliki/AnemicDomainModel.html" target="_blank">anemic model</a>". É un'Entitá ed un <a rel="noreferrer noopener" aria-label="Aggregate root (opens in a new tab)" href="https://martinfowler.com/bliki/DDD_Aggregate.html" target="_blank">Aggregate root</a>.
  * Quote: qui le cose si fanno interessanti. Contiene una lista di QuoteItems ed il metodo AddProduct(). Quest'ultimo si assicura che l'input non sia null e lo aggiunge alla lista. Poi abbiamo la property "Total" che&#8230;beh calcola il prezzo totale. Anche Quote é un'Entitá ed un Aggregate root.  
    QuoteItem é invece un <a rel="noreferrer noopener" aria-label="Value Object (opens in a new tab)" href="https://martinfowler.com/bliki/ValueObject.html" target="_blank">Value Object</a> anche se in uno scenario piú complesso potrebbe/dovrebbe essere considerata un'Entitá a se stante.
  * Order: praticamente come Quote, é un'Entitá ed un Aggregate root. Anche lui ha una lista di Prodotti, OrderLines in questo caso. Tuttavia non c'é modo di aggiornare la lista in quanto viene creata nel costruttore. Anche qui abbiamo la property "Total".  
    OrderLine é un ValueObject come QuoteItem.

Quasi tutte le classi hanno un costruttore privato senza parametri. Questa é **l'unica concessione** che dobbiamo fare ad Entity Framework: é necessaria per poter serializzare le istanze in quanto potrebbe non essere possibile utilizzare l'altro costruttore.

La <a rel="noreferrer noopener" aria-label="classe Product (opens in a new tab)" href="https://github.com/mizrael/EFCoreCommerceDemo/blob/master/EFCoreCommerceDemo.Example1/EFCoreCommerceDemo.Example1/Models/Product.cs" target="_blank">classe Product</a> infatti é l'unica che non ha il cTor privato. Questo perché il cTor esposto si aspetta tutti i valori necessari per popolare le varie properties (nomi inclusi).

Come si puó facilmente notare, qui non c'é codice per gestire la persistenza: in queste classi stiamo "solo" modellando il nostro Dominio, niente di piú.

La persistenza é gestita dalla classe <a rel="noreferrer noopener" aria-label="CommerceDbContext  (opens in a new tab)" href="https://github.com/mizrael/EFCoreCommerceDemo/blob/master/EFCoreCommerceDemo.Example1/EFCoreCommerceDemo.Example1/Infrastructure/CommerceDbContext.cs" target="_blank">CommerceDbContext </a>nella cartella Infrastructure. La configurazione delle entitá é stata fatta implementando l'interfaccia <a rel="noreferrer noopener" aria-label="IEntityTypeConfiguration (opens in a new tab)" href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.ientitytypeconfiguration-1?view=efcore-2.1" target="_blank">IEntityTypeConfiguration</a>.

Le classi <a rel="noreferrer noopener" href="https://github.com/mizrael/EFCoreCommerceDemo/blob/master/EFCoreCommerceDemo.Example1/EFCoreCommerceDemo.Example1/Infrastructure/QuoteEntityTypeConfiguration.cs" target="_blank">QuoteEntityTypeConfiguration</a> e <a rel="noreferrer noopener" href="https://github.com/mizrael/EFCoreCommerceDemo/blob/master/EFCoreCommerceDemo.Example1/EFCoreCommerceDemo.Example1/Infrastructure/OrderEntityTypeConfiguration.cs" target="_blank">OrderEntityTypeConfiguration</a> sono molto simili ed abbastanza interessanti. Come potete vedere stiamo ignorando la property Total in quanto é calcolata dinamicamente sommando i prezzi dei prodotti moltiplicati per la quantitá. Inoltre le liste di QuoteItem e OrderLine sono gestite come <a rel="noreferrer noopener" aria-label="Owned Entities (opens in a new tab)" href="https://docs.microsoft.com/en-us/ef/core/modeling/owned-entities" target="_blank">Owned Entities</a>. Hanno una tabella a parte ed un riferimento alla tabella Products.

Ho anche definito una <a rel="noreferrer noopener" href="https://docs.microsoft.com/en-us/ef/core/modeling/shadow-properties" target="_blank">shadow property</a> "Id" su entrambe in modo da poterle scrivere correttamente nel db. La property non si rifletterá nelle classi, anche se come giá detto in precedenza in uno scenario piú avanzato le si potrebbe "promuovere" ad Entitá per gestire piú funzionalitá.

Per esempio, immaginiamo di aver ordinato piú prodotti su Amazon ed il nostro ordine sta per essere spedito. Ogni prodotto é venduto e spedito da un diverso negozio, quindi potremmo non riceverli tutti insieme. Modellando OrderLine come Entitá ci consente di tracciare la spedizione e gestire adeguatamente questa casistica.

Un'ultima nota ora. Come avete potuto notare la classe QuoteItem é molto piccola, solo due property. Avrei potuto usare una struct invece di una classe. Tuttavia questo avrebbe permesso la creazione delle istanze chiamando direttamente il costruttore di default senza parametri. Questo é potenzialmente un grosso problema in quanto nel nostro costruttore potremmo effettuare dei controlli sull'input per assicurare che l'istanza sia sempre in uno stato valido.

Per ora é tutto! La prossima volta daremo uno sguardo ad Example 2.

<div class="post-details-footer-widgets">
</div>