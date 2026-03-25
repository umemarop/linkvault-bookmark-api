// Wrapper function to handle async errors in Express controllers
// Automatically catches rejected promises and forwards them to global error handler
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
