const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserService {
  constructor(client) {
    this.User = client.db().collection("users");
  }
  extractContactData(payload) {
    const user = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      gender: payload.gender,
      dateOfBirth: payload.dateOfBirth,
      address: payload.address,
      phoneNumber: payload.phoneNumber,
      password: payload.password,
    };

    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    );
    return user;
  }

  async create(payload) {
    const user = this.extractContactData(payload);
    if (payload.password) {
      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(payload.password, salt);
    }
    const result = await this.User.findOneAndUpdate(
      user,
      { $set: { role: user.role === true } },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }
  async get(token) {
    try {
      // Giải mã token bằng jwt.verify
      const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
      const { userId } = decodedToken;
      return userId;
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Lỗi khi giải mã token:", error);
      return null;
    }
  }

  async find(filter) {
    const cursor = await this.User.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $option: "i" },
    });
  }

  async findByPhoneNumber(phoneNumber) {
    return await this.User.findOne({
      phoneNumber: phoneNumber,
    });
  }

  async findById(id) {
    return await this.User.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const update = this.extractContactData(payload);
    const result = await this.User.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.User.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.User.deleteMany({});
    return result.deletedCount;
  }

  async login(phoneNumberCheck, password) {
    const user = await this.findByPhoneNumber(phoneNumberCheck);

    // So sánh mật khẩu được cung cấp với mật khẩu đã lưu
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return false;
    }

    // Tạo token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_TOKEN,
      {
        expiresIn: "2h",
      }
    );

    return token;
  }
}

module.exports = UserService;
