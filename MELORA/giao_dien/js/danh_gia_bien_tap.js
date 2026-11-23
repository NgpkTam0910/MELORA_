// Ghi chú biên tập MELORA: điểm và nhận xét tham khảo dựa trên mô tả sản phẩm,
// không phải phản hồi mua hàng hay trải nghiệm thực tế của khách hàng.
const MELORA_EDITORIAL_REVIEWS = {
  1:[4,'Làm sạch khá kỹ nhưng vẫn hướng đến cảm giác dịu nhẹ, hợp làm bước rửa mặt hằng ngày cho da thường đến da dầu.'],
  2:[4,'Bí đao tạo nét riêng cho sản phẩm; dung tích lớn cũng tiện dùng thường xuyên. Nếu trang điểm chống nước, nên làm sạch kỹ thêm ở vùng mắt.'],
  3:[5,'Điểm cộng là công thức không mùi và tập trung cấp ẩm, đáng cân nhắc cho quy trình tối giản hoặc làn da nhạy cảm.'],
  4:[5,'Mô tả nhấn đúng thế mạnh của dòng Sensibio: làm sạch dịu nhẹ. Chai lớn hợp nếu nước tẩy trang là bước dùng mỗi ngày.'],
  5:[4,'Nước micellar đa năng cho nhu cầu làm sạch hằng ngày; có thể dùng như bước đầu trước sữa rửa mặt.'],
  6:[4,'Phiên bản 236 ml gọn hơn chai lớn, tiện mang theo hoặc dùng thử. Công dụng hướng đến da thường và da dầu khá rõ ràng.'],
  7:[4,'Có SPF50+ PA++++ và chiết xuất rau má, kết hợp bảo vệ da với thành phần làm dịu. Hãy thoa đủ lượng và bôi lại khi cần.'],
  8:[4,'Dành cho da dầu và da hỗn hợp nên mô tả khá đúng nhu cầu. Dung tích 500 ml tiện lợi cho người dùng thường xuyên.'],
  9:[5,'Dạng sữa chống nắng SPF50+ PA++++ phù hợp người ưu tiên chống nắng. Nên dùng theo hướng dẫn trên bao bì.'],
  10:[4,'Mô tả nhấn vào làm sạch dịu nhẹ cho da nhạy cảm. Dung tích 400 ml phù hợp sử dụng đều đặn.'],
  11:[5,'Sản phẩm tập trung vào sự dịu nhẹ và làn da nhạy cảm, không ôm đồm nhiều công dụng. Dung tích nhỏ tiện dùng thử.'],
  12:[5,'Tinh chất rau má có định hướng làm dịu và dưỡng ẩm khá dễ hiểu, hợp với quy trình muốn tập trung vào cảm giác ẩm dịu.'],
  13:[4,'Niacinamide kết hợp Zinc phù hợp người quan tâm chăm sóc da dầu. Nên bắt đầu từ tần suất thấp và theo dõi phản ứng của da.'],
  14:[4,'Kết cấu mỏng nhẹ và định hướng chăm sóc da dầu mụn giúp sản phẩm dễ đưa vào quy trình hằng ngày. Da nhạy cảm nên thử trước ở vùng nhỏ.'],
  15:[5,'Toner diếp cá có thông điệp làm dịu và cấp ẩm rõ ràng; dung tích 250 ml cũng thoải mái để sử dụng lâu dài.'],
  16:[5,'Essence ốc sên hướng đến dưỡng ẩm và độ mềm mịn, phù hợp với quy trình có nhiều bước dưỡng.'],
  17:[5,'Chống nắng SPF50+ PA++++ với kết cấu nhẹ, dễ tán là lựa chọn tiện dùng mỗi ngày. Nhớ bôi lại khi hoạt động ngoài trời lâu.'],
  18:[4,'Hyaluronic acid và mục tiêu dưỡng ẩm khiến sản phẩm phù hợp làm bước cấp ẩm cơ bản; có thể kết hợp kem dưỡng để khóa ẩm.'],
  19:[5,'Dung tích lớn và dùng được cho cả mặt lẫn cơ thể là ưu điểm thực tế, nhất là khi da khô cần sản phẩm dưỡng ẩm đa dụng.'],
  20:[4,'Nước micellar quen thuộc, tập trung loại bỏ trang điểm và bụi bẩn. Dung tích 400 ml phù hợp nhu cầu thường xuyên.'],
  21:[4,'Trà xanh và hyaluronic hướng đến cấp ẩm, chăm sóc hàng rào da. Mô tả hợp với người muốn thêm tinh chất dưỡng vào chu trình.'],
  22:[4,'Dạng gel mỏng nhẹ, ráo thoáng cùng SPF50+ PA++++ phù hợp người ngại cảm giác nặng mặt. Cần thoa đủ lượng theo hướng dẫn.'],
  23:[4,'Sữa rửa mặt dịu nhẹ với công dụng đơn giản, dễ hiểu; hợp người đang tìm sản phẩm làm sạch cơ bản mỗi ngày.'],
  24:[4,'Vitamin C là điểm nhấn cho quy trình chăm sóc và làm sáng da. Nên dùng theo hướng dẫn, kết hợp chống nắng ban ngày.'],
  25:[4,'Son tint bóng nhẹ và sắc màu tươi tắn tạo vẻ ngoài trẻ trung, hợp trang điểm hằng ngày. Màu thực tế còn tùy sắc môi.'],
  26:[4,'Chất tint lì mịn và màu dễ phối giúp sản phẩm linh hoạt với nhiều phong cách. Có thể dưỡng môi trước nếu môi dễ khô.'],
  27:[4,'Phấn nước hướng đến độ che phủ tốt nhưng vẫn tự nhiên, phù hợp người thích lớp nền nhanh gọn. Chọn đúng tông da sẽ giúp lớp nền hài hòa.'],
  28:[4,'Phấn má mịn nhẹ, dễ tán và tạo sắc ửng hồng tự nhiên; độ đậm nhạt có thể điều chỉnh theo từng lớp.'],
  29:[4,'Mascara tập trung làm hàng mi trông dài và tơi, hợp để tạo điểm nhấn cho mắt. Hiệu quả còn tùy dáng mi và cách chuốt.'],
  30:[4,'Chì kẻ mày hai đầu tiện dụng, hướng đến dáng mày tự nhiên; phù hợp người muốn định hình nhanh khi trang điểm hằng ngày.']
};

function getProductReviews(id){const all=JSON.parse(localStorage.getItem('melora-reviews')||'{}');return all[String(id)]||[];}
function reviewSummary(id){const reviews=getProductReviews(id);if(reviews.length){const avg=reviews.reduce((sum,r)=>sum+Number(r.stars),0)/reviews.length;return `<span class="review-stars">${'★'.repeat(Math.round(avg))}${'☆'.repeat(5-Math.round(avg))}</span><span>${avg.toFixed(1)} (${reviews.length})</span>`;}const sample=MELORA_EDITORIAL_REVIEWS[id];return sample?`<span class="review-stars">${'★'.repeat(sample[0])}${'☆'.repeat(5-sample[0])}</span><span>${sample[0]}/5 · MELORA</span>`:'<span class="review-empty">Chưa có đánh giá</span>';}

function renderReviews(product){
  const root=document.querySelector('#chiTietSanPham');if(!root||!product)return;
  document.querySelector('#reviewsSection')?.remove();
  const current=JSON.parse(localStorage.getItem('melora-current-user')||'null');
  const reviews=getProductReviews(product.id),sample=MELORA_EDITORIAL_REVIEWS[product.id];
  const sampleCard=sample?`<article class="review-item editorial-review"><div><strong>Góc nhìn biên tập MELORA</strong><span class="review-stars">${'★'.repeat(sample[0])}${'☆'.repeat(5-sample[0])}</span></div><small>Nhận xét tham khảo dựa trên thông tin sản phẩm</small><p>${escapeHTML(sample[1])}</p></article>`:'';
  const customerCards=reviews.slice().reverse().map(r=>`<article class="review-item"><div><strong>${escapeHTML(r.name)}</strong><span class="review-stars">${'★'.repeat(Number(r.stars))}${'☆'.repeat(5-Number(r.stars))}</span></div><small>${new Date(r.date).toLocaleDateString('vi-VN')} · Khách hàng đánh giá</small><p>${escapeHTML(r.text)}</p></article>`).join('');
  root.insertAdjacentHTML('afterend',`<section class="review-section" id="reviewsSection"><div class="review-heading"><p class="eyebrow">CHIA SẺ TRẢI NGHIỆM</p><h2>Đánh giá sản phẩm</h2><p>Điểm MELORA là nhận xét tham khảo; đánh giá khách hàng được hiển thị riêng.</p></div><div class="review-list">${sampleCard}${customerCards||'<p class="review-empty">Chưa có đánh giá từ khách hàng. Bạn có thể là người đầu tiên chia sẻ.</p>'}</div><form class="review-form" id="reviewForm"><h3>Viết đánh giá của bạn</h3><div class="review-form-row"><label>Tên hiển thị<input name="reviewName" maxlength="40" value="${escapeHTML(current?.name||'')}" placeholder="Tên của bạn" required></label><label>Số sao<select name="stars" required><option value="5">5 sao · Rất hài lòng</option><option value="4">4 sao · Hài lòng</option><option value="3">3 sao · Bình thường</option><option value="2">2 sao · Chưa hài lòng</option><option value="1">1 sao · Không hài lòng</option></select></label></div><label>Nhận xét<textarea name="reviewText" minlength="5" maxlength="500" rows="4" placeholder="Chia sẻ trải nghiệm của bạn (5–500 ký tự)" required></textarea></label><button class="primary-button" type="submit">GỬI ĐÁNH GIÁ</button></form></section>`);
  document.querySelector('#reviewForm').onsubmit=e=>{e.preventDefault();const data=new FormData(e.currentTarget),all=JSON.parse(localStorage.getItem('melora-reviews')||'{}'),list=all[String(product.id)]||[];list.push({name:String(data.get('reviewName')).trim(),stars:Number(data.get('stars')),text:String(data.get('reviewText')).trim(),date:new Date().toISOString()});all[String(product.id)]=list;localStorage.setItem('melora-reviews',JSON.stringify(all));renderReviews(product);document.querySelectorAll(`[data-rating-for="${product.id}"]`).forEach(el=>el.innerHTML=reviewSummary(product.id));MELORA.toast('Cảm ơn bạn đã gửi đánh giá');};
}
