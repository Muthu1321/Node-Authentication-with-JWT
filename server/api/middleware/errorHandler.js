const notFound = async (req, res, next) => {
  try {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    await res.status(404);
    next(error);
  } catch (error) {
    console.log("Not Found - ", error);
  }
};

const errorHandler = async (err, req, res, next) => {
  try {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if (err.name === "CastError" && err.kind === "ObjectId") {
      statusCode = 404;
      message = "Resource Not Found";
    }

    res.status(statusCode).json({
      message: message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { notFound, errorHandler };
