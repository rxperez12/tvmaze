type tShowData = {
  id: number;
  name: string;
  summary: string;
  image: { medium: string };
};

type tShow = {
  id: number;
  name: string;
  summary: string;
  image: string;
};

type tEpisode = { id: number; name: string; season: number; number: number };

export { tShow, tEpisode, tShowData };
