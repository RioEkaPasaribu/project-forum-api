const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{threadId}/comments",
    handler: handler.postCommentHandler,
    options: {
      auth: "forumapi_jwt", // Membutuhkan autentikasi JWT
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}",
    handler: handler.deleteCommentHandler,
    options: {
      auth: "forumapi_jwt", // Membutuhkan autentikasi JWT
    },
  },
];

module.exports = routes;
