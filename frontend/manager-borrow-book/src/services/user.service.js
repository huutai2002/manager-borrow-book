import createApiClient from "./api.service";
class UserService {
  constructor(baseUrl = "/api/users") {
    this.api = createApiClient(baseUrl);
  }
  async getAll() {
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem("token");

      // Gửi yêu cầu với token authorization trong header
      return (
        await this.api.get("/getall", {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
          },
        })
      ).data;
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      throw error; // Ném lỗi để xử lý ở nơi gọi
    }
    // return (await this.api.get("/getall")).data;
  }
  async login(phoneNumber, password) {
    return (await this.api.post("/login", { phoneNumber, password })).data;
  }
  async register(data) {
    return (await this.api.post("/register", data)).data;
  }
  async getInfor(token) {
    return (await this.api.post("/info", { token })).data;
  }
}
export default new UserService();
