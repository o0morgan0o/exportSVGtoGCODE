const settingsGCODE = {
    inputFile: null,
    outputFile: "out.gcode",
    colorCommandOn4: "\nG1 Z0 ;ON",
    colorCommandOff4: "\nG1 Z1.5 ;OFF",
    LineWithVariationIsDesactivated: true,
    start: "\nG1 Z2\n;end of initialization\n",
    end: "\n;end of file",
    feedRate: 1600,
    seekRate: 4000,
    writeOutput: false,
    showOutput: true
}

function getSettings() {
    return { ...settingsGCODE }
}
module.exports = {
    getSettings: getSettings
}