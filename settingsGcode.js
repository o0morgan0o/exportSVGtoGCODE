let settingsGCODE = {
    inputFile: null,
    outputFile: null,
    colorCommandOn4: "\nG1 Z0 ;ON",
    colorCommandOff4: "\nG1 Z{{Zoff}} ;OFF",
    LineWithVariationIsDesactivated: true,


    start: "\nG1 Z{{Zoff}}\n;end of initialization\n",
    end: "\nG0 X0 Y0;end of file",
    feedRate: 1600,
    seekRate: 4000,



    // put your own folder where your svg files ares
    inputFolder: 'E:/code/my-sketches/printedSvg/',
    // put your own folder for the export gcode file
    exportFolder: 'E:/trash/',

    writeOutput: true,
    showOutput: false,
    useSvgo: true

}

function getSettings() {
    return settingsGCODE
}
module.exports = {
    getSettings: getSettings
}