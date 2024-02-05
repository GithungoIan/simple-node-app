const AppError = require("./appError");
const log = require('signale');

// errors during development
const sendErrorsDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/")) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};

// errors during production
const sendErrorsProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/")) {
    // operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // programming or other unknown erros: do not leak error details
    log.error("Error 🔥 ", err)
    // send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorsDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    sendErrorsProd(error, req, res);
  }
};
