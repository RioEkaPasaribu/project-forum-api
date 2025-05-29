const DeleteReplyUseCase = require("../DeleteReplyUseCase");

describe("DeleteReplyUseCase", () => {
  let deleteReplyUseCase;
  let mockThreadRepository;
  let mockCommentRepository;
  let mockReplyRepository;

  beforeEach(() => {
    mockThreadRepository = {
      verifyThreadExists: jest.fn(),
    };
    mockCommentRepository = {
      verifyCommentExists: jest.fn(),
    };
    mockReplyRepository = {
      verifyReplyExists: jest.fn(),
      verifyReplyOwner: jest.fn(),
      deleteReply: jest.fn(),
    };

    deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
  });

  describe("execute function", () => {
    it("should orchestrate delete reply action correctly", async () => {
      // Arrange
      const threadId = "thread-123";
      const commentId = "comment-123";
      const replyId = "reply-123";
      const owner = "user-123";

      mockThreadRepository.verifyThreadExists.mockResolvedValue();
      mockCommentRepository.verifyCommentExists.mockResolvedValue();
      mockReplyRepository.verifyReplyExists.mockResolvedValue();
      mockReplyRepository.verifyReplyOwner.mockResolvedValue();
      mockReplyRepository.deleteReply.mockResolvedValue();

      // Action
      const result = await deleteReplyUseCase.execute(
        threadId,
        commentId,
        replyId,
        owner
      );

      // Assert - Verify all function calls with correct parameters and call counts
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(
        threadId
      );
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(
        commentId
      );
      expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledTimes(
        1
      );
      expect(mockReplyRepository.verifyReplyExists).toHaveBeenCalledWith(
        replyId
      );
      expect(mockReplyRepository.verifyReplyExists).toHaveBeenCalledTimes(1);
      expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(
        replyId,
        owner
      );
      expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledTimes(1);
      expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(replyId);
      expect(mockReplyRepository.deleteReply).toHaveBeenCalledTimes(1);

      // Assert return value - should be undefined or void for delete operations
      expect(result).toBeUndefined();
    });

    it("should throw error when thread does not exist", async () => {
      // Arrange
      const threadId = "thread-123";
      const commentId = "comment-123";
      const replyId = "reply-123";
      const owner = "user-123";

      mockThreadRepository.verifyThreadExists.mockRejectedValue(
        new Error("Thread not found")
      );

      // Action & Assert
      await expect(
        deleteReplyUseCase.execute(threadId, commentId, replyId, owner)
      ).rejects.toThrow("Thread not found");

      // Verify function calls - only thread verification should be called
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(
        threadId
      );
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.verifyCommentExists).not.toHaveBeenCalled();
      expect(mockReplyRepository.verifyReplyExists).not.toHaveBeenCalled();
      expect(mockReplyRepository.verifyReplyOwner).not.toHaveBeenCalled();
      expect(mockReplyRepository.deleteReply).not.toHaveBeenCalled();
    });

    it("should throw error when comment does not exist", async () => {
      // Arrange
      const threadId = "thread-123";
      const commentId = "comment-123";
      const replyId = "reply-123";
      const owner = "user-123";

      mockThreadRepository.verifyThreadExists.mockResolvedValue();
      mockCommentRepository.verifyCommentExists.mockRejectedValue(
        new Error("Comment not found")
      );

      // Action & Assert
      await expect(
        deleteReplyUseCase.execute(threadId, commentId, replyId, owner)
      ).rejects.toThrow("Comment not found");

      // Verify function calls - thread and comment verification should be called
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(
        threadId
      );
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(
        commentId
      );
      expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledTimes(
        1
      );
      expect(mockReplyRepository.verifyReplyExists).not.toHaveBeenCalled();
      expect(mockReplyRepository.verifyReplyOwner).not.toHaveBeenCalled();
      expect(mockReplyRepository.deleteReply).not.toHaveBeenCalled();
    });

    it("should throw error when reply does not exist", async () => {
      // Arrange
      const threadId = "thread-123";
      const commentId = "comment-123";
      const replyId = "reply-123";
      const owner = "user-123";

      mockThreadRepository.verifyThreadExists.mockResolvedValue();
      mockCommentRepository.verifyCommentExists.mockResolvedValue();
      mockReplyRepository.verifyReplyExists.mockRejectedValue(
        new Error("Reply not found")
      );

      // Action & Assert
      await expect(
        deleteReplyUseCase.execute(threadId, commentId, replyId, owner)
      ).rejects.toThrow("Reply not found");

      // Verify function calls - should call up to reply verification
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(
        threadId
      );
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(
        commentId
      );
      expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledTimes(
        1
      );
      expect(mockReplyRepository.verifyReplyExists).toHaveBeenCalledWith(
        replyId
      );
      expect(mockReplyRepository.verifyReplyExists).toHaveBeenCalledTimes(1);
      expect(mockReplyRepository.verifyReplyOwner).not.toHaveBeenCalled();
      expect(mockReplyRepository.deleteReply).not.toHaveBeenCalled();
    });

    it("should throw error when user is not reply owner", async () => {
      // Arrange
      const threadId = "thread-123";
      const commentId = "comment-123";
      const replyId = "reply-123";
      const owner = "user-123";

      mockThreadRepository.verifyThreadExists.mockResolvedValue();
      mockCommentRepository.verifyCommentExists.mockResolvedValue();
      mockReplyRepository.verifyReplyExists.mockResolvedValue();
      mockReplyRepository.verifyReplyOwner.mockRejectedValue(
        new Error("Not authorized")
      );

      // Action & Assert
      await expect(
        deleteReplyUseCase.execute(threadId, commentId, replyId, owner)
      ).rejects.toThrow("Not authorized");

      // Verify function calls - should call all verification methods but not delete
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(
        threadId
      );
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledWith(
        commentId
      );
      expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledTimes(
        1
      );
      expect(mockReplyRepository.verifyReplyExists).toHaveBeenCalledWith(
        replyId
      );
      expect(mockReplyRepository.verifyReplyExists).toHaveBeenCalledTimes(1);
      expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(
        replyId,
        owner
      );
      expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledTimes(1);
      expect(mockReplyRepository.deleteReply).not.toHaveBeenCalled();
    });

    it("should throw error when repository delete fails", async () => {
      // Arrange
      const threadId = "thread-123";
      const commentId = "comment-123";
      const replyId = "reply-123";
      const owner = "user-123";

      mockThreadRepository.verifyThreadExists.mockResolvedValue();
      mockCommentRepository.verifyCommentExists.mockResolvedValue();
      mockReplyRepository.verifyReplyExists.mockResolvedValue();
      mockReplyRepository.verifyReplyOwner.mockResolvedValue();
      mockReplyRepository.deleteReply.mockRejectedValue(
        new Error("Database error")
      );

      // Action & Assert
      await expect(
        deleteReplyUseCase.execute(threadId, commentId, replyId, owner)
      ).rejects.toThrow("Database error");

      // Verify all function calls were made
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledTimes(
        1
      );
      expect(mockReplyRepository.verifyReplyExists).toHaveBeenCalledTimes(1);
      expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledTimes(1);
      expect(mockReplyRepository.deleteReply).toHaveBeenCalledTimes(1);
    });

    it("should throw error when parameters are invalid", async () => {
      // Action & Assert - invalid parameters
      await expect(
        deleteReplyUseCase.execute(null, "comment-123", "reply-123", "user-123")
      ).rejects.toThrow();

      await expect(
        deleteReplyUseCase.execute("thread-123", null, "reply-123", "user-123")
      ).rejects.toThrow();

      await expect(
        deleteReplyUseCase.execute(
          "thread-123",
          "comment-123",
          null,
          "user-123"
        )
      ).rejects.toThrow();

      await expect(
        deleteReplyUseCase.execute(
          "thread-123",
          "comment-123",
          "reply-123",
          null
        )
      ).rejects.toThrow();

      // Verify no repository calls were made for invalid inputs
      expect(mockThreadRepository.verifyThreadExists).not.toHaveBeenCalled();
      expect(mockCommentRepository.verifyCommentExists).not.toHaveBeenCalled();
      expect(mockReplyRepository.verifyReplyExists).not.toHaveBeenCalled();
      expect(mockReplyRepository.verifyReplyOwner).not.toHaveBeenCalled();
      expect(mockReplyRepository.deleteReply).not.toHaveBeenCalled();
    });
  });
});
