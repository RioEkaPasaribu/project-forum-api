const ThreadDetail = require("../../Domains/threads/entities/ThreadDetail");
const CommentDetail = require("../../Domains/threads/entities/CommentDetail");
const ReplyDetail = require("../../Domains/threads/entities/ReplyDetail");

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    this._validateInput(threadId);

    // Verify thread exists
    await this._threadRepository.verifyThreadExists(threadId);

    // Get raw thread data (no formatting from repository)
    const rawThreadData = await this._threadRepository.getThreadById(threadId);

    // Get raw comments data
    const rawComments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );

    // Transform comments with replies using domain entities
    const comments = await this._buildCommentsWithReplies(rawComments);

    // Create thread detail using domain entity (handles formatting)
    return new ThreadDetail({
      ...rawThreadData,
      comments: comments,
    });
  }

  async _buildCommentsWithReplies(rawComments) {
    const commentsWithReplies = [];

    for (const rawComment of rawComments) {
      try {
        // Get raw replies data - handle potential errors
        const rawReplies = await this._replyRepository.getRepliesByCommentId(
          rawComment.id
        );

        // Debug logging
        console.log(
          `Comment ${rawComment.id} has ${rawReplies.length} replies:`,
          rawReplies
        );

        // Transform raw reply data to match ReplyDetail entity expectations
        const replies = rawReplies.map((rawReply) => {
          return new ReplyDetail({
            id: rawReply.id,
            username: rawReply.username,
            // Use Case layer handles data transformation for domain entities
            date: this._formatDate(rawReply.date),
            content: rawReply.content,
            isDelete: rawReply.is_delete, // Convert snake_case to camelCase
          });
        });

        // Transform raw comment data to match CommentDetail entity expectations
        const comment = new CommentDetail({
          id: rawComment.id,
          username: rawComment.username,
          date: rawComment.date, // CommentDetail handles its own date formatting
          content: rawComment.content,
          is_delete: rawComment.is_delete, // CommentDetail expects snake_case
          replies: replies,
        });

        commentsWithReplies.push(comment);
      } catch (error) {
        console.error(`Error processing comment ${rawComment.id}:`, error);
        // If there's an error with replies, still include the comment but with empty replies
        const comment = new CommentDetail({
          id: rawComment.id,
          username: rawComment.username,
          date: rawComment.date,
          content: rawComment.content,
          is_delete: rawComment.is_delete,
          replies: [],
        });
        commentsWithReplies.push(comment);
      }
    }

    return commentsWithReplies;
  }

  _formatDate(date) {
    // Use Case layer handles date formatting untuk ReplyDetail
    // karena ReplyDetail expects string date
    if (date instanceof Date) {
      return date.toISOString();
    }
    if (typeof date === "string") {
      return date;
    }
    throw new Error("Invalid date format");
  }

  _validateInput(threadId) {
    if (!threadId || typeof threadId !== "string") {
      throw new Error("GET_THREAD_DETAIL_USE_CASE.INVALID_THREAD_ID");
    }
  }
}

module.exports = GetThreadDetailUseCase;
