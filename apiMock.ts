import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

/** Mock request */
function mock(method,
              path,
              data,
              status = 200) {
  mockServer.use(
    http[method](path, () =>
      HttpResponse.json(data, { status: status }),
    ));
}

const mockServer = setupServer();

export { mock, mockServer };
