const store = require("./rtk/app/store");
const { fetchVideos } = require("./rtk/features/videos/videoSlice");

// initial state
// console.log(`Initial State: ${JSON.stringify(store.getState())}`);

// subscribe to state changes
store.subscribe(() => {
    // console.log(store.getState());
});

// disptach actions
store.dispatch(fetchVideos());