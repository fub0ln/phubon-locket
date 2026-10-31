# Thay đổi

## 1.1.0 — 31/10/2026 — bản kiểm thử lỗi chức năng

Người dùng báo QR không hiện, không có danh sách người xem và gửi bài lỗi ngay ở bản 1.0.0. Ngày Gold đổi sang 28/7/2024 sau khi cài DNS bên thứ ba. Các lỗi trên chưa được xác nhận đã hết trên iPhone.

Module mới chỉ giữ hai script xử lý phản hồi Gold và header cache của RevenueCat. Ngừng sửa Firebase Remote Config và ngừng đưa tên miền Firebase vào danh sách MITM của module. Link script có tham số phiên bản để tránh dùng nhầm bản tải cũ.

`phubon-features.js` trở thành script giữ nguyên phản hồi để tương thích với module cũ nếu tài nguyên đã được cập nhật. Bộ caption và các thiết lập 1.0.0 vẫn có trong lịch sử GitHub ở commit `7c0792ce1a5aa6598f24ddcf1bcdd6738d479a05`; bản 1.1.0 tạm ngừng nạp chúng để kiểm tra chức năng gốc.

Ngừng ép `upload_main`, chất lượng/giới hạn video, bucket lưu trữ, CDN, nhánh Firestore/Cloud Functions, `qr_code_config`, các cờ lượt xem và những cờ thử nghiệm khác. Giữ các giá trị do Locket cung cấp. Đây là cách loại bỏ tác động của cấu hình, chưa phải bằng chứng đã xác định nguyên nhân duy nhất của các lỗi.

Mốc ngày trong script Gold vẫn là 31/10/2026 theo múi giờ Việt Nam. Quyền Gold xử lý trên thiết bị không thay đổi quyền được máy chủ công nhận.

Trước khi kiểm thử: chọn DNS Tự động, tắt các module Locket cũ, bật module 1.1 và giữ Shadowrocket đang kết nối. Kiểm thử bài ảnh chụp mới với caption mặc định, QR và lượt xem riêng từng mục. NextDNS riêng chỉ làm sau khi có kết quả kiểm thử này.
