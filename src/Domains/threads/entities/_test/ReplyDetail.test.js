const ReplyDetail = require("../ReplyDetail");

describe("ReplyDetail", () => {
  describe("constructor", () => {
    it("should create replyDetail object correctly", () => {
      // Arrange
      const payload = {
        id: "reply-123",
        username: "johndoe",
        date: "2023-08-08T07:19:09.775Z",
        content: "sebuah balasan",
        isDelete: false,
      };

      // Action
      const replyDetail = new ReplyDetail(payload);

      // Assert
      expect(replyDetail.id).toEqual(payload.id);
      expect(replyDetail.username).toEqual(payload.username);
      expect(replyDetail.date).toEqual(payload.date);
      expect(replyDetail.content).toEqual(payload.content);
    });

    it("should create replyDetail object correctly when isDelete is true", () => {
      // Arrange
      const payload = {
        id: "reply-123",
        username: "johndoe",
        date: "2023-08-08T07:19:09.775Z",
        content: "sebuah balasan",
        isDelete: true,
      };

      // Action
      const replyDetail = new ReplyDetail(payload);

      // Assert
      expect(replyDetail.id).toEqual(payload.id);
      expect(replyDetail.username).toEqual(payload.username);
      expect(replyDetail.date).toEqual(payload.date);
      expect(replyDetail.content).toEqual("**balasan telah dihapus**");
    });

    it("should throw error when payload not contain needed property", () => {
      // Arrange
      const payload = {
        id: "reply-123",
        username: "johndoe",
        date: "2023-08-08T07:19:09.775Z",
        content: "sebuah balasan",
        // missing isDelete
      };

      // Action & Assert
      expect(() => new ReplyDetail(payload)).toThrowError(
        "REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY"
      );
    });

    it("should throw error when payload not meet data type specification", () => {
      // Arrange
      const payload = {
        id: 123, // should be string
        username: "johndoe",
        date: "2023-08-08T07:19:09.775Z",
        content: "sebuah balasan",
        isDelete: false,
      };

      // Action & Assert
      expect(() => new ReplyDetail(payload)).toThrowError(
        "REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    });

    it("should throw error when content is undefined", () => {
      // Arrange
      const payload = {
        id: "reply-123",
        username: "johndoe",
        date: "2023-08-08T07:19:09.775Z",
        content: undefined,
        isDelete: false,
      };

      // Action & Assert
      expect(() => new ReplyDetail(payload)).toThrowError(
        "REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY"
      );
    });

    it("should throw error when isDelete is undefined", () => {
      // Arrange
      const payload = {
        id: "reply-123",
        username: "johndoe",
        date: "2023-08-08T07:19:09.775Z",
        content: "sebuah balasan",
        isDelete: undefined,
      };

      // Action & Assert
      expect(() => new ReplyDetail(payload)).toThrowError(
        "REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY"
      );
    });
  });
});
