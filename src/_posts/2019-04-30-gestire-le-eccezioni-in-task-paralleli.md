---
description: >
  Tempo fa ho scritto un post su come eseguire Task in parallelo o in seriale. Questa volta invece parleremo di come gestire correttamente le eccezioni in Task paralleli.
id: 6681
title: Gestire le eccezioni in Task paralleli
date: 2019-04-30T12:54:04-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6681
permalink: /it/gestire-le-eccezioni-in-task-paralleli/
switch_like_status:
  - "1"
image: /assets/uploads/2019/02/parallel_processing_lego_assembly_2_600x400.jpg
categories:
  - .NET
  - ASP.NET
  - Programming
tags:
  - .NET Core
  - programming
language: ita
---
Tempo fa ho <a href="https://www.davidguida.net/serial-vs-parallel-task-execution/" target="_blank" rel="noreferrer noopener" aria-label="scritto un post (opens in a new tab)">scritto un post</a> su come eseguire Task in parallelo o in seriale. Questa volta invece parleremo di come gestire correttamente le eccezioni in Task paralleli.

Supponiamo di dover effettuare delle chiamate ad alcuni microservizi. Magari la nostra applicazione è un <a rel="noreferrer noopener" aria-label="API Gateway (opens in a new tab)" href="https://www.davidguida.net/come-gestire-autenticazione-ed-autorizzazione-nei-microservizi-parte-1/" target="_blank">API Gateway</a> e dobbiamo aggregare i dati.

Supponiamo che le chiamate siano indipendenti fra di loro e possano quindi essere eseguite in parallelo. Come lo sviluppiamo? Molto semplicemente possiamo usare **Task.WaitAll()** oppure, ancora meglio, **Task.WhenAll()**. Qualcosa del genere:

#### **Task.WhenAll()** restituisce un Task quindi possiamo usare il costrutto async/await evitando cosi' di bloccare il thread corrente.

Perfetto, ora supponiamo peró che qualcuna delle chiamate fallisca e lanci un'eccezione. Come possiamo gestire gli errori evitando di perdere informazioni preziose? Un blocco try/catch è sicuramente un buon inizio:

Questo funziona bene finché abbiamo una sola eccezione. Se piú chiamate falliscono **Task.WhenAll()** ci rilancerá purtoppo soltanto la prima. Questa e' una delle differenze principali rispetto a **Task.WaitAll()** : quest'ultimo infatti raggruppa tutte le eccezioni e le rilancia all'interno di una **AggregateException** .

Quindi cosa possiamo fare? Passare a Task.WaitAll()? No, c'e' una soluzione migliore.

Il trucco praticamente sta nel non usare await direttamente su Task.WhenAll(), bensí salvarne il risultato in una variabile. All'interno del blocco try/catch possiamo poi accedere alla property task.Exception, che sará di tipo AggregateException. A questo punto poi possiamo fare quello che vogliamo accedendo alla collezione InnerExceptions:

Come al solito ho pubblicato su Github <a rel="noreferrer noopener" aria-label="un piccolo repository (opens in a new tab)" href="https://github.com/mizrael/parallel-tasks-exceptions" target="_blank">un piccolo repository</a>. All'interno troverete una console application in dotNet Core con vari esempi su come gestire le eccezioni dei in parallelo.

<div class="post-details-footer-widgets">
</div>