'use strict';

// THIS CLASS FILE IS PURELY MADE FOR CLIENT #1

const uuid = require('uuid').v4;

class MessageQueue1 {
  constructor(name) {
    this.name = name;
    this.messages = {};
  }

  add(payload) {
    if (!payload) {
      throw new Error('Add message error: undefined or invalid message')
    }
    let key = uuid();
    this.messages[key] = payload;
    return {
      id: key,
      value: payload,
    }
  }

  getAll() {
    return Object.keys(this.messages).map(id => {
      return { id, payload: this.messages[id] }
    });
  }

  received(id) {
    delete this.messages[id];
  }
}

module.exports = MessageQueue1;