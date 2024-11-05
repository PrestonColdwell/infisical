import { Modal, ModalContent } from "@app/components/v2";
import { UsePopUpState } from "@app/hooks/usePopUp";

import { UserSecretForm } from "./UserSecretForm";

type Props = {
  popUp: UsePopUpState<["createUserSecret", "editUserSecret"]>;
  handlePopUpToggle: (
    popUpName: keyof UsePopUpState<["createUserSecret", "editUserSecret"]>,
    state?: boolean
  ) => void;
  handlePopUpClose: (
    popUpName: keyof UsePopUpState<["createUserSecret", "editUserSecret"]>
  ) => void;
};

export const AddUserSecretModal = ({ popUp, handlePopUpToggle, handlePopUpClose }: Props) => {
  return (
    <Modal
      isOpen={popUp?.createUserSecret?.isOpen}
      onOpenChange={(isOpen) => {
        handlePopUpToggle("createUserSecret", isOpen);
      }}
    >
      <ModalContent
        title="Create a Secret"
        subTitle="Please enter your credential details to store them securely."
      >
        <UserSecretForm
          value={(popUp.createUserSecret.data as { value?: string })?.value}
          handlePopUpToggle={handlePopUpToggle}
          handlePopUpClose={handlePopUpClose}
        />
      </ModalContent>
    </Modal>
  );
};
