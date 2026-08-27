/* =====================================================================
   VELLUNO — INTERACTIVE ENGINE
   ===================================================================== */
function initApp() {

  /* ─── Lucide icons ─── */
  if (window.lucide) lucide.createIcons();

  /* ───────────────────────────────────────────────────────────────────
     1. STICKY NAVBAR SCROLL TRANSFORM
  ─────────────────────────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollPos > 15) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
  }


  /* ───────────────────────────────────────────────────────────────────
     2. CART STATE
  ─────────────────────────────────────────────────────────────────── */
  let cart = [];

  const cartCountEl    = document.getElementById('cart-count');
  const cartTotalEl    = document.getElementById('cart-total');
  const drawerCountEl  = document.getElementById('drawer-count');
  const drawerSubEl    = document.getElementById('drawer-subtotal');
  const drawerBodyEl   = document.getElementById('drawer-body');
  const cartOverlay    = document.getElementById('cart-overlay');
  const cartDrawerEl   = document.getElementById('cart-drawer');

  function fmt(n) { return n.toFixed(2).replace('.', ','); }

  function syncCartUI() {
    const totalQty   = cart.reduce((s, i) => s + i.qty, 0);
    const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

    cartCountEl.textContent  = totalQty;
    drawerCountEl.textContent = totalQty;
    cartTotalEl.textContent  = fmt(totalPrice);
    drawerSubEl.textContent  = fmt(totalPrice);

    if (!cart.length) {
      drawerBodyEl.innerHTML = '<p class="drawer-empty">Your wine basket is currently empty.</p>';
      return;
    }

    drawerBodyEl.innerHTML = cart.map((item, i) => `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${item.title}</div>
          <div class="cart-item-price">₦${fmt(item.price)} × ${item.qty}</div>
          <div class="cart-item-remove" data-remove="${i}">Remove</div>
        </div>
        <div style="font-weight:700">₦${fmt(item.price * item.qty)}</div>
      </div>
    `).join('');

    drawerBodyEl.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        cart.splice(+btn.dataset.remove, 1);
        syncCartUI();
      });
    });
  }

  function openCart()  { cartDrawerEl.classList.add('open'); cartOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeCart() { cartDrawerEl.classList.remove('open'); cartOverlay.classList.remove('open'); document.body.style.overflow = ''; }

  document.getElementById('open-cart-btn').addEventListener('click', openCart);
  document.getElementById('close-cart').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  function addToCart(title, price, qty = 1) {
    const existing = cart.find(i => i.title === title);
    if (existing) existing.qty += qty;
    else cart.push({ title, price: parseFloat(price), qty });
    syncCartUI();
    toast(`"${title}" added to cart`);
    openCart();
  }

  /* Add-to-cart buttons (cards + inspector) */
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const isInspector = btn.id === 'insp-add-btn';
      const qty = isInspector ? currentQty : 1;
      addToCart(btn.dataset.title, btn.dataset.price, qty);
    });
  });


  /* ───────────────────────────────────────────────────────────────────
     3. QUANTITY STEPPER (Inspector)
  ─────────────────────────────────────────────────────────────────── */
  let currentQty = 1;
  const qtyValEl = document.getElementById('qty-val');

  document.getElementById('qty-minus').addEventListener('click', () => {
    if (currentQty > 1) { currentQty--; qtyValEl.textContent = currentQty; }
  });
  document.getElementById('qty-plus').addEventListener('click', () => {
    currentQty++;
    qtyValEl.textContent = currentQty;
  });


  /* ───────────────────────────────────────────────────────────────────
     4. COLLECTION INSPECTOR TAB SWITCHER
  ─────────────────────────────────────────────────────────────────── */
  const wines = {
    wines: {
      photo:    'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&auto=format&q=90&fit=crop',
      eyebrow:  'Natural Sweet Red Wine',
      title:    'Four Cousins Natural Sweet Red Wine',
      desc:     'A rich, ruby-red wine featuring delicious ripe plum and berry aromas, unashamedly sweet with a smooth, fruity finish. Perfect for any celebration.',
      profile:  ['🍇 Sweet Berry', '🍷 Ripe Plum', '🌸 Smooth', '🍒 Red Fruit'],
      price:    '₦12,500',
      old:      '₦15,000',
      save:     'SAVE ₦2,500',
      rawPrice: 12500,
    },
    whiskies: {
      photo:    'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&auto=format&q=90&fit=crop',
      eyebrow:  'Irish Whiskey',
      title:    'Jameson Irish Whiskey',
      desc:     'Triple-distilled, remarkably smooth Irish whiskey with notes of vanilla, toasted wood, and sherry. Perfectly balanced for sipping neat or on the rocks.',
      profile:  ['🪵 Oak', '🍦 Vanilla', '🍯 Honey', '🌾 Malt'],
      price:    '₦28,000',
      old:      '₦32,000',
      save:     'SAVE ₦4,000',
      rawPrice: 28000,
    },
    gin: {
      photo:    'https://images.unsplash.com/photo-1608885898957-a559228e8749?w=600&auto=format&q=90&fit=crop',
      eyebrow:  'London Dry Gin',
      title:    "Gordon's Dry Gin",
      desc:     'Classic London Dry Gin distilled with wild juniper berries, coriander, and citrus. Crisp, refreshing taste crafted from a secret 250-year-old recipe.',
      profile:  ['🌿 Juniper', '🍋 Citrus', '🌾 Coriander', '✨ Crisp'],
      price:    '₦15,000',
      old:      '₦18,000',
      save:     'SAVE ₦3,000',
      rawPrice: 15000,
    },
    vodka: {
      photo:    'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&auto=format&q=90&fit=crop',
      eyebrow:  'Triple Distilled Vodka',
      title:    'Smirnoff X1',
      desc:     'Extra smooth, triple distilled and 10 times filtered vodka. Exceptionally clean finish designed for ultimate mixability in signature cocktails.',
      profile:  ['💧 Pure', '✨ Clean', '🍸 Smooth', '🧊 Refreshing'],
      price:    '₦14,000',
      old:      '₦16,000',
      save:     'SAVE ₦2,000',
      rawPrice: 14000,
    },
    liqueur: {
      photo:    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&q=90&fit=crop',
      eyebrow:  'Marula Fruit Cream Liqueur',
      title:    'Best Marula Fruit Cream Liqueur',
      desc:     'A luxurious, velvety cream liqueur infused with exotic wild Marula fruit. Rich notes of caramel, cream, and tropical fruit notes.',
      profile:  ['🥛 Velvety Cream', '🍯 Caramel', '🍍 Marula', '🍫 Sweet'],
      price:    '₦18,500',
      old:      '₦21,000',
      save:     'SAVE ₦2,500',
      rawPrice: 18500,
    },
    nonalcoholic: {
      photo:    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&q=90&fit=crop',
      eyebrow:  'Sparkling Red Grape',
      title:    'Chamdor Sparkling Red Grape Drink',
      desc:     'Non-alcoholic premium sparkling red grape drink crafted from selected sweet grapes. Naturally refreshing, effervescent, and alcohol-free.',
      profile:  ['🍇 Red Grape', '✨ Sparkling', '🍓 Sweet', '🍋 Refreshing'],
      price:    '₦6,500',
      old:      '₦8,000',
      save:     'SAVE ₦1,500',
      rawPrice: 6500,
    }
  };

  const inspPhoto    = document.getElementById('insp-photo');
  const inspEyebrow  = document.getElementById('insp-eyebrow');
  const inspTitle    = document.getElementById('insp-title');
  const inspDesc     = document.getElementById('insp-desc');
  const inspProfile  = document.getElementById('insp-profile');
  const inspPrice    = document.getElementById('insp-price');
  const inspOld      = document.getElementById('insp-old-price');
  const inspSave     = document.getElementById('insp-save');
  const inspAddBtn   = document.getElementById('insp-add-btn');

  function loadWine(key) {
    const w = wines[key];
    inspPhoto.src          = w.photo;
    inspPhoto.alt          = w.title;
    inspEyebrow.textContent = w.eyebrow;
    inspTitle.textContent  = w.title;
    inspDesc.textContent   = w.desc;
    inspPrice.textContent  = w.price;
    inspOld.textContent    = w.old;
    inspSave.textContent   = w.save;
    inspAddBtn.dataset.title = w.title;
    inspAddBtn.dataset.price = w.rawPrice;
    inspProfile.innerHTML  = w.profile.map(p => `<span class="profile-tag">${p}</span>`).join('');
    currentQty = 1;
    qtyValEl.textContent = 1;
  }

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadWine(tab.dataset.tab);
    });
  });


  /* ───────────────────────────────────────────────────────────────────
     5. EVENT REGISTRATION MODAL
  ─────────────────────────────────────────────────────────────────── */
  const eventModal    = document.getElementById('event-modal');
  const modalOverlay  = document.getElementById('modal-overlay');
  const modalEvtName  = document.getElementById('modal-event-name');
  const eventForm     = document.getElementById('event-form');

  function openModal(name)  { modalEvtName.textContent = name; eventModal.classList.add('open'); modalOverlay.classList.add('open'); }
  function closeModal()     { eventModal.classList.remove('open'); modalOverlay.classList.remove('open'); }

  document.querySelectorAll('.btn-register').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.event));
  });
  document.getElementById('close-modal').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  eventForm.addEventListener('submit', e => {
    e.preventDefault();
    closeModal();
    toast('Reservation confirmed! Check your email for details.');
    eventForm.reset();
  });


  /* ───────────────────────────────────────────────────────────────────
     6. WISHLIST HEARTS
  ─────────────────────────────────────────────────────────────────── */
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      toast(btn.classList.contains('active') ? 'Added to wishlist' : 'Removed from wishlist');
    });
  });


  /* ───────────────────────────────────────────────────────────────────
     7. NEWSLETTER FORM
  ─────────────────────────────────────────────────────────────────── */
  document.getElementById('newsletter-form').addEventListener('submit', e => {
    e.preventDefault();
    toast('Welcome! 10% discount code sent to your email.');
    e.target.reset();
  });


  /* ───────────────────────────────────────────────────────────────────
     8. TOAST NOTIFICATIONS
  ─────────────────────────────────────────────────────────────────── */
  function toast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'all 0.3s ease';
      setTimeout(() => el.remove(), 320);
    }, 3500);
  }

  /* ───────────────────────────────────────────────────────────────────
     9. TESTIMONIAL SIDEWAYS CAROUSEL / SLIDER
  ─────────────────────────────────────────────────────────────────── */
  const testimonialTrack = document.getElementById('testimonial-track');
  const testimonialDots = document.querySelectorAll('#testimonial-dots .dot');

  if (testimonialTrack && testimonialDots.length) {
    testimonialDots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const slideWidth = testimonialTrack.clientWidth;
        testimonialTrack.scrollTo({
          left: slideWidth * index,
          behavior: 'smooth'
        });
      });
    });

    testimonialTrack.addEventListener('scroll', () => {
      const slideWidth = testimonialTrack.clientWidth;
      if (!slideWidth) return;
      const activeIdx = Math.round(testimonialTrack.scrollLeft / slideWidth);
      testimonialDots.forEach((dot, idx) => {
        dot.classList.toggle('dot-active', idx === activeIdx);
      });
    }, { passive: true });
  /* ───────────────────────────────────────────────────────────────────
     10. CATEGORY CARDS SIDEWAYS CAROUSEL
  ─────────────────────────────────────────────────────────────────── */
  const catTrack = document.getElementById('cat-track');
  const catDots = document.querySelectorAll('#cat-dots .dot');

  if (catTrack && catDots.length) {
    catDots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const cards = catTrack.querySelectorAll('.cat-card');
        if (cards[index]) {
          cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
      });
    });

    catTrack.addEventListener('scroll', () => {
      const cards = catTrack.querySelectorAll('.cat-card');
      if (!cards.length) return;
      const trackLeft = catTrack.getBoundingClientRect().left;
      let activeIdx = 0;
      let minDistance = Infinity;

      cards.forEach((card, idx) => {
        const dist = Math.abs(card.getBoundingClientRect().left - trackLeft);
        if (dist < minDistance) {
          minDistance = dist;
          activeIdx = idx;
        }
      });

      catDots.forEach((dot, idx) => {
        dot.classList.toggle('dot-active', idx === activeIdx);
      });
    }, { passive: true });
  }

}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
