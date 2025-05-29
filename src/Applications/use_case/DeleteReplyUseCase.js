class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId, commentId, replyId, owner) {
    if (!threadId || typeof threadId !== "string" || threadId.trim() === "") {
      throw new Error("INVALID_THREAD_ID");
    }
    if (
      !commentId ||
      typeof commentId !== "string" ||
      commentId.trim() === ""
    ) {
      throw new Error("INVALID_COMMENT_ID");
    }
    if (!replyId || typeof replyId !== "string" || replyId.trim() === "") {
      throw new Error("INVALID_REPLY_ID");
    }
    if (!owner || typeof owner !== "string" || owner.trim() === "") {
      throw new Error("INVALID_OWNER");
    }

    await this._threadRepository.verifyThreadExists(threadId); // Pastikan thread ada
    await this._commentRepository.verifyCommentExists(commentId); // Pastikan komentar ada
    await this._replyRepository.verifyReplyExists(replyId); // Pastikan balasan ada
    await this._replyRepository.verifyReplyOwner(replyId, owner); // Pastikan owner adalah pemilik balasan
    await this._replyRepository.deleteReply(replyId); // Lakukan soft delete
  }
}

module.exports = DeleteReplyUseCase;
