# Phú Bôn — Locket 1.2 QR kiểm thử

Phiên bản 1.2.0 · 31/10/2026.

Người dùng đã xác nhận bản 1.1 đăng bài được, hiển thị người xem và hiển thị đúng ngày Gold. Mục QR chỉ xuất hiện trong bản 1.0 nhiều tính năng; bản 1.1 chưa có mục này. Bản 1.2 thêm riêng cấu hình menu QR vào nền 1.1; chưa được kiểm thử trên iPhone.

## 1. Link cài và bản dự phòng

Kho mã: https://github.com/fub0ln/phubon-locket

Bản 1.2 để thử QR:

https://raw.githubusercontent.com/fub0ln/phubon-locket/main/PhuBon_1_2.module

Bản 1.1 dự phòng đã có kết quả kiểm thử thực tế:

https://raw.githubusercontent.com/fub0ln/phubon-locket/main/PhuBon_1_1.module

`PhuBon.module` trỏ tới bản mới nhất. Chỉ bật một module Locket tại một thời điểm. Không cần nhập lại bộ ZIP 1.0.

## 2. Phạm vi bản 1.2

Giữ hai script Gold và request của bản 1.1. Thêm `phubon-qr.js` cho phản hồi Firebase Remote Config của đúng dự án Locket, chỉ sửa hai entry:

- `qr_code_config`: bật `profile_enabled` và `scanning_enabled`, giữ các trường QR khác của máy chủ thay vì thay cả đối tượng bằng hai cờ.
- `profile_menu_v2_enabled`: bật menu hồ sơ có mục QR.

Chỉ xử lý phản hồi có `entries` hợp lệ và trạng thái UPDATE (hoặc không có trường state). Phản hồi NO_CHANGE, cấu hình rỗng không có entries, JSON lỗi và ứng dụng khác được giữ nguyên. Script không tự gửi yêu cầu mạng và không tự tạo dữ liệu QR của tài khoản.

Không đưa trở lại các thiết lập đường lưu ảnh/CDN, bucket, API lượt xem, Firestore, thông số upload, giới hạn quay dài, âm thanh hay bộ caption 1.0. Các phần này giữ giá trị gốc để tách nguyên nhân lỗi. `phubon-features.js` vẫn là script giữ nguyên phản hồi cho các module cũ đã cập nhật tài nguyên.

Để xử lý QR, bản 1.2 thêm lại tên miền `firebaseremoteconfig.googleapis.com` vào phạm vi giải mã HTTPS. Bản 1.1 không có hook Firebase và vẫn được giữ làm bản dự phòng.

## 3. Cài và kiểm thử trên iPhone

1. Giữ DNS ở Tự động; tạm tắt DNS 2707226.xyz và các DNS chặn khác trong lần thử này.
2. Trong Shadowrocket → Config/Cấu hình → Modules/Module, tắt bản 1.1 và mọi module Locket khác. Thêm link `PhuBon_1_2.module`, tải xuống và bật riêng bản 1.2.
3. Giữ chứng chỉ Shadowrocket đã được tin cậy trên máy và bật HTTPS Decryption cho cấu hình đang dùng. Module thêm hai tên miền `api.revenuecat.com` và `firebaseremoteconfig.googleapis.com`. Kết nối lại Shadowrocket và giữ nó đang bật khi thử.
4. Đóng hẳn rồi mở lại Locket. Kiểm tra có mục QR hay không, bấm vào và kiểm tra mã QR thật có hiển thị hay vẫn trắng/báo lỗi.
5. Đăng thử một ảnh mới với caption mặc định và kiểm tra lại người xem/ngày Gold, để xác nhận việc thêm QR không làm mất các chức năng đã chạy được.

Nếu thêm bản 1.2 làm lỗi đăng bài hoặc mất người xem, tắt nó và dùng lại link 1.1 dự phòng. Báo lại phiên bản Locket cùng ảnh thông báo lỗi. Không cần gửi token hay toàn bộ nhật ký mạng.

Locket có thể tiếp tục sử dụng cấu hình đã lưu trước đó. Chỉ cập nhật module không tự buộc Firebase tải và kích hoạt cấu hình mới, nên chưa thấy QR ngay không đủ để kết luận script đã chạy hay chưa. Không xóa ứng dụng hoặc đăng xuất chỉ để ép làm mới cấu hình.

Nếu menu QR đã hiện nhưng nội dung vẫn trắng, cần kiểm tra tiếp dữ liệu mà app/máy chủ cung cấp. Không coi việc hiện nút là đã sửa xong mã QR; không tạo mã tài khoản giả để che lỗi.

## 4. Ngày Gold và giới hạn

`SETTINGS.goldSince` trong `phubon-gold.js` vẫn là `2026-10-31T00:00:00+07:00`; `goldUntil` là `2099-12-31T23:59:59+07:00`. Đây là dữ liệu đăng ký được xử lý trên thiết bị, không phải giao dịch mua và không thay đổi quyền được máy chủ công nhận.

Bản 1.2 không tạo danh sách người xem và không đổi API đăng bài. Hiệu quả các tính năng phụ thuộc phiên bản Locket và phản hồi của máy chủ.

## 5. Kiểm tra mã và bước tiếp theo

`node kiem_tra.cjs` chạy 188 kiểm tra giả lập ở bản 1.2: bảo toàn cấu hình upload/người xem/camera, giữ trường QR gốc, phạm vi URL, NO_CHANGE, phản hồi lỗi và ngày Gold. Kết quả này không thay cho thử trên iPhone.

Trình tạo module: `python3 tao_module.py --owner TEN_TAI_KHOAN` tạo bản mới có QR. Thêm `--baseline` để tạo bản 1.1 chỉ có Gold.

Tiếp tục thử phần quay dài/âm thanh riêng sau khi QR ổn. NextDNS riêng chỉ làm sau khi kết quả chức năng cơ bản được xác nhận; chặn RevenueCat trong lúc thử có thể ngăn nhận dữ liệu ngày Gold mới.

Bộ caption và thiết lập 1.0 vẫn có trong lịch sử tại commit `7c0792ce1a5aa6598f24ddcf1bcdd6738d479a05`.

Tham khảo: https://firebase.google.com/docs/remote-config và https://www.revenuecat.com/docs/test-and-launch/debugging/caching
