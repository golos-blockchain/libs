import EventEmitter from 'events';

import config from '../../config'
import { promisifyAll, } from '../../promisify';

export default class Transport extends EventEmitter {
  constructor(options = {}) {
    super(options);
    this.options = options;
    this.id = 0;
    this.releases = [];
    this.requests = {};
    this.callbacks = {};
  }

  setOptions(options) {
    Object.assign(this.options, options);
    this.stop();
  }

  getURL() {
    const url = this.options && this.options.url
    return url || config.get('websocket')
  }

  listenTo(target, eventName, callback) {
    if (target.addEventListener) target.addEventListener(eventName, callback);
    else target.on(eventName, callback);

    return () => {
      if (target.removeEventListener)
        target.removeEventListener(eventName, callback);
      else target.removeListener(eventName, callback);
    };
  }

  send() {}
  start() {}
  stop() {}

}

promisifyAll(Transport.prototype);
