var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSettings = {};

userSettings.schema = new Schema({
  name: { type: String, default: '' },
  value: Schema.Types.Mixed
}, {
  _id: false
});

userSettings.types = {

  // Choose 12 hour or 24 hour time display
  timeFormat: {
    defaultValue: 12,
    valueType: Schema.Types.Number,
    options: [
      12,
      24
    ]
  }

};

userSettings.isValidSetting = function(name) {
  return name in this.types;
};

userSettings.sanitizeValue = function(name, value) {
  var valueType = this.types[name].valueType;
  if (!valueType) return value;

  if (valueType === Schema.Types.Number)
    return parseInt(value, 10);

  return value;
};

userSettings.getSettingDoc = function(name, settingsList) {
  return settingsList.filter(function(doc) {
    return doc.name === name;
  })[0];
};

userSettings.getSettingValue = function(name, settingsList) {
  if (!this.isValidSetting(name))
    throw new Error('Invalid setting type');

  var settingDoc = this.getSettingDoc(name, settingsList);

  if (settingDoc)
    return settingDoc.value;

  return this.getDefaultSettingValue(name);
};

userSettings.getDefaultSettingValue = function(name) {
  if (!this.isValidSetting(name))
    throw new Error('Invalid setting type');

  return userSettings.types[name].defaultValue;
};

userSettings.setSettingValue = function(name, value, settingsList) {
  if (!this.isValidSetting(name))
    throw new Error('Invalid setting type');

  value = this.sanitizeValue(name, value);

  if (this.types[name].options.indexOf(value) === -1)
    throw new Error(`Invalid setting value: ${name} ${value}`);

  var settingDoc = this.getSettingDoc(name, settingsList);

  if (settingDoc) {
    settingDoc.value = value;
    return true;
  }

  settingsList.push({
    name: name,
    value: value
  });

  return true;
};


module.exports = userSettings;
