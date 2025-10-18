import React, { useEffect } from 'react'
import MangaDown from './components/MangaDown'

function App() {
  useEffect(() => {
    // Twitter widget script
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
  }, []);

  return (
    <>
      <div className="container">
        <h2 className="title">
          <img src="/assets/hage_t1.png" width="40" /> Mangadown
          <img src="/assets/hage_t2.png" width="40" />
        </h2>

        <MangaDown />
      </div>
      <div className="footer">
        <div className="container">
          <div className="row">
            <div className="column">
              <p>
                Hosted on
                <a href="https://github.com/anydown/mangadown">GitHub</a>
              </p>
              <a
                href="https://twitter.com/intent/tweet?button_hashtag=%E7%99%BD%E3%83%8F%E3%82%B2%EF%BC%94%E3%82%B3%E3%83%9E%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC"
                className="twitter-hashtag-button"
                data-related="hashedrock"
                data-url="https://anydown.github.io/mangadown/"
              >Tweet #%E7%99%BD%E3%83%8F%E3%82%B2%EF%BC%94%E3%82%B3%E3%83%9E%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
