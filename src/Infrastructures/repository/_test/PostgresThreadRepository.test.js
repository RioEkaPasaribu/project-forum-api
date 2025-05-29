const PostgresThreadRepository = require("../PostgresThreadRepository");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("PostgresThreadRepository", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist new thread and return added thread correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });

      const newThread = new NewThread({
        title: "sebuah thread",
        body: "sebuah body thread",
      });
      const fakeIdGenerator = () => "123";
      const threadRepository = new PostgresThreadRepository(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepository.addThread(
        newThread,
        "user-123"
      );

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-123",
          title: "sebuah thread",
          owner: "user-123",
        })
      );
    });

    it("should persist thread data in database", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });

      const newThread = new NewThread({
        title: "sebuah thread",
        body: "sebuah body thread",
      });
      const fakeIdGenerator = () => "123";
      const threadRepository = new PostgresThreadRepository(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepository.addThread(newThread, "user-123");

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById("thread-123");
      expect(thread).toHaveLength(1);
    });
  });

  describe("verifyThreadExists function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      const threadRepository = new PostgresThreadRepository(pool, {});

      // Action & Assert
      await expect(
        threadRepository.verifyThreadExists("thread-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when thread found", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });

      const threadRepository = new PostgresThreadRepository(pool, {});

      // Action & Assert
      await expect(
        threadRepository.verifyThreadExists("thread-123")
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("getThreadById function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      const threadRepository = new PostgresThreadRepository(pool, {});

      // Action & Assert
      await expect(
        threadRepository.getThreadById("thread-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should return thread correctly", async () => {
      // Arrange
      const expectedDate = new Date("2023-08-08T07:19:09.775Z");
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        title: "sebuah thread",
        body: "sebuah body thread",
        owner: "user-123",
        date: expectedDate,
      });

      const threadRepository = new PostgresThreadRepository(pool, {});

      // Action
      const thread = await threadRepository.getThreadById("thread-123");

      // Assert
      expect(thread).toStrictEqual({
        id: "thread-123",
        title: "sebuah thread",
        body: "sebuah body thread",
        date: expectedDate,
        username: "dicoding",
      });
    });
  });
});
