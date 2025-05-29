const routes = (handler) => [
  {
    method: "POST",
    path: "/threads",
    handler: handler.postThreadHandler,
    options: {
      auth: "forumapi_jwt", // Membutuhkan autentikasi JWT
    },
  },
  {
    method: "GET",
    path: "/threads/{threadId}",
    handler: handler.getThreadDetailHandler,
    // Tidak memerlukan autentikasi karena ini adalah resource terbuka
  },
];

module.exports = routes;
