const ReplyRepository = require("../ReplyRepository");

describe("ReplyRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action and Assert
    await expect(replyRepository.addReply({})).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      replyRepository.verifyReplyExists("") // Changed this line
    ).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      replyRepository.verifyReplyOwner("", "") // And potentially this one if you meant a different abstract method
    ).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      replyRepository.getRepliesByCommentId("")
    ).rejects.toThrowError(
      // Corrected method name
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(replyRepository.deleteReply("")).rejects.toThrowError(
      // Corrected method name
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
