'use strict';

const Homey = require('homey');
const Device = require('../device_local.js');
const Util = require('../../lib/util.js');

class ShellySmokeDevice extends Device {

  onInit() {
    if (!this.util) this.util = new Util({homey: this.homey});

    this.callbacks = [];

    this.setAvailable();

    // TODO: REMOVE THIS AFTER SOME RELEASES
    this.setStoreValue('gen', 'gen1');
    this.setStoreValue('communication', 'coap');

    this.bootSequence();

  }

}

module.exports = ShellySmokeDevice;
