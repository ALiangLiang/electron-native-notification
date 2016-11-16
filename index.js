const {
  ipcMain,
  BrowserWindow,
} = require('electron'),
  EventEmitter = require('events'),
  path = require('path');

var window = null;

function genUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const
      r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  })
}

class Notification extends EventEmitter {
  constructor(title, opts) {
    super();

    let uuid;

    this.onclick = function() {};
    this.onerror = function() {};

    this._title = opts.title;
    this._tag = opts.tag;
    this._lang = opts.lang;
    this._body = opts.body;
    this._data = opts.data;
    this._dir = opts.dir;
    this._icon = opts.icon;
    this._timestamp = opts.timestamp;

    window = new BrowserWindow({
      show: false,
    })
    window.loadURL('file://' + path.join(__dirname, '/fake-browser.html'))
    window.on('ready-to-show', () => {
      uuid = genUuid();
      window.webContents.send('display-notification', {
        title: title,
        opts: opts,
        uuid: uuid,
      });
    })

    ipcMain.on('display-notification-onclick', (event, returnUuid) => {
      if (uuid === returnUuid) {
        this.onclick();
        this.emit('click');
      }
    })

    ipcMain.on('display-notification-onshow', (event, returnUuid) => {
      if (uuid === returnUuid)
        this.emit('show');
    })

    ipcMain.on('display-notification-onclose', (event, returnUuid) => {
      if (uuid === returnUuid)
        this.emit('close');
    })

    ipcMain.on('display-notification-onerror', (event, returnUuid) => {
      if (uuid === returnUuid) {
        this.onerror();
        this.emit('error');
      }
    })
  }

  close() {
    window.webContents.send('close-notification');
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
