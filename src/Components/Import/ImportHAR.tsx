import { useDropzone } from "react-dropzone";

import { useNetwork } from "../../state/network/Context";
import { ImportHarButton } from "../Actions/ImportHarButton";

const DROP_FILE_CONFIG = {
  accept: { "application/json": [".har"] },
  multiple: false,
};

interface ImportHARProps {
  showButton?: boolean;
}

export function ImportHAR({ showButton = true }: ImportHARProps) {
  const { actions } = useNetwork();
  const { updateErrorMessage } = actions;

  const prepareData = (newNetworkData: any) =>
    actions.updateData(newNetworkData);

  const onDrop = (files: File[]) => {
    const reader = new FileReader();
    reader.onabort = () =>
      updateErrorMessage({ title: "file reading was aborted" });
    reader.onerror = () =>
      updateErrorMessage({ title: "file reading has failed" });
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        prepareData(data);
      } catch (error) {
        updateErrorMessage({ title: "Error while parsing HAR file" });
      }
    };
    reader.readAsText(files[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    ...DROP_FILE_CONFIG,
    onDrop,
  });

  return (
    <div
      id="import-har-dropzone"
      data-testid="import-har-dropzone"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {showButton ? (
        <ImportHarButton />
      ) : (
        <p
          id="import-har-text"
          data-testid="import-har-text"
          className="text-base text-brand-primary-gray cursor-pointer hover:text-brand-blue"
        >
          Drag and drop HAR file here, or click to select file
        </p>
      )}
    </div>
  );
}
