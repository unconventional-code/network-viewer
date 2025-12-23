import { useState } from "react";
import { useNetwork } from "../state/network/Context";
import { Headers } from "../Components/ReqDetail/Headers";
import { IconCloseSign } from "../icons/IconCloseSign";
import { Response } from "../Components/ReqDetail/Response";
import { Request } from "../Components/ReqDetail/Request";
import classNames from "classnames";

type TabKey = "headers" | "request" | "response";

export function ReqDetailContainer() {
  const { actions, state } = useNetwork();
  const reqDetail = state.reqDetail;
  const [activeTab, setActiveTab] = useState<TabKey>("headers");

  const handleCloseClick = () => {
    actions.selectRequest(null);
  };

  const tabs: { key: TabKey; name: string; component: React.ReactNode }[] = [
    {
      key: "headers",
      name: "Headers",
      component: <Headers data={reqDetail} />,
    },
    {
      key: "request",
      name: "Request",
      component: <Request data={reqDetail} />,
    },
    {
      key: "response",
      name: "Response",
      component: <Response data={reqDetail} />,
    },
  ];

  const activeTabContent = tabs.find((tab) => tab.key === activeTab)?.component;

  return (
    <div
      id="req-detail-container"
      data-testid="req-detail-container"
      className="flex flex-col h-full w-full border-l border-border-color bg-white-100 relative"
    >
      <button
        id="req-detail-close-button"
        data-testid="req-detail-close-button"
        aria-label="Close button"
        className="absolute top-s right-s z-10 p-xs border-0 bg-transparent cursor-pointer hover:bg-bg-gray-90 rounded-base"
        onClick={handleCloseClick}
        type="button"
      >
        <IconCloseSign className="w-5 h-5 fill-brand-primary-gray" />
      </button>
      <nav
        id="tabs-nav"
        data-testid="tabs-nav"
        className="flex border-b border-border-color"
      >
        {tabs.map((tab, index) => (
          <a
            key={tab.key}
            id={`tab-${tab.key}`}
            data-testid={`tab-${tab.key}`}
            data-active={activeTab === tab.key}
            className={classNames(
              "px-m py-s text-h5 font-normal text-brand-primary-gray no-underline cursor-pointer border-b-2 border-transparent hover:text-brand-primary-dark-gray",
              {
                "text-brand-primary-dark-gray border-brand-blue":
                  activeTab === tab.key,
              }
            )}
            onClick={() => setActiveTab(tab.key)}
            role="tab"
            tabIndex={index}
          >
            {tab.name}
          </a>
        ))}
      </nav>
      <section
        id="tabs-content"
        data-testid="tabs-content"
        className="flex-1 overflow-auto"
      >
        {activeTabContent}
      </section>
    </div>
  );
}
