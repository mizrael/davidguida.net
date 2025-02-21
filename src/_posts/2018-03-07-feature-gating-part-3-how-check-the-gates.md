---
id: 6447
title: 'Feature Gating part 3 : how can we check the gates?'
date: 2018-03-07T09:30:41-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=6447
permalink: /feature-gating-part-3-how-check-the-gates/
image: /assets/uploads/2018/02/feature_gating-e1519643864384.jpg
categories:
  - Programming
  - Software Architecture
  - Typescript
---
In this article we&#8217;ll explore few ways to check if the feature gates are **opened or not**. This is the third episode of our series about **Feature Gating**, <a href="https://www.davidguida.net/feature-gating-part-2-how-can-we-store-the-flags/" target="_blank" rel="noopener">last time</a> we discussed about the optimal persistence method for the flags.

The first approach is a&nbsp;**static config object** injected as <a href="https://en.wikipedia.org/wiki/Dependency_injection" target="_blank" rel="noopener">dependency</a> in the class cTor:

```
interface IFoo{
   bar():void;
}

interface FlagsConfig{
  featureX:boolean;
}

export class Foo implements IFoo{
   constructor(private readonly flagsConfig:FlagsConfig){}

   public bar(){
       if(this.flagsConfig.featureX){
           /*.......*/
       }else{
           /*.......*/
       }
   }
};
```

It&#8217;s simple, easy to implement and does the job. The configuration object can be instantiated in the&nbsp;**composition root** reading data&nbsp;from whatever is your <a href="https://www.davidguida.net/feature-gating-part-2-how-can-we-store-the-flags/" target="_blank" rel="noopener">persistence layer</a>&nbsp;&nbsp;and you&#8217;re done.

Drawbacks? It&#8217; **static**. That means you cannot vary your flags based on custom conditions (eg. logged user, time, geolocation).

So what can we do? Something like this:

```
interface IFeatureService{
   isEnabled(featureName:string):boolean;
}

export class Foo implements IFoo{
   constructor(private readonly featureService:IFeatureService){}

   public bar(){
       if(this.featureService.isEnabled("feature-x")){
           /*.......*/
       }else{
           /*.......*/
       }
   }
};
```

Replacing the configuration object with a **specific service&nbsp;**will do the job. This is probably the most common situation and personally I&#8217;m quite a fan. The only drawback is the infamous&nbsp;**tech debt**: very soon the code will be filled with if/else statements. Should we leave them? Remove them? If yes, when? We will discuss in another article a simple strategy for that.

Speaking about **strategy**, it&#8217;s a <a href="https://en.wikipedia.org/wiki/Strategy_pattern" target="_blank" rel="noopener">very interesting pattern</a> that we can exploit:

```
export class Foo implements IFoo{
   constructor(private readonly barStrategy:()=>void){}
   public bar(){
       this.barStrategy();
   }
};

// composition root
const featureService:IFeatureService = new FeatureService(),
   strategy1 = ():void =>{ /*...strategy 1...*/ },
   strategy2 = ():void =>{ /*...strategy 2...*/ },
   barStrategy:()=>void = featureService.isEnabled("feature-x") ? strategy1 : strategy2,
   foo:IFoo = new Foo(barStrategy);

```

The idea is to encapsulate the new and the old logic in two classes (lines 10 and 11) and generate a third one which will use `featureService` to pick the right instance. 

Finally all you have to do is to inject that class in the consumer and you&#8217;re done.&nbsp;&nbsp;

Next time: this is nice, but is really useful? What do we&nbsp;**really** get using Feature Gating?