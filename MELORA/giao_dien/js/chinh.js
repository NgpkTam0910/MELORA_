const MELORA = {
  products: [],
  cart: JSON.parse(localStorage.getItem('melora-cart') || '[]'),
  favorites: JSON.parse(localStorage.getItem('melora-favorites') || '[]'),
  money(value) { return new Intl.NumberFormat('vi-VN').format(value) + '₫'; },
  async loadProducts() {
    if (this.products.length) return this.products;
    const response = await fetch('du_lieu/san_pham.json');
    if (!response.ok) throw new Error('Không tải được danh sách sản phẩm');
    const mainProducts = await response.json();
    const makeupResponse = await fetch('du_lieu/trang_diem.json');
    const makeupProducts = makeupResponse.ok ? await makeupResponse.json() : [];
    this.products = [...mainProducts, ...makeupProducts]; return this.products;
  },
  saveCart() { localStorage.setItem('melora-cart', JSON.stringify(this.cart)); this.updateCount(); },
  updateCount() { const el = document.querySelector('#soLuongGioHang'); if (el) el.textContent = this.cart.reduce((sum, item) => sum + item.soLuong, 0); },
  add(id) {
    const product = this.products.find(item => item.id === Number(id)); if (!product) return;
    const row = this.cart.find(item => item.id === product.id);
    if (row) row.soLuong = Math.min(row.soLuong + 1, product.so_luong); else this.cart.push({ id: product.id, soLuong: 1 });
    this.saveCart(); this.toast('Đã thêm vào giỏ hàng');
  },
  toast(message) { let el = document.querySelector('.toast'); if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.append(el); } el.textContent = message; el.classList.add('show'); clearTimeout(this.toastTimer); this.toastTimer = setTimeout(() => el.classList.remove('show'), 2200); }
};
window.themGioHang = (id) => MELORA.add(id);
MELORA.updateCount();

function productCard(p) { return `<article class="the-san-pham"><a class="hinh-san-pham" href="san_pham.html#${p.id}"><img loading="lazy" src="${p.hinh_anh}" alt="${p.ten}" onerror="this.src='giao_dien/hinh/anh-san-pham.svg'"><span class="nhan-moi">${p.gia_goc > p.gia ? 'ƯU ĐÃI' : 'MELORA'}</span></a><div class="thong-tin-san-pham"><p class="thuong-hieu">${p.thuong_hieu}</p><h3>${p.ten}</h3><p class="gia-san-pham">${MELORA.money(p.gia)} <del>${p.gia_goc > p.gia ? MELORA.money(p.gia_goc) : ''}</del></p><button type="button" onclick="themGioHang(${p.id})">THÊM VÀO GIỎ</button></div></article>`; }
async function initProducts() {
  try {
    const products = await MELORA.loadProducts();
    const home = document.querySelector('#danhSachSanPham'); if (home) { const featured=products.filter(p=>p.noi_bat); home.innerHTML=[...featured.filter(p=>p.danh_muc!=='Trang điểm').slice(0,4),...featured.filter(p=>p.danh_muc==='Trang điểm').slice(0,4)].map(productCard).join(''); }
    const list = document.querySelector('#danhSachTatCa'); if (list) renderCatalog(products);
    const favorites = document.querySelector('#danhSachYeuThich'); if (favorites) renderFavorites(products);
    if (location.hash && document.querySelector('#chiTietSanPham')) { const detailProduct=products.find(p => p.id === Number(location.hash.slice(1))) || products[0]; renderDetail(detailProduct); renderReviews(detailProduct); }
    renderCart(products);
    initCheckout(products);
  } catch (error) { const target = document.querySelector('#danhSachSanPham, #danhSachTatCa'); if(target) target.innerHTML = '<p class="empty-state">Không thể tải sản phẩm. Hãy mở website qua máy chủ cục bộ.</p>'; }
}
function renderCatalog(products) {
  const grid = document.querySelector('#danhSachTatCa'), search = new URLSearchParams(location.search).get('tu_khoa') || '', category = new URLSearchParams(location.search).get('danh_muc') || '';
  const query = document.querySelector('#oTimKiem'); if (query && search) query.value = search;
  const categorySelect = document.querySelector('#locDanhMuc');
  const brandSelect = document.querySelector('#locThuongHieu');
  const priceSelect = document.querySelector('#locGia');
  const sortSelect = document.querySelector('#sapXep');
  const cats = [...new Set(products.map(p => p.danh_muc).filter(Boolean))].sort((a,b) => a.localeCompare(b, 'vi'));
  const brands = [...new Set(products.map(p => p.thuong_hieu).filter(Boolean))].sort((a,b) => a.localeCompare(b, 'vi'));
  if (categorySelect) { categorySelect.innerHTML = '<option value="">Tất cả danh mục</option>' + cats.map(c => `<option value="${c}">${c}</option>`).join(''); categorySelect.value = category; }
  if (brandSelect) brandSelect.innerHTML = '<option value="">Tất cả thương hiệu</option>' + brands.map(b => `<option value="${b}">${b}</option>`).join('');
  function paint() {
    const term = (query?.value || search).toLocaleLowerCase('vi');
    const cat = categorySelect?.value || category;
    const brand = brandSelect?.value || '';
    const range = priceSelect?.value || '';
    const [minPrice, maxPrice] = range ? range.split('-').map(Number) : [0, Infinity];
    const filtered = products.filter(p => (!term || `${p.ten} ${p.thuong_hieu} ${p.danh_muc}`.toLocaleLowerCase('vi').includes(term)) && (!cat || p.danh_muc === cat) && (!brand || p.thuong_hieu === brand) && p.gia >= minPrice && p.gia <= (Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : Infinity));
    const sort = sortSelect?.value;
    if(sort === 'gia-tang') filtered.sort((a,b)=>a.gia-b.gia);
    if(sort === 'gia-giam') filtered.sort((a,b)=>b.gia-a.gia);
    grid.innerHTML = filtered.length ? filtered.map(productCard).join('') : '<p class="empty-state">Chưa tìm thấy sản phẩm phù hợp.</p>';
    const count = document.querySelector('#soKetQua'); if(count) count.textContent = `${filtered.length} sản phẩm`;
  }
  if(categorySelect) categorySelect.onchange = paint;
  if(brandSelect) brandSelect.onchange = paint;
  if(priceSelect) priceSelect.onchange = paint;
  if(sortSelect) sortSelect.onchange = paint;
  if(query) query.oninput = paint;
  paint();
}
function renderDetail(p) { if(!p)return; document.querySelector('#chiTietSanPham').innerHTML = `<div class="detail-image"><img src="${p.hinh_anh}" alt="${p.ten}" onerror="this.onerror=null;this.src='giao_dien/hinh/anh-san-pham.svg'"></div><div class="detail-copy"><p class="eyebrow">${p.thuong_hieu} · ${p.danh_muc}</p><h1>${p.ten}</h1><p class="gia-san-pham">${MELORA.money(p.gia)} <del>${p.gia_goc > p.gia ? MELORA.money(p.gia_goc) : ''}</del></p><p class="detail-description">${p.mo_ta}</p><p class="stock">Còn ${p.so_luong} sản phẩm</p><button class="primary-button" onclick="themGioHang(${p.id})">THÊM VÀO GIỎ</button><p class="shipping-note">Miễn phí giao hàng cho đơn từ 500.000₫ · Đổi trả trong 7 ngày</p></div>`; }
function renderCart(products) {
  const root = document.querySelector('#noiDungGioHang'); if(!root)return;
  const rows = MELORA.cart.map(row => ({...products.find(p=>p.id===row.id), soLuong:row.soLuong})).filter(p=>p.id);
  const total = rows.reduce((sum,p)=>sum+p.gia*p.soLuong,0);
  root.innerHTML = rows.length ? `<div class="cart-layout"><div class="cart-items">${rows.map(p=>`<article class="cart-row"><img src="${p.hinh_anh}" alt=""><div class="cart-info"><strong>${p.ten}</strong><span>${MELORA.money(p.gia)}</span><div class="quantity"><button aria-label="Giảm" onclick="doiSoLuong(${p.id},-1)">−</button><span>${p.soLuong}</span><button aria-label="Tăng" onclick="doiSoLuong(${p.id},1)">+</button><button class="remove" onclick="xoaSanPham(${p.id})">Xóa</button></div></div><b>${MELORA.money(p.gia*p.soLuong)}</b></article>`).join('')}</div><aside class="order-summary"><h2>Tóm tắt đơn hàng</h2><p><span>Tạm tính</span><strong>${MELORA.money(total)}</strong></p><p><span>Phí vận chuyển</span><span>${total>=500000?'Miễn phí':'30.000₫'}</span></p><hr><p class="summary-total"><span>Tổng cộng</span><strong>${MELORA.money(total+(total>=500000?0:30000))}</strong></p><a class="primary-button" href="thanh_toan.html">TIẾN HÀNH ĐẶT HÀNG</a><a class="continue-shopping" href="san_pham.html">← Tiếp tục mua sắm</a></aside></div>` : '<div class="empty-state"><span>♡</span><h2>Giỏ hàng đang trống</h2><p>Hãy chọn vài món yêu thích để bắt đầu nhé.</p><a class="primary-button" href="san_pham.html">KHÁM PHÁ SẢN PHẨM</a></div>';
}
window.doiSoLuong=(id,delta)=>{const row=MELORA.cart.find(x=>x.id===id); if(row){row.soLuong+=delta;if(row.soLuong<1)MELORA.cart=MELORA.cart.filter(x=>x.id!==id);MELORA.saveCart();initProducts();}};
window.xoaSanPham=(id)=>{MELORA.cart=MELORA.cart.filter(x=>x.id!==id);MELORA.saveCart();initProducts();};
function renderCheckout(products) {
  const root=document.querySelector('#checkoutSummary'); if(!root)return;
  const rows=MELORA.cart.map(row=>({...products.find(p=>p.id===row.id),soLuong:row.soLuong})).filter(p=>p.id);
  const subtotal=rows.reduce((sum,p)=>sum+p.gia*p.soLuong,0), shipping=subtotal>=500000?0:30000;
  root.innerHTML=rows.length?`${rows.map(p=>`<div class="checkout-item"><span>${p.ten} × ${p.soLuong}</span><strong>${MELORA.money(p.gia*p.soLuong)}</strong></div>`).join('')}<hr><p><span>Tạm tính</span><strong>${MELORA.money(subtotal)}</strong></p><p><span>Phí giao hàng</span><strong>${shipping?MELORA.money(shipping):'Miễn phí'}</strong></p><p class="summary-total"><span>Tổng thanh toán</span><strong>${MELORA.money(subtotal+shipping)}</strong></p>`:'<p>Giỏ hàng của bạn đang trống.</p>';
}
function initAccount() {
 const form=document.querySelector('#accountForm'); if(!form)return;
 const users=JSON.parse(localStorage.getItem('melora-users')||'[]'), current=JSON.parse(localStorage.getItem('melora-current-user')||'null');
 const notice=document.querySelector('#accountNotice'), register=document.querySelector('#registerFields'), title=document.querySelector('#accountTitle'), submit=document.querySelector('#accountSubmit');
 const switcher=document.querySelector('#accountMode'); let mode='login';
 function draw(){register.hidden=mode==='login';title.textContent=mode==='login'?'Đăng nhập thành viên':'Tạo tài khoản MELORA';submit.textContent=mode==='login'?'ĐĂNG NHẬP':'ĐĂNG KÝ THÀNH VIÊN';switcher.textContent=mode==='login'?'Chưa có tài khoản? Đăng ký':'Đã có tài khoản? Đăng nhập';}
 if(current){notice.innerHTML=`<div class="member-card"><p class="eyebrow">MELORA MEMBER</p><h2>Xin chào, ${current.name}</h2><p>${current.email}</p><strong>${current.points||0} điểm thành viên</strong><p>Mỗi 10.000₫ mua sắm tích lũy 1 điểm.</p><button type="button" class="primary-button" id="logoutButton">ĐĂNG XUẤT</button></div>`;form.hidden=true;document.querySelector('#logoutButton').onclick=()=>{localStorage.removeItem('melora-current-user');location.reload();};return;}
 draw();switcher.onclick=()=>{mode=mode==='login'?'register':'login';notice.textContent='';draw();};
 form.onsubmit=e=>{e.preventDefault();const data=new FormData(form),email=String(data.get('email')).trim().toLowerCase(),password=String(data.get('password'));
  if(mode==='register'){if(users.some(u=>u.email===email)){notice.textContent='Email này đã được đăng ký. Hãy đăng nhập.';return;}const user={name:String(data.get('name')).trim(),phone:String(data.get('phone')).trim(),email,password,points:0,address:''};users.push(user);localStorage.setItem('melora-users',JSON.stringify(users));localStorage.setItem('melora-current-user',JSON.stringify(user));location.reload();return;}
  const user=users.find(u=>u.email===email&&u.password===password);if(!user){notice.textContent='Email hoặc mật khẩu chưa chính xác.';return;}localStorage.setItem('melora-current-user',JSON.stringify(user));location.reload();
 };
}
function initCheckout(products){
 const form=document.querySelector('#checkoutForm');if(!form)return;renderCheckout(products);
 const summary=document.querySelector('#checkoutSummary');
 if(MELORA.cart.length){summary.insertAdjacentHTML('beforeend','<div class="coupon-box"><label for="maUuDai">Mã ưu đãi</label><div><input id="maUuDai" placeholder="Nhập MELORA10"><button type="button" id="applyCoupon">ÁP DỤNG</button></div><small id="couponMessage">Giảm 10% cho đơn từ 300.000₫, tối đa 100.000₫.</small></div><p id="discountLine" hidden><span>Ưu đãi</span><strong id="discountAmount"></strong></p>');
  document.querySelector('#applyCoupon').onclick=()=>{const subtotal=MELORA.cart.reduce((sum,row)=>{const p=products.find(x=>x.id===row.id);return sum+(p?p.gia*row.soLuong:0);},0);const code=document.querySelector('#maUuDai').value.trim().toUpperCase(),message=document.querySelector('#couponMessage');if(code!=='MELORA10'||subtotal<300000){message.textContent=code!=='MELORA10'?'Mã ưu đãi không hợp lệ.':'Mã dùng cho đơn từ 300.000₫.';message.classList.add('coupon-error');return;}const discount=Math.min(Math.round(subtotal*.1),100000);document.querySelector('#discountLine').hidden=false;document.querySelector('#discountAmount').textContent='−'+MELORA.money(discount);const total=document.querySelector('#checkoutSummary .summary-total strong');if(total)total.textContent=MELORA.money(subtotal+(subtotal>=500000?0:30000)-discount);message.textContent='Đã áp dụng mã MELORA10.';message.classList.remove('coupon-error');};
 }
 const current=JSON.parse(localStorage.getItem('melora-current-user')||'null');
 if(current){for(const [field,value] of [['fullName',current.name],['phone',current.phone],['email',current.email],['address',current.address]]){const input=form.elements[field];if(input&&value)input.value=value;}}
 form.onsubmit=e=>{e.preventDefault();if(!MELORA.cart.length){alert('Giỏ hàng đang trống.');return;}const data=new FormData(form),subtotal=MELORA.cart.reduce((sum,row)=>{const p=products.find(x=>x.id===row.id);return sum+(p?p.gia*row.soLuong:0);},0),discount=(document.querySelector('#maUuDai')?.value.trim().toUpperCase()==='MELORA10'&&subtotal>=300000)?Math.min(Math.round(subtotal*.1),100000):0,order={id:'ML'+Date.now(),createdAt:new Date().toISOString(),items:MELORA.cart,customer:{name:data.get('fullName'),phone:data.get('phone'),email:data.get('email'),address:data.get('address'),note:data.get('note')},payment:data.get('payment'),discount,total:subtotal+(subtotal>=500000?0:30000)-discount};
  const orders=JSON.parse(localStorage.getItem('melora-orders')||'[]');orders.push(order);localStorage.setItem('melora-orders',JSON.stringify(orders));
  if(current){current.name=order.customer.name;current.phone=order.customer.phone;current.address=order.customer.address;current.points=(current.points||0)+Math.floor(subtotal/10000);localStorage.setItem('melora-current-user',JSON.stringify(current));const users=JSON.parse(localStorage.getItem('melora-users')||'[]').map(u=>u.email===current.email?current:u);localStorage.setItem('melora-users',JSON.stringify(users));}
  MELORA.cart=[];MELORA.saveCart();document.querySelector('#checkoutContent').innerHTML=`<div class="empty-state"><span>✓</span><h2>Đặt hàng thành công</h2><p>Mã đơn hàng: <strong>${order.id}</strong></p><p>Thông tin giao hàng đã được lưu trên thiết bị này.</p><a class="primary-button" href="san_pham.html">TIẾP TỤC MUA SẮM</a></div>`;
 };
}
window.timKiemSanPham=()=>{const term=document.querySelector('#oTimKiem')?.value.trim();if(term)location.href=`san_pham.html?tu_khoa=${encodeURIComponent(term)}`;};
document.addEventListener('DOMContentLoaded',()=>{document.querySelector('#oTimKiem')?.addEventListener('keydown',e=>{if(e.key==='Enter')timKiemSanPham();});initAccount();initProducts();initOrderHistory();});

function productCard(p) { const liked=MELORA.favorites.includes(p.id); return `<article class="the-san-pham"><a class="hinh-san-pham" href="san_pham.html#${p.id}"><img loading="lazy" src="${p.hinh_anh}" alt="${p.ten}" onerror="this.src='giao_dien/hinh/anh-san-pham.svg'"><span class="nhan-moi">${p.gia_goc>p.gia?'ƯU ĐÃI':'MELORA'}</span></a><button class="favorite-button ${liked?'is-favorite':''}" type="button" aria-label="Lưu yêu thích" onclick="toggleYeuThich(${p.id})">${liked?'♥':'♡'}</button><div class="thong-tin-san-pham"><p class="thuong-hieu">${p.thuong_hieu}</p><h3>${p.ten}</h3><p class="gia-san-pham">${MELORA.money(p.gia)} <del>${p.gia_goc>p.gia?MELORA.money(p.gia_goc):''}</del></p><button type="button" onclick="themGioHang(${p.id})">THÊM VÀO GIỎ</button></div></article>`; }
window.toggleYeuThich=(id)=>{MELORA.favorites=MELORA.favorites.includes(id)?MELORA.favorites.filter(x=>x!==id):[...MELORA.favorites,id];localStorage.setItem('melora-favorites',JSON.stringify(MELORA.favorites));initProducts();};
function renderFavorites(products){const root=document.querySelector('#danhSachYeuThich');const list=products.filter(p=>MELORA.favorites.includes(p.id));root.innerHTML=list.length?list.map(productCard).join(''):'<div class="empty-state"><span>♡</span><h2>Chưa có sản phẩm yêu thích</h2><p>Lưu sản phẩm bằng biểu tượng trái tim để xem lại tại đây.</p><a class="primary-button" href="san_pham.html">KHÁM PHÁ SẢN PHẨM</a></div>';}
function initOrderHistory(){const root=document.querySelector('#orderHistory');if(!root)return;const current=JSON.parse(localStorage.getItem('melora-current-user')||'null');if(!current){root.innerHTML='<p>Đăng nhập hoặc đăng ký để xem lịch sử mua hàng.</p>';return;}const orders=JSON.parse(localStorage.getItem('melora-orders')||'[]').filter(o=>o.customer?.email?.toLowerCase()===current.email.toLowerCase()).reverse();root.innerHTML=orders.length?orders.map(o=>`<article class="history-row"><div><strong>${o.id}</strong><p>${new Date(o.createdAt).toLocaleDateString('vi-VN')} · ${o.items.reduce((n,i)=>n+i.soLuong,0)} sản phẩm</p><small>Giao đến: ${o.customer.address}</small></div><strong>${MELORA.money(o.total)}</strong></article>`).join(''):'<p>Bạn chưa có đơn hàng nào.</p>';}

function escapeHTML(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function getProductReviews(id){const all=JSON.parse(localStorage.getItem('melora-reviews')||'{}');return all[String(id)]||[];}
function reviewSummary(id){const reviews=getProductReviews(id);if(!reviews.length)return '<span class="review-empty">Chưa có đánh giá</span>';const avg=reviews.reduce((sum,r)=>sum+Number(r.stars),0)/reviews.length;return `<span class="review-stars">${'★'.repeat(Math.round(avg))}${'☆'.repeat(5-Math.round(avg))}</span><span>${avg.toFixed(1)} (${reviews.length})</span>`;}
function renderReviews(product){const root=document.querySelector('#chiTietSanPham');if(!root||!product)return;document.querySelector('#reviewsSection')?.remove();const current=JSON.parse(localStorage.getItem('melora-current-user')||'null'),reviews=getProductReviews(product.id);root.insertAdjacentHTML('afterend',`<section class="review-section" id="reviewsSection"><div class="review-heading"><p class="eyebrow">CHIA SẺ TRẢI NGHIỆM</p><h2>Đánh giá sản phẩm</h2><p>Đánh giá của bạn giúp khách hàng khác lựa chọn dễ hơn.</p></div><div class="review-list">${reviews.length?reviews.slice().reverse().map(r=>`<article class="review-item"><div><strong>${escapeHTML(r.name)}</strong><span class="review-stars">${'★'.repeat(Number(r.stars))}${'☆'.repeat(5-Number(r.stars))}</span></div><small>${new Date(r.date).toLocaleDateString('vi-VN')}</small><p>${escapeHTML(r.text)}</p></article>`).join(''):'<p class="review-empty">Sản phẩm chưa có đánh giá. Hãy chia sẻ cảm nhận đầu tiên nhé.</p>'}</div><form class="review-form" id="reviewForm"><h3>Viết đánh giá</h3><div class="review-form-row"><label>Tên hiển thị<input name="reviewName" maxlength="40" value="${escapeHTML(current?.name||'')}" placeholder="Tên của bạn" required></label><label>Số sao<select name="stars" required><option value="5">5 sao · Rất hài lòng</option><option value="4">4 sao · Hài lòng</option><option value="3">3 sao · Bình thường</option><option value="2">2 sao · Chưa hài lòng</option><option value="1">1 sao · Không hài lòng</option></select></label></div><label>Nhận xét<textarea name="reviewText" minlength="5" maxlength="500" rows="4" placeholder="Chia sẻ trải nghiệm của bạn (5–500 ký tự)" required></textarea></label><button class="primary-button" type="submit">GỬI ĐÁNH GIÁ</button></form></section>`);document.querySelector('#reviewForm').onsubmit=e=>{e.preventDefault();const data=new FormData(e.currentTarget),all=JSON.parse(localStorage.getItem('melora-reviews')||'{}'),list=all[String(product.id)]||[];list.push({name:String(data.get('reviewName')).trim(),stars:Number(data.get('stars')),text:String(data.get('reviewText')).trim(),date:new Date().toISOString()});all[String(product.id)]=list;localStorage.setItem('melora-reviews',JSON.stringify(all));renderReviews(product);document.querySelectorAll(`[data-rating-for="${product.id}"]`).forEach(el=>el.innerHTML=reviewSummary(product.id));MELORA.toast('Cảm ơn bạn đã gửi đánh giá');};}
function productCard(p){const liked=MELORA.favorites.includes(p.id);return `<article class="the-san-pham"><a class="hinh-san-pham" href="san_pham.html#${p.id}"><img loading="lazy" src="${p.hinh_anh}" alt="${p.ten}" onerror="this.onerror=null;this.src='giao_dien/hinh/anh-san-pham.svg'"><span class="nhan-moi">${p.gia_goc>p.gia?'ƯU ĐÃI':'MELORA'}</span></a><button class="favorite-button ${liked?'is-favorite':''}" type="button" aria-label="Lưu yêu thích" onclick="toggleYeuThich(${p.id})">${liked?'♥':'♡'}</button><div class="thong-tin-san-pham"><p class="thuong-hieu">${p.thuong_hieu}</p><h3>${p.ten}</h3><div class="card-rating" data-rating-for="${p.id}">${reviewSummary(p.id)}</div><p class="gia-san-pham">${MELORA.money(p.gia)} <del>${p.gia_goc>p.gia?MELORA.money(p.gia_goc):''}</del></p><button type="button" onclick="themGioHang(${p.id})">THÊM VÀO GIỎ</button></div></article>`;}
