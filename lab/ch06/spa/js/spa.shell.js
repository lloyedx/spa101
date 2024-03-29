/*
 * spa.shell.js
 * Shell module for SPA
 */

 /*jslint           browser : true,   continue  : true,
   devel  : true,   indent  : 2,      maxerr    : 50,
   newcap : true,   nomen   : true,   plusplus  : true,
   regexp : true,   sloppy  : true,   vars      : false,
   white  : true
  */
/*global $, spa */

spa.shell = (function() {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES ----------------
  var
    configMap = {
      anchor_schema_map: {
        chat: {
          opened: true,
          closed: true
        }
      },
      main_html: String()
        + '<div class="spa-shell-head">'
        +   '<div class="spa-shell-head-logo">'
        +     '<h1>SPA</h1>'
        +     '<p>javascript end to end</p>'
        +   '</div>'
        +   '<div class="spa-shell-head-account"></div>'
        + '</div>'
        + '<div class="spa-shell-main">'
        +   '<div class="spa-shell-main-nav"></div>'
        +   '<div class="spa-shell-main-content"></div>'
        + '</div>'
        + '<div class="spa-shell-foot"></div>'
        + '<div class="spa-shell-modal"></div>',
      chat_extend_height: 450,
      chat_extend_time: 250,
      chat_extended_title: 'Click to retract',
      chat_retract_height: 15,
      chat_retract_time: 300,
      chat_retracted_title: 'Click to extend',
      resize_interval: 200
    },
    stateMap = {
      $container: undefined,
      anchor_map: {},
      resize_idto: undefined
    },
    jqueryMap = {},
    copyAnchorMap,
    setJqueryMap,
    changeAnchorPart,
    onHashchange,
    onTapAccount,
    onLogin,
    onLogout,
    onResize,
    setChatAnchor,
    initModule;
  //---------------- END MODULE SCOPE VARIABLES ------------------

  //---------------- BEGIN UTILITY METHODS -----------------------
  // Returns a copy of stored anchor map; minimizes overhead
  copyAnchorMap = function() {
    return $.extend(true, {}, stateMap.anchor_map);
  };
  //---------------- END UTILITY METHODS -------------------------
  
  //---------------- BEGIN DOM METHODS ---------------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function() {
    var $container = stateMap.$container;
    jqueryMap = {
      $container: $container,
      $account: $container.find('.spa-shell-head-account'),
      $nav: $container.find('.spa-shell-main-nav')
    };
  };
  // End DOM method /setJqueryMap/

  // Begin DOM method /changeAnchorPart/
  // Purpose: Changes part of the URI anchor component
  // Arguments:
  //   * arg_map - The map describing what part of the URI anchor
  //               we want to change.
  // Returns: boolean
  //   * true - the anchor portion of the URI was update
  //   * false - the anchor portion of the URI could not be updated
  // Action:
  //   The current anchor representation stored in stateMap.anchor_map.
  //   See uriAnchor for a discussion of encoding.
  //   This method
  //     * Creates a copy of this map using copyAnchorMap().
  //     * Modifies the key-values using arg_map.
  //     * Manages the distinction between independent
  //       and dependent values in the encoding.
  //     * Attempts to change the URI using uriAnchor.
  //     * Returns true on success, and false on failure.
  //
  changeAnchorPart = function(arg_map) {
    var
      anchor_map_revise = copyAnchorMap(),
      bool_return = true,
      key_name,
      key_name_dep;
    
      // Begin merge changes into anchor map
      KEYVAL:
      for (key_name in arg_map)
      {
        if (arg_map.hasOwnProperty(key_name))
        {
          // skip dependent keys during iteration
          if (key_name.indexOf('_') === 0)
          {
            continue KEYVAL;
          }
          else
          {
            // update independent key value
            anchor_map_revise[key_name] = arg_map[key_name];
            // update matching dependent key
            key_name_dep = '_' + key_name;
            if (arg_map[key_name_dep])
            {
              anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
            }
            else
            {
              delete anchor_map_revise[key_name_dep];
              delete anchor_map_revise['_s' + key_name_dep];
            }
          }
        }
      }
      // End merge changes into anchor map

      // Begin attempt to update URI; revert if not successful
      try
      {
        $.uriAnchor.setAnchor(anchor_map_revise);
      }
      catch (error)
      {
        // replace URI with existing state
        $.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
        bool_return = false;
      }
      // End attempt to update URI; revert if not successful

      return bool_return;
  };
  // End DOM method /changeAnchorPart/
  //---------------- END DOM METHODS -----------------------------

  //---------------- BEGIN EVENT HANDLERS ------------------------
  // Begin Event handler /onHashchange/
  // Purpose: Handles the hashchange event
  // Arguments:
  //   * event - jQuery event object.
  // Settings: none
  // Returns: false
  // Action:
  //   * Parses the URI anchor component
  //   * Compare proposed application state with current
  //   * Adjust the application only where proposed state 
  //     differs from existing and is allowed by anchor schema
  //
  onHashchange = function(event) {
    var
      anchor_map_previous = copyAnchorMap(),
      anchor_map_proposed,
      _s_chat_previous,
      _s_chat_proposed,
      s_chat_proposed,
      is_ok = true;

    // attempt to parse anchor
    try
    {
      anchor_map_proposed = $.uriAnchor.makeAnchorMap();
    }
    catch (error)
    {
      $.uriAnchor.setAnchor(anchor_map_previous, null, true);
      return false;
    }
    stateMap.anchor_map = anchor_map_proposed;

    // convenience vars
    _s_chat_previous = anchor_map_previous._s_chat;
    _s_chat_proposed = anchor_map_proposed._s_chat;

    // Begin adjust chat component if changed
    if (!anchor_map_previous
        || _s_chat_previous !== _s_chat_proposed)
    {
      s_chat_proposed = anchor_map_proposed.chat;
      switch (s_chat_proposed)
      {
        case 'opened':
          is_ok = spa.chat.setSliderPosition('opened');
        break;
        case 'closed':
          is_ok = spa.chat.setSliderPosition('closed');
        break;
        default:
          spa.chat.setSliderPosition('closed');
          delete anchor_map_proposed.chat;
          $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
        break;
      }
    }
    // End adjust chat component if changed

    // Begin revert anchor if slider change denied
    if (!is_ok)
    {
      if (anchor_map_previous)
      {
        $.uriAnchor.setAnchor(anchor_map_previous, null, true);
        stateMap.anchor_map = anchor_map_previous;
      }
      else
      {
        delete anchor_map_proposed.chat;
        $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
      }
    }
    // End revert anchor if slider change denied

    return false;
  };
  // End Event handler /onHashchange/

  // Begin Event handler /onResize/
  // Purpose: Handles the resize event
  // Settings: none
  // Returns: true
  onResize = function() {
    if (stateMap.resize_idto)
    {
      return true;
    }
    else
    {
      spa.chat.handleResize();
      stateMap.resize_idto = setTimeout(
        function() { stateMap.resize_idto = undefined; },
        configMap.resize_interval
      );
      return true;
    }
  };
  // End Event handler /onResize/

  // Begin Event handler /onTapAccount/
  onTapAccount = function(event) {
    var
      account_text,
      user_name,
      user = spa.model.people.get_user();

    if (user.get_is_anon())
    {
      user_name = prompt('Please sign in');
      spa.model.people.login(user_name);
      jqueryMap.$account.text('... processing ...');
    }
    else
    {
      spa.model.people.logout();
    }
    return false;
  };
  // End Event handler /onTapAccount/

  // Begin Event handler /onLogin/
  onLogin = function(event, login_user) {
    jqueryMap.$account.text(login_user.name);
  };
  // End Event handler /onLogin/

  // Begin Event handler /onLogout/
  onLogout = function(event, logout_user) {
    jqueryMap.$account.text('Please sign in');
  };
  // End Event handler /onLogout/

  //---------------- END EVENT HANDLERS --------------------------

  //---------------- BEGIN CALLBACKS -----------------------------
  // Begin callback method /setChatAnchor/
  // Example: setChatAnchor('closed');
  // Purpose: Change the chat component of the anchor
  // Arguments:
  //   * position_type - may be 'closed' or 'opened'
  // Action:
  //   Changes the URI anchor parameter 'chat' to the requested
  //   value if possible.
  // Returns:
  //   * true - requested anchor part was updated
  //   * false - requested anchor part was not updated
  // Throws: none
  //
  setChatAnchor = function(position_type) {
    return changeAnchorPart(
      {
        chat: position_type
      }
    );
  };
  // End callback method /setChatAnchor/
  //---------------- END CALLBACKS -------------------------------
  
  //---------------- BEGIN PUBLIC METHODS ------------------------
  // Begin public method /initModule/
  // Example: spa.shell.initModule($('#app_div_id'));
  // Purpose:
  // Directs the Shell to offer its capability to the user
  // Arguments:
  //   * $container - a jQuery collection that should represent a 
  //                  single DOM container. (example: $('#app_div_id'))
  // Action:
  //   Populates $container with the shell of the UI and then 
  //   configures and initializes feature modules. The shell is 
  //   also responsible for browser-wide issues such as URI anchor
  //   and cookie management.
  // Returns: none
  // Throws: none
  // 
  initModule = function($container) {
    // load HTML and map jQuery collections
    stateMap.$container = $container;
    $container.html(configMap.main_html);
    setJqueryMap();

    // configure uriAnchor to use our schema
    $.uriAnchor.configModule(
      {
        schema_map: configMap.anchor_schema_map
      }
    );

    // configure and initialize feature modules
    spa.chat.configModule(
      {
        set_chat_anchor: setChatAnchor,
        chat_model: spa.model.chat,
        people_model: spa.model.people
      }
    );
    spa.chat.initModule(jqueryMap.$container);

    spa.avtr.configModule(
      {
        chat_model: spa.model.chat,
        people_model: spa.model.people
      }
    );
    spa.avtr.initModule(jqueryMap.$nav);

    // Handle URI anchor change events.
    // This is done /after/ all feature modules are configured
    // and initialized, otherwise they will not be ready to handle
    // the trigger event, which is used to ensure the anchor
    // is considered on-load.
    //
    $(window)
      .bind('resize', onResize)
      .bind('hashchange', onHashchange)
      .trigger('hashchange');

    $.gevent.subscribe($container, 'spa-login', onLogin);
    $.gevent.subscribe($container, 'spa-logout', onLogout);

    jqueryMap.$account
      .text('Please sign in')
      .bind('utap', onTapAccount);
  };
  // End public method /initModule/

  return {
    initModule: initModule
  };
  //---------------- END PUBLIC METHODS --------------------------
  ;
} ());
