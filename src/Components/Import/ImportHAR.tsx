import React from "react";
import { useDropzone } from "react-dropzone";

import { useNetwork } from "../../state/network/Context";
import ImportHarButton from "../Actions/ImportHarButton";

const DROP_FILE_CONFIG = {
  accept: { "application/json": [".har"] },
  multiple: false,
};

interface ImportHARProps {
  showButton?: boolean;
}

const ImportHAR: React.FC<ImportHARProps> = ({ showButton = true }) => {
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
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {showButton ? (
        <ImportHarButton />
      ) : (
        <p className="text-base text-brand-primary-gray cursor-pointer hover:text-brand-blue">
          Drag and drop HAR file here, or click to select file
        </p>
      )}
    </div>
  );
};

export default ImportHAR;
