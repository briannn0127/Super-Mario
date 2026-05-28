(function () {
  "use strict";

  var firebaseConfig = {
    databaseURL: "https://supermario-777-default-rtdb.firebaseio.com",
  };

  var databaseUrl = firebaseConfig.databaseURL.replace(/\/$/, "");

  function forceViewportFit() {
    document.documentElement.style.width = "100%";
    document.documentElement.style.height = "100%";
    document.documentElement.style.overflow = "hidden";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    var gameDiv = document.getElementById("GameDiv");
    if (gameDiv) {
      gameDiv.style.width = "100vw";
      gameDiv.style.height = "100vh";
      gameDiv.style.margin = "0";
      gameDiv.style.border = "0";
      gameDiv.style.overflow = "hidden";
    }
  }

  if (window.fetch && !window.__webMarioLeaderboardFetchFix) {
    window.__webMarioLeaderboardFetchFix = true;
    var originalFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      var url = typeof input === "string" ? input : input && input.url;
      if (url && url.indexOf(databaseUrl + "/leaderboard.json?orderBy=") === 0) {
        return originalFetch(databaseUrl + "/leaderboard.json", init);
      }
      return originalFetch(input, init);
    };
  }

  var style = document.createElement("style");
  style.textContent = [
    ".wm-public-board-button{position:fixed;right:14px;top:14px;z-index:9998;min-width:166px;height:44px;border:4px solid #1d3858;background:linear-gradient(#fff48a,#ffb13b);color:#1f405c;font-family:Arial,Helvetica,sans-serif;font-size:17px;font-weight:900;text-shadow:1px 1px 0 #fff;box-shadow:0 5px 0 #101d31,0 10px 20px rgba(0,0,0,.3);cursor:pointer}",
    ".wm-public-board{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:9999;width:min(420px,calc(100vw - 32px));display:none;box-sizing:border-box;padding:16px 18px 18px;color:#1f405c;font-family:Arial,Helvetica,sans-serif;text-align:center;background:linear-gradient(#fffdf4,#dff6ff);border:4px solid #1d3858;box-shadow:0 8px 0 #101d31,0 18px 30px rgba(0,0,0,.35)}",
    ".wm-public-board h2{margin:0 0 10px;color:#ff4438;font-size:30px;line-height:1;text-shadow:3px 3px 0 #24466e}",
    ".wm-public-board p{margin:0 0 12px;font-weight:800;font-size:18px}",
    ".wm-public-board ol{margin:0;padding:0;list-style:none;display:grid;gap:4px}",
    ".wm-public-board li{display:grid;grid-template-columns:32px 1fr auto;gap:8px;align-items:center;min-height:28px;padding:3px 8px;background:rgba(255,255,255,.76);border:2px solid rgba(36,70,110,.35);font-weight:700}",
    ".wm-public-board .rank{color:#ff4438}",
    ".wm-public-board .name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}",
    ".wm-public-board button{margin-top:12px;width:100%;height:38px;border:3px solid #1d3858;background:#6ad8ff;color:#1f405c;font-weight:900;font-size:14px;cursor:pointer}",
    "@media (max-width:700px){.wm-public-board-button{right:8px;top:8px;min-width:132px;height:38px;font-size:14px}.wm-public-board h2{font-size:25px}}",
  ].join("");
  document.head.appendChild(style);

  var openButton = document.createElement("button");
  openButton.className = "wm-public-board-button";
  openButton.type = "button";
  openButton.textContent = "LEADERBOARD";

  var board = document.createElement("div");
  board.className = "wm-public-board";
  board.innerHTML = '<h2>LEADERBOARD</h2><p>TOP 10 SCORES</p><ol></ol><button type="button">CLOSE</button>';

  document.addEventListener("DOMContentLoaded", function () {
    forceViewportFit();
    document.body.appendChild(openButton);
    document.body.appendChild(board);
  });
  window.addEventListener("resize", forceViewportFit);

  function renderScores(scores) {
    var list = board.querySelector("ol");
    list.innerHTML = "";
    if (!scores.length) {
      list.innerHTML = '<li><span class="rank">--</span><span class="name">NO SCORES YET</span><span>000000</span></li>';
      return;
    }
    scores.forEach(function (entry, index) {
      var li = document.createElement("li");
      li.innerHTML =
        '<span class="rank">' + String(index + 1).padStart(2, "0") + '</span>' +
        '<span class="name"></span>' +
        '<span>' + String(entry.score || 0).padStart(6, "0") + '</span>';
      li.querySelector(".name").textContent = entry.name || "PLAYER";
      list.appendChild(li);
    });
  }

  function loadScores() {
    var url = databaseUrl + "/leaderboard.json";
    return fetch(url)
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then(function (data) {
        var scores = Object.keys(data || {}).map(function (key) {
          return data[key];
        }).sort(function (a, b) {
          return (b.score || 0) - (a.score || 0);
        });
        renderScores(scores);
      })
      .catch(function (err) {
        console.error("Firebase leaderboard load failed:", err);
        renderScores([]);
      });
  }

  openButton.addEventListener("click", function (event) {
    event.stopPropagation();
    board.style.display = "block";
    openButton.style.display = "none";
    loadScores();
  });

  board.querySelector("button").addEventListener("click", function (event) {
    event.stopPropagation();
    board.style.display = "none";
    openButton.style.display = "block";
  });
}());
