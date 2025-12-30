const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This rout is not yet find',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    data: { user },
  });
};
exports.updateUser = (req, res) => {
  res.status(200).json({
    status: 'error',
    message: 'This rout is not yet find',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This rout is not yet find',
  });
};
