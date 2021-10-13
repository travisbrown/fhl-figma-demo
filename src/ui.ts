import './ui.css'

window.onload = function() {
    Array.from(document.getElementsByClassName("sticker")).forEach(sticker => {
        // Initialize offset variables to be assigned later
        let offsetX = 0;
        let offsetY = 0;

        sticker.addEventListener('dragstart', e => {
            // Getting the offset position (The position of the cursor relative to the top-left corner of item being dragged)
            offsetX = (e as MouseEvent).offsetX;
            offsetY = (e as MouseEvent).offsetY;
        });

        sticker.addEventListener('dragend', e => {
            // Don't proceed if the item was dropped inside the plugin window.
            if ((e as MouseEvent).view.length === 0) return;

            // Getting the position of the cursor relative to the top-left corner of the browser page (Where the hamburger icon is)
            const dropPosition = {
                clientX: (e as MouseEvent).clientX,
                clientY: (e as MouseEvent).clientY
            };

            // Getting the size of the app/browser window.
            const windowSize = {
                width: window.outerWidth,
                height: window.outerHeight
            };

            // These are the offsets set from the dragstart event.
            const offset = {
                x: offsetX,
                y: offsetY
            };

            const itemSize = {
                width: (e.target as Element).clientWidth,
                height: (e.target as Element).clientHeight
            };

            // Drop the "sticker-" prefix from the ID.
            const stickerName = sticker.id.substring(8)

            // Sending the variables over to the main code.
            window.parent.postMessage(
                { pluginMessage: { type: 'drop-sticker', name: stickerName, dropPosition, windowSize, offset, itemSize } },
                '*'
            );
        });
    });
};