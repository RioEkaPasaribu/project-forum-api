const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  let deleteCommentUseCase;
  let mockThreadRepository;
  let mockCommentRepository;

  beforeEach(() => {
    mockThreadRepository = {
      verifyThreadExists: jest.fn(),
    };
    mockCommentRepository = {
      verifyCommentExists: jest.fn(),
      verifyCommentOwner: jest.fn(),
      deleteComment: jest.fn(),
    };

    deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
  });

  describe("execute function", () => {
    it("should orchestrate delete comment action correctly", async () => {
      // Arrange
      const threadId = "thread-123";
      const commentId = "comment-123";
      const owner = "user-123";

      mockThreadRepository.verifyThreadExists.mockResolvedValue();
      mockCommentRepository.verifyCommentExists.mockResolvedValue();
      mockCommentRepository.verifyCommentOwner.mockResolvedValue();
      mockCommentRepository.deleteComment.mockResolvedValue();

      // Action
      const result = await deleteCommentUseCase.execute(
        threadId,
        commentId,
        owner
      );

      // Assert - Verifikasi urutan pemanggilan fungsi
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(
        threadId
      );
      expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(
        commentId
      );
      expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(
        commentId,
        owner
      );
      expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
        commentId
      );

      // Deep assertion untuk nilai kembalian
      // Jika DeleteCommentUseCase mengembalikan undefined/void
      expect(result).toBeUndefined();

      // Verifikasi bahwa semua fungsi dipanggil tepat satu kali
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledTimes(
        1
      );
      expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.deleteComment).toHaveBeenCalledTimes(1);
    });

    it("should throw error when thread does not exist", async () => {
      // Arrange
      const threadId = "thread-123";
      const commentId = "comment-123";
      const owner = "user-123";

      mockThreadRepository.verifyThreadExists.mockRejectedValue(
        new Error("Thread not found")
      );

      // Action & Assert
      await expect(
        deleteCommentUseCase.execute(threadId, commentId, owner)
      ).rejects.toThrow("Thread not found");
      expect(mockCommentRepository.verifyCommentExists).not.toHaveBeenCalled();
      expect(mockCommentRepository.deleteComment).not.toHaveBeenCalled();
    });

    it("should throw error when comment does not exist", async () => {
      // Arrange
      const threadId = "thread-123";
      const commentId = "comment-123";
      const owner = "user-123";

      mockThreadRepository.verifyThreadExists.mockResolvedValue();
      mockCommentRepository.verifyCommentExists.mockRejectedValue(
        new Error("Comment not found")
      );

      // Action & Assert
      await expect(
        deleteCommentUseCase.execute(threadId, commentId, owner)
      ).rejects.toThrow("Comment not found");
      expect(mockCommentRepository.verifyCommentOwner).not.toHaveBeenCalled();
      expect(mockCommentRepository.deleteComment).not.toHaveBeenCalled();
    });

    it("should throw error when user is not comment owner", async () => {
      // Arrange
      const threadId = "thread-123";
      const commentId = "comment-123";
      const owner = "user-123";

      mockThreadRepository.verifyThreadExists.mockResolvedValue();
      mockCommentRepository.verifyCommentExists.mockResolvedValue();
      mockCommentRepository.verifyCommentOwner.mockRejectedValue(
        new Error("Not authorized")
      );

      // Action & Assert
      await expect(
        deleteCommentUseCase.execute(threadId, commentId, owner)
      ).rejects.toThrow("Not authorized");
      expect(mockCommentRepository.deleteComment).not.toHaveBeenCalled();
    });
  });
});
