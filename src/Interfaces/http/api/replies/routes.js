const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{threadId}/comments/{commentId}/replies",
    handler: handler.postReplyHandler,
    options: {
      auth: "forumapi_jwt", // Membutuhkan autentikasi JWT
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}/replies/{replyId}",
    handler: handler.deleteReplyHandler,
    options: {
      auth: "forumapi_jwt", // Membutuhkan autentikasi JWT
    },
  },
];

module.exports = routes;
