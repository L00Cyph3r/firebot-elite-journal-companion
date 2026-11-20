import firebot from "@crowbartools/firebot-types";
import plugin from "../src/main";

jest.mock("@crowbartools/firebot-types", () => ({
  __esModule: true,
  default: {
    logger: {
      info: jest.fn(),
    },
  },
}));

const mockedFirebot = firebot as unknown as {
  logger: { info: jest.Mock };
};

beforeEach(() => {
  mockedFirebot.logger.info.mockClear();
});

test("default export is the plugin definition", () => {
  expect(plugin).not.toBeUndefined();
  expect(plugin.manifest).not.toBeUndefined();
  expect(plugin.onLoad).not.toBeUndefined();
});
