---
description: >
  Come possiamo migliorare l'affidabilitá nella comunicazione fra microservizi? Scopriamo come usare il Two-Phase-Commit in questo primo articolo della serie!
id: 6963
title: 'Migliorare l&#8217;affidabilità dei microservizi &#8211; parte 1: Two Phase Commit'
date: 2020-01-06T04:00:00-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6963
permalink: /it/migliorare-laffidabilita-dei-microservizi-parte-1-two-phase-commit/
ngg_post_thumbnail:
  - "0"
spay_email:
  - ""
image: /assets/uploads/2020/01/microservices-graph-1.png
categories:
  - Design Patterns
  - Microservices
  - Programming
  - Software Architecture
language: ita
---
Ciao a tutti! Oggi parleremo un po&#8217; di come possiamo fare per migliorare l&#8217;affidabilità della comunicazione fra microservizi. Questo è il primo articolo della serie e ci focalizzeremo sulla tecnica del Two-Phase-Commit.

È passato un po&#8217; dal <a rel="noreferrer noopener" aria-label="mio ultimo articolo (opens in a new tab)" href="https://www.davidguida.net/it/il-re-e-morto-lunga-vita-al-re/" target="_blank">mio ultimo articolo</a>, questo è il primo che scrivo da quando mi sono trasferito a Montreal per lavorare con una software house del posto, <a href="https://www.fiska.com" target="_blank" rel="noreferrer noopener" aria-label="Fiska (opens in a new tab)">Fiska</a>.

Supponiamo di star sviluppando un&#8217;applicazione a microservizi e di doverli far comunicare in qualche modo. Un servizio isolato non è particolarmente utile, bisogna quasi sempre condividere dei dati con il resto del sistema. Magari stiamo lavorando al prossimo Amazon o Netflix, chi lo sa!<figure class="wp-block-image size-large">

[<img loading="lazy" width="1200" height="628" src="/assets/uploads/2020/01/amazon-netflix-microservices.png?fit=788%2C412&ssl=1" alt="" class="wp-image-6998" srcset="/assets/uploads/2020/01/amazon-netflix-microservices.png?w=1200&ssl=1 1200w, /assets/uploads/2020/01/amazon-netflix-microservices.png?resize=300%2C157&ssl=1 300w, /assets/uploads/2020/01/amazon-netflix-microservices.png?resize=1024%2C536&ssl=1 1024w, /assets/uploads/2020/01/amazon-netflix-microservices.png?resize=768%2C402&ssl=1 768w, /assets/uploads/2020/01/amazon-netflix-microservices.png?resize=788%2C412&ssl=1 788w" sizes="(max-width: 788px) 100vw, 788px" />](/assets/uploads/2020/01/amazon-netflix-microservices.png?ssl=1)<figcaption>giusto un paio di microservizi.</figcaption></figure> 

Cerchiamo di fare un esempio semplice. Immaginiamo il caso di un ordine piazzato su un ecommerce. Il microservizio degli Ordini riceve la richiesta, salva i dati nel suo persistence layer e successivamente ha bisogno di informare tutti gli altri servizi interessati. Ad esempio un microservizio per le Notifiche che deve inviare email al cliente e agli amministratori.

#### Ovviamente non vogliamo che le email vengano inviate se incappiamo in qualche errore durante il salvataggio dell&#8217;ordine.

Un approccio possibile è il famoso <a rel="noreferrer noopener" href="https://en.wikipedia.org/wiki/Two-phase_commit_protocol" target="_blank"><strong>Two-Phase-Commit</strong></a> (detto anche **2PC**):<figure class="wp-block-image size-large">

<a href="https://www.davidguida.net/it/migliorare-laffidabilita-dei-microservizi-parte-1-two-phase-commit/2-phase-commit/" target="_blank" rel="noreferrer noopener"><img loading="lazy" width="1955" height="658" src="/assets/uploads/2020/01/2-phase-commit.jpg?fit=788%2C265&ssl=1" alt="" class="wp-image-7002" srcset="/assets/uploads/2020/01/2-phase-commit.jpg?w=1955&ssl=1 1955w, /assets/uploads/2020/01/2-phase-commit.jpg?resize=300%2C101&ssl=1 300w, /assets/uploads/2020/01/2-phase-commit.jpg?resize=1024%2C345&ssl=1 1024w, /assets/uploads/2020/01/2-phase-commit.jpg?resize=768%2C258&ssl=1 768w, /assets/uploads/2020/01/2-phase-commit.jpg?resize=1536%2C517&ssl=1 1536w, /assets/uploads/2020/01/2-phase-commit.jpg?resize=788%2C265&ssl=1 788w" sizes="(max-width: 788px) 100vw, 788px" /></a><figcaption>2 Phase Commit</figcaption></figure> 

Come potete facilmente immaginare si tratta di un processo a 2 step:

  1. Un servizio Coordinatore chiede a tutti i partecipanti se sono pronti ad effettuare il commit della transazione. Questi possono rispondere si o no. Nel caso anche un solo servizio risponda no (oppure avviene un timeout o qualunque altro errore), l&#8217;intera transazione viene automaticamente annullata.
  2. Se tutti i partecipanti rispondono si, il Coordinatore invia a tutti il comando di Commit e si mette in attesa per la conferma.

È un meccanismo perfettamente oliato e funzionante, anche se non esente da difetti. Prima di tutto c&#8217;è un costo intrinseco di performance da pagare in quanto mettiamo tutti gli attori in attesa diverse volte.

#### Oltretutto, se il Coordinatore fallisce per qualunque motivo all&#8217;inizio della Fase 2, tutti gli altri servizi restano bloccati in una sorta di limbo.

Non fraintendetemi, 2PC è un buon approccio ma come tutti gli altri attrezzi a nostra disposizione è molto importante sapere quando e come sfruttarlo. Per esempio è particolarmente utile quando bisogna replicare dati fra nodi di un cluster di database.

Tornando al nostro ecommerce, <a href="https://www.davidguida.net/it/migliorare-laffidabilita-dei-microservizi-parte-2-outbox-pattern/" target="_blank" rel="noreferrer noopener" aria-label="nel prossimo articolo (opens in a new tab)">nel prossimo articolo</a> vedremo come possiamo invece usare il design pattern Outbox per inviare in maniera sicura un messaggio fra microservizi quando viene piazzato un ordine.

Au-revoir!

<div class="post-details-footer-widgets">
</div>