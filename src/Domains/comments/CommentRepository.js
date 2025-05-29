class CommentRepository {
  /**
   * Menambahkan komentar baru ke thread.
   * @param {object} newComment - Objek NewComment yang berisi content.
   * @param {string} threadId - ID thread tempat komentar ditambahkan.
   * @param {string} owner - ID pemilik komentar.
   * @returns {Promise<object>} - Objek AddedComment yang berisi id, content, dan owner.
   */
  async addComment(newComment, threadId, owner) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Memverifikasi keberadaan komentar berdasarkan ID.
   * Akan melempar NotFoundError jika komentar tidak ditemukan.
   * @param {string} commentId - ID komentar yang akan diverifikasi.
   * @returns {Promise<void>}
   */
  async verifyCommentExists(commentId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Memverifikasi apakah pengguna adalah pemilik komentar.
   * Akan melempar AuthorizationError jika bukan pemilik.
   * @param {string} commentId - ID komentar.
   * @param {string} owner - ID pengguna yang mencoba menghapus.
   * @returns {Promise<void>}
   */
  async verifyCommentOwner(commentId, owner) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Melakukan soft delete pada komentar.
   * @param {string} commentId - ID komentar yang akan dihapus.
   * @returns {Promise<void>}
   */
  async deleteComment(commentId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Mendapatkan daftar komentar untuk thread tertentu.
   * Komentar yang dihapus akan memiliki konten "**komentar telah dihapus**".
   * @param {string} threadId - ID thread.
   * @returns {Promise<Array<object>>} - Array objek komentar.
   */
  async getCommentsByThreadId(threadId) {
    throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = CommentRepository;
