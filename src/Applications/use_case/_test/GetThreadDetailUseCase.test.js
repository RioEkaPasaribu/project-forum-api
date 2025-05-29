const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");
const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");
const CommentDetail = require("../../../Domains/threads/entities/CommentDetail");
const ReplyDetail = require("../../../Domains/threads/entities/ReplyDetail");

describe("GetThreadDetailUseCase", () => {
  let getThreadDetailUseCase;
  let mockThreadRepository;
  let mockCommentRepository;
  let mockReplyRepository;

  beforeEach(() => {
    mockThreadRepository = {
      verifyThreadExists: jest.fn(),
      getThreadById: jest.fn(),
    };
    mockCommentRepository = {
      getCommentsByThreadId: jest.fn(),
    };
    mockReplyRepository = {
      getRepliesByCommentId: jest.fn(),
    };

    getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Mock console.log dan console.error untuk menghindari output test
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("execute function", () => {
    it("should orchestrate get thread detail action correctly", async () => {
      // Arrange
      const threadId = "thread-123";
      const mockThreadData = {
        id: "thread-123",
        title: "Test Thread",
        body: "Test body",
        date: "2023-01-01T00:00:00.000Z",
        username: "testuser",
      };
      const mockComments = [
        {
          id: "comment-123",
          username: "commenter",
          date: "2023-01-01T01:00:00.000Z",
          content: "Test comment",
          is_delete: false,
        },
      ];
      const mockReplies = [
        {
          id: "reply-123",
          username: "replier",
          date: new Date("2023-01-01T02:00:00.000Z"),
          content: "Test reply",
          is_delete: false,
        },
      ];

      mockThreadRepository.verifyThreadExists.mockResolvedValue();
      mockThreadRepository.getThreadById.mockResolvedValue(mockThreadData);
      mockCommentRepository.getCommentsByThreadId.mockResolvedValue(
        mockComments
      );
      mockReplyRepository.getRepliesByCommentId.mockResolvedValue(mockReplies);

      // Action
      const result = await getThreadDetailUseCase.execute(threadId);

      // Assert - repository calls
      expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(
        threadId
      );
      expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
      expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
        threadId
      );
      expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledWith(
        "comment-123"
      );

      // Assert - deep assertion pada nilai kembalian
      expect(result).toBeInstanceOf(ThreadDetail);
      expect(result.id).toBe("thread-123");
      expect(result.title).toBe("Test Thread");
      expect(result.body).toBe("Test body");
      expect(result.date).toBe("2023-01-01T00:00:00.000Z");
      expect(result.username).toBe("testuser");

      // Assert - comments array
      expect(result.comments).toHaveLength(1);
      expect(result.comments[0]).toBeInstanceOf(CommentDetail);
      expect(result.comments[0].id).toBe("comment-123");
      expect(result.comments[0].username).toBe("commenter");
      expect(result.comments[0].date).toBe("2023-01-01T01:00:00.000Z");
      expect(result.comments[0].content).toBe("Test comment");

      // Assert - replies array dalam comment
      expect(result.comments[0].replies).toHaveLength(1);
      expect(result.comments[0].replies[0]).toBeInstanceOf(ReplyDetail);
      expect(result.comments[0].replies[0].id).toBe("reply-123");
      expect(result.comments[0].replies[0].username).toBe("replier");
      expect(result.comments[0].replies[0].date).toBe(
        "2023-01-01T02:00:00.000Z"
      );
      expect(result.comments[0].replies[0].content).toBe("Test reply");
    });

    it("should handle thread without comments", async () => {
      // Arrange
      const threadId = "thread-123";
      const mockThreadData = {
        id: "thread-123",
        title: "Test Thread",
        body: "Test body",
        date: "2023-01-01T00:00:00.000Z",
        username: "testuser",
      };

      mockThreadRepository.verifyThreadExists.mockResolvedValue();
      mockThreadRepository.getThreadById.mockResolvedValue(mockThreadData);
      mockCommentRepository.getCommentsByThreadId.mockResolvedValue([]);

      // Action
      const result = await getThreadDetailUseCase.execute(threadId);

      // Assert - deep assertion pada nilai kembalian
      expect(result).toBeInstanceOf(ThreadDetail);
      expect(result.id).toBe("thread-123");
      expect(result.title).toBe("Test Thread");
      expect(result.body).toBe("Test body");
      expect(result.date).toBe("2023-01-01T00:00:00.000Z");
      expect(result.username).toBe("testuser");
      expect(result.comments).toHaveLength(0);
    });

    it("should handle comments without replies", async () => {
      // Arrange
      const threadId = "thread-123";
      const mockThreadData = {
        id: "thread-123",
        title: "Test Thread",
        body: "Test body",
        date: "2023-01-01T00:00:00.000Z",
        username: "testuser",
      };
      const mockComments = [
        {
          id: "comment-123",
          username: "commenter",
          date: "2023-01-01T01:00:00.000Z",
          content: "Test comment",
          is_delete: false,
        },
      ];

      mockThreadRepository.verifyThreadExists.mockResolvedValue();
      mockThreadRepository.getThreadById.mockResolvedValue(mockThreadData);
      mockCommentRepository.getCommentsByThreadId.mockResolvedValue(
        mockComments
      );
      mockReplyRepository.getRepliesByCommentId.mockResolvedValue([]);

      // Action
      const result = await getThreadDetailUseCase.execute(threadId);

      // Assert - deep assertion pada nilai kembalian
      expect(result).toBeInstanceOf(ThreadDetail);
      expect(result.id).toBe("thread-123");
      expect(result.title).toBe("Test Thread");
      expect(result.body).toBe("Test body");
      expect(result.date).toBe("2023-01-01T00:00:00.000Z");
      expect(result.username).toBe("testuser");

      // Assert - comments array
      expect(result.comments).toHaveLength(1);
      expect(result.comments[0]).toBeInstanceOf(CommentDetail);
      expect(result.comments[0].id).toBe("comment-123");
      expect(result.comments[0].username).toBe("commenter");
      expect(result.comments[0].date).toBe("2023-01-01T01:00:00.000Z");
      expect(result.comments[0].content).toBe("Test comment");
      expect(result.comments[0].replies).toHaveLength(0);
    });

    it("should handle error when getting replies and still include comment", async () => {
      // Arrange
      const threadId = "thread-123";
      const mockThreadData = {
        id: "thread-123",
        title: "Test Thread",
        body: "Test body",
        date: "2023-01-01T00:00:00.000Z",
        username: "testuser",
      };
      const mockComments = [
        {
          id: "comment-123",
          username: "commenter",
          date: "2023-01-01T01:00:00.000Z",
          content: "Test comment",
          is_delete: false,
        },
      ];

      mockThreadRepository.verifyThreadExists.mockResolvedValue();
      mockThreadRepository.getThreadById.mockResolvedValue(mockThreadData);
      mockCommentRepository.getCommentsByThreadId.mockResolvedValue(
        mockComments
      );
      mockReplyRepository.getRepliesByCommentId.mockRejectedValue(
        new Error("Reply error")
      );

      // Action
      const result = await getThreadDetailUseCase.execute(threadId);

      // Assert - deep assertion pada nilai kembalian
      expect(result).toBeInstanceOf(ThreadDetail);
      expect(result.id).toBe("thread-123");
      expect(result.title).toBe("Test Thread");
      expect(result.body).toBe("Test body");
      expect(result.date).toBe("2023-01-01T00:00:00.000Z");
      expect(result.username).toBe("testuser");

      // Assert - comments array
      expect(result.comments).toHaveLength(1);
      expect(result.comments[0]).toBeInstanceOf(CommentDetail);
      expect(result.comments[0].id).toBe("comment-123");
      expect(result.comments[0].username).toBe("commenter");
      expect(result.comments[0].date).toBe("2023-01-01T01:00:00.000Z");
      expect(result.comments[0].content).toBe("Test comment");
      expect(result.comments[0].replies).toHaveLength(0);
      expect(console.error).toHaveBeenCalled();
    });

    it("should throw error when thread does not exist", async () => {
      // Arrange
      const threadId = "thread-123";
      mockThreadRepository.verifyThreadExists.mockRejectedValue(
        new Error("Thread not found")
      );

      // Action & Assert
      await expect(getThreadDetailUseCase.execute(threadId)).rejects.toThrow(
        "Thread not found"
      );
      expect(mockThreadRepository.getThreadById).not.toHaveBeenCalled();
    });

    it("should throw error when threadId is invalid", async () => {
      // Action & Assert - null threadId
      await expect(getThreadDetailUseCase.execute(null)).rejects.toThrow(
        "GET_THREAD_DETAIL_USE_CASE.INVALID_THREAD_ID"
      );

      // Action & Assert - non-string threadId
      await expect(getThreadDetailUseCase.execute(123)).rejects.toThrow(
        "GET_THREAD_DETAIL_USE_CASE.INVALID_THREAD_ID"
      );

      // Action & Assert - empty string threadId
      await expect(getThreadDetailUseCase.execute("")).rejects.toThrow(
        "GET_THREAD_DETAIL_USE_CASE.INVALID_THREAD_ID"
      );
    });
  });

  describe("_formatDate function", () => {
    it("should format Date object to ISO string", () => {
      // Arrange
      const date = new Date("2023-01-01T00:00:00.000Z");

      // Action
      const result = getThreadDetailUseCase._formatDate(date);

      // Assert
      expect(result).toBe("2023-01-01T00:00:00.000Z");
    });

    it("should return string date as is", () => {
      // Arrange
      const date = "2023-01-01T00:00:00.000Z";

      // Action
      const result = getThreadDetailUseCase._formatDate(date);

      // Assert
      expect(result).toBe("2023-01-01T00:00:00.000Z");
    });

    it("should throw error for invalid date format", () => {
      // Action & Assert
      expect(() => getThreadDetailUseCase._formatDate(123)).toThrow(
        "Invalid date format"
      );
      expect(() => getThreadDetailUseCase._formatDate(null)).toThrow(
        "Invalid date format"
      );
      expect(() => getThreadDetailUseCase._formatDate({})).toThrow(
        "Invalid date format"
      );
    });
  });

  describe("_validateInput function", () => {
    it("should not throw error for valid threadId", () => {
      // Action & Assert
      expect(() =>
        getThreadDetailUseCase._validateInput("thread-123")
      ).not.toThrow();
    });

    it("should throw error for invalid threadId", () => {
      // Action & Assert
      expect(() => getThreadDetailUseCase._validateInput(null)).toThrow(
        "GET_THREAD_DETAIL_USE_CASE.INVALID_THREAD_ID"
      );
      expect(() => getThreadDetailUseCase._validateInput(123)).toThrow(
        "GET_THREAD_DETAIL_USE_CASE.INVALID_THREAD_ID"
      );
      expect(() => getThreadDetailUseCase._validateInput("")).toThrow(
        "GET_THREAD_DETAIL_USE_CASE.INVALID_THREAD_ID"
      );
    });
  });
});
