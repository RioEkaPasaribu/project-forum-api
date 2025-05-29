const NewReply = require("../../Domains/threads/entities/NewReply"); // Import NewReply
const AddedReply = require("../../Domains/threads/entities/AddedReply");

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, threadId, commentId, owner) {
    if (!threadId) {
      throw new Error("THREAD_ID_REQUIRED"); // Or a more specific error
    }
    if (!commentId) {
      throw new Error("COMMENT_ID_REQUIRED"); // Or a more specific error
    }
    if (!owner) {
      throw new Error("OWNER_REQUIRED"); // Or a more specific error
    }

    await this._threadRepository.verifyThreadExists(threadId); // Pastikan thread ada
    await this._commentRepository.verifyCommentExists(commentId); // Pastikan komentar ada
    const newReply = new NewReply(useCasePayload); // Validasi payload
    const addedReply = await this._replyRepository.addReply(
      newReply,
      commentId,
      owner
    ); // Panggil repository
    return new AddedReply(addedReply); // Kembalikan objek AddedReply
  }
}

module.exports = AddReplyUseCase;
