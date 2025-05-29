class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId, commentId, owner) {
    await this._threadRepository.verifyThreadExists(threadId); // Pastikan thread ada
    await this._commentRepository.verifyCommentExists(commentId); // Pastikan komentar ada
    await this._commentRepository.verifyCommentOwner(commentId, owner); // Pastikan owner adalah pemilik komentar
    await this._commentRepository.deleteComment(commentId); // Lakukan soft delete
  }
}

module.exports = DeleteCommentUseCase;
