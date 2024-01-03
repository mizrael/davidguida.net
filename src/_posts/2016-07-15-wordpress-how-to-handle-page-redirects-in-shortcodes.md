---
id: 6149
title: 'WordPress: how to handle page redirects in shortcodes'
date: 2016-07-15T18:05:03-04:00
author: David Guida
layout: post
guid: http://www.davidguida.net/?p=6149
permalink: /wordpress-how-to-handle-page-redirects-in-shortcodes/
dsq_thread_id:
  - "5980176011"
image: /assets/uploads/2016/07/wordpress.jpg
categories:
  - Programming
  - Wordpress
---
This is just a quick tip, something that I faced a while ago while working on a client&#8217;s website.  
I had to develop a shortcode responsible to render a form and obviously after the submission I wanted to redirect the user to another url (following the <a href="https://en.wikipedia.org/wiki/Post/Redirect/Get" target="_blank">POST/redirect/GET pattern</a>).

It may seem easy but using something like wp_redirect directly in the shortcode rendering block may cause errors like this:

<pre>Warning: Cannot modify header information - headers already sent by ...</pre>

One possible (and very easy) solution is to register a function for the <a href="https://codex.wordpress.org/Plugin_API/Action_Reference/template_redirect" target="_blank">template_redirect</a> hook and handle everything there. Something like this:

<div style="tab-size: 8" id="gist37836847" class="gist">
  <div class="gist-file">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container file-box">
        <div id="file-wp_shortcode_redirect-php" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-php  ">
            <table class="highlight tab-size js-file-line-container" data-tab-size="8" data-paste-markdown-skip>
              <tr>
                <td id="file-wp_shortcode_redirect-php-L1" class="blob-num js-line-number" data-line-number="1">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC1" class="blob-code blob-code-inner js-file-line">
                  class my_shortcode{
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L2" class="blob-num js-line-number" data-line-number="2">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC2" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L3" class="blob-num js-line-number" data-line-number="3">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC3" class="blob-code blob-code-inner js-file-line">
                  public function __construct()
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L4" class="blob-num js-line-number" data-line-number="4">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC4" class="blob-code blob-code-inner js-file-line">
                  {
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L5" class="blob-num js-line-number" data-line-number="5">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC5" class="blob-code blob-code-inner js-file-line">
                  add_shortcode('my_shortcode', array($this, 'render_form'));
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L6" class="blob-num js-line-number" data-line-number="6">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC6" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L7" class="blob-num js-line-number" data-line-number="7">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC7" class="blob-code blob-code-inner js-file-line">
                  add_action( 'template_redirect', array($this, 'handle_form_post') );
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L8" class="blob-num js-line-number" data-line-number="8">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC8" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L9" class="blob-num js-line-number" data-line-number="9">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC9" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L10" class="blob-num js-line-number" data-line-number="10">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC10" class="blob-code blob-code-inner js-file-line">
                  function render_form(){
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L11" class="blob-num js-line-number" data-line-number="11">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC11" class="blob-code blob-code-inner js-file-line">
                  // guess what goes there 😀
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L12" class="blob-num js-line-number" data-line-number="12">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC12" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L13" class="blob-num js-line-number" data-line-number="13">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC13" class="blob-code blob-code-inner js-file-line">
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L14" class="blob-num js-line-number" data-line-number="14">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC14" class="blob-code blob-code-inner js-file-line">
                  function handle_form_post(){
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L15" class="blob-num js-line-number" data-line-number="15">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC15" class="blob-code blob-code-inner js-file-line">
                  if ( isset( $_POST[''my_shortcode_form_name'] ) ) {
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L16" class="blob-num js-line-number" data-line-number="16">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC16" class="blob-code blob-code-inner js-file-line">
                  $dest_url = 'set your url';
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L17" class="blob-num js-line-number" data-line-number="17">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC17" class="blob-code blob-code-inner js-file-line">
                  wp_redirect($dest_url);
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L18" class="blob-num js-line-number" data-line-number="18">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC18" class="blob-code blob-code-inner js-file-line">
                  exit;
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L19" class="blob-num js-line-number" data-line-number="19">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC19" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L20" class="blob-num js-line-number" data-line-number="20">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC20" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
              
              <tr>
                <td id="file-wp_shortcode_redirect-php-L21" class="blob-num js-line-number" data-line-number="21">
                </td>
                
                <td id="file-wp_shortcode_redirect-php-LC21" class="blob-code blob-code-inner js-file-line">
                  }
                </td>
              </tr>
            </table>
          </div></p>
        </div>
      </div>
    </div>
    
    <div class="gist-meta">
      <a href="https://gist.github.com/mizrael/68368f510b82722d8028ee3efd01d67d/raw/ac5551848a3c2e1b558151c119769e36c80e0a84/wp_shortcode_redirect.php" style="float:right">view raw</a><br /> <a href="https://gist.github.com/mizrael/68368f510b82722d8028ee3efd01d67d#file-wp_shortcode_redirect-php">wp_shortcode_redirect.php</a><br /> hosted with &#10084; by <a href="https://github.com">GitHub</a>
    </div></p>
  </div>
</div>

of course don&#8217;t forget to create an instance of the class!

<div class="post-details-footer-widgets">
</div>