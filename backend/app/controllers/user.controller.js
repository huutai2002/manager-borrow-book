const ApiError = require("../api-error");
const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const jwt = require("jsonwebtoken");
const {
  registerValidation,
  loginValidation,
} = require("../middlewares/validation");

exports.create = async (req, res, next) => {
  //validation
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }
  try {
    const userService = new UserService(MongoDB.client);
    //get phone
    const { phoneNumber } = req.body;
    const userExitsing = await userService.findByPhoneNumber(phoneNumber);
    if (userExitsing) {
      return next(new ApiError(401, "Phone already exist"));
    }
    const document = await userService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while creating the user new")
    );
  }
};
exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const userService = new UserService(MongoDB.client);
    const { firstName } = req.query;
    if (firstName) {
      documents = await userService.findByName(firstName);
    } else {
      documents = await userService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "An error occurred while retrieving users"));
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "User not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving user with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "User not found"));
    }
    return res.send({ message: "User was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating user with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "User not found"));
    }
    return res.send({ message: "User was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete user with id=${req.params.id}`)
    );
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const deletedCount = await userService.deleteAll();
    return res.send({
      message: `${deletedCount} users were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all users")
    );
  }
};

exports.login = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return next(
        new ApiError(400, "phoneNumber or password can not be empty")
      );
    }

    const user = await userService.findByPhoneNumber(phoneNumber);
    if (!user) {
      return next(new ApiError(401, "Phone or password incorrect"));
    }
    const token = await userService.login(phoneNumber, password);
    if (!token) {
      return next(new ApiError(401, "Phone or password incorrect"));
    }
    // Giải mã token bằng secret key
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);

    return res.send({ token: token, role: decodedToken.role });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while login " + error.message)
    );
  }
};
exports.getInfo = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const { token } = req.body;
    const userId = await userService.get(token);
    if (userId) {
      const document = await userService.findById(userId);
      if (!document) {
        return next(new ApiError(404, "User not found"));
      }
      return res.send(document);
    } else {
      return next(new ApiError(401, "No authorization" + error.message));
    }
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while login " + error.message)
    );
  }
};
