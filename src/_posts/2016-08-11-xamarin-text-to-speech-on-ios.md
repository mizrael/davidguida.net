---
id: 6154
title: 'Xamarin: Text-to-Speech on iOS'
date: 2016-08-11T14:37:13-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6154
permalink: /xamarin-text-to-speech-on-ios/
dsq_thread_id:
  - "5140050155"
image: /assets/uploads/2016/08/Xamarin_logo_and_wordmark.png
categories:
  - .NET
  - iOS
  - Programming
  - Xamarin
---
hi All!

Almost a month has passed since the last time I wrote a post. Many things are happening in my life and unfortunately I can't study anymore all the time I was used to.

Luckly the last few days I had the chance to install <a href="https://www.xamarin.com/studio" target="_blank">Xamarin Studio</a> on my Macbook Pro and play a little bit. What a relief!

I spent a while trying to understand the interface (sorry but I'm used to Visual Studio, my bad) then I started thinking what could have been a nice thing to prototype. At the end I decided to start with text-to-speech. Why? Because I love the way my dog moves her head when I have my Mac calling her name 😀

I uploaded a <a href="https://github.com/mizrael/Xamarin.TextToSpeech.iOS" target="_blank">sample on GitHub</a>, as you can see the UI is pretty simple, just type the text and press "play":

[<img loading="lazy" class="size-medium wp-image-6159 aligncenter" src="/assets/uploads/2016/08/text_to_speech_screenshot-169x300.png?resize=169%2C300" alt="text_to_speech_screenshot" width="169" height="300" srcset="/assets/uploads/2016/08/text_to_speech_screenshot.png?resize=169%2C300&ssl=1 169w, /assets/uploads/2016/08/text_to_speech_screenshot.png?w=375&ssl=1 375w" sizes="(max-width: 169px) 100vw, 169px" data-recalc-dims="1" />](/assets/uploads/2016/08/text_to_speech_screenshot.png)

The core of the sample is in the <a href="https://github.com/mizrael/Xamarin.TextToSpeech.iOS/blob/master/TextToSpeech.iOS/TextToSpeech.cs" target="_blank">TextToSpeech class</a> which makes use an instance of  <a href="https://developer.apple.com/library/ios/documentation/AVFoundation/Reference/AVSpeechSynthesizer_Ref/" target="_blank">AVSpeechSynthesizer</a> , not exactly rocket science.

I am planning to add some customisation, like the ability to change pitch/tone and culture, so stay tuned 🙂

<div class="post-details-footer-widgets">
</div>