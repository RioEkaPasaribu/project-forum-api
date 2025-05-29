const AddedComment = require("../../Domains/threads/entities/AddedComment");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class PostgresCommentRepository {
  constructor(pool, idGenerator) {
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment, threadId, owner) {
    const { content } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    // Schema: id, thread_id, content, owner, date, is_delete
    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner",
      values: [id, threadId, content, owner, date, false],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async verifyCommentExists(commentId) {
    const query = {
      text: "SELECT id FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Komentar tidak ditemukan");
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: "SELECT owner FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Komentar tidak ditemukan");
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: "UPDATE comments SET is_delete = true WHERE id = $1",
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT
          comments.id,
          users.username,
          comments.date,
          comments.content,
          comments.is_delete
        FROM comments
        LEFT JOIN users ON comments.owner = users.id
        WHERE comments.thread_id = $1
        ORDER BY comments.date ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    // Repository only returns raw data - no formatting or business logic
    return result.rows;
  }
}

module.exports = PostgresCommentRepository;
