const NewReply = require("../../../../Domains/threads/entities/NewReply");
const InvariantError = require("../../../../Commons/exceptions/InvariantError");

describe("NewReply entity", () => {
  it("should create NewReply object correctly", () => {
    // Arrange
    const payload = {
      content: "Test reply content",
    };

    // Action
    const newReply = new NewReply(payload);

    // Assert
    expect(newReply.content).toBe("Test reply content");
  });

  it("should throw InvariantError when content is missing", () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError(InvariantError);
    expect(() => new NewReply(payload)).toThrowError(
      "NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw InvariantError when content is not string", () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError(InvariantError);
    expect(() => new NewReply(payload)).toThrowError(
      "NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw InvariantError when content is empty string", () => {
    // Arrange
    const payload = {
      content: "",
    };

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError(InvariantError);
    expect(() => new NewReply(payload)).toThrowError(
      "NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
});
