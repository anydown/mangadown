var example = `[
  ["テストだよー","どういうことだよ"],
  ["そういうことだよ","なるほど"],
  ["わーい"],
  ["なんのこっちゃ"]
]
`


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
      var ctx = this.ctx

      for(var i = 0; i < 4; i++){
        ctx.strokeStyle="black"
        ctx.lineWidth=4

    //420 x 280
    //20        
        ctx.strokeRect(20, 20 + (280 + 20) * i, 420, 280)
      }


      var fontsize = 18;
//      ctx.clearRect(0, 0, 300, 800);
      for (var i = 0; i < 8; i++) {
        var x = 400 - (fontsize * i)- i * 5
        var y = 30
        tategaki(ctx, "こんにちはー", x, y, fontsize);
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

