// main.js - simple product + cart demo
window.SITE_PRODUCTS = [
  {id:'1', title:'Door Handle', price:'120.00', img:'assets/door-handle.jpg', desc:'High-quality door handle'},
  {id:'2', title:'GPS', price:'120.00', img:'assets/gps.jpg', desc:'Car GPS unit'},
  {id:'3', title:'Steering Rack', price:'120.00', img:'assets/steering.jpg', desc:'Reliable steering rack'},
  {id:'4', title:'Brake Cylinder', price:'120.00', img:'assets/brake.jpg', desc:'Brake cylinder'},
  {id:'5', title:'Brake Pads', price:'120.00', img:'assets/brakepads.jpg', desc:'Durable brake pads'},
  {id:'6', title:'4X4', price:'20.00', img:'assets/4x4.jpg', desc:'4x4 accessory'},
  {id:'7', title:'Chrome', price:'15.00', img:'assets/chrome.jpg', desc:'Chrome trim'}
];

function el(q){return document.querySelector(q)}
function els(q){return Array.from(document.querySelectorAll(q))}

// render top sellers and shop grid
function renderProducts() {
  const top = el('#top-sellers-grid');
  const grid = el('#products-grid');
  if(top) {
    top.innerHTML = SITE_PRODUCTS.slice(0,6).map(p => productCard(p)).join('');
  }
  if(grid) {
    grid.innerHTML = SITE_PRODUCTS.map(p => productCard(p)).join('');
  }
}
function productCard(p){
  return `<article class="card">
    <img src="${p.img}" alt="${p.title}" style="max-height:140px;width:100%;object-fit:cover;border-radius:6px;margin-bottom:.6rem" />
    <h4>${p.title}</h4>
    <div>Price ₹${p.price}</div>
    <div style="margin-top:.6rem"><button class="btn" onclick="location.href='product.html?id=${p.id}'">View</button>
    <button class="btn primary" onclick="addToCart('${p.id}',1)">Add to Cart</button></div>
  </article>`;
}

// simple cart using localStorage
const CART_KEY = 'site_cart_v1';
function getCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || '[]') }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartCount(); }
function addToCart(id, qty){
  const cart = getCart();
  const found = cart.find(i=>i.id===id);
  if(found) found.qty += qty; else cart.push({id, qty});
  saveCart(cart);
}
function clearCart(){ localStorage.removeItem(CART_KEY); updateCartCount(); renderCart(); }
function updateCartCount(){
  const count = getCart().reduce((s,i)=>s+i.qty,0);
  const elc = el('#cart-count');
  if(elc) elc.textContent = count;
}
function renderCart(){
  const itemsEl = el('#cart-items');
  if(!itemsEl) return;
  const cart = getCart();
  if(cart.length===0){ itemsEl.innerHTML = '<p>Your cart is empty</p>'; return; }
  itemsEl.innerHTML = cart.map(ci=>{
    const p = SITE_PRODUCTS.find(x=>x.id===ci.id) || {};
    return `<div style="display:flex;justify-content:space-between;padding:.4rem 0;border-bottom:1px solid #eee">
      <div>${p.title || 'Item' } x ${ci.qty}</div><div>₹${(parseFloat(p.price||0)*ci.qty).toFixed(2)}</div>
    </div>`;
  }).join('');
}

// UI wiring
document.addEventListener('DOMContentLoaded',()=>{
  renderProducts();
  updateCartCount();
  // toggle nav
  els('.menu-toggle').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const ul = btn.nextElementSibling || document.getElementById('nav-links') || document.getElementById('nav-links-2');
      if(ul) ul.classList.toggle('show');
    });
  });

  // cart modal
  const cartBtn = el('#cart-btn');
  const cartModal = el('#cart-modal');
  const closeCart = el('#close-cart');
  const clearBtn = el('#clear-cart');
  const checkout = el('#checkout');
  if(cartBtn){ cartBtn.addEventListener('click', (e)=>{ e.preventDefault(); renderCart(); cartModal.classList.remove('hidden'); }) }
  if(closeCart) closeCart.addEventListener('click', ()=>cartModal.classList.add('hidden'));
  if(clearBtn) clearBtn.addEventListener('click', ()=>{ clearCart(); });
  if(checkout) checkout.addEventListener('click', ()=>{ alert('Demo checkout — integrate a payment gateway'); });

  renderCart();
});
window.addToCart = addToCart;
