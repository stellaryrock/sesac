const myFetch = () => (
      fetch('https://jsonplaceholder.typicode.com/users/1')
        .then(res => res.json())
        .then(resolve)
        .catch(reject)
);
