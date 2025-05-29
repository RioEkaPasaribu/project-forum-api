const NewThread = require("../../Domains/threads/entities/NewThread");
const AddedThread = require("../../Domains/threads/entities/AddedThread");

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, owner) {
    if (!owner || typeof owner !== "string" || owner.trim() === "") {
      throw new Error("INVALID_OWNER"); // Or a more specific error
    }
    const newThread = new NewThread(useCasePayload); // Validasi payload
    const addedThread = await this._threadRepository.addThread(
      newThread,
      owner
    ); // Panggil repository
    return new AddedThread(addedThread); // Kembalikan objek AddedThread
  }
}

module.exports = AddThreadUseCase;
