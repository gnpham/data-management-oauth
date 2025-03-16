const axios = require("axios");

axios
  .get("/tiktok/callback")
  .then((response) => {
    // Xử lý response success
    if (response.data.status === "success") {
      const { socialId, accessToken, user } = response.data;
      console.log();
      // Lưu trữ thông tin người dùng và token
      // ...
    } else {
      // Hiển thị thông báo lỗi
      console.error(response.data.message);
    }
  })
  .catch((error) => {
    // Xử lý lỗi
    console.error(error);
  });
