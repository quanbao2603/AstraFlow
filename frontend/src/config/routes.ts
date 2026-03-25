export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    AUTH: '/auth',
    EXPLORE: '/explore',
    COMMUNITY: '/community',
    STORY_DETAIL: (storyId: string) => `/story/${storyId}`,
    READ: (storyId: string, chapterId: string) => `/read/${storyId}/${chapterId}`,
  },
  STUDIO: {
    ROOT: '/studio',
    API_KEYS: '/studio/settings',
    CREATE: '/studio/create',
    LIBRARY: '/studio/library',
    IMPORT: '/studio/import',
    WRITE: (storyId: string, chapterId: string) => `/studio/write/${storyId}/${chapterId}`,
  },
  READER: {
    BOOKSHELF: '/bookshelf',
    PROFILE: (userId: string) => `/profile/${userId}`,
    SETTINGS: '/settings',
  }
} as const;
