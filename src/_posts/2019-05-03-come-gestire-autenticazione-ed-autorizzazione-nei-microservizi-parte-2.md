---
description: >
  In questo post vedremo alcuni approcci per gestire correttamente i permessi e le autorizzazioni all'interno dei microservizi.
id: 6688
title: Come gestire autenticazione ed autorizzazione nei microservizi – Parte 2
date: 2019-05-03T10:00:48-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6688
permalink: /it/come-gestire-autenticazione-ed-autorizzazione-nei-microservizi-parte-2/
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
image: /assets/uploads/2019/04/authorization.jpg
categories:
  - Uncategorized
tags:
  - design patterns
  - programming
  - software architecture
language: ita
---
Nel <a href="https://www.davidguida.net/come-gestire-autenticazione-ed-autorizzazione-nei-microservizi-parte-1/" target="_blank" rel="noreferrer noopener" aria-label="post precedente  (opens in a new tab)">post precedente </a>di questa serie abbiamo visto come sfruttare un API Gateway ed un Identity Provider per gestire l'autenticazione. Giusto per rinfrescare i concetti, ecco il diagramma di base:<figure class="wp-block-image alignwide">

<img src="/assets/uploads/2019/04/image-1.png?w=788&#038;ssl=1" alt="" data-recalc-dims="1" /> </figure> 

In pratica il client comunica direttamente con l'API Gateway, il quale a sua volta chiederá all'Identity Provider di fornire i dettagli dell'utente corrente. Per poter completare la richiesta abbiamo bisogno ovviamente che l'utente sia autenticato nel sistema. Il client verrá quindi rimandato ad un'area esterna dove potrá inserire le sue credenziali. Se valide, il Provider genererá un token che verrá usato per **ogni chiamata all'API Gateway.**

Bene, adesso che abbiamo il nostro utente, ci serve un modo per controllare i suoi permessi su ogni microservizio.

Un opzione potrebbe essere usare <a href="https://docs.microsoft.com/en-us/aspnet/core/security/authorization/claims?view=aspnetcore-2.2&WT.mc_id=DOP-MVP-5003878" target="_blank" rel="noreferrer noopener">l'autorizzazione basata sui Claims</a>: praticamente significa salvare tutti i permessi dell'utente per ogni microservizio come claims a bordo del token.

Quando un microserizio riceve una richiesta dovrá decodificare il token, verificarlo e successivamente controllare che siano presenti i giusti claim per l'azione richiesta.

É un meccanismo abbastanza semplice da implementare e funziona anche benino ma significa pure che dobbiamo mandare **un bel po' di dati** avanti e indietro in ogni chiamata alle nostre API. Il token sará praticamente pieno zeppo di informazioni che molto probabilmente non ci serviranno, se non solo per alcune delle chiamate.

I claims dei permessi sono un'informazione utile solo per il microservizio che copre quello specifico Bounded Context. Tutti gli altri riceveranno i dati **ma non ne faranno alcun uso.**

Un'altra opzione quindi é quella di aggiungere un microservizio specifico per l'Autorizzazione, qualcosa del genere:<figure class="wp-block-image alignwide">

<img src="/assets/uploads/2019/04/image-3.png?w=788&#038;ssl=1" alt="" data-recalc-dims="1" /> <figcaption>Authorization Service</figcaption></figure> 

#### Questo nuovo microservizio sará responsabile di tutti i permessi per ogni utente del sistema.

Come in precedenza, quando un microserizio riceve una richiesta dovrá decodificare il token e verificarlo. Poi, se l'azione richiede un'autorizzazione specifica, verrá effettuata una chiamata al nuovo Authorization Service chiedendo appunto se l'utente puó o non puó portare a termine la richiesta.

In questo modo abbiamo separato i compiti, spostando i controlli in uno specifico microservizio che si occuperá quindi **di una sola ed unica cosa**: gestire i permessi utente (e probabilmente anche altre cosette come ruoli/profili e cosí via).  


<div class="post-details-footer-widgets">
</div>