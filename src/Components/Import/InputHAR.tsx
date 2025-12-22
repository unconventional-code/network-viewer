import { URLInput } from "./URLInput";

const SAMPLE_HAR_URL =
  "https://raw.githubusercontent.com/saucelabs/network-viewer/main/examples/src/data/network.har";

export function InputHAR() {
  return (
    <div className="flex flex-col items-center justify-center p-xxl">
      <h4 className="text-h4 font-semibold text-brand-primary-dark-gray mb-m">
        OR add HAR file URL in the below input box
      </h4>
      <URLInput />
      <p className="text-base text-brand-primary-gray">
        <span>For Example use this har file </span>
        <a
          className="text-brand-blue hover:underline"
          href={SAMPLE_HAR_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          {SAMPLE_HAR_URL}
        </a>
      </p>
    </div>
  );
}
