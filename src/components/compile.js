export function compile(rawinput) {
    const lines = rawinput.split("\n");

    const komas = [];
    let koma = [];
    let msg = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        //空行
        if (line.trim() === "" && msg.length > 0) {
            koma.push(msg.join("\n"));
            msg = [];
            continue;
        }

        //改ページ
        if (line.match(/-+/)) {
            if (msg.length > 0) {
                koma.push(msg.join("\n"));
                msg = [];
            }
            komas.push(koma);
            koma = [];
            continue;
        }

        msg.push(line);
    }
    if (koma.length > 0) {
        komas.push(koma);
    }
    return komas
}