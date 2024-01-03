---
description: >
  The Outbox Pattern helps us dealing with distributed transactions and event dispatching. Let's see how it works
id: 6983
title: 'Migliorare l’affidabilità dei microservizi – parte 2: Outbox Pattern'
date: 2020-01-13T03:30:00-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6983
permalink: /it/migliorare-laffidabilita-dei-microservizi-parte-2-outbox-pattern/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
categories:
  - .NET
  - Design Patterns
  - Microservices
  - Programming
  - RabbitMQ
  - Software Architecture
tags:
  - nservicebus
  - rabbitmq
language: ita
---
Ed eccoci qui alla seconda parte della Serie. Oggi parleremo dell'Outbox Pattern.

Giusto per rinfrescare un po' la memoria, <a rel="noreferrer noopener" aria-label="l'ultima volta (opens in a new tab)" href="https://www.davidguida.net/it/migliorare-laffidabilita-dei-microservizi-parte-1-two-phase-commit/" target="_blank">l'ultima volta</a> abbiamo discusso di come la tecnica del **2-Phase-Commit** ci possa aiutare con le transazioni distribuite. Tuttavia può anche portare a degli "effetti collaterali indesiderati" tipo problemi di performance.

Quindi che altro approccio possiamo considerare? Personalmente sono un grande fan del salvare i dati quanto più possibile, che sia l'intera Domain Entity o uno stream di Eventi.

Ed eccoci qui all'**Outbox Pattern**!

Torniamo al nostro esempio dell'eCommerce. Abbiamo bisogno di salvare un ordine e quasi contemporaneamente inviare un' email al cliente. Dico "quasi" perché non ci interessa eseguire queste operazioni allo stesso tempo. Oltretutto ci potrebbero anche essere altre azioni da fare ma limitiamoci ad una per il momento.

#### Il problema è che siccome <a href="https://martinfowler.com/articles/microservices.html" target="_blank" rel="noreferrer noopener" aria-label="per definizione (opens in a new tab)">per definizione</a> ogni microservizio ha il suo sistema di persistenza, è quasi impossibile gestire una transazione distribuita che copra tutti i servizi coinvolti. 

L'Ordine potrebbe essere salvato ma i messaggi potrebbero non partire a causa di un problema sulla rete. Oppure potremmo avere i messaggi ma non l'Ordine nel db perchè non c'è più spazio sul disco.

Quindi come agiamo?

Col 2PC usiamo un Coordinatore ed un bel po' di messaggi per assicurarci che il flusso sia gestito correttamente.

Con l'**Outbox Pattern** invece abbiamo vita un po' più semplice:

  1. Il microservizio degli Ordini riceve la richiesta per il salvataggio di un nuovo Ordine
  2. apre una transazione **locale**
      * salva l'Ordine
      * crea un evento "ordine salvato", lo serializza e lo accoda ad una tabella generica Outbox (o collezione o qualunque cosa voi stiate usando, non fa differenza)
  3. infine effettua il commit della transazione locale

A questo punto abbiamo fatto in modo che lo stato **locale** sia persistito cosí ogni lettura successiva dovrebbe essere in grado di restituire dati freschi (assumendo che la cache non si metta di traverso).

Adesso tutto quello che dobbiamo fare è informare i subscribers e possiamo farlo usando un "offline worker": ad intervalli regolari leggeremo un batch di messaggi dalla Outbox e li pubblicheremo su una coda, tipo RabbitMQ o Kafka.

Questo pattern garantisce che ogni messaggio venga processato **almeno una volta.** Cosa significa? Che la consegna dei messaggi è garantita ma potrebbe avvenire anche più di una volta. Di conseguenza dobbiamo essere estremamente attenti a far si che i messaggi siano "<a rel="noreferrer noopener" aria-label="idempotenti (opens in a new tab)" href="https://www.enterpriseintegrationpatterns.com/patterns/messaging/IdempotentReceiver.html" target="_blank">idempotenti</a>". 

Siccome non vogliamo ovviamente reinventare la ruota, un'opzione è quella di usare una libreria di terze parti tipo <a href="https://docs.particular.net/nservicebus/outbox/" target="_blank" rel="noreferrer noopener" aria-label="NServiceBus (opens in a new tab)">NServiceBus</a>, che può aiutarci a gestire Saga e scenari complessi nascondendo tutto il "<a rel="noreferrer noopener" aria-label="boilerplate code (opens in a new tab)" href="https://en.wikipedia.org/wiki/Boilerplate_code" target="_blank">boilerplate code</a>".

È tutto per oggi. La prossima volta vedremo il pattern in azione in una piccola applicazione .NET Core.

<div class="post-details-footer-widgets">
</div>