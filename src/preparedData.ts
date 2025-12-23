import networkDataMock from "./network.json";
import { prepareViewerData } from "./state/network/NetworkProvider/utils";
import { Entry } from "har-format";

export const preparedMockData = prepareViewerData(
  networkDataMock.log.entries as Entry[]
).data;
