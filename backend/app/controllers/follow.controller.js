const ApiError = require("../api-error");
const BookService = require("../services/book.service");
const FollowService = require("../services/follow.service");
const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.userId || !req.body?.bookId) {
    return next(new ApiError(400, "Some fields can not be empty"));
  }
  try {
    const followService = new FollowService(MongoDB.client);
    const bookService = new BookService(MongoDB.client);
    const userService = new UserService(MongoDB.client);

    const { userId, bookId } = req.body;
    const followExisting = await followService.isExistingFollow(userId);
    const bookInfo = await bookService.findById(bookId);
    const userInfo = await userService.findById(userId);
    if (followExisting) {
      return next(
        new ApiError(501, "This user do not return book already exits")
      );
    }
    if (!bookInfo || !userInfo) {
      return next(new ApiError(401, "This book or user no have."));
    }
    const follow = await bookService.borrowBook(bookId);
    const document = await followService.create(req.body);

    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while creating the book"));
  }
};
exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const followService = new FollowService(MongoDB.client);
    const { nameBook } = req.query;
    if (nameBook) {
      documents = await followService.findByName(nameBook);
    } else {
      documents = await followService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving book"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const followService = new FollowService(MongoDB.client);
    const document = await followService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving book with id=${req.params.id}`)
    );
  }
};

exports.findByUser = async (req, res, next) => {
  try {
    const followService = new FollowService(MongoDB.client);
    const document = await followService.findByUser(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving book with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const { bookId } = req.body;
    const bookService = new BookService(MongoDB.client);
    const followService = new FollowService(MongoDB.client);
    const document = await followService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    //tang so luong sach len
    const follow = await bookService.returnBook(bookId);
    return res.send({ message: "Book was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating book with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete the book with id=${req.params.id}`)
    );
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const deletedCount = await bookService.deleteAll();
    return res.send({
      message: `${deletedCount} books were deleted successfully`,
    });
  } catch (error) {
    return next(new ApiError(500, "An error occurred while removing all book"));
  }
};
