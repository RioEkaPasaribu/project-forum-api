const NewComment = require("../../../../Domains/threads/entities/NewComment");
const InvariantError = require("../../../../Commons/exceptions/InvariantError");

describe("NewComment entity", () => {
  it("should create NewComment object correctly", () => {
    // Arrange
    const payload = {
      content: "Test comment content",
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment.content).toBe("Test comment content");
  });

  it("should throw InvariantError when content is missing", () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError(InvariantError);
    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw InvariantError when content is not string", () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError(InvariantError);
    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw InvariantError when content is empty string", () => {
    // Arrange
    const payload = {
      content: "",
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError(InvariantError);
    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
});
