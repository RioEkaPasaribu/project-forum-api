class ThreadRepository {
  /**
   * Menambahkan thread baru ke database.
   * @param {object} newThread - Objek NewThread yang berisi title dan body.
   * @param {string} owner - ID pemilik thread.
   * @returns {Promise<object>} - Objek AddedThread yang berisi id, title, dan owner.
   */
  async addThread(newThread, owner) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Memverifikasi keberadaan thread berdasarkan ID.
   * Akan melempar NotFoundError jika thread tidak ditemukan.
   * @param {string} threadId - ID thread yang akan diverifikasi.
   * @returns {Promise<void>}
   */
  async verifyThreadExists(threadId) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * Mendapatkan detail thread berdasarkan ID.
   * Akan melempar NotFoundError jika thread tidak ditemukan.
   * @param {string} threadId - ID thread yang akan diambil detailnya.
   * @returns {Promise<object>} - Objek yang berisi id, title, body, date, dan username pemilik.
   */
  async getThreadById(threadId) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ThreadRepository;
