const Joi = require("joi");

const userPostSchemeMiddleware = (req, res, next) => {
  const user_Scheme = Joi.object({
    school_identification_number: Joi.string().required().max(8).min(8),
    name: Joi.string().required(),
    password: Joi.string().min(6).max(16).required(),
    position: Joi.string().required(),
  });
  const { error } = user_Scheme.validate(req.body);
  if (error)
    return res.status(400).send({ error: error["details"][0]["message"] });
  next();
};

const userGetSchemeMiddleware = (req, res, next) => {
  const user_Scheme = Joi.object({
    school_identification_number: Joi.number().required(),
    password: Joi.string().min(6).max(16).required(),
  });
  const { error } = user_Scheme.validate(req.body);
  if (error)
    return res.status(400).send({ error: error["details"][0]["message"] });
  next();
};

const userPatchSchemeMiddleware = (req, res, next) => {
  const user_Scheme = Joi.object({
    _id: Joi.string().required(),
    image: Joi.string(),
    school_identification_number: Joi.number(),
    email: Joi.string().email(),
    name: Joi.string(),
    password: Joi.string(),
    new_password: Joi.string(),
  });
  const { error } = user_Scheme.validate(req.body);
  if (error)
    return res.status(400).send({ error: error["details"][0]["message"] });
  next();
};

const roomPostSchemeMiddleware = (req, res, next) => {
  const { _id } = req.user;
  const room_Scheme = Joi.object({
    room_name: Joi.string().required(),
    room_details: Joi.string().required(),
    creator_id: Joi.string().required(),
  });
  const { error } = room_Scheme.validate({ ...req.body, creator_id: _id });
  if (error)
    return res.status(400).send({ error: error["details"][0]["message"] });
  next();
};

//use in member
const roomPatchSchemeMiddleware = (req, res, next) => {
  const room_Scheme = Joi.object({
    _id: Joi.string().required(),
    user_id: Joi.string().required(),
  });
  const { error } = room_Scheme.validate(req.body);
  if (error)
    return res.status(400).send({ error: error["details"][0]["message"] });
  next();
};

const roomDeleteSchemeMiddleware = (req, res, next) => {
  const room_Scheme = Joi.object({
    _id: Joi.string().required(),
  });
  const { error } = room_Scheme.validate(req.body);
  if (error)
    return res.status(400).send({ error: error["details"][0]["message"] });
  next();
};

const schedulePostSchemeMiddleware = (req, res, next) => {
  const schedule_Scheme = Joi.object({
    _id: Joi.string().required(),
    creator_id: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    From: Joi.string().required(),
    To: Joi.string().required(),
    Date: Joi.string().required(),
    members: Joi.array().items(Joi.string()).required(),
    images: Joi.array().items(Joi.object()).required(),
  });
  const { error } = schedule_Scheme.validate(req.body);
  if (error)
    return res.status(400).send({ error: error["details"][0]["message"] });
  next();
};

const schedulePatchSchemeMiddleware = (req, res, next) => {
  const schedule_Scheme = Joi.object({
    _id: Joi.string().required(),
    schedule_id: Joi.string().required(),
  });
  const { error } = schedule_Scheme.validate(req.body);
  if (error)
    return res.status(400).send({ error: error["details"][0]["message"] });
  next();
};

module.exports = {
  userPostSchemeMiddleware,
  userGetSchemeMiddleware,
  roomPostSchemeMiddleware,
  schedulePostSchemeMiddleware,
  roomPatchSchemeMiddleware,
  schedulePatchSchemeMiddleware,
  roomDeleteSchemeMiddleware,
  userPatchSchemeMiddleware,
};
