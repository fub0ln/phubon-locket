# Phú Bôn — Locket 1.1 kiểm thử

Phiên bản 1.1.0 · 31/10/2026. Bản sửa để loại bỏ các cấu hình có thể gây lỗi đăng bài, QR và lượt xem. Chưa xác nhận các lỗi đã hết trên iPhone.

## 1. Link cài

Kho mã: https://github.com/fub0ln/phubon-locket

Link mới dùng khi kiểm thử:

https://raw.githubusercontent.com/fub0ln/phubon-locket/main/PhuBon_1_1.module

Link cũ `PhuBon.module` cũng đã cập nhật lên cùng nội dung 1.1.0. Chỉ bật một module Locket tại một thời điểm. Tham số `?v=1.1.0` trong các đường dẫn script giúp tránh nạp nhầm tài nguyên cũ.

## 2. Bản này thay đổi gì?

Bản 1.0.0 giữ quá nhiều thiết lập từ file mẫu: thay đường lưu ảnh/CDN, `upload_main`, nhánh API Firestore/Cloud Functions, cấu hình QR và các cờ lượt xem. Các thiết lập này chưa được xác minh tương thích với phiên bản Locket hiện tại. Đây là các nguyên nhân có thể liên quan, chưa chứng minh là nguyên nhân duy nhất.

Bản 1.1.0 chỉ giữ hai hook RevenueCat xử lý thông tin Gold và header ETag. Module không còn sửa hoặc giải mã Firebase Remote Config; Locket nhận cấu hình chức năng gốc từ máy chủ. `phubon-features.js` trở thành script giữ nguyên phản hồi, để module cũ không tiếp tục ép cấu hình nếu tài nguyên này đã được tải lại.

Bộ 217 caption, 35 mã bộ lọc và các cờ thử nghiệm của 1.0.0 tạm ngừng nạp để kiểm tra chức năng cơ bản. Bản cũ còn trong lịch sử GitHub ở commit `7c0792ce1a5aa6598f24ddcf1bcdd6738d479a05`.

## 3. Chuẩn bị trên iPhone

1. Tạm tắt hồ sơ DNS `2707226.xyz` và các DNS chặn tương tự. Trong Cài đặt → Cài đặt chung → VPN & Quản lý thiết bị → DNS, chọn Tự động nếu mục này xuất hiện. Tên mục có thể khác theo phiên bản iOS. Không bật đồng thời DNS của bên thứ ba trong lần thử này.
2. Trong Shadowrocket → Config/Cấu hình → Modules/Module, tắt các module Locket cũ. Thêm link `PhuBon_1_1.module` ở trên, tải xuống và bật module 1.1.
3. Giữ cấu hình nền đang dùng và chứng chỉ Shadowrocket đã cài trên máy. Bật HTTPS Decryption cho cấu hình hiện tại. Module 1.1 chỉ thêm `api.revenuecat.com` vào danh sách MITM. Nếu trước đây tự thêm Firebase vào cấu hình nền chỉ để dùng Locket, bỏ các mục Firebase đó khỏi danh sách giải mã cho lần kiểm thử này.
4. Ngắt rồi bật lại kết nối Shadowrocket. Giữ Shadowrocket đang kết nối khi thử. Đóng hẳn Locket rồi mở lại; không cần đăng xuất hay xóa ứng dụng.

## 4. Kiểm thử theo thứ tự

| Mục | Cách thử | Ghi nhận |
| --- | --- | --- |
| Đăng bài cơ bản | Chụp một ảnh mới trong Locket, dùng caption mặc định ngắn rồi gửi theo cách bình thường. | Đăng thành công hay lỗi ngay; nội dung thông báo lỗi. |
| Ảnh thư viện/video | Chỉ thử sau khi ảnh cơ bản gửi được; dùng các nút mà giao diện gốc đang cung cấp. | Phân biệt lỗi của ảnh mới, ảnh thư viện và video. |
| QR | Mở QR tài khoản nếu giao diện gốc có mục này. | Mã có hiện không; mục có còn được ứng dụng cung cấp không. |
| Người xem | Kiểm tra bài có lượt xem sau khi được người khác mở, phân biệt với reaction. | Giao diện có trả danh sách người xem hay vẫn chỉ có reaction. |
| Ngày Gold | Kiểm tra sau khi thông tin đăng ký được tải lại với Shadowrocket đang bật. | Ngày đang hiển thị; có còn mốc từ DNS cũ không. |

Nếu ảnh cơ bản vẫn lỗi, thử thêm một lần với cả DNS riêng và Shadowrocket đều tắt, để so sánh tác động của kết nối đang chạy. Bước này không tự xóa cấu hình hoặc thông tin Gold đã lưu trong app. Gửi lại phiên bản Locket và ảnh thông báo lỗi; không cần gửi token, mật khẩu hay toàn bộ nhật ký mạng.

Đổi module không tự xóa Remote Config đã lưu và kích hoạt trong Locket. Cấu hình hoặc ngày cũ có thể còn được app sử dụng đến khi nó tải và kích hoạt dữ liệu mới. Không xóa app chỉ để ép làm mới khi chưa kiểm tra việc sao lưu và đồng bộ dữ liệu.

## 5. Ngày Gold và giới hạn

Trong `phubon-gold.js`, `SETTINGS.goldSince` vẫn là `2026-10-31T00:00:00+07:00`; `goldUntil` là `2099-12-31T23:59:59+07:00`. Script giữ ngày nhất quán giữa đăng ký và quyền Gold trong phản hồi xử lý trên thiết bị.

Đây không phải giao dịch mua và không thay đổi quyền được máy chủ Locket công nhận. Hiển thị Gold không chứng minh tính năng yêu cầu máy chủ sẽ hoạt động. Bản 1.1 không tạo dữ liệu người xem, không tạo QR giả và không ép mở nhánh API chưa được xác minh. QR và danh sách người xem cần dữ liệu thật mà phiên bản app/máy chủ cung cấp.

Mốc ngày đổi thành 28/7/2024 khi dùng DNS bên thứ ba phù hợp với việc thông tin đăng ký mới đến từ một nguồn khác. Chưa thu thập phản hồi mạng trên iPhone để xác định chính xác thứ tự xử lý/cache. Kiểm thử chỉ một nguồn trước khi kết luận.

## 6. Kiểm tra mã và bước tiếp theo

Chạy `node kiem_tra.cjs` trong thư mục chứa các file để kiểm tra trên dữ liệu giả lập. Kiểm tra bao gồm ngày Gold, giữ nguyên ứng dụng khác, phản hồi lỗi và việc các API đăng bài/QR/lượt xem/Firebase không bị các hook Gold xử lý. Kết quả này không thay thế kiểm thử trên điện thoại.

Chỉ tiếp tục tạo NextDNS riêng sau khi người dùng xác nhận chức năng cơ bản ổn định trong lần thử không có DNS chặn. Chặn RevenueCat trước khi kiểm thử sẽ gây khó phân biệt cache cũ với dữ liệu mới và có thể ngăn cập nhật ngày Gold.

Tham khảo:

- https://firebase.google.com/docs/remote-config
- https://www.revenuecat.com/docs/test-and-launch/debugging/caching
- https://www.revenuecat.com/docs/customers/trusted-entitlements
- https://support.apple.com/en-us/102390
