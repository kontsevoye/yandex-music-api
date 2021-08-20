import { authRequest, apiRequest, directLinkRequest } from "./PreparedRequest";
import fallbackConfig from "./config";
import HttpClient from "./HttpClient";
import { parseStringPromise } from "xml2js";
import crypto from "crypto";
import {
  ApiConfig,
  ApiInitConfig,
  InitResponse,
  GetGenresResponse,
  SearchResponse,
  Playlist,
  GetTrackResponse,
  GetTrackSupplementResponse,
  GetTrackDownloadInfoResponse,
  ObjectResponse,
  GetFeedResponse,
  GetAccountStatusResponse,
  Track,
  TrackId,
  HttpClientInterface,
  ApiUser,
  SearchOptions,
  ConcreteSearchOptions,
  SearchAllResponse,
  SearchArtistsResponse,
  SearchTracksResponse,
  SearchAlbumsResponse,
  AlbumId,
  Album,
  AlbumWithTracks,
  FilledArtist,
  Artist,
  ArtistId,
  ArtistTracksResponse,
} from "./types";

export default class YMApi {
  private user: ApiUser = {
    password: "",
    token: "",
    uid: 0,
    username: "",
  };

  constructor(
    private httpClient: HttpClientInterface = new HttpClient(),
    private config: ApiConfig = fallbackConfig
  ) {}

  private getAuthHeader(): { Authorization: string } {
    return {
      Authorization: `OAuth ${this.user.token}`,
    };
  }

  /**
   * Authentication
   */
  async init(config: ApiInitConfig): Promise<InitResponse> {
    // Skip auth if access_token and uid are present
    if (config.access_token && config.uid) {
      this.user.token = config.access_token;
      this.user.uid = config.uid;
      return {
        access_token: config.access_token,
        uid: config.uid,
      };
    }

    if (!config.username || !config.password) {
      throw new Error(
        "username && password || access_token && uid must be set"
      );
    }
    this.user.username = config.username;
    this.user.password = config.password;

    const data = (await this.httpClient.post(
      authRequest().setPath("/1/token").setBodyData({
        grant_type: "password",
        username: this.user.username,
        password: this.user.password,
        client_id: this.config.oauth.CLIENT_ID,
        client_secret: this.config.oauth.CLIENT_SECRET,
      })
    )) as ObjectResponse;

    this.user.token = data.access_token;
    this.user.uid = data.uid;

    return data as InitResponse;
  }

  /**
   * GET: /account/status
   * Get account status for curren user
   */
  getAccountStatus(): Promise<GetAccountStatusResponse> {
    const request = apiRequest()
      .setPath("/account/status")
      .addHeaders(this.getAuthHeader());

    return this.httpClient.get(request) as Promise<GetAccountStatusResponse>;
  }

  /**
   * GET: /feed
   * Get the user's feed
   */
  getFeed(): Promise<GetFeedResponse> {
    const request = apiRequest()
      .setPath("/feed")
      .addHeaders(this.getAuthHeader());

    return this.httpClient.get(request) as Promise<GetFeedResponse>;
  }

  /**
   * GET: /genres
   * Get a list of music genres
   */
  getGenres(): Promise<GetGenresResponse> {
    const request = apiRequest()
      .setPath("/genres")
      .addHeaders(this.getAuthHeader());

    return this.httpClient.get(request) as Promise<GetGenresResponse>;
  }

  /**
   * GET: /search
   * Search artists, tracks, albums.
   */
  search(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
    const type = !options.type ? "all" : options.type;
    const page = String(!options.page ? 0 : options.page);
    const pageSize = String(!options.page ? 0 : options.pageSize);
    const nococrrect = String(
      options.nococrrect == null ? false : options.nococrrect
    );
    const request = apiRequest()
      .setPath("/search")
      .addHeaders(this.getAuthHeader())
      .setQuery({
        type,
        text: query,
        page,
        pageSize,
        nococrrect,
      });

    return this.httpClient.get(request) as Promise<SearchResponse>;
  }

  searchArtists(
    query: string,
    options: ConcreteSearchOptions = {}
  ): Promise<SearchArtistsResponse> {
    return this.search(query, {
      ...options,
      type: "artist",
    }) as Promise<SearchArtistsResponse>;
  }

  searchTracks(
    query: string,
    options: ConcreteSearchOptions = {}
  ): Promise<SearchTracksResponse> {
    return this.search(query, {
      ...options,
      type: "track",
    }) as Promise<SearchTracksResponse>;
  }

  searchAlbums(
    query: string,
    options: ConcreteSearchOptions = {}
  ): Promise<SearchAlbumsResponse> {
    return this.search(query, {
      ...options,
      type: "album",
    }) as Promise<SearchAlbumsResponse>;
  }

  searchAll(
    query: string,
    options: ConcreteSearchOptions = {}
  ): Promise<SearchAllResponse> {
    return this.search(query, {
      ...options,
      type: "all",
    }) as Promise<SearchAllResponse>;
  }

  /**
   * GET: /users/[user_id]/playlists/list
   * Get a user's playlists.
   */
  getUserPlaylists(
    user: number | string | null = null
  ): Promise<Array<Playlist>> {
    const uid = [null, 0, ""].includes(user) ? this.user.uid : user;
    const request = apiRequest()
      .setPath(`/users/${uid}/playlists/list`)
      .addHeaders(this.getAuthHeader());

    return this.httpClient.get(request) as Promise<Array<Playlist>>;
  }

  /**
   * GET: /users/[user_id]/playlists/[playlist_kind]
   * Get a playlist without tracks
   */
  getPlaylist(
    playlistId: number,
    user: number | string | null = null
  ): Promise<Playlist> {
    const uid = [null, 0, ""].includes(user) ? this.user.uid : user;
    const request = apiRequest()
      .setPath(`/users/${uid}/playlists/${playlistId}`)
      .addHeaders(this.getAuthHeader());

    return this.httpClient.get(request) as Promise<Playlist>;
  }

  /**
   * GET: /users/[user_id]/playlists
   * Get an array of playlists with tracks
   */
  getPlaylists(
    playlists: Array<number>,
    user: number | string | null = null,
    options: { mixed?: boolean; "rich-tracks"?: boolean } = {}
  ): Promise<Array<Playlist>> {
    const uid = [null, 0, ""].includes(user) ? this.user.uid : user;
    const kinds = playlists.join();
    const mixed = String(options.mixed == null ? false : options.mixed);
    const richTracks = String(
      options["rich-tracks"] == null ? false : options["rich-tracks"]
    );

    const request = apiRequest()
      .setPath(`/users/${uid}/playlists`)
      .addHeaders(this.getAuthHeader())
      .setQuery({
        kinds,
        mixed,
        "rich-tracks": richTracks,
      });

    return this.httpClient.get(request) as Promise<Array<Playlist>>;
  }

  /**
   * POST: /users/[user_id]/playlists/create
   * Create a new playlist
   */
  createPlaylist(
    name: string,
    options: { visibility?: "public" | "private" } = {}
  ): Promise<Playlist> {
    const visibility = !options.visibility ? "private" : options.visibility;
    const request = apiRequest()
      .setPath(`/users/${this.user.uid}/playlists/create`)
      .addHeaders(this.getAuthHeader())
      .setBodyData({
        title: name,
        visibility,
      });

    return this.httpClient.post(request) as Promise<Playlist>;
  }

  /**
   * POST: /users/[user_id]/playlists/[playlist_kind]/delete
   * Remove a playlist
   */
  removePlaylist(playlistId: number): Promise<"ok" | string> {
    const request = apiRequest()
      .setPath(`/users/${this.user.uid}/playlists/${playlistId}/delete`)
      .addHeaders(this.getAuthHeader());

    return this.httpClient.post(request) as Promise<"ok" | string>;
  }

  /**
   * POST: /users/[user_id]/playlists/[playlist_kind]/name
   * Change playlist name
   */
  renamePlaylist(playlistId: number, name: string): Promise<Playlist> {
    const request = apiRequest()
      .setPath(`/users/${this.user.uid}/playlists/${playlistId}/name`)
      .addHeaders(this.getAuthHeader())
      .setBodyData({
        value: name,
      });

    return this.httpClient.post(request) as Promise<Playlist>;
  }

  /**
   * POST: /users/[user_id]/playlists/[playlist_kind]/change-relative
   * Add tracks to the playlist
   */
  addTracksToPlaylist(
    playlistId: number,
    tracks: Array<{ id: number; albumId: number }>,
    revision: number,
    options: { at?: number } = {}
  ): Promise<Playlist> {
    const at = !options.at ? 0 : options.at;
    const request = apiRequest()
      .setPath(
        `/users/${this.user.uid}/playlists/${playlistId}/change-relative`
      )
      .addHeaders(this.getAuthHeader())
      .setBodyData({
        diff: JSON.stringify([
          {
            op: "insert",
            at,
            tracks: tracks,
          },
        ]),
        revision: String(revision),
      });

    return this.httpClient.post(request) as Promise<Playlist>;
  }

  /**
   * POST: /users/[user_id]/playlists/[playlist_kind]/change-relative
   * Remove tracks from the playlist
   */
  removeTracksFromPlaylist(
    playlistId: number,
    tracks: Array<{ id: number; albumId: number }>,
    revision: number,
    options: { from?: number; to?: number } = {}
  ): Promise<Playlist> {
    const from = !options.from ? 0 : options.from;
    const to = !options.to ? tracks.length : options.to;
    const request = apiRequest()
      .setPath(
        `/users/${this.user.uid}/playlists/${playlistId}/change-relative`
      )
      .addHeaders(this.getAuthHeader())
      .setBodyData({
        diff: JSON.stringify([
          {
            op: "delete",
            from,
            to,
            tracks,
          },
        ]),
        revision: String(revision),
      });

    return this.httpClient.post(request) as Promise<Playlist>;
  }

  /**
   * GET: /tracks/[track_id]
   * Get an array of playlists with tracks
   */
  getTrack(trackId: TrackId): Promise<GetTrackResponse> {
    const request = apiRequest()
      .setPath(`/tracks/${trackId}`)
      .addHeaders(this.getAuthHeader());

    return this.httpClient.get(request) as Promise<GetTrackResponse>;
  }

  /**
   * GET: /tracks/[track_id]
   * Get single track
   */
  async getSingleTrack(trackId: TrackId): Promise<Track> {
    const tracks = await this.getTrack(trackId);
    if (tracks.length !== 1) {
      throw new Error(`More than one result received`);
    }

    return tracks.pop() as Track;
  }

  /**
   * GET: /tracks/[track_id]/supplement
   * Get an array of playlists with tracks
   */
  getTrackSupplement(trackId: TrackId): Promise<GetTrackSupplementResponse> {
    const request = apiRequest()
      .setPath(`/tracks/${trackId}/supplement`)
      .addHeaders(this.getAuthHeader());

    return this.httpClient.get(request) as Promise<GetTrackSupplementResponse>;
  }

  /**
   * GET: /tracks/[track_id]/download-info
   * Get track download information
   */
  getTrackDownloadInfo(
    trackId: TrackId
  ): Promise<GetTrackDownloadInfoResponse> {
    const request = apiRequest()
      .setPath(`/tracks/${trackId}/download-info`)
      .addHeaders(this.getAuthHeader());

    return this.httpClient.get(
      request
    ) as Promise<GetTrackDownloadInfoResponse>;
  }

  /**
   * Get track direct link
   */
  async getTrackDirectLink(trackDownloadUrl: string): Promise<string> {
    const request = directLinkRequest(trackDownloadUrl);
    const xml = await this.httpClient.get(request);
    const parsedXml = await parseStringPromise(xml);
    const host = parsedXml["download-info"].host[0];
    const path = parsedXml["download-info"].path[0];
    const ts = parsedXml["download-info"].ts[0];
    const s = parsedXml["download-info"].s[0];
    const sign = crypto
      .createHash("md5")
      .update("XGRlBW9FXlekgbPrRHuSiA" + path.slice(1) + s)
      .digest("hex");

    return `https://${host}/get-mp3/${sign}/${ts}${path}`;
  }

  /**
   * GET: /albums/[album_id]
   * Get an album
   */
  getAlbum(albumId: AlbumId, withTracks: boolean = false): Promise<Album> {
    const request = apiRequest()
      .setPath(`/albums/${albumId}${withTracks ? "/with-tracks" : ""}`)
      .addHeaders(this.getAuthHeader());

    return this.httpClient.get(request) as Promise<Album>;
  }

  getAlbumWithTracks(albumId: AlbumId): Promise<AlbumWithTracks> {
    return this.getAlbum(albumId, true) as Promise<AlbumWithTracks>;
  }

  /**
   * GET: /albums
   * Get an albums
   */
  getAlbums(albumIds: Array<AlbumId>): Promise<Array<Album>> {
    const request = apiRequest()
      .setPath(`/albums`)
      .setBodyData({ albumIds: albumIds.join() })
      .addHeaders(this.getAuthHeader());

    return this.httpClient.post(request) as Promise<Array<Album>>;
  }

  /**
   * GET: /artists/[artist_id]
   * Get an artist
   */
  getArtist(artistId: ArtistId): Promise<FilledArtist> {
    const request = apiRequest()
      .setPath(`/artists/${artistId}`)
      .addHeaders(this.getAuthHeader());

    return this.httpClient.get(request) as Promise<FilledArtist>;
  }

  /**
   * GET: /artists
   * Get an artists
   */
  getArtists(artistIds: Array<ArtistId>): Promise<Array<Artist>> {
    const request = apiRequest()
      .setPath(`/artists`)
      .setBodyData({ artistIds: artistIds.join() })
      .addHeaders(this.getAuthHeader());

    return this.httpClient.post(request) as Promise<Array<Artist>>;
  }

  /**
   * GET: /artists/[artist_id]/tracks
   * Get tracks by artist id
   */
  getArtistTracks(
    artistId: ArtistId,
    options: SearchOptions = {}
  ): Promise<ArtistTracksResponse> {
    const page = String(!options.page ? 0 : options.page);
    const pageSize = String(!options.pageSize ? 0 : options.pageSize);
    const request = apiRequest()
      .setPath(`/artists/${artistId}/tracks`)
      .addHeaders(this.getAuthHeader())
      .setQuery({
        page,
        pageSize,
      });

    return this.httpClient.get(request) as Promise<ArtistTracksResponse>;
  }

  getLikedTracks(user: number | string | null = null) {
    const uid = [null, 0, ""].includes(user) ? this.user.uid : user;
    const request = apiRequest()
      .setPath(`/users/${uid}/likes/tracks`)
      .addHeaders(this.getAuthHeader())

    return this.httpClient.get(request);
  }
}
