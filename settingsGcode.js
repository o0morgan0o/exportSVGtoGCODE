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


    // TODO: choose folder export here
    // exportFolder.fsDirectory : directoryText.text,
    // exportFolder.fsName : filenameText.text,
    writeOutput: true,
    showOutput: false

}

function getSettings() {
    return settingsGCODE
}
module.exports = {
    getSettings: getSettings
}