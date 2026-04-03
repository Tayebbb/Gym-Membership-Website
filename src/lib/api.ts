const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function fetchApi(endpoint: string, options: RequestOptions = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Something went wrong');
  }

  return data;
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) =>
    fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: (token: string) =>
    fetchApi('/auth/me', {
      token,
    }),

  refresh: (token: string) =>
    fetchApi('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
};

// Gyms API
export const gymsApi = {
  getAll: (params?: Record<string, string>) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return fetchApi(`/gyms${queryString}`);
  },

  getById: (id: string) => fetchApi(`/gyms/${id}`),

  getClasses: (id: string, params?: Record<string, string>) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return fetchApi(`/gyms/${id}/classes${queryString}`);
  },

  addToFavorites: (id: string, token: string) =>
    fetchApi(`/gyms/${id}/favorite`, {
      method: 'POST',
      token,
    }),

  removeFromFavorites: (id: string, token: string) =>
    fetchApi(`/gyms/${id}/favorite`, {
      method: 'DELETE',
      token,
    }),

  getFavorites: (token: string) =>
    fetchApi('/gyms/user/favorites', {
      token,
    }),

  submitReview: (id: string, data: { rating: number; title?: string; content?: string }, token: string) =>
    fetchApi(`/gyms/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),
};

// Workouts API
export const workoutsApi = {
  getAll: (token: string, params?: Record<string, string>) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return fetchApi(`/workouts${queryString}`, {
      token,
    });
  },

  getById: (id: string, token: string) =>
    fetchApi(`/workouts/${id}`, {
      token,
    }),

  create: (data: any, token: string) =>
    fetchApi('/workouts', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  update: (id: string, data: any, token: string) =>
    fetchApi(`/workouts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  delete: (id: string, token: string) =>
    fetchApi(`/workouts/${id}`, {
      method: 'DELETE',
      token,
    }),

  getStats: (token: string) =>
    fetchApi('/workouts/stats/overview', {
      token,
    }),

  checkIn: (data: { gymId: string; notes?: string; workoutType?: string }, token: string) =>
    fetchApi('/workouts/check-in', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  checkOut: (checkInId: string, token: string) =>
    fetchApi(`/workouts/check-out/${checkInId}`, {
      method: 'PUT',
      token,
    }),
};

// Subscriptions API
export const subscriptionsApi = {
  getPlans: () => fetchApi('/subscriptions/plans'),

  getMySubscription: (token: string) =>
    fetchApi('/subscriptions/me', {
      token,
    }),

  create: (data: { planId: string; billingCycle: string }, token: string) =>
    fetchApi('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  cancel: (atPeriodEnd: boolean, token: string) =>
    fetchApi('/subscriptions/cancel', {
      method: 'POST',
      body: JSON.stringify({ atPeriodEnd }),
      token,
    }),

  resume: (token: string) =>
    fetchApi('/subscriptions/resume', {
      method: 'POST',
      token,
    }),

  changePlan: (newPlanId: string, token: string) =>
    fetchApi('/subscriptions/plan', {
      method: 'PUT',
      body: JSON.stringify({ newPlanId }),
      token,
    }),

  getHistory: (token: string) =>
    fetchApi('/subscriptions/history', {
      token,
    }),
};

// Payments API
export const paymentsApi = {
  getMethods: (token: string) =>
    fetchApi('/payments/methods', {
      token,
    }),

  createSetupIntent: (token: string) =>
    fetchApi('/payments/setup-intent', {
      method: 'POST',
      token,
    }),

  getHistory: (token: string, params?: Record<string, string>) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return fetchApi(`/payments/history${queryString}`, {
      token,
    });
  },

  createIntent: (data: { planId: string; billingCycle: string }, token: string) =>
    fetchApi('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  createSubscription: (data: { priceId: string; paymentMethodId: string }, token: string) =>
    fetchApi('/payments/create-subscription', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),
};

// User API
export const userApi = {
  getProfile: (token: string) =>
    fetchApi('/users/me', {
      token,
    }),

  updateProfile: (data: any, token: string) =>
    fetchApi('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  changePassword: (data: { currentPassword: string; newPassword: string }, token: string) =>
    fetchApi('/users/me/password', {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  getActivity: (token: string, days?: number) =>
    fetchApi(`/users/me/activity${days ? `?days=${days}` : ''}`, {
      token,
    }),

  deleteAccount: (password: string, token: string) =>
    fetchApi('/users/me', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
      token,
    }),
};

// Classes API
export const classesApi = {
  getAll: (params?: Record<string, string>) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return fetchApi(`/classes${queryString}`);
  },

  getById: (id: string) => fetchApi(`/classes/${id}`),

  book: (id: string, token: string) =>
    fetchApi(`/classes/${id}/book`, {
      method: 'POST',
      token,
    }),

  cancelBooking: (id: string, token: string) =>
    fetchApi(`/classes/${id}/book`, {
      method: 'DELETE',
      token,
    }),

  getMyBookings: (token: string, upcoming?: boolean) =>
    fetchApi(`/classes/user/bookings${upcoming !== undefined ? `?upcoming=${upcoming}` : ''}`, {
      token,
    }),
};

// Notifications API
export const notificationsApi = {
  getAll: (token: string, params?: Record<string, string>) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return fetchApi(`/notifications${queryString}`, {
      token,
    });
  },

  markAsRead: (id: string, token: string) =>
    fetchApi(`/notifications/${id}/read`, {
      method: 'PUT',
      token,
    }),

  markAllAsRead: (token: string) =>
    fetchApi('/notifications/read-all', {
      method: 'PUT',
      token,
    }),

  delete: (id: string, token: string) =>
    fetchApi(`/notifications/${id}`, {
      method: 'DELETE',
      token,
    }),
};

// Achievements API
export const achievementsApi = {
  getAll: () => fetchApi('/achievements'),

  getMyAchievements: (token: string) =>
    fetchApi('/achievements/me', {
      token,
    }),

  getLeaderboard: (category?: string, period?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (period) params.append('period', period);
    return fetchApi(`/achievements/leaderboard?${params}`);
  },

  getLevelInfo: (token: string) =>
    fetchApi('/achievements/level', {
      token,
    }),
};

// Analytics API
export const analyticsApi = {
  getPersonal: (token: string, period?: string) =>
    fetchApi(`/analytics/personal${period ? `?period=${period}` : ''}`, {
      token,
    }),

  getGymAnalytics: (gymId: string, token: string, period?: string) =>
    fetchApi(`/analytics/gym/${gymId}${period ? `?period=${period}` : ''}`, {
      token,
    }),
};

// Admin API
export const adminApi = {
  getStats: (token: string) =>
    fetchApi('/admin/stats', {
      token,
    }),

  getUsers: (token: string, params?: Record<string, string>) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return fetchApi(`/admin/users${queryString}`, {
      token,
    });
  },

  updateUser: (id: string, data: any, token: string) =>
    fetchApi(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  getGyms: (token: string, params?: Record<string, string>) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return fetchApi(`/admin/gyms${queryString}`, {
      token,
    });
  },

  createGym: (data: any, token: string) =>
    fetchApi('/admin/gyms', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  updateGym: (id: string, data: any, token: string) =>
    fetchApi(`/admin/gyms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  getGymMembers: (id: string, token: string, params?: Record<string, string>) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return fetchApi(`/admin/gyms/${id}/members${queryString}`, {
      token,
    });
  },

  getRevenueReport: (token: string, params?: Record<string, string>) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return fetchApi(`/admin/reports/revenue${queryString}`, {
      token,
    });
  },
};
