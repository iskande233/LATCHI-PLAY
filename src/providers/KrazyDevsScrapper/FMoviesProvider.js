import { getHero, getGenre, searchMedia } from './TMDBProvider';

export const getherofmovies = getHero;
export const getgenrefmovies = getGenre;
export const searchfmovies = searchMedia;

export default {
  getherofmovies,
  getgenrefmovies,
  searchfmovies,
};
