import {
  getTrending,
  getByGenre,
  searchTMDb,
  getMovieDetails,
  getTVDetails,
  getTVSeasons,
  getRecommendations,
  GENRES,
} from '~/api/tmdbApi';

const MOVIE_GENRES = {
  action: GENRES.ACTION,
  adventure: GENRES.ADVENTURE,
  animation: GENRES.ANIMATION,
  comedy: GENRES.COMEDY,
  crime: GENRES.CRIME,
  drama: GENRES.DRAMA,
  fantasy: GENRES.FANTASY,
  horror: GENRES.HORROR,
  mystery: GENRES.MYSTERY,
  romance: GENRES.ROMANCE,
  'sci-fi': GENRES.SCIENCE_FICTION,
  science_fiction: GENRES.SCIENCE_FICTION,
  thriller: GENRES.THRILLER,
};

const TV_GENRES = {
  action: GENRES.ACTION_ADVENTURE,
  adventure: GENRES.ACTION_ADVENTURE,
  animation: GENRES.ANIMATION,
  comedy: GENRES.COMEDY,
  crime: GENRES.CRIME,
  drama: GENRES.DRAMA,
  family: GENRES.FAMILY,
  kids: GENRES.KIDS,
  mystery: GENRES.MYSTERY,
  reality: GENRES.REALITY,
  romance: GENRES.DRAMA,
  sci_fi: GENRES.SCIENCE_FICTION,
};

const getYear = value => {
  if (!value || typeof value !== 'string') {
    return '';
  }
  return value.slice(0, 4);
};

const toRuntime = details => {
  if (!details) {
    return '';
  }

  const runtime = details.runtime || details.episode_run_time?.[0];
  return runtime ? `${runtime} min` : '';
};

const normalizeItem = item => {
  if (!item) {
    return null;
  }

  const type = item.type || item.media_type || (item.first_air_date || item.name ? 'tv' : 'movie');
  const title = item.title || item.name || 'Untitled';
  const release = item.release || item.release_date || item.first_air_date || '';
  const image = item.image || item.poster_path || item.poster || null;
  const backdrop = item.backdrop_path || item.backdrop || image;

  return {
    ...item,
    id: String(item.id),
    type,
    title,
    name: title,
    link: item.link || String(item.id),
    image,
    poster: image,
    backdrop_path: backdrop,
    description: item.description || item.overview || '',
    overview: item.overview || item.description || '',
    release,
    release_date: release,
    rating: item.rating || item.vote_average || '',
    vote_average: item.vote_average || item.rating || '',
    quality: item.quality || 'HD',
  };
};

const normalizeList = items => (Array.isArray(items) ? items.map(normalizeItem).filter(Boolean) : []);

const resolveGenreId = (genre, type = 'movie') => {
  const key = String(genre || '').toLowerCase().replace(/\s+/g, '_');
  const map = type === 'tv' ? TV_GENRES : MOVIE_GENRES;
  return map[key] || MOVIE_GENRES[key] || GENRES.ACTION;
};

export const getHero = async (type = 'all') => {
  const mediaType = type === 'movie' || type === 'tv' ? type : 'all';
  return normalizeList(await getTrending(mediaType));
};

export const getGenre = async (genre = 'action', type = 'movie') => {
  const mediaType = type === 'tv' ? 'tv' : 'movie';
  return normalizeList(await getByGenre(resolveGenreId(genre, mediaType), mediaType));
};

export const searchMedia = async query => {
  if (!query || !query.trim()) {
    return [];
  }
  return normalizeList(await searchTMDb(query.trim()));
};

export const buildVidkingEmbedUrl = ({ tmdbId, type = 'movie', season, episode }) => {
  const id = String(tmdbId || '').trim();
  if (!id) {
    return '';
  }

  if (type === 'tv') {
    return `https://www.vidfast.pro/embed/tv/${id}/${season || 1}/${episode || 1}?autoPlay=true&subtitle=english`;
  }

  return `https://www.vidfast.pro/embed/movie/${id}?autoPlay=true&subtitle=english`;
};

export const loadMovieStream = async tmdbId => ({
  sources: [
    {
      server: 'Vidking',
      name: 'Vidking',
      quality: 'Auto',
      url: buildVidkingEmbedUrl({ tmdbId, type: 'movie' }),
      isIframe: true,
    },
  ],
});

export const loadEpisodeStream = async episode => {
  const tmdbId = episode?.tmdbId || episode?.showId || episode?.seriesId || episode?.tvId;
  const season = episode?.season_number || episode?.seasonNumber || episode?.season || 1;
  const episodeNumber = episode?.episode_number || episode?.episodeNumber || episode?.episode || 1;

  return {
    sources: [
      {
        server: 'Vidking',
        name: 'Vidking',
        quality: 'Auto',
        url: buildVidkingEmbedUrl({ tmdbId, type: 'tv', season, episode: episodeNumber }),
        isIframe: true,
      },
    ],
  };
};

export const loadTvSeasons = async tvId => {
  const seasons = await getTVSeasons(tvId);

  return seasons.map(season => {
    const seasonNumber = season.season_number || season.seasonNumber || season.season || Number(season.id) || 1;

    return {
      ...season,
      id: String(season.id || seasonNumber),
      season: seasonNumber,
      season_number: seasonNumber,
      seasonNumber,
      title: season.title || season.name || `Season ${seasonNumber}`,
      name: season.name || season.title || `Season ${seasonNumber}`,
      image: season.image || season.poster_path || null,
      episodes: (season.episodes || []).map(ep => {
        const episodeNumber = ep.episode_number || ep.episodeNumber || ep.episode || Number(ep.id) || 1;
        const title = ep.title || ep.name || `Episode ${episodeNumber}`;

        return {
          ...ep,
          id: String(ep.id || `${tvId}-${seasonNumber}-${episodeNumber}`),
          tmdbId: String(tvId),
          showId: String(tvId),
          tvId: String(tvId),
          season: seasonNumber,
          season_number: seasonNumber,
          seasonNumber,
          episode: episodeNumber,
          episode_number: episodeNumber,
          episodeNumber,
          title,
          name: title,
          image: ep.image || ep.still_path || null,
          overview: ep.overview || '',
        };
      }),
    };
  });
};

export const getDetailsFor = async (id, type = 'movie') => {
  const details = type === 'tv' ? await getTVDetails(id) : await getMovieDetails(id);

  if (!details) {
    return {
      description: 'No description available',
      country: 'No Data',
      production: 'No Data',
      mainData: [
        { name: 'Type', data: type },
      ],
    };
  }

  const release = details.release_date || details.first_air_date || '';
  const rating = typeof details.vote_average === 'number'
    ? details.vote_average.toFixed(1)
    : details.vote_average || '';
  const genres = Array.isArray(details.genres)
    ? details.genres.map(genre => genre.name).filter(Boolean).join(', ')
    : '';
  const production = Array.isArray(details.production_companies)
    ? details.production_companies.map(company => company.name).filter(Boolean).slice(0, 3).join(', ')
    : '';
  const country = Array.isArray(details.production_countries)
    ? details.production_countries.map(item => item.name).filter(Boolean).join(', ')
    : '';

  return {
    id: String(details.id || id),
    title: details.title || details.name,
    description: details.overview || 'No description available',
    country: country || details.origin_country?.join(', ') || 'No Data',
    production: production || 'No Data',
    image: details.poster_path || null,
    backdrop_path: details.backdrop_path || null,
    mainData: [
      { name: 'Type', data: type === 'tv' ? 'TV Show' : 'Movie' },
      { name: 'Year', data: getYear(release) || 'No Data' },
      { name: 'Rating', data: rating || 'No Data' },
      { name: 'Runtime', data: toRuntime(details) || 'No Data' },
      { name: 'Genres', data: genres || 'No Data' },
    ],
  };
};

export const getRecommendationsFor = async (id, type = 'movie') => normalizeList(await getRecommendations(id, type));

export default {
  getHero,
  getGenre,
  searchMedia,
  loadMovieStream,
  loadEpisodeStream,
  loadTvSeasons,
  getDetailsFor,
  getRecommendationsFor,
};
