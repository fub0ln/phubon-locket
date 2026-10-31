# Thay đổi

## 1.4.0 — 31/10/2026 — lựa chọn riêng tư

Người dùng xác nhận các chức năng Full 1.3 đã ổn nhưng thiếu đăng riêng tư. Thêm `send_to_self_only_mode = always_enabled` từ bộ gốc để thử bật lại lựa chọn gửi cho chính mình. Đối chiếu đầu ra với 1.3 cho thấy đây là thay đổi cấu hình duy nhất; không thay danh sách người nhận, giá trị visibility, upload, QR hay API người xem.

Dùng file riêng `phubon-full-1.4.js` để giữ nguyên runtime và module Full 1.3 làm dự phòng. Bổ sung 43 kiểm tra đối chiếu; 83 kiểm tra Full dự phòng vẫn qua. Chưa xác nhận nút riêng tư hay quyền riêng tư thực tế của bản 1.4 trên iPhone/máy chủ. Người dùng cần kiểm tra người nhận trước khi gửi.

## 1.3.0 — 31/10/2026 — khôi phục bộ chức năng

Người dùng đã xác nhận bản 1.2 hiện QR, đúng ngày Gold, đăng bài và hiện người xem. Theo yêu cầu khôi phục bộ chức năng ban đầu, thêm `phubon-full.js` với 103 entry, 217 caption và 35 mã bộ lọc; video đặt mục tiêu 30 giây, các cờ âm thanh và giao diện được khôi phục.

Ghép JSON với cấu hình hiện có, giữ các trường QR và camera gốc, các bộ lọc/caption của máy chủ và không nhân đôi ID. Bảo toàn toàn bộ đường upload, storage, CDN, Firestore/Cloud Functions, các thiết lập lượt xem và phạm vi gửi bài. Giữ bitrate/codec/phần cứng camera và quyền danh bạ gốc.

Giữ nguyên Gold/request, script QR 1.2 và các module 1.1/1.2 dự phòng. Bản Full chỉ có một hook cấu hình Firebase. Kiểm tra: 188 phép kiểm tra nền và 83 phép kiểm tra Full đã qua; bản Full chưa được kiểm thử trên điện thoại.

## 1.2.0 — 31/10/2026 — QR riêng

Người dùng xác nhận bản 1.1 đã đăng bài, hiển thị người xem và đúng ngày Gold; QR chưa xuất hiện. Bản 1.2 thêm hook `phubon-qr.js` chỉ sửa `qr_code_config` và `profile_menu_v2_enabled`. Giữ các trường QR gốc và toàn bộ thông số upload, camera, storage, CDN, lượt xem. Bỏ qua NO_CHANGE và phản hồi không hợp lệ.

Bản 1.1 dự phòng giữ nguyên nội dung. Mã Gold/request không đổi. Chưa xác nhận menu/mã QR của 1.2 trên điện thoại. Kiểm tra giả lập: 188 phép kiểm tra đã qua; cần thử lại QR và đăng bài trên iPhone.

## 1.1.0 — 31/10/2026 — bản kiểm thử lỗi chức năng

Người dùng báo QR không hiện, không có danh sách người xem và gửi bài lỗi ngay ở bản 1.0.0. Ngày Gold đổi sang 28/7/2024 sau khi cài DNS bên thứ ba. Các lỗi trên chưa được xác nhận đã hết trên iPhone.

Module mới chỉ giữ hai script xử lý phản hồi Gold và header cache của RevenueCat. Ngừng sửa Firebase Remote Config và ngừng đưa tên miền Firebase vào danh sách MITM của module. Link script có tham số phiên bản để tránh dùng nhầm bản tải cũ.

`phubon-features.js` trở thành script giữ nguyên phản hồi để tương thích với module cũ nếu tài nguyên đã được cập nhật. Bộ caption và các thiết lập 1.0.0 vẫn có trong lịch sử GitHub ở commit `7c0792ce1a5aa6598f24ddcf1bcdd6738d479a05`; bản 1.1.0 tạm ngừng nạp chúng để kiểm tra chức năng gốc.

Ngừng ép `upload_main`, chất lượng/giới hạn video, bucket lưu trữ, CDN, nhánh Firestore/Cloud Functions, `qr_code_config`, các cờ lượt xem và những cờ thử nghiệm khác. Giữ các giá trị do Locket cung cấp. Đây là cách loại bỏ tác động của cấu hình, chưa phải bằng chứng đã xác định nguyên nhân duy nhất của các lỗi.

Mốc ngày trong script Gold vẫn là 31/10/2026 theo múi giờ Việt Nam. Quyền Gold xử lý trên thiết bị không thay đổi quyền được máy chủ công nhận.

Trước khi kiểm thử: chọn DNS Tự động, tắt các module Locket cũ, bật module 1.1 và giữ Shadowrocket đang kết nối. Kiểm thử bài ảnh chụp mới với caption mặc định, QR và lượt xem riêng từng mục. NextDNS riêng chỉ làm sau khi có kết quả kiểm thử này.
