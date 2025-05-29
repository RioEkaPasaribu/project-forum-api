const AddReplyUseCase = require("../AddReplyUseCase");
const NewReply = require("../../../Domains/threads/entities/NewReply");
const AddedReply = require("../../../Domains/threads/entities/AddedReply");

describe("AddReplyUseCase", () => {
  let addReplyUseCase;
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
      addReply: jest.fn(),
    };

    addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
  });

  describe("execute function", () => {
    it("should orchestrate add reply action correctly", async () => {
      // Arrange
      const useCasePayload = { content: "Test reply" };
      const threadId = "thread-123";
      const commentId = "comment-123";
      const owner = "user-123";
      const expectedAddedReply = {
        id: "reply-123",
        content: "Test reply",
        owner: "user-123",
      };

      mockThreadRepository.verifyThreadExists.mockResolvedValue();
      mockCommentRepository.verifyCommentExists.mockResolvedValue();
      mockReplyRepository.addReply.mockResolvedValue(expectedAddedReply);

      // Action
      const result = await addReplyUseCase.execute(
        useCasePayload,
        threadId,
        commentId,
        owner
      );

      // Assert - Deep assertion on return value and all function calls
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
      expect(mockReplyRepository.addReply).toHaveBeenCalledWith(
        expect.any(NewReply),
        commentId,
        owner
      );
      expect(mockReplyRepository.addReply).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(AddedReply);
      expect(result.id).toBe(expectedAddedReply.id);
      expect(result.content).toBe(expectedAddedReply.content);
      expect(result.owner).toBe(expectedAddedReply.owner);
    });

    it("should throw error when thread does not exist", async () => {
      // Arrange
      const useCasePayload = { content: "Test reply" };
      const threadId = "thread-123";
      const commentId = "comment-123";
      const owner = "user-123";

      mockThreadRepository.verifyThreadExists.mockRejectedValue(
        new Error("Thread not found")
      );

      // Action & Assert
      await expect(
        addReplyUseCase.execute(useCasePayload, threadId, commentId, owner)
      ).rejects.toThrow("Thread not found");

      // Verify function calls - only thread verification should be called
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(
        threadId
      );
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.verifyCommentExists).not.toHaveBeenCalled();
      expect(mockReplyRepository.addReply).not.toHaveBeenCalled();
    });

    it("should throw error when comment does not exist", async () => {
      // Arrange
      const useCasePayload = { content: "Test reply" };
      const threadId = "thread-123";
      const commentId = "comment-123";
      const owner = "user-123";

      mockThreadRepository.verifyThreadExists.mockResolvedValue();
      mockCommentRepository.verifyCommentExists.mockRejectedValue(
        new Error("Comment not found")
      );

      // Action & Assert
      await expect(
        addReplyUseCase.execute(useCasePayload, threadId, commentId, owner)
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
      expect(mockReplyRepository.addReply).not.toHaveBeenCalled();
    });

    it("should throw error when payload is invalid", async () => {
      // Arrange
      const useCasePayload = {}; // Invalid payload
      const threadId = "thread-123";
      const commentId = "comment-123";
      const owner = "user-123";

      mockThreadRepository.verifyThreadExists.mockResolvedValue();
      mockCommentRepository.verifyCommentExists.mockResolvedValue();

      // Action & Assert
      await expect(
        addReplyUseCase.execute(useCasePayload, threadId, commentId, owner)
      ).rejects.toThrow();

      // Verify function calls - verifications should pass but addReply should not be called
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
      expect(mockReplyRepository.addReply).not.toHaveBeenCalled();
    });

    it("should throw error when repository fails to add reply", async () => {
      // Arrange
      const useCasePayload = { content: "Test reply" };
      const threadId = "thread-123";
      const commentId = "comment-123";
      const owner = "user-123";

      mockThreadRepository.verifyThreadExists.mockResolvedValue();
      mockCommentRepository.verifyCommentExists.mockResolvedValue();
      mockReplyRepository.addReply.mockRejectedValue(
        new Error("Database error")
      );

      // Action & Assert
      await expect(
        addReplyUseCase.execute(useCasePayload, threadId, commentId, owner)
      ).rejects.toThrow("Database error");

      // Verify all function calls were made
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.verifyCommentExists).toHaveBeenCalledTimes(
        1
      );
      expect(mockReplyRepository.addReply).toHaveBeenCalledTimes(1);
    });

    it("should throw error when parameters are invalid", async () => {
      // Action & Assert - invalid threadId
      await expect(
        addReplyUseCase.execute(
          { content: "Test" },
          null,
          "comment-123",
          "user-123"
        )
      ).rejects.toThrow();

      // Action & Assert - invalid commentId
      await expect(
        addReplyUseCase.execute(
          { content: "Test" },
          "thread-123",
          null,
          "user-123"
        )
      ).rejects.toThrow();

      // Action & Assert - invalid owner
      await expect(
        addReplyUseCase.execute(
          { content: "Test" },
          "thread-123",
          "comment-123",
          null
        )
      ).rejects.toThrow();

      // Verify no repository calls were made for invalid inputs
      expect(mockThreadRepository.verifyThreadExists).not.toHaveBeenCalled();
      expect(mockCommentRepository.verifyCommentExists).not.toHaveBeenCalled();
      expect(mockReplyRepository.addReply).not.toHaveBeenCalled();
    });
  });
});
