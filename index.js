var example = `[
  ["テストだよー","どういうことだよ"],
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



new Vue({
  el: "#app",
  data: {
    msg: "Hello",
    input: example,
    ctx: undefined
  },
  methods: {
    redraw: function () {
      console.log(this.input)
      var j = JSON.parse(this.input)

      var ctx = this.ctx

      for(var i = 0; i < 4; i++){
        var ox = 20
        var oy = 20 + (280 + 20) * i
        ctx.strokeStyle="black"
        ctx.lineWidth=4
        ctx.strokeRect(ox, oy, 420, 280)


        var fontsize = 18;
  //      ctx.clearRect(0, 0, 300, 800);
        var x = ox + 400 - fontsize
        var y = oy + 30
        if(j[i].length > 0){
          x = ox + 400 - fontsize
          ctx.beginPath();
          ctx.ellipse(x, y + 40, 80, 120, 0, 0, 2 * Math.PI);
          ctx.stroke();

          tategaki(ctx, j[i][0], x, y, fontsize);
        }
        if(j[i].length > 1){
          x = ox + 30 - fontsize
          ctx.beginPath();
          ctx.ellipse(x, y + 40, 80, 120, 0, 0, 2 * Math.PI);
          ctx.stroke();

          tategaki(ctx, j[i][1], x, y, fontsize);
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
  }
})

