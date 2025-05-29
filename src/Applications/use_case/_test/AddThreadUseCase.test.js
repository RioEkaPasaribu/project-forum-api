const AddThreadUseCase = require("../AddThreadUseCase");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");

describe("AddThreadUseCase", () => {
  let addThreadUseCase;
  let mockThreadRepository;

  beforeEach(() => {
    mockThreadRepository = {
      addThread: jest.fn(),
    };

    addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });
  });

  describe("execute function", () => {
    it("should orchestrate add thread action correctly", async () => {
      // Arrange
      const useCasePayload = {
        title: "Test Thread",
        body: "Test thread body",
      };
      const owner = "user-123";
      const expectedAddedThread = {
        id: "thread-123",
        title: "Test Thread",
        // body: "Test thread body", // Removed since AddedThread doesn't have body
        owner: "user-123",
      };

      mockThreadRepository.addThread.mockResolvedValue(expectedAddedThread);

      // Action
      const result = await addThreadUseCase.execute(useCasePayload, owner);

      // Assert - Only check properties that exist in AddedThread entity
      expect(mockThreadRepository.addThread).toHaveBeenCalledWith(
        expect.any(NewThread),
        owner
      );
      expect(mockThreadRepository.addThread).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(AddedThread);
      expect(result.id).toBe(expectedAddedThread.id);
      expect(result.title).toBe(expectedAddedThread.title);
      // expect(result.body).toBe(expectedAddedThread.body); // Removed this assertion
      expect(result.owner).toBe(expectedAddedThread.owner);
    });

    it("should throw error when payload is invalid - missing title", async () => {
      // Arrange
      const useCasePayload = { body: "Test thread body" }; // Missing title
      const owner = "user-123";

      // Action & Assert
      await expect(
        addThreadUseCase.execute(useCasePayload, owner)
      ).rejects.toThrow();
      expect(mockThreadRepository.addThread).not.toHaveBeenCalled();
    });

    it("should throw error when payload is invalid - missing body", async () => {
      // Arrange
      const useCasePayload = { title: "Test Thread" }; // Missing body
      const owner = "user-123";

      // Action & Assert
      await expect(
        addThreadUseCase.execute(useCasePayload, owner)
      ).rejects.toThrow();
      expect(mockThreadRepository.addThread).not.toHaveBeenCalled();
    });

    it("should throw error when payload is empty", async () => {
      // Arrange
      const useCasePayload = {}; // Invalid payload
      const owner = "user-123";

      // Action & Assert
      await expect(
        addThreadUseCase.execute(useCasePayload, owner)
      ).rejects.toThrow();
      expect(mockThreadRepository.addThread).not.toHaveBeenCalled();
    });

    it("should throw error when repository fails", async () => {
      // Arrange
      const useCasePayload = {
        title: "Test Thread",
        body: "Test thread body",
      };
      const owner = "user-123";

      mockThreadRepository.addThread.mockRejectedValue(
        new Error("Database error")
      );

      // Action & Assert
      await expect(
        addThreadUseCase.execute(useCasePayload, owner)
      ).rejects.toThrow("Database error");

      // Verify the repository was called before failing
      expect(mockThreadRepository.addThread).toHaveBeenCalledWith(
        expect.any(NewThread),
        owner
      );
      expect(mockThreadRepository.addThread).toHaveBeenCalledTimes(1);
    });

    it("should throw error when owner is invalid", async () => {
      // Arrange
      const useCasePayload = {
        title: "Test Thread",
        body: "Test thread body",
      };

      // Action & Assert - null owner
      await expect(
        addThreadUseCase.execute(useCasePayload, null)
      ).rejects.toThrow();

      // Action & Assert - empty owner
      await expect(
        addThreadUseCase.execute(useCasePayload, "")
      ).rejects.toThrow();

      // Verify no repository calls were made for invalid inputs
      expect(mockThreadRepository.addThread).not.toHaveBeenCalled();
    });
  });
});
