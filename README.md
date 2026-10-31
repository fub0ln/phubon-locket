# Phú Bôn — Locket 1.4 Full riêng tư

Phiên bản 1.4.1 · 31/10/2026. Đổi ngày hiển thị Gold thành 01/11/2005 theo múi giờ Việt Nam; giữ bộ chức năng và lựa chọn gửi cho chính mình của bản 1.4.

Người dùng xác nhận các chức năng bản Full 1.3 đã ổn nhưng thiếu đăng riêng tư. Bản 1.4 bổ sung cờ `send_to_self_only_mode = always_enabled` có trong bộ cấu hình gốc. Chưa xác minh lựa chọn người nhận và quyền riêng tư thực tế của bản 1.4 trên điện thoại/máy chủ.

## 1. Link cài

Bản đầy đủ:

https://raw.githubusercontent.com/fub0ln/phubon-locket/main/PhuBon_1_4_Full.module

Bản 1.3 Full dự phòng đã kiểm thử được trên máy người dùng:

https://raw.githubusercontent.com/fub0ln/phubon-locket/main/PhuBon_1_3_Full.module

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

Tổng cộng ghép 104 entry chức năng/giao diện, thêm đúng một cờ so với bản 1.3. Các giá trị từ bộ gốc được ghép với đối tượng hiện có để giữ những trường máy chủ mới mà bộ gốc không biết. Phản hồi NO_CHANGE và JSON không hợp lệ được giữ nguyên; từng entry JSON không đúng cấu trúc sẽ không bị thay thế bằng một cấu trúc đoán mới.

Dữ liệu caption/filter được khôi phục từ bản 1.0 tại commit `7c0792ce1a5aa6598f24ddcf1bcdd6738d479a05`, xuất phát từ file người dùng cung cấp. Các ghi nhận tác giả trong tên nhóm caption được giữ lại.

## 3. Các cấu hình được bảo toàn

Giữ cách xử lý Gold/request của bản 1.2; bản 1.4.1 đặt ngày hiển thị Gold thành 01/11/2005. `phubon-qr.js` cùng các module 1.1 và 1.2 vẫn được lưu làm bản dự phòng.

Không khôi phục các thay đổi đường upload, bucket lưu trữ, CDN, các nhánh Firestore/Cloud Functions hoặc cách lấy dữ liệu người xem của 1.0. Không đặt danh sách người nhận hoặc quyền hiển thị bài đăng trên máy chủ. Giữ khả năng phần cứng camera gốc. Các giá trị gốc được bảo toàn, kể cả khi bản Full thêm các mục giao diện khác.

Bản 1.4 chỉ dùng một hook Firebase `phubon-full-1.4.js`; không chạy thêm hook QR hoặc script toàn bộ tính năng 1.0 trên cùng phản hồi. Script không tự gửi yêu cầu mạng, không tải mã JavaScript động và không tạo dữ liệu người xem hay QR giả.

## 4. Lựa chọn Chỉ mình tôi

Bản này thêm một cờ cấu hình để ứng dụng có thể hiện tính năng gửi cho chính mình. Script không tự đăng bài, không đặt danh sách người nhận và không thay quyền riêng tư của bài đã đăng trên máy chủ.

Khi đăng, chọn mục Chỉ mình tôi/Only me hoặc tài khoản chính mình nếu ứng dụng hiển thị lựa chọn tương ứng. Kiểm tra người nhận chỉ là mình trước khi bấm gửi; tên và vị trí nút có thể khác theo phiên bản Locket. Thử bằng một ảnh bình thường trước. Nếu không có lựa chọn hoặc người nhận vẫn là bạn bè, không coi bài đó là riêng tư; cần kiểm tra lại giao diện và hành vi thực tế.

Việc thấy cờ trong mã hay nút trên giao diện không đủ để chứng minh máy chủ đã áp dụng quyền riêng tư cho bài đăng. Cần xác nhận cách Locket xử lý lựa chọn đó trên điện thoại.

## 5. Cài và kiểm thử trên iPhone

1. Giữ DNS Tự động trong giai đoạn thử; tạm tắt DNS chặn hoặc đổi hướng của bên khác.
2. Trong Shadowrocket → Config/Cấu hình → Modules/Module, tắt bản 1.3 và các module Locket khác. Thêm link `PhuBon_1_4_Full.module`, tải và bật riêng bản Full.
3. Giữ cấu hình nền và chứng chỉ Shadowrocket đã cài. Hai tên miền giải mã vẫn là `api.revenuecat.com` và `firebaseremoteconfig.googleapis.com`. Kết nối lại Shadowrocket, giữ kết nối bật rồi đóng hẳn và mở lại Locket.
4. Thử theo thứ tự: ảnh chụp mới với caption mặc định; ảnh với một caption tùy chỉnh như Coffee Time; ảnh dùng bộ lọc; video dài khoảng 30 giây có tiếng; ảnh/video từ thư viện.
5. Kiểm tra lại QR, ngày Gold và danh sách người xem. Nếu có lỗi, ghi rõ chức năng hoặc caption/bộ lọc đã chọn cùng thông báo lỗi và phiên bản Locket.

Nếu bản Full làm lỗi chức năng từng chạy được, tắt bản 1.4 và bật lại bản 1.3 Full dự phòng. Không bật chồng hai bản và không cần xóa ứng dụng.

Cấu hình đã lưu trong Locket có thể khiến thay đổi chưa xuất hiện ngay. Tải module mới không tự buộc Firebase lấy và kích hoạt cấu hình mới. Âm thanh còn phụ thuộc quyền microphone của ứng dụng và phần cứng; cờ cấu hình không cấp quyền hệ điều hành.

## 6. Giới hạn và bước tiếp theo

Cấu hình 30 giây, số bạn bè lớn hoặc các cờ giao diện không thay đổi hạn mức và quyền mà máy chủ áp dụng. Không cam kết mọi mã bộ lọc/tính năng còn được hỗ trợ trên mọi phiên bản Locket. Phần Gold là phản hồi xử lý trên thiết bị, không tạo giao dịch mua với Apple.

`SETTINGS.goldSince` là `2005-11-01T00:00:00+07:00`, `goldUntil` là `2099-12-31T23:59:59+07:00` trong `phubon-gold.js`.

Chạy `node kiem_tra.cjs`, `node kiem_tra_full.cjs` và `node kiem_tra_rieng_tu.cjs` để kiểm tra mã với dữ liệu giả lập. Bản này qua 188 kiểm tra nền và 83 kiểm tra Full, gồm bảo toàn API/upload/lượt xem, metadata QR, caption gốc, khả năng camera, cấu hình lỗi và việc áp dụng lại không nhân đôi caption. Bản 1.4 bổ sung 43 kiểm tra đối chiếu, xác nhận chỉ đổi cờ self-only so với 1.3 và không đổi dữ liệu người nhận/cấu hình khác. Các kiểm tra này không xác minh quyền riêng tư thực tế trên máy chủ.

Trình tạo module mặc định tạo Full. Dùng `--qr-only` để tạo bản 1.2, hoặc `--baseline` để tạo bản 1.1. Dùng `--full-1-3` để tạo lại Full 1.3.

Khi đổi ngày: đóng Locket, tạm chọn DNS Tự động, cập nhật module Full 1.4.1 rồi bật Shadowrocket và mở lại Locket để nhận ngày mới. Sau khi kiểm tra ngày, đóng Locket, tắt VPN và chọn lại DNS NextDNS riêng. Module dùng `phubon-gold.js?v=1.4.1` để phân biệt với URL script cũ. Ngày trên giao diện không phải một giao dịch mua được ghi nhận với Apple.
