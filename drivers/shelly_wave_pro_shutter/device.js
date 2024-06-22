'use strict';

const Device = require('../device_zwave.js');

class ShellyWaveProShutterDevice extends Device {

  async registerCapabilities() {
    try {
      
      this.registerCapability('measure_power', 'METER');

      this.registerCapability('meter_power', 'METER');

      this.registerCapability('windowcoverings_set', 'SWITCH_MULTILEVEL', { multiChannelNodeId: 1 });

      const zwaveShutterOperatingModeRaw = await this.configurationGet({index: 71});
      const zwaveShutterOperatingModeArray = Array.from(zwaveShutterOperatingModeRaw['Configuration Value']);
      const zwaveShutterOperatingMode = zwaveShutterOperatingModeArray[0];

      if (Number(zwaveShutterOperatingMode) === 1) { // operating mode = venetian blinds
        if (!this.hasCapability('windowcoverings_tilt_set')) { await this.addCapability('windowcoverings_tilt_set'); }
        this.registerCapability('windowcoverings_tilt_set', 'SWITCH_MULTILEVEL', { multiChannelNodeId: 2 });
      } else {
        if (this.hasCapability('windowcoverings_tilt_set')) { await this.removeCapability('windowcoverings_tilt_set'); }
      }

    } catch (error) {
      this.error(error);
    }    
  }

  async onSettings({oldSettings, newSettings, changedKeys}) {
    try {
      if (changedKeys.includes("zwaveShutterOperatingMode")) {
        if (Number(newSettings.zwaveShutterOperatingMode) === 1) { // operating mode = venetian blinds
          if (!this.hasCapability('windowcoverings_tilt_set')) { await this.addCapability('windowcoverings_tilt_set'); }
          this.registerCapability('windowcoverings_tilt_set', 'SWITCH_MULTILEVEL', { multiChannelNodeId: 2 });
        } else {
          if (this.hasCapability('windowcoverings_tilt_set')) { await this.removeCapability('windowcoverings_tilt_set'); }
        }
      }
      return await super.onSettings({oldSettings, newSettings, changedKeys});
    } catch (error) {
      this.error(error);
    }
  }

  /* CUSTOM ACTION CARD FOR windowcoverings_tilt_set AS ATHOM DID NOT IMPLEMENT IT */
  async actionTiltRunListener(args, state) {
    try {
      if (this.hasCapability('windowcoverings_tilt_set')) {
        this.setCapabilityValue('windowcoverings_tilt_set', args.tilt).catch(this.error);
        return this._setCapabilityValue('windowcoverings_tilt_set', 'SWITCH_MULTILEVEL', args.tilt);
      }
    } catch (error) {
      this.error(error);
      return Promise.reject(error.message);
    }
  }

}

module.exports = ShellyWaveProShutterDevice;