const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const GetThreadDetailUseCase = require("../../../../Applications/use_case/GetThreadDetailUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    // Binding this agar 'this' tetap merujuk ke instance handler saat method dipanggil
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    // Mendapatkan instance use case dari container
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    // Mendapatkan ID pemilik dari kredensial autentikasi (dari access token)
    const { id: owner } = request.auth.credentials;
    // Menjalankan use case untuk menambahkan thread
    const addedThread = await addThreadUseCase.execute(request.payload, owner);

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201); // Status Code 201 Created
    return response;
  }

  async getThreadDetailHandler(request, h) {
    // Mendapatkan instance use case dari container
    const getThreadDetailUseCase = this._container.getInstance(
      GetThreadDetailUseCase.name
    );
    const { threadId } = request.params; // Mendapatkan threadId dari parameter URL
    // Menjalankan use case untuk mendapatkan detail thread
    const thread = await getThreadDetailUseCase.execute(threadId);

    return h.response({
      status: "success",
      data: {
        thread,
      },
    });
  }
}

module.exports = ThreadsHandler;
