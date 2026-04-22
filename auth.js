// ── Hope in Every Drop · Shared Auth & Data Layer ──────────────────────────

const DB = {
  getUsers: () => JSON.parse(localStorage.getItem('hied_users') || '[]'),
  setUsers: (u) => localStorage.setItem('hied_users', JSON.stringify(u)),

  getDonors: () => JSON.parse(localStorage.getItem('hied_donors') || '[]'),
  setDonors: (d) => localStorage.setItem('hied_donors', JSON.stringify(d)),

  getSession: () => JSON.parse(localStorage.getItem('hied_session') || 'null'),
  setSession: (s) => localStorage.setItem('hied_session', JSON.stringify(s)),
  clearSession: () => localStorage.removeItem('hied_session'),
};

const Auth = {
  register(name, email, password, age, blood, city, phone) {
    const users = DB.getUsers();
    if (users.find(u => u.email === email)) return { ok: false, msg: 'Email already registered.' };
    const id = 'u_' + Date.now();
    const user = { id, name, email, password, age, blood, city, phone, joinedAt: new Date().toISOString() };
    users.push(user);
    DB.setUsers(users);

    // Add to donor list
    const donors = DB.getDonors();
    donors.push({ userId: id, name, age, blood, city, phone, available: true, donations: 0, lastDonated: null });
    DB.setDonors(donors);

    DB.setSession({ id, name, email, blood, city });
    return { ok: true };
  },

  login(email, password) {
    const users = DB.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, msg: 'Invalid email or password.' };
    DB.setSession({ id: user.id, name: user.name, email: user.email, blood: user.blood, city: user.city });
    return { ok: true };
  },

  logout() {
    DB.clearSession();
    window.location.href = 'index.html';
  },

  requireAuth() {
    if (!DB.getSession()) window.location.href = 'login.html';
  },

  redirectIfAuth() {
    if (DB.getSession()) window.location.href = 'dashboard.html';
  },
};
