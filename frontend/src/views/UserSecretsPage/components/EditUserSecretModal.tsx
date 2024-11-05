import { Modal, ModalContent } from "@app/components/v2";
import { UsePopUpState } from "@app/hooks/usePopUp";

import { UserSecretForm } from "./UserSecretForm";

type Props = {
  popUp: UsePopUpState<["editUserSecret", "createUserSecret"]>;
  handlePopUpToggle: (
    popUpName: keyof UsePopUpState<["editUserSecret", "createUserSecret"]>,
    state?: boolean
  ) => void;
  handlePopUpClose: (
    popUpName: keyof UsePopUpState<["editUserSecret", "createUserSecret"]>
  ) => void;
};

export const EditUserSecretModal = ({ popUp, handlePopUpToggle, handlePopUpClose }: Props) => {
  return (
    <Modal
      isOpen={popUp?.editUserSecret?.isOpen}
      onOpenChange={(isOpen) => {
        handlePopUpToggle("editUserSecret", isOpen);
      }}
    >
      <ModalContent
        title="Edit Secret"
        subTitle="Please enter your credential details to store them securely."
      >
        <UserSecretForm
          formValues={popUp.editUserSecret.data}
          value={(popUp.editUserSecret.data as { value?: string })?.value}
          editMode
          handlePopUpToggle={handlePopUpToggle}
          handlePopUpClose={handlePopUpClose}
        />
      </ModalContent>
    </Modal>
  );
};
