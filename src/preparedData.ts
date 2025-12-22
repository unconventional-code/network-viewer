import { List } from "immutable";

import networkDataMock from "./network.json";
import { prepareViewerData } from "./utils";

export const preparedMockData = List(
  prepareViewerData(networkDataMock.log.entries).data
);
