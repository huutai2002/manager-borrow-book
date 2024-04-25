const ApiError = require("../api-error");
const { bookValidation } = require("../middlewares/validation");
const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  //validation
  const { error } = bookValidation(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  try {
    const bookService = new BookService(MongoDB.client);
    const { nameBook, author, mfgDate } = req.body;
    const bookExisting = await bookService.isExistingBook(
      nameBook,
      author,
      mfgDate
    );

    if (bookExisting) {
      return next(new ApiError(401, "This book already exits"));
    }
    const document = await bookService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error occurred while creating the book"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const bookService = new BookService(MongoDB.client);
    const { nameBook } = req.query;
    if (nameBook) {
      documents = await bookService.findByName(nameBook);
    } else {
      documents = await bookService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving book"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.findById(req.params.id);
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
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
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
