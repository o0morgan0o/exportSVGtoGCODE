const getPolygons = require('./getElements').getPolygons
const getPolylines = require('./getElements').getPolylines
const getGs = require('./getElements').getGs
const getRects = require('./getElements').getRects
const getPaths = require('./getElements').getPaths

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

module.exports = {
    getRepresentation: getRepresentation
}