
function isFirefox() {
    return navigator.userAgent.toLowerCase().includes("firefox");
}

export function tategaki(ctx, text, x, y, px, font) {
    ctx.fillStyle = "";
    ctx.font = px + `px '${font}'`;
    for (let i = 0; i < text.length; i++) {
        // 縦書きのために一文字ずつtranslateをかけている
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
        // かならずrestoreでtranslateをクリアする
    }
}

export function drawBubble(ctx, text, x, y, fontsize, font) {
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

    ctx.ellipse(
        cx + fontsize / 8,
        cy,
        (fontsize * lines.length) / 2 + fontsize * 2,
        (fontsize * maxlen) / 2 + fontsize * 2,
        0,
        0,
        2 * Math.PI
    );

}

export function drawText(ctx, text, x, y, fontsize, font) {
    const lines = text.split("\n");
    for (let l = 0; l < lines.length; l++) {
        const line = lines[l];
        tategaki(ctx, line, x - fontsize * l, y, fontsize, font);
    }
}

export function drawKomas(ctx, text, font) {
    for (let i = 0; i < text.length; i++) {
        const ox = 20;
        const oy = 20 + (280 + 20) * i;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.strokeRect(ox, oy, 420, 280);

        const fontsize = 18;
        let x;
        const y = oy + 30;
        if (text[i]) {
            // 吹き出しの描画
            ctx.save();
            ctx.fillStyle = "white";

            //コマからはみ出さないようにマスク
            ctx.rect(ox + 2, oy + 2, 420 - 4, 280 - 4);
            ctx.clip();
            ctx.beginPath();
            if (text[i].length > 0) {
                x = ox + 400 - fontsize;
                drawBubble(ctx, text[i][0], x, y, fontsize, font);
            }
            ctx.fill();
            ctx.stroke();

            //コマからはみ出さないようにマスク
            ctx.rect(ox + 2, oy + 2, 420 - 4, 280 - 4);
            ctx.clip();
            ctx.beginPath();
            if (text[i].length > 1) {
                const linelength = text[i][1].split("\n").length;
                x = ox + 20 + fontsize * (linelength - 1);
                drawBubble(ctx, text[i][1], x, y, fontsize, font);
            }
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            // セリフの描画
            if (text[i].length > 0) {
                x = ox + 400 - fontsize;
                drawText(ctx, text[i][0], x, y, fontsize, font);
            }
            if (text[i].length > 1) {
                const linelength = text[i][1].split("\n").length;
                x = ox + 20 + fontsize * (linelength - 1);
                drawText(ctx, text[i][1], x, y, fontsize, font);
            }
        }
    }

}