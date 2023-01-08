const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../Model/userModel");
const roomModel = require("../Model/roomModel");
const scheduleModel = require("../Model/scheduleModel");
const {
  userPostSchemeMiddleware,
  userGetSchemeMiddleware,
  roomPostSchemeMiddleware,
  roomPatchSchemeMiddleware,
  roomDeleteSchemeMiddleware,
  schedulePostSchemeMiddleware,
  schedulePatchSchemeMiddleware,
  userPatchSchemeMiddleware,
} = require("../SchemeMiddleware/SchemeMiddleware");
const {
  nameRegisterMiddleware,
  emailRegisterMiddleware,
  sinRegisterMiddleware,
  accountTokenMiddleware,
  accountVerificationMiddleware,
  roomPostMiddleware,
  accountPasswordMiddleware,
} = require("../Middleware/Middleware");

router.post("/user", accountVerificationMiddleware, (req, res) => {
  userModel.findById(req.body._id, (err, data) => {
    if (err)
      return res
        .status(400)
        .send({ status: false, message: "failed to retrieve data" });
    const { _id, school_identification_number, email, name, position, image } =
      data;
    res.status(200).send({
      _id: _id,
      school_identification_number: school_identification_number,
      email: email,
      name: name,
      position: position,
      image: image,
    });
  });
});

router.post(
  "/user/register",
  userPostSchemeMiddleware,
  nameRegisterMiddleware,
  sinRegisterMiddleware,
  (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const data = new userModel({
      school_identification_number: req.body.school_identification_number,
      name: req.body.name,
      position: req.body.position,
      password: hashedPassword,
    });

    data.save((err, data) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ message: true });
    });
  }
);

router.post(
  "/user/login",
  userGetSchemeMiddleware,
  accountTokenMiddleware,
  async (req, res) => {
    const { _id, school_identification_number, email, name, position, image } =
      req.res.locals.data;
    res.header("token", req.res.locals.token).send({
      _id: _id,
      school_identification_number: school_identification_number,
      email: email,
      name: name,
      position: position,
      image: image,
    });
  }
);

router.post("/user/verify", accountVerificationMiddleware, async (req, res) => {
  res.status(200).send({ status: true, message: "authorized" });
});

router.patch(
  "/user/photo",
  accountVerificationMiddleware,
  userPatchSchemeMiddleware,
  async (req, res) => {
    userModel.findByIdAndUpdate(
      {
        _id: req.body._id,
      },
      { $set: { image: req.body.image } },
      {
        returnDocument: "after",
      },
      (err, data) => {
        if (err)
          return res
            .status(400)
            .send({ status: false, message: "failed to update image" });
        return res
          .status(200)
          .send({ status: true, message: "photo successfully updated" });
      }
    );
  }
);

router.patch(
  "/user/sin",
  userPatchSchemeMiddleware,
  accountVerificationMiddleware,
  async (req, res) => {
    userModel.findByIdAndUpdate(
      {
        _id: req.body._id,
      },
      {
        $set: {
          school_identification_number: req.body.school_identification_number,
        },
      },
      {
        returnDocument: "after",
      },
      (err, data) => {
        if (err)
          return res.status(400).send({
            status: false,
            message: "failed to update school identification number",
          });
        return res.status(200).send({
          status: true,
          message: "school identification number successfully updated",
        });
      }
    );
  }
);

router.patch(
  "/user/email",
  userPatchSchemeMiddleware,
  accountVerificationMiddleware,
  async (req, res) => {
    userModel.findByIdAndUpdate(
      {
        _id: req.body._id,
      },
      {
        $set: {
          email: req.body.email,
        },
      },
      {
        returnDocument: "after",
      },
      (err, data) => {
        if (err)
          return res.status(400).send({
            status: false,
            message: "failed to update email",
          });
        return res.status(200).send({
          status: true,
          message: "email successfully updated",
        });
      }
    );
  }
);

router.patch(
  "/user/name",
  userPatchSchemeMiddleware,
  accountVerificationMiddleware,
  async (req, res) => {
    userModel.findByIdAndUpdate(
      {
        _id: req.body._id,
      },
      {
        $set: {
          name: req.body.name,
        },
      },
      {
        returnDocument: "after",
      },
      (err, data) => {
        if (err)
          return res.status(400).send({
            status: false,
            message: "failed to update name",
          });
        return res.status(200).send({
          status: true,
          message: "name successfully updated",
        });
      }
    );
  }
);

router.patch(
  "/user/password",
  userPatchSchemeMiddleware,
  accountVerificationMiddleware,
  accountPasswordMiddleware,
  async (req, res) => {
    userModel.findByIdAndUpdate(
      {
        _id: req.body._id,
      },
      {
        $set: {
          password: req.body.password,
        },
      },
      {
        returnDocument: "after",
      },
      (err, data) => {
        if (err)
          return res.status(400).send({
            status: false,
            message: "failed to update name",
          });
        return res.status(200).send({
          status: true,
          message: "password successfully updated",
        });
      }
    );
  }
);

router
  .route("/schedule")
  .post(
    accountVerificationMiddleware,
    schedulePostSchemeMiddleware,
    async (req, res) => {
      const data = new scheduleModel({
        title: req.body.title,
        description: req.body.description,
        scheduledAt: req.body.scheduledAt,
      });

      data.save((err, data) => {
        if (err) return res.status(400).send(err);
        roomModel.findByIdAndUpdate(
          {
            _id: req.body._id,
          },
          { $push: { schedules: data._id } },
          {
            returnDocument: "after",
          },
          async (err, data) => {
            if (err) return res.status(400).send(err);
            if (err) {
              try {
                const schduleData = await scheduleModel.deleteOne({
                  _id: data._id,
                });
                if (schduleData)
                  return res
                    .status(200)
                    .send({ message: "adding schedule failed" });
              } catch (err) {
                res.status(400).send(err);
              }
            }
            return res.status(200).send(data);
          }
        );
      });
    }
  )
  .patch(
    accountVerificationMiddleware,
    schedulePatchSchemeMiddleware,
    (req, res) => {
      roomModel.findByIdAndUpdate(
        {
          _id: req.body._id,
        },
        { $pull: { schedules: req.body.schedule_id } },
        {
          returnDocument: "after",
        },
        (err, data) => {
          if (err)
            return res
              .status(400)
              .send({ message: "failed to remove schedule" });
          scheduleModel.findByIdAndDelete(
            {
              _id: req.body.schedule_id,
            },
            (err, data) => {
              if (err)
                return res
                  .status(400)
                  .send({ message: "failed to remove schedule" });
              if (data === null)
                return res
                  .status(400)
                  .send({ message: "there is nothing to be deleted" });
              return res
                .status(200)
                .send({ message: "successfully removed schedule" });
            }
          );
        }
      );
    }
  );

router
  .route("/room")
  .post(accountVerificationMiddleware, roomPostSchemeMiddleware, (req, res) => {
    const { _id } = req.user;

    function roomCode(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }

    const data = new roomModel({
      room_name: req.body.room_name,
      room_details: req.body.room_details,
      creator_id: _id,
      members: [],
      schedules: [],
      code: roomCode(6),
    });

    data.save((err, data) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send({ message: true });
    });
  })
  .get(accountVerificationMiddleware, (req, res) => {
    roomModel.find((err, data) => {
      if (err)
        return res
          .status(400)
          .send({ status: false, message: "failed to retrieve data" });
      res.status(200).send(data);
    });
  })
  .delete(
    accountVerificationMiddleware,
    roomDeleteSchemeMiddleware,
    async (req, res) => {
      roomModel.findByIdAndDelete(
        {
          _id: req.body._id,
        },
        (err, data) => {
          if (err)
            return res.status(400).send({ message: "invalid passed _id" });
          data.schedules.forEach((element) => {
            scheduleModel.findByIdAndDelete(
              {
                _id: element.toString(),
              },
              {
                returnDocument: "after",
              },
              (err, data) => {
                if (err)
                  return res
                    .status(200)
                    .send(
                      "Please notify the developer if something went wrong."
                    );
              }
            );
          });
          return res.status(200).send(data);
        }
      );
    }
  );

router
  .route("/member")
  .post(accountVerificationMiddleware, roomPostMiddleware, (req, res) => {
    roomModel.findByIdAndUpdate(
      {
        _id: req.body._id,
      },
      { $push: { members: req.body.user_id } },
      {
        returnDocument: "after",
      },
      (err, data) => {
        if (err) return res.status(400).send({ message: "failed to add user" });
        return res.status(200).send(data);
      }
    );
  })
  .patch(
    accountVerificationMiddleware,
    roomPatchSchemeMiddleware,
    (req, res) => {
      roomModel.findByIdAndUpdate(
        {
          _id: req.body._id,
        },
        { $pull: { members: req.body.user_id } },
        {
          returnDocument: "after",
        },
        (err, data) => {
          if (err)
            return res.status(400).send({ message: "failed to remove user" });
          return res.status(200).send(data);
        }
      );
    }
  );

module.exports = router;
