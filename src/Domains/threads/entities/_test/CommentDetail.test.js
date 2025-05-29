const CommentDetail = require("../../../../Domains/threads/entities/CommentDetail");

describe("CommentDetail entity", () => {
  it("should create CommentDetail object correctly with regular comment", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "commenter",
      date: new Date("2023-01-01T00:00:00.000Z"),
      content: "Test comment",
      is_delete: false,
      replies: [],
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail.id).toBe("comment-123");
    expect(commentDetail.username).toBe("commenter");
    expect(commentDetail.date).toBe("2023-01-01T00:00:00.000Z");
    expect(commentDetail.content).toBe("Test comment");
    expect(commentDetail.replies).toEqual([]);
  });

  it("should create CommentDetail object with string date", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "commenter",
      date: "2023-01-01T00:00:00.000Z",
      content: "Test comment",
      is_delete: false,
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail.date).toBe("2023-01-01T00:00:00.000Z");
  });

  it("should format content correctly for deleted comment", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "commenter",
      date: new Date("2023-01-01T00:00:00.000Z"),
      content: "Original comment",
      is_delete: true,
      replies: [],
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail.content).toBe("**komentar telah dihapus**");
  });

  it("should create CommentDetail object without replies parameter", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "commenter",
      date: new Date("2023-01-01T00:00:00.000Z"),
      content: "Test comment",
      is_delete: false,
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail.replies).toEqual([]);
  });

  it("should create CommentDetail object with replies", () => {
    // Arrange
    const replies = [
      {
        id: "reply-123",
        username: "replier",
        date: "2023-01-01T01:00:00.000Z",
        content: "Test reply",
      },
    ];
    const payload = {
      id: "comment-123",
      username: "commenter",
      date: new Date("2023-01-01T00:00:00.000Z"),
      content: "Test comment",
      is_delete: false,
      replies: replies,
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail.replies).toEqual(replies);
  });
});
