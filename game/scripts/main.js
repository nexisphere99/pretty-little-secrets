Macro.add("dialog", {
  handler: function () {
    if (this.args.length < 2) {
      return this.error(
        "Dialog macro requires at least 3 arguments: character name, avatar URL, and message."
      );
    }
    var characterName = this.args[0];
    var avatarUrl = null;

    // Dynamically set border color based on character name
    var borderColor = "#f06292"; // Default color
    var backgroundColor = "#4ab2db";
    if (characterName === "Alex") {
      borderColor = "#8470FF"; // Example: Blue for "mc"
      backgroundColor = "#EAE7FF";
      avatarUrl = "image/avatar/alex.png";
    } else if (characterName === "Raven") {
      borderColor = "#BF1313";
      backgroundColor = "#EEC1C1";
      avatarUrl = "image/avatar/raven.png";
    } else if (characterName === "Lily") {
      borderColor = "#0CA212";
      backgroundColor = "#CDF4CE";
      avatarUrl = "image/avatar/lily.png";
    } else if (characterName === "Evelyn") {
      borderColor = "#043506";
      backgroundColor = "#65DD6A";
      avatarUrl = "image/avatar/evelyn.png";
    } else if (characterName === "Chloe") {
      borderColor = "#DF0ADF";
      backgroundColor = "#F9D5F9";
      avatarUrl = "image/avatar/chloe.png";
    } else if (characterName === "Anna") {
      borderColor = "#FF9900";
      backgroundColor = "#FFDDAC";
      avatarUrl = "image/avatar/anna.png";
    } else if (characterName === "Zara") {
      borderColor = "#350854";
      backgroundColor = "#9781A7";
      avatarUrl = "image/avatar/zara.png";
    } else if (characterName === "Sophia") {
      borderColor = "#444444";
      backgroundColor = "#D7D7D7";
      avatarUrl = "image/avatar/sophia.png";
    } else if (characterName === "Vanessa") {
      borderColor = "#7B460F";
      backgroundColor = "#DDCFC1";
      avatarUrl = "image/avatar/vanessa.png";
    }
    var message = this.args.slice(1).join(" ");
    var $dialog = $('<div class="dialog-box"></div>');
    var $avatar = $(
      '<img class="avatar" alt="' + characterName + ' avatar">'
    ).attr("src", avatarUrl);
    $avatar.css("border-color", borderColor);

    var $content = $('<div class="dialog-content"></div>');
    $dialog.css("border-color", borderColor);
    $dialog.css("background", backgroundColor);
    var $nameplate = $('<div class="nameplate"></div>').text(characterName);
    $nameplate.css("color", borderColor);
    var $message = $('<div class="message"></div>').html(
      Wikifier.wikifyEval(message)
    );
    $content.append($nameplate, $message);
    $dialog.append($avatar, $content);
    $(this.output).append($dialog);
  },
});

Macro.add("centerImage", {
  handler() {
    if (this.args.length === 0) {
      return this.error("Missing image URL.");
    }

    const imageUrl = this.args[0];
    const html = `
            <div class="centered-image">
                <img src="${imageUrl}" alt="Image" />
            </div>
        `;

    $(this.output).append(html);
  },
});

$(document).on(":passagerender", function () {
  if (!$("#menu-item-patreon").length) {
    $("#menu-core").append(
      '<li id="menu-item-patreon"><a href="https://www.patreon.com/c/zaramystique" target="_blank">❤️ Support Me</a></li>'
    );
  }
  if (!$("#menu-item-characters").length) {
    $("#menu-core").append(
      '<li id="menu-item-characters"><a href="#" id="open-character-popup">Characters</a></li>'
    );
  }
  // Create popup container only once
  if (!$("#character-popup").length) {
    $("body").append(`
      <div id="character-popup" class="character-popup">
        <div class="character-popup-content">
          <span class="close-character-popup">&times;</span>
          <h2>Main Characters</h2>
          <div class="character-list">
            <div><strong>Alex</strong> – Shy, reluctantly feminized protagonist.</div>
            <div><strong>Chloe</strong> – Dominant girlfriend, initiates feminization.</div>
            <div><strong>Evelyn</strong> – Strict stepmother, enforces etiquette.</div>
            <div><strong>Lily</strong> – Rebellious stepsister, loves teasing & blackmail.</div>
            <div><strong>Vanessa</strong> – Curvy coworker, encourages waitress transition.</div>
            <div><strong>Anna</strong> – Seductive friend, introduces taboo kinks.</div>
            <div><strong>Raven</strong> – Sex Toy Shop Manager, Mysterious</div>
            <div><strong>Zara</strong> – Club promoter, drives nightlife feminization.</div>
            <div><strong>Mia</strong> – Playful friend, beauty mentor.</div>
            <div><strong>Jade</strong> – Flirtatious redhead, pushes sexy clothing.</div>
            <div><strong>Sophia</strong> – The yoga woman two doors down; warm, grounded, unhurried.</div>
            <div><strong>Mr. Henderson</strong> – Elderly neighbor, waters his lawn every morning without fail.</div>
            <div><strong>Ali</strong> – Runs the corner store, knows everyone, gentle and unbothered.</div>
            <div><strong>Mrs. Delgado</strong> – Ancient park-bench fixture who sees everything in the neighborhood.</div>
            <div><strong>Claire</strong> – Steel-eyed yoga instructor glimpsed in the park; commands a room without raising her voice.</div>
            <div><strong>Theo</strong> – A gentle gardener a few blocks over, tending wildflowers with quiet care.</div>
          </div>
        </div>
      </div>
    `);
  }

  // Open/Close logic
  $("#open-character-popup")
    .off("click")
    .on("click", function (e) {
      e.preventDefault();
      $("#character-popup").fadeIn(200);
    });

  $(".close-character-popup")
    .off("click")
    .on("click", function () {
      $("#character-popup").fadeOut(200);
    });
});

$(document).on(":passagerender", function () {
  if (!$("#right-icon-strip").length) {
    $("body").append(`
      <div id="right-icon-strip">
        <div class="icon-button" title="Objectives">📋</div>
        <div class="icon-button" title="Phone">📱</div>
        <div class="icon-button" title="Map">🗺️</div>
        <div class="icon-button" title="Location">📍</div>
        <div class="icon-button" title="Inventory">🎒</div>
        <div class="icon-button" title="Clothes">👗</div>
      </div>
    `);
  }
});

function renderClothingGrid() {
  const clothes = State.variables.cloths || [];
  const container = document.getElementById("clothingGrid");
  if (!container) return;

  container.innerHTML = "";

  clothes.forEach((item) => {
    if (!item.img) return;

    const div = document.createElement("div");
    div.className = "clothing-item";

    const img = document.createElement("img");
    img.src = "image/" + item.img; // Or `item.img` if full URL
    img.alt = "Clothing";
    img.onerror = () => (img.style.display = "none");

    div.appendChild(img);
    container.appendChild(div);
  });
}

// Maps inventory item id strings (as pushed by the <<addItem>> widget) to an image path.
const itemImageMap = {
  pink_panties: "chloe/panty_1.png",
};

function renderInventoryGrid() {
  const items = State.variables.inventory || [];
  const container = document.getElementById("inventoryGrid");
  if (!container) return;

  container.innerHTML = "";

  items.forEach((itemId) => {
    const imgPath = itemImageMap[itemId];

    const div = document.createElement("div");
    div.className = "inventory-item";

    if (imgPath) {
      const img = document.createElement("img");
      img.src = "image/" + imgPath;
      img.alt = itemId;
      img.onerror = () => (img.style.display = "none");
      div.appendChild(img);
    } else {
      div.textContent = itemId.replace(/_/g, " ");
    }

    container.appendChild(div);
  });
}

$(document).on(":passagerender", function () {
  if (!$("#popup-overlay").length) {
    $("body").append(`
      <div id="popup-overlay" class="popup-overlay">
        <div class="popup-content">
          <span class="popup-close">&times;</span>
          <div id="popup-body"></div>
        </div>
      </div>
    `);
  }

  // Handle icon button clicks
  $(document).on("click", ".icon-button", function () {
    const label = $(this).attr("title");
    let content = "";

    let wikiFragment = null;

    switch (label) {
      case "Objectives":
        content = "<h3>📋 Today's Plan</h3>";
        wikiFragment = Wikifier.wikifyEval("<<dayPlanContent>>");
        break;

      case "Phone":
        content = `
        <h3>📱 Phone</h3>
        <div class="pink-phone">
          <div class="app-grid">
            ${generateFixedAppGrid()}
          </div>
        </div>
      `;
        break;

      case "Map":
        content = "<h3>🗺️ Map</h3>";
        wikiFragment = Wikifier.wikifyEval(
          '<<locationMap $currentMapLocation>>'
        );
        break;
      case "Location":
        content =
          "<h3>📍 Current Location</h3><img src='image/" +
          State.variables.currentLocation +
          ".png' style='width: 500px;'>";
        break;
      case "Inventory":
        content =
          "<h3>🎒 Inventory</h3><p>View your items here. Feminized gear, makeup, accessories, and more.</p><div id='inventoryGrid' class='inventory-grid'></div>";
        break;
      case "Clothes":
        content =
          "<h3>👗 Clothing</h3><p>Your wardrobe contains: What you have pick what to wear.</p><div id='clothingGrid' class='clothing-grid'></div>";
        break;
    }

    $("#popup-body").html(content);
    if (wikiFragment) {
      $("#popup-body").append(wikiFragment);
    }
    if (label === "Clothes") {
      renderClothingGrid(); // 👈 this calls the renderer
    }
    if (label === "Inventory") {
      renderInventoryGrid(); // 👈 this calls the renderer
    }
    $("#popup-overlay").fadeIn(200);
  });

  // Close popup
  $(document).on("click", ".popup-close", function () {
    $("#popup-overlay").fadeOut(200);
  });
});

function generateFixedAppGrid() {
  const apps = [
    "💄",
    "💅",
    "🛍️",
    "👛",
    "👗",
    "🎧",
    "💖",
    "📖",
    "🎁",
    "📸",
    "🎵",
    "🍰",
    "🏞️",
    "🪞",
    "💌",
  ];
  const bottom = ["📞", "💬", "🔙"];

  let html = "";

  // Add 20 apps
  apps.forEach((icon) => {
    html += `<div class="app-tile">${icon}</div>`;
  });

  // Add last row: system buttons
  bottom.forEach((icon) => {
    html += `<div class="app-tile">${icon}</div>`;
  });

  return html;
}


$(document).one(':storyready', function () {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💖</text></svg>';
  document.head.appendChild(link);
});




// === Create and inject top bar ===
$(document).one(':storyready', function () {
  const topBar = document.createElement("div");
  topBar.id = "top-bar";
  topBar.innerHTML = `
      Day: <span id="day">1</span> | &#128336; <span id="label">7:00 AM</span>
  `;
  document.body.prepend(topBar);
});

// === Apply CSS to avoid overlapping UI bar ===
const style = document.createElement("style");
style.textContent = `
#top-bar {
position: fixed;
top: 0;
left: 17.5em; /* default width of the UI bar */
width: calc(100% - 17.5em);
background: #ff3988;
color: white;
padding: 10px;
font-family: sans-serif;
z-index: 9999;
text-align: center;
box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
body {
padding-top: 50px;
}
`;
document.head.appendChild(style);

// === Format total minutes-since-midnight as a 12-hour clock string ===
function formatClockJS(totalMinutes) {
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const min = totalMinutes % 60;
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${min < 10 ? "0" + min : min} ${ampm}`;
}

// === Update function for top bar ===
function updateTopBar() {
  const dayEl = document.getElementById("day");
  const labelEl = document.getElementById("label");
  if (dayEl) {
      const gameMinutes = typeof State.variables.gameMinutes === "number" ? State.variables.gameMinutes : 420;
      dayEl.textContent = State.variables.day;
      labelEl.textContent = formatClockJS(gameMinutes);
  }
}

// === Update bar after each passage ===
$(document).on(':passagerender', function () {
  updateTopBar();
});

