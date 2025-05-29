const AddedReply = require("../../Domains/threads/entities/AddedReply");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class PostgresReplyRepository {
  constructor(pool, idGenerator) {
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply, commentId, owner) {
    const { content } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date(); // Store as Date object, bukan ISO string

    const query = {
      text: "INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
      values: [id, commentId, content, owner, date],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async verifyReplyExists(replyId) {
    const query = {
      text: "SELECT id FROM replies WHERE id = $1",
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Balasan tidak ditemukan");
    }
  }

  async verifyReplyOwner(replyId, owner) {
    const query = {
      text: "SELECT id FROM replies WHERE id = $1 AND owner = $2",
      values: [replyId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError("Anda tidak berhak menghapus balasan ini");
    }
  }

  async deleteReply(replyId) {
    const query = {
      text: "UPDATE replies SET is_delete = TRUE WHERE id = $1",
      values: [replyId],
    };

    await this._pool.query(query);
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `
        SELECT
          replies.id,
          users.username,
          replies.date,
          replies.content,
          COALESCE(replies.is_delete, FALSE) as is_delete
        FROM replies
        LEFT JOIN users ON replies.owner = users.id
        WHERE replies.comment_id = $1
        ORDER BY replies.date ASC
      `,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    // Repository HANYA mengembalikan raw data dari database
    // TIDAK ada formatting, transformasi, atau business logic
    return result.rows;
  }
}

module.exports = PostgresReplyRepository;
