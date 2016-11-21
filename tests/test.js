const
  assert = require('assert'),
  Notification = require('./../index.js'),
  {
    ipcMain,
  } = require('electron');

describe('Event test.', function() {
  this.timeout(10000);

  let notification;

  afterEach(function() {
    notification.close();
    notification = undefined;
  });

  describe('show', function() {
    it('Create a notification and trigger \'show\' event.', function(done) {
      notification = new Notification('create a notification and trigger \'show\' event.', {
        body: 'I\'m tester.',
      });

      notification.on('show', () => setTimeout(() => done(), 500));
    });
  });

  describe('close', function() {
    it('Trigger \'close\' event.', function(done) {
      notification = new Notification('trigger \'close\' event.', {
        body: 'I\'m tester.',
      });

      notification.on('close', () => setTimeout(() => done(), 500));
    });

    it('Test \'close\' method.', function(done) {
      notification = new Notification('test \'close\' method.', {
        body: 'I\'m tester.',
      });

      setTimeout(() => notification.close(), 1000);

      notification.on('close', () => setTimeout(() => done(), 500));
    });
  });

  const eventTypes = [{
    type: 'click',
  }, {
    type: 'error',
  }, ];

  eventTypes.forEach((test) => {

    describe(test.type, function() {
      it(`Trigger '${test.type}' event.`, function(done) {
        notification = new Notification(`trigger '${test.type}' event.`, {
          body: 'I\'m tester.',
        });

        setTimeout(() => notification.emit(test.type), 1000);

        notification.on(test.type, () => setTimeout(() => done(), 500));
      });

      it(`Trigger '${test.type}' event with addEventListener.`, function(done) {
        notification = new Notification(`trigger '${test.type}' event with addEventListener.`, {
          body: 'I\'m tester.',
        });

        setTimeout(() => notification.emit(test.type), 1000);

        notification.addEventListener(test.type, () => setTimeout(() => done(), 500));
      });

      it(`Trigger 'on${test.type}' property.`, function(done) {
        notification = new Notification(`trigger 'on${test.type}' property.`, {
          body: 'I\'m tester.',
        });

        setTimeout(() => notification.emit(test.type), 1000);

        notification[`on${test.type}`] = () => setTimeout(() => done(), 500);
      });

      it(`Assign and get 'on${test.type}' property.`, function() {
        notification = new Notification(`assign and get 'on${test.type}' property.`, {
          body: 'I\'m tester.',
        });

        setTimeout(() => ipcMain.emit('display-notification-onclick'), 1000);

        const callback = function() {};
        notification[`on${test.type}`] = callback;
        assert(notification[`on${test.type}`] === callback);
      });
    });
  });

  after(function() {
    /* I don't know why I need more times to exit the process.*/
    setTimeout(() => process.exit(0), 500);
    setTimeout(() => process.exit(0), 1000);
  });
});
