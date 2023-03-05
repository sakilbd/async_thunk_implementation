const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const fetch = require("node-fetch");

// initial state
const initialState = {
    loading: false,
    video: [],
    error: "",
};

// create async thunk
const fetchVideos = createAsyncThunk("video/fetchVideos", async() => {
    try {
        const response = await fetch("http://localhost:9000/videos");
        const videos = await response.json();
        const tags = videos.tags;

        let searchEndpointGenerate = tags
            .map((item) => {
                return `tags_like=${item}`;
            })
            .join("&");

        // console.log("Endpoint : " + searchEndpointGenerate);

        const searchFinalUrl = `http://localhost:9000/videos?${searchEndpointGenerate}`;

        const searchVideos = await fetch(searchFinalUrl);

        const searchResults = await searchVideos.json();

        const sortedSearchResult = searchResults.sort((a, b) => {
            const { views: aViews } = a;
            const { views: bViews } = b;
            return parseFloat(aViews.split("k")) - parseFloat(bViews.split("k"));
        });

        return (sortedSearchResult);
    } catch (err) {
        // console.log(err);
        return err;
    }
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