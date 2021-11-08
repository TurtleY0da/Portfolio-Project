// Platformer Script by Timothy V 

window.onload = async function () {
    let cnv = docGetID("platformerCanvas");
    let errorText = docGetID("errorText");

    if (screen.width >= 1280 && screen.height >= 720) {
        // -- Initialize Variables --

        // HTML Elements

        // Glbl Variables

        let fullscreen = false;

        let prevTime = Date.now();

        let level = new platformerLevel();
        await level.loadFromFile('./levels/prototyping.json');

        let screenSize = Math.min(screen.width / 16, screen.height / 9);
        let canvasSize = [cnv.width, cnv.height];

        let screenCorner = {
            x: (screen.width - 16 * screenSize) / 2,
            y: (screen.height - 9 * screenSize) / 2
        }

        // -- Canvas & Context setup
        /** @type {CanvasRenderingContext2D} */
        let ctx = cnv.getContext("2d");

        // -- Main Loop --
        requestAnimationFrame(loop);

        function loop() {
            const deltaTime = Date.now() - prevTime;
            prevTime = Date.now();

            level.update(deltaTime, canvasSize);

            // - Update Variables -
            if (document.fullscreenElement === cnv) {
                cnv.width = screen.width;
                cnv.height = screen.height;
                canvasSize = [screenSize * 16, screenSize * 9];
                fullscreen = true;
            } else {
                cnv.width = 16 * screenSize / 1.5;
                cnv.height = 9 * screenSize / 1.5;
                canvasSize = [cnv.width, cnv.height];
                fullscreen = false;
            }

            // - Draw -
            if (fullscreen) {
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, cnv.width, cnv.height);
                ctx.clearRect(screenCorner.x, screenCorner.y, 16 * screenSize, 9 * screenSize);

                ctx.beginPath();
                ctx.rect(screenCorner.x, screenCorner.y, 16 * screenSize, 9 * screenSize)
                ctx.clip();
            } else {
                ctx.clearRect(0, 0, cnv.width, cnv.height);
            }

            level.draw(ctx, fullscreen, screenCorner, canvasSize, screenSize);
            // - End -
            requestAnimationFrame(loop);
        }

        // -- Add Event Listeners
        docGetID("tempFullscreenBtn").addEventListener('mousedown', function () {
            cnv.requestFullscreen();
            cnv.focus();
        });

        document.addEventListener('keydown', keyHandler);
        document.addEventListener('keyup', keyHandler);

        // -- Functions --

        // - Event Functions -
        function keyHandler(event) {
            if (event.type === 'keydown') {
                if (!event.repeat) {
                    switch (event.code) {
                        case 'KeyA':
                        case 'ArrowLeft':
                            level.objectLayers.player.movement = -1;
                            break;
                        case 'KeyD':
                        case 'ArrowRight':
                            level.objectLayers.player.movement = 1;
                            break;
                        case 'KeyW':
                        case 'ArrowUp':
                            console.log('jump');
                            break;
                        case 'KeyT':
                            level.camera.followPlayer = !level.camera.followPlayer;
                            break;
                    }
                }
            } else if (event.type === 'keyup') {
                if (!event.repeat) {
                    switch (event.code) {
                        case 'KeyA':
                        case 'ArrowLeft':
                            if(level.objectLayers.player.movement === -1) level.objectLayers.player.movement = 0;
                            break;
                        case 'KeyD':
                        case 'ArrowRight':
                            if(level.objectLayers.player.movement === 1) level.objectLayers.player.movement = 0;
                            break;
                    }
                }
            }
        }

        // - Functions -


    } else {
        cnv.style.display = 'none';
        errorText.style.display = 'block';
    }
}