
function isFirefox() {
    return navigator.userAgent.toLowerCase().includes("firefox");
}

export function tategaki(ctx, text, x, y, px, font) {
    ctx.fillStyle = "";
    ctx.font = px + `px '${font}'`;
    for (let i = 0; i < text.length; i++) {
        ctx.save();
        ctx.translate(x, y + px * i);
        if (isFirefox()) {
            ctx.translate(10, -px);
        } else {
            ctx.rotate(Math.PI / 2);
            ctx.translate(2, -px - 3);
        }
        ctx.fillText(text[i], 0, px);
        ctx.restore();
    }
}

export function drawTextLines(ctx, text, x, y, fontsize, font) {
    const lines = text.split("\n");
    const sx = x + fontsize;
    const sy = y;
    let maxlen = 0;
    for (let l = 0; l < lines.length; l++) {
        const line = lines[l];
        maxlen = maxlen < line.length ? line.length : maxlen;
    }
    const cx = sx - (fontsize * lines.length) / 2;
    const cy = sy + (fontsize * maxlen) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.ellipse(
        cx + fontsize / 8,
        cy,
        (fontsize * lines.length) / 2 + fontsize * 2,
        (fontsize * maxlen) / 2 + fontsize * 2,
        0,
        0,
        2 * Math.PI
    );
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    for (let l = 0; l < lines.length; l++) {
        const line = lines[l];
        tategaki(ctx, line, x - fontsize * l, y, fontsize, font);
    }
}