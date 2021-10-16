const { noop } = require("./common/noop");
const { pipe } = require("./common/pipe");

const someList = [1, 4, 5, 6, 7];

/**
 * @param {SubscriptionFunction} subscription is a function that takes an observer and returns a subscription
 * @returns a new Observable
 */
const Observable = (subscription) => ({
  subscribe: (next = noop, error = noop, complete = noop) => {
    const observer = { next, error, complete };
    const unsubscribe = subscription(observer) ?? noop;

    return () => {
      unsubscribe();
      observer.next = noop;
      observer.error = noop;
      observer.complete = noop;
    };
  },
  pipe: function (...operators) {
    return pipe(...operators)(this);
  },
});

const map = (project) => (stream$) =>
  Observable((observer) => {
    stream$.subscribe(
      (value) => observer.next(project(value)),
      (error) => observer.error(error),
      () => observer.complete()
    );
  });

const filter = (predicate) => (stream$) =>
  Observable((observer) => {
    stream$.subscribe(
      (value) => predicate(value) && observer.next(value),
      (error) => observer.error(error),
      () => observer.complete()
    );
  });

const removeOddValues = (stream$) =>
  Observable((observer) => {
    stream$.subscribe(
      (value) => value % 2 === 0 && observer.next(value),
      (error) => observer.error(error),
      () => observer.complete()
    );
  });

const of = (...items) =>
  Observable((observer) => {
    items.forEach((item) => observer.next(item));
    observer.complete();
  });

const interval = (timeMSecs) =>
  Observable((observer) => {
    let counter = 0;

    const interval = setInterval(() => observer.next(counter++), timeMSecs);

    return () => clearInterval(interval);
  });

const unsubscribe = of(...someList)
  .pipe(
    filter((x) => x > 2),
    map((x) => x + 1),
    removeOddValues
  )
  .subscribe(
    (item) => console.log(item),
    (error) => console.error(error),
    () => console.log("End of stream")
  );

const unsubscribe2 = interval(2000)
  .pipe(
    filter((x) => x > 2),
    map((x) => x + 1),
    removeOddValues
  )
  .subscribe(
    (item) => console.log(item),
    (error) => console.error(error),
    () => console.log("End of stream")
  );

unsubscribe();
setTimeout(() => unsubscribe2(), 40000);
