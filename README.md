# es-container
Simple container for storing data

If you want simple state management for your application and also like to have ability to monitory data access to the state, this tiny library for you.

- Provides simple get/set methods for store your state data
- Provides two simple events for monitoring state data access (events: `get` / `set`)


```
let state = new Container({
  identity: null,
  lang: 'en'
});

state.on('set', (container, key, val) => {
  console.log('You are modifying data ' + key);
});

// update state variable, which will also trigger the event
state.lang = 'fr'; // console outputs >> You are modifying data lang
```

How you handle the get/set event is upto you.  You can perform validation and throw error or setup some log so you can monitor interested variables
