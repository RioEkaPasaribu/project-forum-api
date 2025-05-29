const AddedComment = require("../../../../Domains/threads/entities/AddedComment");
const InvariantError = require("../../../../Commons/exceptions/InvariantError");

describe("AddedComment entity", () => {
  it("should create AddedComment object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "Test comment",
      owner: "user-123",
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment.id).toBe("comment-123");
    expect(addedComment.content).toBe("Test comment");
    expect(addedComment.owner).toBe("user-123");
  });

  it("should throw InvariantError when missing required properties", () => {
    // Arrange
    const payload = {
      content: "Test comment",
      // missing id and owner
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError(InvariantError);
    expect(() => new AddedComment(payload)).toThrowError(
      "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw InvariantError when data type is wrong", () => {
    // Arrange
    const payload = {
      id: 123, // should be string
      content: "Test comment",
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError(InvariantError);
    expect(() => new AddedComment(payload)).toThrowError(
      "ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });
});
