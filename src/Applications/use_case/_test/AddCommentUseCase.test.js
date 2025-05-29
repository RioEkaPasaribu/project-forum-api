const AddCommentUseCase = require("../AddCommentUseCase");
const NewComment = require("../../../Domains/threads/entities/NewComment");
const AddedComment = require("../../../Domains/threads/entities/AddedComment");

describe("AddCommentUseCase", () => {
  let addCommentUseCase;
  let mockThreadRepository;
  let mockCommentRepository;

  beforeEach(() => {
    mockThreadRepository = {
      verifyThreadExists: jest.fn(),
    };
    mockCommentRepository = {
      addComment: jest.fn(),
    };

    addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
  });

  describe("execute function", () => {
    it("should orchestrate add comment action correctly", async () => {
      // Arrange
      const useCasePayload = { content: "Test comment" };
      const threadId = "thread-123";
      const owner = "user-123";
      const expectedAddedComment = {
        id: "comment-123",
        content: "Test comment",
        owner: "user-123",
      };

      mockThreadRepository.verifyThreadExists.mockResolvedValue();
      mockCommentRepository.addComment.mockResolvedValue(expectedAddedComment);

      // Action
      const result = await addCommentUseCase.execute(
        useCasePayload,
        threadId,
        owner
      );

      // Assert - Deep assertion on return value
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(
        threadId
      );
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
        expect.any(NewComment),
        threadId,
        owner
      );
      expect(mockCommentRepository.addComment).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(AddedComment);
      expect(result.id).toBe(expectedAddedComment.id);
      expect(result.content).toBe(expectedAddedComment.content);
      expect(result.owner).toBe(expectedAddedComment.owner);
    });

    it("should throw error when thread does not exist", async () => {
      // Arrange
      const useCasePayload = { content: "Test comment" };
      const threadId = "thread-123";
      const owner = "user-123";

      mockThreadRepository.verifyThreadExists.mockRejectedValue(
        new Error("Thread not found")
      );

      // Action & Assert
      await expect(
        addCommentUseCase.execute(useCasePayload, threadId, owner)
      ).rejects.toThrow("Thread not found");

      // Verify function calls
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(
        threadId
      );
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.addComment).not.toHaveBeenCalled();
    });

    it("should throw error when payload is invalid", async () => {
      // Arrange
      const useCasePayload = {}; // Invalid payload
      const threadId = "thread-123";
      const owner = "user-123";

      mockThreadRepository.verifyThreadExists.mockResolvedValue();

      // Action & Assert
      await expect(
        addCommentUseCase.execute(useCasePayload, threadId, owner)
      ).rejects.toThrow();

      // Verify function calls - thread verification should happen first
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(
        threadId
      );
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.addComment).not.toHaveBeenCalled();
    });

    it("should throw error when repository fails to add comment", async () => {
      // Arrange
      const useCasePayload = { content: "Test comment" };
      const threadId = "thread-123";
      const owner = "user-123";

      mockThreadRepository.verifyThreadExists.mockResolvedValue();
      mockCommentRepository.addComment.mockRejectedValue(
        new Error("Database error")
      );

      // Action & Assert
      await expect(
        addCommentUseCase.execute(useCasePayload, threadId, owner)
      ).rejects.toThrow("Database error");

      // Verify all function calls were made
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(
        threadId
      );
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledTimes(1);
      expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
        expect.any(NewComment),
        threadId,
        owner
      );
      expect(mockCommentRepository.addComment).toHaveBeenCalledTimes(1);
    });

    it("should throw error when threadId is invalid", async () => {
      // Arrange
      const useCasePayload = { content: "Test comment" };
      const owner = "user-123";

      // Action & Assert - null threadId
      await expect(
        addCommentUseCase.execute(useCasePayload, null, owner)
      ).rejects.toThrow();

      // Action & Assert - empty threadId
      await expect(
        addCommentUseCase.execute(useCasePayload, "", owner)
      ).rejects.toThrow();

      // Action & Assert - non-string threadId
      await expect(
        addCommentUseCase.execute(useCasePayload, 123, owner)
      ).rejects.toThrow();

      // Verify no repository calls were made for invalid inputs
      expect(mockThreadRepository.verifyThreadExists).not.toHaveBeenCalled();
      expect(mockCommentRepository.addComment).not.toHaveBeenCalled();
    });

    it("should throw error when owner is invalid", async () => {
      // Arrange
      const useCasePayload = { content: "Test comment" };
      const threadId = "thread-123";

      // Action & Assert - null owner
      await expect(
        addCommentUseCase.execute(useCasePayload, threadId, null)
      ).rejects.toThrow();

      // Action & Assert - empty owner
      await expect(
        addCommentUseCase.execute(useCasePayload, threadId, "")
      ).rejects.toThrow();

      // Verify no repository calls were made for invalid inputs
      expect(mockThreadRepository.verifyThreadExists).not.toHaveBeenCalled();
      expect(mockCommentRepository.addComment).not.toHaveBeenCalled();
    });
  });
});
