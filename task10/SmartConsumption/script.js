// Data storage
let items = JSON.parse(localStorage.getItem('swapshare_items')) || [];
let myItems = [];
let reviews = JSON.parse(localStorage.getItem('swapshare_reviews')) || {};
let currentUser = localStorage.getItem('swapshare_user') || 'user_' + Math.random().toString(36).substr(2, 9);

function saveData() {
    localStorage.setItem('swapshare_items', JSON.stringify(items));
    localStorage.setItem('swapshare_reviews', JSON.stringify(reviews));
    localStorage.setItem('swapshare_user', currentUser);
}

function previewImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const imageUrlInput = document.getElementById('item-image');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
            imageUrlInput.value = e.target.result; // Set the data URL as the image source
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
        imageUrlInput.value = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (items.length === 0) {
        loadSampleData();
        saveData();
    }
    displayItems();
    updateMyItems();
    updateMatches();
});

function loadSampleData() {
    items = [
        {
            id: 1,
            name: 'iPhone 14 Pro Max',
            category: 'mobiles',
            description: 'Brand new iPhone 14 Pro Max, 256GB, Deep Purple, original accessories included',
            value: 250000,
            owner: 'ahmed_ali',
            image: 'https://picsum.photos/seed/iphone14promax/400/300',
            availableFor: { barter: true, rent: false },
            rentalPrice: 0,
            rating: 4.5,
            reviews: 12
        },
        {
            id: 2,
            name: 'Honda Civic 2022',
            category: 'vehicles',
            description: 'Honda Civic 2022, 1.8L, automatic, excellent condition, low mileage',
            value: 4500000,
            owner: 'fatima_bibi',
            image: 'https://picsum.photos/seed/hondacivic2022/400/300',
            availableFor: { barter: false, rent: true },
            rentalPrice: 5000,
            rating: 4.8,
            reviews: 8
        },
        {
            id: 3,
            name: '2 Bedroom Apartment',
            category: 'property',
            description: 'Spacious 2 bedroom apartment in DHA, Lahore, with parking and balcony',
            value: 15000000,
            owner: 'muhammad_idris',
            image: 'https://picsum.photos/seed/apartmentdha/400/300',
            availableFor: { barter: false, rent: true },
            rentalPrice: 35000,
            rating: 4.2,
            reviews: 6
        },
        {
            id: 4,
            name: 'Samsung LED TV 55"',
            category: 'electronics',
            description: 'Samsung 55 inch 4K Smart TV, crystal clear display, Netflix built-in',
            value: 85000,
            owner: 'saira_khan',
            image: 'https://picsum.photos/seed/samsung55tv/400/300',
            availableFor: { barter: true, rent: true },
            rentalPrice: 1500,
            rating: 4.6,
            reviews: 15
        },
        {
            id: 5,
            name: 'Office Chair Set',
            category: 'furniture',
            description: 'Set of 4 executive office chairs, leather finish, excellent condition',
            value: 25000,
            owner: 'bilal_ahmed',
            image: 'https://picsum.photos/seed/officechairs/400/300',
            availableFor: { barter: true, rent: false },
            rentalPrice: 0,
            rating: 4.7,
            reviews: 9
        },
        {
            id: 6,
            name: 'Web Development Services',
            category: 'services',
            description: 'Professional web development services, React, Node.js, WordPress expert',
            value: 50000,
            owner: 'tech_expert',
            image: 'https://picsum.photos/seed/webdevelopment/400/300',
            availableFor: { barter: false, rent: false },
            rentalPrice: 0,
            rating: 4.9,
            reviews: 23
        },
        {
            id: 7,
            name: 'Graphics Designer Job',
            category: 'jobs',
            description: 'Looking for experienced graphics designer, full-time position in Karachi',
            value: 80000,
            owner: 'company_hr',
            image: 'https://picsum.photos/seed/graphicsjob/400/300',
            availableFor: { barter: false, rent: false },
            rentalPrice: 0,
            rating: 4.1,
            reviews: 5
        }
    ];

    items.forEach(item => {
        reviews[item.id] = generateSampleReviews(item.reviews);
    });
}

function generateSampleReviews(count) {
    const sampleReviews = [];
    const comments = [
        'Excellent item, exactly as described!',
        'Great experience, would recommend!',
        'Item was in perfect condition',
        'Smooth transaction, thank you!',
        'Better than expected, amazing!'
    ];
    
    for (let i = 0; i < count; i++) {
        sampleReviews.push({
            user: 'user_' + Math.random().toString(36).substr(2, 9),
            rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
            comment: comments[Math.floor(Math.random() * comments.length)],
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        });
    }
    return sampleReviews;
}


function showSection(section) {
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.style.display = 'none';
    });
    
    document.getElementById(section + '-section').style.display = 'block';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (section === 'matches') {
        updateMatches();
    } else if (section === 'my-items') {
        updateMyItems();
    }
}

function displayItems(filteredItems = items) {
    const grid = document.getElementById('items-grid');
    
    if (filteredItems.length === 0) {
        grid.innerHTML = `
            <div class="col-12 empty-state">
                <i class="bi bi-inbox"></i>
                <h4>No items found</h4>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredItems.map(item => createItemCard(item)).join('');
}

function createItemCard(item) {
    const badges = [];
    if (item.availableFor.barter) badges.push('<span class="badge barter-badge">Barter</span>');
    if (item.availableFor.rent) badges.push('<span class="badge rent-badge">Rent Rs ' + item.rentalPrice.toLocaleString() + '/day</span>');
    
    return `
        <div class="col-md-6 col-lg-4">
            <div class="card item-card">
                <div class="position-relative">
                    <img src="${item.image}" class="card-img-top item-image" alt="${item.name}">
                    <div class="position-absolute top-0 end-0 p-2">
                        ${badges.join(' ')}
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text text-muted small">${item.description.substring(0, 100)}...</p>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="item-category">${item.category}</span>
                        <span class="item-price">Rs ${item.value.toLocaleString()}</span>
                    </div>
                    <div class="rating mb-2">
                        ${generateStars(item.rating)}
                        <span class="text-muted small">(${item.reviews} reviews)</span>
                    </div>
                    <button class="btn btn-primary btn-sm w-100" onclick="showItemDetails(${item.id})">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="bi bi-star-fill"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="bi bi-star-half"></i>';
        } else {
            stars += '<i class="bi bi-star"></i>';
        }
    }
    return stars;
}

// Search and filter
function searchItems() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    
    let filtered = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                             item.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || item.category === category;
        return matchesSearch && matchesCategory;
    });
    
    displayItems(filtered);
}

function filterItems() {
    searchItems();
}

document.getElementById('add-item-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newItem = {
        id: Date.now(),
        name: document.getElementById('item-name').value,
        category: document.getElementById('item-category').value,
        description: document.getElementById('item-description').value,
        value: parseFloat(document.getElementById('item-value').value),
        owner: currentUser,
        image: document.getElementById('item-image').value || `https://picsum.photos/seed/${Date.now()}/400/300`,
        availableFor: {
            barter: document.getElementById('available-barter').checked,
            rent: document.getElementById('available-rent').checked
        },
        rentalPrice: document.getElementById('available-rent').checked ? 
                    parseFloat(document.getElementById('rental-price').value) : 0,
        rating: 0,
        reviews: 0
    };
    
    myItems.push(newItem);
    items.push(newItem);
    reviews[newItem.id] = [];
    
    saveData();
    
    this.reset();
    document.getElementById('image-preview').style.display = 'none';
    document.getElementById('preview-img').src = '';
    
    alert('Item added successfully!');
    
    showSection('my-items');
    updateMyItems();
    displayItems(); // Refresh browse items to show new item
});

function updateMyItems() {
    const grid = document.getElementById('my-items-grid');
    const userItems = items.filter(item => item.owner === currentUser);
    
    if (userItems.length === 0) {
        grid.innerHTML = `
            <div class="col-12 empty-state">
                <i class="bi bi-box"></i>
                <h4>No items yet</h4>
                <p>Start by adding your first item</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = userItems.map(item => `
        <div class="col-md-6 col-lg-4">
            <div class="card item-card">
                <div class="position-relative">
                    <img src="${item.image}" class="card-img-top item-image" alt="${item.name}">
                    <div class="position-absolute top-0 end-0 p-2">
                        <button class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text text-muted small">${item.description.substring(0, 100)}...</p>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="item-category">${item.category}</span>
                        <span class="item-price">Rs ${item.value.toLocaleString()}</span>
                    </div>
                    <div class="rating mb-2">
                        ${generateStars(item.rating)}
                        <span class="text-muted small">(${item.reviews} reviews)</span>
                    </div>
                    <div class="action-buttons">
                        <button class="btn btn-outline-primary btn-sm" onclick="editItem(${item.id})">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                        <button class="btn btn-outline-info btn-sm" onclick="showItemDetails(${item.id})">
                            <i class="bi bi-eye"></i> View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        items = items.filter(item => item.id !== itemId);
        myItems = myItems.filter(item => item.id !== itemId);
        delete reviews[itemId];
        
        saveData();
        
        updateMyItems();
        displayItems(); 
        updateMatches(); 
    }
}

function editItem(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-category').value = item.category;
    document.getElementById('item-description').value = item.description;
    document.getElementById('item-value').value = item.value;
    document.getElementById('item-image').value = item.image;
    document.getElementById('available-barter').checked = item.availableFor.barter;
    document.getElementById('available-rent').checked = item.availableFor.rent;
    document.getElementById('rental-price').value = item.rentalPrice;
    
    if (item.image && !item.image.includes('picsum.photos')) {
        document.getElementById('preview-img').src = item.image;
        document.getElementById('image-preview').style.display = 'block';
    }
    
    showSection('add-item');
    
    const form = document.getElementById('add-item-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        Object.assign(item, {
            name: document.getElementById('item-name').value,
            category: document.getElementById('item-category').value,
            description: document.getElementById('item-description').value,
            value: parseFloat(document.getElementById('item-value').value),
            image: document.getElementById('item-image').value || item.image,
            availableFor: {
                barter: document.getElementById('available-barter').checked,
                rent: document.getElementById('available-rent').checked
            },
            rentalPrice: document.getElementById('available-rent').checked ? 
                        parseFloat(document.getElementById('rental-price').value) : 0
        });
        
        saveData();
        
        form.reset();
        document.getElementById('image-preview').style.display = 'none';
        document.getElementById('preview-img').src = '';
        form.onsubmit = arguments.callee.caller;
        
        alert('Item updated successfully!');
        showSection('my-items');
        updateMyItems();
        displayItems(); 
        updateMatches(); 
    };
}

function showItemDetails(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const modal = new bootstrap.Modal(document.getElementById('itemModal'));
    document.getElementById('modalItemName').textContent = item.name;
    
    const itemReviews = reviews[item.id] || [];
    
    document.getElementById('modalItemContent').innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${item.image}" class="img-fluid rounded" alt="${item.name}">
            </div>
            <div class="col-md-6">
                <h4>${item.name}</h4>
                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Price:</strong> Rs ${item.value.toLocaleString()}</p>
                <p><strong>Description:</strong> ${item.description}</p>
                <div class="mb-3">
                    <strong>Available for:</strong>
                    <div class="mt-2">
                        ${item.availableFor.barter ? '<span class="badge bg-success me-2">Barter</span>' : ''}
                        ${item.availableFor.rent ? '<span class="badge bg-info">Rent Rs ' + item.rentalPrice.toLocaleString() + '/day</span>' : ''}
                    </div>
                </div>
                <div class="rating mb-3">
                    ${generateStars(item.rating)}
                    <span class="text-muted">(${item.reviews} reviews)</span>
                </div>
                <button class="btn btn-outline-secondary" onclick="showReviewModal(${item.id})">
                    <i class="bi bi-star"></i> Leave Review
                </button>
            </div>
        </div>
        <hr>
        <h5>Reviews</h5>
        <div class="reviews-container">
            ${itemReviews.length > 0 ? itemReviews.map(review => `
                <div class="review-item">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="rating">
                                ${generateStars(review.rating)}
                            </div>
                            <p class="mb-1">${review.comment}</p>
                            <small class="text-muted review-date">${new Date(review.date).toLocaleDateString()}</small>
                        </div>
                        <small class="text-muted">${review.user}</small>
                    </div>
                </div>
            `).join('') : '<p class="text-muted">No reviews yet.</p>'}
        </div>
    `;
    
    document.getElementById('contactOwnerBtn').onclick = function() {
        alert(`Contact feature would connect you with ${item.owner}. This would typically open a chat or email interface.`);
    };
    
    modal.show();
}

function updateMatches() {
    const userItems = items.filter(item => item.owner === currentUser);
    const otherItems = items.filter(item => item.owner !== currentUser);
    const matchesGrid = document.getElementById('matches-grid');
    
    if (userItems.length === 0) {
        matchesGrid.innerHTML = `
            <div class="col-12 empty-state">
                <i class="bi bi-lightbulb"></i>
                <h4>No matches yet</h4>
                <p>Add some items to get smart recommendations!</p>
            </div>
        `;
        return;
    }
    
    const matches = otherItems.map(item => {
        const matchScore = calculateMatchScore(userItems, item);
        return { ...item, matchScore };
    }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
    
    if (matches.length === 0) {
        matchesGrid.innerHTML = `
            <div class="col-12 empty-state">
                <i class="bi bi-search"></i>
                <h4>No matches found</h4>
                <p>Try adding more items or check back later</p>
            </div>
        `;
        return;
    }
    
    matchesGrid.innerHTML = matches.map(item => `
        <div class="col-md-6 col-lg-4">
            <div class="card item-card match-card">
                <div class="card-body">
                    <div class="d-flex align-items-start">
                        <div class="match-percentage me-3">
                            ${Math.round(item.matchScore)}%
                        </div>
                        <div class="flex-grow-1">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text text-muted small">${item.description.substring(0, 80)}...</p>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="item-category">${item.category}</span>
                                <span class="item-price">Rs ${item.value.toLocaleString()}</span>
                            </div>
                            <div class="rating mb-2">
                                ${generateStars(item.rating)}
                                <span class="text-muted small">(${item.reviews})</span>
                            </div>
                            <button class="btn btn-primary btn-sm w-100" onclick="showItemDetails(${item.id})">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function calculateMatchScore(userItems, item) {
    let score = 0;
    
    const userCategories = userItems.map(ui => ui.category);
    if (userCategories.includes(item.category)) {
        score += 40;
    }
    
    const userValues = userItems.map(ui => ui.value);
    const avgUserValue = userValues.reduce((a, b) => a + b, 0) / userValues.length;
    const valueDiff = Math.abs(item.value - avgUserValue) / avgUserValue;
    score += Math.max(0, 30 - (valueDiff * 30));
    
    userItems.forEach(userItem => {
        if (userItem.availableFor.barter && item.availableFor.barter) score += 15;
        if (userItem.availableFor.rent && item.availableFor.rent) score += 15;
    });
    
    score += (item.rating / 5) * 10;
    
    return Math.min(100, score);
}

function showReviewModal(itemId) {
    const modal = new bootstrap.Modal(document.getElementById('reviewModal'));
    modal.show();
    
    window.currentReviewItem = itemId;
}

function submitReview() {
    const itemId = window.currentReviewItem;
    const rating = parseInt(document.getElementById('review-rating').value);
    const comment = document.getElementById('review-comment').value;
    
    if (!comment.trim()) {
        alert('Please provide a comment for your review.');
        return;
    }
    
    const review = {
        user: currentUser,
        rating: rating,
        comment: comment,
        date: new Date().toISOString()
    };
    
    if (!reviews[itemId]) {
        reviews[itemId] = [];
    }
    
    reviews[itemId].push(review);
    
    const item = items.find(i => i.id === itemId);
    if (item) {
        const itemReviews = reviews[itemId];
        const totalRating = itemReviews.reduce((sum, r) => sum + r.rating, 0);
        item.rating = totalRating / itemReviews.length;
        item.reviews = itemReviews.length;
    }
    
    saveData();
    
    document.getElementById('review-comment').value = '';
    bootstrap.Modal.getInstance(document.getElementById('reviewModal')).hide();
    
    alert('Review submitted successfully!');
    showItemDetails(itemId); 
}
