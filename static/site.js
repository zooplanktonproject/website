Y.use([
  'node-base',
  'event-base',
  'squarespace-util'
], function(Y) {
  var resizer = new Y.Squarespace.ResizeEmitter({
    timeout: 100
  });
  var events = {};

  function bind () {
    setPageHeight();
    edgeDetect();

    events.tweakchange = Y.Global.on('tweak:change', tweakChangeCallback);
  }

  function loadImages () {
    Y.all('img[data-src]').each(function (img) {
      ImageLoader.load(img)
    });
  }

  function setPageHeight () {
    if (!Y.one('#page') || !Y.one('#sidebar')) {
      return false;
    }

    Y.one('#page').setStyles({
      minHeight: Y.one('#sidebar').get('clientHeight')
    });
  }

  function edgeDetect () {
    var rect;

    Y.all('.main-nav .subnav').each(function (subnav) {
      rect = subnav.getDOMNode().getBoundingClientRect();

      if (rect.right > Y.config.win.innerWidth) {
        subnav.addClass('is--overflowing-window');
      }
    });
  }

  function tweakChangeCallback (f) {
    var tweakName = f.getName();

    if (tweakName == 'blogSidebarWidth' ) {
      setPageHeight();
    }

    if (tweakName == 'page-banner-full-width' ) {
      loadImages();
    }
  }

  function destructor () {
    Y.each(events, function (event) {
      event.detach();
      event = null;
    }, this);
    events = null;

    resizer.destructor();
    resizer = null;
  }

  events.domready     = Y.on('domready', bind);
  events.resizeend    = resizer.on('resize:end', loadImages);
  events.beforeUnload = Y.one(window).on('beforeunload', destructor);
});