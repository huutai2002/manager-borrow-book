const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    phoneNumber: Joi.string().length(10).required(),
    password: Joi.string().min(6).required(),
    dateOfBirth: Joi.date()
      .max(new Date(new Date().setFullYear(new Date().getFullYear() - 7)))
      .required(),
    address: Joi.string().required(),
    gender: Joi.string().required(),
  });
  return schema.validate(data);
};
const bookValidation = (data) => {
  const schema = Joi.object({
    nameBook: Joi.string().min(5).required(),
    price: Joi.number().required().min(0),
    quantity: Joi.number().required().min(0),
    mfgDate: Joi.date().required(),
    publisherCode: Joi.required(),
    author: Joi.string().min(5).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.bookValidation = bookValidation;
