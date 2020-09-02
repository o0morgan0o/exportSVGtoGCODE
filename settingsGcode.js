let settingsGCODE = {
    inputFile: null,
    outputFile: "out.gcode",
    colorCommandOn4: "\nG1 Z0 ;ON",
    colorCommandOff4: "\nG1 Z1.5 ;OFF",
    // colorCommandOn2: colorCommandOn2GroupText.text,
    // colorCommandOff2: colorCommandOff2GroupText.text,
    // colorCommandOn3: colorCommandOn3GroupText.text,
    // colorCommandOff3: colorCommandOff3GroupText.text,
    // colorCommandOn4: colorCommandOn4GroupText.text,
    // colorCommandOff4: colorCommandOff4GroupText.text,
    // color1Text: color1Text.text,
    // color2Text: color2Text.text,
    // color3Text: color3Text.text,

    // LineWithVariationMin: parseInt(LineWithVariationMinText.text),
    // LineWithVariationMax: parseInt(LineWithVariationMaxText.text),
    LineWithVariationIsDesactivated: true,

    // commandBetween: "",

    start: "\nG1 Z2\n;end of initialization\n",
    end: "\n;end of file",
    feedRate: 1600,
    seekRate: 4000,

    // suffix: suffix.value,

    // exportFolder.fsDirectory : directoryText.text,
    // exportFolder.fsName : filenameText.text,

    // if(saveDefault.value) {
    //     var settingsSaveFileDefault,
    //     settingsSaveFileDefault = new File('~/Documents/' + 'SettingsForIllustratorScript-6473a58b-cd34-2dad-49b0-ad1f23fabad3.settings'),

    //     settingsSaveFileDefault.open("w"),
    //     var settingSaveDefault = startText.text + '|' + feedRateText.text + '|' + seekRateText.text + '|' + directoryText.text + '|' + filenameText.text + '|' + endGroupText.text + '|' + " " + '|' + colorCommandOn1GroupText.text + '|' + colorCommandOff1GroupText.text + '|' + colorCommandOn2GroupText.text + '|' + colorCommandOff2GroupText.text + '|' + colorCommandOn3GroupText.text + '|' + colorCommandOff3GroupText.text + '|' + colorCommandOn4GroupText.text + '|' + colorCommandOff4GroupText.text + '|' + color1Text.text + '|' + color2Text.text + '|' + color3Text.text + '|' + LineWithVariationMinText.text + '|' + LineWithVariationMaxText.text,

    // settingsSaveFileDefault.write(settingSaveDefault),
    //     settingsSaveFileDefault.close(),

    //   }

}

function getSettings() {
    return settingsGCODE
}
module.exports = {
    getSettings: getSettings
}