var example = `[
  ["テストだよー\\nてすてす","どういうことだよ\\nといいつつ\\nてすてす"],
  ["そういうことだよ","なるほど"],
  ["わーい"],
  ["なんのこっちゃ"]
]`


function tategaki(ctx, text, x, y, px) {
  ctx.fillStyle = ""
  ctx.font = px + "px 'newfont'";
  for (var i = 0; i < text.length; i++) {
    ctx.save();
    ctx.translate(x, y + px * i);
    ctx.rotate(Math.PI / 2);
    ctx.translate(2, -px - 3);
    ctx.fillText(text[i], 0, px);
    ctx.restore();
  }
}

function drawTextLines(ctx, text, x, y, fontsize) {
  var lines = text.split("\n");
  var sx = x + fontsize
  var sy = y
  var maxlen = 0
  for (var l = 0; l < lines.length; l++) {
    var line = lines[l]
    tategaki(ctx, line, x - fontsize * l, y, fontsize);
    maxlen = maxlen < line.length ? line.length : maxlen
  }
  //ctx.strokeRect(sx, sy, -fontsize * lines.length, fontsize * maxlen)
  var cx = sx -fontsize * lines.length / 2
  var cy = sy + fontsize * maxlen / 2

  ctx.beginPath();
  ctx.ellipse(cx + fontsize / 8, cy, fontsize * lines.length / 2 + fontsize * 2, fontsize * maxlen / 2  + fontsize * 2, 0, 0, 2 * Math.PI);
  ctx.stroke();

}

var fab

new Vue({
  el: "#app",
  data: {
    msg: "Hello",
    input: example,
    ctx: undefined
  },
  methods: {
    addImage: function(img){
      fabric.Image.fromURL(`../${img}.png`, function(img) {
        img.set('left', 100).set('top', 100)
        fab.add(img);
      });
    },
    removeObj: function(){
      fab.getActiveObject().remove();
    },
    redraw: function () {
      var j = JSON.parse(this.input)

      var ctx = this.ctx

      for (var i = 0; i < 4; i++) {
        var ox = 20
        var oy = 20 + (280 + 20) * i
        ctx.strokeStyle = "black"
        ctx.lineWidth = 4
        ctx.strokeRect(ox, oy, 420, 280)

        var fontsize = 18;
        var x
        var y = oy + 30
        if (j[i].length > 0) {
          x = ox + 400 - fontsize
          drawTextLines(ctx, j[i][0], x, y, fontsize)
        }
        if (j[i].length > 1) {
          var linelength = j[i][1].split("\n").length;
          x = ox + 20 + fontsize * (linelength - 1)
          drawTextLines(ctx, j[i][1], x, y, fontsize)
        }
      }
    }
  },
  mounted: function () {
    var canvas = document.querySelector("#output")
    var w = 420 + 20 * 2
    var h = (280 + 20) * 4 + 20

    canvas.width = `${w}`
    canvas.height = `${h}`
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    this.ctx = canvas.getContext("2d")
    var font = new FontFace("newfont", "url(07YasashisaAntique.otf)", {});
    var self = this
    font.load().then((loadedFace) => {
      setTimeout(() => {
        document.fonts.add(loadedFace);
        self.redraw();
      }, 1000);
    });

    var fabel = document.querySelector("#overlay")
    fabel.width = `${w}`
    fabel.height = `${h}`
    fabel.style.width = `${w}px`
    fabel.style.height = `${h}px`
    fab = new fabric.Canvas('overlay');

    window.addEventListener('keyup', (ev)=>{
      if(ev.keyCode === 46){
        if(fab.getActiveObject()){
          fab.getActiveObject().remove();
        }
      }
    })
    // create a rectangle with angle=45
    /*
    var rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'red',
      width: 20,
      height: 20,
      angle: 45
    });

    fab.add(rect);
    */
  }
})

