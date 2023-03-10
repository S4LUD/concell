const router = require("express").Router();
const bcrypt = require("bcryptjs");
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
  sinRegisterMiddleware,
  accountTokenMiddleware,
  accountVerificationMiddleware,
  roomPostMiddleware,
  accountPasswordMiddleware,
} = require("../Middleware/Middleware");
const notificationModel = require("../Model/notificationModel");

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

router.post("/user/position", accountVerificationMiddleware, (req, res) => {
  userModel
    .find({ position: req.body.position }, (err, data) => {
      if (err) return res.status(400).send({ status: false, message: err });
      res.status(200).send(data);
    })
    .select({
      _id: 1,
      school_identification_number: 1,
      email: 1,
      name: 1,
      position: 1,
      image: 1,
    });
});

router.post(
  "/user/register",
  userPostSchemeMiddleware,
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
      return res
        .status(200)
        .send({ status: true, message: "You've registered successfully" });
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
            .send({ status: false, message: "failed to update photo" });
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
  sinRegisterMiddleware,
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
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.new_password, salt);
    userModel.findByIdAndUpdate(
      {
        _id: req.body._id,
      },
      {
        $set: {
          password: hashedPassword,
        },
      },
      {
        returnDocument: "after",
      },
      (err, data) => {
        if (err)
          return res.status(400).send({
            status: false,
            message: "failed to update password",
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
        From: req.body.From,
        To: req.body.To,
        Date: req.body.Date,
        members: req.body.members,
        images: req.body.images,
        comments: [],
      });

      data.save((err, data) => {
        if (err) return res.status(400).send(err);
        roomModel.findByIdAndUpdate(
          { creator_id: req.body.creator_id, _id: req.body._id },
          {
            $push: {
              schedules: {
                $each: [data._id],
                $position: 0,
              },
            },
          },
          {
            returnDocument: "after",
          },
          async (err, data) => {
            if (err) {
              try {
                const schduleData = await scheduleModel.deleteOne({
                  _id: data._id,
                });
                if (schduleData)
                  return res.status(200).send({
                    status: false,
                    message: "failure to add schedule",
                  });
              } catch (err) {
                res.status(400).send(err);
              }
            }

            await req.body.members.forEach((item) => {
              const dataNotification = new notificationModel({
                message: `You've been added to ${data.room_name} room schedule.`,
                creator_id: item,
              });
              dataNotification.save((err, data) => {
                if (err) return res.status(400).send(err);
              });
            });

            return res
              .status(200)
              .send({ status: true, message: "made a schedule successfully" });
          }
        );
      });
    }
  )
  // not used
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

// not used
router.delete(
  "/room/delete",
  accountVerificationMiddleware,
  roomDeleteSchemeMiddleware,
  async (req, res) => {
    roomModel.findByIdAndDelete(
      {
        _id: req.body._id,
      },
      (err, data) => {
        if (err) return res.status(400).send({ message: "invalid passed _id" });
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
                  .send("Please notify the developer if something went wrong.");
            }
          );
        });
        return res.status(200).send(data);
      }
    );
  }
);

router.post(
  "/room/create",
  accountVerificationMiddleware,
  roomPostSchemeMiddleware,
  (req, res) => {
    const { _id } = req.user;

    function roomCode(length) {
      let result = "";
      let characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
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
  }
);

router.post("/room", accountVerificationMiddleware, (req, res) => {
  roomModel
    .find({ creator_id: req.body._id }, (err, data) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(data);
    })
    .populate({
      path: "schedules",
      populate: {
        path: "members",
        select: [
          "_id",
          "school_identification_number",
          "position",
          "name",
          "createdAt",
          "updatedAt",
          "image",
        ],
      },
    })
    .populate({
      path: "members",
      select: [
        "_id",
        "school_identification_number",
        "position",
        "name",
        "createdAt",
        "updatedAt",
        "image",
      ],
    })
    .sort({ createdAt: 1 });
});

router.post(
  "/room/all/schedules",
  accountVerificationMiddleware,
  (req, res) => {
    roomModel
      .find({ creator_id: req.body._id }, (err, data) => {
        if (err) return res.status(400).send(err);
        let tempSchedules = [];
        let tempMembers = [];
        data.forEach((room) => {
          room.schedules.forEach((schedule) => {
            tempSchedules.push(schedule);
          });
        });

        tempSchedules.forEach((members) => {
          scheduleModel
            .find({ _id: members._id.toString() }, (err, data) => {
              if (err) return res.status(400).send(err);
              tempMembers.push(data[0]);
            })
            .populate({
              path: "members",
              select: [
                "_id",
                "school_identification_number",
                "position",
                "name",
                "createdAt",
                "updatedAt",
                "image",
              ],
            });
        });

        setTimeout(() => {
          return res.status(200).send(tempMembers);
        }, 2000);
      })
      .populate("schedules");
  }
);

router.post(
  "/room/student/schedules",
  accountVerificationMiddleware,
  (req, res) => {
    scheduleModel
      .find({ members: req.body._id }, (err, data) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(data);
      })
      .sort({ createdAt: "desc" })
      .populate({
        path: "members",
        select: [
          "_id",
          "school_identification_number",
          "position",
          "name",
          "createdAt",
          "updatedAt",
          "image",
        ],
      });
  }
);

router.post("/student/room", accountVerificationMiddleware, (req, res) => {
  roomModel
    .find({ members: req.body._id }, (err, data) => {
      res.send(data);
    })
    .populate({
      path: "schedules",
      populate: {
        path: "members",
        select: [
          "_id",
          "school_identification_number",
          "position",
          "name",
          "createdAt",
          "updatedAt",
          "image",
        ],
      },
    })
    .populate({
      path: "members",
      select: [
        "_id",
        "school_identification_number",
        "position",
        "name",
        "createdAt",
        "updatedAt",
        "image",
      ],
    })
    .sort({ createdAt: 1 });
});

router.post(
  "/join/room",
  accountVerificationMiddleware,
  roomPostMiddleware,
  (req, res) => {
    roomModel.findOneAndUpdate(
      {
        code: req.body.code,
      },
      { $push: { members: req.body._id } },
      {
        returnDocument: "after",
      },
      (err, data) => {
        if (err) return res.status(400).send(err);
        if (data === null)
          return res.send({ status: false, message: "Invalid code" });
        return res.status(200).send({ status: true, data });
      }
    );
  }
);

// not used
router.patch(
  "/member/kick",
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
          return res
            .status(400)
            .send({ status: false, message: "failed to remove user" });
        return res.status(400).send({ status: true });
      }
    );
  }
);

router.patch(
  "/leave/room",
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
          return res
            .status(400)
            .send({ status: false, message: "failed to leave from room" });
        return res.status(400).send({ status: true });
      }
    );
  }
);

router.post("/notification", accountVerificationMiddleware, (req, res) => {
  const data = new notificationModel({
    message: req.body.message,
    creator_id: req.body.creator_id,
  });

  data.save((err, data) => {
    if (err) return res.status(400).send(err);
    res.status(200).send({ status: true, message: "Sent successfully." });
  });
});

router.post("/notification/all", accountVerificationMiddleware, (req, res) => {
  notificationModel
    .find({ creator_id: req.body._id }, (err, data) => {
      if (err) return res.status(400).send(err);
      res.status(200).send(data);
    })
    .sort({ createdAt: "desc" });
});

router.patch("/add/comment", accountVerificationMiddleware, (req, res) => {
  scheduleModel.findByIdAndUpdate(
    { _id: req.body._id },
    {
      $push: {
        comments: {
          _id: req.body.comment_id,
          comment: req.body.comment,
          image: req.body.image,
          name: req.body.name,
        },
      },
    },
    {
      returnDocument: "after",
    },
    async (err, data) => {
      if (err) return res.status(400).send(err);

      return res
        .status(200)
        .send({ status: true, message: "successfully commented" });
    }
  );
});

module.exports = router;
