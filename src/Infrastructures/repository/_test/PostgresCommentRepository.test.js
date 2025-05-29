const PostgresCommentRepository = require("../PostgresCommentRepository");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const pool = require("../../database/postgres/pool");
const NewComment = require("../../../Domains/threads/entities/NewComment");
const AddedComment = require("../../../Domains/threads/entities/AddedComment");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("PostgresCommentRepository", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist new comment and return added comment correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });

      const newComment = new NewComment({
        content: "sebuah komentar",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepository = new PostgresCommentRepository(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepository.addComment(
        newComment,
        "thread-123",
        "user-123"
      );

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: "sebuah komentar",
          owner: "user-123",
        })
      );
    });

    it("should persist comment data in database", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });

      const newComment = new NewComment({
        content: "sebuah komentar",
      });
      const fakeIdGenerator = () => "123";
      const commentRepository = new PostgresCommentRepository(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepository.addComment(newComment, "thread-123", "user-123");

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(
        "comment-123"
      );
      expect(comment).toHaveLength(1);
    });
  });

  describe("verifyCommentExists function", () => {
    it("should throw NotFoundError when comment not found", async () => {
      // Arrange
      const commentRepository = new PostgresCommentRepository(pool, {});

      // Action & Assert
      await expect(
        commentRepository.verifyCommentExists("comment-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when comment found", async () => {
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

      const commentRepository = new PostgresCommentRepository(pool, {});

      // Action & Assert
      await expect(
        commentRepository.verifyCommentExists("comment-123")
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should throw NotFoundError when comment not found", async () => {
      // Arrange
      const commentRepository = new PostgresCommentRepository(pool, {});

      // Action & Assert
      await expect(
        commentRepository.verifyCommentOwner("comment-123", "user-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should throw AuthorizationError when comment not owned by user", async () => {
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

      const commentRepository = new PostgresCommentRepository(pool, {});

      // Action & Assert
      await expect(
        commentRepository.verifyCommentOwner("comment-123", "user-456")
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw AuthorizationError when comment owned by user", async () => {
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

      const commentRepository = new PostgresCommentRepository(pool, {});

      // Action & Assert
      await expect(
        commentRepository.verifyCommentOwner("comment-123", "user-123")
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("deleteComment function", () => {
    it("should soft delete comment correctly", async () => {
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

      const commentRepository = new PostgresCommentRepository(pool, {});

      // Action
      await commentRepository.deleteComment("comment-123");

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(
        "comment-123"
      );
      expect(comment[0].is_delete).toBe(true);
    });
  });

  describe("getCommentsByThreadId function", () => {
    it("should return comments correctly", async () => {
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
        content: "sebuah komentar",
        date: expectedDate,
      });

      const commentRepository = new PostgresCommentRepository(pool, {});

      // Action
      const comments = await commentRepository.getCommentsByThreadId(
        "thread-123"
      );

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0]).toStrictEqual({
        id: "comment-123",
        username: "dicoding",
        date: expectedDate,
        content: "sebuah komentar",
        is_delete: false,
      });
    });

    it("should return empty array when no comments found", async () => {
      // Arrange
      const commentRepository = new PostgresCommentRepository(pool, {});

      // Action
      const comments = await commentRepository.getCommentsByThreadId(
        "thread-123"
      );

      // Assert
      expect(comments).toHaveLength(0);
    });
  });
});
