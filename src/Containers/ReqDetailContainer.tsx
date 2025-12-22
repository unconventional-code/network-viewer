import { useNetwork } from "../state/network/Context";
import { Tabs } from "../Components/Common/Tabs";
import { Tab } from "../Components/Common/Tab";
import { Headers } from "../Components/ReqDetail/Headers";
import { IconCloseSign } from "../icons/IconCloseSign";
import { Response } from "../Components/ReqDetail/Response";
import { Request } from "../Components/ReqDetail/Request";

export function ReqDetailContainer() {
  const { actions, state } = useNetwork();
  const reqDetail = state.get("reqDetail");
  const handleCloseClick = () => {
    actions.selectRequest(null);
  };

  return (
    <div className="flex flex-col h-full w-full border-l border-border-color bg-white-100 relative">
      <button
        aria-label="Close button"
        className="absolute top-s right-s z-10 p-xs border-0 bg-transparent cursor-pointer hover:bg-bg-gray-90 rounded-base"
        onClick={handleCloseClick}
        type="button"
      >
        <IconCloseSign className="w-5 h-5 fill-brand-primary-gray" />
      </button>
      <Tabs
        activeClassName="text-brand-primary-dark-gray border-brand-blue"
        defaultSelectedKey="headers"
        navLinkClassName="px-m py-s text-h5 font-normal text-brand-primary-gray no-underline cursor-pointer border-b-2 border-transparent hover:text-brand-primary-dark-gray"
        navTabsClassName="flex border-b border-border-color"
        tabsContainerClassName="flex-1 overflow-auto"
      >
        <Tab eventKey="headers" name="Headers">
          <Headers data={reqDetail} />
        </Tab>
        <Tab eventKey="request" name="Request">
          <Request data={reqDetail} />
        </Tab>
        <Tab eventKey="response" name="Response">
          <Response data={reqDetail} />
        </Tab>
      </Tabs>
    </div>
  );
}
