import { useState } from "react";
import { faEye, faEyeSlash, faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";

import { IconButton, Td, Tr } from "@app/components/v2";
import { TUserSecret } from "@app/hooks/api/userSecrets";
import { UsePopUpState } from "@app/hooks/usePopUp";

export const UserSecretsRow = ({
  row,
  handlePopUpOpen
}: {
  row: TUserSecret;
  handlePopUpOpen: (
    popUpName: keyof UsePopUpState<["deleteUserSecretConfirmation", "editUserSecret"]>,
    {
      name,
      id,
      encryptedData,
      type
    }: {
      name: string;
      id: string;
      encryptedData?: string;
      type?: string;
    }
  ) => void;
}) => {
  const [isDataVisible, setIsDataVisible] = useState(false);

  const toggleDataVisibility = () => {
    setIsDataVisible(!isDataVisible);
  };

  return (
    <Tr key={row.id}>
      <Td>{row.name ? `${row.name}` : "-"}</Td>
      <Td>{row.type ? `${row.type}` : "-"}</Td>
      <Td>
        {isDataVisible ? (
          <div>
            {Object.entries(row.encryptedData).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        ) : (
          "******"
        )}
      </Td>
      <Td>{`${format(new Date(row.createdAt), "yyyy-MM-dd - HH:mm a")}`}</Td>
      <Td>{`${format(new Date(row.updatedAt), "yyyy-MM-dd - HH:mm a")}`}</Td>
      <Td>
        <div style={{ display: "flex", gap: "8px" }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              toggleDataVisibility();
            }}
            variant="plain"
            ariaLabel="toggle visibility"
          >
            <FontAwesomeIcon icon={isDataVisible ? faEyeSlash : faEye} />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handlePopUpOpen("editUserSecret", {
                name: row.name,
                id: row.id,
                type: row.type,
                encryptedData: row.encryptedData
              });
            }}
            variant="plain"
            ariaLabel="update"
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handlePopUpOpen("deleteUserSecretConfirmation", {
                name: "delete",
                id: row.id
              });
            }}
            variant="plain"
            ariaLabel="delete"
          >
            <FontAwesomeIcon icon={faTrash} />
          </IconButton>
        </div>
      </Td>
    </Tr>
  );
};