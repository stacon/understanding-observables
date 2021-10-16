const { pipe } = require("./common/pipe");

// LISTS Example
export const lists = () => {
  const someList = [1, 4, 5, 6, 7];

  /**
   * @param {Function} project transformation function
   * @returns {Function} that takes a list and returns a transformed list
   */
  const map = (project) => (list) => {
    const newList = [];

    list.forEach((item) => newList.push(project(item)));

    return newList;
  };

  /**
   * @param {Function} predicate predicate function
   * @returns {Function} that takes a list and returns a filtered list
   */
  const filter = (predicate) => (list) => {
    const newList = [];

    list.forEach((item) => {
      if (predicate(item)) {
        newList.push(item);
      }
    });

    return newList;
  };

  console.log(
    pipe(
      filter((x) => x > 2),
      map((x) => x + 1)
    )(someList)
  );
};
