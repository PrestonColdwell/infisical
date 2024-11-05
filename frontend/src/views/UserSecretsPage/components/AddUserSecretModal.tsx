import { Modal, ModalContent } from "@app/components/v2";
import { UsePopUpState } from "@app/hooks/usePopUp";
import { ShareSecretForm } from "@app/views/ShareSecretPublicPage/components";

type Props = {
  popUp: UsePopUpState<["createUserSecret"]>;
  handlePopUpToggle: (
    popUpName: keyof UsePopUpState<["createUserSecret"]>,
    state?: boolean
  ) => void;
};

export const AddUserSecretModal = ({ popUp, handlePopUpToggle }: Props) => {
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
        <ShareSecretForm
          isPublic={false}
          value={(popUp.createUserSecret.data as { value?: string })?.value}
        />
      </ModalContent>
    </Modal>
  );
};
