import {
  getHero,
  getGenre,
  searchMedia,
  loadMovieStream,
  loadTvSeasons,
  loadEpisodeStream,
  getDetailsFor,
  getRecommendationsFor,
} from './TMDBProvider';

export const getheroVidking = getHero;
export const getgenreVidking = getGenre;
export const searchVidking = searchMedia;

// Kept for compatibility with the existing Details screen imports.
export const loadFlickVidking = loadMovieStream;
export const loadTvDataVidking = loadTvSeasons;
export const loadSeriesEpisodeVidking = loadEpisodeStream;
export const getDetailsVidking = getDetailsFor;
export const getRecommendedVidking = getRecommendationsFor;

export default {
  getheroVidking,
  getgenreVidking,
  searchVidking,
  loadFlickVidking,
  loadTvDataVidking,
  loadSeriesEpisodeVidking,
  getDetailsVidking,
  getRecommendedVidking,
};
