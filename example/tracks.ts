import { YMApi } from "../src";
import config from "./config";
const api = new YMApi();

(async () => {
  try {
    await api.init(config.user);
    const searchResult = await api.search("gorillaz", { type: "artist" });
    const gorillazId = searchResult.artists?.results[0].id as number;
    const options: { pageSize: number } = { pageSize: 15 };
    const gorillazResult = await api.getArtistTracks(gorillazId, options);
    gorillazResult.tracks.forEach((track) => console.log(track.title));
  } catch (e) {
    console.log(`api error: ${e.message}`);
  }
})();
