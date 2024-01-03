---
description: >
  Come si possono gestire Autenticazione ed Autorizzazione in un'applicazione a microservizi? Scopriamolo insieme.
id: 6653
title: 'Come gestire autenticazione ed autorizzazione nei microservizi - Parte 1'
date: 2019-04-23T10:32:27-04:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6653
permalink: /it/come-gestire-autenticazione-ed-autorizzazione-nei-microservizi-parte-1/
image: /assets/uploads/2019/04/door_lock.jpg
categories:
  - Design Patterns
  - Microservices
  - Programming
  - Software Architecture
tags:
  - microservices
  - software architecture
language: ita
---
Nelle ultime settimane in ufficio mi sto occupando di una parte abbastanza delicata del sistema: gestire autenticazione ed autorizzazione in alcuni dei microservizi che compongono l'applicazione.

Per quelli che non lo sanno, io lavoro per <a rel="noreferrer noopener" aria-label="un'azienda abbastanza nota  (opens in a new tab)" href="https://www.dell.com" target="_blank">un'azienda abbastanza nota </a>nel settore IT, mi occupo dello sviluppo del tool di vendite interno. Per dirla in soldoni si tratta di un enorme, mastodontico e-commerce basato su microservizi. Ma ovviamente c'è molto di piú.

Ma torniamo al punto. Come stavo dicendo prima, mi é stato assegnato il compito di aggiungere Autenticazione ed Autorizzazione ad alcuni microservizi. Ovviamente il sistema aveva giá un modo per identificare l'utente. E si, ovviamente a noi interessa molto che gli utenti abbiano i giusti profili/permessi. 

Ma ancora piú ovviamente il nostro è un sistema in continua evoluzione e ci viene richiesto di aggiungere ogni giorno nuove funzionalitá. Un bel giorno abbiamo avuto dagli Architect anche questa nuova richiesta ed eccoci qui.

#### In questo post non scenderó nel dettaglio dell'implementazione come potete immaginare. Cercheró peró di condividere con voi alcune delle strategie che possono essere applicate per risolvere questo genere di problematiche.

Prima di tutto, per coloro che lo ignorano, l'**Autenticazione** è il processo di identificazione dell'utente corrente. Una volta inserite le credenziali, se corrette, il sistema genererá un qualche tipo di oggetto contenente alcuni dettagli rilevanti (ad es. nome, email e cosí via).<figure class="wp-block-image alignwide">

<a href="https://www.geekyhobbies.com/" target="_blank" rel="noreferrer noopener"><img src="https://i2.wp.com/www.geekyhobbies.com/assets/uploads/2016/02/Guess-Who-5.jpg?w=788&#038;ssl=1" alt="Box for Guess Who, courtesy of geekyhobbies.com" data-recalc-dims="1" /></a></figure> 

**Autorizzazione** invece significa capire **cosa l'utente puó fare** nel sistema. Puó leggere dati? Creare contenuti? Creare altri utenti?

#### Nel mondo dei microservizi l'Autorizzazione puó essere gestita con molta granularitá se i <a href="https://www.martinfowler.com/bliki/BoundedContext.html" target="_blank" rel="noreferrer noopener" aria-label="Bounded Context (opens in a new tab)">Bounded Context</a> sono definiti correttamente.

Ora che abbiamo definito i concetti di base, passiamo al succo della questione. Normalmente, quando si parla di microservizi, uno dei pattern piú comuni è l' <a rel="noreferrer noopener" aria-label="API Gateway (opens in a new tab)" href="https://docs.microsoft.com/en-us/azure/architecture/microservices/design/gateway" target="_blank">API Gateway</a> :<figure class="wp-block-image alignwide">

<img src="/assets/uploads/2019/04/image.png?w=788&#038;ssl=1" alt="API Gateway" data-recalc-dims="1" /> </figure> 

L'idea di base consiste nell'avere un livello intermedio fra il client ed i vari microservizi. Questo Gateway si occuperá di assemblare e preparare i DTO, magari anche in base alla tipologia del client (un dispositivo mobile potrebbe vedere meno informazioni rispetto ad un desktop). Fará logging, gestirá la cache ed anche l' Autenticazione. Ci sono ovviamente molte altre cose che puó fare ma ce ne occuperemo in un altro post.

Quindi, come ci puó aiutare questo Gateway? Per scoprirlo dobbiamo introdurre un altro blocco, l' **Identity Provider** :<figure class="wp-block-image alignwide">

<img src="/assets/uploads/2019/04/image-1.png?w=788&#038;ssl=1" alt="API Gateway and Identity Provider" data-recalc-dims="1" /> </figure> 

Questo è il flusso: alla prima richiesta dal client, il Gateway contatterá l' Identity Provider, possibilmente rimandando l'utente ad una specie di "safe zone". Una volta inserite le credenziali, si ritorna all'applicazione, questa volta con un token contenente i dettagli dell'utente.

Ci sono diverse tipologie di token che possiamo sfruttare, ultimamente sono molto in voga i [JWT](https://jwt.io/introduction/) . Dai doc ufficiali:

<blockquote class="wp-block-quote">
  <p>
    JSON Web Token (JWT) is an open standard (<a href="https://tools.ietf.org/html/rfc7519">RFC 7519</a>) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.&nbsp;
  </p>
</blockquote>

In pratica un JWT consente di trasferire informazioni tra le parti utilizzando un oggetto JSON. Le informazioni sono accompagnate da una firma digitale quindi possono essere verificate ed utilizzate in sicurezza.

Ora che abbiamo autenticato il nostro utente nel Gateway abbiamo bisogno di gestire le sue autorizzazioni. Vedremo come nel prossimo post!

<div class="post-details-footer-widgets">
</div>