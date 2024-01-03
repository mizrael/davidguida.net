---
description: >
  Nello scorso appuntamento abbiamo parlato un po' delle Code di Messaggi, questa volta invece introdurremo i Background Worker.
id: 6734
title: 'Usare code di messaggi in .net core – parte 2: i Background Worker'
date: 2019-07-10T12:36:02-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6734
permalink: /it/usare-code-di-messaggi-in-net-core-parte-2-i-background-worker/
image: /assets/uploads/2019/07/construction-worker-silhouette-work-background_43605-1096.jpg
categories:
  - Programming
language: ita
---
Ed eccoci al secondo articolo della Serie. Nello <a rel="noreferrer noopener" aria-label="scorso appuntamento (opens in a new tab)" href="https://www.davidguida.net/it/usare-code-di-messaggi-in-net-core-parte-1-le-code/" target="_blank">scorso appuntamento</a> abbiamo parlato un po' delle Code di Messaggi, questa volta invece introdurremo i **Background Worker**.

Giusto per rinfrescare un po' la memoria, le Code di Messaggi possono essere usate per gestire le comunicazioni asincrone tra microservizi, migliorando resilienza e scalabilitá.

Ora supponiamo di avere un'API per gestire post e tag di un blog. Ad ogni post possono essere associati uno o piú tag. Diciamo pure che abbiamo come strato di persistenza MongoDb con una sola collection "Posts". Qualcosa di semplice:

<pre class="wp-block-code"><code>{
    title: ...,
    description: ...,
    creationDate: ...,
    tags: ["lorem", "ipsum", "dolor"]
}</code></pre>

Funziona bene, le API riescono a gestire un bel po' di richieste. Tutti sono felici e contenti.

Un giorno peró ci viene chiesto di aggiungere la funzionalitá di "tag-cloud": in pratica bisogna esporre un nuovo endpoint che restituisce una lista di **tutti i Tag con tanto di conteggio** dei Post. Qualcosa tipo:

<pre class="wp-block-code"><code>[
    {tag: "lorem", posts_count: 42},
    {tag: "ipsum", posts_count: 13},
    {tag: "dolor", posts_count: 71}
]</code></pre>

Di nuovo nulla di spaziale. Adesso peró la domanda è : come creiamo i dati?

La prima opzione potrebbe essere di aggiungere una nuova collezione per i Tag ed aggiornarne il contenuto con un <a rel="noreferrer noopener" aria-label="upsert  (opens in a new tab)" href="https://docs.mongodb.com/manual/reference/glossary/#term-upsert" target="_blank">upsert </a>ogni volta che un Post viene creato o modificato. 

#### Funziona benino ma non é particolarmente scalabile: l'intera operazione potrebbe richiedere tempo oppure fallire e quindi lasciarci con il db in uno stato inconsistente.

Sicuramente potremmo aggiungere un <a rel="noreferrer noopener" aria-label="Circuit Breaker (opens in a new tab)" href="https://martinfowler.com/bliki/CircuitBreaker.html" target="_blank">Circuit Breaker</a> ma sono sicuro che non ci toglierebbe completamente dai guai.

Un'altra opzione invece é quella di usare un **Background Worker**: in soldoni all'avvio dell'applicazione facciamo partire un thread secondario ed eseguire quindi in background qualunque operazione ci serve.

#### Ovviamente questo thread sará al di fuori del ciclo request/response http quindi non avremo accesso a cose tipo utente loggato, cookie e cosí via.

Tornando al nostro piccolo esempio, il nostro Background Worker si occuperá ad intervalli regolari di svuotare la collezione dei Tag e ricrearla da zero. Potremmo farlo partire ogni 6 ore ad esempio ma questo ovviamente dipende molto dalla frequenza di aggiornamento dei Post. 

Visto che stiamo usando MongoDb, potremmo sfruttare un <a rel="noreferrer noopener" aria-label="map/reduce  (opens in a new tab)" href="https://docs.mongodb.com/manual/core/map-reduce/" target="_blank">map/reduce </a>oppure <a rel="noreferrer noopener" aria-label="l'aggregate pipeline (opens in a new tab)" href="https://docs.mongodb.com/manual/aggregation/" target="_blank">l'aggregate pipeline</a>, non fa molta differenza (in veritá si, ma non é il punto oggi).

I Background Worker possono essere usati anche per consumare messaggi pubblicati su una coda: Ad esempio possiamo gestire un evento "Ordine spedito" ed inviare un'email di notifica al cliente. 

#### È un'operazione totalmente asincrona che puó essere fatta offline, al di fuori del contesto web, quindi un candidato perfetto per un Background Worker.

Altra cosa che potremmo fare è gestire l'evento "Post creato" ed aggiornare i dati denormalizzati nel db delle query, ottenendo cosí <a rel="noreferrer noopener" aria-label="un'architettura CQRS (opens in a new tab)" href="https://martinfowler.com/bliki/CQRS.html" target="_blank">un'architettura CQRS</a> (magari con <a href="https://martinfowler.com/bliki/PolyglotPersistence.html" target="_blank" rel="noreferrer noopener" aria-label="persistenza poliglotta (opens in a new tab)">persistenza poliglotta</a>).

E per oggi è tutto. La prossima volta le cose si faranno piú interessanti perché andremo ad analizzare un po' di codice.

<div class="post-details-footer-widgets">
</div>