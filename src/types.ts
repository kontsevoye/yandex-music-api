export type RequestHeaders = { [key: string]: string };
export type RequestQuery = { [key: string]: string };
export type RequestBodyData = { [key: string]: string };
export type RequestConfig = {
  scheme: string;
  host: string;
  port: number;
  path?: string;
  headers?: RequestHeaders;
  query?: RequestQuery;
  bodyData?: RequestBodyData;
};

export type Method = "get" | "post";
export type ObjectResponse = { [key: string]: any };
export type StringResponse = string;
export type Response = ObjectResponse | StringResponse;

type PlusStatus = {
  hasPlus: boolean;
  isTutorialCompleted: boolean;
};
type Subscription = {
  expires: string;
  vendor: string;
  vendorHelpUrl: string;
  productId: string;
  orderId: number;
  finished: boolean;
};
type SubscriptionStatus = {
  autoRenewable: Array<Subscription>;
  nonAutoRenewableRemainder: { [key: string]: any };
  canStartTrial: boolean;
  mcdonalds: boolean;
};
type Permissions = {
  until: string;
  values: Array<string>;
  default: Array<string>;
};
type PassportPhone = {
  phone: string;
};
type Account = {
  now: string;
  uid: number;
  login: string;
  region: number;
  fullName: string;
  secondName: string;
  firstName: string;
  displayName: string;
  birthday: string;
  serviceAvailable: boolean;
  hostedUser: boolean;
  "passport-phones": Array<PassportPhone>;
  registeredAt: string;
};
export type GetAccountStatusResponse = {
  account: Account;
  permissions: Permissions;
  subscription: SubscriptionStatus;
  subeditor: boolean;
  subeditorLevel: number;
  plus: PlusStatus;
  defaultEmail: string;
};
type GeneratedPlaylistType =
  | "rewind20"
  | "playlistOfTheDay"
  | "missedLikes"
  | "origin"
  | "family"
  | "recentTracks"
  | "neverHeard"
  | "podcasts"
  | "kinopoisk"
  | string;
type GeneratedPlaylist = {
  type: GeneratedPlaylistType;
  ready: boolean;
  notify: boolean;
  data: Playlist;
};
type FeedDayEventTitle = {
  type: string;
  text: string;
};
type FeedDayEventAugmentedArtist = {
  artist: Artist;
  subscribed: true;
};
type FeedDayEventArtist = {
  augmentedArtist: FeedDayEventAugmentedArtist;
  playsDurationMillis: number;
};
type FeedDayEvent = {
  id: string;
  type: string;
  typeForFrom: string;
  title: Array<FeedDayEventTitle>;
  artists?: Array<FeedDayEventArtist>;
  likedTrack?: Track;
  tracks?: Array<Track>;
  radioIsAvailable?: boolean;
  genre?: GenreId;
  albums?: Array<Album>;
  similarToGenre?: GenreId;
  similarGenre?: GenreId;
  similarToArtist?: Artist;
  similarArtists?: Array<Artist>;
  artist?: Artist;
  socialTracks?: Array<Track>;
};
type FeedDayTrackToPlayWithAds = {
  type: string;
  track: Track;
};
type FeedDay = {
  day: string;
  events: Array<FeedDayEvent>;
  tracksToPlay: Array<Track>;
  tracksToPlayWithAds: Array<FeedDayTrackToPlayWithAds>;
};
export type GetFeedResponse = {
  nextRevision: string;
  canGetMoreEvents: boolean;
  pumpkin: boolean;
  isWizardPassed: boolean;
  generatedPlaylists: Array<GeneratedPlaylist>;
  headlines: Array<any>;
  today: string;
  days: Array<FeedDay>;
};

type Visibility = "public" | "private" | string;
type Sex = "male" | "female" | string;
type PlaylistOwner = {
  uid: number;
  login: string;
  name: string;
  verified: boolean;
  sex: Sex;
};
type PlaylistTrack = {
  id: number;
  timestamp: string;
  recent: boolean;
  track: Track;
};
type PlaylistCoverType = "mosaic" | string;
type PlaylistCover = {
  error?: string;
  type?: PlaylistCoverType;
  itemsUri?: Array<string>;
  custom?: boolean;
};
export type Playlist = {
  owner: PlaylistOwner;
  playlistUuid: string;
  available: boolean;
  uid: number;
  kind: number;
  title: string;
  revision: number;
  snapshot: number;
  trackCount: number;
  visibility: Visibility;
  collective: boolean;
  created: string;
  modified: string;
  isBanner: boolean;
  isPremiere: boolean;
  durationMs: number;
  cover: PlaylistCover;
  ogImage: string;
  tags: Array<any>;
  prerolls: Array<any>;
  lastOwnerPlaylists: Array<Playlist>;
  tracks?: Array<PlaylistTrack>;
};

type GenreId =
  | "all"
  | "pop"
  | "allrock"
  | "indie"
  | "metal"
  | "alternative"
  | "electronics"
  | "dance"
  | "rap"
  | "rnb"
  | "jazz"
  | "blues"
  | "reggae"
  | "ska"
  | "punk"
  | "folk"
  | "estrada"
  | "shanson"
  | "country"
  | "soundtrack"
  | "relax"
  | "children"
  | "naturesounds"
  | "bard"
  | "forchildren"
  | "fairytales"
  | "poemsforchildren"
  | "podcasts"
  | "classicalmusic"
  | "audiobooks"
  | "other"
  | string;
type RadioIcon = {
  backgroundColor: string;
  imageUrl: string;
};
type Genre = {
  id: GenreId;
  weight: number;
  composerTop: boolean;
  title: string;
  fullTitle: string;
  titles: { [key: string]: { title: string } };
  images: { [key: string]: string };
  showInMenu: boolean;
  showInRegions?: Array<number>;
  urlPart?: string;
  color?: string;
  radioIcon?: RadioIcon;
  subGenres?: Array<Genre>;
};
export type GetGenresResponse = Array<Genre>;

export type SearchType = "artist" | "album" | "track" | "all";

export type ApiConfig = {
  oauth: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
  };
  fake_device: {
    DEVICE_ID: string;
    UUID: string;
    PACKAGE_NAME: string;
  };
};

export type ApiInitConfig = {
  access_token?: string;
  uid?: number;
  username?: string;
  password?: string;
};

type ArtistCoverType = "from-artist-photos" | string;
type ArtistCover = {
  type: ArtistCoverType;
  prefix: string;
  uri: string;
};

type ArtistCounts = {
  tracks: number;
  directAlbums: number;
  alsoAlbums: number;
  alsoTracks: number;
};
type Region = "RUSSIA_PREMIUM" | "RUSSIA" | string;
type AlbumType = "compilation" | string;
type TrackPosition = { volume: number; index: number };

export type AlbumVolume = Array<Track>;
export type Album = {
  id: number;
  storageDir: string;
  coverUri: string;
  trackCount: number;
  available: boolean;
  availableForPremiumUsers: boolean;
  title: string;
  genre: GenreId;
  type: AlbumType;
  trackPosition: TrackPosition;
  artists: Array<Artist>;
  availableRegions: Array<Region>;
  labels: Array<string>;
  volumes?: Array<AlbumVolume>;
};
export type AlbumWithTracks = Required<Album>;

type TrackMajor = { id: number; name: string };
type TrackNormalization = { gain: number; peak: number };
export type Track = {
  id: number;
  available: boolean;
  availableAsRbt: boolean;
  availableForPremiumUsers: boolean;
  availableFullWithoutPermission?: boolean;
  lyricsAvailable: boolean;
  rememberPosition: boolean;
  coverUri: string;
  durationMs: number;
  explicit: boolean;
  title: string;
  albums: Array<Album>;
  artists: Array<Artist>;
  regions: Array<Region>;
  major?: TrackMajor;
  storageDir?: string;
  fileSize?: number;
  normalization?: TrackNormalization;
  previewDurationMs?: number;
  type?: string;
  ogImage?: string;
};

export type Artist = {
  id: number;
  name: string;
  composer: boolean;
  various: boolean;
  ticketsAvailable: boolean;
  cover: ArtistCover;
  counts: ArtistCounts;
  genres: Array<Genre>;
  popularTracks: Array<Track>;
  regions: Array<Region>;
  albums?: Array<Album>;
  alsoAlbums?: Array<Album>;
  similarArtists?: Array<Artist>;
};
export type FilledArtist = {
  artist: Artist;
  albums: Array<Album>;
  alsoAlbums: Array<Album>;
  similarArtists: Array<Artist>;
};

export type SearchResponse = {
  type: string;
  page: number;
  perPage: number;
  test: string;
  searchRequestId: string;
  artists?: {
    total: number;
    perPage: number;
    order: number;
    results: Array<Artist>;
  };
  albums?: {
    total: number;
    perPage: number;
    order: number;
    results: Array<Album>;
  };
  tracks?: {
    total: number;
    perPage: number;
    order: number;
    results: Array<Track>;
  };
};

export type ArtistTracksResponse = {
  pager: Pager;
  tracks: Array<Track>;
};

export type SearchAllResponse = Required<SearchResponse>;
export type SearchArtistsResponse = Required<
  Omit<Omit<SearchResponse, "albums">, "tracks">
>;
export type SearchTracksResponse = Required<
  Omit<Omit<SearchResponse, "artists">, "albums">
>;
export type SearchAlbumsResponse = Required<
  Omit<Omit<SearchResponse, "artists">, "tracks">
>;

export type GetTrackResponse = Array<Track>;

type Language = "en" | string;
type Lirics = {
  id: number;
  lyrics: string;
  fullLyrics: string;
  hasRights: boolean;
  showTranslation: boolean;
  textLanguage: Language;
};
type VideoProvider = "youtube" | string;
type Video = {
  title: string;
  cover: string;
  url: string;
  provider: VideoProvider;
  providerVideoId: string;
  embed: string;
};
export type GetTrackSupplementResponse = {
  id: number;
  lyrics: Lirics;
  videos: Array<Video>;
};

type AudioCodec = "mp3" | "aac" | string;
export type DownloadInfo = {
  codec: AudioCodec;
  gain: boolean;
  preview: boolean;
  downloadInfoUrl: string;
  direct: boolean;
  bitrateInKbps: number;
};
export type GetTrackDownloadInfoResponse = Array<DownloadInfo>;

export type InitResponse = {
  access_token: string;
  uid: number;
};

export type ArtistId = number;
export type ArtistUrl = string;

export type AlbumId = number;
export type AlbumUrl = string;

export type TrackId = number;
export type TrackUrl = string;

export type PlaylistId = number;
export type PlaylistUrl = string;

export type UserId = number;
export type UserName = string;

export interface UrlExtractorInterface {
  extractTrackId(url: string): number;
  extractAlbumId(url: string): number;
  extractArtistId(url: string): number;
  extractPlaylistId(url: string): { id: number; user: string };
}

export interface RequestInterface {
  setPath(path: string): RequestInterface;
  getHeaders(): RequestHeaders;
  setHeaders(headers: RequestHeaders): RequestInterface;
  addHeaders(headers: RequestHeaders): RequestInterface;
  getQuery(): RequestQuery;
  setQuery(query: RequestQuery): RequestInterface;
  addQuery(query: RequestQuery): RequestInterface;
  getQueryAsString(): string;
  getBodyData(): RequestBodyData;
  getBodyDataString(): string;
  setBodyData(bodyData: RequestBodyData): RequestInterface;
  addBodyData(bodyData: RequestBodyData): RequestInterface;
  getURI(): string;
  getURL(): string;
}

export interface HttpClientInterface {
  get(request: RequestInterface): Promise<Response>;
  post(request: RequestInterface): Promise<Response>;
}

export type ApiUser = {
  username: string;
  password: string;
  token: string;
  uid: number;
};

export enum DownloadTrackQuality {
  High = "high",
  Low = "low",
}

export enum DownloadTrackCodec {
  MP3 = "mp3",
  AAC = "aac",
}

export type SearchOptions = {
  type?: SearchType;
  page?: number;
  nococrrect?: boolean;
  pageSize?: number;
};

export type ConcreteSearchOptions = Omit<SearchOptions, "type">;

export type Pager = {
  page: number;
  perPage: number;
  total: number;
};

type TrackMeta = {
  id: string;
  albumId: string;
  timestamp: string;
};

export type LikedTracks = {
  library: {
    revision: number;
    uid: number;
    tracks: TrackMeta[];
  };
};
