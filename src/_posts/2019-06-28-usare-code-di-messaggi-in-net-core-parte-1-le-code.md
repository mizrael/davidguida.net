---
description: >
  In questa serie di articoli parlerem un po' di come usare le code di messaggi con RabbitMQ e come integrarle in una WebAPI in dotnet core usando un Background Worker.
id: 6719
title: 'Usare code di messaggi in .net core &#8211; parte 1: le code'
date: 2019-06-28T14:30:22-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6719
permalink: /it/usare-code-di-messaggi-in-net-core-parte-1-le-code/
image: /assets/uploads/2019/06/ducks_queue.jpg
categories:
  - Programming
  - RabbitMQ
language: ita
---
In questa serie di articoli parlerem un po&#8217; di come usare le code di messaggi con <a href="https://www.rabbitmq.com/" target="_blank" rel="noreferrer noopener" aria-label="RabbitMQ  (opens in a new tab)">RabbitMQ </a>e come integrarle in una WebAPI in dotnet core usando un Background Worker.

Alle volte mi risulta difficile trovare un titolo decente. In questo caso ho dovuto fare un passo indietro e prendere un po&#8217; di tempo per decidere. Avevo un&#8217;idea quasi-chiara di cosa parlare in questa serie ma scegliere il titolo é tutt&#8217;altra cosa.

Oggi quindi parleremo di code di messaggi e background workers. Perché dovrei usare una coda di messaggi? Cos&#8217;é un background worker? Ma soprattutto perché mai dovrei usarli insieme? Portate un po&#8217; di pazienza e parleremo di tutto.

#### Iniziamo con le code di messaggi.

Supponiamo di avere un&#8217;operazione che non richiede intervento manuale. Eventualmente ci potrebbe essere la necessitá di orchestrare piú servizi ed il tutto potrebbe richiedere del tempo. L&#8217;esempio classico che si trova online é la conferma di un ordine su un e-commerce.

Normalmente i passaggi sono qualcosa del tipo:

  1. creare l&#8217;Ordine ed impostarlo su &#8220;pending&#8221;
  2. controllare l&#8217;inventario e bloccare i prodotti
  3. controllare il credito del cliente
  4. trasferire i soldi
  5. aggiornare lo stato dell&#8217;Ordine a &#8220;shipping&#8221;
  6. gestire la spedizione
  7. aggiornare lo stato dell&#8217;Ordine a &#8220;fulfilled&#8221;

Ovviamente la lista puó variare in base ai requisiti di business. E non ho incluso alcuna forma di notifica al cliente o agli amministratori. Ma penso abbiate capito il punto: **queste cose sono complesse** ed hanno bisogno di un&#8217;attenta pianificazione.

Oltretutto perché mai dovremmo tenere l&#8217;utente bloccato davanti il monitor ad aspettare l&#8217;esito dell&#8217;operazione? Questo flusso puó essere tranquillamente gestito offline, in maniera asincrona. Non c&#8217;é bisogno di bloccare il cliente in attesa di una notifica (e potenzialmente di un&#8217;email).

Ed ecco che arrivano le code di messaggi: una logica complessa puó essere gestita in un processo separato, compresa l&#8217;orchestrazione di piú servizi, ciascuno a loro volta responsabile di un diverso <a rel="noreferrer noopener" aria-label="bounded context (opens in a new tab)" href="https://www.davidguida.net/the-importance-of-setting-the-boundaries-of-your-domain-models/" target="_blank">bounded context</a>.

Le code di messaggi consentono a diverse parti del sistema di comunicare in maniera asincrona e di gestire in totale indipendenza le loro operazioni. In questo modo é possibile dividere il flusso ottenendo un&#8217;incredibile scalabilitá.

I messaggi vengono salvati all&#8217;interno della coda finché non vengono elaborati e cancellati. Ogni messaggio viene ricevuto una sola volta da un singolo client. In alternativa si puó configurare il sistema per inviare i messaggi a tutti i client connessi. Pensate ad esempio ad un sistema di Chat: qualcuno manda una foto di un gattino ad un gruppo e tutti gli utenti la ricevono (magari quasi in contemporanea, si spera).

Con le code di messaggi possiamo gestire facilmente picchi di traffico aggiungendo altri nodi consumer e processando i messaggi in <a href="https://www.davidguida.net/serial-vs-parallel-task-execution/" target="_blank" rel="noreferrer noopener" aria-label="parallelo (opens in a new tab)">parallelo</a>, scalando cosí in maniera orizzontale. Le cose potrebbero essere un pó diverse nel caso in cui siate interessati all&#8217;**ordine** dei messaggi. Ma questa é un&#8217;argomento che tratteremo in un altro articolo.

See you next time!

<div class="post-details-footer-widgets">
</div>