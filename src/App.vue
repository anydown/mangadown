<template>
  <div class="container">
    <h2 class="title">
      <img src="/assets/hage_t1.png" width="40" /> Mangadown
      <img src="/assets/hage_t2.png" width="40" />
    </h2>

    <MangaDown></MangaDown>
  </div>
  <div class="footer">
    <div class="container">
      <div class="row">
        <div class="column">
          <p>
            Hosted on
            <a href="https://github.com/anydown/mangadown">GitHub</a>
          </p>
          <a
            href="https://twitter.com/intent/tweet?button_hashtag=%E7%99%BD%E3%83%8F%E3%82%B2%EF%BC%94%E3%82%B3%E3%83%9E%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC"
            class="twitter-hashtag-button"
            data-related="hashedrock"
            data-url="https://anydown.github.io/mangadown/"
          >Tweet #%E7%99%BD%E3%83%8F%E3%82%B2%EF%BC%94%E3%82%B3%E3%83%9E%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MangaDown from "./components/MangaDown.vue";

export default {
  name: "App",
  components: {
    MangaDown,
  },
  mounted() {
    !(function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0],
        p = /^http:/.test(d.location) ? "http" : "https";
      if (!d.getElementById(id)) {
        js = d.createElement(s);
        js.id = id;
        js.src = p + "://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);
      }
    })(document, "script", "twitter-wjs");
  },
};
</script>
