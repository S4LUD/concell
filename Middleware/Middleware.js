const userModel = require("../Model/userModel");
const roomModel = require("../Model/roomModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const nameRegisterMiddleware = (req, res, next) => {
  userModel.findOne({ name: req.body.name }, async (err, data) => {
    if (err) return res.status(400).send(err);
    if (data) return res.status(302).send({ message: "name already exist" });
    next();
  });
};

const emailRegisterMiddleware = (req, res, next) => {
  userModel.findOne({ email: req.body.email }, async (err, data) => {
    if (err) return res.status(400).send(err);
    if (data) return res.status(302).send({ message: "email already exist" });
    next();
  });
};

const sinRegisterMiddleware = (req, res, next) => {
  userModel.findOne(
    { school_identification_number: req.body.school_identification_number },
    async (err, data) => {
      if (err) return res.status(400).send(err);
      if (data)
        return res
          .status(302)
          .send({ message: "school identification number already exist" });
      next();
    }
  );
};

const roomPostMiddleware = (req, res, next) => {
  roomModel.findOne(
    {
      code: req.body.code,
      members: req.body._id,
    },
    async (err, data) => {
      if (err) return res.status(400).send(err);
      if (data)
        return res
          .status(200)
          .send({ message: "you've already entered the room" });
      next();
    }
  );
};

const accountTokenMiddleware = async (req, res, next) => {
  userModel.findOne(
    { school_identification_number: req.body.school_identification_number },
    async (err, data) => {
      if (err) return res.status(400).send(err);
      if (!data)
        return res.status(404).send({
          status: false,
          message: "invalid credentials",
        });

      const validate = bcrypt.compareSync(req.body.password, data.password);
      if (!validate)
        return res
          .status(400)
          .send({ status: false, message: "invalid credentials." });

      const token = jwt.sign(
        { _id: data._id, position: data.position },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "12hr",
        }
      );

      res.locals.token = token;
      res.locals.data = data;
      next();
    }
  );
};

const accountVerificationMiddleware = async (req, res, next) => {
  let JWToken = req.headers.token;
  if (!JWToken)
    return res.status(401).send({ status: false, message: "unauthorized" });
  try {
    const verified = jwt.verify(JWToken, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send({ status: false, message: "invalid token" });
  }
};

const accountPasswordMiddleware = async (req, res, next) => {
  userModel.findOne({ _id: req.body._id }, async (err, data) => {
    if (err) return res.status(400).send(err);
    if (!data)
      return res.status(404).send({
        status: false,
        message: "You enter the incorrect previous password",
      });

    const validate = bcrypt.compareSync(req.body.password, data.password);
    if (!validate)
      return res.status(400).send({
        status: false,
        message: "You enter the incorrect previous password.",
      });

    next();
  });
};

module.exports = {
  nameRegisterMiddleware,
  emailRegisterMiddleware,
  sinRegisterMiddleware,
  accountTokenMiddleware,
  accountVerificationMiddleware,
  roomPostMiddleware,
  accountPasswordMiddleware,
};
