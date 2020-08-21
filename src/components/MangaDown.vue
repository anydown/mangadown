<template>
  <div class="row">
    <div class="column">
      <div class="wrapper canvas-wrapper">
        <canvas id="output"></canvas>
        <canvas id="overlay"></canvas>
      </div>
    </div>

    <div class="controls column">
      <textarea id="input" v-model="rawinput"></textarea>

      <div>
        <button @click="exportImage" class="button" style="width: 100%;">PNG形式で保存</button>

        <div class="row">
          <div class="column column-50">
            <button
              @click="toggleDrawingMode"
              class="button"
              :class="{'button-outline': !isDrawingMode}"
              style="width: 100%; height: 5rem; line-height: 5rem;"
            >
              <svg
                class="svgicon"
                id="i-edit"
                viewBox="0 0 32 32"
                width="28"
                height="28"
                fill="none"
                stroke="currentcolor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              >
                <path d="M30 7 L25 2 5 22 3 29 10 27 Z M21 6 L26 11 Z M5 22 L10 27 Z" />
              </svg>
              手書きモード
              <span v-if="isDrawingMode">ON</span>
            </button>
          </div>
          <div class="column column-50">
            <button
              @click="removeObj"
              class="button button-outline"
              style="width: 100%; height: 5rem; line-height: 5rem;"
            >
              <svg
                class="svgicon"
                id="i-trash"
                viewBox="0 0 32 32"
                width="28"
                height="28"
                fill="none"
                stroke="currentcolor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              >
                <path
                  d="M28 6 L6 6 8 30 24 30 26 6 4 6 M16 12 L16 24 M21 12 L20 24 M11 12 L12 24 M12 6 L13 2 19 2 20 6"
                />
              </svg>
              選択中の図形を削除
            </button>
          </div>
        </div>

        <div>
          <h3>font</h3>
          <select v-model="font">
            <option value="yasashisa">やさしさアンティーク</option>
            <option value="noto-tc">Noto Traditional Chinese</option>
          </select>
        </div>

        <div class="stamp-box">
          <h3 class="stamp-title">スタンプ</h3>
          <div>
            <img class="stamp" @click="addImage('hage01')" src="/assets/hage01.png" />
            <img class="stamp" @click="addImage('hage02')" src="/assets/hage02.png" />
            <img class="stamp" @click="addImage('hage03')" src="/assets/hage03.png" />
            <img class="stamp" @click="addImage('hage04')" src="/assets/hage04.png" />
            <img class="stamp" @click="addImage('hage05')" src="/assets/hage05.png" />
            <img class="stamp" @click="addImage('hage06')" src="/assets/hage06.png" />
            <img class="stamp" @click="addImage('hage07')" src="/assets/hage07.png" />
            <img class="stamp" @click="addImage('hage08')" src="/assets/hage08.png" />
            <img class="stamp" @click="addImage('hage09')" src="/assets/hage09.png" />
            <img class="stamp" @click="addImage('hage10')" src="/assets/hage10.png" />
            <img class="stamp" @click="addImage('hage11')" src="/assets/hage11.png" />
            <img class="stamp" @click="addImage('hage12')" src="/assets/hage12.png" />
            <img class="stamp" @click="addImage('hage13')" src="/assets/hage13.png" />
            <img class="stamp" @click="addImage('fx01')" src="/assets/fx01.png" />
            <img class="stamp" @click="addImage('fx02')" src="/assets/fx02.png" />
            <img class="stamp" @click="addImage('moji01')" src="/assets/moji01.png" />
            <img class="stamp" @click="addImage('moji02')" src="/assets/moji02.png" />
            <img class="stamp" @click="addImage('moji03')" src="/assets/moji03.png" />
            <img class="stamp" @click="addImage('moji04')" src="/assets/moji04.png" />
            <img class="stamp" @click="addImage('moji05')" src="/assets/moji05.png" />
            <img class="stamp" @click="addImage('zura01')" src="/assets/zura01.png" />
            <img class="stamp" @click="addImage('zura02')" src="/assets/zura02.png" />
            <img class="stamp" @click="addImage('zura03')" src="/assets/zura03.png" />
            <img class="stamp" @click="addImage('zura04')" src="/assets/zura04.png" />
          </div>
          <h3 class="stamp-title">自作スタンプの読み込み</h3>
          <form id="uploadImg">
            <input type="file" id="imgLoader" />
          </form>
        </div>
      </div>
    </div>
    <canvas id="export"></canvas>
  </div>
</template>

<script>
var example = `このツールは
Twitterで
よく流れている
タイプの４コマを
作るツールだ…

テキストを編集すると
セリフが変更されるんだね
----
白ハゲスタンプも
押すことが出来る

なるほど
---
よーし

このツールで
主語の大きい
煽り画像を作るぞ！
---
そういうことは
やめような

平和は守られた
`;

function isFirefox() {
  return navigator.userAgent.toLowerCase().includes("firefox");
}

function tategaki(ctx, text, x, y, px, font) {
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

function drawTextLines(ctx, text, x, y, fontsize, font) {
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

var fab;
const w = 420 + 20 * 2;
const h = (280 + 20) * 4 + 20;

const loadedFonts = {};

export default {
  data() {
    return {
      msg: "Hello",
      rawinput: example,
      ctx: undefined,
      isDrawingMode: false,
      font: "",
    };
  },
  computed: {
    input: function () {
      const lines = this.rawinput.split("\n");
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
      return komas;
    },
  },
  methods: {
    toggleDrawingMode: function () {
      this.isDrawingMode = !this.isDrawingMode;
      fab.isDrawingMode = this.isDrawingMode;
      fab.freeDrawingBrush.width = 5;
    },
    addImage: function (img) {
      fabric.Image.fromURL(`/assets/${img}.png`, function (img) {
        img.set("left", 100).set("top", 100);
        fab.add(img);
      });
    },
    removeObj: function () {
      if (fab.getActiveGroup()) {
        fab.getActiveGroup().forEachObject(function (o) {
          fab.remove(o);
        });
        fab.discardActiveGroup().renderAll();
      }
      if (fab.getActiveObject()) {
        fab.getActiveObject().remove();
      }
    },
    exportImage: function () {
      fab.discardActiveObject().renderAll();
      fab.discardActiveGroup().renderAll();
      const eimage = document.querySelector("#export");
      const canvas = document.querySelector("#output");
      const fabel = document.querySelector("#overlay");
      const destCtx = eimage.getContext("2d");
      destCtx.fillStyle = "white";
      destCtx.fillRect(0, 0, w, h);
      destCtx.drawImage(canvas, 0, 0);
      destCtx.drawImage(fabel, 0, 0, w, h);
      window.open(eimage.toDataURL("image/png"));
    },
    redraw: function () {
      const text = this.input;
      const ctx = this.ctx;
      ctx.clearRect(0, 0, w, h);

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
          if (text[i].length > 0) {
            x = ox + 400 - fontsize;
            drawTextLines(ctx, text[i][0], x, y, fontsize, this.font);
          }
          if (text[i].length > 1) {
            const linelength = text[i][1].split("\n").length;
            x = ox + 20 + fontsize * (linelength - 1);
            drawTextLines(ctx, text[i][1], x, y, fontsize, this.font);
          }
        }
      }
    },
  },
  watch: {
    input: function () {
      this.redraw();
    },
    font: function (item) {
      const self = this;
      const fontName = item;

      if (!loadedFonts[item]) {
        const fonts = {
          yasashisa: "url(/assets/07YasashisaAntique.otf)",
          "noto-tc": "url(/assets/NotoSerifTC-Regular.otf)",
        };

        const font = new FontFace(item, fonts[item], {});
        font.load().then((loadedFace) => {
          setTimeout(() => {
            document.fonts.add(loadedFace);
            console.log("font loaded");
            self.redraw();
          }, 1000);
        });
      }

      setTimeout(() => {
        self.redraw();
      }, 1000);
    },
  },
  mounted: function () {
    const eimage = document.querySelector("#export");
    eimage.width = `${w}`;
    eimage.height = `${h}`;
    eimage.style.width = `${w}px`;
    eimage.style.height = `${h}px`;

    const canvas = document.querySelector("#output");

    canvas.width = `${w}`;
    canvas.height = `${h}`;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    this.ctx = canvas.getContext("2d");

    const fabel = document.querySelector("#overlay");
    fabel.width = `${w}`;
    fabel.height = `${h}`;
    fabel.style.width = `${w}px`;
    fabel.style.height = `${h}px`;
    fab = new fabric.Canvas("overlay");

    window.addEventListener("keyup", (ev) => {
      if (ev.keyCode === 46) {
        if (fab.getActiveGroup()) {
          fab.getActiveGroup().forEachObject(function (o) {
            fab.remove(o);
          });
          fab.discardActiveGroup().renderAll();
        }
        if (fab.getActiveObject()) {
          fab.getActiveObject().remove();
        }
      }
    });

    document.getElementById("imgLoader").onchange = function handleImage(e) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const imgObj = new Image();
        imgObj.src = event.target.result;
        imgObj.onload = function () {
          const image = new fabric.Image(imgObj);
          image.set({
            height: 200,
            width: 200,
          });
          fab.add(image);
          fab.renderAll();
        };
      };
      reader.readAsDataURL(e.target.files[0]);
    };

    this.font = "yasashisa";
  },
};
</script>
