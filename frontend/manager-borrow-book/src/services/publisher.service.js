import createApiClient from "./api.service";
class PublisherService {
  constructor(baseUrl = "/api/publishers") {
    this.api = createApiClient(baseUrl);
  }
  async getAll() {
    return (await this.api.get("/")).data;
  }
  async create(data) {
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem("token");

      // Gửi yêu cầu với token authorization trong header
      return (
        await this.api.post("/", data, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
          },
        })
      ).data;
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      throw error; // Ném lỗi để xử lý ở nơi gọi
    }
  }

  async deleteAll() {
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem("token");

      // Gửi yêu cầu với token authorization trong header
      return (
        await this.api.delete("/", {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
          },
        })
      ).data;
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      throw error; // Ném lỗi để xử lý ở nơi gọi
    }
    // return (await this.api.delete("/")).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async update(id, data) {
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem("token");

      // Gửi yêu cầu với token authorization trong header
      return (
        await this.api.put(`/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
          },
        })
      ).data;
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      throw error; // Ném lỗi để xử lý ở nơi gọi
    }
    // return (await this.api.put(`/${id}`, data)).data;
  }
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}
export default new PublisherService();
