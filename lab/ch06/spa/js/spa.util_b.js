/*
 * spa.util_b.js
 * JavaScript browser utilities
 */

/*jslint            browser : true,   continue  : true,
  devel   : true,   indent  : 2,      maxerr    : 50,
  newcap  : true,   nomen   : true,   plusplus  : true,
  regexp  : true,   sloppy  : true,   vars      : false,
  white   : true
*/

/*global $, spa, getComputedStyle */

spa.util_b = (function() {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIBLES ----------------
  var
    configMap = {
      regex_encode_html: /[&"'><]/g,
      regex_encode_noamp: /["'><]/g,
      html_encode_map: {
        '&': '&#38;',
        '"': '&#34;',
        "'": '&#39;',
        '>': '&#62;',
        '<': '&#60;'
      }
    },
    decodeHtml,
    encodeHtml,
    getEmSize;

    configMap.noamp_encode_map = $.extend(
      {}, 
      configMap.html_encode_map
    );
    delete configMap.noamp_encode_map['&'];  
  //---------------- END MODULE SCOPE VARIBLES ------------------

  //---------------- BEGIN PUBLIC METHODS -----------------------
  // Begin decodeHtml
  // Decodes HTML entities in a browser-friendly way
  // See http://stackoverflow.com/questions/1912501/\
  //   unescape-html-entities-in-javascript
  //
  decodeHtml = function(str) {
    return $('<div/>').html(str || '').text();
  };
  // End decodeHtml

  // Begin encodeHtml
  // This is a single pass encoder for html entities and handles
  // an arbitrary number of characters
  //
  encodeHtml = function(input_arg_str, exclude_amp) {
    var
      input_str = String(input_arg_str),
      regex,
      lookup_map;

    if (exclude_amp)
    {
      regex = configMap.regex_encode_noamp;
      lookup_map = configMap.noamp_encode_map;
    }
    else
    {
      regex = configMap.regex_encode_html;
      lookup_map = configMap.html_encode_map;
    }

    return input_str.replace(
      regex,
      function(match, name) {
        return lookup_map[match] || '';
      }
    );
  };
  // End encodeHtml

  // Begin getEmSize
  // returns size of ems in pixels
  //
  getEmSize = function(elem) {
    return Number(
      getComputedStyle(elem, '').fontSize.match(/\d*\.?\d*/)[0]
    );
  };
  // End getEmSize

  // export methods
  return {
    decodeHtml: decodeHtml,
    encodeHtml: encodeHtml,
    getEmSize: getEmSize
  };
  //---------------- END PUBLIC METHODS -------------------------
} ());
