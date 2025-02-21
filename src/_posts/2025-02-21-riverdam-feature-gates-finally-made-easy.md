---
description: >
  Ever wished for a simpler way to manage feature gates? Your wish is now a reality with Riverdam!
id: 8046
title: 'Riverdam - Feature Gates Finally Made Easy'
date: 2025-02-21T00:57:23-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8046
permalink: /riverdam-feature-gates-finally-made-easy
image: /assets/uploads/2025/02/riverdam-feature-gates-finally-made-easy.jpg
categories:  
  - Product
  - Rambling
  - Design Patterns
---

First post of the year! This one will be brief. I've always liked the idea of Feature Gates. Not only because it reminds me of the [best videogame ever made](https://en.wikipedia.org/wiki/Baldur%27s_Gate_II:_Shadows_of_Amn), but also for the confidence they provide when rolling out new functionalities. I tend to [code defensivelydefensively](https://en.wikipedia.org/wiki/Defensive_programming) most of the time, trying to use TDD as much as possible (when it makes sense, of course).

[A long time ago](/feature-gating-part-1-what-is-it/), I wrote about the general idea behind Feature Gating and how it helps lessen the pain of releasing software.

This time, however, I want to make a small announcement: I have been working on another pet project for a while, and I have finally reached the first milestone.

### Enter **[Riverdam](https://www.riverdam.dev)** !

I love simplicity and no-fuss applications. This is why I decided to create *my own*  feature gating API and release it online.

**Riverdam** is essentially Feature Gating-As-A-Service (FGAAS? Maybe, who knows). It features a user-friendly dashboard that allows you to configure your projects and their flags for each environment, along with a super simple API to query the status.

I also added a system that lets you define custom rules for each feature and have them evaluated on the fly. For example, you can ask, "Is feature XXX enabled on DEV for the logged user?"

I am well aware that there are many commercial and non-commercial tools that offer similar functionality. However, I wanted to create something from scratch and release it publicly.

The best part? It's totally free! Well, with some limitations for now, but it should be enough to give you a sense of what the platform does.

Give it a try and let me know what you think!