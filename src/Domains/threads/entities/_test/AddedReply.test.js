const AddedReply = require("../../../../Domains/threads/entities/AddedReply");
const InvariantError = require("../../../../Commons/exceptions/InvariantError");

describe("AddedReply entity", () => {
  it("should create AddedReply object correctly", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "Test reply",
      owner: "user-123",
    };

    // Action
    const addedReply = new AddedReply(payload);

    // Assert
    expect(addedReply.id).toBe("reply-123");
    expect(addedReply.content).toBe("Test reply");
    expect(addedReply.owner).toBe("user-123");
  });

  it("should throw InvariantError when missing required properties", () => {
    // Arrange
    const payload = {
      content: "Test reply",
      // missing id and owner
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError(InvariantError);
    expect(() => new AddedReply(payload)).toThrowError(
      "ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw InvariantError when data type is wrong", () => {
    // Arrange
    const payload = {
      id: 123, // should be string
      content: "Test reply",
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError(InvariantError);
    expect(() => new AddedReply(payload)).toThrowError(
      "ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });
});
