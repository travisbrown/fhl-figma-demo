const highFive = require("./stickers/high-five.svg");
const wave = require("./stickers/wave.svg");
const question = require("./stickers/question.svg");
const question1 = require("./stickers/question-1.svg");
const thumbsUp = require("./stickers/thumbs-up.svg");
const thumbsDown = require("./stickers/thumbs-down.svg");

figma.showUI(__html__, { width: 260, height: 400 })

figma.ui.onmessage = (msg) => {
    let byName = new Map([
        ["high-five", highFive],
        ["wave", wave],
        ["question", question],
        ["question-1", question1],
        ["thumbs-up", thumbsUp],
        ["thumbs-down", thumbsDown],
    ]);

    if (msg.type === 'drop-sticker') {
        const { _, name, dropPosition, windowSize, offset, itemSize } = msg;
        // Getting the position and size of the visible area of the canvas.
        const bounds = figma.viewport.bounds;
        // Getting the zoom level
        const zoom = figma.viewport.zoom;
        // There are two states of the Figma interface: With or without the UI (toolbar + left and right panes)
        // The calculations would be slightly different, depending on whether the UI is shown.
        // So to determine if the UI is shown, we'll be comparing the bounds to the window's width.
        // Math.round is used here because sometimes bounds.width * zoom may return a floating point number very close but not exactly the window width.
        const hasUI = Math.round(bounds.width * zoom) !== windowSize.width;
        // Since the left pane is resizable, we need to get its width by subtracting the right pane and the canvas width from the window width.
        const leftPaneWidth = windowSize.width - bounds.width * zoom - 240;
        // Getting the position of the cursor relative to the top-left corner of the canvas.
        const xFromCanvas = hasUI ? dropPosition.clientX - leftPaneWidth : dropPosition.clientX;
        const yFromCanvas = hasUI ? dropPosition.clientY - 40 : dropPosition.clientY;

        console.log(name);
        const svgDataUrl = byName.get(name);
        const svgContent = decodeURIComponent(svgDataUrl.split(",")[1]);
        const sticker = figma.createNodeFromSvg(svgContent);

        // Resize the sticker to be the same size as the item from the plugin window.
        sticker.resize(itemSize.width, itemSize.height);
        sticker.name = "Sticker";
        figma.currentPage.appendChild(sticker);
        // The canvas position of the drop point can be calculated using the following:
        sticker.x = bounds.x + xFromCanvas / zoom - offset.x;
        sticker.y = bounds.y + yFromCanvas / zoom - offset.y;
        // Select the sticker
        figma.currentPage.selection = [sticker];
    }
}