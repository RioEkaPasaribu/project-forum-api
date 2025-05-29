const AddedThread = require("../AddedThread");
const InvariantError = require("../../../../Commons/exceptions/InvariantError");

describe("AddedThread", () => {
  describe("constructor", () => {
    it("should create addedThread object correctly", () => {
      // Arrange
      const payload = {
        id: "thread-123",
        title: "sebuah thread",
        owner: "user-123",
      };

      // Action
      const addedThread = new AddedThread(payload);

      // Assert
      expect(addedThread.id).toEqual(payload.id);
      expect(addedThread.title).toEqual(payload.title);
      expect(addedThread.owner).toEqual(payload.owner);
    });

    it("should throw InvariantError when payload not contain needed property", () => {
      // Arrange
      const payload = {
        id: "thread-123",
        title: "sebuah thread",
        // missing owner
      };

      // Action & Assert
      expect(() => new AddedThread(payload)).toThrowError(InvariantError);
      expect(() => new AddedThread(payload)).toThrowError(
        "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
      );
    });

    it("should throw InvariantError when payload not meet data type specification", () => {
      // Arrange
      const payload = {
        id: 123, // should be string
        title: "sebuah thread",
        owner: "user-123",
      };

      // Action & Assert
      expect(() => new AddedThread(payload)).toThrowError(InvariantError);
      expect(() => new AddedThread(payload)).toThrowError(
        "ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    });

    it("should throw InvariantError when id is empty string", () => {
      // Arrange
      const payload = {
        id: "",
        title: "sebuah thread",
        owner: "user-123",
      };

      // Action & Assert
      expect(() => new AddedThread(payload)).toThrowError(InvariantError);
      expect(() => new AddedThread(payload)).toThrowError(
        "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
      );
    });
  });
});
