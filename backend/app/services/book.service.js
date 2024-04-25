const { ObjectId } = require("mongodb");
// let bookId = 1;
class BookService {
  constructor(client) {
    this.Book = client.db().collection("books");
  }
  extractContactData(payload) {
    const book = {
      nameBook: payload.nameBook,
      price: payload.price,
      quantity: payload.quantity,
      mfgDate: payload.mfgDate,
      publisherCode: payload.publisherCode,
      author: payload.author,
    };

    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );
    return book;
  }

  async create(payload) {
    const book = this.extractContactData(payload);
    const result = await this.Book.findOneAndUpdate(
      book,
      { $set: { role: book.role === true } },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  async find(filter) {
    const cursor = await this.Book.find(filter);
    return await cursor.toArray();
  }

  async borrowBook(id) {
    // Find the book by ID
    const book = await this.findById(id);

    // Check if the book exists
    if (!book) {
      throw new Error("Book not found");
    }

    // Check if the quantity is greater than 1
    if (book.quantity > 1) {
      // Decrement the quantity by 1
      const updatedBook = await this.Book.findOneAndUpdate(
        { _id: book._id },
        { $inc: { quantity: -1 } }, // Decrement quantity by 1
        { returnDocument: "after" }
      );

      return updatedBook;
    } else {
      throw new Error("Not enough copies available to borrow");
    }
  }

  async returnBook(id) {
    // Find the book by ID
    const book = await this.findById(id);

    // Check if the book exists
    if (!book) {
      throw new Error("Book not found");
    }

    // return

    const updatedBook = await this.Book.findOneAndUpdate(
      { _id: book._id },
      { $inc: { quantity: +1 } },
      { returnDocument: "after" }
    );

    return updatedBook;
  }

  async findByName(name) {
    return await this.find({
      nameBook: { $regex: new RegExp(name, "i") },
    });
  }

  async isExistingBook(nameBook, author, mfgDate) {
    return await this.Book.findOne({
      nameBook: { $regex: new RegExp(nameBook, "i") },
      author: { $regex: new RegExp(author, "i") },
      mfgDate: mfgDate,
    });
  }

  async findById(id) {
    return await this.Book.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    const update = this.extractContactData(payload);
    const result = await this.Book.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Book.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.Book.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = BookService;
