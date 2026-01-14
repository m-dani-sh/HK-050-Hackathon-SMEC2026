const ETSY_API_KEY = "5v68xplogevnqg83zcxd6565";      // 👈 Replace with your Etsy API Key
const RAPIDAPI_KEY = "";      // 👈 Replace with your RapidAPI Key
const SERPAPI_API_KEY = "e80c0a7188518c46f252f16a79b19f203d7b3431b8c6aa118ef23ca0dba87366"; // 👈 Replace with your SerpApi API Key

const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")
const resultsContainer = document.getElementById("resultsContainer")
const emptyState = document.getElementById("emptyState")
const errorMessage = document.getElementById("errorMessage")
const loadingSpinner = document.getElementById("loadingSpinner")

// Event listeners
searchBtn.addEventListener("click", performSearch)
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") performSearch()
})

function performSearch() {
  const query = searchInput.value.trim().toLowerCase()

  if (!query) {
    showError("Please enter a product name")
    return
  }

  // Show loading state
  loadingSpinner.classList.remove("hidden")
  errorMessage.classList.add("hidden")
  resultsContainer.classList.add("hidden")
  emptyState.classList.add("hidden")

  fetchDeals(query);
}

function fetchDeals(query) {
  // TO DO: implement API call to fetch deals
}

async function fetchDeals(query) {
  if (!ETSY_API_KEY || !RAPIDAPI_KEY || !SERPAPI_API_KEY) {
    showError("One or more API keys are not set. Please add them in script.js");
    loadingSpinner.classList.add("hidden");
    return;
  }

  const fetchEtsy = async (query) => {
    const url = `https://openapi.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(query)}&limit=10`;
    try {
      const response = await fetch(url, {
        headers: { 'x-api-key': ETSY_API_KEY }
      });
      const data = await response.json();
      return data.results.map(item => ({
        platform: 'Etsy',
        title: item.title,
        price: item.price.amount / item.price.divisor,
        image: item.listing_images?.[0]?.url_fullxfull || '',
        link: item.url
      }));
    } catch (error) {
      console.error('Etsy API Error:', error);
      return [];
    }
  };

  const fetchAmazon = async (query) => {
    const url = `https://amazon-product-search-api1.p.rapidapi.com/search?keyword=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(url, {
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'amazon-product-search-api1.p.rapidapi.com'
        }
      });
      const data = await response.json();
      return data.results.map(item => ({
        platform: 'Amazon',
        title: item.title,
        price: item.price.current_price,
        image: item.thumbnail,
        link: item.url
      }));
    } catch (error) {
      console.error('Amazon (RapidAPI) Error:', error);
      return [];
    }
  };

  const fetchWalmart = async (query) => {
    const url = `https://serpapi.com/search.json?engine=walmart&query=${encodeURIComponent(query)}&api_key=${SERPAPI_API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return (data.shopping_results || []).map(item => ({
        platform: 'Walmart',
        title: item.title,
        price: item.primary_offer.offer_price,
        image: item.thumbnail,
        link: item.product_page_url
      }));
    } catch (error) {
      console.error('Walmart (SerpApi) Error:', error);
      return [];
    }
  };

  try {
    const results = await Promise.all([
      fetchEtsy(query),
      fetchAmazon(query),
      fetchWalmart(query)
    ]);

    const allDeals = results.flat().filter(deal => deal);
    loadingSpinner.classList.add("hidden");

    if (allDeals.length > 0) {
      displayResults(allDeals, query);
      resultsContainer.classList.remove("hidden");
    } else {
      showError(`No results found for "${query}".`);
    }
  } catch (error) {
    loadingSpinner.classList.add("hidden");
    showError("An error occurred while fetching deals.");
    console.error("Fetch error:", error);
  }
}

function displayResults(deals, query) {
  document.getElementById("productName").textContent = `Results for "${query}"`;
  document.getElementById("productDesc").textContent = `Found ${deals.length} offers across different stores.`;

  const validDeals = deals.filter(deal => deal && typeof deal.price === 'number' && deal.price > 0);

  if (validDeals.length === 0) {
    showError(`No valid offers found for "${query}".`);
    resultsContainer.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  }

  const lowestPrice = Math.min(...validDeals.map(d => d.price));

  const pricesContent = document.getElementById("pricesContent");
  pricesContent.innerHTML = "";

  validDeals.forEach(item => {
    const isLowest = item.price === lowestPrice;
    const card = document.createElement("div");
    card.className = `price-card ${isLowest ? "best-price" : ""}`;

    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="product-image" onerror="this.style.display='none'">
      <div class="product-details">
        <div class="platform-name">${item.platform}</div>
        <div class="product-title" title="${item.title}">${item.title}</div>
        ${isLowest ? '<span class="best-price-badge">BEST PRICE</span>' : ''}
        <div class="price-display">$${item.price.toFixed(2)}</div>
        <a href="${item.link}" target="_blank" class="view-btn">View on ${item.platform}</a>
      </div>
    `;
    pricesContent.appendChild(card);
  });

  const bestDeal = validDeals.find(d => d.price === lowestPrice);
  document.getElementById("bestDealText").textContent = `Best price is $${lowestPrice.toFixed(2)} at ${bestDeal.platform}!`;
  document.querySelector(".best-deal").classList.remove("hidden");
}

function showError(message) {
  errorMessage.textContent = message
  errorMessage.classList.remove("hidden")
}
