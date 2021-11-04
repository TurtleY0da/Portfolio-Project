// Platformer Script by Timothy V 

window.onload = function () {
    let cnv = docGetID("platformerCanvas");
    let errorText = docGetID("errorText");
    
    if (screen.width >= 1280 && screen.height >= 720) {
        // -- Initialize Variables --
    
        // HTML Elements
        let leftWalkImg = new Image();
        leftWalkImg.src = '../img/leftWalk.png';
    
        let rightWalkImg = new Image();
        rightWalkImg.src = '../img/rightWalk.png';
    
        let idleImg = new Image();
        idleImg.src = '../img/idle.png';
    
        let i = 0;
    
        // Glbl Variables
    
        let fullscreen = false;
    
        let prevTime = Date.now();
    
        let level = new platformerLevel('./levels/menu.json');
    
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
    
            // - Update Variables -
            if (document.fullscreenElement === cnv) {
                cnv.width = screen.width;
                cnv.height = screen.height;
                canvasSize = [screenSize*16, screenSize*9];
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
                ctx.clearRect(screenCorner.x, screenCorner.y, 16 * screenSize, 9 * screenSize)
            } else {
                ctx.clearRect(0, 0, cnv.width, cnv.height);
            }

            ctx.fillStyle = '#009000'
            ctx.fillRect(100,100,10,10)
    
            // ctx.drawImage(leftWalkImg, 512 * Math.floor(i/2), 0, 512, 512, fullscreen*screenCorner.x, fullscreen*screenCorner.y, canvasSize[0] / 60 * 9, canvasSize[1] / 60 * 16);
            i += Math.exp(deltaTime*0.01);
            if (i >= 160) i = 0;
            // - End -
            requestAnimationFrame(loop);
        }
    } else {
        cnv.style.display = 'none';
        errorText.style.display = 'block';
    }
    // -- Add Event Listeners
    docGetID("tempFullscreenBtn").addEventListener('mousedown', function () {
        cnv.requestFullscreen();
        cnv.focus();
    });
}

// -- Functions --

// - Event Functions -

// - Functions -