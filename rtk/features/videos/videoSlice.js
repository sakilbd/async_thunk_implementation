const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const fetch = require("node-fetch");

// initial state
const initialState = {
    loading: false,
    video: [],
    error: "",
};

// create async thunk
const fetchVideos = createAsyncThunk("post/fetchVideos", async() => {
    const response = await fetch(
        "http://localhost:9000/videos"
    );
    const videos = await response.json();
    const tags = videos.tags;

    console.log(tags);

    return tags;
});

const videoSlice = createSlice({
    name: "video",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchVideos.pending, (state, action) => {
            state.loading = true;
            state.error = "";
        });

        builder.addCase(fetchVideos.fulfilled, (state, action) => {
            state.loading = false;
            state.error = "";
            state.video = action.payload;
        });

        builder.addCase(fetchVideos.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.video = [];
        });
    },
});

module.exports = videoSlice.reducer;
module.exports.fetchVideos = fetchVideos;