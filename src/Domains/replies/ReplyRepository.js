class ReplyRepository {
  /**
   * Menambahkan balasan baru ke komentar.
   * @param {object} newReply - Objek NewReply yang berisi content.
   * @param {string} commentId - ID komentar tempat balasan ditambahkan.
   * @param {string} owner - ID pemilik balasan.
   * @returns {Promise<object>} - Objek AddedReply yang berisi id, content, dan owner.
   */
  async addReply(newReply, commentId, owner) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Memverifikasi keberadaan balasan berdasarkan ID.
   * Akan melempar NotFoundError jika balasan tidak ditemukan.
   * @param {string} replyId - ID balasan yang akan diverifikasi.
   * @returns {Promise<void>}
   */
  async verifyReplyExists(replyId) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Memverifikasi apakah pengguna adalah pemilik balasan.
   * Akan melempar AuthorizationError jika bukan pemilik.
   * @param {string} replyId - ID balasan.
   * @param {string} owner - ID pengguna yang mencoba menghapus.
   * @returns {Promise<void>}
   */
  async verifyReplyOwner(replyId, owner) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Melakukan soft delete pada balasan.
   * @param {string} replyId - ID balasan yang akan dihapus.
   * @returns {Promise<void>}
   */
  async deleteReply(replyId) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Mendapatkan daftar balasan untuk komentar tertentu.
   * Balasan yang dihapus akan memiliki konten "**balasan telah dihapus**".
   * @param {string} commentId - ID komentar.
   * @returns {Promise<Array<object>>} - Array objek balasan.
   */
  async getRepliesByCommentId(commentId) {
    throw new Error("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ReplyRepository;
