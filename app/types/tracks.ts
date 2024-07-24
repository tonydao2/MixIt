export interface Remix {
  id: string;
  name: string;
  artists: {
    name: string;
  }[];
  album: {
    images: {
      url: string;
    }[];
  };
  uri: string;
}

export interface Track {
  track: {
    id: string;
    name: string;
    artists: {
      name: string;
    }[];
    album: {
      images: {
        url: string;
      }[];
    };
    uri: string;
  };
}
