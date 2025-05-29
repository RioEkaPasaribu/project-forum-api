const ThreadDetail = require("../../../../Domains/threads/entities/ThreadDetail");
const InvariantError = require("../../../../Commons/exceptions/InvariantError");

describe("ThreadDetail entity", () => {
  it("should create ThreadDetail object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "Test Thread",
      body: "Test Body",
      date: new Date("2023-01-01T00:00:00.000Z"),
      username: "testuser",
      comments: [],
    };

    // Action
    const threadDetail = new ThreadDetail(payload);

    // Assert
    expect(threadDetail.id).toBe("thread-123");
    expect(threadDetail.title).toBe("Test Thread");
    expect(threadDetail.body).toBe("Test Body");
    expect(threadDetail.date).toBe("2023-01-01T00:00:00.000Z");
    expect(threadDetail.username).toBe("testuser");
    expect(threadDetail.comments).toEqual([]);
  });

  it("should create ThreadDetail object with string date correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "Test Thread",
      body: "Test Body",
      date: "2023-01-01T00:00:00.000Z",
      username: "testuser",
      comments: [],
    };

    // Action
    const threadDetail = new ThreadDetail(payload);

    // Assert
    expect(threadDetail.date).toBe("2023-01-01T00:00:00.000Z");
  });

  it("should create ThreadDetail object without comments", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "Test Thread",
      body: "Test Body",
      date: new Date("2023-01-01T00:00:00.000Z"),
      username: "testuser",
    };

    // Action
    const threadDetail = new ThreadDetail(payload);

    // Assert
    expect(threadDetail.comments).toBeUndefined();
  });

  it("should create ThreadDetail object with valid comments", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "Test Thread",
      body: "Test Body",
      date: new Date("2023-01-01T00:00:00.000Z"),
      username: "testuser",
      comments: [
        {
          id: "comment-123",
          username: "commenter",
          date: "2023-01-01T01:00:00.000Z",
          content: "Test comment",
          replies: [],
        },
      ],
    };

    // Action
    const threadDetail = new ThreadDetail(payload);

    // Assert
    expect(threadDetail.comments).toHaveLength(1);
    expect(threadDetail.comments[0].id).toBe("comment-123");
  });

  it("should create ThreadDetail object with comments that have replies", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "Test Thread",
      body: "Test Body",
      date: new Date("2023-01-01T00:00:00.000Z"),
      username: "testuser",
      comments: [
        {
          id: "comment-123",
          username: "commenter",
          date: "2023-01-01T01:00:00.000Z",
          content: "Test comment",
          replies: [
            {
              id: "reply-123",
              username: "replier",
              date: "2023-01-01T02:00:00.000Z",
              content: "Test reply",
            },
          ],
        },
      ],
    };

    // Action
    const threadDetail = new ThreadDetail(payload);

    // Assert
    expect(threadDetail.comments[0].replies).toHaveLength(1);
    expect(threadDetail.comments[0].replies[0].id).toBe("reply-123");
  });

  it("should throw InvariantError when missing required properties", () => {
    // Arrange
    const payload = {
      title: "Test Thread",
      body: "Test Body",
      // missing id, date, username
    };

    // Action & Assert
    expect(() => new ThreadDetail(payload)).toThrowError(InvariantError);
    expect(() => new ThreadDetail(payload)).toThrowError(
      "THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw InvariantError when data type is wrong", () => {
    // Arrange
    const payload = {
      id: 123, // should be string
      title: "Test Thread",
      body: "Test Body",
      date: new Date(),
      username: "testuser",
    };

    // Action & Assert
    expect(() => new ThreadDetail(payload)).toThrowError(InvariantError);
    expect(() => new ThreadDetail(payload)).toThrowError(
      "THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw InvariantError when comments is not array", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "Test Thread",
      body: "Test Body",
      date: new Date(),
      username: "testuser",
      comments: "not an array",
    };

    // Action & Assert
    expect(() => new ThreadDetail(payload)).toThrowError(InvariantError);
    expect(() => new ThreadDetail(payload)).toThrowError(
      "THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw InvariantError when comment properties are invalid", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "Test Thread",
      body: "Test Body",
      date: new Date(),
      username: "testuser",
      comments: [
        {
          id: "comment-123",
          // missing username, date, content
        },
      ],
    };

    // Action & Assert
    expect(() => new ThreadDetail(payload)).toThrowError(InvariantError);
    expect(() => new ThreadDetail(payload)).toThrowError(
      "THREAD_DETAIL.COMMENT_NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw InvariantError when comment data types are wrong", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "Test Thread",
      body: "Test Body",
      date: new Date(),
      username: "testuser",
      comments: [
        {
          id: 123, // should be string
          username: "commenter",
          date: "2023-01-01T01:00:00.000Z",
          content: "Test comment",
        },
      ],
    };

    // Action & Assert
    expect(() => new ThreadDetail(payload)).toThrowError(InvariantError);
    expect(() => new ThreadDetail(payload)).toThrowError(
      "THREAD_DETAIL.COMMENT_NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw InvariantError when reply properties are invalid", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "Test Thread",
      body: "Test Body",
      date: new Date(),
      username: "testuser",
      comments: [
        {
          id: "comment-123",
          username: "commenter",
          date: "2023-01-01T01:00:00.000Z",
          content: "Test comment",
          replies: [
            {
              id: "reply-123",
              // missing username, date, content
            },
          ],
        },
      ],
    };

    // Action & Assert
    expect(() => new ThreadDetail(payload)).toThrowError(InvariantError);
    expect(() => new ThreadDetail(payload)).toThrowError(
      "THREAD_DETAIL.REPLY_NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw Error when date format is invalid", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "Test Thread",
      body: "Test Body",
      date: 123, // invalid date format
      username: "testuser",
    };

    // Action & Assert
    expect(() => new ThreadDetail(payload)).toThrowError("Invalid date format");
  });
});
