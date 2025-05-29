/* istanbul ignore file */

const { createContainer } = require("instances-container");

// external agency
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const Jwt = require("@hapi/jwt");
const pool = require("./database/postgres/pool");

// Commons Exceptions
const InvariantError = require("../Commons/exceptions/InvariantError");
const NotFoundError = require("../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../Commons/exceptions/AuthorizationError");

// Domains - Users (from starter project)
const UserRepository = require("../Domains/users/UserRepository");
const UserRepositoryPostgres = require("./repository/UserRepositoryPostgres");

// Domains - Authentications (from starter project)
const AuthenticationRepository = require("../Domains/authentications/AuthenticationRepository");
const AuthenticationRepositoryPostgres = require("./repository/AuthenticationRepositoryPostgres");

// Domains - Threads
const NewThread = require("../Domains/threads/entities/NewThread");
const AddedThread = require("../Domains/threads/entities/AddedThread");
const ThreadDetail = require("../Domains/threads/entities/ThreadDetail");
const ThreadRepository = require("../Domains/threads/ThreadRepository");
const PostgresThreadRepository = require("./repository/PostgresThreadRepository");

// Domains - Comments
const NewComment = require("../Domains/threads/entities/NewComment");
const AddedComment = require("../Domains/threads/entities/AddedComment");
const CommentRepository = require("../Domains/comments/CommentRepository");
const PostgresCommentRepository = require("./repository/PostgresCommentRepository");

// Domains - Replies (Optional)
const NewReply = require("../Domains/threads/entities/NewReply");
const AddedReply = require("../Domains/threads/entities/AddedReply");
const ReplyRepository = require("../Domains/replies/ReplyRepository");
const PostgresReplyRepository = require("./repository/PostgresReplyRepository");

// Applications - Security (from starter project)
const PasswordHash = require("../Applications/security/PasswordHash");
const BcryptPasswordHash = require("./security/BcryptPasswordHash");
const AuthenticationTokenManager = require("../Applications/security/AuthenticationTokenManager");
const JwtTokenManager = require("./security/JwtTokenManager");

// Applications - Use Cases (from starter project)
const AddUserUseCase = require("../Applications/use_case/AddUserUseCase");
const LoginUserUseCase = require("../Applications/use_case/LoginUserUseCase");
const LogoutUserUseCase = require("../Applications/use_case/LogoutUserUseCase");
const RefreshAuthenticationUseCase = require("../Applications/use_case/RefreshAuthenticationUseCase");

// Applications - Use Cases (New for Forum API)
const AddThreadUseCase = require("../Applications/use_case/AddThreadUseCase");
const AddCommentUseCase = require("../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../Applications/use_case/DeleteCommentUseCase");
const GetThreadDetailUseCase = require("../Applications/use_case/GetThreadDetailUseCase");
const AddReplyUseCase = require("../Applications/use_case/AddReplyUseCase"); // Optional
const DeleteReplyUseCase = require("../Applications/use_case/DeleteReplyUseCase"); // Optional

// creating container
const container = createContainer();

// registering services and repository
container.register([
  // Commons Exceptions
  { key: InvariantError.name, Class: InvariantError },
  { key: NotFoundError.name, Class: NotFoundError },
  { key: AuthorizationError.name, Class: AuthorizationError },

  // Utils - Changed from 'concrete' to proper instance registration
  {
    key: "nanoid",
    Class: class {
      constructor() {
        return nanoid;
      }
    },
  },
  {
    key: "pool",
    Class: class {
      constructor() {
        return pool;
      }
    },
  },
  {
    key: "bcrypt",
    Class: class {
      constructor() {
        return bcrypt;
      }
    },
  },
  {
    key: "Jwt",
    Class: class {
      constructor() {
        return Jwt;
      }
    },
  },
  {
    key: "JwtTokenManager",
    Class: class {
      constructor() {
        return Jwt.token;
      }
    },
  },

  // Repositories (from starter project)
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        { name: "pool", internal: "pool" },
        { name: "nanoid", internal: "nanoid" },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [{ name: "pool", internal: "pool" }],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [{ name: "bcrypt", internal: "bcrypt" }],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [{ name: "JwtTokenManager", internal: "JwtTokenManager" }],
    },
  },

  // New Repositories (for Forum API)
  {
    key: ThreadRepository.name,
    Class: PostgresThreadRepository,
    parameter: {
      dependencies: [
        { name: "pool", internal: "pool" },
        { name: "nanoid", internal: "nanoid" },
      ],
    },
  },
  {
    key: CommentRepository.name,
    Class: PostgresCommentRepository,
    parameter: {
      dependencies: [
        { name: "pool", internal: "pool" },
        { name: "nanoid", internal: "nanoid" },
      ],
    },
  },
  {
    key: ReplyRepository.name, // Opsional
    Class: PostgresReplyRepository,
    parameter: {
      dependencies: [
        { name: "pool", internal: "pool" },
        { name: "nanoid", internal: "nanoid" },
      ],
    },
  },
]);

// registering use cases
container.register([
  // Use Cases (from starter project)
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "userRepository", internal: UserRepository.name },
        { name: "passwordHash", internal: PasswordHash.name },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "userRepository", internal: UserRepository.name },
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
        {
          name: "authenticationTokenManager",
          internal: AuthenticationTokenManager.name,
        },
        { name: "passwordHash", internal: PasswordHash.name },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
        {
          name: "authenticationTokenManager",
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },

  // New Use Cases (for Forum API)
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "threadRepository", internal: ThreadRepository.name },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "threadRepository", internal: ThreadRepository.name },
        { name: "commentRepository", internal: CommentRepository.name },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "threadRepository", internal: ThreadRepository.name },
        { name: "commentRepository", internal: CommentRepository.name },
      ],
    },
  },
  {
    key: GetThreadDetailUseCase.name,
    Class: GetThreadDetailUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "threadRepository", internal: ThreadRepository.name },
        { name: "commentRepository", internal: CommentRepository.name },
        { name: "replyRepository", internal: ReplyRepository.name },
      ],
    },
  },
  {
    key: AddReplyUseCase.name, // Opsional
    Class: AddReplyUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "threadRepository", internal: ThreadRepository.name },
        { name: "commentRepository", internal: CommentRepository.name },
        { name: "replyRepository", internal: ReplyRepository.name },
      ],
    },
  },
  {
    key: DeleteReplyUseCase.name, // Opsional
    Class: DeleteReplyUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        { name: "threadRepository", internal: ThreadRepository.name },
        { name: "commentRepository", internal: CommentRepository.name },
        { name: "replyRepository", internal: ReplyRepository.name },
      ],
    },
  },
]);

module.exports = container;
