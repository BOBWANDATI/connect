// ======================
// SAFE ELEMENT SELECTOR
// ======================

function $(id) {
  return document.getElementById(id);
}

// ======================
// STATISTICS COUNTER
// ======================

let users = 0;
let reports = 0;
let peace = 0;

const usersCounter = $("users");
const reportsCounter = $("reports");
const peaceCounter = $("peace");

if (usersCounter && reportsCounter && peaceCounter) {

  const counter = setInterval(() => {

    users += 10;
    reports += 2;
    peace += 1;

    usersCounter.textContent = users + "+";
    reportsCounter.textContent = reports + "+";
    peaceCounter.textContent = peace + "+";

    if (users >= 1000) {
      clearInterval(counter);
    }

  }, 30);

}

// ==========================
// FORUM SYSTEM
// ==========================

const forumForm = $("forumForm");
const commentsSection = $("commentsSection");
const forumMessage = $("forumMessage");

const bannedWords = [
  "hate",
  "stupid",
  "violence",
  "kill",
  "tribal",
  "idiot"
];

// ==========================
// TOPIC BUTTONS
// ==========================

const topicButtons = document.querySelectorAll(".topic-btn");
const topicDetails = $("topicDetails");

const topicsData = {

  peacebuilding: `
    <h3>Peacebuilding</h3>
    <p>
      Peacebuilding promotes unity,
      reconciliation and peaceful
      coexistence in communities.
    </p>
  `,

  youth: `
    <h3>Youth Empowerment</h3>
    <p>
      Empowering youth with skills,
      leadership and education helps
      build stronger communities.
    </p>
  `,

  conflict: `
    <h3>Conflict Resolution</h3>
    <p>
      Conflict resolution encourages
      peaceful communication and mediation.
    </p>
  `,

  digital: `
    <h3>Digital Safety</h3>
    <p>
      Digital safety protects people
      from cyberbullying and misinformation.
    </p>
  `
};

topicButtons.forEach(button => {

  button.addEventListener("click", () => {

    const topic = button.dataset.topic;

    if (topicDetails && topicsData[topic]) {
      topicDetails.innerHTML = topicsData[topic];
    }

  });

});

// ==========================
// ESCAPE HTML
// ==========================

function escapeHTML(text) {

  const div = document.createElement("div");
  div.textContent = text;

  return div.innerHTML;

}

// ==========================
// CREATE COMMENT
// ==========================

function createComment(name, comment, date) {

  if (!commentsSection) return;

  const commentCard = document.createElement("div");

  commentCard.classList.add("comment-card");

  commentCard.innerHTML = `
    <h4>${escapeHTML(name)}</h4>

    <p>${escapeHTML(comment)}</p>

    <small>Posted: ${date}</small>

    <div class="comment-actions">
      <button class="reply-btn">Reply</button>
      <button class="delete-btn">Delete</button>
    </div>

    <div class="reply-container"></div>
  `;

  commentsSection.prepend(commentCard);

  // DELETE

  const deleteBtn =
    commentCard.querySelector(".delete-btn");

  deleteBtn.addEventListener("click", () => {
    commentCard.remove();
  });

  // REPLY

  const replyBtn =
    commentCard.querySelector(".reply-btn");

  const replyContainer =
    commentCard.querySelector(".reply-container");

  replyBtn.addEventListener("click", () => {

    if (replyContainer.innerHTML !== "") return;

    replyContainer.innerHTML = `
      <div class="reply-box">
        <textarea rows="3"
          placeholder="Write reply..."></textarea>

        <button class="reply-submit-btn">
          Submit Reply
        </button>
      </div>
    `;

    const submitReplyBtn =
      replyContainer.querySelector(".reply-submit-btn");

    const replyTextarea =
      replyContainer.querySelector("textarea");

    submitReplyBtn.addEventListener("click", () => {

      const replyText =
        replyTextarea.value.trim();

      if (!replyText) return;

      const reply =
        document.createElement("div");

      reply.classList.add("reply");

      reply.innerHTML = `
        <strong>Reply:</strong>
        <p>${escapeHTML(replyText)}</p>
      `;

      replyContainer.innerHTML = "";
      replyContainer.appendChild(reply);

    });

  });

}

// ==========================
// SUBMIT COMMENT
// ==========================

if (forumForm) {

  forumForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const forumName =
      $("forumName").value.trim();

    const forumComment =
      $("forumComment").value.trim();

    const commentLower =
      forumComment.toLowerCase();

    const containsBadWord =
      bannedWords.some(word =>
        commentLower.includes(word)
      );

    if (containsBadWord) {

      forumMessage.innerHTML = `
        <div class="warning-message">
          ❌ Comment blocked.
        </div>
      `;

      return;

    }

    const currentDate =
      new Date().toLocaleString();

    createComment(
      forumName,
      forumComment,
      currentDate
    );

    let comments =
      JSON.parse(
        localStorage.getItem("forumComments")
      ) || [];

    comments.push({
      name: forumName,
      comment: forumComment,
      date: currentDate
    });

    localStorage.setItem(
      "forumComments",
      JSON.stringify(comments)
    );

    forumMessage.innerHTML = `
      <div class="success-message">
        ✅ Comment posted successfully.
      </div>
    `;

    setTimeout(() => {
      forumMessage.innerHTML = "";
    }, 3000);

    forumForm.reset();

  });

}

// ==========================
// LOAD COMMENTS
// ==========================

window.addEventListener("DOMContentLoaded", () => {

  const savedComments =
    JSON.parse(
      localStorage.getItem("forumComments")
    ) || [];

  savedComments.forEach(data => {

    createComment(
      data.name,
      data.comment,
      data.date
    );

  });

});

// ==========================
// DARK MODE
// ==========================

const darkModeBtn = $("darkModeBtn");

if (darkModeBtn) {

  darkModeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

  });

}

// ==========================
// SEARCH ARTICLES
// ==========================

const searchInput = $("searchInput");

if (searchInput) {

  searchInput.addEventListener("keyup", () => {

    const value =
      searchInput.value.toLowerCase();

    const cards =
      document.querySelectorAll(".article-card");

    cards.forEach(card => {

      const text =
        card.textContent.toLowerCase();

      card.style.display =
        text.includes(value)
        ? "block"
        : "none";

    });

  });

}

// ==========================
// LIKE BUTTONS
// ==========================

document.querySelectorAll(".like-btn")
.forEach(button => {

  button.addEventListener("click", () => {

    button.classList.toggle("liked");

    if (button.classList.contains("liked")) {

      button.innerHTML = "❤️ Liked";
      button.style.backgroundColor = "#dc3545";

    } else {

      button.innerHTML = "👍 Like";
      button.style.backgroundColor = "#28a745";

    }

  });

});

// ==========================
// LIVE TIME & LOCATION
// ==========================

const liveInfo = $("liveInfo");

let currentLocation = "Detecting location...";

function updateTime() {

  if (!liveInfo) return;

  const now = new Date();

  const time =
    now.toLocaleTimeString();

  liveInfo.innerHTML = `
    📍 ${currentLocation}<br>
    🕒 ${time}
  `;

}

setInterval(updateTime, 1000);

if (navigator.geolocation) {

  navigator.geolocation.getCurrentPosition(

    (position) => {

      const lat =
        position.coords.latitude.toFixed(2);

      const lon =
        position.coords.longitude.toFixed(2);

      currentLocation =
        `Lat: ${lat} | Lon: ${lon}`;

    },

    () => {

      currentLocation =
        "Location blocked";

    }

  );

}

updateTime();

