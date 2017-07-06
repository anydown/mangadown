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
`

function tategaki(ctx, text, x, y, px, font) {
  ctx.fillStyle = ""
  ctx.font = px + `px '${font}'`;
  for (var i = 0; i < text.length; i++) {
    ctx.save();
    ctx.translate(x, y + px * i);
    ctx.rotate(Math.PI / 2);
    ctx.translate(2, -px - 3);
    ctx.fillText(text[i], 0, px);
    ctx.restore();
  }
}

function drawTextLines(ctx, text, x, y, fontsize, font) {
  var lines = text.split("\n");
  var sx = x + fontsize
  var sy = y
  var maxlen = 0
  for (var l = 0; l < lines.length; l++) {
    var line = lines[l]
    maxlen = maxlen < line.length ? line.length : maxlen
  }
  var cx = sx - fontsize * lines.length / 2
  var cy = sy + fontsize * maxlen / 2

  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "white"
  ctx.ellipse(cx + fontsize / 8, cy, fontsize * lines.length / 2 + fontsize * 2, fontsize * maxlen / 2 + fontsize * 2, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  for (var l = 0; l < lines.length; l++) {
    var line = lines[l]
    tategaki(ctx, line, x - fontsize * l, y, fontsize, font);
  }
}

var fab
var w = 420 + 20 * 2
var h = (280 + 20) * 4 + 20

var loadedFonts = {}

new Vue({
  el: "#app",
  data: {
    msg: "Hello",
    rawinput: example,
    ctx: undefined,
    isDrawingMode: false,
    font: ""
  },
  computed: {
    input: function () {
      var lines = this.rawinput.split("\n")
      var komas = []
      var koma = []
      var msg = []
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i]
        //空行
        if (line.trim() === "" && msg.length > 0) {
          koma.push(msg.join("\n"))
          msg = []
          continue
        }

        //改ページ
        if (line.match(/-+/)) {
          if (msg.length > 0) {
            koma.push(msg.join("\n"))
            msg = []
          }
          komas.push(koma)
          koma = []
          continue
        }

        msg.push(line)
      }
      if (koma.length > 0) {
        komas.push(koma)
      }
      return komas
    }
  },
  methods: {
    toggleDrawingMode: function () {
      this.isDrawingMode = !this.isDrawingMode
      fab.isDrawingMode = this.isDrawingMode;
      fab.freeDrawingBrush.width = 5;
    },
    addImage: function (img) {
      fabric.Image.fromURL(`./${img}.png`, function (img) {
        img.set('left', 100).set('top', 100)
        fab.add(img);
      });
    },
    removeObj: function () {
        if (fab.getActiveGroup()) {
          fab.getActiveGroup().forEachObject(function(o){ fab.remove(o) });
          fab.discardActiveGroup().renderAll();
        }
        if (fab.getActiveObject()) {
          fab.getActiveObject().remove();
        }
    },
    exportImage: function () {
      fab.discardActiveObject().renderAll();
      fab.discardActiveGroup().renderAll();
      var eimage = document.querySelector("#export")
      var canvas = document.querySelector("#output")
      var fabel = document.querySelector("#overlay")
      var destCtx = eimage.getContext('2d');
      destCtx.fillStyle = "white"
      destCtx.fillRect(0, 0, w, h)
      destCtx.drawImage(canvas, 0, 0);
      destCtx.drawImage(fabel, 0, 0, w, h);
      window.open(eimage.toDataURL('image/png'));
    },
    redraw: function () {
      var text = this.input
      var ctx = this.ctx
      ctx.clearRect(0, 0, w, h)

      for (var i = 0; i < text.length; i++) {
        var ox = 20
        var oy = 20 + (280 + 20) * i
        ctx.strokeStyle = "black"
        ctx.lineWidth = 4
        ctx.strokeRect(ox, oy, 420, 280)

        var fontsize = 18;
        var x
        var y = oy + 30
        if (text[i]) {
          if (text[i].length > 0) {
            x = ox + 400 - fontsize
            drawTextLines(ctx, text[i][0], x, y, fontsize, this.font)
          }
          if (text[i].length > 1) {
            var linelength = text[i][1].split("\n").length;
            x = ox + 20 + fontsize * (linelength - 1)
            drawTextLines(ctx, text[i][1], x, y, fontsize, this.font)
          }
        }
      }
    }
  },
  watch: {
    "input": function () {
      this.redraw()
    },
    "font": function(item){
      var self = this
      var fontName = item

      if(!loadedFonts[item]){
        var fonts = {
          "yasashisa": "url(07YasashisaAntique.otf)",
          "noto-tc": "url(NotoSerifTC-Regular.otf)"
        }

        var font = new FontFace(item, fonts[item], {});
        font.load().then((loadedFace) => {
          setTimeout(() => {
            document.fonts.add(loadedFace);
            console.log("font loaded")
            self.redraw();
          }, 1000);
        });
      }

      setTimeout(() => {
        self.redraw();
      }, 1000);
      //var font = new FontFace("newfont", "url(07YasashisaAntique.otf)", {});
    }
  },
  mounted: function () {
    var eimage = document.querySelector("#export")
    eimage.width = `${w}`
    eimage.height = `${h}`
    eimage.style.width = `${w}px`
    eimage.style.height = `${h}px`

    var canvas = document.querySelector("#output")

    canvas.width = `${w}`
    canvas.height = `${h}`
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    this.ctx = canvas.getContext("2d")

    var fabel = document.querySelector("#overlay")
    fabel.width = `${w}`
    fabel.height = `${h}`
    fabel.style.width = `${w}px`
    fabel.style.height = `${h}px`
    fab = new fabric.Canvas('overlay');

    window.addEventListener('keyup', (ev) => {
      if (ev.keyCode === 46) {
        if (fab.getActiveGroup()) {
          fab.getActiveGroup().forEachObject(function(o){ fab.remove(o) });
          fab.discardActiveGroup().renderAll();
        }
        if (fab.getActiveObject()) {
          fab.getActiveObject().remove();
        }
      }
    })

    document.getElementById('imgLoader').onchange = function handleImage(e) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var imgObj = new Image();
        imgObj.src = event.target.result;
        imgObj.onload = function () {
          var image = new fabric.Image(imgObj);
          image.set({
            height: 200,
            width: 200
          });
          fab.add(image);
          fab.renderAll();
        }
      }
      reader.readAsDataURL(e.target.files[0]);
    }

    this.font = "yasashisa"
  }
})

