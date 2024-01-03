---
description: >
  Esploriamo alcune delle nuove features di Entity Famework Core 3 e vediamo come applicare il DDD con Persistence Ignorance
id: 6808
title: 'Facciamo un po' di DDD con Entity Framework Core 3!'
date: 2019-10-08T10:38:02-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6808
permalink: /it/facciamo-un-po-di-ddd-con-entity-framework-core-3/
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
  - Design Patterns
  - Programming
language: ita
---
Pochi giorni fa <a rel="noreferrer noopener" aria-label="Microsoft ha rilasciato (opens in a new tab)" href="https://devblogs.microsoft.com/dotnet/announcing-ef-core-3-0-and-ef-6-3-general-availability/" target="_blank">Microsoft ha rilasciato</a> **Entity Framework Core 3**, introducendo un bel po' di miglioramenti sia dal punto di vista delle funzionalitá che delle performance (ed anche qualche breaking-change).

#### Adesso abbiamo completo supporto per diverse cose interessanti come C#8, Async Enumerables ed anche un LINQ provider nuovo di zecca.

Ultimamente a lavoro sto usando moltissimo **Entity Framework** ma ovviamente prima di fare qualunque aggiornamento alle dipendenze di un progetto é sempre necessario fare dei test.

Come spesso faccio quindi, ho deciso di scrivere un piccolo demo e provare alcune delle nuove funzionalitá. Potete trovare i sorgenti come al solito <a rel="noreferrer noopener" aria-label="su GitHub (opens in a new tab)" href="https://github.com/mizrael/EFCoreCommerceDemo" target="_blank">su GitHub</a>.

Il mio obiettivo per questo progetto é di modellare un po' di <a rel="noreferrer noopener" aria-label="Aggregates e Value Objects (opens in a new tab)" href="https://lostechies.com/jimmybogard/2008/05/21/entities-value-objects-aggregates-and-roots/" target="_blank">Aggregates e Value Objects</a> mettendo in pratica la <a rel="noreferrer noopener" aria-label="Persistence Ignorance (opens in a new tab)" href="https://deviq.com/persistence-ignorance/" target="_blank">Persistence Ignorance</a>. Sostanzialmente non voglio che le classi che si occupano di business logic vengano "contaminate" dal codice responsabile di salvare e leggere i dati.

Per fortuna **Entity Framework Core** offre la possibilitá di configurare il mapping entitá-tabelle con una comodissima <a rel="noreferrer noopener" aria-label="Fluent Interface (opens in a new tab)" href="https://martinfowler.com/bliki/FluentInterface.html" target="_blank">Fluent Interface</a>, evitando completamente quegli scomodi attributi sulle properties.

Abbiamo addirittura due opzioni. La prima é di scrivere tutto il codice di mapping nel metodo <a rel="noreferrer noopener" aria-label="OnModelCreating() (opens in a new tab)" href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.dbcontext.onmodelcreating?view=efcore-2.1#Microsoft_EntityFrameworkCore_DbContext_OnModelCreating_Microsoft_EntityFrameworkCore_ModelBuilder_" target="_blank">OnModelCreating()</a> del nostro DbContext. Tutto molto semplice, ma puó portare ad un bel po' di caos nel codice, soprattutto se il numero di entitá da configurare é alto.

La seconda opzione é quella di implementare l'interfaccia <a rel="noreferrer noopener" href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.ientitytypeconfiguration-1?view=efcore-2.1" target="_blank">IEntityTypeConfiguration<></a> : con questa possiamo separare la configurazione per ogni singola entitá ed ottenere una struttura molto piú pulita.

Adottando questa seconda opzione ho modellato un semplice scenario di eCommerce con Products, Quotes ed Orders. Queste ultime due entitá contengono anche delle relazioni one-to-many con Quote Items e Order Lines rispettivamente.

Alla prima esecuzione l'applicazione creerá il database, che dovrebbe essere piú o meno cosí:<figure class="wp-block-image alignwide">

<a href="/assets/uploads/2019/10/image-2.png?ssl=1" target="_blank" rel="noreferrer noopener"><img loading="lazy" width="788" height="632" src="/assets/uploads/2019/10/image-2.png?resize=788%2C632&#038;ssl=1" alt="" class="wp-image-6801" srcset="/assets/uploads/2019/10/image-2.png?w=924&ssl=1 924w, /assets/uploads/2019/10/image-2.png?resize=300%2C241&ssl=1 300w, /assets/uploads/2019/10/image-2.png?resize=768%2C616&ssl=1 768w, /assets/uploads/2019/10/image-2.png?resize=788%2C632&ssl=1 788w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /></a><figcaption>diagramma generato con [https://sqldbm.com](https://sqldbm.com/) </figcaption></figure> 

Subito dopo il codice si occuperá di:

  1. creare qualche prodotto
  2. aggiungere solo un prodotto ad un preventivo e salvarlo
  3. aggiornare il preventivo aggiungendo un altro prodotto
  4. creare un ordine dal preventivo
  5. aggiungere un altro prodotto al preventivo
  6. creare un altro ordine<figure class="wp-block-image alignwide">

<a href="/assets/uploads/2019/10/image.png?ssl=1" target="_blank" rel="noreferrer noopener"><img loading="lazy" width="788" height="308" src="/assets/uploads/2019/10/image.png?resize=788%2C308&#038;ssl=1" alt="" class="wp-image-6797" srcset="/assets/uploads/2019/10/image.png?w=912&ssl=1 912w, /assets/uploads/2019/10/image.png?resize=300%2C117&ssl=1 300w, /assets/uploads/2019/10/image.png?resize=768%2C301&ssl=1 768w, /assets/uploads/2019/10/image.png?resize=788%2C308&ssl=1 788w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /></a></figure> 

In un altro post daremo uno sguardo al codice e parleremo meglio delle configurazioni delle entitá. Restate collegati!

<div class="post-details-footer-widgets">
</div>