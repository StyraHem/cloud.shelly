'use strict';

const Homey = require('homey');
const Device = require('../device_cloud.js');
const Util = require('../../lib/util.js');

class Shelly4ProCloudDevice extends Device {

  onOAuth2Init() {
    if (!this.util) this.util = new Util({homey: this.homey});

    if (this.getStoreValue('type') === 'SPSW-004PE16EU' || this.getStoreValue('type') === 'SHPSW04P') {
      this.callbacks = [
        'single_push',
        'long_push',
        'double_push'
      ];
    } else {
      this.callbacks = [];
    }

    this.setAvailable();

    this.bootSequence();

    // CAPABILITY LISTENERS
    this.registerCapabilityListener("onoff", this.onCapabilityOnoff.bind(this));

  }

}

module.exports = Shelly4ProCloudDevice;
