const { ObjectId } = require("mongodb");
class FollowService {
  constructor(client) {
    this.Follow = client.db().collection("follows");
  }
  extractContactData(payload) {
    const follow = {
      bookId: payload.bookId,
      userId: payload.userId,
      requireDate: payload.requireDate,
      borrowDate: payload.borrowDate || "",
      returnDate: payload.returnDate || "",
      status: payload.status || "Gửi yêu cầu",
    };

    Object.keys(follow).forEach(
      (key) => follow[key] === undefined && delete follow[key]
      // (key) => {
      //   if (follow[key] === undefined) {
      //     follow[key] = "";
      //   }
      // }
    );
    return follow;
  }

  async create(payload) {
    const follow = this.extractContactData(payload);
    const result = await this.Follow.findOneAndUpdate(
      follow,
      { $set: { requireDate: (follow.requireDate = new Date()) } },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  async find(filter) {
    const cursor = await this.Follow.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      nameFollow: { $regex: new RegExp(name, "i") },
    });
  }
  async findByUser(id) {
    return await this.find({
      userId: { $regex: new RegExp(id, "i") },
    });
  }

  async isExistingFollow(id) {
    return await this.Follow.findOne({
      userId: { $regex: new RegExp(id, "i") },
      status: { $in: ["Chấp nhận", "Gửi yêu cầu"] },
      // status: { $ne: "Đã hoàn trả" },
    });
  }

  async findById(id) {
    return await this.Follow.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const update = this.extractContactData(payload);
    const result = await this.Follow.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Follow.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.Follow.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = FollowService;
