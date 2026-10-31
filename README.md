# Phú Bôn — Locket 1.3 Full

Phiên bản 1.3.0 · 31/10/2026. Khôi phục các cấu hình chức năng và giao diện từ bản đầu trên nền 1.2 đã chạy được.

Người dùng đã xác nhận bản 1.2 hiển thị QR, đúng ngày Gold, đăng bài và hiển thị người xem. Các phần bổ sung trong bản 1.3 cần kiểm thử tiếp trên iPhone; không coi việc bật một cờ là bằng chứng máy chủ đã cấp tính năng.

## 1. Link cài

Bản đầy đủ:

https://raw.githubusercontent.com/fub0ln/phubon-locket/main/PhuBon_1_3_Full.module

Bản 1.2 dự phòng đã kiểm thử được trên máy người dùng:

https://raw.githubusercontent.com/fub0ln/phubon-locket/main/PhuBon_1_2.module

Kho quản lý: https://github.com/fub0ln/phubon-locket

`PhuBon.module` là bản mới nhất. Chỉ bật một module Locket tại một thời điểm; không bật chồng bản Full với 1.2 hoặc các module của bên khác.

## 2. Các phần được khôi phục

| Nhóm | Cấu hình trong bản Full |
| --- | --- |
| Caption | 217 mục trong bộ gốc, nền màu/chuyển màu, emoji, caption nhạc/vị trí/thời tiết/giờ và các nhóm tùy chỉnh. Ghép thêm vào mục gốc, giữ caption do máy chủ cung cấp và không lặp ID. |
| Bộ lọc | 35 mã bộ lọc của bộ gốc, giữ thêm bộ lọc và thông tin nhóm sẵn có của máy chủ. |
| Video và âm thanh | Đặt các giới hạn camera/thư viện liên quan ở mức 30 giây; bật các cờ video, microphone, âm thanh và Live Photos. Giữ bitrate, codec và khả năng camera gốc của thiết bị. |
| Hồ sơ và QR | Giữ cách ghép QR của bản 1.2; thêm các cờ huy hiệu, biểu tượng, ảnh đại diện và giao diện hồ sơ. |
| Bạn bè | Các cờ gợi ý/ẩn bạn bè, biểu tượng mốc tương tác và giới hạn hiển thị phía ứng dụng theo bộ gốc. Không thay quyền truy cập danh bạ. |
| Tương tác | Các cờ chat/reaction, báo đang nhập, thu hồi tin nhắn, nhóm, streak, lịch và Rollcall của bộ gốc. Giữ nguyên các thiết lập lượt xem đang hoạt động. |
| Widget và giao diện | Các tùy chọn widget, Live Activities, nhật ký, thông báo và khung giao diện. Giữ cấu hình đồng bộ token gốc. |
| Quảng cáo/Sentry | Khôi phục các cờ tắt quảng cáo lịch sử và các cờ Sentry từ bộ gốc. |

Tổng cộng ghép 103 entry chức năng/giao diện. Các giá trị từ bộ gốc được ghép với đối tượng hiện có để giữ những trường máy chủ mới mà bộ gốc không biết. Phản hồi NO_CHANGE và JSON không hợp lệ được giữ nguyên; từng entry JSON không đúng cấu trúc sẽ không bị thay thế bằng một cấu trúc đoán mới.

Dữ liệu caption/filter được khôi phục từ bản 1.0 tại commit `7c0792ce1a5aa6598f24ddcf1bcdd6738d479a05`, xuất phát từ file người dùng cung cấp. Các ghi nhận tác giả trong tên nhóm caption được giữ lại.

## 3. Các cấu hình được bảo toàn

Giữ phần Gold/request và ngày 31/10/2026 của bản 1.2. `phubon-qr.js` cùng các module 1.1 và 1.2 vẫn được lưu làm bản dự phòng.

Không khôi phục các thay đổi đường upload, bucket lưu trữ, CDN, các nhánh Firestore/Cloud Functions hoặc cách lấy dữ liệu người xem của 1.0. Không ép chế độ chỉ gửi cho chính mình và không thay khả năng phần cứng camera. Các giá trị gốc được bảo toàn, kể cả khi bản Full thêm các mục giao diện khác.

Bản Full chỉ dùng một hook Firebase `phubon-full.js`; không chạy thêm hook QR hoặc script toàn bộ tính năng 1.0 trên cùng phản hồi. Script không tự gửi yêu cầu mạng, không tải mã JavaScript động và không tạo dữ liệu người xem hay QR giả.

## 4. Cài và kiểm thử trên iPhone

1. Giữ DNS Tự động trong giai đoạn thử; tạm tắt DNS chặn hoặc đổi hướng của bên khác.
2. Trong Shadowrocket → Config/Cấu hình → Modules/Module, tắt bản 1.2 và các module Locket khác. Thêm link `PhuBon_1_3_Full.module`, tải và bật riêng bản Full.
3. Giữ cấu hình nền và chứng chỉ Shadowrocket đã cài. Hai tên miền giải mã vẫn là `api.revenuecat.com` và `firebaseremoteconfig.googleapis.com`. Kết nối lại Shadowrocket, giữ kết nối bật rồi đóng hẳn và mở lại Locket.
4. Thử theo thứ tự: ảnh chụp mới với caption mặc định; ảnh với một caption tùy chỉnh như Coffee Time; ảnh dùng bộ lọc; video dài khoảng 30 giây có tiếng; ảnh/video từ thư viện.
5. Kiểm tra lại QR, ngày Gold và danh sách người xem. Nếu có lỗi, ghi rõ chức năng hoặc caption/bộ lọc đã chọn cùng thông báo lỗi và phiên bản Locket.

Nếu bản Full làm lỗi chức năng từng chạy được, tắt Full và bật lại bản 1.2 dự phòng. Không bật chồng hai bản và không cần xóa ứng dụng.

Cấu hình đã lưu trong Locket có thể khiến thay đổi chưa xuất hiện ngay. Tải module mới không tự buộc Firebase lấy và kích hoạt cấu hình mới. Âm thanh còn phụ thuộc quyền microphone của ứng dụng và phần cứng; cờ cấu hình không cấp quyền hệ điều hành.

## 5. Giới hạn và bước tiếp theo

Cấu hình 30 giây, số bạn bè lớn hoặc các cờ giao diện không thay đổi hạn mức và quyền mà máy chủ áp dụng. Không cam kết mọi mã bộ lọc/tính năng còn được hỗ trợ trên mọi phiên bản Locket. Phần Gold là phản hồi xử lý trên thiết bị, không tạo giao dịch mua với Apple.

`SETTINGS.goldSince` vẫn là `2026-10-31T00:00:00+07:00`, `goldUntil` là `2099-12-31T23:59:59+07:00` trong `phubon-gold.js`.

Chạy `node kiem_tra.cjs` và `node kiem_tra_full.cjs` để kiểm tra mã với dữ liệu giả lập. Bản này qua 188 kiểm tra nền và 83 kiểm tra Full, gồm bảo toàn API/upload/lượt xem, metadata QR, caption gốc, khả năng camera, cấu hình lỗi và việc áp dụng lại không nhân đôi caption. Chưa thay thế kiểm thử thực tế bản Full trên iPhone.

Trình tạo module mặc định tạo Full. Dùng `--qr-only` để tạo bản 1.2, hoặc `--baseline` để tạo bản 1.1.

Sau khi bản Full được xác nhận hoạt động ổn định, tiếp tục phần NextDNS riêng. Trong lúc thử cần để RevenueCat kết nối được để phân biệt dữ liệu mới với trạng thái đã lưu.
