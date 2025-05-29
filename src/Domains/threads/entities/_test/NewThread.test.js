const NewThread = require("../../../../Domains/threads/entities/NewThread");
const InvariantError = require("../../../../Commons/exceptions/InvariantError");

describe("NewThread entity", () => {
  it("should create NewThread object correctly", () => {
    // Arrange
    const payload = {
      title: "Test Thread Title",
      body: "Test thread body content",
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread.title).toBe("Test Thread Title");
    expect(newThread.body).toBe("Test thread body content");
  });

  it("should throw InvariantError when title is missing", () => {
    // Arrange
    const payload = {
      body: "Test thread body content",
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(InvariantError);
    expect(() => new NewThread(payload)).toThrowError(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw InvariantError when body is missing", () => {
    // Arrange
    const payload = {
      title: "Test Thread Title",
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(InvariantError);
    expect(() => new NewThread(payload)).toThrowError(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw InvariantError when title is not string", () => {
    // Arrange
    const payload = {
      title: 123,
      body: "Test thread body content",
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(InvariantError);
    expect(() => new NewThread(payload)).toThrowError(
      "NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw InvariantError when body is not string", () => {
    // Arrange
    const payload = {
      title: "Test Thread Title",
      body: 123,
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(InvariantError);
    expect(() => new NewThread(payload)).toThrowError(
      "NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw InvariantError when title is empty string", () => {
    // Arrange
    const payload = {
      title: "",
      body: "Test thread body content",
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(InvariantError);
    expect(() => new NewThread(payload)).toThrowError(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw InvariantError when body is empty string", () => {
    // Arrange
    const payload = {
      title: "Test Thread Title",
      body: "",
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(InvariantError);
    expect(() => new NewThread(payload)).toThrowError(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
});
