const PostgresReplyRepository = require("../PostgresReplyRepository");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const pool = require("../../database/postgres/pool");
const NewReply = require("../../../Domains/threads/entities/NewReply");
const AddedReply = require("../../../Domains/threads/entities/AddedReply");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("PostgresReplyRepository", () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addReply function", () => {
    it("should persist new reply and return added reply correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });

      const newReply = new NewReply({
        content: "sebuah balasan",
      });
      const fakeIdGenerator = () => "123";
      const replyRepository = new PostgresReplyRepository(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedReply = await replyRepository.addReply(
        newReply,
        "comment-123",
        "user-123"
      );

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: "reply-123",
          content: "sebuah balasan",
          owner: "user-123",
        })
      );
    });

    it("should persist reply data in database", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });

      const newReply = new NewReply({
        content: "sebuah balasan",
      });
      const fakeIdGenerator = () => "123";
      const replyRepository = new PostgresReplyRepository(
        pool,
        fakeIdGenerator
      );

      // Action
      await replyRepository.addReply(newReply, "comment-123", "user-123");

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById("reply-123");
      expect(reply).toHaveLength(1);
    });
  });

  describe("verifyReplyExists function", () => {
    it("should throw NotFoundError when reply not found", async () => {
      // Arrange
      const replyRepository = new PostgresReplyRepository(pool, {});

      // Action & Assert
      await expect(
        replyRepository.verifyReplyExists("reply-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when reply found", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-123",
        owner: "user-123",
      });

      const replyRepository = new PostgresReplyRepository(pool, {});

      // Action & Assert
      await expect(
        replyRepository.verifyReplyExists("reply-123")
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("verifyReplyOwner function", () => {
    it("should throw AuthorizationError when reply not owned by user", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await UsersTableTestHelper.addUser({
        id: "user-456",
        username: "johndoe",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-123",
        owner: "user-123",
      });

      const replyRepository = new PostgresReplyRepository(pool, {});

      // Action & Assert
      await expect(
        replyRepository.verifyReplyOwner("reply-123", "user-456")
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw AuthorizationError when reply owned by user", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-123",
        owner: "user-123",
      });

      const replyRepository = new PostgresReplyRepository(pool, {});

      // Action & Assert
      await expect(
        replyRepository.verifyReplyOwner("reply-123", "user-123")
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("deleteReply function", () => {
    it("should soft delete reply correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-123",
        owner: "user-123",
      });

      const replyRepository = new PostgresReplyRepository(pool, {});

      // Action
      await replyRepository.deleteReply("reply-123");

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById("reply-123");
      expect(reply[0].is_delete).toBe(true);
    });
  });

  describe("getRepliesByCommentId function", () => {
    it("should return replies correctly", async () => {
      // Arrange
      const expectedDate = new Date("2023-08-08T07:19:09.775Z");
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-123",
        owner: "user-123",
        content: "sebuah balasan",
        date: expectedDate,
      });

      const replyRepository = new PostgresReplyRepository(pool, {});

      // Action
      const replies = await replyRepository.getRepliesByCommentId(
        "comment-123"
      );

      // Assert
      expect(replies).toHaveLength(1);
      expect(replies[0]).toStrictEqual({
        id: "reply-123",
        username: "dicoding",
        date: expectedDate,
        content: "sebuah balasan",
        is_delete: false,
      });
    });

    it("should return empty array when no replies found", async () => {
      // Arrange
      const replyRepository = new PostgresReplyRepository(pool, {});

      // Action
      const replies = await replyRepository.getRepliesByCommentId(
        "comment-123"
      );

      // Assert
      expect(replies).toHaveLength(0);
    });
  });
});
