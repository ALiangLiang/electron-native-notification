# electron-native-notification

[![GitHub release](https://img.shields.io/github/release/ALiangLiang/electron-native-notification.svg)](https://github.com/ALiangLiang/electron-native-notification/releases/latest "最新版本")
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-ES6-brightgreen.svg)](https://github.com/elierotenberg/coding-styles/blob/master/es6.md)

Easily display native desktop applications from your Electron main process.

Because Notifications use the HTML 5 Notification API, this usually only works
from renderer processes.

However, it's a polyfill from https://developer.mozilla.org/en-US/docs/Web/API/notification.

## Usage

Reference https://developer.mozilla.org/en-US/docs/Web/API/notification.

#### main.js:

```javascript
const
  { app } = require('electron'),
  Notification = require('electron-native-notification');

app.on('ready', () => {

  const opt = { body: 'See? Really easy to use!' };

  const notification = new Notification('I am a notification!', opt);

  notification.on('show', () => {
    console.log('I\'m coming~');
  });

  notification.onclick = () => {
    console.log('On no! You touch me. It\'s hurt!!');
  };

  notification.addEventListener('close', () => {
    console.log('I\'ll be back!!');
  });

  notification.addListener('error', (err) => {
    console.error(err);
  });

  console.log('What does the notification say? ' + notification.body);

  setTimeout(() => notification.close(), 2000);

});
```

## Polyfill what?

### Constructor
 - Notification(title, options)

### Properties
 - body (Read-only)
 - data (Read-only)
 - dir (Read-only)
 - icon (Read-only)
 - lang (Read-only)
 - onclick
 - onerror
 - tag (Read-only)
 - timestamp (Read-only)
 - title (Read-only)

### Methods
 - close()
 - on() (Event register for node)
 - addListener() (Event register for node)
 - addEventListener() (Event register for javascript)

### Events
 - error
 - click
 - close
 - show

## License
MIT
