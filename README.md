# Export SVG to Gcode JS

This project is the implementation of Diego Monzon Illustrator Script https://diegomonzon.com/illustrator-to-g-code-panel in nodeJS environnement.

It can convert a SVG file into a directly plottable GCODE file. This project is related to the pen-plotter community, but feel free to use it for any kind of application related to gcode files and svg files.

## Why ?

Because the original script gives me issues because it runs inside Illustrator scripting engine, and this can be quite long and inefficient on large files because of the Illustrator scripting engine which is not so efficient.
Also it gives me more flexibility for debugging process and more possibilities and experimentations and automations will be permitted if it is runned as a npm script.

## What this script don't do

Because I want to have something which fit my workflow and my personal preferences, this script :

- Don't extend or scale the svg drawing. (because it confuses a lot when resizing is made. All the transformations must be made in the svg file, and the script convert it without any redimensional function)

- outputs a result in millimeters (in the gcode file)

- don't treat filled shapes. If you want to involve any type of hatching, i recommend to process the svg file before the conversion with any hatching illustrator script.

## Installation

(TODO : make a npm package)

clone this repository and do `npm install`.

## Usage

`node main.js -f myFile.svg -o myOutput.gcode`

or

`node main.js -h`

## Configuration

the configuration is in the file `settingsGcode.js`

parameters:

```
-f file input
-o file output
-t travel speed
-p printing speed
-h help
-z offset Z
```

## Notes for myself

It is important to have the svg without any transformation or matrixes in the raw .svg
so in illustrator, make :
Dissociate , Decomposition (only background ) , Disociate ...
