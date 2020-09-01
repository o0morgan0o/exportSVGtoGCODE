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

String.prototype.padStart = function(l, s, t){
    return s || (s = " "), (l -= this.length) > 0 ? (s = new Array(Math.ceil(l / s.length)
        + 1).join(s)).substr(0, t = !t ? l : t == 1 ? 0 : Math.ceil(l / 2))
        + this + s.substr(0, l - t) : this;
};

if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
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
    for (;;) {
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
    Array.prototype.slice = function(begin, end) {
      // IE < 9 gets unhappy with an undefined end argument
      end = (typeof end !== 'undefined') ? end : this.length;

      // For native Array objects, we use the native slice function
      if (Object.prototype.toString.call(this) === '[object Array]'){
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

  Array.prototype.map = function(callback/*, thisArg*/) {

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

// A 2D column vector
function Vec2(x, y) {
  if (x) {
    this.x = x;
  }

  if (y) {
    this.y = y;
  }
};

Vec2.prototype = {
  x : 0,
  y : 0,

  // set x and y
  // TODO: mark as dirty for other calculations
  set : function(x, y) {
    this.x = x;
    this.y = y;
    return this;
  },

  // reset x and y to zero
  // TODO: mark as dirty for other calcs
  zero : function() {
    this.x = 0;
    this.y = 0;
    return this;
  },

  // negate the values of this vector and return a new Vec2
  negate : function(returnNew) {
    if (returnNew) {
      return new Vec2(-this.x, -this.y);
    } else {
      this.x = -this.x;
      this.y = -this.y;
      return this;
    }
  },

  // Add the incoming `vec2` vector to this vector
  // TODO: mark dirty for other calcs
  add : function(vec2, returnNew) {
    if (!returnNew) {
      this.x += vec2.x;
      this.y += vec2.y;
      return this;
    } else {
      // Return a new vector if `returnNew` is truthy
      return new Vec2(
        this.x + vec2.x,
        this.y + vec2.y
      );
    }
  },

  // Subtract the incoming `vec2` from this vector
  // TODO: mark dirty for other calcs
  subtract : function(vec2, returnNew) {
    if (!returnNew) {
      this.x -= vec2.x;
      this.y -= vec2.y;
      return this;
    } else {
      // Return a new vector if `returnNew` is truthy
      return new Vec2(
        this.x - vec2.x,
        this.y - vec2.y
      );
    }
  },

  // Multiply this vector by the incoming `vec2`
  // TODO: mark dirty for other calcs
  multiply : function(vec2, returnNew) {
    var x,y;
    if (vec2.x !== undef) {
      x = vec2.x;
      y = vec2.y;

    // Handle incoming scalars
    } else {
      x = y = vec2;
    }

    if (!returnNew) {
      this.x *= x;
      this.y *= y;
      return this;
    } else {
      return new Vec2(
        this.x * x,
        this.y * y
      );
    }
  },

  // Rotate this vector. Accepts a `Rotation` or angle in radians.
  //
  // Passing a truthy `inverse` will cause the rotation to
  // be reversed.
  //
  // If `returnNew` is truthy, a new
  // `Vec2` will be created with the values resulting from
  // the rotation. Otherwise the rotation will be applied
  // to this vector directly, and this vector will be returned.
  rotate : function(r, inverse, returnNew) {
    var
    x = this.x,
    y = this.y,
    rx, cos, sin, ry;

    inverse = (inverse) ? -1 : 1;

    if (r.s !== undef) {
      sin = r.s;
      cos = r.c;
    } else {
      sin = Math.sin(r);
      cos = Math.cos(r)
    }

    var
    x = this.x,
    y = this.y,
    rx = cos * x - (inverse * sin) * y,
    ry = (inverse * sin) * x + cos * y;

    if (returnNew) {
      return new Vec2(rx, ry);
    } else {
      this.set(rx, ry);
      return this;
    }
  },

  // Calculate the length of this vector (the norm)
  // TODO: used cached value if available
  length : function() {
    var x = this.x, y = this.y;
    return Math.sqrt(x * x + y * y);
  },

  // Get the length squared. For performance, use this instead of `Vec2#length` (if possible).
  // TODO: use cached value if available
  lengthSquared : function() {
    var x = this.x, y = this.y;
    return x * x + y * y;
  },

  // Return the distance betwen this `Vec2` and the incoming vec2 vector
  // and return a scalar
  distance : function(vec2) {
    // TODO: prime candidate for optimizations
    return this.subtract(vec2, true).length();
  },

  distanceSquared : function(vec2) {
    var c = this.subtract(vec2, true);
    return dot22(c, c);
  },

  // Convert this vector into a unit vector.
  // Returns the length.
  normalize : function() {
    var length = this.length();

    // Don't bother normalizing a vector with a length ~0
    if (length < Number.MIN_VALUE) {
      return 0;
    }

    // Collect a ratio to shrink the x and y coords
    var invertedLength = 1/length;

    // Convert the coords to be greater than zero
    // but smaller than or equal to 1.0
    this.x *= invertedLength;
    this.y *= invertedLength;

    return length;
  },

  // Determine if another `Vec2`'s components match this ones
  equal : function(v, w) {
    if (w === undef) {
      return (
        this.x === v.x &&
        this.y == v.y
      );
    } else {
      return (
        this.x === v &&
        this.y === w
      )
    }
  },

  // Return a new `Vec2` that contains the absolute value of
  // each of this vector's parts
  abs : function() {
    return new Vec2(
      Math.abs(this.x),
      Math.abs(this.y)
    );
  },

  // Return a new `Vec2` consisting of the smallest values
  // from this vector and the incoming
  //
  // When returnNew is truthy, a new `Vec2` will be returned
  // otherwise the minimum values in either this or `v` will
  // be applied to this vector.
  min : function(v, returnNew) {
    var
    tx = this.x,
    ty = this.y,
    vx = v.x,
    vy = v.y,
    x = tx < vx ? tx : vx,
    y = ty < vy ? ty : vy;

    if (returnNew) {
      return new Vec2(x, y);
    } else {
      this.x = x;
      this.y = y;
      return this;
    }
  },

  // Return a new `Vec2` consisting of the largest values
  // from this vector and the incoming
  //
  // When returnNew is truthy, a new `Vec2` will be returned
  // otherwise the minimum values in either this or `v` will
  // be applied to this vector.
  max : function(v, returnNew) {
    var
    tx = this.x,
    ty = this.y,
    vx = v.x,
    vy = v.y,
    x = tx > vx ? tx : vx,
    y = ty > vy ? ty : vy;

    if (returnNew) {
      return new Vec2(x, y);
    } else {
      this.x = x;
      this.y = y;
      return this;
    }
  },

  // Clamp values into a range.
  // If this vector's values are lower than the `low`'s
  // values, then raise them.  If they are higher than
  // `high`'s then lower them.
  //
  // Passing returnNew as true will cause a new Vec2 to be
  // returned.  Otherwise, this vector's values will be clamped
  clamp : function(low, high, returnNew) {
    var ret = this.min(high, true).max(low)
    if (returnNew) {
      return ret;
    } else {
      this.x = ret.x;
      this.y = ret.y;
      return this;
    }
  },

  // Ensure this vector contains finite values
  isValid : function() {
    return isFinite(this.x) && isFinite(this.y);
  },

  // Get the skew vector such that dot(skew_vec, other) == cross(vec, other)
  skew : function() {
    // Returns a new vector.
    return new Vec2(-this.y, this.x)
  }
};

function containString(nameObjectXML, nodeName){
    for(var i =0; i<nameObjectXML.length;i++){
        if(nameObjectXML[i]==nodeName){
            return true;
            }
        }
    return false;
    }


var xml_header = '<?xml version="1.0"?>';
var sort_args = null;
var re_valid_tag_name  = /^\w[\w\-\:\.]*$/;
var indexNodeXML = 0;

XMLparser = {
    
    preserveDocumentNode :  false,
    preserveAttributes : false,
    preserveWhitespace :  false,
    lowerCase : false,
    forceArrays :  false,

    patTag : /([^<]*?)<([^>]+)>/g,
    patSpecialTag:  /^\s*([\!\?])/,
    patPITag : /^\s*\?/, 
    patCommentTag :  /^\s*\!--/,  
    patDTDTag : /^\s*\!DOCTYPE/,  
    patCDATATag : /^\s*\!\s*\[\s*CDATA/,  
    patStandardTag :  /^\s*(\/?)([\w\-\:\.]+)\s*([\s\S]*)$/,  
    patSelfClosing :  /\/\s*$/,  
    patAttrib : new RegExp("([\\w\\-\\:\\.]+)\\s*=\\s*([\\\"\\'])([^\\2]*?)\\2", "g"),  
    patPINode :  /^\s*\?\s*([\w\-\:]+)\s*(.*)$/,  
    patEndComment : /--$/,  
    patNextClose :  /([^>]*?)>/g, 
    patExternalDTDNode : new RegExp("^\\s*\\!DOCTYPE\\s+([\\w\\-\\:]+)\\s+(SYSTEM|PUBLIC)\\s+\\\"([^\\\"]+)\\\""),  
    patInlineDTDNode : /^\s*\!DOCTYPE\s+([\w\-\:]+)\s+\[/,  
    patEndDTD : /\]$/,  
    patDTDNode :  /^\s*\!DOCTYPE\s+([\w\-\:]+)\s+\[(.*)\]/, 
    patEndCDATA : /\]\]$/,  
    patCDATANode : /^\s*\!\s*\[\s*CDATA\s*\[([^]*)\]\]/,  

    attribsKey :  '_Attribs',   
    dataKey :   '_Data',  
    
    XMLparse : function(args, opts) {
        // class constructor for XML parser class
        // pass in args hash or text to parse
        if (!args) args = '';
        if (isa_hash(args)) {
            for (var key in args) this[key] = args[key];
        }
        else this.text = args || '';
        
        // options may be 2nd argument as well
        if (opts) {
            for (var key in opts) this[key] = opts[key];
        }
        
        this.tree = {};
        this.errors = [];
        this.piNodeList = [];
        this.dtdNodeList = [];
        this.documentNodeName = '';
        
        this.patTag.lastIndex = 0;
        if (this.text) this.parse();
        
        return this;
    },
     
    parse :function(branch, name) {
	// parse text into XML tree, recurse for nested nodes
	if (!branch) branch = this.tree;
	if (!name) name = null;
	var foundClosing = false;
	var matches = null;
	
	// match each tag, plus preceding text
	while ( matches = this.patTag.exec(this.text) ) {
		var before = matches[1];
		var tag = matches[2];
		
		// text leading up to tag = content of parent node
		if (before.match(/\S/)) {
			if (typeof(branch[this.dataKey]) != 'undefined') branch[this.dataKey] += ' '; else branch[this.dataKey] = '';
			branch[this.dataKey] += !this.preserveWhitespace ? trim(decode_entities(before)) : decode_entities(before);
		}
		
		// parse based on tag type
		if (tag.match(this.patSpecialTag)) {
			// special tag
			if (tag.match(this.patPITag)) tag = this.parsePINode(tag);
			else if (tag.match(this.patCommentTag)) tag = this.parseCommentNode(tag);
			else if (tag.match(this.patDTDTag)) tag = this.parseDTDNode(tag);
			else if (tag.match(this.patCDATATag)) {
				tag = this.parseCDATANode(tag);
				if (typeof(branch[this.dataKey]) != 'undefined') branch[this.dataKey] += ' '; else branch[this.dataKey] = '';
				branch[this.dataKey] += !this.preserveWhitespace ? trim(decode_entities(tag)) : decode_entities(tag);
			} // cdata
			else {
				this.throwParseError( "Malformed special tag", tag );
				break;
			} // error
			
			if (tag == null) break;
			continue;
		} // special tag
		else {
			// Tag is standard, so parse name and attributes (if any)
			var matches = tag.match(this.patStandardTag);
			if (!matches) {
				this.throwParseError( "Malformed tag", tag );
				break;
			}
			
			var closing = matches[1];
			var nodeName = this.lowerCase ? matches[2].toLowerCase() : matches[2];
			var attribsRaw = matches[3];
			
			// If this is a closing tag, make sure it matches its opening tag
			if (closing) {
				if (nodeName == (name || '')) {
					foundClosing = 1;
					break;
				}
				else {
					this.throwParseError( "Mismatched closing tag (expected </" + name + ">)", tag );
					break;
				}
			} // closing tag
			else {
				// Not a closing tag, so parse attributes into hash.  If tag
				// is self-closing, no recursive parsing is needed.
				var selfClosing = !!attribsRaw.match(this.patSelfClosing);
				var leaf = {};
				var attribs = leaf;
				
				// preserve attributes means they go into a sub-hash named "_Attribs"
				// the XML composer honors this for restoring the tree back into XML
				if (this.preserveAttributes) {
					leaf[this.attribsKey] = {};
					attribs = leaf[this.attribsKey];
				}
				
                  var nameObjectXML =["rect","polygon","ellipse","circle","path","line","polyline"]; 
                  if(containString(nameObjectXML, nodeName)){
                      attribs[ "indexNodeXML" ] = indexNodeXML;
                      indexNodeXML++;
                      }
                  
                  
				// parse attributes
				this.patAttrib.lastIndex = 0;
				while ( matches = this.patAttrib.exec(attribsRaw) ) {
					var key = this.lowerCase ? matches[1].toLowerCase() : matches[1];
					attribs[ key ] = decode_entities( matches[3] );
				} // foreach attrib
            
                   
				
				// if no attribs found, but we created the _Attribs subhash, clean it up now
				if (this.preserveAttributes && !num_keys(attribs)) {
					delete leaf[this.attribsKey];
				}
				
				// Recurse for nested nodes
				if (!selfClosing) {
					this.parse( leaf, nodeName );
					if (this.error()) break;
				}
				
				// Compress into simple node if text only
				var num_leaf_keys = num_keys(leaf);
				if ((typeof(leaf[this.dataKey]) != 'undefined') && (num_leaf_keys == 1)) {
					leaf = leaf[this.dataKey];
				}
				else if (!num_leaf_keys) {
					leaf = '';
				}
				
				// Add leaf to parent branch
				if (typeof(branch[nodeName]) != 'undefined') {
					if (isa_array(branch[nodeName])) {
						branch[nodeName].push( leaf );
					}
					else {
						var temp = branch[nodeName];
						branch[nodeName] = [ temp, leaf ];
					}
				}
				else if (this.forceArrays && (branch != this.tree)) {
					branch[nodeName] = [ leaf ];
				}
				else {
					branch[nodeName] = leaf;
				}
				
				if (this.error() || (branch == this.tree)) break;
			} // not closing
		} // standard tag
	} // main reg exp
	
	// Make sure we found the closing tag
	if (name && !foundClosing) {
		this.throwParseError( "Missing closing tag (expected </" + name + ">)", name );
	}
	
	// If we are the master node, finish parsing and setup our doc node
	if (branch == this.tree) {
		if (typeof(this.tree[this.dataKey]) != 'undefined') delete this.tree[this.dataKey];
		
		if (num_keys(this.tree) > 1) {
			this.throwParseError( 'Only one top-level node is allowed in document', first_key(this.tree) );
			return;
		}

		this.documentNodeName = first_key(this.tree);
		if (this.documentNodeName && !this.preserveDocumentNode) {
			this.tree = this.tree[this.documentNodeName];
		}
	}
},

     throwParseError : function(key, tag) {
	// log error and locate current line number in source XML document
	var parsedSource = this.text.substring(0, this.patTag.lastIndex);
	var eolMatch = parsedSource.match(/\n/g);
	var lineNum = (eolMatch ? eolMatch.length : 0) + 1;
	lineNum -= tag.match(/\n/) ? tag.match(/\n/g).length : 0;
	
	this.errors.push({ 
		type: 'Parse',
		key: key,
		text: '<' + tag + '>',
		line: lineNum
	});
	
	// Throw actual error (must wrap parse in try/catch)
	throw new Error( this.getLastError() );
},

     error: function() {
	// return number of errors
	return this.errors.length;
},

    getError: function(error) {
	// get formatted error
	var text = '';
	if (!error) return '';

	text = (error.type || 'General') + ' Error';
	if (error.code) text += ' ' + error.code;
	text += ': ' + error.key;
	
	if (error.line) text += ' on line ' + error.line;
	if (error.text) text += ': ' + error.text;

	return text;
},

    getLastError: function() {
	// Get most recently thrown error in plain text format
	if (!this.error()) return '';
	return this.getError( this.errors[this.errors.length - 1] );
},

     parsePINode: function(tag) {
	// Parse Processor Instruction Node, e.g. <?xml version="1.0"?>
	if (!tag.match(this.patPINode)) {
		this.throwParseError( "Malformed processor instruction", tag );
		return null;
	}
	
	this.piNodeList.push( tag );
	return tag;
},

     parseCommentNode: function(tag) {
	// Parse Comment Node, e.g. <!-- hello -->
	var matches = null;
	this.patNextClose.lastIndex = this.patTag.lastIndex;
	
	while (!tag.match(this.patEndComment)) {
		if (matches = this.patNextClose.exec(this.text)) {
			tag += '>' + matches[1];
		}
		else {
			this.throwParseError( "Unclosed comment tag", tag );
			return null;
		}
	}
	
	this.patTag.lastIndex = this.patNextClose.lastIndex;
	return tag;
},

     parseDTDNode: function(tag) {
	// Parse Document Type Descriptor Node, e.g. <!DOCTYPE ... >
	var matches = null;
	
	if (tag.match(this.patExternalDTDNode)) {
		// tag is external, and thus self-closing
		this.dtdNodeList.push( tag );
	}
	else if (tag.match(this.patInlineDTDNode)) {
		// Tag is inline, so check for nested nodes.
		this.patNextClose.lastIndex = this.patTag.lastIndex;
		
		while (!tag.match(this.patEndDTD)) {
			if (matches = this.patNextClose.exec(this.text)) {
				tag += '>' + matches[1];
			}
			else {
				this.throwParseError( "Unclosed DTD tag", tag );
				return null;
			}
		}
		
		this.patTag.lastIndex = this.patNextClose.lastIndex;
		
		// Make sure complete tag is well-formed, and push onto DTD stack.
		if (tag.match(this.patDTDNode)) {
			this.dtdNodeList.push( tag );
		}
		else {
			this.throwParseError( "Malformed DTD tag", tag );
			return null;
		}
	}
	else {
		this.throwParseError( "Malformed DTD tag", tag );
		return null;
	}
	
	return tag;
},

     getTree: function() {
	// get reference to parsed XML tree
	return this.tree;
},

     compose: function(indent_string, eol) {
	// compose tree back into XML
	if (typeof(eol) == 'undefined') eol = "\n";
	var tree = this.tree;
	if (this.preserveDocumentNode) tree = tree[this.documentNodeName];
	
	var raw = compose_xml( tree, this.documentNodeName, 0, indent_string, eol );
	var body = raw.replace(/^\s*\<\?.+?\?\>\s*/, '');
	var xml = '';
	
	if (this.piNodeList.length) {
		for (var idx = 0, len = this.piNodeList.length; idx < len; idx++) {
			xml += '<' + this.piNodeList[idx] + '>' + eol;
		}
	}
	else {
		xml += xml_header + eol;
	}
	
	if (this.dtdNodeList.length) {
		for (var idx = 0, len = this.dtdNodeList.length; idx < len; idx++) {
			xml += '<' + this.dtdNodeList[idx] + '>' + eol;
		}
	}
	
	xml += body;
	return xml;
},

//
// Static Utility Functions:
//
    
    
    }

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
	if (typeof(indent_string) == 'undefined') indent_string = "\t";
	if (typeof(eol) == 'undefined') eol = "\n";
	if (typeof(sort) == 'undefined') sort = true;
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
	
	if ((typeof(node) == 'object') && (node != null)) {
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
							xml += compose_xml( node[key], key, indent + 1, indent_string, eol, sort );
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
				xml += compose_xml( node[idx], name, indent, indent_string, eol, sort );
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
		if ((typeof(obj[key]) != 'object') || (typeof(obj[key].length) == 'undefined')) {
			var temp = obj[key];
			delete obj[key];
			obj[key] = new Array();
			obj[key][0] = temp;
		}
		return null;
	}
	else {
		if ((typeof(obj) != 'object') || (typeof(obj.length) == 'undefined')) { return [ obj ]; }
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
	return( !!arg && (typeof(arg) == 'object') && !isa_array(arg) );
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


function getAttribute(tag, attribute){
    for(var i =0; i< tag.attributes.length; i++){
        if(tag.attributes[i].nodeName == attribute){
            return tag.attributes[i].value;
            }
        }
    return '0';
    }


var settingsGCODE = {};
var exportFolder={};
var    sourceDoc,
    itemsToExport,
    exportDoc,
    svgOptions;
    
//~     var win = new Window("palette", "Script Progress", [150, 150, 600, 260]);   
//~     win.pnl = win.add("panel", [10, 10, 440, 100], "Progress"); 
//~     win.pnl.progBar = win.pnl.add("progressbar", [20, 35, 410, 60], 0, 100);
//~     win.pnl.progBarLabel = win.pnl.add("statictext", [20, 20, 320, 35], "0%"); 

function svg2gcode(svg, settings) {
  // clean off any preceding whitespace
  settings = settings || {};
  settings.start =  settings.start?settings.start:"";// end
  settings.materialWidth = settings.materialWidth || 1;
  settings.passWidth = 1;
  settings.scale = 1/app.activeDocument.rasterEffectSettings.resolution/0.393701;     //*106;
  settings.end = settings.end?settings.end:"";// end
  settings.lazerOff =settings.lazerOff?settings.lazerOff : ""; // lazerOff
  settings.lazerOn = settings.lazerOn?settings.lazerOn : "";   // lazerOn
  settings.cutZ = settings.cutZ || 1; // cut z
  settings.safeZ = settings.safeZ || 1;   // safe z
  settings.feedRate = settings.feedRate || 1400;
  settings.seekRate = settings.seekRate || 1100;
  settings.bitWidth = settings.bitWidth || 1; // in mm
  
  settings.colorCommandOn1 = settings.colorCommandOn1 || "";
  settings.colorCommandOff1 = settings.colorCommandOff1 || "";
  settings.colorCommandOn2 = settings.colorCommandOn2 || "";
  settings.colorCommandOff2 = settings.colorCommandOff2 || "";
  settings.colorCommandOn3 = settings.colorCommandOn3 || "";
  settings.colorCommandOff3 = settings.colorCommandOff3 || "";
  
  settings.color1 = settings.color1Text;
  settings.color2 = settings.color2Text;
  settings.color3 = settings.color3Text;
  

  var
  scale=function(val) {
      var resolution = app.activeDocument.rasterEffectSettings.resolution;
      var inchs = val / 72;
      var mm = (inchs / 0.39370)*10;
      if(mm<0)
      {
           mm = 0;
       }
       else
       {
           var mmString = mm.toString().split ('.');
           var aux = mmString[0] + (mmString[1] == null?'':'.') + (mmString[1] == null?'':mmString[1][0]) + (mmString[1] == null?'':mmString[1][1]);
           mm =  parseFloat(aux);
       }
       
     return mm;
    //return val * settings.scale;
  },
  paths = SVGReader.parse(svg, {}).allcolors,
  gcode,
  path;

  var idx = paths.length;
  while(idx--) {
    var subidx = paths[idx].length;
    var bounds = { x : Infinity , y : Infinity, x2 : -Infinity, y2: -Infinity, area : 0};

    // find lower and upper bounds
    while(subidx--) {
      if (paths[idx][subidx][0] < bounds.x) {
        bounds.x = paths[idx][subidx][0];
      }

      if (paths[idx][subidx][1] < bounds.y) {
        bounds.y = paths[idx][subidx][0];
      }

      if (paths[idx][subidx][0] > bounds.x2) {
        bounds.x2 = paths[idx][subidx][0];
      }
      if (paths[idx][subidx][1] > bounds.y2) {
        bounds.y2 = paths[idx][subidx][0];
      }
    }

    // calculate area
    bounds.area = (1 + bounds.x2 - bounds.x) * (1 + bounds.y2-bounds.y);
    paths[idx].bounds = bounds;
  }

  // cut the inside parts first
  paths.sort(function(a, b) {
    // sort by area
    return (a.bounds.area < b.bounds.area) ? -1 : 1;
  });

    gcode = [];
    
    gcode.push(settings.start);
    
    gcode.push('G0 F' + settings.seekRate);
    //gcode.push('G1 F' + settings.feedRate);
    gcode.push( [
        'G90',
        'G21'
      ].join(' '));

        var height = app.activeDocument.height; 
       var lastSamePath = false;
    
      var commandOnActive = true;
      for (var pathIdx = 0, pathLength = paths.length; pathIdx < pathLength; pathIdx++) {
        path = paths[pathIdx];
        
        win.pnl.progBar.value = win.pnl.progBar.maxvalue*0.7+ (pathIdx   *   (win.pnl.progBar.maxvalue*0.3 ))/pathLength;   
        win.pnl.progBarLabel.text = Math.floor(win.pnl.progBar.value)+"%";  
        dialog.update();
        
        var nextPath = paths[pathIdx+1];
        var finalPathX = nextPath!=null? scale(nextPath[0].x): -1;
        var finalPathY = nextPath!=null? scale(height - nextPath[0].y): -1;
        var initialPathX = scale(path[path.length -1].x);
        var initialPathY = scale(height - path[path.length -1].y);
        var isSamePath = finalPathX == initialPathX && finalPathY == initialPathY;
        
        
        // seek to index 0
        gcode.push(['G0',
          'X' + scale(path[0].x),
          'Y' + scale(height - path[0].y)
        ].join(' '));
        
        gcode.push('G1 F' + settings.feedRate);
          var stroke = path.node.stroke.split("#")[1];
          var colorComandOn = "";
          var colorComandOff = "";
          
          if(settings.color2 == stroke)
          {
              colorComandOn = settings.colorCommandOn2;
              colorComandOff = settings.colorCommandOff2;
          }
          else if(settings.color3 == stroke)
            {
              colorComandOn = settings.colorCommandOn3;
              colorComandOff = settings.colorCommandOff3;
          }
          else if(settings.color1 == stroke)
            {
              colorComandOn = settings.colorCommandOn1;
              colorComandOff = settings.colorCommandOff1;
          }
          else 
            {
              colorComandOn = settings.colorCommandOn4;
              colorComandOff = settings.colorCommandOff4;
          }
            if(commandOnActive){
                gcode.push(colorComandOn);
                commandOnActive = false;
                }
            
            if(!settings.LineWithVariationIsDesactivated){
                    var strokeWidth = path.node.strokeWidth;
                    var countZ = settings.LineWithVariationMax - settings.LineWithVariationMin;
                    var multMaxStrokeWidth = (MaxStrokeWidth-1) == 0? 0: countZ / (MaxStrokeWidth-1);

                    if(isSamePath || lastSamePath){
                            var strokeNextPath = nextPath !=null? nextPath.node.strokeWidth: strokeWidth;
                            var countZContinuo = settings.LineWithVariationMax - settings.LineWithVariationMin;
                            
                            var incPathWith =(multMaxStrokeWidth * (strokeWidth - 1));
                            var incNextPathWith =(multMaxStrokeWidth * (strokeNextPath - 1));
                            var dif = incNextPathWith - incPathWith;
                            var dist = 0;
                            for (var i=1 ; i < path.length; i++) {
                                    dist += Math.pow(Math.pow(path[i].x - path[i-1].x, 2)  + Math.pow(path[i].y - path[i-1].y, 2) , 0.5);
                                }
                            
                              // keep track of the current path being cut, as we may need to reverse it
                              var localPath = [];
                              var count = 0;
                              for (var segmentIdx=0, segmentLength = path.length; segmentIdx<segmentLength; segmentIdx++) {
                                    var segment = path[segmentIdx];
                                    if(segmentIdx>0){
                                        var distp = Math.pow(Math.pow((path[segmentIdx].x - path[segmentIdx - 1].x), 2) + Math.pow((path[segmentIdx].y - path[segmentIdx-1].y), 2), 0.5);
                                        count += (dif * distp)/dist;
                                        }
                                    
                                    var localSegment = ['G0',
                                      'X' + scale(segment.x),
                                      'Y' + scale(height - segment.y),
                                      'Z' + (settings.LineWithVariationMin + (multMaxStrokeWidth * (strokeWidth - 1)) + count)
                                    ].join(' ');
                                    // feed through the material
                                    gcode.push(localSegment);
                                    localPath.push(localSegment);
                              }
                        }
                    else{
                        lastSamePath = false;
                            gcode.push('G0 Z' + (settings.LineWithVariationMin + (multMaxStrokeWidth * (strokeWidth - 1))));
                        

                          // keep track of the current path being cut, as we may need to reverse it
                          var localPath = [];
                          for (var segmentIdx=0, segmentLength = path.length; segmentIdx<segmentLength; segmentIdx++) {
                            var segment = path[segmentIdx];

                            var localSegment = ['G0',
                              'X' + scale(segment.x),
                              'Y' + scale(height - segment.y)
                            ].join(' ');

                            // feed through the material
                            gcode.push(localSegment);
                            localPath.push(localSegment);
                          }
                      }
              }
          else{
                  //gcode.push(settings.powerOnDelay);

                  // keep track of the current path being cut, as we may need to reverse it
                  var localPath = [];
                  for (var segmentIdx=0, segmentLength = path.length; segmentIdx<segmentLength; segmentIdx++) {
                    var segment = path[segmentIdx];

                    var localSegment = ['G0',
                      'X' + scale(segment.x),
                      'Y' + scale(height - segment.y)
                    ].join(' ');

                    // feed through the material
                    gcode.push(localSegment);
                    localPath.push(localSegment);
                }
              }
            
            if(!isSamePath){
                 gcode.push(colorComandOff);
                commandOnActive = true;
                gcode.push('G0 F' + settings.seekRate);
                }
            else{
                commandOnActive = false;
                lastSamePath = true;
           }
      }
    
      // just wait there for a second
      //gcode.push('G4 P0');

      // turn off the spindle
      //gcode.push('M5');

      // go home
      //gcode.push('G1 Z0 F300');
      //gcode.push('G1 F' + settings.seekRate);
      gcode.push(settings.end);
      gcode.push('G0 X0 Y0');

      return gcode.join('\n');
}


/**
  SVG parser for the Lasersaur.
  Converts SVG DOM to a flat collection of paths.

  Copyright (c) 2011 Nortd Labs
  Open Source by the terms of the Gnu Public License (GPL3) or higher.

  Code inspired by cake.js, canvg.js, svg2obj.py, and Squirtle.
  Thank you for open sourcing your work!

  Usage:
  var boundarys = SVGReader.parse(svgstring, config)

  Features:
    * <svg> width and height, viewBox clipping.
    * paths, rectangles, ellipses, circles, lines, polylines and polygons
    * nested transforms
    * transform lists (transform="rotate(30) translate(2,2) scale(4)")
    * non-pixel units (cm, mm, in, pt, pc)
    * 'style' attribute and presentation attributes
    * curves, arcs, cirles, ellipses tesellated according to tolerance

  Intentinally not Supported:
    * markers
    * masking
    * em, ex, % units
    * text (needs to be converted to paths)
    * raster images
    * style sheets

  ToDo:
    * check for out of bounds geometry
*/



SVGReader = {

  boundarys : {},
    // output path flattened (world coords)
    // hash of path by color
    // each path is a list of subpaths
    // each subpath is a list of verteces
  style : {},
    // style at current parsing position
  tolerance : 0.01,
  // FLAG !!
    // max tollerance when tesselating curvy shapes


  parse : function(svgstring, config) {
    this.tolerance_squared = Math.pow(this.tolerance, 2);

    // parse xml
    var svgRootElement;
    svgRootElement =svgstring;

    // let the fun begin
    var node = {}
    MaxStrokeWidth = 0;
    this.boundarys.allcolors = []  // TODO: sort by color
    node.stroke = "#FFFFFF";
    node.xformToWorld = [1,0,0,1,0,0]
    this.parseChildren(svgRootElement, node)

    return this.boundarys
  },



  parseChildren : function(domNode, firstParent) {
      
         /** The script will crash if it is run several times without closing,
       because domNode gets corrupted. Here, domNode is only read to dNode the first pass
       and dnode will be used for following passes.
       /Gunnar
      */
     if(first_run){
        dNode = domNode;
        first_run = false;
     }
      // Gunnar
      
      var parentChilds = [[dNode,{}]];
      var node = firstParent;
      for(var i =0;i<parentChilds.length;i++){
            var tag = parentChilds[i][0];
            var parentNode = parentChilds[i][1];
          if (tag.childNodes && i >0) {
            if (tag.tagName) {
              // we are looping here through
              // all nodes with child nodes
              // others are irrelevant

              // 1.) setup a new node
              // and inherit from parent
              node = {};
              node.path = [];
              node.xform = [1,0,0,1,0,0];
              node.opacity = parentNode.opacity;
              node.display = parentNode.display;
              node.visibility = parentNode.visibility;
              node.fill = parentNode.fill;
              node.stroke = parentNode.stroke;
              node.color = parentNode.color;
              node.fillOpacity = parentNode.fillOpacity;
              node.strokeOpacity = parentNode.strokeOpacity;
              
              node.strokeWidth = tag.attributes[tag.attributes.length -1].value == null? 1: tag.attributes[tag.attributes.length -1].value;
              MaxStrokeWidth = node.strokeWidth>MaxStrokeWidth?node.strokeWidth:MaxStrokeWidth;

              // 2.) parse own attributes and overwrite
              if (tag.attributes) {
                for (var j=0; j<tag.attributes.length; j++) {
                  var attr = tag.attributes[j];
                  if (attr.nodeName && attr.nodeValue && this.SVGAttributeMapping[attr.nodeName]) {
                    this.SVGAttributeMapping[attr.nodeName](this, node, attr.nodeValue)
                  }
                }
              }
                
              // 3.) accumulate transformations
              node.xformToWorld = this.matrixMult(parentNode.xformToWorld, node.xform);

              // 4.) parse tag
              // with current attributes and transformation
              if (this.SVGTagMapping[tag.tagName]) {
                //if (node.stroke[0] == 255 && node.stroke[1] == 0 && node.stroke[2] == 0) {
                  this.SVGTagMapping[tag.tagName](this, tag, node);
                //}
              }

              // 5.) compile boundarys
              // before adding all path data convert to world coordinates
              for (var k=0; k<node.path.length; k++) {
                var subpath = node.path[k];
                for (var l=0; l<node.path[k].length; l++) {
                  var tmp =  this.matrixApply(node.xformToWorld, subpath[l]);
                  subpath[l] = new Vec2(tmp[0], tmp[1]);
                }
                subpath.node = node;

                this.boundarys.allcolors.push(subpath);
              }
            }
          }
          
          for(var j =0;j<parentChilds[i][0].childNodes.length;j++){
                parentChilds.push([parentChilds[i][0].childNodes[j],node]);
            }
      }
  },

//~   parseChildren : function(domNode, parentNode) {
//~     var childNodes = [];
//~     var currentChildNodes =domNode.childNodes;
//~     if(currentChildNodes!=null){
//~         for (var i=0; i<domNode.childNodes.length; i++) {
//~           var tag = domNode.childNodes[i]
//~           if (tag.childNodes) {
//~             if (tag.tagName) {
//~               // we are looping here through
//~               // all nodes with child nodes
//~               // others are irrelevant

//~               // 1.) setup a new node
//~               // and inherit from parent
//~               var node = {}
//~               node.path = [];
//~               node.xform = [1,0,0,1,0,0];
//~               node.opacity = parentNode.opacity;
//~               node.display = parentNode.display;
//~               node.visibility = parentNode.visibility;
//~               node.fill = parentNode.fill;
//~               node.stroke = parentNode.stroke;
//~               node.color = parentNode.color;
//~               node.fillOpacity = parentNode.fillOpacity;
//~               node.strokeOpacity = parentNode.strokeOpacity;

//~               // 2.) parse own attributes and overwrite
//~               if (tag.attributes) {
//~                 for (var j=0; j<tag.attributes.length; j++) {
//~                   var attr = tag.attributes[j]
//~                   if (attr.nodeName && attr.nodeValue && this.SVGAttributeMapping[attr.nodeName]) {
//~                     this.SVGAttributeMapping[attr.nodeName](this, node, attr.nodeValue)
//~                   }
//~                 }
//~               }

//~               // 3.) accumulate transformations
//~               node.xformToWorld = this.matrixMult(parentNode.xformToWorld, node.xform)

//~               // 4.) parse tag
//~               // with current attributes and transformation
//~               if (this.SVGTagMapping[tag.tagName]) {
//~                 //if (node.stroke[0] == 255 && node.stroke[1] == 0 && node.stroke[2] == 0) {
//~                   this.SVGTagMapping[tag.tagName](this, tag, node)
//~                 //}
//~               }

//~               // 5.) compile boundarys
//~               // before adding all path data convert to world coordinates
//~               for (var k=0; k<node.path.length; k++) {
//~                 var subpath = node.path[k];
//~                 for (var l=0; l<node.path[k].length; l++) {
//~                   var tmp =  this.matrixApply(node.xformToWorld, subpath[l]);
//~                   subpath[l] = new Vec2(tmp[0], tmp[1]);
//~                 }
//~                 subpath.node = node;

//~                 this.boundarys.allcolors.push(subpath);
//~               }
//~             }

//~             // recursive call
//~             this.parseChildren(tag, node)
//~           }
//~         }
//~     }
//~   },



  /////////////////////////////
  // recognized svg attributes

  SVGAttributeMapping : {
    DEG_TO_RAD : Math.PI / 180,
    RAD_TO_DEG : 180 / Math.PI,

    id : function(parser, node, val) {
      node.id = val
    },

    transform : function(parser, node, val) {
      // http://www.w3.org/TR/SVG11/coords.html#EstablishingANewUserSpace
      var xforms = []
      var segs = val.match(/[a-z]+\s*\([^)]*\)/ig)
      for (var i=0; i<segs.length; i++) {
        var kv = segs[i].split("(");
        var xformKind = kv[0].strip();
        var paramsTemp = kv[1].strip().slice(0,-1);
        var params = paramsTemp.split(/[\s,]+/).map(parseFloat)
        // double check params
        for (var j=0; j<params.length; j++) {
          if ( isNaN(params[j]) ) {
            ('warning', 'transform skipped; contains non-numbers');
            continue  // skip this transform
          }
        }

        // translate
        if (xformKind == 'translate') {
          if (params.length == 1) {
            xforms.push([1, 0, 0, 1, params[0], params[0]])
          } else if (params.length == 2) {
            xforms.push([1, 0, 0, 1, params[0], params[1]])
          } else {
            throw new Error('translate skipped; invalid num of params');
          }
        // rotate
        } else if (xformKind == 'rotate') {
          if (params.length == 3) {
            var angle = params[0] * this.DEG_TO_RAD
            xforms.push([1, 0, 0, 1, params[1], params[2]])
            xforms.push([Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle), 0, 0])
            xforms.push([1, 0, 0, 1, -params[1], -params[2]])
          } else if (params.length == 1) {
            var angle = params[0] * this.DEG_TO_RAD
            xforms.push([Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle), 0, 0])
          } else {
            throw new Error('rotate skipped; invalid num of params');
          }
        //scale
        } else if (xformKind == 'scale') {
          if (params.length == 1) {
            xforms.push([params[0], 0, 0, params[0], 0, 0])
          } else if (params.length == 2) {
            xforms.push([params[0], 0, 0, params[1], 0, 0])
          } else {
            throw new Error('scale skipped; invalid num of params');
          }
        // matrix
        } else if (xformKind == 'matrix') {
          if (params.length == 6) {
            xforms.push(params)
          }
        // skewX
        } else if (xformKind == 'skewX') {
          if (params.length == 1) {
            var angle = params[0]*this.DEG_TO_RAD
            xforms.push([1, 0, Math.tan(angle), 1, 0, 0])
          } else {
            throw new Error('skewX skipped; invalid num of params');
          }
        // skewY
        } else if (xformKind == 'skewY') {
          if (params.length == 1) {
            var angle = params[0]*this.DEG_TO_RAD
            xforms.push([1, Math.tan(angle), 0, 1, 0, 0])
          } else {
            throw new Error( 'skewY skipped; invalid num of params');
          }
        }
      }

      //calculate combined transformation matrix
      xform_combined = [1,0,0,1,0,0]
      for (var i=0; i<xforms.length; i++) {
        xform_combined = parser.matrixMult(xform_combined, xforms[i])
      }

      // assign
      node.xform = xform_combined
    },

    style : function(parser, node, val) {
      // style attribute
      // http://www.w3.org/TR/SVG11/styling.html#StyleAttribute
      // example: <rect x="200" y="100" width="600" height="300"
      //          style="fill: red; stroke: blue; stroke-width: 3"/>

      // relay to parse style attributes the same as Presentation Attributes
      var segs = val.split(";")
      for (var i=0; i<segs.length; i++) {
        var kv = segs[i].split(":")
        var k = kv[0].strip()
        if (this[k]) {
          var v = kv[1].strip()
          this[k](parser, node, v)
        }
      }
    },

    ///////////////////////////
    // Presentations Attributes
    // http://www.w3.org/TR/SVG11/styling.html#UsingPresentationAttributes
    // example: <rect x="200" y="100" width="600" height="300"
    //          fill="red" stroke="blue" stroke-width="3"/>

    opacity : function(parser, node, val) {
      node.opacity = parseFloat(val)
    },

    display : function (parser, node, val) {
      node.display = val
    },

    visibility : function (parser, node, val) {
      node.visibility = val
    },

    fill : function(parser, node, val) {
      node.fill = this.__parseColor(val, node.color)
    },

    stroke : function(parser, node, val) {
      //node.stroke = this.__parseColor(val, node.color)
      node.stroke = val;
    },

    color : function(parser, node, val) {
      if (val == 'inherit') return
      node.color = this.__parseColor(val, node.color)
    },

    'fill-opacity' : function(parser, node, val) {
      node.fillOpacity = Math.min(1,Math.max(0,parseFloat(val)))
    },

    'stroke-opacity' : function(parser, node, val) {
      node.strokeOpacity = Math.min(1,Math.max(0,parseFloat(val)))
    },

    // Presentations Attributes
    ///////////////////////////

    __parseColor : function(val, currentColor) {

      if (val.charAt(0) == '#') {
        if (val.length == 4)
          val = val.replace(/([^#])/g, '$1$1')
        var a = val.slice(1).match(/../g).map(
          function(i) { return parseInt(i, 16) })
        return a

      } else if (val.search(/^rgb\(/) != -1) {
        var a = val.slice(4,-1).split(",")
        for (var i=0; i<a.length; i++) {
          var c = a[i].strip()
          if (c.charAt(c.length-1) == '%')
            a[i] = Math.round(parseFloat(c.slice(0,-1)) * 2.55)
          else
            a[i] = parseInt(c)
        }
        return a

      } else if (val.search(/^rgba\(/) != -1) {
        var a = val.slice(5,-1).split(",")
        for (var i=0; i<3; i++) {
          var c = a[i].strip()
          if (c.charAt(c.length-1) == '%')
            a[i] = Math.round(parseFloat(c.slice(0,-1)) * 2.55)
          else
            a[i] = parseInt(c)
        }
        var c = a[3].strip()
        if (c.charAt(c.length-1) == '%')
          a[3] = Math.round(parseFloat(c.slice(0,-1)) * 0.01)
        else
          a[3] = Math.max(0, Math.min(1, parseFloat(c)))
        return a

      } else if (val.search(/^url\(/) != -1) {
        return [0,0,0]
      } else if (val == 'currentColor') {
        return currentColor
      } else if (val == 'none') {
        return 'none'
      } else if (val == 'freeze') { // SMIL is evil, but so are we
        return null
      } else if (val == 'remove') {
        return null
      } else { // unknown value, maybe it's an ICC color
        return val
      }
    }
  },

  // recognized svg attributes
  /////////////////////////////

  ///////////////////////////
  // recognized svg elements

  SVGTagMapping : {
    svg : function(parser, tag, node) {
      // has style attributes
      node.fill = 'black'
      node.stroke = 'none'
      // // parse document dimensions
      // node.width = 0
      // node.height = 0
      // var w = tag.getAttribute('width')
      // var h = tag.getAttribute('height')
      // if (!w) w = h
      // else if (!h) h = w
      // if (w) {
      //   var wpx = parser.parseUnit(w, cn, 'x')
      //   var hpx = parser.parseUnit(h, cn, 'y')
      // }
    },


    g : function(parser, tag, node) {
      // http://www.w3.org/TR/SVG11/struct.html#Groups
      // has transform and style attributes
    },


    polygon : function(parser, tag, node) {
      // http://www.w3.org/TR/SVG11/shapes.html#PolygonElement
      // has transform and style attributes
      var d = this.__getPolyPath(tag)
      d.push('z')
      parser.addPath(d, node)
    },


    polyline : function(parser, tag, node) {
      // http://www.w3.org/TR/SVG11/shapes.html#PolylineElement
      // has transform and style attributes
      var d = this.__getPolyPath(tag)
      parser.addPath(d, node)
    },

    __getPolyPath : function(tag) {
      // has transform and style attributes
      var subpath = []
      var verts = getAttribute(tag, "points").toString().split(/[\s,]+/).map(parseFloat);
      var vertnums = [];
      for(var i=0; i<verts.length; i++){
          if(verts[i]){
          vertnums.push(verts[i]);
          }
          }
      if (vertnums.length % 2 == 0) {
        var d = ['M']
        d.push(vertnums[0])
        d.push(vertnums[1])
        for (var i=2; i<vertnums.length; i+=2) {
          d.push(vertnums[i])
          d.push(vertnums[i+1])
        }
        return d
      }else if (verts.length % 2 == 0) {
        vertnums = verts;
        var d = ['M']
        d.push(vertnums[0])
        d.push(vertnums[1])
        for (var i=2; i<vertnums.length; i+=2) {
          d.push(vertnums[i])
          d.push(vertnums[i+1])
        }
        return d
      }
       else {
        throw new Error( "in __getPolyPath: odd number of verteces");
      }
    },

    rect : function(parser, tag, node) {
      // http://www.w3.org/TR/SVG11/shapes.html#RectElement
      // has transform and style attributes
      var w = parser.parseUnit(getAttribute(tag, 'width')) || 0;
      var h = parser.parseUnit(getAttribute(tag, 'height')) || 0;
      var x = parser.parseUnit(getAttribute(tag, 'x')) || 0;
      var y = parser.parseUnit(getAttribute(tag, 'y')) || 0;
      var rx = parser.parseUnit(getAttribute(tag, 'rx'))|| 0;
      var ry = parser.parseUnit(getAttribute(tag, 'ry'))|| 0;

      if(rx == null || ry == null) {  // no rounded corners
        var d = ['M', x, y, 'h', w, 'v', h, 'h', -w, 'z'];
        parser.addPath(d, node)
      } else {                       // rounded corners
        if ('ry' == null) { ry = rx; }
        if (rx < 0.0) { rx *=-1; }
        if (ry < 0.0) { ry *=-1; }
        d = ['M', x+rx , y ,
             'h', w-2*rx,
             'c', rx, 0.0, rx, ry, rx, ry,
             'v', h-ry,
             'c', '0.0', ry, -rx, ry, -rx, ry,
             'h', -w+2*rx,
             'c', -rx, '0.0', -rx, -ry, -rx, -ry,
             'v', -h+ry,
             'c', '0.0','0.0','0.0', -ry, rx, -ry,
             'z'];
        parser.addPath(d, node)
      }
    },


    line : function(parser, tag, node) {
      // http://www.w3.org/TR/SVG11/shapes.html#LineElement
      // has transform and style attributes
      var x1 = parser.parseUnit(getAttribute(tag, 'x1')) || 0
      var y1 = parser.parseUnit(getAttribute(tag, 'y1')) || 0
      var x2 = parser.parseUnit(getAttribute(tag, 'x2')) || 0
      var y2 = parser.parseUnit(getAttribute(tag, 'y2')) || 0
      var d = ['M', x1, y1, 'L', x2, y2]
      parser.addPath(d, node)
    },


    circle : function(parser, tag, node) {
      // http://www.w3.org/TR/SVG11/shapes.html#CircleElement
      // has transform and style attributes
      var r = parser.parseUnit(getAttribute(tag, 'r'))
      var cx = parser.parseUnit(getAttribute(tag, 'cx')) || 0
      var cy = parser.parseUnit(getAttribute(tag, 'cy')) || 0

      if (r > 0.0) {
        var d = ['M', cx-r, cy,
                 'A', r, r, 0, 0, 0, cx, cy+r,
                 'A', r, r, 0, 0, 0, cx+r, cy,
                 'A', r, r, 0, 0, 0, cx, cy-r,
                 'A', r, r, 0, 0, 0, cx-r, cy,
                 'Z'];
        parser.addPath(d, node);
      }
    },


    ellipse : function(parser, tag, node) {
      // has transform and style attributes
      var rx = parser.parseUnit(getAttribute(tag,'rx'))
      var ry = parser.parseUnit(getAttribute(tag,'ry'))
      var cx = parser.parseUnit(getAttribute(tag,'cx')) || 0
      var cy = parser.parseUnit(getAttribute(tag,'cy')) || 0

      if (rx > 0.0 && ry > 0.0) {
        var d = ['M', cx-rx, cy,
                 'A', rx, ry, 0, 0, 0, cx, cy+ry,
                 'A', rx, ry, 0, 0, 0, cx+rx, cy,
                 'A', rx, ry, 0, 0, 0, cx, cy-ry,
                 'A', rx, ry, 0, 0, 0, cx-rx, cy,
                 'Z'];
        parser.addPath(d, node);
      }
    },


    path : function(parser, tag, node) {
      // http://www.w3.org/TR/SVG11/paths.html
      // has transform and style attributes
      var d = getAttribute(tag,"d")
      parser.addPath(d, node)
    },

    image : function(parser, tag, node) {
      // not supported
      // has transform and style attributes
    },

    defs : function(parser, tag, node) {
      // not supported
      // http://www.w3.org/TR/SVG11/struct.html#Head
      // has transform and style attributes
    },

    style : function(parser, tag, node) {
      // not supported: embedded style sheets
      // http://www.w3.org/TR/SVG11/styling.html#StyleElement
      // instead presentation attributes and the 'style' attribute
      // var style = tag.getAttribute("style")
      // if (style) {
      //   var segs = style.split(";")
      //   for (var i=0; i<segs.length; i++) {
      //     var kv = segs[i].split(":")
      //     var k = kv[0].strip()
      //     if (this.SVGAttributeMapping[k]) {
      //       var v = kv[1].strip()
      //       this.SVGAttributeMapping[k].call(v, defs, st)
      //     }
      //   }
      // }
    }

  },

  // recognized svg elements
  ///////////////////////////

  //////////////////////////////////////////////////////////////////////////
  // handle path data
  // this is where all the geometry gets converted for the boundarys output

  addPath : function(d, node) {
    // http://www.w3.org/TR/SVG11/paths.html#PathData

    var tolerance2 = this.tolerance_squared;
    var totalMaxScale = this.matrixGetScale(node.xformToWorld);
    if (totalMaxScale != 0) {
      // adjust for possible transforms
      tolerance2 /= Math.pow(totalMaxScale, 2);
      // $().uxmessage('notice', "tolerance2: " + tolerance2.toString());
    }

    if ( typeof d == 'string') {
      // parse path string
      d = d.match(/([A-Za-z]|-?[0-9]+\.?[0-9]*(?:e-?[0-9]*)?)/g);
      for (var i=0; i<d.length; i++) {
        var num = parseFloat(d[i]);
        if (!isNaN(num)) {
          d[i] = num;
        }
      }
    }
    //$().uxmessage('notice', "d: " + d.toString());

    function nextIsNum () {
      return (d.length > 0) && (typeof(d[0]) === 'number');
    }

    function getNext() {
      if (d.length > 0) {
        return d.shift();  // pop first item
      } else {
        throw new Error("in addPath: not enough parameters");
        return null;
      }
    }

    var x = 0;
    var y = 0;
    var cmdPrev = '';
    var xPrevCp;
    var yPrevCp;
    var subpath = [];

    while (d.length > 0) {
      var cmd = getNext();
      switch(cmd) {
        case 'M':  // moveto absolute
          // start new subpath
          if ( subpath.length > 0) {
            node.path.push(subpath);
            subpath = [];
          }
          var implicitVerts = 0
          while (nextIsNum()) {
            x = getNext();
            y = getNext();
            subpath.push([x, y]);
            implicitVerts += 1;
          }
          break;
        case 'm':  //moveto relative
          // start new subpath
          if ( subpath.length > 0) {
            node.path.push(subpath);
            subpath = [];
          }
          if (cmdPrev == '') {
            // first treated absolute
            x = getNext();
            y = getNext();
            subpath.push([x, y]);
          }
          var implicitVerts = 0
          while (nextIsNum()) {
            // subsequent treated realtive
            x += getNext();
            y += getNext();
            subpath.push([x, y]);
            implicitVerts += 1;
          }
          break;
        case 'Z':  // closepath
        case 'z':  // closepath
          // loop and finalize subpath
          if ( subpath.length > 0) {
            subpath.push(subpath[0]);  // close
            node.path.push(subpath);
            x = subpath[subpath.length-1][0];
            y = subpath[subpath.length-1][1];
            subpath = [];
          }
          break;
        case 'L':  // lineto absolute
          while (nextIsNum()) {
            x = getNext();
            y = getNext();
            subpath.push([x, y]);
          }
          break;
        case 'l':  // lineto relative
          while (nextIsNum()) {
            x += getNext();
            y += getNext();
            subpath.push([x, y]);
          }
          break;
        case 'H':  // lineto horizontal absolute
          while (nextIsNum()) {
            x = getNext();
            subpath.push([x, y]);
          }
          break;
        case 'h':  // lineto horizontal relative
          while (nextIsNum()) {
            x += getNext();
            subpath.push([x, y]);
          }
          break;
        case 'V':  // lineto vertical absolute
          while (nextIsNum()) {
            y = getNext()
            subpath.push([x, y])
          }
          break;
        case 'v':  // lineto vertical realtive
          while (nextIsNum()) {
            y += getNext();
            subpath.push([x, y]);
          }
          break;
        case 'C':  // curveto cubic absolute
          while (nextIsNum()) {
            var x2 = getNext();
            var y2 = getNext();
            var x3 = getNext();
            var y3 = getNext();
            var x4 = getNext();
            var y4 = getNext();
            subpath.push([x,y]);
            this.addCubicBezier(subpath, x, y, x2, y2, x3, y3, x4, y4, 0, tolerance2);
            subpath.push([x4,y4]);
            x = x4;
            y = y4;
            xPrevCp = x3;
            yPrevCp = y3;
          }
          break;
        case 'c':  // curveto cubic relative
          while (nextIsNum()) {
            var x2 = x + getNext();
            var y2 = y + getNext();
            var x3 = x + getNext();
            var y3 = y + getNext();
            var x4 = x + getNext();
            var y4 = y + getNext();
            subpath.push([x,y]);
            this.addCubicBezier(subpath, x, y, x2, y2, x3, y3, x4, y4, 0, tolerance2);
            subpath.push([x4,y4]);
            x = x4;
            y = y4;
            xPrevCp = x3;
            yPrevCp = y3;
          }
          break;
        case 'S':  // curveto cubic absolute shorthand
          while (nextIsNum()) {
            var x2;
            var y2;
            if (cmdPrev.match(/[CcSs]/)) {
              x2 = x-(xPrevCp-x);
              y2 = y-(yPrevCp-y);
            } else {
              x2 = x;
              y2 = y;
            }
            var x3 = getNext();
            var y3 = getNext();
            var x4 = getNext();
            var y4 = getNext();
            subpath.push([x,y]);
            this.addCubicBezier(subpath, x, y, x2, y2, x3, y3, x4, y4, 0, tolerance2);
            subpath.push([x4,y4]);
            x = x4;
            y = y4;
            xPrevCp = x3;
            yPrevCp = y3;
          }
          break;
        case 's':  // curveto cubic relative shorthand
          while (nextIsNum()) {
            var x2;
            var y2;
            if (cmdPrev.match(/[CcSs]/)) {
              x2 = x-(xPrevCp-x);
              y2 = y-(yPrevCp-y);
            } else {
              x2 = x;
              y2 = y;
            }
            var x3 = x + getNext();
            var y3 = y + getNext();
            var x4 = x + getNext();
            var y4 = y + getNext();
            subpath.push([x,y]);
            this.addCubicBezier(subpath, x, y, x2, y2, x3, y3, x4, y4, 0, tolerance2);
            subpath.push([x4,y4]);
            x = x4;
            y = y4;
            xPrevCp = x3;
            yPrevCp = y3;
          }
          break;
        case 'Q':  // curveto quadratic absolute
          while (nextIsNum()) {
            var x2 = getNext();
            var y2 = getNext();
            var x3 = getNext();
            var y3 = getNext();
            subpath.push([x,y]);
            this.addQuadraticBezier(subpath, x, y, x2, y2, x3, y3, 0, tolerance2);
            subpath.push([x3,y3]);
            x = x3;
            y = y3;
          }
          break;
        case 'q':  // curveto quadratic relative
          while (nextIsNum()) {
            var x2 = x + getNext();
            var y2 = y + getNext();
            var x3 = x + getNext();
            var y3 = y + getNext();
            subpath.push([x,y]);
            this.addQuadraticBezier(subpath, x, y, x2, y2, x3, y3, 0, tolerance2);
            subpath.push([x3,y3]);
            x = x3;
            y = y3;
          }
          break;
        case 'T':  // curveto quadratic absolute shorthand
          while (nextIsNum()) {
            var x2;
            var y2;
            if (cmdPrev.match(/[QqTt]/)) {
              x2 = x-(xPrevCp-x);
              y2 = y-(yPrevCp-y);
            } else {
              x2 = x;
              y2 = y;
            }
            var x3 = getNext();
            var y3 = getNext();
            subpath.push([x,y]);
            this.addQuadraticBezier(subpath, x, y, x2, y2, x3, y3, 0, tolerance2);
            subpath.push([x3,y3]);
            x = x3;
            y = y3;
            xPrevCp = x2;
            yPrevCp = y2;
          }
          break;
        case 't':  // curveto quadratic relative shorthand
          while (nextIsNum()) {
            var x2;
            var y2;
            if (cmdPrev.match(/[QqTt]/)) {
              x2 = x-(xPrevCp-x);
              y2 = y-(yPrevCp-y);
            } else {
              x2 = x;
              y2 = y;
            }
            var x3 = x + getNext();
            var y3 = y + getNext();
            subpath.push([x,y]);
            this.addQuadraticBezier(subpath, x, y, x2, y2, x3, y3, 0, tolerance2);
            subpath.push([x3,y3]);
            x = x3;
            y = y3;
            xPrevCp = x2;
            yPrevCp = y2;
          }
          break;
        case 'A':  // eliptical arc absolute
          while (nextIsNum()) {
            var rx = getNext();
            var ry = getNext();
            var xrot = getNext();
            var large = getNext();
            var sweep = getNext();
            var x2 = getNext();
            var y2 = getNext();
            this.addArc(subpath, x, y, rx, ry, xrot, large, sweep, x2, y2, tolerance2);
            x = x2
            y = y2
          }
          break;
        case 'a':  // elliptical arc relative
          while (nextIsNum()) {
            var rx = getNext();
            var ry = getNext();
            var xrot = getNext();
            var large = getNext();
            var sweep = getNext();
            var x2 = x + getNext();
            var y2 = y + getNext();
            this.addArc(subpath, x, y, rx, ry, xrot, large, sweep, x2, y2, tolerance2);
            x = x2
            y = y2
          }
          break
      }
      cmdPrev = cmd;
    }
    // finalize subpath
    if ( subpath.length > 0) {
      node.path.push(subpath);
      subpath = [];
    }
  },


  addCubicBezier : function(subpath, x1, y1, x2, y2, x3, y3, x4, y4, level, tolerance2) {
    // for details see:
    // http://www.antigrain.com/research/adaptive_bezier/index.html
    // based on DeCasteljau Algorithm
    // The reason we use a subdivision algo over an incremental one
    // is we want to have control over the deviation to the curve.
    // This mean we subdivide more and have more curve points in
    // curvy areas and less in flatter areas of the curve.

    if (level > 18) {
      // protect from deep recursion cases
      // max 2**18 = 262144 segments
      return
    }

    // Calculate all the mid-points of the line segments
    var x12   = (x1 + x2) / 2.0
    var y12   = (y1 + y2) / 2.0
    var x23   = (x2 + x3) / 2.0
    var y23   = (y2 + y3) / 2.0
    var x34   = (x3 + x4) / 2.0
    var y34   = (y3 + y4) / 2.0
    var x123  = (x12 + x23) / 2.0
    var y123  = (y12 + y23) / 2.0
    var x234  = (x23 + x34) / 2.0
    var y234  = (y23 + y34) / 2.0
    var x1234 = (x123 + x234) / 2.0
    var y1234 = (y123 + y234) / 2.0

    // Try to approximate the full cubic curve by a single straight line
    var dx = x4-x1
    var dy = y4-y1

    var d2 = Math.abs(((x2 - x4) * dy - (y2 - y4) * dx))
    var d3 = Math.abs(((x3 - x4) * dy - (y3 - y4) * dx))

    if ( Math.pow(d2+d3, 2) < 5.0 * tolerance2 * (dx*dx + dy*dy) ) {
      // added factor of 5.0 to match circle resolution
      subpath.push([x1234, y1234])
      return
    }

    // Continue subdivision
    this.addCubicBezier(subpath, x1, y1, x12, y12, x123, y123, x1234, y1234, level+1, tolerance2);
    this.addCubicBezier(subpath, x1234, y1234, x234, y234, x34, y34, x4, y4, level+1, tolerance2);
  },


  addQuadraticBezier : function(subpath, x1, y1, x2, y2, x3, y3, level, tolerance2) {
    if (level > 18) {
      // protect from deep recursion cases
      // max 2**18 = 262144 segments
      return
    }

    // Calculate all the mid-points of the line segments
    var x12   = (x1 + x2) / 2.0
    var y12   = (y1 + y2) / 2.0
    var x23   = (x2 + x3) / 2.0
    var y23   = (y2 + y3) / 2.0
    var x123  = (x12 + x23) / 2.0
    var y123  = (y12 + y23) / 2.0

    var dx = x3-x1
    var dy = y3-y1
    var d = Math.abs(((x2 - x3) * dy - (y2 - y3) * dx))

    if ( d*d <= 5.0 * tolerance2 * (dx*dx + dy*dy) ) {
      // added factor of 5.0 to match circle resolution
      subpath.push([x123, y123])
      return
    }

    // Continue subdivision
    this.addQuadraticBezier(subpath, x1, y1, x12, y12, x123, y123, level + 1, tolerance2)
    this.addQuadraticBezier(subpath, x123, y123, x23, y23, x3, y3, level + 1, tolerance2)
  },


  addArc : function(subpath, x1, y1, rx, ry, phi, large_arc, sweep, x2, y2, tolerance2) {
    // Implemented based on the SVG implementation notes
    // plus some recursive sugar for incrementally refining the
    // arc resolution until the requested tolerance is met.
    // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
    var cp = Math.cos(phi);
    var sp = Math.sin(phi);
    var dx = 0.5 * (x1 - x2);
    var dy = 0.5 * (y1 - y2);
    var x_ = cp * dx + sp * dy;
    var y_ = -sp * dx + cp * dy;
    var r2 = (Math.pow(rx*ry,2)-Math.pow(rx*y_,2)-Math.pow(ry*x_,2)) /
             (Math.pow(rx*y_,2)+Math.pow(ry*x_,2));
    if (r2 < 0) { r2 = 0; }
    var r = Math.sqrt(r2);
    if (large_arc == sweep) { r = -r; }
    var cx_ = r*rx*y_ / ry;
    var cy_ = -r*ry*x_ / rx;
    var cx = cp*cx_ - sp*cy_ + 0.5*(x1 + x2);
    var cy = sp*cx_ + cp*cy_ + 0.5*(y1 + y2);

    function angle(u, v) {
      var a = Math.acos((u[0]*v[0] + u[1]*v[1]) /
              Math.sqrt((Math.pow(u[0],2) + Math.pow(u[1],2)) *
              (Math.pow(v[0],2) + Math.pow(v[1],2))));
      var sgn = -1;
      if (u[0]*v[1] > u[1]*v[0]) { sgn = 1; }
      return sgn * a;
    }

    var psi = angle([1,0], [(x_-cx_)/rx, (y_-cy_)/ry]);
    var delta = angle([(x_-cx_)/rx, (y_-cy_)/ry], [(-x_-cx_)/rx, (-y_-cy_)/ry]);
    if (sweep && delta < 0) { delta += Math.PI * 2; }
    if (!sweep && delta > 0) { delta -= Math.PI * 2; }

    function getVertex(pct) {
      var theta = psi + delta * pct;
      var ct = Math.cos(theta);
      var st = Math.sin(theta);
      return [cp*rx*ct-sp*ry*st+cx, sp*rx*ct+cp*ry*st+cy];
    }

    // let the recursive fun begin
    //
    function recursiveArc(parser, t1, t2, c1, c5, level, tolerance2) {
      if (level > 18) {
        // protect from deep recursion cases
        // max 2**18 = 262144 segments
        return
      }
      var tRange = t2-t1
      var tHalf = t1 + 0.5*tRange;
      var c2 = getVertex(t1 + 0.25*tRange);
      var c3 = getVertex(tHalf);
      var c4 = getVertex(t1 + 0.75*tRange);
      if (parser.vertexDistanceSquared(c2, parser.vertexMiddle(c1,c3)) > tolerance2) {
        recursiveArc(parser, t1, tHalf, c1, c3, level+1, tolerance2);
      }
      subpath.push(c3);
      if (parser.vertexDistanceSquared(c4, parser.vertexMiddle(c3,c5)) > tolerance2) {
        recursiveArc(parser, tHalf, t2, c3, c5, level+1, tolerance2);
      }
    }

    var t1Init = 0.0;
    var t2Init = 1.0;
    var c1Init = getVertex(t1Init);
    var c5Init = getVertex(t2Init);
    subpath.push(c1Init);
    recursiveArc(this, t1Init, t2Init, c1Init, c5Init, 0, tolerance2);
    subpath.push(c5Init);
  },


  // handle path data
  //////////////////////////////////////////////////////////////////////////

  parseUnit : function(val) {
    if (val == null) {
      return null
    } else {
      // assume 90dpi
      var multiplier = 1.0
      if (val.search(/cm$/i) != -1) {
        multiplier = 35.433070869
      } else if (val.search(/mm$/i) != -1) {
        multiplier = 3.5433070869
      } else if (val.search(/pt$/i) != -1) {
        multiplier = 1.25
      } else if (val.search(/pc$/i) != -1) {
        multiplier = 15.0
      } else if (val.search(/in$/i) != -1) {
        multiplier = 90.0
      }
      return multiplier * parseFloat(val)
    }
  },


  matrixMult : function(mA, mB) {
    return [ mA[0]*mB[0] + mA[2]*mB[1],
             mA[1]*mB[0] + mA[3]*mB[1],
             mA[0]*mB[2] + mA[2]*mB[3],
             mA[1]*mB[2] + mA[3]*mB[3],
             mA[0]*mB[4] + mA[2]*mB[5] + mA[4],
             mA[1]*mB[4] + mA[3]*mB[5] + mA[5] ]
  },


  matrixApply : function(mat, vec) {
    return [ mat[0]*vec[0] + mat[2]*vec[1] + mat[4],
             mat[1]*vec[0] + mat[3]*vec[1] + mat[5] ] ;
  },

  matrixGetScale : function(mat) {
    // extract absolute scale from matrix
    var sx = Math.sqrt(mat[0]*mat[0] + mat[1]*mat[1]);
    var sy = Math.sqrt(mat[2]*mat[2] + mat[3]*mat[3]);
    // return dominant axis
    if (sx > sy) {
      return sx;
    } else {
      return sy;
    }
  },


  vertexDistanceSquared : function(v1, v2) {
    return Math.pow(v2[0]-v1[0], 2) + Math.pow(v2[1]-v1[1], 2);
  },

  vertexMiddle : function(v1, v2) {
    return [ (v2[0]+v1[0])/2.0, (v2[1]+v1[1])/2.0 ];
  }

}

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
    
    
function displayDialog()
{
        var lastUnits = 0;
        
        //LOAD VALUES BY DEFAULT
        var settingsLoadFileDefault;
        settingsLoadFileDefault = new File( '~/Documents/' + 'SettingsForIllustratorScript-6473a58b-cd34-2dad-49b0-ad1f23fabad3.settings');
         
        var startDefault ="";
        var feedRateDefault ="";
        var seekRateDefault="";
        var directoryDefault ="";
        var filenameDefault="";
        var lazerPowerDefault="";
        var endDefault="";
        var commandBetweenDefault="";
        var colorCommandOn1Default ="";
              var  colorCommandOff1Default ="";
               var colorCommandOn2Default ="";
              var  colorCommandOff2Default ="";
                var colorCommandOn3Default ="";
                var colorCommandOff3Default ="";
               var colorCommandOn4Default ="";
               var colorCommandOff4Default ="";
               var color1TextDefault ="";
               var color2TextDefault ="";
               var color3TextDefault ="";
               var LineWithVariationMinDefault ="";
               var LineWithVariationMaxDefault ="";
        
        
         if(settingsLoadFileDefault.exists){
                settingsLoadFileDefault.open ("r");   
               
                var settingLoadDefault = settingsLoadFileDefault.read();  
                var mySettingsDefault = settingLoadDefault.split ('|');
                
                startDefault =mySettingsDefault[0];
                 feedRateDefault =mySettingsDefault[1];
                 seekRateDefault=mySettingsDefault[2];
                 directoryDefault =mySettingsDefault[3];
                 filenameDefault=mySettingsDefault[4];
                 endDefault=mySettingsDefault[5];
                 commandBetweenDefault=mySettingsDefault[6];
                 colorCommandOn1Default =mySettingsDefault[7];
                colorCommandOff1Default =mySettingsDefault[8];
                colorCommandOn2Default =mySettingsDefault[9];
                colorCommandOff2Default =mySettingsDefault[10];
                colorCommandOn3Default =mySettingsDefault[11];
                colorCommandOff3Default =mySettingsDefault[12];
                colorCommandOn4Default =mySettingsDefault[13];
                colorCommandOff4Default =mySettingsDefault[14];
                color1TextDefault =mySettingsDefault[15];
                color2TextDefault =mySettingsDefault[16];
                color3TextDefault =mySettingsDefault[17];
                LineWithVariationMinDefault =mySettingsDefault[18];
               LineWithVariationMaxDefault =mySettingsDefault[19];
                
                settingsLoadFileDefault.close();
        }
        
        
        
        // WINDOW PARAMS
        dialog = new Window ('dialog', "G-code generator");
        dialog.orientation = "row";
        dialog.alignChildren =  "left";
        
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
        var commandDefaultPanel = leftGroup.add ('panel', undefined, "Lines:", { borderStyle: "sunken" });
        commandDefaultPanel.orientation = "column";
        commandDefaultPanel.alignChildren = ["fill", "left"];
        
        //Command on for color default
        var colorCommandOn4Group = commandDefaultPanel.add('group');
        colorCommandOn4Group.orientation = "row";
        
         //Command off for color default
        //var colorCommandOff4Group = commandDefaultPanel.add('group');
        //colorCommandOff4Group.orientation = "row";
        
        var colorCommandOff4GroupLabel = colorCommandOn4Group.add ("statictext", undefined, "Off cmd");
        colorCommandOff4GroupLabel.size = [60, 20];
        
        //var colorCommandOff4GroupMeasure = colorCommandOn4Group.add ("statictext", undefined, '');
        //colorCommandOff4GroupMeasure.size = [58, 20];
        
        var colorCommandOff4GroupText = colorCommandOn4Group.add ("edittext", undefined, colorCommandOff4Default, { multiline:true, scrollable:false });
        colorCommandOff4GroupText.size = [150, 40];
        
        var colorCommandOn4GroupLabel = colorCommandOn4Group.add ("statictext", undefined, "On cmd");
        colorCommandOn4GroupLabel.size = [60, 20];
        
        var colorCommandOn4GroupText = colorCommandOn4Group.add ("edittext", undefined, colorCommandOn4Default, {multiline:true, scrollable:false});
        colorCommandOn4GroupText.size = [150, 40];
        
        // ++++ line with variation
        var LineWithVariationPanel = leftGroup.add ('panel', undefined, "Line with variation on Z:", { borderStyle: "sunken" });
        LineWithVariationPanel.orientation = "column";
        LineWithVariationPanel.alignChildren = ["fill", "left"];
        
        //Command on for color default
        var LineWithVariationMinGroup = LineWithVariationPanel.add('group');
        LineWithVariationMinGroup.orientation = "row";
        
        var LineWithVariationMinLabel = LineWithVariationMinGroup.add ("statictext", undefined, "Min cmd G0 Z");
        LineWithVariationMinLabel.size = [150, 20];
        
        var LineWithVariationMinText = LineWithVariationMinGroup.add ("edittext", undefined, LineWithVariationMinDefault, {readonly: false});
        LineWithVariationMinText.size = [60, 25];
        
        //Command off for color default
        //var colorCommandOff4Group = commandDefaultPanel.add('group');
        //colorCommandOff4Group.orientation = "row";
        
        var LineWithVariationMaxLabel = LineWithVariationMinGroup.add ("statictext", undefined, "Max cmd G0 Z");
        LineWithVariationMaxLabel.size = [150, 20];
        
        //var colorCommandOff4GroupMeasure = colorCommandOn4Group.add ("statictext", undefined, '');
        //colorCommandOff4GroupMeasure.size = [58, 20];
        
        var LineWithVariationMaxText = LineWithVariationMinGroup.add ("edittext", undefined, LineWithVariationMaxDefault, { readonly: false });
        LineWithVariationMaxText.size = [60, 25];
        
        // ++++ COLOR PANEL
        var colorPanel = leftGroup.add ('panel', undefined, "Color Lines:", { borderStyle: "sunken" });
        colorPanel.orientation = "column";
        colorPanel.alignChildren = ["fill", "left"];
        
        // COLOR 1
        var color1Group = colorPanel.add('group');
        color1Group.orientation = "row";
        
        var color1GroupLabel = color1Group.add ("statictext", undefined, "Color 1");
        color1GroupLabel.size = [270, 20];
        
        var color1GroupLabelNum = color1Group.add ("statictext", undefined, "#");
        color1GroupLabelNum.size = [11, 20];
        
        
        var color1Text = color1Group.add ("edittext", undefined, color1TextDefault, { readonly: false });
        color1Text.size = [150, 25]; 
        
        //Command on for color 1
        var colorCommandOn1Group = colorPanel.add('group');
        colorCommandOn1Group.orientation = "row";
        colorCommandOn1Group.size = [350, 70];
        
         //Command off for color 1
        //var colorCommandOff1Group = colorPanel.add('group');
        //colorCommandOff1Group.orientation = "row";
        
        var colorCommandOff1GroupLabel = colorCommandOn1Group.add ("statictext", undefined, "Off cmd");
        colorCommandOff1GroupLabel.size = [60, 20];
        
        //var colorCommandOff1GroupMeasure = colorCommandOff1Group.add ("statictext", undefined, '');
        //colorCommandOff1GroupMeasure.size = [50, 20];
        
        var colorCommandOff1GroupText = colorCommandOn1Group.add ("edittext", undefined, colorCommandOff1Default, { multiline:true, scrollable:false });
        colorCommandOff1GroupText.size = [150, 40];  
        
        var colorCommandOn1GroupLabel = colorCommandOn1Group.add ("statictext", undefined, "On cmd");
        colorCommandOn1GroupLabel.size = [60, 20];
        
        var colorCommandOn1GroupText = colorCommandOn1Group.add ("edittext", undefined, colorCommandOn1Default, {multiline:true, scrollable:false});
        colorCommandOn1GroupText.size = [150, 40];
        
        // COLOR 2
        var color2Group = colorPanel.add('group');
        color2Group.orientation = "row";
        
        var color2GroupLabel = color2Group.add ("statictext", undefined, "Color 2");
        color2GroupLabel.size = [270, 20];
        
        var color2GroupLabelNum = color2Group.add ("statictext", undefined, "#");
        color2GroupLabelNum.size = [11, 20];
        
        var color2Text = color2Group.add ("edittext", undefined, color2TextDefault, { readonly: false });
        color2Text.size = [150, 25];
        
         //Command on for color 2
        var colorCommandOn2Group = colorPanel.add('group');
        colorCommandOn2Group.orientation = "row";
        colorCommandOn2Group.size = [60, 70];
        
        //Command off for color 2
        //var colorCommandOff2Group = colorPanel.add('group');
        //colorCommandOff2Group.orientation = "row";
        
        var colorCommandOff2GroupLabel = colorCommandOn2Group.add ("statictext", undefined, "Off cmd");
        colorCommandOff2GroupLabel.size = [60, 20];
        
        //var colorCommandOff2GroupMeasure = colorCommandOff2Group.add ("statictext", undefined, '');
        //colorCommandOff2GroupMeasure.size = [50, 20];
        
        var colorCommandOff2GroupText = colorCommandOn2Group.add ("edittext", undefined, colorCommandOff2Default, { multiline:true, scrollable:false });
        colorCommandOff2GroupText.size = [150, 40];
        
        var colorCommandOn2GroupLabel = colorCommandOn2Group.add ("statictext", undefined, "On cmd");
        colorCommandOn2GroupLabel.size = [60, 20];
        
        var colorCommandOn2GroupText = colorCommandOn2Group.add ("edittext", undefined, colorCommandOn2Default, {multiline:true, scrollable:false});
        colorCommandOn2GroupText.size = [150, 40];
        
        
        // COLOR 3
        var color3Group = colorPanel.add('group');
        color3Group.orientation = "row";
        
        var color3Label = color3Group.add ("statictext", undefined, "Color 3");
        color3Label.size = [270, 20];
        
        var color3GroupLabelNum = color3Group.add ("statictext", undefined, "#");
        color3GroupLabelNum.size = [11, 20];
        
        var color3Text = color3Group.add ("edittext", undefined, color3TextDefault, { readonly: false });
        color3Text.size = [150, 25];
        
        
        //Command on for color 3
        var colorCommandOn3Group = colorPanel.add('group');
        colorCommandOn3Group.orientation = "row";
        colorCommandOn3Group.size = [60, 70];
        
         //Command off for color 3
        //var colorCommandOff3Group = colorPanel.add('group');
        //colorCommandOff3Group.orientation = "row";
        
        var colorCommandOff3GroupLabel = colorCommandOn3Group.add ("statictext", undefined, "Off cmd");
        colorCommandOff3GroupLabel.size = [60, 20];
        
        //var colorCommandOff3GroupMeasure = colorCommandOff3Group.add ("statictext", undefined, '');
        //colorCommandOff3GroupMeasure.size = [50, 20];
        
        var colorCommandOff3GroupText = colorCommandOn3Group.add ("edittext", undefined, colorCommandOff3Default, { multiline:true, scrollable:false });
        colorCommandOff3GroupText.size = [150, 40];
        
        var colorCommandOn3GroupLabel = colorCommandOn3Group.add ("statictext", undefined, "On cmd");
        colorCommandOn3GroupLabel.size = [60, 20];
        
        var colorCommandOn3GroupText = colorCommandOn3Group.add ("edittext", undefined, colorCommandOn3Default, {multiline:true, scrollable:false});
        colorCommandOn3GroupText.size = [150, 40];
        
        // ++++General Commands PANEL
        var generalCommandsPanel = rightGroup.add ('panel', undefined, "General commands:", { borderStyle: "sunken" });
        generalCommandsPanel.orientation = "column";
        generalCommandsPanel.alignChildren = ["fill", "left"];
        
        // Start and End
        var startGroup = generalCommandsPanel.add('group');
        startGroup.orientation = "row";
        var startButtonsGroup = generalCommandsPanel.add('group');
        startButtonsGroup.orientation = "row";
        
        var startLabel = startGroup.add ("statictext", undefined, 'Start:');
        startLabel.size = [170, 20];
        
        var endLabel = startGroup.add ("statictext", undefined, 'End:');
        endLabel.size = [45, 20];
        
        var startText = startButtonsGroup.add ("edittext", undefined, startDefault, { multiline:true, scrollable:false });
        startText.size = [150, 40];
        
        var endMeasure = startButtonsGroup.add ("statictext", undefined, '');
        endMeasure.size = [10, 20];
        
        var endGroupText = startButtonsGroup.add ("edittext", undefined, endDefault, { multiline:true, scrollable:false });
        endGroupText.size = [150, 40];          
        
        // ++++TOOLS PANEL
        var toolPanel = rightGroup.add ('panel', undefined, "Tool:", { borderStyle: "sunken" });
        toolPanel.orientation = "column";
        toolPanel.alignChildren = ["fill", "left"];        
        
        // FEED RATE
        var feedRateGroup = toolPanel.add('group');
        feedRateGroup.orientation = "row";
        
        var feedRateLabel = feedRateGroup.add ("statictext", undefined, 'Feed Rate (ms):');
        feedRateLabel.size = [90, 20];
        
        var feedRateText = feedRateGroup.add ("edittext", undefined, feedRateDefault, { readonly: false });
        feedRateText.size = [60, 25];
        
        // SEEK RATE
        var seekRateLabel = feedRateGroup.add ("statictext", undefined, 'Seek Rate (ms):');
        seekRateLabel.size = [90, 20];
        
        var seekRateText = feedRateGroup.add ("edittext", undefined, seekRateDefault, { readonly: false });
        seekRateText.size = [60, 25]; 
        
       
        // ++++ SETTINGS FILE PANEL
        var settingsPanel = rightGroup.add ('panel', undefined, "Settings:", { borderStyle: "sunken" });
        settingsPanel.orientation = "row";
        settingsPanel.alignChildren = ["fill", "left"];
        var settingsPanelMeasure = settingsPanel.add ("statictext", undefined, '');
        settingsPanelMeasure.size = [110, 31];
        
        //SETTINGS SAVE
        var settingsSaveGroup = settingsPanel.add ('group');
        settingsSaveGroup.orientation = "row";
        settingsSaveGroup.alignChildren = "left";
        
        var settingsSaveButton = settingsSaveGroup.add ('button', undefined, 'Save Settings', { name: "Dir" });
        settingsSaveButton.size = [100,25];
        settingsSaveButton.onClick = function ()
        {     
                var settingsSaveFile;
                settingsSaveFile = File.saveDialog( 'Select file to save settings file.', '*.settings' );
                 
                settingsSaveFile.open ("w");   
                var settingSave = startText.text + '|' + feedRateText.text + '|' + seekRateText.text + '|'+ directoryText.text + '|' + filenameText.text+ '|' + endGroupText.text + '|' + " " + '|' + colorCommandOn1GroupText.text+ '|' + colorCommandOff1GroupText.text+ '|' + colorCommandOn2GroupText.text+ '|'  +colorCommandOff2GroupText.text+ '|' +colorCommandOn3GroupText.text+ '|' +colorCommandOff3GroupText.text+ '|'  +colorCommandOn4GroupText.text+ '|' +colorCommandOff4GroupText.text+ '|' +color1Text.text+ '|' +color2Text.text+ '|' +color3Text.text+ '|' + LineWithVariationMinText.text+ '|' + LineWithVariationMaxText.text;
                settingsSaveFile.write(settingSave);  
                settingsSaveFile.close();                 
                
                alert ("Settings saved.", "Save");
                
        }      
    
        //SETTINGS LOAD
        var settingsLoadGroup = settingsPanel.add ('group');
        settingsLoadGroup.orientation = "row";
        settingsLoadGroup.alignChildren = "left";
        
        var settingsLoadButton = settingsLoadGroup.add ('button', undefined, 'Load Settings', { name: "Dir" });
        settingsLoadButton.size = [100,25];
    
        // ++++ OUTPUT FILE PANEL
        var outputFilePanel = rightGroup.add ('panel', undefined, "Output File:", { borderStyle: "sunken" });
        outputFilePanel.orientation = "column";
        outputFilePanel.alignChildren = ["fill", "left"];
        outputFilePanel.size = [365, 280];
        
        //DIRECTORY
        var directoryGroup = outputFilePanel.add ('group');
        directoryGroup.orientation = "row";
        directoryGroup.alignChildren = "left";

        var directoryLabel = directoryGroup.add ("statictext", undefined, 'Directory:');
        directoryLabel.size = [140, 20];
        
        var directoryText = directoryGroup.add ("edittext", undefined, directoryDefault, { readonly: true });
        directoryText.characters = 13; 
        
        var directoryButton = directoryGroup.add ('button', undefined, '...', { name: "Dir" });
        directoryButton.size = [30,25];
        directoryButton.onClick = function ()
        {     
                directoryText.text = Folder.selectDialog( 'Select folder to save G-Code file.', '~' );
        }
        //directoryText.text = File.saveDialog( 'Select folder to save G-Code file.', '.settings' );
    
        //FILENAME
        var filenameGroup = outputFilePanel.add ('group');
        filenameGroup.orientation = "row";
        filenameGroup.alignChildren = "left";

        var filenameLabel = filenameGroup.add ("statictext", undefined, 'Filename:');
        filenameLabel.size = [140, 20];
        
        var filenameText = filenameGroup.add ("edittext", undefined, filenameDefault, { readonly: false });
        filenameText.characters = 17; 
        
        //SUFFIX SETTINGS
        var suffixGroup = outputFilePanel.add ('group');
        suffixGroup.orientation = "row";
        suffixGroup.alignChildren = "left";
        
        var suffix = suffixGroup.add ("checkbox", undefined, 'Add numeric suffix to filename');
        suffix.value = true;
        
        //SAVE SETTINGS CHECKBOX
        var saveDefaultGroup = outputFilePanel.add ('group');
        saveDefaultGroup.orientation = "row";
        saveDefaultGroup.alignChildren = "left";
        
        var saveDefault = saveDefaultGroup.add ("checkbox", undefined, 'Save settings');
        saveDefault.value = true;
        
        //Progress bar
        win = outputFilePanel.add ('group');   
        win.pnl = win.add("panel", [10, 10, 340, 80], "Progress"); 
        win.pnl.progBarLabel = win.pnl.add("statictext", [20, 20, 320, 35], "0%"); 
        win.pnl.progBar = win.pnl.add("progressbar", [10, 45, 310, 60], 0, 100);
        
        
        var HyperGroup = rightGroup.add('group');
        HyperGroup.orientation = "row";
        var learnMoreLabel = HyperGroup.add ("statictext", undefined, 'Learn more:');
        learnMoreLabel.size = [70, 20];
        var siteLabel = HyperGroup.add ("statictext", undefined, 'http://www.diegomonzon.com');
        siteLabel.size = [200, 20];
        
        //BUTTONS
        var buttonsGroup = outputFilePanel.add ('group');
        buttonsGroup.alignment = [ "right", "bottom" ];
        buttonsGroup.orientation = "row";
        buttonsGroup.alignChildren = ["fill", "bottom"];
        
settingsLoadButton.onClick = function ()
        {     
                var settingsLoadFile;
                settingsLoadFile = File.openDialog( 'Select file to load settings file.', '*.settings' );
                 
                settingsLoadFile.open ("r");   
               
                var settingLoad = settingsLoadFile.read();  
                var mySettings = settingLoad.split ('|');
                
                startText.text =mySettings[0];
                 feedRateText.text =mySettings[1];
                 seekRateText.text=mySettings[2];
                 directoryText.text =mySettings[3];
                 filenameText.text=mySettings[4];
                 endGroupText.text=mySettings[5];
                 colorCommandOn1GroupText.text =mySettings[7];
                colorCommandOff1GroupText.text =mySettings[8];
                colorCommandOn2GroupText.text =mySettings[9];
                colorCommandOff2GroupText.text =mySettings[10];
                colorCommandOn3GroupText.text =mySettings[11];
                colorCommandOff3GroupText.text =mySettings[12];
                colorCommandOn4GroupText.text =mySettings[13];
                colorCommandOff4GroupText.text =mySettings[14];
                color1Text.text =mySettings[15];
                color2Text.text =mySettings[16];
                color3Text.text =mySettings[17];
                 LineWithVariationMinText.text =mySettings[18];
               LineWithVariationMaxText.text =mySettings[19];
               
               commandBetweenDefault="";
                settingsLoadFile.close();                 
                
                alert ("Settings loaded.", "Load");
        }      

                
        
        // SAVE BUTTON
        dialog.OKBtn = buttonsGroup.add ('button', undefined, 'Generate G-code', { name: "OK" });
        dialog.OKBtn.onClick = function ()
        {     
            var directory = new File(directoryText.text);
            var a = parseInt (LineWithVariationMaxText.text) ;
            var aa = parseInt (LineWithVariationMinText.text) ;
            
            if(directoryText.text=='null' || directoryText.text==''){
                alert ("Directory is required");
                }
            else if(color1Text.text.length != 6 || color2Text.text.length != 6 || color3Text.text.length != 6)
            {
                alert ("The colors fields must have hex format.");
                }
            else if(isNaN(a) && !isNaN(aa) || (isNaN(aa) && !isNaN(a))){
                alert ("Min cmd and Max cmd must be integers.");
                }
            else if(aa < 0 || (aa>a)){
                alert ("Max cmd must bigger than Min cmd.");
                }
            else{
                
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
                
                settingsGCODE.LineWithVariationMin = parseInt (LineWithVariationMinText.text);
                settingsGCODE.LineWithVariationMax = parseInt (LineWithVariationMaxText.text);
                settingsGCODE.LineWithVariationIsDesactivated = false;
                if(isNaN(a) && isNaN(aa)){
                    settingsGCODE.LineWithVariationIsDesactivated = true;
                    }
                  
                settingsGCODE.end=endGroupText.text;  
                settingsGCODE.commandBetween="";
            
                settingsGCODE.start=startText.text;
                settingsGCODE.feedRate=parseFloat (feedRateText.text);
                settingsGCODE.seekRate=parseFloat (seekRateText.text);
                
                settingsGCODE.suffix=suffix.value;
                
                exportFolder.fsDirectory = directoryText.text;
                exportFolder.fsName =filenameText.text;
                
                if(saveDefault.value){
                    var settingsSaveFileDefault;
                    settingsSaveFileDefault = new File( '~/Documents/' + 'SettingsForIllustratorScript-6473a58b-cd34-2dad-49b0-ad1f23fabad3.settings');
                     
                    settingsSaveFileDefault.open ("w");   
                    var settingSaveDefault = startText.text + '|' + feedRateText.text + '|' + seekRateText.text + '|'+ directoryText.text + '|' + filenameText.text+ '|' + endGroupText.text + '|' + " " + '|' + colorCommandOn1GroupText.text+ '|' + colorCommandOff1GroupText.text+ '|' + colorCommandOn2GroupText.text+ '|'  +colorCommandOff2GroupText.text+ '|' +colorCommandOn3GroupText.text+ '|' +colorCommandOff3GroupText.text+ '|'  +colorCommandOn4GroupText.text+ '|' +colorCommandOff4GroupText.text+ '|' +color1Text.text+ '|' +color2Text.text+ '|' +color3Text.text+ '|' + LineWithVariationMinText.text+ '|' + LineWithVariationMaxText.text;
                    
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
        dialog.cancelBtn = buttonsGroup.add ('button', undefined, 'Close', { name: "CANCEL" });
        dialog.cancelBtn.onClick = function () { dialog.close (false); };

        function getTargetFile(docName, ext, destFolder) {
            var newName = "";
            if (docName.indexOf('.') < 0) {
                newName = docName + ext;
            } else {
                var dot = docName.lastIndexOf('.');
                newName += docName.substring(0, dot);
                newName += ext;
            }
            
            var file = new File( destFolder + '/' + newName );
            
            if (file.open("w")) {
                file.close();
            }
            else {
                alert("Access to slected directory is denied");
            }
            return file;
        }

        function convertMilimeterToInch(units) 
        {
            return units / 25.4;
        }
    
         function convertInchToMilimeter(units) 
        {
            return units * 25.4;
        }
    
        function changeTagsToMilimeters()
        {
            bitWidthMeasure.text = "mm";
            materialWidthMeasure.text = "mm";
            cutZMeasure.text = "mm";
            safeZMeasure.text = "mm";
        }
    
        function changeTagsToInches()
        {
            bitWidthMeasure.text = "inch";
            materialWidthMeasure.text = "inch";
            cutZMeasure.text = "inch";
            safeZMeasure.text = "inch";
        }

        function convertValues(unit)
        {
            switch(unit) {
                case 0:
                    bitWidthText.text = convertMilimeterToInch(parseFloat (bitWidthText.text));
                    materialWidthText.text = convertMilimeterToInch(parseFloat (materialWidthText.text ));
                    cutZText.text = convertMilimeterToInch(parseFloat (cutZText.text));
                    safeZText.text = convertMilimeterToInch(parseFloat (safeZText.text));
                    break;
                 case 1:
                    bitWidthText.text = convertInchToMilimeter(parseFloat (bitWidthText.text));
                    materialWidthText.text = convertInchToMilimeter(parseFloat (materialWidthText.text ));
                    cutZText.text = convertInchToMilimeter(parseFloat (cutZText.text));
                    safeZText.text = convertInchToMilimeter(parseFloat (safeZText.text));
                    break;
            }
        }
    
        function getOptions()
        {
            var options = new ExportOptionsSVG();
            options.SVGDocumentEncoding = SVGDocumentEncoding.UTF8;
            
            return options;
        }

        return dialog.show();
}
    
    
    

try {
  if ( app.documents.length > 0 ) {
    
    
    
    var appVersion = parseInt (app.version);
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
    else
    {
            alert ("Sorry, this script requires Illustrator CS3 or later.");
    }    
    
  }
  else{
    throw new Error('There are no documents open. Open a document and try again.');
  }
}
catch(e) {
  alert(e.message, "Script Alert", true);
}

function main() {

    win.pnl.text = 'Progress';
    win.pnl.progBar.value=0;   
    win.pnl.progBarLabel.text = Math.floor(win.pnl.progBar.value)+"%"; 
    win.pnl.progBar.enabled = true;
    dialog.update();
    var name = '';
    exportSVG( app.activeDocument, name, 0, svgOptions);

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

  bbox = sourceDoc.pathItems.rectangle(rect[1], rect[0], rect[2]-rect[0], rect[1]-rect[3]);
  bbox.stroked = false;
  bbox.name = '__ILSVGEX__BOUNDING_BOX';

  name = artboard.name;
  
    win.pnl.text = 'Exporting ' + name;
    win.pnl.progBar.value=0;   
    win.pnl.progBarLabel.text = Math.floor(win.pnl.progBar.value)+"%";  
    dialog.update();

  prettyName = name.slice(0, -4).replace(/[^\w\s]|_/g, " ").replace(/\s+/g, "-").toLowerCase();

  app.activeDocument = exportDoc;

  for ( var i = 0, len = sourceDoc.pageItems.length; i < len; i++ ) {
    item = sourceDoc.pageItems[i];
    
    win.pnl.progBar.value =  (i   *   (win.pnl.progBar.maxvalue*0.4 ))/sourceDoc.pageItems.length    ;   
    win.pnl.progBarLabel.text = Math.floor(win.pnl.progBar.value)+"%";  
    win.pnl.progBar.onDraw();
    dialog.update();

    if( hitTest(item, bbox) && !item.locked && !anyParentLocked(item)  ) {
      item.duplicate( exportDoc, ElementPlacement.PLACEATEND );
    }
  }

  app.activeDocument = exportDoc;
  exportDoc.pageItems.getByName('__ILSVGEX__BOUNDING_BOX').remove();

  // Check if artboard is blank, clean up and exit
  if(!exportDoc.pageItems.length) {
    sourceDoc.pageItems.getByName('__ILSVGEX__BOUNDING_BOX').remove();
    return;
  }

  for ( i = 0, len = exportDoc.pageItems.length; i < len; i++) {
    item = exportDoc.pageItems[i];

    /*
     * For the moment, all pageItems are made visible and exported
     * unless they are locked. This may not make sense, but it'll
     * work for now.
     */
    item.hidden = false;
  }

  exportDoc.layers[0].name = prettyName;
  exportSVG( exportDoc, name, bbox.visibleBounds, svgOptions );

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

  for ( var i = 0, len = layer.pageItems.length; i < len; i++ ) {
    layerItems.push(layer.pageItems[i]);
  }
  recurseItems(layer.layers, layerItems);

  if ( !layerItems.length ) {
    return;
  }

  name = layer.name;
  
  prettyName = name.slice(0, -4).replace(/[^\w\s]|_/g, " ").replace(/\s+/g, "-").toLowerCase();

  for ( i = 0, len = layerItems.length; i < len; i++ ) {
    app.activeDocument = sourceDoc;
    item = layerItems[i];
    item.duplicate( exportDoc, ElementPlacement.PLACEATEND );
  }

  app.activeDocument = exportDoc;

  for ( i = 0, len = exportDoc.pageItems.length; i < len; i++) {

    item = exportDoc.pageItems[i];

    /*
     * For the moment, all pageItems are made visible and exported
     * unless they are locked. This may not make sense, but it'll
     * work for now.
     */
    item.hidden = false;

    if(item.name) {
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
    startX = ( !startX || startX > item.visibleBounds[0] ) ? item.visibleBounds[0] : startX;
    startY = ( !startY || startY < item.visibleBounds[1] ) ? item.visibleBounds[1] : startY;
    endX = ( !endX || endX < item.visibleBounds[2] ) ? item.visibleBounds[2] : endX;
    endY = ( !endY || endY > item.visibleBounds[3] ) ? item.visibleBounds[3] : endY;
  }

  exportDoc.layers[0].name = name.slice(0, -4);
  exportSVG( exportDoc, name, [startX, startY, endX, endY], svgOptions );
}

function exportItem(item) {

  var name,
      newItem;

  name = item.name;
  newItem = item.duplicate( exportDoc, ElementPlacement.PLACEATEND );
  newItem.hidden = false;
  newItem.name = item.name.slice(0, -4);
  app.activeDocument = exportDoc;

  exportDoc.layers[0].name = ' ';
  exportSVG( exportDoc, name, item.visibleBounds, svgOptions );
}

function getRects(treeRects, rects){
var currentNodes = [];
     if(treeRects.length){
         for(var i =0; i<treeRects.length;i++){
            currentNodes.push(treeRects[i]);
         }
         var len=currentNodes.length;
        for(var i =0; i<currentNodes.length;i++){
            
            if(currentNodes[i].length){
            for(var j =0; j<currentNodes[i].length;j++){
                currentNodes.push(currentNodes[i][j]);
                }
            }
            else{
                rects.push({
                    childNodes:[],
                    children:[],
                    localName:'rect',
                    nodeName:'rect',
                    nodeValue:null,
                    tagName:'rect',
                    textContent:'',
                    indexNodeXML: currentNodes[i]['indexNodeXML'],
                    attributes:[ 
                    {childNodes:[], localName: 'x',  name: 'x', nodeName: 'x', nodeValue: currentNodes[i]['x'], textContent: currentNodes[i]['x'], value: currentNodes[i]['x']}, 
                    {childNodes:[], localName: 'y',  name: 'y', nodeName: 'y', nodeValue: currentNodes[i]['y'], textContent: currentNodes[i]['y'], value: currentNodes[i]['y']}, 
                    {childNodes:[], localName: 'width',  name: 'width', nodeName: 'width', nodeValue: currentNodes[i]['width'], textContent: currentNodes[i]['width'], value: currentNodes[i]['width']}, 
                    {childNodes:[], localName: 'height',  name: 'height', nodeName: 'height', nodeValue: currentNodes[i]['height'], textContent: currentNodes[i]['height'], value: currentNodes[i]['height']}, 
                    {childNodes:[], localName: 'fill',  name: 'fill', nodeName: 'fill', nodeValue: currentNodes[i]['fill'], textContent: currentNodes[i]['fill'], value: currentNodes[i]['fill']}, 
                    {childNodes:[], localName: 'stroke',  name: 'stroke', nodeName: 'stroke', nodeValue: currentNodes[i]['stroke'], textContent: currentNodes[i]['stroke'], value: currentNodes[i]['stroke']},
                    {childNodes:[], localName: 'stroke-miterlimit',  name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: currentNodes[i]['stroke-miterlimit'], textContent: currentNodes[i]['stroke-miterlimit'], value: currentNodes[i]['stroke-miterlimit']},
                    {childNodes:[], localName: 'stroke-width',  name: 'stroke-width', nodeName: 'stroke-width', nodeValue: currentNodes[i]['stroke-width'], textContent: currentNodes[i]['stroke-width'], value: currentNodes[i]['stroke-width']}
                    ]
                });
                }
            }
    }
    else{
        rects.push({
            childNodes:[],
            children:[],
            localName:'rect',
            nodeName:'rect',
            nodeValue:null,
            tagName:'rect',
            textContent:'',
            indexNodeXML: treeRects['indexNodeXML'],
            attributes:[ 
            {childNodes:[], localName: 'x',  name: 'x', nodeName: 'x', nodeValue: treeRects['x'], textContent: treeRects['x'], value: treeRects['x']}, 
            {childNodes:[], localName: 'y',  name: 'y', nodeName: 'y', nodeValue: treeRects['y'], textContent: treeRects['y'], value: treeRects['y']}, 
            {childNodes:[], localName: 'fill',  name: 'fill', nodeName: 'fill', nodeValue: treeRects['fill'], textContent: treeRects['fill'], value: treeRects['fill']}, 
            {childNodes:[], localName: 'stroke',  name: 'stroke', nodeName: 'stroke', nodeValue: treeRects['stroke'], textContent: treeRects['stroke'], value: treeRects['stroke']},
            {childNodes:[], localName: 'stroke-miterlimit',  name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: treeRects['stroke-miterlimit'], textContent: treeRects['stroke-miterlimit'], value: treeRects['stroke-miterlimit']},
            {childNodes:[], localName: 'width',  name: 'width', nodeName: 'width', nodeValue: treeRects['width'], textContent: treeRects['width'], value: treeRects['width']}, 
            {childNodes:[], localName: 'height',  name: 'height', nodeName: 'height', nodeValue: treeRects['height'], textContent: treeRects['height'], value: treeRects['height']},
                    {childNodes:[], localName: 'stroke-width',  name: 'stroke-width', nodeName: 'stroke-width', nodeValue: treeRects['stroke-width'], textContent: treeRects['stroke-width'], value: treeRects['stroke-width']}
             ]
        });
        }
}

function getPolygons(treePolygons, polygons){
var currentNodes = [];
     if(treePolygons.length){
         for(var i =0; i<treePolygons.length;i++){
            currentNodes.push(treePolygons[i]);
         }
         var len=currentNodes.length;
        for(var i =0; i<currentNodes.length;i++){
            
            if(currentNodes[i].length){
            for(var j =0; j<currentNodes[i].length;j++){
                currentNodes.push(currentNodes[i][j]);
                }
            }
            else{
                polygons.push({
                    childNodes:[],
                    children:[],
                    localName:'polygon',
                    nodeName:'polygon',
                    nodeValue:null,
                    tagName:'polygon',
                    textContent:'',
                    indexNodeXML: currentNodes[i]['indexNodeXML'],
                    attributes:[ 
                    {childNodes:[], localName: 'points',  name: 'points', nodeName: 'points', nodeValue: currentNodes[i]['points'], textContent: currentNodes[i]['points'], value: currentNodes[i]['points']},
                    {childNodes:[], localName: 'fill',  name: 'fill', nodeName: 'fill', nodeValue: currentNodes[i]['fill'], textContent: currentNodes[i]['fill'], value: currentNodes[i]['fill']}, 
                    {childNodes:[], localName: 'stroke',  name: 'stroke', nodeName: 'stroke', nodeValue: currentNodes[i]['stroke'], textContent: currentNodes[i]['stroke'], value: currentNodes[i]['stroke']},
                    {childNodes:[], localName: 'stroke-miterlimit',  name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: currentNodes[i]['stroke-miterlimit'], textContent: currentNodes[i]['stroke-miterlimit'], value: currentNodes[i]['stroke-miterlimit']},
                    {childNodes:[], localName: 'stroke-width',  name: 'stroke-width', nodeName: 'stroke-width', nodeValue: currentNodes[i]['stroke-width'], textContent: currentNodes[i]['stroke-width'], value: currentNodes[i]['stroke-width']}
                    ]
                });
                }
            }
    }
    else{
        polygons.push({
            childNodes:[],
            children:[],
            localName:'polygon',
            nodeName:'polygon',
            nodeValue:null,
            tagName:'polygon',
            textContent:'',
            indexNodeXML: treePolygons['indexNodeXML'],
            attributes:[ 
            {childNodes:[], localName: 'points',  name: 'points', nodeName: 'points', nodeValue: treePolygons['points'], textContent: treePolygons['points'], value: treePolygons['points']}, 
            {childNodes:[], localName: 'fill',  name: 'fill', nodeName: 'fill', nodeValue: treePolygons['fill'], textContent: treePolygons['fill'], value: treePolygons['fill']}, 
            {childNodes:[], localName: 'stroke',  name: 'stroke', nodeName: 'stroke', nodeValue: treePolygons['stroke'], textContent: treePolygons['stroke'], value: treePolygons['stroke']},
            {childNodes:[], localName: 'stroke-miterlimit',  name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: treePolygons['stroke-miterlimit'], textContent: treePolygons['stroke-miterlimit'], value: treePolygons['stroke-miterlimit']},
                    {childNodes:[], localName: 'stroke-width',  name: 'stroke-width', nodeName: 'stroke-width', nodeValue: treePolygons['stroke-width'], textContent: treePolygons['stroke-width'], value: treePolygons['stroke-width']}
            ]
        });
        }
}

function getEllipses(treeEllipses, ellipses){
var currentNodes = [];
     if(treeEllipses.length){
         for(var i =0; i<treeEllipses.length;i++){
            currentNodes.push(treeEllipses[i]);
         }
         var len=currentNodes.length;
        for(var i =0; i<currentNodes.length;i++){
            
            if(currentNodes[i].length){
            for(var j =0; j<currentNodes[i].length;j++){
                currentNodes.push(currentNodes[i][j]);
                }
            }
            else{
                ellipses.push({
                    childNodes:[],
                    children:[],
                    localName:'ellipse',
                    nodeName:'ellipse',
                    nodeValue:null,
                    tagName:'ellipse',
                    textContent:'',
                    indexNodeXML: currentNodes[i]['indexNodeXML'],
                    attributes:[ 
                    {childNodes:[], localName: 'rx',  name: 'rx', nodeName: 'rx', nodeValue: currentNodes[i]['rx'], textContent: currentNodes[i]['rx'], value: currentNodes[i]['rx']},
                    {childNodes:[], localName: 'cx',  name: 'cx', nodeName: 'cx', nodeValue: currentNodes[i]['cx'], textContent: currentNodes[i]['cx'], value: currentNodes[i]['cx']}, 
                    {childNodes:[], localName: 'ry',  name: 'ry', nodeName: 'ry', nodeValue: currentNodes[i]['ry'], textContent: currentNodes[i]['ry'], value: currentNodes[i]['ry']}, 
                    {childNodes:[], localName: 'cy',  name: 'cy', nodeName: 'cy', nodeValue: currentNodes[i]['cy'], textContent: currentNodes[i]['cy'], value: currentNodes[i]['cy']},
                    {childNodes:[], localName: 'fill',  name: 'fill', nodeName: 'fill', nodeValue: currentNodes[i]['fill'], textContent: currentNodes[i]['fill'], value: currentNodes[i]['fill']}, 
                    {childNodes:[], localName: 'stroke',  name: 'stroke', nodeName: 'stroke', nodeValue: currentNodes[i]['stroke'], textContent: currentNodes[i]['stroke'], value: currentNodes[i]['stroke']},
                    {childNodes:[], localName: 'stroke-miterlimit',  name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: currentNodes[i]['stroke-miterlimit'], textContent: currentNodes[i]['stroke-miterlimit'], value: currentNodes[i]['stroke-miterlimit']},
                    {childNodes:[], localName: 'stroke-width',  name: 'stroke-width', nodeName: 'stroke-width', nodeValue: currentNodes[i]['stroke-width'], textContent: currentNodes[i]['stroke-width'], value: currentNodes[i]['stroke-width']}
                    ]
                });
                }
            }
    }
    else{
        ellipses.push({
            childNodes:[],
            children:[],
            localName:'ellipse',
            nodeName:'ellipse',
            nodeValue:null,
            tagName:'ellipse',
            textContent:'',
            indexNodeXML: treeEllipses['indexNodeXML'],
            attributes:[ 
            {childNodes:[], localName: 'rx',  name: 'rx', nodeName: 'rx', nodeValue: treeEllipses['rx'], textContent: treeEllipses['rx'], value: treeEllipses['rx']},
            {childNodes:[], localName: 'cx',  name: 'cx', nodeName: 'cx', nodeValue: treeEllipses['cx'], textContent: treeEllipses['cx'], value: treeEllipses['cx']}, 
            {childNodes:[], localName: 'ry',  name: 'ry', nodeName: 'ry', nodeValue: treeEllipses['ry'], textContent: treeEllipses['ry'], value: treeEllipses['ry']}, 
            {childNodes:[], localName: 'cy',  name: 'cy', nodeName: 'cy', nodeValue: treeEllipses['cy'], textContent: treeEllipses['cy'], value: treeEllipses['cy']},
            {childNodes:[], localName: 'fill',  name: 'fill', nodeName: 'fill', nodeValue: treeEllipses['fill'], textContent: treeEllipses['fill'], value: treeEllipses['fill']}, 
            {childNodes:[], localName: 'stroke',  name: 'stroke', nodeName: 'stroke', nodeValue: treeEllipses['stroke'], textContent: treeEllipses['stroke'], value: treeEllipses['stroke']},
            {childNodes:[], localName: 'stroke-miterlimit',  name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: treeEllipses['stroke-miterlimit'], textContent: treeEllipses['stroke-miterlimit'], value: treeEllipses['stroke-miterlimit']},
                    {childNodes:[], localName: 'stroke-width',  name: 'stroke-width', nodeName: 'stroke-width', nodeValue: treeEllipses['stroke-width'], textContent: treeEllipses['stroke-width'], value: treeEllipses['stroke-width']}
            ]
        });
        }
}

function getCircles(treeCircles, circles){
var currentNodes = [];
     if(treeCircles.length){
         for(var i =0; i<treeCircles.length;i++){
            currentNodes.push(treeCircles[i]);
         }
         var len=currentNodes.length;
        for(var i =0; i<currentNodes.length;i++){
            
            if(currentNodes[i].length){
            for(var j =0; j<currentNodes[i].length;j++){
                currentNodes.push(currentNodes[i][j]);
                }
            }
            else{
                circles.push({
                    childNodes:[],
                    children:[],
                    localName:'circle',
                    nodeName:'circle',
                    nodeValue:null,
                    tagName:'circle',
                    textContent:'',
                    indexNodeXML: currentNodes[i]['indexNodeXML'],
                    attributes:[ 
                    {childNodes:[], localName: 'cy',  name: 'cy', nodeName: 'cy', nodeValue: currentNodes[i]['cy'], textContent: currentNodes[i]['cy'], value: currentNodes[i]['cy']},
                    {childNodes:[], localName: 'cx',  name: 'cx', nodeName: 'cx', nodeValue: currentNodes[i]['cx'], textContent: currentNodes[i]['cx'], value: currentNodes[i]['cx']}, 
                    {childNodes:[], localName: 'r',  name: 'r', nodeName: 'r', nodeValue: currentNodes[i]['r'], textContent: currentNodes[i]['r'], value: currentNodes[i]['r']},
                    {childNodes:[], localName: 'fill',  name: 'fill', nodeName: 'fill', nodeValue: currentNodes[i]['fill'], textContent: currentNodes[i]['fill'], value: currentNodes[i]['fill']}, 
                    {childNodes:[], localName: 'stroke',  name: 'stroke', nodeName: 'stroke', nodeValue: currentNodes[i]['stroke'], textContent: currentNodes[i]['stroke'], value: currentNodes[i]['stroke']},
                    {childNodes:[], localName: 'stroke-miterlimit',  name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: currentNodes[i]['stroke-miterlimit'], textContent: currentNodes[i]['stroke-miterlimit'], value: currentNodes[i]['stroke-miterlimit']},
                    {childNodes:[], localName: 'stroke-width',  name: 'stroke-width', nodeName: 'stroke-width', nodeValue: currentNodes[i]['stroke-width'], textContent: currentNodes[i]['stroke-width'], value: currentNodes[i]['stroke-width']}
                    ]
                });
                }
            }
    }
    else{
        circles.push({
            childNodes:[],
            children:[],
            localName:'circle',
            nodeName:'circle',
            nodeValue:null,
            tagName:'circle',
            textContent:'',
            indexNodeXML: treeCircles['indexNodeXML'],
            attributes:[ 
            {childNodes:[], localName: 'cy',  name: 'cy', nodeName: 'cy', nodeValue: treeCircles['cy'], textContent: treeCircles['cy'], value: treeCircles['cy']},
            {childNodes:[], localName: 'cx',  name: 'cx', nodeName: 'cx', nodeValue: treeCircles['cx'], textContent: treeCircles['cx'], value: treeCircles['cx']}, 
            {childNodes:[], localName: 'r',  name: 'r', nodeName: 'r', nodeValue: treeCircles['r'], textContent: treeCircles['r'], value: treeCircles['r']},
            {childNodes:[], localName: 'fill',  name: 'fill', nodeName: 'fill', nodeValue: treeCircles['fill'], textContent: treeCircles['fill'], value: treeCircles['fill']}, 
            {childNodes:[], localName: 'stroke',  name: 'stroke', nodeName: 'stroke', nodeValue: treeCircles['stroke'], textContent: treeCircles['stroke'], value: treeCircles['stroke']},
            {childNodes:[], localName: 'stroke-miterlimit',  name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: treeCircles['stroke-miterlimit'], textContent: treeCircles['stroke-miterlimit'], value: treeCircles['stroke-miterlimit']},
                    {childNodes:[], localName: 'stroke-width',  name: 'stroke-width', nodeName: 'stroke-width', nodeValue: treeCircles['stroke-width'], textContent: treeCircles['stroke-width'], value: treeCircles['stroke-width']}
            ]
        });
        }
}

function getPolylines(treePolylines, polylines){
    var currentNodes = [];
     if(treePolylines.length){
         for(var i =0; i<treePolylines.length;i++){
            currentNodes.push(treePolylines[i]);
         }
         var len=currentNodes.length;
        for(var i =0; i<currentNodes.length;i++){
            
            if(currentNodes[i].length){
            for(var j =0; j<currentNodes[i].length;j++){
                currentNodes.push(currentNodes[i][j]);
                }
            }
            else{     
                polylines.push({
                    childNodes:[],
                    children:[],
                    localName:'polyline',
                    nodeName:'polyline',
                    nodeValue:null,
                    tagName:'polyline',
                    textContent:'',
                    indexNodeXML: currentNodes[i]['indexNodeXML'],
                    attributes:[ 
                    {childNodes:[], localName: 'points',  name: 'points', nodeName: 'points', nodeValue: currentNodes[i]['points'], textContent: currentNodes[i]['points'], value: currentNodes[i]['points']},  
                    {childNodes:[], localName: 'fill',  name: 'fill', nodeName: 'fill', nodeValue: currentNodes[i]['fill'], textContent: currentNodes[i]['fill'], value: currentNodes[i]['fill']}, 
                    {childNodes:[], localName: 'stroke',  name: 'stroke', nodeName: 'stroke', nodeValue: currentNodes[i]['stroke'], textContent: currentNodes[i]['stroke'], value: currentNodes[i]['stroke']},
                    {childNodes:[], localName: 'stroke-linecap',  name: 'stroke-linecap', nodeName: 'stroke-linecap', nodeValue: currentNodes[i]['stroke-linecap'], textContent: currentNodes[i]['stroke-linecap'], value: currentNodes[i]['stroke-linecap']},
                    {childNodes:[], localName: 'stroke-linejoin',  name: 'stroke-linejoin', nodeName: 'stroke-linejoin', nodeValue: currentNodes[i]['stroke-linejoin'], textContent: currentNodes[i]['stroke-linejoin'], value: currentNodes[i]['stroke-linejoin']},
                    {childNodes:[], localName: 'stroke-width',  name: 'stroke-width', nodeName: 'stroke-width', nodeValue: currentNodes[i]['stroke-width'], textContent: currentNodes[i]['stroke-width'], value: currentNodes[i]['stroke-width']}                   
                    ]
                });
                }
            }
    }
    else{
        
        polylines.push({
                    childNodes:[],
                    children:[],
                    localName:'polyline',
                    nodeName:'polyline',
                    nodeValue:null,
                    tagName:'polyline',
                    textContent:'',
                    indexNodeXML: treePolylines['indexNodeXML'],
                    attributes:[ 
                    {childNodes:[], localName: 'points',  name: 'points', nodeName: 'points', nodeValue: treePolylines['points'], textContent: treePolylines['points'], value: treePolylines['points']},  
                    {childNodes:[], localName: 'fill',  name: 'fill', nodeName: 'fill', nodeValue: treePolylines['fill'], textContent: treePolylines['fill'], value: treePolylines['fill']}, 
                    {childNodes:[], localName: 'stroke',  name: 'stroke', nodeName: 'stroke', nodeValue: treePolylines['stroke'], textContent: treePolylines['stroke'], value: treePolylines['stroke']},
                    {childNodes:[], localName: 'stroke-linecap',  name: 'stroke-linecap', nodeName: 'stroke-linecap', nodeValue: treePolylines['stroke-linecap'], textContent:treePolylines['stroke-linecap'], value: treePolylines['stroke-linecap']},
                    {childNodes:[], localName: 'stroke-linejoin',  name: 'stroke-linejoin', nodeName: 'stroke-linejoin', nodeValue: treePolylines['stroke-linejoin'], textContent: treePolylines['stroke-linejoin'], value: treePolylines['stroke-linejoin']},
                    {childNodes:[], localName: 'stroke-width',  name: 'stroke-width', nodeName: 'stroke-width', nodeValue: treePolylines['stroke-width'], textContent: treePolylines['stroke-width'], value: treePolylines['stroke-width']}                    
                    ]
                });
        }
}

function getPaths(treePaths, paths){
    var currentNodes = [];
     if(treePaths.length){
         for(var i =0; i<treePaths.length;i++){
            currentNodes.push(treePaths[i]);
         }
         var len=currentNodes.length;
        for(var i =0; i<currentNodes.length;i++){
            
            if(currentNodes[i].length){
            for(var j =0; j<currentNodes[i].length;j++){
                currentNodes.push(currentNodes[i][j]);
                }
            }
            else{
                paths.push({
                    childNodes:[],
                    children:[],
                    localName:'path',
                    nodeName:'path',
                    nodeValue:null,
                    tagName:'path',
                    textContent:'',
                    indexNodeXML: currentNodes[i]['indexNodeXML'],
                    attributes:[ 
                    {childNodes:[], localName: 'd',  name: 'd', nodeName: 'd', nodeValue: currentNodes[i]['d'], textContent: currentNodes[i]['d'], value: currentNodes[i]['d']},  
                    {childNodes:[], localName: 'fill',  name: 'fill', nodeName: 'fill', nodeValue: currentNodes[i]['fill'], textContent: currentNodes[i]['fill'], value: currentNodes[i]['fill']}, 
                    {childNodes:[], localName: 'stroke',  name: 'stroke', nodeName: 'stroke', nodeValue: currentNodes[i]['stroke'], textContent: currentNodes[i]['stroke'], value: currentNodes[i]['stroke']},
                    {childNodes:[], localName: 'stroke-miterlimit',  name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: currentNodes[i]['stroke-miterlimit'], textContent: currentNodes[i]['stroke-miterlimit'], value: currentNodes[i]['stroke-miterlimit']},
                    {childNodes:[], localName: 'stroke-width',  name: 'stroke-width', nodeName: 'stroke-width', nodeValue: currentNodes[i]['stroke-width'], textContent: currentNodes[i]['stroke-width'], value: currentNodes[i]['stroke-width']}                 
                    ]
                });
                }
            }
    }
    else{
        paths.push({
            childNodes:[],
            children:[],
            localName:'path',
            nodeName:'path',
            nodeValue:null,
            tagName:'path',
            textContent:'',
            indexNodeXML: treePaths['indexNodeXML'],
            attributes:[ 
            {childNodes:[], localName: 'd',  name: 'd', nodeName: 'd', nodeValue: treePaths['d'], textContent: treePaths['d'], value: treePaths['d']},  
            {childNodes:[], localName: 'fill',  name: 'fill', nodeName: 'fill', nodeValue: treePaths['fill'], textContent: treePaths['fill'], value: treePaths['fill']}, 
            {childNodes:[], localName: 'stroke',  name: 'stroke', nodeName: 'stroke', nodeValue: treePaths['stroke'], textContent: treePaths['stroke'], value: treePaths['stroke']},
            {childNodes:[], localName: 'stroke-miterlimit',  name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: treePaths['stroke-miterlimit'], textContent: treePaths['stroke-miterlimit'], value: treePaths['stroke-miterlimit']},
                    {childNodes:[], localName: 'stroke-width',  name: 'stroke-width', nodeName: 'stroke-width', nodeValue: treePaths['stroke-width'], textContent: treePaths['stroke-width'], value: treePaths['stroke-width']}                 
            ]
        });
        }
}

function getLines(treeLines, lines){
var currentNodes = [];
     if(treeLines.length){
         for(var i =0; i<treeLines.length;i++){
            currentNodes.push(treeLines[i]);
         }
         var len=currentNodes.length;
        for(var i =0; i<currentNodes.length;i++){
            
            if(currentNodes[i].length){
            for(var j =0; j<currentNodes[i].length;j++){
                currentNodes.push(currentNodes[i][j]);
                }
            }
            else{
                lines.push({
                    childNodes:[],
                    children:[],
                    localName:'line',
                    nodeName:'line',
                    nodeValue:null,
                    tagName:'line',
                    textContent:'',
                    indexNodeXML: currentNodes[i]['indexNodeXML'],
                    attributes:[ 
                    {childNodes:[], localName: 'x1',  name: 'x1', nodeName: 'x1', nodeValue: currentNodes[i]['x1'], textContent: currentNodes[i]['x1'], value: currentNodes[i]['x1']}, 
                    {childNodes:[], localName: 'x2',  name: 'x2', nodeName: 'x2', nodeValue: currentNodes[i]['x2'], textContent: currentNodes[i]['x2'], value: currentNodes[i]['x2']}, 
                    {childNodes:[], localName: 'y1',  name: 'y1', nodeName: 'y1', nodeValue: currentNodes[i]['y1'], textContent: currentNodes[i]['y1'], value: currentNodes[i]['y1']}, 
                    {childNodes:[], localName: 'y2',  name: 'y2', nodeName: 'y2', nodeValue: currentNodes[i]['y2'], textContent: currentNodes[i]['y2'], value: currentNodes[i]['y2']},
                    {childNodes:[], localName: 'fill',  name: 'fill', nodeName: 'fill', nodeValue: currentNodes[i]['fill'], textContent: currentNodes[i]['fill'], value: currentNodes[i]['fill']}, 
                    {childNodes:[], localName: 'stroke',  name: 'stroke', nodeName: 'stroke', nodeValue: currentNodes[i]['stroke'], textContent: currentNodes[i]['stroke'], value: currentNodes[i]['stroke']},
                    {childNodes:[], localName: 'stroke-miterlimit',  name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: currentNodes[i]['stroke-miterlimit'], textContent: currentNodes[i]['stroke-miterlimit'], value: currentNodes[i]['stroke-miterlimit']},
                    {childNodes:[], localName: 'stroke-width',  name: 'stroke-width', nodeName: 'stroke-width', nodeValue: currentNodes[i]['stroke-width'], textContent: currentNodes[i]['stroke-width'], value: currentNodes[i]['stroke-width']}                 
                    ]
                });
                }
            }
    }
    else{
        lines.push({
            childNodes:[],
            children:[],
            localName:'line',
            nodeName:'line',
            nodeValue:null,
            tagName:'line',
            textContent:'',
            indexNodeXML: treeLines['indexNodeXML'],
            attributes:[ 
            {childNodes:[], localName: 'x1',  name: 'x1', nodeName: 'x1', nodeValue: treeLines['x1'], textContent: treeLines['x1'], value: treeLines['x1']}, 
            {childNodes:[], localName: 'x2',  name: 'x2', nodeName: 'x2', nodeValue: treeLines['x2'], textContent: treeLines['x2'], value: treeLines['x2']}, 
            {childNodes:[], localName: 'y1',  name: 'y1', nodeName: 'y1', nodeValue: treeLines['y1'], textContent: treeLines['y1'], value: treeLines['y1']}, 
            {childNodes:[], localName: 'y2',  name: 'y2', nodeName: 'y2', nodeValue: treeLines['y2'], textContent: treeLines['y2'], value: treeLines['y2']},  
            {childNodes:[], localName: 'fill',  name: 'fill', nodeName: 'fill', nodeValue: treeLines['fill'], textContent: treeLines['fill'], value: treeLines['fill']}, 
            {childNodes:[], localName: 'stroke',  name: 'stroke', nodeName: 'stroke', nodeValue: treeLines['stroke'], textContent: treeLines['stroke'], value: treeLines['stroke']},
            {childNodes:[], localName: 'stroke-miterlimit',  name: 'stroke-miterlimit', nodeName: 'stroke-miterlimit', nodeValue: treeLines['stroke-miterlimit'], textContent: treeLines['stroke-miterlimit'], value: treeLines['stroke-miterlimit']},
                    {childNodes:[], localName: 'stroke-width',  name: 'stroke-width', nodeName: 'stroke-width', nodeValue: treeLines['stroke-width'], textContent: treeLines['stroke-width'], value: treeLines['stroke-width']}                 
            ]
        });
        }
}

function getSymbol(treeG, gs){
var currentNodes = [];
     if(treeG.length){
         for(var i =0; i<treeG.length;i++){
            currentNodes.push(treeG[i]);
         }
         var len=currentNodes.length;
        for(var i =0; i<currentNodes.length;i++){
            
            if(currentNodes[i].length){
                for(var j =0; j<currentNodes[i].length;j++){
                    currentNodes.push(currentNodes[i][j]);
                    }
            }
            else{
                if(currentNodes[i].g){
                 for(var k =0; k<currentNodes[i].g.length;k++){
                    currentNodes.push(currentNodes[i].g[k]);
                 }
                }
                if(currentNodes[i].rect){
                    gs.rect.push(currentNodes[i].rect);
                    }
                if(currentNodes[i].polygon){
                    gs.polygon.push( currentNodes[i].polygon);
                    }
                if(currentNodes[i].polylines){
                    gs.polylines.push( currentNodes[i].polyline);
                    }
                if(currentNodes[i].ellipse){
                    gs.ellipse.push( currentNodes[i].ellipse);
                    }
                if(currentNodes[i].circle){
                    gs.circle.push( currentNodes[i].circle);
                    }
                if(currentNodes[i].path){
                    gs.path.push( currentNodes[i].path);
                    }
                if(currentNodes[i].line){
                    gs.line.push( currentNodes[i].line);
                    }
                }
            }
    }
    else{
                if(treeG.rect){
                    gs.rect.push(treeG.rect);
                    }
                if(treeG.polygon){
                    gs.polygon.push( treeG.polygon);
                    }
                if(treeG.ellipse){
                    gs.ellipse.push(treeG.ellipse);
                    }
                if(treeG.circle){
                    gs.circle.push( treeG.circle);
                    }
                if(treeG.path){
                    gs.path.push( treeG.path);
                    }
                if(treeG.polylines){
                    gs.polylines.push( treeG.polyline);
                    }
                if(treeG.line){
                    gs.line.push( treeG.line);
                    }
        }
}




function getGs(treeG, gs){
var currentNodes = [];
     if(treeG.length){
         for(var i =0; i<treeG.length;i++){
            currentNodes.push(treeG[i]);
         }
         var len=currentNodes.length;
        for(var i =0; i<currentNodes.length;i++){
            
            if(currentNodes[i].length){
                for(var j =0; j<currentNodes[i].length;j++){
                    currentNodes.push(currentNodes[i][j]);
                    }
            }
            else{
                if(currentNodes[i].g){
                    if(currentNodes[i].g.length){
                         for(var k =0; k<currentNodes[i].g.length;k++){
                            currentNodes.push(currentNodes[i].g[k]);
                         }
                    }
                    else{
                        currentNodes.push(currentNodes[i].g);
                        }
                }
                if(currentNodes[i].rect){
                    gs.rect.push(currentNodes[i].rect);
                    }
                if(currentNodes[i].polygon){
                    gs.polygon.push( currentNodes[i].polygon);
                    }
                if(currentNodes[i].ellipse){
                    gs.ellipse.push( currentNodes[i].ellipse);
                    }
                if(currentNodes[i].polyline){
                    gs.polylines.push( currentNodes[i].polyline);
                    }
                if(currentNodes[i].circle){
                    gs.circle.push( currentNodes[i].circle);
                    }
                if(currentNodes[i].path){
                    gs.path.push( currentNodes[i].path);
                    }
                if(currentNodes[i].line){
                    gs.line.push( currentNodes[i].line);
                    }
                }
            }
    }
    else{
                if(treeG.rect){
                    gs.rect.push(treeG.rect);
                    }
                if(treeG.polygon){
                    gs.polygon.push( treeG.polygon);
                    }
                if(treeG.ellipse){
                    gs.ellipse.push(treeG.ellipse);
                    }
                if(treeG.polyline){
                    gs.polylines.push( treeG.polyline);
                    }
                if(treeG.circle){
                    gs.circle.push( treeG.circle);
                    }
                if(treeG.path){
                    gs.path.push( treeG.path);
                    }
                if(treeG.line){
                    gs.line.push( treeG.line);
                    }
        }
}

function getRepresentation(tree) {
    var node = {
            tagName: 'svg',
            nodeName: 'svg',
            id: tree['id'],

            attributes: [
                    {localName: 'xmlns',  name: 'xmlns', nodeName: 'xmlns', nodeValue: tree['xmlns'], textContent: tree['xmlns'], value: tree['xmlns']}  , 
                    {localName: 'xmlns:xlink',  name: 'xmlns:xlink', nodeName: 'xmlns:xlink', nodeValue: tree['xmlns:xlink'], textContent: tree['xmlns:xlink'],value: tree['xmlns:xlink']} ,
                    {localName: 'version',  name: 'version', nodeName: 'version', nodeValue: tree['version'], textContent: tree['version'], value: tree['version']} ,  
                    {localName: 'id',  name: 'id', nodeName: 'id', nodeValue: tree['id'], textContent: tree['id'], value: tree['id']} ,  
                    {localName: 'x',  name: 'x', nodeName: 'x', nodeValue: tree['x'],textContent: tree['x'], value: tree['x']} ,     
                    {localName: 'y',  name: 'y', nodeName: 'y', nodeValue: tree['y'], textContent: tree['y'], value: tree['y']} ,  
                    {localName: 'viewbox',  name: 'viewbox', nodeName: 'viewbox', nodeValue: tree['viewbox'], textContent: tree['viewbox'], value: tree['viewbox']} ,  
                    {localName: 'enable-background',  name: 'enable-background', nodeName: 'enable-background', nodeValue: tree['enable-background'], textContent: tree['enable-background'], value: tree['viewbox']} ,                     
                    {localName: 'xml:space',  name: 'xml:space', nodeName: 'xml:space', nodeValue: tree['xml:space'], textContent: tree['xml:space'], value: tree['xml:space']} 
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
    gs.polygon= [];
    gs.ellipse= [];
    gs.circle= [];
    gs.path= [];
    gs.line= [];
    gs.polylines= [];
   
    if(treeG){
         getGs(treeG, gs);
         
        if(gs.rect.length>0){
           for(var j =0; j<gs.rect.length;j++){
                 var rectG = [];
                 getRects(gs.rect[j], rectG);
                 for(var i =0; i<rectG.length;i++){
                    node.childNodes.push(rectG[i]);
                 }
                }
            }
        if(gs.polygon.length>0){
            for(var j =0; j<gs.polygon.length;j++){
                 var polygonG = [];
                 getPolygons(gs.polygon[j], polygonG);
                 for(var i =0; i<polygonG.length;i++){
                    node.childNodes.push(polygonG[i]);
                 }
                }
            }
        if(gs.ellipse.length>0){
            for(var j =0; j<gs.ellipse.length;j++){
                 var ellipseG = [];
                 getEllipses(gs.ellipse[j], ellipseG);
                 for(var i =0; i<ellipseG.length;i++){
                    node.childNodes.push(ellipseG[i]);
                 }
                }
            }
        if(gs.circle.length>0){
            for(var j =0; j<gs.circle.length;j++){
                 var circleG = [];
                 getCircles(gs.circle[j], circleG);
                 for(var i =0; i<circleG.length;i++){
                    node.childNodes.push(circleG[i]);
                 }
                }
            }
        if(gs.path.length>0){
            for(var j =0;j<gs.path.length;j++){
                 var pathG = [];
                 getPaths(gs.path[j], pathG);
                 for(var i =0; i<pathG.length;i++){
                    node.childNodes.push(pathG[i]);
                 }
                }
            }
        if(gs.polylines.length>0){
            for(var j =0;j<gs.polylines.length;j++){
                 var polylineG = [];
                 getPolylines(gs.polylines[j], polylineG);
                 for(var i =0; i<polylineG.length;i++){
                    node.childNodes.push(polylineG[i]);
                 }
                }
            }
        if(gs.line.length>0){
            for(var j =0; j<gs.line.length;j++){
                 var lineG = [];
                 getLines(gs.line[j], lineG);
                 for(var i =0; i<lineG.length;i++){
                    node.childNodes.push(lineG[i]);
                 }
                }
            }
    }
    
    var polylines = [];
    if(treePolylines){
         getPolylines(treePolylines, polylines);
         for(var i =0; i<polylines.length;i++){
            node.childNodes.push(polylines[i]);
         }
    }

    var polygons = [];
    if(treePolygons){
         getPolygons(treePolygons, polygons);
         for(var i =0; i<polygons.length;i++){
            node.childNodes.push(polygons[i]);
         }
    }

    var ellipses = [];
    if(treeEllipses){
         getEllipses(treeEllipses, ellipses);
         for(var i =0; i<ellipses.length;i++){
            node.childNodes.push(ellipses[i]);
         }
    }

    var circles = [];
    if(treeCircles){
         getCircles(treeCircles, circles);
         for(var i =0; i<circles.length;i++){
            node.childNodes.push(circles[i]);
         }
    }

    var paths = [];
    if(treePaths){
         getPaths(treePaths, paths);
         for(var i =0; i<paths.length;i++){
            node.childNodes.push(paths[i]);
         }
    }

    var lines = [];
    if(treeLines){
         getLines(treeLines, lines);
         for(var i =0; i<lines.length;i++){
            node.childNodes.push(lines[i]);
         }
    }

    var rects = [];
    if(treeRects){
         getRects(treeRects, rects);
         for(var i =0; i<rects.length;i++){
            node.childNodes.push(rects[i]);
         }
    }
    
    var sortNodes = [];
    for(var i = 0; i<node.childNodes.length;i++){
        var p = node.childNodes[i].indexNodeXML;
        sortNodes[p]=node.childNodes[i];
        }
    node.childNodes = sortNodes;
    
    return node;

}

function exportSVG(doc, name, bounds, exportOptions) {

var aaaaaa = app.activeDocument;

while(win.pnl.progBar.value < win.pnl.progBar.maxvalue*0.4)  
                        {  
                                  // this is what causes the progress bar increase its progress  
                                  win.pnl.progBar.value++;   
                win.pnl.progBarLabel.text = Math.floor(win.pnl.progBar.value)+"%";  
                dialog.update();
                                  $.sleep(10);  
                        } 

  //doc.artboards[0].artboardRect = bounds;

  var file = new File( exportFolder.fsDirectory + '/'  + exportFolder.fsName + '.svg');
  var nameFile = exportFolder.fsDirectory + '/'  + exportFolder.fsName;
  if(file.exists){
      var p = 0;
      while(file.exists){
          p++;
          nameFile = exportFolder.fsDirectory + '/'  + exportFolder.fsName+ p;
          file = new File( nameFile + '.svg');
          }
      }
  
  doc.exportFile( file, ExportType.SVG, exportOptions );
  file.close();
  
  while(win.pnl.progBar.value < win.pnl.progBar.maxvalue*0.5)  
                        {  
                                  // this is what causes the progress bar increase its progress  
                                  win.pnl.progBar.value++;   
                win.pnl.progBarLabel.text =Math.floor(win.pnl.progBar.value)+"%";  
                dialog.update();
                                  $.sleep(10);  
                        }  
  
  var xmlFile = new File(nameFile + '.svg');  
    xmlFile.open("r");   
    var xmlStr = xmlFile.read();  
    xmlFile.close();  
  
    var tree = XMLparser.XMLparse( xmlStr, { preserveAttributes: false , preserveDocumentNode: false });
    
    
while(win.pnl.progBar.value < win.pnl.progBar.maxvalue*0.6)  
                        {  
                                  // this is what causes the progress bar increase its progress  
                                  win.pnl.progBar.value++;   
                win.pnl.progBarLabel.text = Math.floor(win.pnl.progBar.value)+"%";  
                dialog.update();
                                  $.sleep(10);  
                        }    
    
    var XMLRepresentation = getRepresentation(tree.getTree());
    
    while(win.pnl.progBar.value < win.pnl.progBar.maxvalue*0.7)  
                        {  
                                  // this is what causes the progress bar increase its progress  
                                  win.pnl.progBar.value++;   
                win.pnl.progBarLabel.text = Math.floor(win.pnl.progBar.value) +"%";  
                dialog.update();
                                  $.sleep(10);  
                        } 
    
    var gcode = svg2gcode(XMLRepresentation, settingsGCODE);
    
    var gcodeFile = new File(exportFolder.fsDirectory + '/'  + exportFolder.fsName + '.gcode');  
    
    if(settingsGCODE.suffix && gcodeFile.exists){
      var p = 0;
      while(gcodeFile.exists){
          p++;
          nameFile = exportFolder.fsDirectory + '/'  + exportFolder.fsName+ p;
          gcodeFile = new File( nameFile + '.gcode');
          }
      }    
    gcodeFile.open ("w");
    
    gcodeFile.write(gcode);  
    gcodeFile.close(); 
    
    while(win.pnl.progBar.value < win.pnl.progBar.maxvalue)  
                        {  
                                  // this is what causes the progress bar increase its progress  
                                  win.pnl.progBar.value++;   
                win.pnl.progBarLabel.text = Math.floor(win.pnl.progBar.value)+"%";  
                dialog.update();
                                  $.sleep(10);  
                        } 

    file.remove();
    
    alert('Done!'); 

    win.pnl.progBar.value=0;   
    win.pnl.progBarLabel.text = Math.floor(win.pnl.progBar.value)+"%"; 
      
}

function getNamedItems(doc) {
  var item,
      items,
      doclayers,
      artboards;

  items = [];

  // Check all artboards for name match
  artboards = [];

  for ( var i = 0, len = doc.artboards.length; i < len; i++ ) {
    item = doc.artboards[i];
      items.push(item);
  }

  // Check all layers for name match
  doclayers = [];
  recurseLayers( doc.layers, doclayers );

  for ( i = 0, len = doclayers.length; i < len; i++ ) {
    item = doclayers[i];

    if (!item.locked && !anyParentLocked(item) ) {
      items.push(item);
    }
  }

  // Check all pageItems for name match
  for ( i = 0, len = doc.pageItems.length; i < len; i++ ) {
    item =  doc.pageItems[i];

    if (!item.locked && !anyParentLocked(item) ) {
      items.push(item);
    }
  }

  return items;
}

function recurseLayers(layers, layerArray) {

  var layer;

  for ( var i = 0, len = layers.length; i < len; i++ ) {
    layer = layers[i];
    if ( !layer.locked ) {
      layerArray.push(layer);
    }
    if (layer.layers.length > 0) {
      recurseLayers( layer.layers, layerArray );
    }
  }
}

function recurseItems(layers, items) {

  var layer;

  for ( var i = 0, len = layers.length; i < len; i++ ) {
    layer = layers[i];
    if ( layer.pageItems.length > 0 && !layer.locked ) {
      for ( var j = 0, plen = layer.pageItems.length; j < plen; j++ ) {
        if ( !layer.pageItems[j].locked ) {
          items.push(layer.pageItems[j]);
        }
      }
    }

    if ( layer.layers.length > 0 ) {
      recurseItems( layer.layers, items );
    }
  }
}

function anyParentLocked(item) {
  while ( item.parent ) {
    if ( item.parent.locked ) {
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

function hitTest(a,b){
  if(!hitTestX(a,b)){
    return false;
  }
  if(!hitTestY(a,b)){
    return false;
  }
  return true;
}

function hitTestX(a,b){
  var p1 = a.visibleBounds[0];
  var p2 = b.visibleBounds[0];
  if( (p2<=p1 && p1<=p2+b.width) || (p1<=p2 && p2<=p1+a.width) ) {
     return true;
  }
  return false;
}

function hitTestY(a,b){
  var p3 = a.visibleBounds[1];
  var p4 = b.visibleBounds[1];
  if( (p3>=p4 && p4>=(p3-a.height)) || (p4>=p3 && p3>=(p4-b.height)) ) {
    return true;
  }
  return false;
}