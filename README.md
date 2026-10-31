# Phú Bôn — bộ cấu hình Locket cá nhân

Phiên bản 1.0.0 · Chuẩn bị ngày 31/10/2026.

Đây là bộ mã tùy chỉnh phản hồi trên điện thoại. Nó không tạo giao dịch mua với Apple và không ghi nhận gói trả phí trên máy chủ Locket. Hiệu quả phụ thuộc phiên bản ứng dụng, cách xác thực và dữ liệu được lưu trong bộ nhớ đệm. Bản này đã kiểm tra bằng dữ liệu giả lập, chưa chạy trên iPhone của bạn.

## 1. Các file và link cài

| File | Chức năng |
| --- | --- |
| `phubon-gold.js` | Sửa thông tin quyền Gold trong phản hồi RevenueCat; chỉnh ngày ở đầu file. |
| `phubon-request.js` | Bỏ header ETag của đúng các yêu cầu Locket được nhận diện để có phản hồi mới. |
| `phubon-features.js` | Cá nhân hóa cấu hình tính năng từ file bạn cung cấp, giữ 217 mục caption và 35 mã bộ lọc. |
| `PhuBon.module` | Module đã điền đường dẫn tới ba script trong kho `fub0ln/phubon-locket`. |
| `PhuBon.template.module` | Mẫu để tạo thêm một bản trong kho khác. |
| `tao_module.py` | Tạo module với tên GitHub thực tế, không chứa thông tin đăng nhập. |

Kho quản lý của bạn: https://github.com/fub0ln/phubon-locket

Link module dùng để nhập vào Shadowrocket:

https://raw.githubusercontent.com/fub0ln/phubon-locket/main/PhuBon.module

Đây là kho công khai để phần mềm có thể tải các file Raw mà không cần đăng nhập. "Cá nhân" nghĩa là bản bạn tự quản lý. Ba script đều trỏ về kho này.

## 2. Ngày Gold

Mở `phubon-gold.js`, tìm `SETTINGS`:

```javascript
goldSince: "2026-10-31T00:00:00+07:00",
goldUntil: "2099-12-31T23:59:59+07:00",
```

Đây là hai giá trị mẫu, chưa phải ngày bạn đã chọn. Thay `goldSince` bằng ngày bạn muốn dùng; `+07:00` là múi giờ Việt Nam. Script tự ghi ngày bắt đầu nhất quán trong các trường đăng ký và quyền Gold. Ngày kết thúc phải sau ngày bắt đầu. Giao diện Locket có thể lấy ngày từ một nguồn khác nên việc thay mã không bảo đảm đổi được dòng ngày đang hiển thị.

## 3. Đưa lên GitHub

Kho `fub0ln/phubon-locket` là địa chỉ đã chọn cho bộ này. Các bước dưới đây dành cho việc tự cập nhật hoặc đưa thêm một bản sang kho khác. Không gửi mật khẩu hay token vào chat.

Nếu tự làm trên trình duyệt:

1. Đăng nhập GitHub, tạo repository tên `phubon-locket`; chọn quyền hiển thị phù hợp với cách tải file bên trên.
2. Tải ba file `.js` lên thư mục gốc bằng **Add file → Upload files**, rồi lưu thay đổi bằng nút Commit/Propose changes của giao diện.
3. Nếu dùng kho khác, mở `PhuBon.template.module` bằng trình soạn thảo văn bản và thay toàn bộ `GITHUB_USERNAME` bằng tên tài khoản của bạn. Với kho `fub0ln/phubon-locket`, file `PhuBon.module` đã được điền sẵn. Nếu đổi tên repository hoặc nhánh, sửa các phần `phubon-locket/main` tương ứng trong ba đường dẫn.
4. Lưu thành `PhuBon.module` với mã hóa UTF-8, rồi tải file đó lên cùng thư mục gốc.
5. Mở từng file trên GitHub, chọn **Raw**. Với file JavaScript phải thấy mã, không phải trang 404 hay trang yêu cầu đăng nhập.
6. Lấy link Raw của `PhuBon.module` để nhập vào Shadowrocket.

Trên máy có Python 3, có thể tạo module tự động thay cho bước 3–4:

```bash
python3 tao_module.py --owner TEN_TAI_KHOAN --output PhuBon.module
```

Chạy lệnh trong thư mục chứa các file. Mẫu dùng nhánh `main`; nếu kho dùng nhánh khác, thêm `--ref TEN_NHANH`. Nếu đổi tên kho, thêm `--repo TEN_KHO`.

## 4. Cài trên iPhone

Các nhãn có thể khác đôi chút theo phiên bản/ngôn ngữ Shadowrocket. Bạn cần thực hiện phần này trực tiếp trên điện thoại.

1. Mở Shadowrocket, vào **Config/Cấu hình → Modules/Module** và thêm link Raw của `PhuBon.module`. Tải về và bật module.
2. Tắt module Locket cũ để các script không ghi đè lẫn nhau. Cấu hình nền và các module không liên quan vẫn được quản lý như trước.
3. Trong cấu hình đang dùng, mở mục **HTTPS Decryption/Giải mã HTTPS**. Tạo chứng chỉ mới ngay trên máy bằng Shadowrocket, rồi chọn cài chứng chỉ. Bộ file này không kèm chứng chỉ hoặc khóa riêng dùng chung.
4. Khi iOS đã tải hồ sơ, vào **Cài đặt → Cài đặt chung → VPN & Quản lý thiết bị** (hoặc mục **Đã tải về hồ sơ**) để cài hồ sơ chứng chỉ vừa tạo.
5. Vào **Cài đặt → Cài đặt chung → Giới thiệu → Cài đặt tin cậy chứng nhận**, bật tin cậy hoàn toàn cho đúng chứng chỉ Shadowrocket vừa tạo. Bật giải mã HTTPS trong cấu hình đang dùng.
6. Kiểm tra danh sách giải mã có hai tên miền `api.revenuecat.com` và `firebaseremoteconfig.googleapis.com` do module thêm vào. Chúng là dịch vụ dùng chung giữa nhiều app; script tự kiểm tra User-Agent Locket trước khi sửa dữ liệu. Không mở rộng sang `*`.
7. Bật kết nối Shadowrocket với cấu hình hợp lệ của bạn. Bộ file này không cung cấp máy chủ proxy.
8. Đóng hẳn Locket và mở lại. Kiểm tra tên/huy hiệu, ngày Gold, bộ caption và thử gửi một ảnh/video đến một người bạn để kiểm tra thực tế.

Việc bật cờ lượt xem, bạn bè hoặc video trong cấu hình không chứng minh máy chủ hỗ trợ chúng. Không dùng mua/khôi phục mua hàng như một bước để tạo giao dịch.

## 5. Nếu chưa có tác dụng

Kiểm tra link Raw ba script có mở được không; module mới có đang bật không; module cũ có đang chạy cùng không; chứng chỉ có được tin cậy và giải mã có bật cho cấu hình hiện tại không. Trong nhật ký Shadowrocket, chỉ kiểm tra trạng thái chạy script và lỗi; không cần chia sẻ nội dung yêu cầu, token hay định danh tài khoản.

Nếu script không nhận diện User-Agent Locket, nó sẽ giữ nguyên dữ liệu. Nếu Locket chặn chứng chỉ can thiệp hoặc kiểm tra chữ ký phản hồi, bộ này có thể không hoạt động; kết quả kiểm thử giả lập không chứng minh khả năng vượt qua các kiểm tra đó. Bộ mã không bỏ các header kiểm tra chữ ký.

Khi sửa ngày hoặc mã JavaScript trên GitHub, tải lại tài nguyên script trong Shadowrocket (mục quản lý Script URL hoặc dùng/biên dịch lại cấu hình, tùy phiên bản), rồi mở lại Locket. Cập nhật riêng module có thể chưa cập nhật ngay script đã lưu trong máy.

Để ngừng sử dụng: tắt module và khởi động lại Locket. Nếu không dùng giải mã HTTPS cho việc nào khác, tắt giải mã và gỡ hồ sơ chứng chỉ tương ứng. Trạng thái giao diện có thể còn trong bộ nhớ đệm một thời gian.

## 6. Phạm vi chỉnh sửa và nguồn

`phubon-gold.js` và `phubon-request.js` được viết riêng cho bộ này. Chỉ sửa phản hồi có cấu trúc dự kiến, URL khớp và User-Agent chứa Locket; lỗi JSON sẽ giữ nguyên phản hồi. Không có yêu cầu mạng do các script này tự gửi.

`phubon-features.js` được chỉnh từ file “Markdown đã dán (1).md” bạn cung cấp: giữ cấu hình tính năng, 217 mục caption và 35 mã bộ lọc; thay thông báo thành Phú Bôn; bỏ quảng bá kênh và hai ảnh từ máy chủ bên ngoài. Các ghi chú nguồn về Locket Remote Config Rewrite và nhóm caption của Duy Vinh được giữ trong mã. Không tuyên bố bộ caption gốc do Phú Bôn sáng tác. Bộ file vẫn chứa các thiết lập danh bạ, bộ nhớ đệm, quảng cáo và Sentry theo file nguồn; cần kiểm tra tác dụng thực tế trên app.

Tài liệu tham khảo:

- https://www.revenuecat.com/docs/api-v1/customer-info-model
- https://www.revenuecat.com/docs/customers/trusted-entitlements
- https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- https://docs.github.com/en/repositories/working-with-files/using-files/viewing-and-understanding-files
- https://support.apple.com/en-us/102390
- Module tham khảo do bạn cung cấp: https://raw.githubusercontent.com/NightmarketServer/Module-Shadowrocket-NMS/refs/heads/main/Module-Shadowrocket-NMS/Locket%20Gold/LocketGold2/Locketv13.module


## 7. Kiểm tra mã khi tự chỉnh sửa

Nếu máy có Node.js, chạy `node kiem_tra.cjs` trong thư mục chứa các file để kiểm tra với dữ liệu giả lập, không sử dụng tài khoản thật. Bản 1.0.0 đã qua 79 phép kiểm tra, bao gồm giữ nguyên dữ liệu ứng dụng khác, phản hồi JSON lỗi, tính nhất quán ngày và việc không tự gửi yêu cầu mạng. Kết quả này không thay thế thử nghiệm trên iPhone.
