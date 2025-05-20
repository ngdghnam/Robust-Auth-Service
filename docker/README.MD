# CONFIG DOCKER WITH MYSQL - KẾT NỐI MYSQL VỚI DOCKER

_[ENGLISH BELOW!]_

### **Mô tả**

> Phương pháp này sẽ giúp bạn sử dụng MySQL Server một cách cực kỳ dễ dàng mà không cần phải setup nhiều thứ trên máy của bạn. Tất cả việc bạn cần làm là kéo MSQL từ Dockerhub về máy và kết nối với GUI (Ví dụ: MySQL Workbench)

### Câu lệnh

`$ docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag
`

Bạn có thể thay đổi `some-mysql` bằng tên bạn muốn sử dụng cho MySQL, và `MYSQL_ROOT_PASSWORD` bằng mật khẩu bạn muốn đặt.

Bạn có thể tham khảo thêm tại trang chính chủ của MySQL trên Docker Hub: [MySQL Docker Hub](https://hub.docker.com/_/mysql)

### Tiếp theo

Sau khi bạn đã cài xong bạn hãy mở **MySQL Workbench** đã cài đặt lên và tiếp tục làm theo các hướng dẫn sau:
