const apiKey = "3e5bf97ff06b4ae69bf51393f71cfa64";  // your NewsAPI key
const newsContainer = document.getElementById("news-container");
const trendingContainer = document.getElementById("trending-container");

// Load default category
fetchNews("general");
loadBreakingNews();
loadTrendingNews();

// Function to fetch news by category
async function fetchNews(category) {
  newsContainer.innerHTML = "<p>Loading...</p>";
  try {
    let url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=12&apiKey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.articles && data.articles.length > 0) {
      displayNews(data.articles, category);
    } else {
      newsContainer.innerHTML = "<p>No news found.</p>";
    }
  } catch (err) {
    newsContainer.innerHTML = `<p style="color:red;">⚠️ Failed to load news. Please try again later.</p>`;
    console.error("Error fetching news:", err);
  }
}

// Function to display news
function displayNews(articles, category) {
  newsContainer.innerHTML = "";
  articles.forEach(article => {
    const card = document.createElement("div");
    card.classList.add("news-card");

    // Format date
    const publishedDate = article.publishedAt
      ? new Date(article.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Unknown date";

    card.innerHTML = `
      <img src="${article.urlToImage || 'https://via.placeholder.com/300x150'}" alt="News">
      <h3>
        <a href="${article.url}" target="_blank">${article.title}</a>
      </h3>
      <p>${article.description || ""}</p>
      <div class="news-meta">
        <span>📌 ${article.source?.name || category}</span>
        <span>🗓️ ${publishedDate}</span>
        <span>✍️ ${article.author || "Unknown"}</span>
      </div>
    `;
    newsContainer.appendChild(card);
  });
}

// Breaking News Marquee
async function loadBreakingNews() {
  try {
    let url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.articles && data.articles.length > 0) {
      const marquee = document.querySelector(".breaking-news marquee");
      marquee.innerHTML = data.articles.map(a => a.title).join(" ⚡ ");
    }
  } catch (err) {
    console.error("Error loading breaking news:", err);
  }
}

// Trending News
async function loadTrendingNews() {
  try {
    let url = `https://newsapi.org/v2/everything?q=trending&sortBy=popularity&pageSize=6&apiKey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.articles && data.articles.length > 0) {
      trendingContainer.innerHTML = "";
      data.articles.forEach(article => {
        const card = document.createElement("div");
        card.classList.add("trending-card");

        const publishedDate = article.publishedAt
          ? new Date(article.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "Unknown date";

        card.innerHTML = `
          <img src="${article.urlToImage || 'https://via.placeholder.com/250x120'}" alt="Trending">
          <h4><a href="${article.url}" target="_blank">${article.title}</a></h4>
          <p>${article.description || ""}</p>
          <div class="news-meta">
            <span>📌 ${article.source?.name || "Trending"}</span>
            <span>🗓️ ${publishedDate}</span>
          </div>
        `;
        trendingContainer.appendChild(card);
      });
    }
  } catch (err) {
    console.error("Error loading trending news:", err);
  }
}

// Sidebar category filtering
document.querySelectorAll(".sidebar ul li a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    let category = e.target.getAttribute("data-category");

    document.querySelectorAll(".sidebar ul li a").forEach(l => l.classList.remove("active"));
    e.target.classList.add("active");

    fetchNews(category);
  });
});

// Navbar category filtering
document.querySelectorAll("header nav ul li a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    let category = e.target.getAttribute("data-category");

    document.querySelectorAll("header nav ul li a").forEach(l => l.classList.remove("active"));
    e.target.classList.add("active");

    fetchNews(category);
  });
});
