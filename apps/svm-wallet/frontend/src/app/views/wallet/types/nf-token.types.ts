interface NfToken {
  serial: number;
  tags: {
    image: string;
    title: string;
    subtitle: string;
    author: string;
  };
  attrs: {
    attribute_name: string;
    points: number;
  }[]
}

export type {NfToken};
