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



// ### Common / Math / Vec2

function containString(nameObjectXML, nodeName) {
  for (var i = 0; i < nameObjectXML.length; i++) {
    if (nameObjectXML[i] == nodeName) {
      return true;
    }
  }
  return false;
}


var xml_header = '<?xml version="1.0"?>';
var sort_args = null;
var re_valid_tag_name = /^\w[\w\-\:\.]*$/;
var indexNodeXML = 0;

function parse_xml(text, opts) {
  // turn text into XML tree quickly
  if (!opts) opts = {};
  opts.text = text;
  var parser = new XML(opts);
  return parser.error() ? parser.getLastError() : parser.getTree();
};

function trim(text) {
  // strip whitespace from beginning and end of string
  if (text == null) return '';

  if (text && text.replace) {
    text = text.replace(/^\s+/, "");
    text = text.replace(/\s+$/, "");
  }

  return text;
};

function encode_entities(text) {
  // Simple entitize exports.for = function for composing XML
  if (text == null) return '';

  if (text && text.replace) {
    text = text.replace(/\&/g, "&amp;"); // MUST BE FIRST
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
  }

  return text;
};

function encode_attrib_entities(text) {
  // Simple entitize exports.for = function for composing XML attributes
  if (text == null) return '';

  if (text && text.replace) {
    text = text.replace(/\&/g, "&amp;"); // MUST BE FIRST
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
    text = text.replace(/\"/g, "&quot;");
    text = text.replace(/\'/g, "&apos;");
  }

  return text;
};

function decode_entities(text) {
  // Decode XML entities into raw ASCII
  if (text == null) return '';

  if (text && text.replace && text.match(/\&/)) {
    text = text.replace(/\&lt\;/g, "<");
    text = text.replace(/\&gt\;/g, ">");
    text = text.replace(/\&quot\;/g, '"');
    text = text.replace(/\&apos\;/g, "'");
    text = text.replace(/\&amp\;/g, "&"); // MUST BE LAST
  }

  return text;
};

function compose_xml(node, name, indent, indent_string, eol, sort) {
  // Compose node into XML including attributes
  // Recurse for child nodes
  if (typeof (indent_string) == 'undefined') indent_string = "\t";
  if (typeof (eol) == 'undefined') eol = "\n";
  if (typeof (sort) == 'undefined') sort = true;
  var xml = "";

  // If this is the root node, set the indent to 0
  // and setup the XML header (PI node)
  if (!indent) {
    indent = 0;
    xml = xml_header + eol;

    if (!name) {
      // no name provided, assume content is wrapped in it
      name = first_key(node);
      node = node[name];
    }
  }

  // Setup the indent text
  var indent_text = "";
  for (var k = 0; k < indent; k++) indent_text += indent_string;

  if ((typeof (node) == 'object') && (node != null)) {
    // node is object -- now see if it is an array or hash
    if (!node.length) { // what about zero-length array?
      // node is hash
      xml += indent_text + "<" + name;

      var num_keys = 0;
      var has_attribs = 0;
      for (var key in node) num_keys++; // there must be a better way...

      if (node["_Attribs"]) {
        has_attribs = 1;
        var sorted_keys = sort ? hash_keys_to_array(node["_Attribs"]).sort() : hash_keys_to_array(node["_Attribs"]);
        for (var idx = 0, len = sorted_keys.length; idx < len; idx++) {
          var key = sorted_keys[idx];
          xml += " " + key + "=\"" + encode_attrib_entities(node["_Attribs"][key]) + "\"";
        }
      } // has attribs

      if (num_keys > has_attribs) {
        // has child elements
        xml += ">";

        if (node["_Data"]) {
          // simple text child node
          xml += encode_entities(node["_Data"]) + "</" + name + ">" + eol;
        } // just text
        else {
          xml += eol;

          var sorted_keys = sort ? hash_keys_to_array(node).sort() : hash_keys_to_array(node);
          for (var idx = 0, len = sorted_keys.length; idx < len; idx++) {
            var key = sorted_keys[idx];
            if ((key != "_Attribs") && key.match(re_valid_tag_name)) {
              // recurse for node, with incremented indent value
              xml += compose_xml(node[key], key, indent + 1, indent_string, eol, sort);
            } // not _Attribs key
          } // foreach key

          xml += indent_text + "</" + name + ">" + eol;
        } // real children
      }
      else {
        // no child elements, so self-close
        xml += "/>" + eol;
      }
    } // standard node
    else {
      // node is array
      for (var idx = 0; idx < node.length; idx++) {
        // recurse for node in array with same indent
        xml += compose_xml(node[idx], name, indent, indent_string, eol, sort);
      }
    } // array of nodes
  } // complex node
  else {
    // node is simple string
    xml += indent_text + "<" + name + ">" + encode_entities(node) + "</" + name + ">" + eol;
  } // simple text node

  return xml;
};

function always_array(obj, key) {
  // if object is not array, return array containing object
  // if key is passed, work like XMLalwaysarray() instead
  if (key) {
    if ((typeof (obj[key]) != 'object') || (typeof (obj[key].length) == 'undefined')) {
      var temp = obj[key];
      delete obj[key];
      obj[key] = new Array();
      obj[key][0] = temp;
    }
    return null;
  }
  else {
    if ((typeof (obj) != 'object') || (typeof (obj.length) == 'undefined')) { return [obj]; }
    else return obj;
  }
};

function hash_keys_to_array(hash) {
  // convert hash keys to array (discard values)
  var array = [];
  for (var key in hash) array.push(key);
  return array;
};

function isa_array(arg) {
  // determine if arg is an array or is array-like
  return false;
};

function isa_hash(arg) {
  // determine if arg is a hash
  return (!!arg && (typeof (arg) == 'object') && !isa_array(arg));
};

function first_key(hash) {
  // return first key from hash (unordered)
  for (var key in hash) return key;
  return null; // no keys in hash
};

function num_keys(hash) {
  // count the number of keys in a hash
  var count = 0;
  for (var a in hash) count++;
  return count;
};


function getAttribute(tag, attribute) {
  for (var i = 0; i < tag.attributes.length; i++) {
    if (tag.attributes[i].nodeName == attribute) {
      return tag.attributes[i].value;
    }
  }
  return '0';
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

function exportArtboard(artboard) {

  var item,
    name,
    prettyName,
    doc,
    rect,
    bbox;

  app.activeDocument = sourceDoc;
  rect = artboard.artboardRect;

  bbox = sourceDoc.pathItems.rectangle(rect[1], rect[0], rect[2] - rect[0], rect[1] - rect[3]);
  bbox.stroked = false;
  bbox.name = '__ILSVGEX__BOUNDING_BOX';

  name = artboard.name;

  win.pnl.text = 'Exporting ' + name;
  win.pnl.progBar.value = 0;
  win.pnl.progBarLabel.text = Math.floor(win.pnl.progBar.value) + "%";
  dialog.update();

  prettyName = name.slice(0, -4).replace(/[^\w\s]|_/g, " ").replace(/\s+/g, "-").toLowerCase();

  app.activeDocument = exportDoc;

  for (var i = 0, len = sourceDoc.pageItems.length; i < len; i++) {
    item = sourceDoc.pageItems[i];

    win.pnl.progBar.value = (i * (win.pnl.progBar.maxvalue * 0.4)) / sourceDoc.pageItems.length;
    win.pnl.progBarLabel.text = Math.floor(win.pnl.progBar.value) + "%";
    win.pnl.progBar.onDraw();
    dialog.update();

    if (hitTest(item, bbox) && !item.locked && !anyParentLocked(item)) {
      item.duplicate(exportDoc, ElementPlacement.PLACEATEND);
    }
  }

  app.activeDocument = exportDoc;
  exportDoc.pageItems.getByName('__ILSVGEX__BOUNDING_BOX').remove();

  // Check if artboard is blank, clean up and exit
  if (!exportDoc.pageItems.length) {
    sourceDoc.pageItems.getByName('__ILSVGEX__BOUNDING_BOX').remove();
    return;
  }

  for (i = 0, len = exportDoc.pageItems.length; i < len; i++) {
    item = exportDoc.pageItems[i];

    /*
     * For the moment, all pageItems are made visible and exported
     * unless they are locked. This may not make sense, but it'll
     * work for now.
     */
    item.hidden = false;
  }

  exportDoc.layers[0].name = prettyName;
  exportSVG(exportDoc, name, bbox.visibleBounds, svgOptions);

  sourceDoc.pageItems.getByName('__ILSVGEX__BOUNDING_BOX').remove();
}

function exportLayer(layer) {

  var item,
    startX,
    startY,
    endX,
    endY,
    name,
    prettyName,
    itemName,
    layerItems;

  layerItems = [];

  for (var i = 0, len = layer.pageItems.length; i < len; i++) {
    layerItems.push(layer.pageItems[i]);
  }
  recurseItems(layer.layers, layerItems);

  if (!layerItems.length) {
    return;
  }

  name = layer.name;

  prettyName = name.slice(0, -4).replace(/[^\w\s]|_/g, " ").replace(/\s+/g, "-").toLowerCase();

  for (i = 0, len = layerItems.length; i < len; i++) {
    app.activeDocument = sourceDoc;
    item = layerItems[i];
    item.duplicate(exportDoc, ElementPlacement.PLACEATEND);
  }

  app.activeDocument = exportDoc;

  for (i = 0, len = exportDoc.pageItems.length; i < len; i++) {

    item = exportDoc.pageItems[i];

    /*
     * For the moment, all pageItems are made visible and exported
     * unless they are locked. This may not make sense, but it'll
     * work for now.
     */
    item.hidden = false;

    if (item.name) {
      itemName = item.name;
      itemName = itemName.slice(0, -4);
      itemName = itemName.replace(/[^\w\s]|_/g, " ").replace(/\s+/g, "-").toLowerCase()

      item.name = prettyName + '-' + itemName;
    }
    /*
     * We want the smallest startX, startY for obvious reasons.
     * We also want the smallest endX and endY because Illustrator
     * Extendscript treats this coordinate reversed to how the UI
     * treats it (e.g., -142 in the UI is 142).
     *
     */
    startX = (!startX || startX > item.visibleBounds[0]) ? item.visibleBounds[0] : startX;
    startY = (!startY || startY < item.visibleBounds[1]) ? item.visibleBounds[1] : startY;
    endX = (!endX || endX < item.visibleBounds[2]) ? item.visibleBounds[2] : endX;
    endY = (!endY || endY > item.visibleBounds[3]) ? item.visibleBounds[3] : endY;
  }

  exportDoc.layers[0].name = name.slice(0, -4);
  exportSVG(exportDoc, name, [startX, startY, endX, endY], svgOptions);
}

function exportItem(item) {

  var name,
    newItem;

  name = item.name;
  newItem = item.duplicate(exportDoc, ElementPlacement.PLACEATEND);
  newItem.hidden = false;
  newItem.name = item.name.slice(0, -4);
  app.activeDocument = exportDoc;

  exportDoc.layers[0].name = ' ';
  exportSVG(exportDoc, name, item.visibleBounds, svgOptions);
}

function getRects(treeRects, rects) {
  var currentNodes = [];
  if (treeRects.length) {
    for (var i = 0; i < treeRects.length; i++) {
      currentNodes.push(treeRects[i]);
    }
    var len = currentNodes.length;
    for (var i = 0; i < currentNodes.length; i++) {

      if (currentNodes[i].length) {
        for (var j = 0; j < currentNodes[i].length; j++) {
          currentNodes.push(currentNodes[i][j]);
        }
      }
      else {
        rects.push({
          childNodes: [],
          children: [],
          localName: 'rect',
          nodeName: 'rect',
          nodeValue: null,
          tagName: 'rect',
          textContent: '',
          indexNodeXML: currentNodes[i]['indexNodeXML'],
          attributes: [
            { childNodes: [], localName: 'x', name: 'x', nodeName: 'x', nodeValue: currentNodes[i]['x'], textContent: currentNodes[i]['x'], value: currentNodes[i]['x'] },
            { childNodes: [], localName: 'y', name: 'y', nodeName: 'y', nodeValue: currentNodes[i]['y'], textContent: currentNodes[i]['y'], value: currentNodes[i]['y'] },
            { childNodes: [], localName: 'width', name: 'width', nodeName: 'width', nodeValue: currentNodes[i]['width'], textContent: currentNodes[i]['width'], value: currentNodes[i]['width'] },
            { childNodes: [], localName: 'height', name: 'height', nodeName: 'height', nodeValue: currentNodes[i]['height'], textContent: currentNodes[i]['height'], value: currentNodes[i]['height'] },
            { childNodes: [], localName: 'fill', name: 'fill', nodeName: 'fill', nodeValue: currentNodes[i]['fill'], textContent: currentNodes[i]['fill'], value: currentNodes[i]['fill'] },
            { childNodes: [], localName: 'stroke', name: 'stroke', nodeName: 'stroke', nodeValue: currentNodes[i]['stroke'], textContent: currentNodes[i]['stroke'], value: currentNodes[i]['stroke'] },
            { childNodes: [], localName: 'stroke-miterlimit', name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: currentNodes[i]['stroke-miterlimit'], textContent: currentNodes[i]['stroke-miterlimit'], value: currentNodes[i]['stroke-miterlimit'] },
            { childNodes: [], localName: 'stroke-width', name: 'stroke-width', nodeName: 'stroke-width', nodeValue: currentNodes[i]['stroke-width'], textContent: currentNodes[i]['stroke-width'], value: currentNodes[i]['stroke-width'] }
          ]
        });
      }
    }
  }
  else {
    rects.push({
      childNodes: [],
      children: [],
      localName: 'rect',
      nodeName: 'rect',
      nodeValue: null,
      tagName: 'rect',
      textContent: '',
      indexNodeXML: treeRects['indexNodeXML'],
      attributes: [
        { childNodes: [], localName: 'x', name: 'x', nodeName: 'x', nodeValue: treeRects['x'], textContent: treeRects['x'], value: treeRects['x'] },
        { childNodes: [], localName: 'y', name: 'y', nodeName: 'y', nodeValue: treeRects['y'], textContent: treeRects['y'], value: treeRects['y'] },
        { childNodes: [], localName: 'fill', name: 'fill', nodeName: 'fill', nodeValue: treeRects['fill'], textContent: treeRects['fill'], value: treeRects['fill'] },
        { childNodes: [], localName: 'stroke', name: 'stroke', nodeName: 'stroke', nodeValue: treeRects['stroke'], textContent: treeRects['stroke'], value: treeRects['stroke'] },
        { childNodes: [], localName: 'stroke-miterlimit', name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: treeRects['stroke-miterlimit'], textContent: treeRects['stroke-miterlimit'], value: treeRects['stroke-miterlimit'] },
        { childNodes: [], localName: 'width', name: 'width', nodeName: 'width', nodeValue: treeRects['width'], textContent: treeRects['width'], value: treeRects['width'] },
        { childNodes: [], localName: 'height', name: 'height', nodeName: 'height', nodeValue: treeRects['height'], textContent: treeRects['height'], value: treeRects['height'] },
        { childNodes: [], localName: 'stroke-width', name: 'stroke-width', nodeName: 'stroke-width', nodeValue: treeRects['stroke-width'], textContent: treeRects['stroke-width'], value: treeRects['stroke-width'] }
      ]
    });
  }
}

function getPolygons(treePolygons, polygons) {
  var currentNodes = [];
  if (treePolygons.length) {
    for (var i = 0; i < treePolygons.length; i++) {
      currentNodes.push(treePolygons[i]);
    }
    var len = currentNodes.length;
    for (var i = 0; i < currentNodes.length; i++) {

      if (currentNodes[i].length) {
        for (var j = 0; j < currentNodes[i].length; j++) {
          currentNodes.push(currentNodes[i][j]);
        }
      }
      else {
        polygons.push({
          childNodes: [],
          children: [],
          localName: 'polygon',
          nodeName: 'polygon',
          nodeValue: null,
          tagName: 'polygon',
          textContent: '',
          indexNodeXML: currentNodes[i]['indexNodeXML'],
          attributes: [
            { childNodes: [], localName: 'points', name: 'points', nodeName: 'points', nodeValue: currentNodes[i]['points'], textContent: currentNodes[i]['points'], value: currentNodes[i]['points'] },
            { childNodes: [], localName: 'fill', name: 'fill', nodeName: 'fill', nodeValue: currentNodes[i]['fill'], textContent: currentNodes[i]['fill'], value: currentNodes[i]['fill'] },
            { childNodes: [], localName: 'stroke', name: 'stroke', nodeName: 'stroke', nodeValue: currentNodes[i]['stroke'], textContent: currentNodes[i]['stroke'], value: currentNodes[i]['stroke'] },
            { childNodes: [], localName: 'stroke-miterlimit', name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: currentNodes[i]['stroke-miterlimit'], textContent: currentNodes[i]['stroke-miterlimit'], value: currentNodes[i]['stroke-miterlimit'] },
            { childNodes: [], localName: 'stroke-width', name: 'stroke-width', nodeName: 'stroke-width', nodeValue: currentNodes[i]['stroke-width'], textContent: currentNodes[i]['stroke-width'], value: currentNodes[i]['stroke-width'] }
          ]
        });
      }
    }
  }
  else {
    polygons.push({
      childNodes: [],
      children: [],
      localName: 'polygon',
      nodeName: 'polygon',
      nodeValue: null,
      tagName: 'polygon',
      textContent: '',
      indexNodeXML: treePolygons['indexNodeXML'],
      attributes: [
        { childNodes: [], localName: 'points', name: 'points', nodeName: 'points', nodeValue: treePolygons['points'], textContent: treePolygons['points'], value: treePolygons['points'] },
        { childNodes: [], localName: 'fill', name: 'fill', nodeName: 'fill', nodeValue: treePolygons['fill'], textContent: treePolygons['fill'], value: treePolygons['fill'] },
        { childNodes: [], localName: 'stroke', name: 'stroke', nodeName: 'stroke', nodeValue: treePolygons['stroke'], textContent: treePolygons['stroke'], value: treePolygons['stroke'] },
        { childNodes: [], localName: 'stroke-miterlimit', name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: treePolygons['stroke-miterlimit'], textContent: treePolygons['stroke-miterlimit'], value: treePolygons['stroke-miterlimit'] },
        { childNodes: [], localName: 'stroke-width', name: 'stroke-width', nodeName: 'stroke-width', nodeValue: treePolygons['stroke-width'], textContent: treePolygons['stroke-width'], value: treePolygons['stroke-width'] }
      ]
    });
  }
}

function getEllipses(treeEllipses, ellipses) {
  var currentNodes = [];
  if (treeEllipses.length) {
    for (var i = 0; i < treeEllipses.length; i++) {
      currentNodes.push(treeEllipses[i]);
    }
    var len = currentNodes.length;
    for (var i = 0; i < currentNodes.length; i++) {

      if (currentNodes[i].length) {
        for (var j = 0; j < currentNodes[i].length; j++) {
          currentNodes.push(currentNodes[i][j]);
        }
      }
      else {
        ellipses.push({
          childNodes: [],
          children: [],
          localName: 'ellipse',
          nodeName: 'ellipse',
          nodeValue: null,
          tagName: 'ellipse',
          textContent: '',
          indexNodeXML: currentNodes[i]['indexNodeXML'],
          attributes: [
            { childNodes: [], localName: 'rx', name: 'rx', nodeName: 'rx', nodeValue: currentNodes[i]['rx'], textContent: currentNodes[i]['rx'], value: currentNodes[i]['rx'] },
            { childNodes: [], localName: 'cx', name: 'cx', nodeName: 'cx', nodeValue: currentNodes[i]['cx'], textContent: currentNodes[i]['cx'], value: currentNodes[i]['cx'] },
            { childNodes: [], localName: 'ry', name: 'ry', nodeName: 'ry', nodeValue: currentNodes[i]['ry'], textContent: currentNodes[i]['ry'], value: currentNodes[i]['ry'] },
            { childNodes: [], localName: 'cy', name: 'cy', nodeName: 'cy', nodeValue: currentNodes[i]['cy'], textContent: currentNodes[i]['cy'], value: currentNodes[i]['cy'] },
            { childNodes: [], localName: 'fill', name: 'fill', nodeName: 'fill', nodeValue: currentNodes[i]['fill'], textContent: currentNodes[i]['fill'], value: currentNodes[i]['fill'] },
            { childNodes: [], localName: 'stroke', name: 'stroke', nodeName: 'stroke', nodeValue: currentNodes[i]['stroke'], textContent: currentNodes[i]['stroke'], value: currentNodes[i]['stroke'] },
            { childNodes: [], localName: 'stroke-miterlimit', name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: currentNodes[i]['stroke-miterlimit'], textContent: currentNodes[i]['stroke-miterlimit'], value: currentNodes[i]['stroke-miterlimit'] },
            { childNodes: [], localName: 'stroke-width', name: 'stroke-width', nodeName: 'stroke-width', nodeValue: currentNodes[i]['stroke-width'], textContent: currentNodes[i]['stroke-width'], value: currentNodes[i]['stroke-width'] }
          ]
        });
      }
    }
  }
  else {
    ellipses.push({
      childNodes: [],
      children: [],
      localName: 'ellipse',
      nodeName: 'ellipse',
      nodeValue: null,
      tagName: 'ellipse',
      textContent: '',
      indexNodeXML: treeEllipses['indexNodeXML'],
      attributes: [
        { childNodes: [], localName: 'rx', name: 'rx', nodeName: 'rx', nodeValue: treeEllipses['rx'], textContent: treeEllipses['rx'], value: treeEllipses['rx'] },
        { childNodes: [], localName: 'cx', name: 'cx', nodeName: 'cx', nodeValue: treeEllipses['cx'], textContent: treeEllipses['cx'], value: treeEllipses['cx'] },
        { childNodes: [], localName: 'ry', name: 'ry', nodeName: 'ry', nodeValue: treeEllipses['ry'], textContent: treeEllipses['ry'], value: treeEllipses['ry'] },
        { childNodes: [], localName: 'cy', name: 'cy', nodeName: 'cy', nodeValue: treeEllipses['cy'], textContent: treeEllipses['cy'], value: treeEllipses['cy'] },
        { childNodes: [], localName: 'fill', name: 'fill', nodeName: 'fill', nodeValue: treeEllipses['fill'], textContent: treeEllipses['fill'], value: treeEllipses['fill'] },
        { childNodes: [], localName: 'stroke', name: 'stroke', nodeName: 'stroke', nodeValue: treeEllipses['stroke'], textContent: treeEllipses['stroke'], value: treeEllipses['stroke'] },
        { childNodes: [], localName: 'stroke-miterlimit', name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: treeEllipses['stroke-miterlimit'], textContent: treeEllipses['stroke-miterlimit'], value: treeEllipses['stroke-miterlimit'] },
        { childNodes: [], localName: 'stroke-width', name: 'stroke-width', nodeName: 'stroke-width', nodeValue: treeEllipses['stroke-width'], textContent: treeEllipses['stroke-width'], value: treeEllipses['stroke-width'] }
      ]
    });
  }
}

function getCircles(treeCircles, circles) {
  var currentNodes = [];
  if (treeCircles.length) {
    for (var i = 0; i < treeCircles.length; i++) {
      currentNodes.push(treeCircles[i]);
    }
    var len = currentNodes.length;
    for (var i = 0; i < currentNodes.length; i++) {

      if (currentNodes[i].length) {
        for (var j = 0; j < currentNodes[i].length; j++) {
          currentNodes.push(currentNodes[i][j]);
        }
      }
      else {
        circles.push({
          childNodes: [],
          children: [],
          localName: 'circle',
          nodeName: 'circle',
          nodeValue: null,
          tagName: 'circle',
          textContent: '',
          indexNodeXML: currentNodes[i]['indexNodeXML'],
          attributes: [
            { childNodes: [], localName: 'cy', name: 'cy', nodeName: 'cy', nodeValue: currentNodes[i]['cy'], textContent: currentNodes[i]['cy'], value: currentNodes[i]['cy'] },
            { childNodes: [], localName: 'cx', name: 'cx', nodeName: 'cx', nodeValue: currentNodes[i]['cx'], textContent: currentNodes[i]['cx'], value: currentNodes[i]['cx'] },
            { childNodes: [], localName: 'r', name: 'r', nodeName: 'r', nodeValue: currentNodes[i]['r'], textContent: currentNodes[i]['r'], value: currentNodes[i]['r'] },
            { childNodes: [], localName: 'fill', name: 'fill', nodeName: 'fill', nodeValue: currentNodes[i]['fill'], textContent: currentNodes[i]['fill'], value: currentNodes[i]['fill'] },
            { childNodes: [], localName: 'stroke', name: 'stroke', nodeName: 'stroke', nodeValue: currentNodes[i]['stroke'], textContent: currentNodes[i]['stroke'], value: currentNodes[i]['stroke'] },
            { childNodes: [], localName: 'stroke-miterlimit', name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: currentNodes[i]['stroke-miterlimit'], textContent: currentNodes[i]['stroke-miterlimit'], value: currentNodes[i]['stroke-miterlimit'] },
            { childNodes: [], localName: 'stroke-width', name: 'stroke-width', nodeName: 'stroke-width', nodeValue: currentNodes[i]['stroke-width'], textContent: currentNodes[i]['stroke-width'], value: currentNodes[i]['stroke-width'] }
          ]
        });
      }
    }
  }
  else {
    circles.push({
      childNodes: [],
      children: [],
      localName: 'circle',
      nodeName: 'circle',
      nodeValue: null,
      tagName: 'circle',
      textContent: '',
      indexNodeXML: treeCircles['indexNodeXML'],
      attributes: [
        { childNodes: [], localName: 'cy', name: 'cy', nodeName: 'cy', nodeValue: treeCircles['cy'], textContent: treeCircles['cy'], value: treeCircles['cy'] },
        { childNodes: [], localName: 'cx', name: 'cx', nodeName: 'cx', nodeValue: treeCircles['cx'], textContent: treeCircles['cx'], value: treeCircles['cx'] },
        { childNodes: [], localName: 'r', name: 'r', nodeName: 'r', nodeValue: treeCircles['r'], textContent: treeCircles['r'], value: treeCircles['r'] },
        { childNodes: [], localName: 'fill', name: 'fill', nodeName: 'fill', nodeValue: treeCircles['fill'], textContent: treeCircles['fill'], value: treeCircles['fill'] },
        { childNodes: [], localName: 'stroke', name: 'stroke', nodeName: 'stroke', nodeValue: treeCircles['stroke'], textContent: treeCircles['stroke'], value: treeCircles['stroke'] },
        { childNodes: [], localName: 'stroke-miterlimit', name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: treeCircles['stroke-miterlimit'], textContent: treeCircles['stroke-miterlimit'], value: treeCircles['stroke-miterlimit'] },
        { childNodes: [], localName: 'stroke-width', name: 'stroke-width', nodeName: 'stroke-width', nodeValue: treeCircles['stroke-width'], textContent: treeCircles['stroke-width'], value: treeCircles['stroke-width'] }
      ]
    });
  }
}

function getPolylines(treePolylines, polylines) {
  var currentNodes = [];
  if (treePolylines.length) {
    for (var i = 0; i < treePolylines.length; i++) {
      currentNodes.push(treePolylines[i]);
    }
    var len = currentNodes.length;
    for (var i = 0; i < currentNodes.length; i++) {

      if (currentNodes[i].length) {
        for (var j = 0; j < currentNodes[i].length; j++) {
          currentNodes.push(currentNodes[i][j]);
        }
      }
      else {
        polylines.push({
          childNodes: [],
          children: [],
          localName: 'polyline',
          nodeName: 'polyline',
          nodeValue: null,
          tagName: 'polyline',
          textContent: '',
          indexNodeXML: currentNodes[i]['indexNodeXML'],
          attributes: [
            { childNodes: [], localName: 'points', name: 'points', nodeName: 'points', nodeValue: currentNodes[i]['points'], textContent: currentNodes[i]['points'], value: currentNodes[i]['points'] },
            { childNodes: [], localName: 'fill', name: 'fill', nodeName: 'fill', nodeValue: currentNodes[i]['fill'], textContent: currentNodes[i]['fill'], value: currentNodes[i]['fill'] },
            { childNodes: [], localName: 'stroke', name: 'stroke', nodeName: 'stroke', nodeValue: currentNodes[i]['stroke'], textContent: currentNodes[i]['stroke'], value: currentNodes[i]['stroke'] },
            { childNodes: [], localName: 'stroke-linecap', name: 'stroke-linecap', nodeName: 'stroke-linecap', nodeValue: currentNodes[i]['stroke-linecap'], textContent: currentNodes[i]['stroke-linecap'], value: currentNodes[i]['stroke-linecap'] },
            { childNodes: [], localName: 'stroke-linejoin', name: 'stroke-linejoin', nodeName: 'stroke-linejoin', nodeValue: currentNodes[i]['stroke-linejoin'], textContent: currentNodes[i]['stroke-linejoin'], value: currentNodes[i]['stroke-linejoin'] },
            { childNodes: [], localName: 'stroke-width', name: 'stroke-width', nodeName: 'stroke-width', nodeValue: currentNodes[i]['stroke-width'], textContent: currentNodes[i]['stroke-width'], value: currentNodes[i]['stroke-width'] }
          ]
        });
      }
    }
  }
  else {

    polylines.push({
      childNodes: [],
      children: [],
      localName: 'polyline',
      nodeName: 'polyline',
      nodeValue: null,
      tagName: 'polyline',
      textContent: '',
      indexNodeXML: treePolylines['indexNodeXML'],
      attributes: [
        { childNodes: [], localName: 'points', name: 'points', nodeName: 'points', nodeValue: treePolylines['points'], textContent: treePolylines['points'], value: treePolylines['points'] },
        { childNodes: [], localName: 'fill', name: 'fill', nodeName: 'fill', nodeValue: treePolylines['fill'], textContent: treePolylines['fill'], value: treePolylines['fill'] },
        { childNodes: [], localName: 'stroke', name: 'stroke', nodeName: 'stroke', nodeValue: treePolylines['stroke'], textContent: treePolylines['stroke'], value: treePolylines['stroke'] },
        { childNodes: [], localName: 'stroke-linecap', name: 'stroke-linecap', nodeName: 'stroke-linecap', nodeValue: treePolylines['stroke-linecap'], textContent: treePolylines['stroke-linecap'], value: treePolylines['stroke-linecap'] },
        { childNodes: [], localName: 'stroke-linejoin', name: 'stroke-linejoin', nodeName: 'stroke-linejoin', nodeValue: treePolylines['stroke-linejoin'], textContent: treePolylines['stroke-linejoin'], value: treePolylines['stroke-linejoin'] },
        { childNodes: [], localName: 'stroke-width', name: 'stroke-width', nodeName: 'stroke-width', nodeValue: treePolylines['stroke-width'], textContent: treePolylines['stroke-width'], value: treePolylines['stroke-width'] }
      ]
    });
  }
}

function getPaths(treePaths, paths) {
  var currentNodes = [];
  if (treePaths.length) {
    for (var i = 0; i < treePaths.length; i++) {
      currentNodes.push(treePaths[i]);
    }
    var len = currentNodes.length;
    for (var i = 0; i < currentNodes.length; i++) {

      if (currentNodes[i].length) {
        for (var j = 0; j < currentNodes[i].length; j++) {
          currentNodes.push(currentNodes[i][j]);
        }
      }
      else {
        paths.push({
          childNodes: [],
          children: [],
          localName: 'path',
          nodeName: 'path',
          nodeValue: null,
          tagName: 'path',
          textContent: '',
          indexNodeXML: currentNodes[i]['indexNodeXML'],
          attributes: [
            { childNodes: [], localName: 'd', name: 'd', nodeName: 'd', nodeValue: currentNodes[i]['d'], textContent: currentNodes[i]['d'], value: currentNodes[i]['d'] },
            { childNodes: [], localName: 'fill', name: 'fill', nodeName: 'fill', nodeValue: currentNodes[i]['fill'], textContent: currentNodes[i]['fill'], value: currentNodes[i]['fill'] },
            { childNodes: [], localName: 'stroke', name: 'stroke', nodeName: 'stroke', nodeValue: currentNodes[i]['stroke'], textContent: currentNodes[i]['stroke'], value: currentNodes[i]['stroke'] },
            { childNodes: [], localName: 'stroke-miterlimit', name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: currentNodes[i]['stroke-miterlimit'], textContent: currentNodes[i]['stroke-miterlimit'], value: currentNodes[i]['stroke-miterlimit'] },
            { childNodes: [], localName: 'stroke-width', name: 'stroke-width', nodeName: 'stroke-width', nodeValue: currentNodes[i]['stroke-width'], textContent: currentNodes[i]['stroke-width'], value: currentNodes[i]['stroke-width'] }
          ]
        });
      }
    }
  }
  else {
    paths.push({
      childNodes: [],
      children: [],
      localName: 'path',
      nodeName: 'path',
      nodeValue: null,
      tagName: 'path',
      textContent: '',
      indexNodeXML: treePaths['indexNodeXML'],
      attributes: [
        { childNodes: [], localName: 'd', name: 'd', nodeName: 'd', nodeValue: treePaths['d'], textContent: treePaths['d'], value: treePaths['d'] },
        { childNodes: [], localName: 'fill', name: 'fill', nodeName: 'fill', nodeValue: treePaths['fill'], textContent: treePaths['fill'], value: treePaths['fill'] },
        { childNodes: [], localName: 'stroke', name: 'stroke', nodeName: 'stroke', nodeValue: treePaths['stroke'], textContent: treePaths['stroke'], value: treePaths['stroke'] },
        { childNodes: [], localName: 'stroke-miterlimit', name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: treePaths['stroke-miterlimit'], textContent: treePaths['stroke-miterlimit'], value: treePaths['stroke-miterlimit'] },
        { childNodes: [], localName: 'stroke-width', name: 'stroke-width', nodeName: 'stroke-width', nodeValue: treePaths['stroke-width'], textContent: treePaths['stroke-width'], value: treePaths['stroke-width'] }
      ]
    });
  }
}

function getLines(treeLines, lines) {
  var currentNodes = [];
  if (treeLines.length) {
    for (var i = 0; i < treeLines.length; i++) {
      currentNodes.push(treeLines[i]);
    }
    var len = currentNodes.length;
    for (var i = 0; i < currentNodes.length; i++) {

      if (currentNodes[i].length) {
        for (var j = 0; j < currentNodes[i].length; j++) {
          currentNodes.push(currentNodes[i][j]);
        }
      }
      else {
        lines.push({
          childNodes: [],
          children: [],
          localName: 'line',
          nodeName: 'line',
          nodeValue: null,
          tagName: 'line',
          textContent: '',
          indexNodeXML: currentNodes[i]['indexNodeXML'],
          attributes: [
            { childNodes: [], localName: 'x1', name: 'x1', nodeName: 'x1', nodeValue: currentNodes[i]['x1'], textContent: currentNodes[i]['x1'], value: currentNodes[i]['x1'] },
            { childNodes: [], localName: 'x2', name: 'x2', nodeName: 'x2', nodeValue: currentNodes[i]['x2'], textContent: currentNodes[i]['x2'], value: currentNodes[i]['x2'] },
            { childNodes: [], localName: 'y1', name: 'y1', nodeName: 'y1', nodeValue: currentNodes[i]['y1'], textContent: currentNodes[i]['y1'], value: currentNodes[i]['y1'] },
            { childNodes: [], localName: 'y2', name: 'y2', nodeName: 'y2', nodeValue: currentNodes[i]['y2'], textContent: currentNodes[i]['y2'], value: currentNodes[i]['y2'] },
            { childNodes: [], localName: 'fill', name: 'fill', nodeName: 'fill', nodeValue: currentNodes[i]['fill'], textContent: currentNodes[i]['fill'], value: currentNodes[i]['fill'] },
            { childNodes: [], localName: 'stroke', name: 'stroke', nodeName: 'stroke', nodeValue: currentNodes[i]['stroke'], textContent: currentNodes[i]['stroke'], value: currentNodes[i]['stroke'] },
            { childNodes: [], localName: 'stroke-miterlimit', name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: currentNodes[i]['stroke-miterlimit'], textContent: currentNodes[i]['stroke-miterlimit'], value: currentNodes[i]['stroke-miterlimit'] },
            { childNodes: [], localName: 'stroke-width', name: 'stroke-width', nodeName: 'stroke-width', nodeValue: currentNodes[i]['stroke-width'], textContent: currentNodes[i]['stroke-width'], value: currentNodes[i]['stroke-width'] }
          ]
        });
      }
    }
  }
  else {
    lines.push({
      childNodes: [],
      children: [],
      localName: 'line',
      nodeName: 'line',
      nodeValue: null,
      tagName: 'line',
      textContent: '',
      indexNodeXML: treeLines['indexNodeXML'],
      attributes: [
        { childNodes: [], localName: 'x1', name: 'x1', nodeName: 'x1', nodeValue: treeLines['x1'], textContent: treeLines['x1'], value: treeLines['x1'] },
        { childNodes: [], localName: 'x2', name: 'x2', nodeName: 'x2', nodeValue: treeLines['x2'], textContent: treeLines['x2'], value: treeLines['x2'] },
        { childNodes: [], localName: 'y1', name: 'y1', nodeName: 'y1', nodeValue: treeLines['y1'], textContent: treeLines['y1'], value: treeLines['y1'] },
        { childNodes: [], localName: 'y2', name: 'y2', nodeName: 'y2', nodeValue: treeLines['y2'], textContent: treeLines['y2'], value: treeLines['y2'] },
        { childNodes: [], localName: 'fill', name: 'fill', nodeName: 'fill', nodeValue: treeLines['fill'], textContent: treeLines['fill'], value: treeLines['fill'] },
        { childNodes: [], localName: 'stroke', name: 'stroke', nodeName: 'stroke', nodeValue: treeLines['stroke'], textContent: treeLines['stroke'], value: treeLines['stroke'] },
        { childNodes: [], localName: 'stroke-miterlimit', name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: treeLines['stroke-miterlimit'], textContent: treeLines['stroke-miterlimit'], value: treeLines['stroke-miterlimit'] },
        { childNodes: [], localName: 'stroke-width', name: 'stroke-width', nodeName: 'stroke-width', nodeValue: treeLines['stroke-width'], textContent: treeLines['stroke-width'], value: treeLines['stroke-width'] }
      ]
    });
  }
}

function getSymbol(treeG, gs) {
  var currentNodes = [];
  if (treeG.length) {
    for (var i = 0; i < treeG.length; i++) {
      currentNodes.push(treeG[i]);
    }
    var len = currentNodes.length;
    for (var i = 0; i < currentNodes.length; i++) {

      if (currentNodes[i].length) {
        for (var j = 0; j < currentNodes[i].length; j++) {
          currentNodes.push(currentNodes[i][j]);
        }
      }
      else {
        if (currentNodes[i].g) {
          for (var k = 0; k < currentNodes[i].g.length; k++) {
            currentNodes.push(currentNodes[i].g[k]);
          }
        }
        if (currentNodes[i].rect) {
          gs.rect.push(currentNodes[i].rect);
        }
        if (currentNodes[i].polygon) {
          gs.polygon.push(currentNodes[i].polygon);
        }
        if (currentNodes[i].polylines) {
          gs.polylines.push(currentNodes[i].polyline);
        }
        if (currentNodes[i].ellipse) {
          gs.ellipse.push(currentNodes[i].ellipse);
        }
        if (currentNodes[i].circle) {
          gs.circle.push(currentNodes[i].circle);
        }
        if (currentNodes[i].path) {
          gs.path.push(currentNodes[i].path);
        }
        if (currentNodes[i].line) {
          gs.line.push(currentNodes[i].line);
        }
      }
    }
  }
  else {
    if (treeG.rect) {
      gs.rect.push(treeG.rect);
    }
    if (treeG.polygon) {
      gs.polygon.push(treeG.polygon);
    }
    if (treeG.ellipse) {
      gs.ellipse.push(treeG.ellipse);
    }
    if (treeG.circle) {
      gs.circle.push(treeG.circle);
    }
    if (treeG.path) {
      gs.path.push(treeG.path);
    }
    if (treeG.polylines) {
      gs.polylines.push(treeG.polyline);
    }
    if (treeG.line) {
      gs.line.push(treeG.line);
    }
  }
}




function getGs(treeG, gs) {
  var currentNodes = [];
  if (treeG.length) {
    for (var i = 0; i < treeG.length; i++) {
      currentNodes.push(treeG[i]);
    }
    var len = currentNodes.length;
    for (var i = 0; i < currentNodes.length; i++) {

      if (currentNodes[i].length) {
        for (var j = 0; j < currentNodes[i].length; j++) {
          currentNodes.push(currentNodes[i][j]);
        }
      }
      else {
        if (currentNodes[i].g) {
          if (currentNodes[i].g.length) {
            for (var k = 0; k < currentNodes[i].g.length; k++) {
              currentNodes.push(currentNodes[i].g[k]);
            }
          }
          else {
            currentNodes.push(currentNodes[i].g);
          }
        }
        if (currentNodes[i].rect) {
          gs.rect.push(currentNodes[i].rect);
        }
        if (currentNodes[i].polygon) {
          gs.polygon.push(currentNodes[i].polygon);
        }
        if (currentNodes[i].ellipse) {
          gs.ellipse.push(currentNodes[i].ellipse);
        }
        if (currentNodes[i].polyline) {
          gs.polylines.push(currentNodes[i].polyline);
        }
        if (currentNodes[i].circle) {
          gs.circle.push(currentNodes[i].circle);
        }
        if (currentNodes[i].path) {
          gs.path.push(currentNodes[i].path);
        }
        if (currentNodes[i].line) {
          gs.line.push(currentNodes[i].line);
        }
      }
    }
  }
  else {
    if (treeG.rect) {
      gs.rect.push(treeG.rect);
    }
    if (treeG.polygon) {
      gs.polygon.push(treeG.polygon);
    }
    if (treeG.ellipse) {
      gs.ellipse.push(treeG.ellipse);
    }
    if (treeG.polyline) {
      gs.polylines.push(treeG.polyline);
    }
    if (treeG.circle) {
      gs.circle.push(treeG.circle);
    }
    if (treeG.path) {
      gs.path.push(treeG.path);
    }
    if (treeG.line) {
      gs.line.push(treeG.line);
    }
  }
}

function getRepresentation(tree) {
  var node = {
    tagName: 'svg',
    nodeName: 'svg',
    id: tree['id'],

    attributes: [
      { localName: 'xmlns', name: 'xmlns', nodeName: 'xmlns', nodeValue: tree['xmlns'], textContent: tree['xmlns'], value: tree['xmlns'] },
      { localName: 'xmlns:xlink', name: 'xmlns:xlink', nodeName: 'xmlns:xlink', nodeValue: tree['xmlns:xlink'], textContent: tree['xmlns:xlink'], value: tree['xmlns:xlink'] },
      { localName: 'version', name: 'version', nodeName: 'version', nodeValue: tree['version'], textContent: tree['version'], value: tree['version'] },
      { localName: 'id', name: 'id', nodeName: 'id', nodeValue: tree['id'], textContent: tree['id'], value: tree['id'] },
      { localName: 'x', name: 'x', nodeName: 'x', nodeValue: tree['x'], textContent: tree['x'], value: tree['x'] },
      { localName: 'y', name: 'y', nodeName: 'y', nodeValue: tree['y'], textContent: tree['y'], value: tree['y'] },
      { localName: 'viewbox', name: 'viewbox', nodeName: 'viewbox', nodeValue: tree['viewbox'], textContent: tree['viewbox'], value: tree['viewbox'] },
      { localName: 'enable-background', name: 'enable-background', nodeName: 'enable-background', nodeValue: tree['enable-background'], textContent: tree['enable-background'], value: tree['viewbox'] },
      { localName: 'xml:space', name: 'xml:space', nodeName: 'xml:space', nodeValue: tree['xml:space'], textContent: tree['xml:space'], value: tree['xml:space'] }
    ],
    childNodes: [],
    children: [],
  };


  var treeRects = tree.rect;
  var treePolygons = tree.polygon;
  var treeEllipses = tree.ellipse;
  var treeCircles = tree.circle;
  var treePaths = tree.path;
  var treeLines = tree.line;
  var treeG = tree.g;
  var treePolylines = tree.polyline;
  var treeSymbol = tree.symbol;

  var gs = {};
  gs.rect = [];
  gs.polygon = [];
  gs.ellipse = [];
  gs.circle = [];
  gs.path = [];
  gs.line = [];
  gs.polylines = [];

  if (treeG) {
    getGs(treeG, gs);

    if (gs.rect.length > 0) {
      for (var j = 0; j < gs.rect.length; j++) {
        var rectG = [];
        getRects(gs.rect[j], rectG);
        for (var i = 0; i < rectG.length; i++) {
          node.childNodes.push(rectG[i]);
        }
      }
    }
    if (gs.polygon.length > 0) {
      for (var j = 0; j < gs.polygon.length; j++) {
        var polygonG = [];
        getPolygons(gs.polygon[j], polygonG);
        for (var i = 0; i < polygonG.length; i++) {
          node.childNodes.push(polygonG[i]);
        }
      }
    }
    if (gs.ellipse.length > 0) {
      for (var j = 0; j < gs.ellipse.length; j++) {
        var ellipseG = [];
        getEllipses(gs.ellipse[j], ellipseG);
        for (var i = 0; i < ellipseG.length; i++) {
          node.childNodes.push(ellipseG[i]);
        }
      }
    }
    if (gs.circle.length > 0) {
      for (var j = 0; j < gs.circle.length; j++) {
        var circleG = [];
        getCircles(gs.circle[j], circleG);
        for (var i = 0; i < circleG.length; i++) {
          node.childNodes.push(circleG[i]);
        }
      }
    }
    if (gs.path.length > 0) {
      for (var j = 0; j < gs.path.length; j++) {
        var pathG = [];
        getPaths(gs.path[j], pathG);
        for (var i = 0; i < pathG.length; i++) {
          node.childNodes.push(pathG[i]);
        }
      }
    }
    if (gs.polylines.length > 0) {
      for (var j = 0; j < gs.polylines.length; j++) {
        var polylineG = [];
        getPolylines(gs.polylines[j], polylineG);
        for (var i = 0; i < polylineG.length; i++) {
          node.childNodes.push(polylineG[i]);
        }
      }
    }
    if (gs.line.length > 0) {
      for (var j = 0; j < gs.line.length; j++) {
        var lineG = [];
        getLines(gs.line[j], lineG);
        for (var i = 0; i < lineG.length; i++) {
          node.childNodes.push(lineG[i]);
        }
      }
    }
  }

  var polylines = [];
  if (treePolylines) {
    getPolylines(treePolylines, polylines);
    for (var i = 0; i < polylines.length; i++) {
      node.childNodes.push(polylines[i]);
    }
  }

  var polygons = [];
  if (treePolygons) {
    getPolygons(treePolygons, polygons);
    for (var i = 0; i < polygons.length; i++) {
      node.childNodes.push(polygons[i]);
    }
  }

  var ellipses = [];
  if (treeEllipses) {
    getEllipses(treeEllipses, ellipses);
    for (var i = 0; i < ellipses.length; i++) {
      node.childNodes.push(ellipses[i]);
    }
  }

  var circles = [];
  if (treeCircles) {
    getCircles(treeCircles, circles);
    for (var i = 0; i < circles.length; i++) {
      node.childNodes.push(circles[i]);
    }
  }

  var paths = [];
  if (treePaths) {
    getPaths(treePaths, paths);
    for (var i = 0; i < paths.length; i++) {
      node.childNodes.push(paths[i]);
    }
  }

  var lines = [];
  if (treeLines) {
    getLines(treeLines, lines);
    for (var i = 0; i < lines.length; i++) {
      node.childNodes.push(lines[i]);
    }
  }

  var rects = [];
  if (treeRects) {
    getRects(treeRects, rects);
    for (var i = 0; i < rects.length; i++) {
      node.childNodes.push(rects[i]);
    }
  }

  var sortNodes = [];
  for (var i = 0; i < node.childNodes.length; i++) {
    var p = node.childNodes[i].indexNodeXML;
    sortNodes[p] = node.childNodes[i];
  }
  node.childNodes = sortNodes;

  return node;

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


  while (win.pnl.progBar.value < win.pnl.progBar.maxvalue * 0.6) {
    // this is what causes the progress bar increase its progress  
    win.pnl.progBar.value++;
    win.pnl.progBarLabel.text = Math.floor(win.pnl.progBar.value) + "%";
    dialog.update();
    $.sleep(10);
  }

  var XMLRepresentation = getRepresentation(tree.getTree());

  while (win.pnl.progBar.value < win.pnl.progBar.maxvalue * 0.7) {
    // this is what causes the progress bar increase its progress  
    win.pnl.progBar.value++;
    win.pnl.progBarLabel.text = Math.floor(win.pnl.progBar.value) + "%";
    dialog.update();
    $.sleep(10);
  }

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