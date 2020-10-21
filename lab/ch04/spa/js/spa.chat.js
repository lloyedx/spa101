/*
 * spa.chat.js
 * Chat feature module for SPA
 */

/*jslint            browser : true,   continue  : true,
  devel   : true,   indent  : 2,      maxerr    : 50,
  newcap  : true,   nomen   : true,   plusplus  : true,
  regexp  : true,   sloppy  : true,   vars      : false,
  white   : true
*/

/*global $, spa */

spa.chat = (function() {

  //---------------- BEGIN MODULE SCOPE VARIABLES ----------------
  var
    configMap = {
      main_html : String()
        + '<div style="padding:1em; color:#fff;">'
        +   'Say hello to chat'
        + '</div>',
      settable_map : {}
    },
    stateMap = {
      $container : null
    },
    jqueryMap = {},
    setJqueryMap,
    configModule,
    initModule;
  //---------------- END MODULE SCOPE VARIABLES ------------------

  //---------------- BEGIN UTILITY METHODS -----------------------
  //---------------- END UTILITY METHODS -------------------------

  //---------------- BEGIN DOM METHODS ---------------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function() {
    var $container = stateMap.$container;
    jqueryMap = {
      $container: $container
    };
  };
  // End DOM method /setJqueryMap/
  //---------------- END DOM METHODS -----------------------------

  //---------------- BEGIN PUBLIC METHODS ------------------------
  // Begin public method /configModule/
  // Example: spa.chat.configModule({slider_open_em:18});
  // Purpose: Configure the module prior to initialization
  // Arguments:
  //   * set_chat_anchor - a callback to modify the URI anchor to
  //       indicate opened or closed state. This callback must return
  //       false if the requested state cannot be met.
  //   * chat_model - the chat model object provides methods
  //       to interact with our instant messaging
  //   * people_model - the people model object which provides methods
  //       to manage the list of people the model maintains
  //   * slider_* settings - All these are optional scalars.
  //       See mapConfig.settable_map for a full list.
  //       Example: slider_open_em is the open height in em's
  // Action:
  //   The internal configuration data structure (configMap) is
  //   updated with provided arguments. No other actions are taken.
  // Returns: true
  // Throws: JavaScript error object and stack trace on unacceptable
  //         or missing arguments.
  //
  // Begin public method /configureModule/
  // Purpose: Adjust configuration of allowed keys
  // Arguments:
  //   * input_map - a map of settable keys and values
  // Settings:
  //   * configMap.settable_map declares allowed keys
  // Returns: true
  // Throws: none
  //
  configModule = function(input_map) {
    spa.util.setConfigMap(
      {
        input_map: input_map,
        settable_map: configMap.settable_map,
        config_map: configMap
      }
    );
    return true;
  };
  // End public method /configureModule/

  // Begin public method /initModule/
  // Example: spa.chat.initModule($('#div_id'));
  // Purpose:
  //   Directs Chat to offer its capability to the user
  // Arguments:
  //   * $append_target - A jQuery collection that should represent
  //       a single DOM container (example: $('#div_id')).
  // Action:
  //   Appends the chat slider to the provided container and
  //   fills it with HTML content. It then initializes elements,
  //   events, and handlers to provide the user with a chat-room
  //   interface.
  // Returns: true on success, false on failure
  // Throws: none
  //
  // Begin public method /initModule/
  // Purpose: Initialize module
  // Arguments:
  //   * $container - the jquery element used by this feature
  // Returns: true
  // Throws: none
  //
  initModule = function($container) {
    $container.html(configMap.main_html);
    stateMap.$container = $container;
    setJqueryMap();
    return true;
  };
  // End public method /initModule/

  // return public methods
  return {
    configModule: configModule,
    initModule: initModule
  };
  //---------------- END PUBLIC METHODS --------------------------
} ());
