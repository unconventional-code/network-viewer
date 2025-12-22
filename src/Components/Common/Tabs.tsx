import React, { useState, useEffect, ReactNode } from "react";
import classNames from "classnames";

interface TabItem {
  name: string;
  key: string;
  component: ReactNode;
}

interface TabsProps {
  activeClassName?: string | null;
  children: ReactNode;
  defaultSelectedKey?: string | null;
  navLinkClassName?: string | null;
  navTabsClassName?: string | null;
  onUpdate?: ((key: string) => void) | null;
  selectedKey?: string | null;
  tabsContainerClassName?: string | null;
}

export function Tabs({
  onUpdate = null,
  selectedKey = null,
  defaultSelectedKey = null,
  children,
  navTabsClassName = null,
  tabsContainerClassName = null,
  navLinkClassName = null,
  activeClassName = null,
}: TabsProps) {
  const [items, updateItems] = useState<TabItem[]>([]);

  useEffect(() => {
    const itemsCollection: TabItem[] = [];
    React.Children.forEach(children, (element) => {
      if (React.isValidElement(element)) {
        const { name, eventKey: key, children: component } = element.props;
        itemsCollection.push({
          name,
          key,
          component,
        });
      }
    });
    updateItems(itemsCollection);
  }, [children]);

  const [activeTab, updateTab] = useState<string | null>(
    defaultSelectedKey || (items && items.length ? items[0].key : null)
  );
  const handleUpdate = (key: string) => {
    updateTab(key);
    if (onUpdate) {
      onUpdate(key);
    }
  };

  const renderItem = () => {
    const selectedTab = items.find(
      ({ key }) => key === (selectedKey || activeTab)
    );
    return selectedTab ? selectedTab.component : null;
  };

  return (
    <>
      <nav
        className={classNames(
          "flex border-b border-border-color",
          navTabsClassName
        )}
      >
        {items.map(({ key: item, name }, index) => (
          <a
            key={item}
            className={classNames(
              "px-m py-s text-h5 font-normal text-brand-primary-gray no-underline cursor-pointer border-b-2 border-transparent hover:text-brand-primary-dark-gray",
              navLinkClassName,
              {
                [activeClassName ||
                "text-brand-primary-dark-gray border-brand-blue"]:
                  activeTab === item,
              }
            )}
            onClick={() => handleUpdate(item)}
            role="tab"
            tabIndex={index}
          >
            {name}
          </a>
        ))}
      </nav>
      <section className={classNames(tabsContainerClassName)}>
        {renderItem()}
      </section>
    </>
  );
}
