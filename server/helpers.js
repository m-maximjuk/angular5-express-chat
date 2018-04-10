// Set user info from request
exports.setUserInfo = function setUserInfo(request) {
  const getUserInfo = {
    _id: request._id,
    username: request.username,
    email: request.email
  };

  return getUserInfo;
};
