class CommentDetail {
  constructor({ id, username, date, content, is_delete, replies = [] }) {
    this.id = id;
    this.username = username;
    this.date = this._formatDate(date);
    this.content = this._formatContent(content, is_delete);
    this.replies = replies;
  }

  _formatDate(date) {
    return date instanceof Date ? date.toISOString() : date;
  }

  _formatContent(content, isDeleted) {
    return isDeleted ? "**komentar telah dihapus**" : content;
  }
}

module.exports = CommentDetail;
