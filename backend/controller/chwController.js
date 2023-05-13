const asyncHandler = require("express-async-handler");
const { CHW } = require("../models");
const bcrypt = require("bcrypt");

const getCHWs = asyncHandler(async (req, res) => {
  const CHWs = await CHW.find().select("-password");
  res.status(200).json({ data: CHWs });
});

const getCHW = asyncHandler(async (req, res) => {
  const chw = await CHW.findOne({ _id: req.params.chwId }).select("-password");
  res.status(200).json({ data: chw });
});

const registerCHWs = asyncHandler(async (req, res) => {
  const chw = await CHW.findOne({ email: req.body.email });
  if (chw) {
    res.statusCode = 400;
    throw new Error("CHW with email " + req.body.email + " already exists.");
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const newCHW = await CHW.create({ ...req.body, password: hashedPassword });
  res.status(200).json({ data: newCHW });
});

const updateCHW = asyncHandler(async (req, res) => {
  const chw = await CHW.findOne({ _id: req.params.chwId });
  if (!chw) {
    throw new Error("CHW with id " + req.params.chwId + " does not exist");
  }
  await CHW.updateOne({ _id: req.params.chwId }, req.body);
  res
    .status(200)
    .json({
      data: {
        msg: "CHW with id " + req.params.chwId + " updated successfully",
      },
    });
});

const deleteCHW = asyncHandler(async (req, res) => {
  const chw = await CHW.findOne({ _id: req.params.chwId });
  if (!chw) {
    throw new Error("CHW with id " + req.params.chwId + " does not exist");
  }
  await CHW.deleteOne({ _id: req.params.chwId });
  res.status(200).json({
    data: {
      msg: "CHW with id " + req.params.chwId + " deleted successfully",
    },
  });
});

module.exports = { getCHWs, getCHW, registerCHWs, updateCHW, deleteCHW };
