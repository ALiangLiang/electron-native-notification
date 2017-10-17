const {
  app,
  ipcMain,
  BrowserWindow,
} = require('electron'),
  EventEmitter = require('events'),
  path = require('path'),
  genUuid = require('./uuid');

/* Coz this module will add listener to global ipcMain, so increase ipcMain limit of listener to 100 even more. */
ipcMain.setMaxListeners(100);

/* Initial fake browser. */
let
  isWindowReady = false,
  window;
const createFakeBrowser = () => {
  window = new BrowserWindow({
    show: false,
  });
  window.webContents.loadURL('file://' + path.join(__dirname, '/fake-browser.html'));
  window.on('ready-to-show', () => isWindowReady = true);
}
if (!app.isReady())
  app.on('ready', () => createFakeBrowser());
else
  createFakeBrowser()

class Notification extends EventEmitter {
  constructor(title, opts) {
    super();

    /* Used to identity the event is trigger by self. */
    let uuid = genUuid();

    this._title = opts.title;
    this._tag = opts.tag;
    this._lang = opts.lang;
    this._body = opts.body;
    this._data = opts.data;
    this._dir = opts.dir;
    this._icon = opts.icon;
    this._timestamp = opts.timestamp;
    this._uuid = uuid;

    this._onclick = null;
    this._onerror = null;

    const sendMsg = () => window.webContents.send('display-notification', {
      title: title,
      opts: opts,
      uuid: uuid,
    });
    if (!isWindowReady)
      window.on('ready-to-show', () => sendMsg());
    else
      sendMsg();

    ipcMain.on('display-notification-onclick', (event, returnUuid) => {
      if (uuid === returnUuid)
        this.emit('click');
    });

    ipcMain.on('display-notification-onshow', (event, returnUuid) => {
      if (uuid === returnUuid)
        this.emit('show');
    });

    ipcMain.on('display-notification-onclose', (event, returnUuid) => {
      if (uuid === returnUuid)
        this.emit('close');
    });

    ipcMain.on('display-notification-onerror', (event, returnUuid, err) => {
      if (uuid === returnUuid)
        this.emit('error', err);
    });
  }

  /* Alias for 'on' */
  addEventListener(eventName, listener) {
    return this.on(eventName, listener);
  }

  close() {
    window.webContents.send('close-notification', { uuid: this._uuid });
  }

  set onclick(callback) {
    if (typeof callback !== 'function')
      callback = null;
    if (typeof this._onclick === 'function')
      this.removeListener('click', this._onclick); /* remove last listener. */
    this._onclick = callback; /* replace trigger function. */
    if (typeof callback === 'function')
      this.on('click', this._onclick);
  }

  get onclick() {
    return this._onclick;
  }

  set onerror(callback) {
    if (typeof callback !== 'function')
      callback = null;
    if (typeof this._onerror === 'function')
      this.removeListener('error', this._onerror); /* remove last listener. */
    this._onerror = callback; /* replace trigger function. */
    if (typeof callback === 'function')
      this.on('error', callback);
  }

  get onerror() {
    return this._onerror;
  }

  get title() {
    return this._title;
  }

  get tag() {
    return this._tag;
  }

  get lang() {
    return this._lang;
  }

  get body() {
    return this._body;
  }

  get data() {
    return this._data;
  }

  get dir() {
    return this._dir;
  }

  get icon() {
    return this._icon;
  }

  get timestamp() {
    return this._timestamp;
  }
}

module.exports = Notification;
