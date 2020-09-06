
function containString(nameObjectXML, nodeName) {
    for (var i = 0; i < nameObjectXML.length; i++) {
        if (nameObjectXML[i] == nodeName) {
            return true;
        }
    }
    return false;
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
    return Array.isArray(arg);
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

module.exports = {
    isa_hash: isa_hash,
    isa_array: isa_array,
    containString: containString,
    decode_entities: decode_entities,
    num_keys: num_keys,
    first_key: first_key,
    getAttribute: getAttribute,
    trim: trim,
}