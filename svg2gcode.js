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

const SVGReader = require('./svgreader.js').svgReader

let scale = function (val) { // val is a point value
    // var resolution = app.activeDocument.rasterEffectSettings.resolution;
    // var inchs = val / 72; //conversion points to inches
    // var mm = (inchs / 0.39370) * 10;
    // if (mm < 0) mm = 0;
    // else {
    //     var mmString = mm.toString().split('.');
    //     var aux = mmString[0] + (mmString[1] == null ? '' : '.') + (mmString[1] == null ? '' : mmString[1][0]) + (mmString[1] == null ? '' : mmString[1][1]);
    //     mm = parseFloat(aux);
    // }
    // return mm;
    let tmp = 0.352778 * val
    if (tmp.toString().indexOf('.') == -1) {
        tmp = tmp.toString() + '.0'
    }
    let split = tmp.toString().split('.')
    let decimals = split[1].substring(0, 3)
    let result = parseFloat(split[0] + "." + decimals)
    return result
}

function svg2gcode(svg, settings) {
    // clean off any preceding whitespace
    settings = settings || {};
    settings.start = settings.start ? settings.start : "";// end
    settings.materialWidth = settings.materialWidth || 1;
    settings.passWidth = 1;
    // TODO : correct this and see if the original calcul is useful
    // settings.scale = 1 / app.activeDocument.rasterEffectSettings.resolution / 0.393701;     //*106;
    // settings.scale = 2
    settings.end = settings.end ? settings.end : "";// end
    settings.lazerOff = settings.lazerOff ? settings.lazerOff : ""; // lazerOff
    settings.lazerOn = settings.lazerOn ? settings.lazerOn : "";   // lazerOn
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

    // console.log(svg)

    paths = SVGReader.parse(svg, {}).allcolors

    var idx = paths.length;
    console.log('number of paths : ', idx)
    while (idx--) {
        var subidx = paths[idx].length;
        var bounds = { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity, area: 0 };

        // find lower and upper bounds
        while (subidx--) {
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
        bounds.area = (1 + bounds.x2 - bounds.x) * (1 + bounds.y2 - bounds.y);
        paths[idx].bounds = bounds;
    }

    // cut the inside parts first
    paths.sort(function (a, b) {
        // sort by area
        return (a.bounds.area < b.bounds.area) ? -1 : 1;
    });

    gcode = [];

    gcode.push(settings.start);

    gcode.push('G0 F' + settings.seekRate);
    gcode.push(['G90', 'G21'].join(' '));

    //getting heighy
    let height = svg.viewBox[3]
    console.log(height)
    // TODO : change height to something real
    var lastSamePath = false;

    var commandOnActive = true;
    let counter = 0

    for (var pathIdx = 0, pathLength = paths.length; pathIdx < pathLength; pathIdx++) {
        counter++
        process.stdout.clearLine()
        process.stdout.cursorTo(0)
        process.stdout.write(counter + " / " + pathLength + " path")


        path = paths[pathIdx];


        var nextPath = paths[pathIdx + 1];
        var finalPathX = nextPath != null ? scale(nextPath[0].x) : -1;
        var finalPathY = nextPath != null ? scale(height - nextPath[0].y) : -1;
        var initialPathX = scale(path[path.length - 1].x);
        var initialPathY = scale(height - path[path.length - 1].y);
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

        if (settings.color2 == stroke) {
            colorComandOn = settings.colorCommandOn2;
            colorComandOff = settings.colorCommandOff2;
        }
        else if (settings.color3 == stroke) {
            colorComandOn = settings.colorCommandOn3;
            colorComandOff = settings.colorCommandOff3;
        }
        else if (settings.color1 == stroke) {
            colorComandOn = settings.colorCommandOn1;
            colorComandOff = settings.colorCommandOff1;
        }
        else {
            colorComandOn = settings.colorCommandOn4;
            colorComandOff = settings.colorCommandOff4;
        }
        if (commandOnActive) {
            gcode.push(colorComandOn);
            commandOnActive = false;
        }

        if (!settings.LineWithVariationIsDesactivated) {
            var strokeWidth = path.node.strokeWidth;
            var countZ = settings.LineWithVariationMax - settings.LineWithVariationMin;
            var multMaxStrokeWidth = (MaxStrokeWidth - 1) == 0 ? 0 : countZ / (MaxStrokeWidth - 1);

            if (isSamePath || lastSamePath) {
                var strokeNextPath = nextPath != null ? nextPath.node.strokeWidth : strokeWidth;
                var countZContinuo = settings.LineWithVariationMax - settings.LineWithVariationMin;

                var incPathWith = (multMaxStrokeWidth * (strokeWidth - 1));
                var incNextPathWith = (multMaxStrokeWidth * (strokeNextPath - 1));
                var dif = incNextPathWith - incPathWith;
                var dist = 0;
                for (var i = 1; i < path.length; i++) {
                    dist += Math.pow(Math.pow(path[i].x - path[i - 1].x, 2) + Math.pow(path[i].y - path[i - 1].y, 2), 0.5);
                }

                // keep track of the current path being cut, as we may need to reverse it
                var localPath = [];
                var count = 0;
                for (var segmentIdx = 0, segmentLength = path.length; segmentIdx < segmentLength; segmentIdx++) {
                    var segment = path[segmentIdx];
                    if (segmentIdx > 0) {
                        var distp = Math.pow(Math.pow((path[segmentIdx].x - path[segmentIdx - 1].x), 2) + Math.pow((path[segmentIdx].y - path[segmentIdx - 1].y), 2), 0.5);
                        count += (dif * distp) / dist;
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
            else {
                lastSamePath = false;
                gcode.push('G0 Z5' + (settings.LineWithVariationMin + (multMaxStrokeWidth * (strokeWidth - 1))));


                // keep track of the current path being cut, as we may need to reverse it
                var localPath = [];
                for (var segmentIdx = 0, segmentLength = path.length; segmentIdx < segmentLength; segmentIdx++) {
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
        else {
            //gcode.push(settings.powerOnDelay);

            // keep track of the current path being cut, as we may need to reverse it
            var localPath = [];
            for (var segmentIdx = 0, segmentLength = path.length; segmentIdx < segmentLength; segmentIdx++) {
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

        if (!isSamePath) {
            gcode.push(colorComandOff);
            commandOnActive = true;
            gcode.push('G0 F' + settings.seekRate);
        }
        else {
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
    // console.log(gcode)

    return gcode.join('\n');
}

module.exports = {
    svg2gcode: svg2gcode,
    scale: scale
}