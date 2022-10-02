---
description: >
  Ho iniziato ad usare NDepend, il famoso tool di analisi statica del codice, dopo che il suo creatore Patrick Smacchia, mi ha contattato offrendomi una licenza
id: 6766
title: 'Proviamo un po&#8217; NDepend'
date: 2019-09-12T10:46:48-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6766
permalink: /it/proviamo-un-po-ndepend/
image: /assets/uploads/2019/09/NDepend.png
categories:
  - .NET
  - ASP.NET
  - Programming
language: ita
---
Oggi é successa una cosa che non mi aspettavo. Mi ha contattato <a rel="noreferrer noopener" aria-label="Patrick Smacchia (opens in a new tab)" href="https://www.linkedin.com/in/patrick-smacchia-b0123110/" target="_blank">Patrick Smacchia</a>, il creatore di **<a href="https://www.ndepend.com/" target="_blank" rel="noreferrer noopener" aria-label=" (opens in a new tab)">NDepend</a>**. Mi ha trovato online non so come e mi ha offerto una licensa pro 😀

Non ho mai usato **NDepend** prima d&#8217;ora quindi ovviamente ero molto curioso. A lavoro qui in Dell ovviamente facciamo un uso massiccio dei tool di <a href="https://en.wikipedia.org/wiki/Static_program_analysis" target="_blank" rel="noreferrer noopener" aria-label="analisi statica del codice (opens in a new tab)">analisi statica del codice</a> e in molti casi sono integrati direttamente nelle build pipeline. Qualche volta li eseguiamo anche in locale ma non é una prassi obbligatoria, piú che altro é lasciato al buon cuore dello sviluppatore.

#### In ogni caso, questi tool sono diventati sempre piú avanzati nel corso degli anni ed aggiungono un valore enorme ad ogni progetto. Punto.

Possono facilmente identificare problemi insidiosi che potrebbero anche sfuggire alle suite di test. Oltretutto in molti casi riescono a dare **ottimi suggerimenti per il refactoring**, aiutando cosí a pulire il codice.

Torniamo a **NDepend**. É uno dei tool migliori sul mercato per l&#8217;analisi statica. Date uno sguardo alla <a href="https://www.ndepend.com/features/" target="_blank" rel="noreferrer noopener" aria-label="pagina delle funzionalitá (opens in a new tab)">pagina delle funzionalitá</a> sul sito, la lista é bella lunga.

L&#8217;installazione é stata molto semplice, non ho avuto alcun problema. Basta seguire gli step della pagina <a href="https://www.ndepend.com/docs/getting-started-with-ndepend" target="_blank" rel="noreferrer noopener" aria-label="Getting Started (opens in a new tab)">Getting Started</a> , nulla piú.

Ho installato anche l&#8217;integrazione con VS2019 e poi ho caricato uno dei progetti a cui sto lavorando ultimamente. La soluzione contiene 4 class libraries e i relativi progetti di test. Ho lanciato l&#8217;analisi di **NDepend**, filtrato i test (con il filtro **&#8220;-test&#8221;**) ed atteso qualche secondo.<figure class="wp-block-image">

<img loading="lazy" width="788" height="450" src="/assets/uploads/2019/09/NDepend_analysis_dashboard-1.jpg?resize=788%2C450&#038;ssl=1" alt="NDepend analysis dashboard" class="wp-image-6768" srcset="/assets/uploads/2019/09/NDepend_analysis_dashboard-1.jpg?resize=1024%2C585&ssl=1 1024w, /assets/uploads/2019/09/NDepend_analysis_dashboard-1.jpg?resize=300%2C171&ssl=1 300w, /assets/uploads/2019/09/NDepend_analysis_dashboard-1.jpg?resize=768%2C439&ssl=1 768w, /assets/uploads/2019/09/NDepend_analysis_dashboard-1.jpg?resize=788%2C450&ssl=1 788w, /assets/uploads/2019/09/NDepend_analysis_dashboard-1.jpg?w=1576&ssl=1 1576w" sizes="(max-width: 788px) 100vw, 788px" data-recalc-dims="1" /> </figure> 

Ora, devo ammettere che le dashboard un po&#8217; mi spaventano. Non sono particolarmente bravo a leggere le statistiche e trarne un senso immediatamente. Di norma ho bisogno di un po&#8217; di tempo per prendere confidenza con il formato dei risultati.

In questo caso peró tutto era abbastanza chiaro. Anche i risultati stessi erano buoni, il che mi ha anche messo di buon umore 😀

Per ora sono abbastanza contento di **NDepend**. Dopo meno di 30 minuti stavo giá aggiornando il codice e facendo commit con le modifiche suggeritemi.

Ovviamente ho soltanto &#8220;grattato la superfice&#8221;, ci sono tantissime funzionalitá che devo ancora esplorare. Non ho neppure usato il tool per la Test Coverage.

Penso peró che aggiungeró NDepend alla mia routine giornaliera. Nei prossimi giorni proveró a scrivere qualche altro articolo, giusto il tempo di entrare piú in sintonia 🙂

<div class="post-details-footer-widgets">
</div>