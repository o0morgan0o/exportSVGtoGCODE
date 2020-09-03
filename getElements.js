

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
        // console.log('gaa')
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

module.exports = {
    getPolygons: getPolygons,
    getGs: getGs,
    getRects: getRects,
    getPaths: getPaths,
    getPolylines: getPolylines,
    getLines: getLines,
    getSymbol: getSymbol

}