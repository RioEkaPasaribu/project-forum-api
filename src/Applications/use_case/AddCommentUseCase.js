const NewComment = require("../../Domains/threads/entities/NewComment"); // Correct import path
const AddedComment = require("../../Domains/threads/entities/AddedComment"); // Correct import path

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, threadId, owner) {
    if (!threadId || typeof threadId !== "string" || threadId.trim() === "") {
      throw new Error("INVALID_THREAD_ID"); // Or a more specific error
    }
    if (!owner || typeof owner !== "string" || owner.trim() === "") {
      throw new Error("INVALID_OWNER"); // Or a more specific error
    }

    await this._threadRepository.verifyThreadExists(threadId); // Pastikan thread ada
    const newComment = new NewComment(useCasePayload); // Validasi payload
    const addedComment = await this._commentRepository.addComment(
      newComment,
      threadId,
      owner
    ); // Panggil repository
    return new AddedComment(addedComment); // Kembalikan objek AddedComment
  }
}

module.exports = AddCommentUseCase;
