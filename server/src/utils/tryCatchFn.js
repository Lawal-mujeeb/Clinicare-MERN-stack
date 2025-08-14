const tryCatchFn = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
  // instead of doing this like this, we just create it to call it everytime

  export default tryCatchFn