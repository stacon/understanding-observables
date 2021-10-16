const pipe =
  (...funcs) =>
  (value) =>
    funcs.reduce((lastResult, func) => func(lastResult), value);

module.exports = { pipe };
