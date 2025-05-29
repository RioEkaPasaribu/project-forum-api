const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const { threadId } = request.params; // Mendapatkan threadId dari parameter URL
    const { id: owner } = request.auth.credentials; // Mendapatkan ID pemilik dari access token
    const addedComment = await addCommentUseCase.execute(
      request.payload,
      threadId,
      owner
    );

    const response = h.response({
      status: "success",
      data: {
        addedComment,
      },
    });
    response.code(201); // Status Code 201 Created
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    const { threadId, commentId } = request.params; // Mendapatkan threadId dan commentId dari parameter URL
    const { id: owner } = request.auth.credentials; // Mendapatkan ID pemilik dari access token
    await deleteCommentUseCase.execute(threadId, commentId, owner); // Menjalankan use case untuk menghapus komentar

    return h.response({
      status: "success",
    });
  }
}

module.exports = CommentsHandler;
