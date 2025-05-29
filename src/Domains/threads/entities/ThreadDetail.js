const InvariantError = require("../../../Commons/exceptions/InvariantError");

class ThreadDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, body, date, username, comments } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    // Formatting logic dipindahkan ke domain entity
    this.date = this._formatDate(date);
    this.username = username;

    // Only set comments if it's explicitly provided and not undefined
    if (comments !== undefined) {
      this.comments = comments;
    }
    // If comments is undefined, don't set the property at all
  }

  _formatDate(date) {
    // Domain logic untuk formatting date
    if (date instanceof Date) {
      return date.toISOString();
    }
    if (typeof date === "string") {
      return date;
    }
    throw new InvariantError("Invalid date format");
  }

  _verifyPayload({ id, title, body, date, username, comments }) {
    if (!id || !title || !body || !date || !username) {
      throw new InvariantError("THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof title !== "string" ||
      typeof body !== "string" ||
      typeof username !== "string"
    ) {
      throw new InvariantError(
        "THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }

    // Comments bisa kosong array atau undefined
    if (comments && !Array.isArray(comments)) {
      throw new InvariantError(
        "THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }

    // Validasi comments jika ada
    if (comments && comments.length > 0) {
      this._validateComments(comments);
    }
  }

  _validateComments(comments) {
    comments.forEach((comment) => {
      if (
        !comment.id ||
        !comment.username ||
        !comment.date ||
        !comment.content
      ) {
        throw new InvariantError(
          "THREAD_DETAIL.COMMENT_NOT_CONTAIN_NEEDED_PROPERTY"
        );
      }
      if (
        typeof comment.id !== "string" ||
        typeof comment.username !== "string" ||
        typeof comment.date !== "string" ||
        typeof comment.content !== "string"
      ) {
        throw new InvariantError(
          "THREAD_DETAIL.COMMENT_NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
      }

      // Validasi balasan jika ada
      if (comment.replies && comment.replies.length > 0) {
        this._validateReplies(comment.replies);
      }
    });
  }

  _validateReplies(replies) {
    if (!Array.isArray(replies)) {
      throw new InvariantError(
        "THREAD_DETAIL.REPLIES_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }

    replies.forEach((reply) => {
      if (!reply.id || !reply.username || !reply.date || !reply.content) {
        throw new InvariantError(
          "THREAD_DETAIL.REPLY_NOT_CONTAIN_NEEDED_PROPERTY"
        );
      }
      if (
        typeof reply.id !== "string" ||
        typeof reply.username !== "string" ||
        typeof reply.date !== "string" ||
        typeof reply.content !== "string"
      ) {
        throw new InvariantError(
          "THREAD_DETAIL.REPLY_NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
      }
    });
  }
}

module.exports = ThreadDetail;
