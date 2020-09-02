var first_run = true; //Used to solve problem in function parseChildren /Gunnar
var dNode;            //Used to solve problem in function parseChildren /Gunnar
var MaxStrokeWidth;
/**
 * Shim for "fixing" IE's lack of support (IE < 9) for applying slice
 * on host objects like NamedNodeMap, NodeList, and HTMLCollection
 * (technically, since host objects have been implementation-dependent,
 * at least before ES2015, IE hasn't needed to work this way).
 * Also works on strings, fixes IE < 9 to allow an explicit undefined
 * for the 2nd argument (as in Firefox), and prevents errors when
 * called on other DOM objects.
 */

String.prototype.padStart = function (l, s, t) {
  return s || (s = " "), (l -= this.length) > 0 ? (s = new Array(Math.ceil(l / s.length)
    + 1).join(s)).substr(0, t = !t ? l : t == 1 ? 0 : Math.ceil(l / 2))
    + this + s.substr(0, l - t) : this;
};

if (!String.prototype.repeat) {
  String.prototype.repeat = function (count) {
    'use strict';
    if (this == null) {
      throw new TypeError('can\'t convert ' + this + ' to object');
    }
    var str = '' + this;
    count = +count;
    if (count != count) {
      count = 0;
    }
    if (count < 0) {
      throw new RangeError('repeat count must be non-negative');
    }
    if (count == Infinity) {
      throw new RangeError('repeat count must be less than infinity');
    }
    count = Math.floor(count);
    if (str.length == 0 || count == 0) {
      return '';
    }
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if (str.length * count >= 1 << 28) {
      throw new RangeError('repeat count must not overflow maximum string size');
    }
    var rpt = '';
    for (; ;) {
      if ((count & 1) == 1) {
        rpt += str;
      }
      count >>>= 1;
      if (count == 0) {
        break;
      }
      str += str;
    }
    return rpt;
  }
}

(function () {
  'use strict';
  var _slice = Array.prototype.slice;

  try {
    // Can't be used with DOM elements in IE < 9/
    _slice.call(document.documentElement);
  } catch (e) { // Fails in IE < 9
    // This will work for genuine arrays, array-like objects, 
    // NamedNodeMap (attributes, entities, notations),
    // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
    // and will not fail on other DOM objects (as do DOM elements in IE < 9)
    Array.prototype.slice = function (begin, end) {
      // IE < 9 gets unhappy with an undefined end argument
      end = (typeof end !== 'undefined') ? end : this.length;

      // For native Array objects, we use the native slice function
      if (Object.prototype.toString.call(this) === '[object Array]') {
        return _slice.call(this, begin, end);
      }

      // For array like object we handle it ourselves.
      var i, cloned = [],
        size, len = this.length;

      // Handle negative value for "begin"
      var start = begin || 0;
      start = (start >= 0) ? start : Math.max(0, len + start);

      // Handle negative value for "end"
      var upTo = (typeof end == 'number') ? Math.min(end, len) : len;
      if (end < 0) {
        upTo = len + end;
      }

      // Actual expected size of the slice
      size = upTo - start;

      if (size > 0) {
        cloned = new Array(size);
        if (this.charAt) {
          for (i = 0; i < size; i++) {
            cloned[i] = this.charAt(start + i);
          }
        } else {
          for (i = 0; i < size; i++) {
            cloned[i] = this[start + i];
          }
        }
      }

      return cloned;
    };
  }
}());

// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {

  Array.prototype.map = function (callback/*, thisArg*/) {

    var T, A, k;

    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| 
    //    value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal 
    //    method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = arguments[1];
    }

    // 6. Let A be a new array created as if by the expression new Array(len) 
    //    where Array is the standard built-in constructor with that name and 
    //    len is the value of len.
    A = new Array(len);

    // 7. Let k be 0
    k = 0;

    // 8. Repeat, while k < len
    while (k < len) {

      var kValue, mappedValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal 
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal 
        //    method of O with argument Pk.
        kValue = O[k];

        // ii. Let mappedValue be the result of calling the Call internal 
        //     method of callback with T as the this value and argument 
        //     list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor
        // { Value: mappedValue,
        //   Writable: true,
        //   Enumerable: true,
        //   Configurable: true },
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, k, {
        //   value: mappedValue,
        //   writable: true,
        //   enumerable: true,
        //   configurable: true
        // });

        // For best browser support, use the following:
        A[k] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }

    // 9. return A
    return A;
  };
}






var settingsGCODE = {};
var exportFolder = {};
var sourceDoc,
  itemsToExport,
  exportDoc,
  svgOptions;

//~     var win = new Window("palette", "Script Progress", [150, 150, 600, 260]);   
//~     win.pnl = win.add("panel", [10, 10, 440, 100], "Progress"); 
//~     win.pnl.progBar = win.pnl.add("progressbar", [20, 35, 410, 60], 0, 100);
//~     win.pnl.progBarLabel = win.pnl.add("statictext", [20, 20, 320, 35], "0%"); 

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Waybury
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the follog conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

#target illustrator

var win;
var dialog;


function displayDialog() {
  var lastUnits = 0;

  //LOAD VALUES BY DEFAULT
  var settingsLoadFileDefault;
  settingsLoadFileDefault = new File('~/Documents/' + 'SettingsForIllustratorScript-6473a58b-cd34-2dad-49b0-ad1f23fabad3.settings');

  var startDefault = "";
  var feedRateDefault = "";
  var seekRateDefault = "";
  var directoryDefault = "";
  var filenameDefault = "";
  var lazerPowerDefault = "";
  var endDefault = "";
  var commandBetweenDefault = "";
  var colorCommandOn1Default = "";
  var colorCommandOff1Default = "";
  var colorCommandOn2Default = "";
  var colorCommandOff2Default = "";
  var colorCommandOn3Default = "";
  var colorCommandOff3Default = "";
  var colorCommandOn4Default = "";
  var colorCommandOff4Default = "";
  var color1TextDefault = "";
  var color2TextDefault = "";
  var color3TextDefault = "";
  var LineWithVariationMinDefault = "";
  var LineWithVariationMaxDefault = "";


  if (settingsLoadFileDefault.exists) {
    settingsLoadFileDefault.open("r");

    var settingLoadDefault = settingsLoadFileDefault.read();
    var mySettingsDefault = settingLoadDefault.split('|');

    startDefault = mySettingsDefault[0];
    feedRateDefault = mySettingsDefault[1];
    seekRateDefault = mySettingsDefault[2];
    directoryDefault = mySettingsDefault[3];
    filenameDefault = mySettingsDefault[4];
    endDefault = mySettingsDefault[5];
    commandBetweenDefault = mySettingsDefault[6];
    colorCommandOn1Default = mySettingsDefault[7];
    colorCommandOff1Default = mySettingsDefault[8];
    colorCommandOn2Default = mySettingsDefault[9];
    colorCommandOff2Default = mySettingsDefault[10];
    colorCommandOn3Default = mySettingsDefault[11];
    colorCommandOff3Default = mySettingsDefault[12];
    colorCommandOn4Default = mySettingsDefault[13];
    colorCommandOff4Default = mySettingsDefault[14];
    color1TextDefault = mySettingsDefault[15];
    color2TextDefault = mySettingsDefault[16];
    color3TextDefault = mySettingsDefault[17];
    LineWithVariationMinDefault = mySettingsDefault[18];
    LineWithVariationMaxDefault = mySettingsDefault[19];

    settingsLoadFileDefault.close();
  }



  // WINDOW PARAMS
  dialog = new Window('dialog', "G-code generator");
  dialog.orientation = "row";
  dialog.alignChildren = "left";

  // ++++++++++++++++ LEFT GROUP
  var leftGroup = dialog.add('group');
  leftGroup.orientation = "column";
  leftGroup.alignChildren = "left";
  leftGroup.alignment = "top";

  // ++++++++++++++++ RIGHT GROUP
  var rightGroup = dialog.add('group');
  rightGroup.orientation = "column";
  rightGroup.alignChildren = ["fill", "left"];
  rightGroup.alignment = "top";


  // ++++ Default color
  var commandDefaultPanel = leftGroup.add('panel', undefined, "Lines:", { borderStyle: "sunken" });
  commandDefaultPanel.orientation = "column";
  commandDefaultPanel.alignChildren = ["fill", "left"];

  //Command on for color default
  var colorCommandOn4Group = commandDefaultPanel.add('group');
  colorCommandOn4Group.orientation = "row";

  //Command off for color default
  //var colorCommandOff4Group = commandDefaultPanel.add('group');
  //colorCommandOff4Group.orientation = "row";

  var colorCommandOff4GroupLabel = colorCommandOn4Group.add("statictext", undefined, "Off cmd");
  colorCommandOff4GroupLabel.size = [60, 20];

  //var colorCommandOff4GroupMeasure = colorCommandOn4Group.add ("statictext", undefined, '');
  //colorCommandOff4GroupMeasure.size = [58, 20];

  var colorCommandOff4GroupText = colorCommandOn4Group.add("edittext", undefined, colorCommandOff4Default, { multiline: true, scrollable: false });
  colorCommandOff4GroupText.size = [150, 40];

  var colorCommandOn4GroupLabel = colorCommandOn4Group.add("statictext", undefined, "On cmd");
  colorCommandOn4GroupLabel.size = [60, 20];

  var colorCommandOn4GroupText = colorCommandOn4Group.add("edittext", undefined, colorCommandOn4Default, { multiline: true, scrollable: false });
  colorCommandOn4GroupText.size = [150, 40];

  // ++++ line with variation
  var LineWithVariationPanel = leftGroup.add('panel', undefined, "Line with variation on Z:", { borderStyle: "sunken" });
  LineWithVariationPanel.orientation = "column";
  LineWithVariationPanel.alignChildren = ["fill", "left"];

  //Command on for color default
  var LineWithVariationMinGroup = LineWithVariationPanel.add('group');
  LineWithVariationMinGroup.orientation = "row";

  var LineWithVariationMinLabel = LineWithVariationMinGroup.add("statictext", undefined, "Min cmd G0 Z");
  LineWithVariationMinLabel.size = [150, 20];

  var LineWithVariationMinText = LineWithVariationMinGroup.add("edittext", undefined, LineWithVariationMinDefault, { readonly: false });
  LineWithVariationMinText.size = [60, 25];

  //Command off for color default
  //var colorCommandOff4Group = commandDefaultPanel.add('group');
  //colorCommandOff4Group.orientation = "row";

  var LineWithVariationMaxLabel = LineWithVariationMinGroup.add("statictext", undefined, "Max cmd G0 Z");
  LineWithVariationMaxLabel.size = [150, 20];

  //var colorCommandOff4GroupMeasure = colorCommandOn4Group.add ("statictext", undefined, '');
  //colorCommandOff4GroupMeasure.size = [58, 20];

  var LineWithVariationMaxText = LineWithVariationMinGroup.add("edittext", undefined, LineWithVariationMaxDefault, { readonly: false });
  LineWithVariationMaxText.size = [60, 25];

  // ++++ COLOR PANEL
  var colorPanel = leftGroup.add('panel', undefined, "Color Lines:", { borderStyle: "sunken" });
  colorPanel.orientation = "column";
  colorPanel.alignChildren = ["fill", "left"];

  // COLOR 1
  var color1Group = colorPanel.add('group');
  color1Group.orientation = "row";

  var color1GroupLabel = color1Group.add("statictext", undefined, "Color 1");
  color1GroupLabel.size = [270, 20];

  var color1GroupLabelNum = color1Group.add("statictext", undefined, "#");
  color1GroupLabelNum.size = [11, 20];


  var color1Text = color1Group.add("edittext", undefined, color1TextDefault, { readonly: false });
  color1Text.size = [150, 25];

  //Command on for color 1
  var colorCommandOn1Group = colorPanel.add('group');
  colorCommandOn1Group.orientation = "row";
  colorCommandOn1Group.size = [350, 70];

  //Command off for color 1
  //var colorCommandOff1Group = colorPanel.add('group');
  //colorCommandOff1Group.orientation = "row";

  var colorCommandOff1GroupLabel = colorCommandOn1Group.add("statictext", undefined, "Off cmd");
  colorCommandOff1GroupLabel.size = [60, 20];

  //var colorCommandOff1GroupMeasure = colorCommandOff1Group.add ("statictext", undefined, '');
  //colorCommandOff1GroupMeasure.size = [50, 20];

  var colorCommandOff1GroupText = colorCommandOn1Group.add("edittext", undefined, colorCommandOff1Default, { multiline: true, scrollable: false });
  colorCommandOff1GroupText.size = [150, 40];

  var colorCommandOn1GroupLabel = colorCommandOn1Group.add("statictext", undefined, "On cmd");
  colorCommandOn1GroupLabel.size = [60, 20];

  var colorCommandOn1GroupText = colorCommandOn1Group.add("edittext", undefined, colorCommandOn1Default, { multiline: true, scrollable: false });
  colorCommandOn1GroupText.size = [150, 40];

  // COLOR 2
  var color2Group = colorPanel.add('group');
  color2Group.orientation = "row";

  var color2GroupLabel = color2Group.add("statictext", undefined, "Color 2");
  color2GroupLabel.size = [270, 20];

  var color2GroupLabelNum = color2Group.add("statictext", undefined, "#");
  color2GroupLabelNum.size = [11, 20];

  var color2Text = color2Group.add("edittext", undefined, color2TextDefault, { readonly: false });
  color2Text.size = [150, 25];

  //Command on for color 2
  var colorCommandOn2Group = colorPanel.add('group');
  colorCommandOn2Group.orientation = "row";
  colorCommandOn2Group.size = [60, 70];

  //Command off for color 2
  //var colorCommandOff2Group = colorPanel.add('group');
  //colorCommandOff2Group.orientation = "row";

  var colorCommandOff2GroupLabel = colorCommandOn2Group.add("statictext", undefined, "Off cmd");
  colorCommandOff2GroupLabel.size = [60, 20];

  //var colorCommandOff2GroupMeasure = colorCommandOff2Group.add ("statictext", undefined, '');
  //colorCommandOff2GroupMeasure.size = [50, 20];

  var colorCommandOff2GroupText = colorCommandOn2Group.add("edittext", undefined, colorCommandOff2Default, { multiline: true, scrollable: false });
  colorCommandOff2GroupText.size = [150, 40];

  var colorCommandOn2GroupLabel = colorCommandOn2Group.add("statictext", undefined, "On cmd");
  colorCommandOn2GroupLabel.size = [60, 20];

  var colorCommandOn2GroupText = colorCommandOn2Group.add("edittext", undefined, colorCommandOn2Default, { multiline: true, scrollable: false });
  colorCommandOn2GroupText.size = [150, 40];


  // COLOR 3
  var color3Group = colorPanel.add('group');
  color3Group.orientation = "row";

  var color3Label = color3Group.add("statictext", undefined, "Color 3");
  color3Label.size = [270, 20];

  var color3GroupLabelNum = color3Group.add("statictext", undefined, "#");
  color3GroupLabelNum.size = [11, 20];

  var color3Text = color3Group.add("edittext", undefined, color3TextDefault, { readonly: false });
  color3Text.size = [150, 25];


  //Command on for color 3
  var colorCommandOn3Group = colorPanel.add('group');
  colorCommandOn3Group.orientation = "row";
  colorCommandOn3Group.size = [60, 70];

  //Command off for color 3
  //var colorCommandOff3Group = colorPanel.add('group');
  //colorCommandOff3Group.orientation = "row";

  var colorCommandOff3GroupLabel = colorCommandOn3Group.add("statictext", undefined, "Off cmd");
  colorCommandOff3GroupLabel.size = [60, 20];

  //var colorCommandOff3GroupMeasure = colorCommandOff3Group.add ("statictext", undefined, '');
  //colorCommandOff3GroupMeasure.size = [50, 20];

  var colorCommandOff3GroupText = colorCommandOn3Group.add("edittext", undefined, colorCommandOff3Default, { multiline: true, scrollable: false });
  colorCommandOff3GroupText.size = [150, 40];

  var colorCommandOn3GroupLabel = colorCommandOn3Group.add("statictext", undefined, "On cmd");
  colorCommandOn3GroupLabel.size = [60, 20];

  var colorCommandOn3GroupText = colorCommandOn3Group.add("edittext", undefined, colorCommandOn3Default, { multiline: true, scrollable: false });
  colorCommandOn3GroupText.size = [150, 40];

  // ++++General Commands PANEL
  var generalCommandsPanel = rightGroup.add('panel', undefined, "General commands:", { borderStyle: "sunken" });
  generalCommandsPanel.orientation = "column";
  generalCommandsPanel.alignChildren = ["fill", "left"];

  // Start and End
  var startGroup = generalCommandsPanel.add('group');
  startGroup.orientation = "row";
  var startButtonsGroup = generalCommandsPanel.add('group');
  startButtonsGroup.orientation = "row";

  var startLabel = startGroup.add("statictext", undefined, 'Start:');
  startLabel.size = [170, 20];

  var endLabel = startGroup.add("statictext", undefined, 'End:');
  endLabel.size = [45, 20];

  var startText = startButtonsGroup.add("edittext", undefined, startDefault, { multiline: true, scrollable: false });
  startText.size = [150, 40];

  var endMeasure = startButtonsGroup.add("statictext", undefined, '');
  endMeasure.size = [10, 20];

  var endGroupText = startButtonsGroup.add("edittext", undefined, endDefault, { multiline: true, scrollable: false });
  endGroupText.size = [150, 40];

  // ++++TOOLS PANEL
  var toolPanel = rightGroup.add('panel', undefined, "Tool:", { borderStyle: "sunken" });
  toolPanel.orientation = "column";
  toolPanel.alignChildren = ["fill", "left"];

  // FEED RATE
  var feedRateGroup = toolPanel.add('group');
  feedRateGroup.orientation = "row";

  var feedRateLabel = feedRateGroup.add("statictext", undefined, 'Feed Rate (ms):');
  feedRateLabel.size = [90, 20];

  var feedRateText = feedRateGroup.add("edittext", undefined, feedRateDefault, { readonly: false });
  feedRateText.size = [60, 25];

  // SEEK RATE
  var seekRateLabel = feedRateGroup.add("statictext", undefined, 'Seek Rate (ms):');
  seekRateLabel.size = [90, 20];

  var seekRateText = feedRateGroup.add("edittext", undefined, seekRateDefault, { readonly: false });
  seekRateText.size = [60, 25];


  // ++++ SETTINGS FILE PANEL
  var settingsPanel = rightGroup.add('panel', undefined, "Settings:", { borderStyle: "sunken" });
  settingsPanel.orientation = "row";
  settingsPanel.alignChildren = ["fill", "left"];
  var settingsPanelMeasure = settingsPanel.add("statictext", undefined, '');
  settingsPanelMeasure.size = [110, 31];

  //SETTINGS SAVE
  var settingsSaveGroup = settingsPanel.add('group');
  settingsSaveGroup.orientation = "row";
  settingsSaveGroup.alignChildren = "left";

  var settingsSaveButton = settingsSaveGroup.add('button', undefined, 'Save Settings', { name: "Dir" });
  settingsSaveButton.size = [100, 25];
  settingsSaveButton.onClick = function () {
    var settingsSaveFile;
    settingsSaveFile = File.saveDialog('Select file to save settings file.', '*.settings');

    settingsSaveFile.open("w");
    var settingSave = startText.text + '|' + feedRateText.text + '|' + seekRateText.text + '|' + directoryText.text + '|' + filenameText.text + '|' + endGroupText.text + '|' + " " + '|' + colorCommandOn1GroupText.text + '|' + colorCommandOff1GroupText.text + '|' + colorCommandOn2GroupText.text + '|' + colorCommandOff2GroupText.text + '|' + colorCommandOn3GroupText.text + '|' + colorCommandOff3GroupText.text + '|' + colorCommandOn4GroupText.text + '|' + colorCommandOff4GroupText.text + '|' + color1Text.text + '|' + color2Text.text + '|' + color3Text.text + '|' + LineWithVariationMinText.text + '|' + LineWithVariationMaxText.text;
    settingsSaveFile.write(settingSave);
    settingsSaveFile.close();

    alert("Settings saved.", "Save");

  }

  //SETTINGS LOAD
  var settingsLoadGroup = settingsPanel.add('group');
  settingsLoadGroup.orientation = "row";
  settingsLoadGroup.alignChildren = "left";

  var settingsLoadButton = settingsLoadGroup.add('button', undefined, 'Load Settings', { name: "Dir" });
  settingsLoadButton.size = [100, 25];

  // ++++ OUTPUT FILE PANEL
  var outputFilePanel = rightGroup.add('panel', undefined, "Output File:", { borderStyle: "sunken" });
  outputFilePanel.orientation = "column";
  outputFilePanel.alignChildren = ["fill", "left"];
  outputFilePanel.size = [365, 280];

  //DIRECTORY
  var directoryGroup = outputFilePanel.add('group');
  directoryGroup.orientation = "row";
  directoryGroup.alignChildren = "left";

  var directoryLabel = directoryGroup.add("statictext", undefined, 'Directory:');
  directoryLabel.size = [140, 20];

  var directoryText = directoryGroup.add("edittext", undefined, directoryDefault, { readonly: true });
  directoryText.characters = 13;

  var directoryButton = directoryGroup.add('button', undefined, '...', { name: "Dir" });
  directoryButton.size = [30, 25];
  directoryButton.onClick = function () {
    directoryText.text = Folder.selectDialog('Select folder to save G-Code file.', '~');
  }
  //directoryText.text = File.saveDialog( 'Select folder to save G-Code file.', '.settings' );

  //FILENAME
  var filenameGroup = outputFilePanel.add('group');
  filenameGroup.orientation = "row";
  filenameGroup.alignChildren = "left";

  var filenameLabel = filenameGroup.add("statictext", undefined, 'Filename:');
  filenameLabel.size = [140, 20];

  var filenameText = filenameGroup.add("edittext", undefined, filenameDefault, { readonly: false });
  filenameText.characters = 17;

  //SUFFIX SETTINGS
  var suffixGroup = outputFilePanel.add('group');
  suffixGroup.orientation = "row";
  suffixGroup.alignChildren = "left";

  var suffix = suffixGroup.add("checkbox", undefined, 'Add numeric suffix to filename');
  suffix.value = true;

  //SAVE SETTINGS CHECKBOX
  var saveDefaultGroup = outputFilePanel.add('group');
  saveDefaultGroup.orientation = "row";
  saveDefaultGroup.alignChildren = "left";

  var saveDefault = saveDefaultGroup.add("checkbox", undefined, 'Save settings');
  saveDefault.value = true;

  //Progress bar
  win = outputFilePanel.add('group');
  win.pnl = win.add("panel", [10, 10, 340, 80], "Progress");
  win.pnl.progBarLabel = win.pnl.add("statictext", [20, 20, 320, 35], "0%");
  win.pnl.progBar = win.pnl.add("progressbar", [10, 45, 310, 60], 0, 100);


  var HyperGroup = rightGroup.add('group');
  HyperGroup.orientation = "row";
  var learnMoreLabel = HyperGroup.add("statictext", undefined, 'Learn more:');
  learnMoreLabel.size = [70, 20];
  var siteLabel = HyperGroup.add("statictext", undefined, 'http://www.diegomonzon.com');
  siteLabel.size = [200, 20];

  //BUTTONS
  var buttonsGroup = outputFilePanel.add('group');
  buttonsGroup.alignment = ["right", "bottom"];
  buttonsGroup.orientation = "row";
  buttonsGroup.alignChildren = ["fill", "bottom"];

  settingsLoadButton.onClick = function () {
    var settingsLoadFile;
    settingsLoadFile = File.openDialog('Select file to load settings file.', '*.settings');

    settingsLoadFile.open("r");

    var settingLoad = settingsLoadFile.read();
    var mySettings = settingLoad.split('|');

    startText.text = mySettings[0];
    feedRateText.text = mySettings[1];
    seekRateText.text = mySettings[2];
    directoryText.text = mySettings[3];
    filenameText.text = mySettings[4];
    endGroupText.text = mySettings[5];
    colorCommandOn1GroupText.text = mySettings[7];
    colorCommandOff1GroupText.text = mySettings[8];
    colorCommandOn2GroupText.text = mySettings[9];
    colorCommandOff2GroupText.text = mySettings[10];
    colorCommandOn3GroupText.text = mySettings[11];
    colorCommandOff3GroupText.text = mySettings[12];
    colorCommandOn4GroupText.text = mySettings[13];
    colorCommandOff4GroupText.text = mySettings[14];
    color1Text.text = mySettings[15];
    color2Text.text = mySettings[16];
    color3Text.text = mySettings[17];
    LineWithVariationMinText.text = mySettings[18];
    LineWithVariationMaxText.text = mySettings[19];

    commandBetweenDefault = "";
    settingsLoadFile.close();

    alert("Settings loaded.", "Load");
  }



  // SAVE BUTTON
  dialog.OKBtn = buttonsGroup.add('button', undefined, 'Generate G-code', { name: "OK" });
  dialog.OKBtn.onClick = function () {
    var directory = new File(directoryText.text);
    var a = parseInt(LineWithVariationMaxText.text);
    var aa = parseInt(LineWithVariationMinText.text);

    if (directoryText.text == 'null' || directoryText.text == '') {
      alert("Directory is required");
    }
    else if (color1Text.text.length != 6 || color2Text.text.length != 6 || color3Text.text.length != 6) {
      alert("The colors fields must have hex format.");
    }
    else if (isNaN(a) && !isNaN(aa) || (isNaN(aa) && !isNaN(a))) {
      alert("Min cmd and Max cmd must be integers.");
    }
    else if (aa < 0 || (aa > a)) {
      alert("Max cmd must bigger than Min cmd.");
    }
    else {

      settingsGCODE.colorCommandOn1 = colorCommandOn1GroupText.text;
      settingsGCODE.colorCommandOff1 = colorCommandOff1GroupText.text;
      settingsGCODE.colorCommandOn2 = colorCommandOn2GroupText.text;
      settingsGCODE.colorCommandOff2 = colorCommandOff2GroupText.text;
      settingsGCODE.colorCommandOn3 = colorCommandOn3GroupText.text;
      settingsGCODE.colorCommandOff3 = colorCommandOff3GroupText.text;
      settingsGCODE.colorCommandOn4 = colorCommandOn4GroupText.text;
      settingsGCODE.colorCommandOff4 = colorCommandOff4GroupText.text;
      settingsGCODE.color1Text = color1Text.text;
      settingsGCODE.color2Text = color2Text.text;
      settingsGCODE.color3Text = color3Text.text;

      settingsGCODE.LineWithVariationMin = parseInt(LineWithVariationMinText.text);
      settingsGCODE.LineWithVariationMax = parseInt(LineWithVariationMaxText.text);
      settingsGCODE.LineWithVariationIsDesactivated = false;
      if (isNaN(a) && isNaN(aa)) {
        settingsGCODE.LineWithVariationIsDesactivated = true;
      }

      settingsGCODE.end = endGroupText.text;
      settingsGCODE.commandBetween = "";

      settingsGCODE.start = startText.text;
      settingsGCODE.feedRate = parseFloat(feedRateText.text);
      settingsGCODE.seekRate = parseFloat(seekRateText.text);

      settingsGCODE.suffix = suffix.value;

      exportFolder.fsDirectory = directoryText.text;
      exportFolder.fsName = filenameText.text;

      if (saveDefault.value) {
        var settingsSaveFileDefault;
        settingsSaveFileDefault = new File('~/Documents/' + 'SettingsForIllustratorScript-6473a58b-cd34-2dad-49b0-ad1f23fabad3.settings');

        settingsSaveFileDefault.open("w");
        var settingSaveDefault = startText.text + '|' + feedRateText.text + '|' + seekRateText.text + '|' + directoryText.text + '|' + filenameText.text + '|' + endGroupText.text + '|' + " " + '|' + colorCommandOn1GroupText.text + '|' + colorCommandOff1GroupText.text + '|' + colorCommandOn2GroupText.text + '|' + colorCommandOff2GroupText.text + '|' + colorCommandOn3GroupText.text + '|' + colorCommandOff3GroupText.text + '|' + colorCommandOn4GroupText.text + '|' + colorCommandOff4GroupText.text + '|' + color1Text.text + '|' + color2Text.text + '|' + color3Text.text + '|' + LineWithVariationMinText.text + '|' + LineWithVariationMaxText.text;

        settingsSaveFileDefault.write(settingSaveDefault);
        settingsSaveFileDefault.close();

      }



      //exportDoc = documents.add(DocumentColorSpace.RGB);                

      main();

      //exportDoc.close(SaveOptions.DONOTSAVECHANGES);
      //var layers = activeDocument.Lay dfgsdfgsdfgers;
    }

  }
  // CANCEL BUTTON
  dialog.cancelBtn = buttonsGroup.add('button', undefined, 'Close', { name: "CANCEL" });
  dialog.cancelBtn.onClick = function () { dialog.close(false); };

  function getTargetFile(docName, ext, destFolder) {
    var newName = "";
    if (docName.indexOf('.') < 0) {
      newName = docName + ext;
    } else {
      var dot = docName.lastIndexOf('.');
      newName += docName.substring(0, dot);
      newName += ext;
    }

    var file = new File(destFolder + '/' + newName);

    if (file.open("w")) {
      file.close();
    }
    else {
      alert("Access to slected directory is denied");
    }
    return file;
  }

  function convertMilimeterToInch(units) {
    return units / 25.4;
  }

  function convertInchToMilimeter(units) {
    return units * 25.4;
  }

  function changeTagsToMilimeters() {
    bitWidthMeasure.text = "mm";
    materialWidthMeasure.text = "mm";
    cutZMeasure.text = "mm";
    safeZMeasure.text = "mm";
  }

  function changeTagsToInches() {
    bitWidthMeasure.text = "inch";
    materialWidthMeasure.text = "inch";
    cutZMeasure.text = "inch";
    safeZMeasure.text = "inch";
  }

  function convertValues(unit) {
    switch (unit) {
      case 0:
        bitWidthText.text = convertMilimeterToInch(parseFloat(bitWidthText.text));
        materialWidthText.text = convertMilimeterToInch(parseFloat(materialWidthText.text));
        cutZText.text = convertMilimeterToInch(parseFloat(cutZText.text));
        safeZText.text = convertMilimeterToInch(parseFloat(safeZText.text));
        break;
      case 1:
        bitWidthText.text = convertInchToMilimeter(parseFloat(bitWidthText.text));
        materialWidthText.text = convertInchToMilimeter(parseFloat(materialWidthText.text));
        cutZText.text = convertInchToMilimeter(parseFloat(cutZText.text));
        safeZText.text = convertInchToMilimeter(parseFloat(safeZText.text));
        break;
    }
  }

  function getOptions() {
    var options = new ExportOptionsSVG();
    options.SVGDocumentEncoding = SVGDocumentEncoding.UTF8;

    return options;
  }

  return dialog.show();
}




try {
  if (app.documents.length > 0) {



    var appVersion = parseInt(app.version);
    if (appVersion >= 10)	// CS3
    {
      svgOptions = new ExportOptionsSVG();
      svgOptions.embedRasterImages = false;
      svgOptions.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES;
      svgOptions.fontSubsetting = SVGFontSubsetting.None;
      svgOptions.documentEncoding = SVGDocumentEncoding.UTF8;
      // FLAG !!
      svgOptions.coordinatePrecision = 7;

      itemsToExport = [];
      sourceDoc = app.activeDocument;
      var a = app.activeDocument;
      displayDialog();
    }
    else {
      alert("Sorry, this script requires Illustrator CS3 or later.");
    }

  }
  else {
    throw new Error('There are no documents open. Open a document and try again.');
  }
}
catch (e) {
  alert(e.message, "Script Alert", true);
}

function main() {

  exportSVG(app.activeDocument, name, 0, svgOptions);

  //~   var item;
  //~   app.activeDocument = sourceDoc;
  //~   itemsToExport = getNamedItems(sourceDoc);
  //~   var a = app.activeDocument;
  //~   
  //~   for ( var i = 0, len = itemsToExport.length; i < len; i++ ) {


  //~     item = itemsToExport[0];
  //~     var finish = 0;

  //~     if ( item.typename === 'Artboard' ) {
  //~         var name = item.name;
  //~         exportSVG( app.activeDocument, name, 0, svgOptions);
  //~         finish = 1;
  //~       //exportArtboard(item);
  //~     } 

  //~     // Empty export document
  //~     exportDoc.pageItems.removeAll();
  //~     if(finish == 1){
  //~          break;
  //~         }
  //~    
  //~   }

}
function exportSVG(doc, name, bounds, exportOptions) {



  //doc.artboards[0].artboardRect = bounds;

  var file = new File(exportFolder.fsDirectory + '/' + exportFolder.fsName + '.svg');
  var nameFile = exportFolder.fsDirectory + '/' + exportFolder.fsName;
  if (file.exists) {
    var p = 0;
    while (file.exists) {
      p++;
      nameFile = exportFolder.fsDirectory + '/' + exportFolder.fsName + p;
      file = new File(nameFile + '.svg');
    }
  }

  doc.exportFile(file, ExportType.SVG, exportOptions);
  file.close();


  var xmlFile = new File(nameFile + '.svg');
  xmlFile.open("r");
  var xmlStr = xmlFile.read();
  xmlFile.close();

  var tree = XMLparser.XMLparse(xmlStr, { preserveAttributes: false, preserveDocumentNode: false });



  var XMLRepresentation = getRepresentation(tree.getTree());

  var gcode = svg2gcode(XMLRepresentation, settingsGCODE);

  var gcodeFile = new File(exportFolder.fsDirectory + '/' + exportFolder.fsName + '.gcode');

  if (settingsGCODE.suffix && gcodeFile.exists) {
    var p = 0;
    while (gcodeFile.exists) {
      p++;
      nameFile = exportFolder.fsDirectory + '/' + exportFolder.fsName + p;
      gcodeFile = new File(nameFile + '.gcode');
    }
  }
  gcodeFile.open("w");

  gcodeFile.write(gcode);
  gcodeFile.close();

  while (win.pnl.progBar.value < win.pnl.progBar.maxvalue) {
    // this is what causes the progress bar increase its progress  
    win.pnl.progBar.value++;
    win.pnl.progBarLabel.text = Math.floor(win.pnl.progBar.value) + "%";
    dialog.update();
    $.sleep(10);
  }

  file.remove();

  alert('Done!');

  win.pnl.progBar.value = 0;
  win.pnl.progBarLabel.text = Math.floor(win.pnl.progBar.value) + "%";

}

function getNamedItems(doc) {
  var item,
    items,
    doclayers,
    artboards;

  items = [];

  // Check all artboards for name match
  artboards = [];

  for (var i = 0, len = doc.artboards.length; i < len; i++) {
    item = doc.artboards[i];
    items.push(item);
  }

  // Check all layers for name match
  doclayers = [];
  recurseLayers(doc.layers, doclayers);

  for (i = 0, len = doclayers.length; i < len; i++) {
    item = doclayers[i];

    if (!item.locked && !anyParentLocked(item)) {
      items.push(item);
    }
  }

  // Check all pageItems for name match
  for (i = 0, len = doc.pageItems.length; i < len; i++) {
    item = doc.pageItems[i];

    if (!item.locked && !anyParentLocked(item)) {
      items.push(item);
    }
  }

  return items;
}

function recurseLayers(layers, layerArray) {

  var layer;

  for (var i = 0, len = layers.length; i < len; i++) {
    layer = layers[i];
    if (!layer.locked) {
      layerArray.push(layer);
    }
    if (layer.layers.length > 0) {
      recurseLayers(layer.layers, layerArray);
    }
  }
}

function recurseItems(layers, items) {

  var layer;

  for (var i = 0, len = layers.length; i < len; i++) {
    layer = layers[i];
    if (layer.pageItems.length > 0 && !layer.locked) {
      for (var j = 0, plen = layer.pageItems.length; j < plen; j++) {
        if (!layer.pageItems[j].locked) {
          items.push(layer.pageItems[j]);
        }
      }
    }

    if (layer.layers.length > 0) {
      recurseItems(layer.layers, items);
    }
  }
}

function anyParentLocked(item) {
  while (item.parent) {
    if (item.parent.locked) {
      return true;
    }
    item = item.parent;
  }

  return false;
}


/* Code derived from John Wundes ( john@wundes.com ) www.wundes.com
 * Copyright (c) 2005 wundes.com
 * All rights reserved.
 *
 * This code is derived from software contributed to or originating on wundes.com
 */

function hitTest(a, b) {
  if (!hitTestX(a, b)) {
    return false;
  }
  if (!hitTestY(a, b)) {
    return false;
  }
  return true;
}

function hitTestX(a, b) {
  var p1 = a.visibleBounds[0];
  var p2 = b.visibleBounds[0];
  if ((p2 <= p1 && p1 <= p2 + b.width) || (p1 <= p2 && p2 <= p1 + a.width)) {
    return true;
  }
  return false;
}

function hitTestY(a, b) {
  var p3 = a.visibleBounds[1];
  var p4 = b.visibleBounds[1];
  if ((p3 >= p4 && p4 >= (p3 - a.height)) || (p4 >= p3 && p3 >= (p4 - b.height))) {
    return true;
  }
  return false;
}