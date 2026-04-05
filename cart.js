// ===== PRODUCTS DATA =====
const PRODUCTS = [
  { id:1, name:"Heritage Timepiece",    cat:"Watches",     price:12999, emoji:"⌚", desc:"Swiss movement with sapphire crystal glass and Italian leather strap.", badge:"New",  badgeClass:"badge-new"  },
  { id:2, name:"Obsidian Leather Tote", cat:"Bags",        price:8499,  emoji:"👜", desc:"Full-grain Italian leather with brass hardware and suede lining.",      badge:"",     badgeClass:""           },
  { id:3, name:"Rose Gold Chain",       cat:"Jewellery",   price:5999,  emoji:"💍", desc:"18K rose gold plated chain with diamond-cut detailing.",                badge:"Sale", badgeClass:"badge-sale" },
  { id:4, name:"Merino Wool Sneakers",  cat:"Footwear",    price:4299,  emoji:"👟", desc:"Premium merino wool uppers with memory foam insoles.",                  badge:"New",  badgeClass:"badge-new"  },
  { id:5, name:"Titanium Aviators",     cat:"Eyewear",     price:6799,  emoji:"🕶️", desc:"Lightweight titanium frames with polarised UV400 lenses.",              badge:"",     badgeClass:""           },
  { id:6, name:"Botanical Face Serum",  cat:"Skincare",    price:2499,  emoji:"🧴", desc:"Cold-pressed botanical oils with hyaluronic acid and vitamin C.",       badge:"",     badgeClass:""           },
  { id:7, name:"Silk Evening Clutch",   cat:"Bags",        price:3899,  emoji:"👝", desc:"Hand-embroidered silk clutch with 24K gold-plated clasp.",              badge:"Sale", badgeClass:"badge-sale" },
  { id:8, name:"Cashmere Stole",        cat:"Accessories", price:7199,  emoji:"🧣", desc:"Pure Mongolian cashmere in a range of seasonal tones.",                 badge:"",     badgeClass:""           },
];

// ===== CART STORAGE =====
function getCart() {
  try { return JSON.parse(localStorage.getItem('luxe_cart') || '[]'); } catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem('luxe_cart', JSON.stringify(cart));
}
function getCartCount() {
  return getCart().reduce((s,i)=>s+i.qty, 0);
}
function addToCart(id) {
  const product = PRODUCTS.find(p=>p.id===id);
  if(!product) return;
  const cart = getCart();
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.qty++; else cart.push({...product, qty:1});
  saveCart(cart);
  updateCartBadge();
  showToast(`"${product.name}" added to cart ✓`);
}
function updateCartBadge() {
  const el = document.getElementById('cartCount');
  if(el) el.textContent = getCartCount();
}
function getCartSubtotal() {
  return getCart().reduce((s,i)=>s+(i.price*i.qty), 0);
}

// ===== TOAST =====
function showToast(msg) {
  let t = document.getElementById('toast');
  if(!t){ t=document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>t.classList.remove('show'), 3000);
}

// ===== PRODUCT CARD RENDERER =====
function renderProductCards(containerId, limit) {
  const c = document.getElementById(containerId);
  if(!c) return;
  const items = limit ? PRODUCTS.slice(0, limit) : PRODUCTS;
  c.innerHTML = items.map(p=>`
    <div class="product-card">
      <div class="product-img">
        ${p.badge ? `<div class="product-badge ${p.badgeClass}">${p.badge}</div>` : ''}
        <span style="font-size:4rem">${p.emoji}</span>
      </div>
      <div class="product-info">
        <div class="product-cat">${p.cat}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div class="product-price">₹${p.price.toLocaleString()}</div>
          <button class="add-to-cart" id="atc-${p.id}" onclick="handleAddToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
}
function handleAddToCart(id) {
  addToCart(id);
  const btn = document.getElementById('atc-'+id);
  if(btn){ btn.textContent='Added ✓'; btn.classList.add('added'); setTimeout(()=>{ btn.textContent='Add to Cart'; btn.classList.remove('added'); }, 1500); }
}

// ===== FORM HELPERS =====
function formatCard(input) {
  let v = input.value.replace(/\D/g,'').substring(0,16);
  input.value = v.match(/.{1,4}/g)?.join(' ') || v;
}
function formatExpiry(input) {
  let v = input.value.replace(/\D/g,'').substring(0,4);
  if(v.length>=3) v = v.substring(0,2)+'/'+v.substring(2);
  input.value = v;
}

// Init badge on page load
document.addEventListener('DOMContentLoaded', updateCartBadge);
