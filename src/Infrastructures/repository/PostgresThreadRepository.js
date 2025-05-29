const AddedThread = require("../../Domains/threads/entities/AddedThread");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class PostgresThreadRepository {
  constructor(pool, idGenerator) {
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread, owner) {
    const { title, body } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date(); // Store as Date object, formatting moved to domain

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner",
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async verifyThreadExists(threadId) {
    const query = {
      text: "SELECT id FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Thread tidak ditemukan");
    }
  }

  async getThreadById(threadId) {
    const query = {
      text: `
        SELECT
          threads.id,
          threads.title,
          threads.body,
          threads.date,
          users.username
        FROM threads
        LEFT JOIN users ON threads.owner = users.id
        WHERE threads.id = $1
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Thread tidak ditemukan");
    }

    // Return raw data tanpa formatting - domain layer yang akan handle
    return result.rows[0];
  }
}

module.exports = PostgresThreadRepository;
