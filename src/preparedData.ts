import networkDataMock from "./network.json";
import { prepareViewerData } from "./utils";
import { Entry } from "har-format";

export const preparedMockData = prepareViewerData(
  networkDataMock.log.entries as Entry[]
).data;
