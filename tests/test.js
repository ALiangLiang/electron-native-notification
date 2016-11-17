const Notification = require('./../index.js');
let notification;

describe('module launch', function() {
  this.timeout(10000);

  afterEach(function() {
    notification.close();
    notification = undefined;
  });

  it('create a notification and trigger \'show\' event.', function(done) {
    notification = new Notification('create a notification and trigger \'show\' event.', {
      body: 'I\'m tester.'
    });

    notification.on('show', () => {
      setTimeout(() => done(), 500);
    });
  });

  it('trigger \'close\' event.', function(done) {
    notification = new Notification('trigger \'close\' event.', {
      body: 'I\'m tester.'
    });

    notification.on('close', () => {
      setTimeout(() => done(), 500);
    });
  });

  it('test \'close\' method.', function(done) {
    notification = new Notification('test \'close\' method.', {
      body: 'I\'m tester.'
    });

    setTimeout(() => notification.close(), 1000);

    notification.on('close', () => {
      setTimeout(() => done(), 500);
    });
  });

  it('trigger \'click\' event.', function(done) {
    notification = new Notification('trigger \'click\' event.', {
      body: 'I\'m tester.'
    });

    setTimeout(() => notification.emit('click'), 1000);

    notification.on('click', () => {
      setTimeout(() => done(), 500);
    });
  });

  it('trigger \'onclick\' property.', function(done) {
    notification = new Notification('trigger \'onclick\' property.', {
      body: 'I\'m tester.'
    });

    setTimeout(() => notification.emit('click'), 1000);

    notification.onclick = function() {
      setTimeout(() => done(), 500);
    };
  });

  it('trigger \'error\' event.', function(done) {
    notification = new Notification('trigger \'error\' event.', {
      body: 'I\'m tester.'
    });

    setTimeout(() => notification.emit('error', new Error()), 1000);

    notification.on('error', () => {
      setTimeout(() => done(), 500);
    });
  });

  after(function() {
    process.exit();
  });
});
