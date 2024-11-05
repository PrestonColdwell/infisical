import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createNotification } from "@app/components/notifications";
import { Button, FormControl, Input, Select, SelectItem } from "@app/components/v2";
import { useCreateUserSecret, useEditUserSecret } from "@app/hooks/api/userSecrets";
import { UsePopUpState } from "@app/hooks/usePopUp";

const typeOptions = [
  { label: "Web Login", value: "0" },
  { label: "Credit Card", value: "1" },
  { label: "Secure Note", value: "2" }
];

const schema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  encryptedData: z.union([
    z.object({
      username: z.string(),
      password: z.string()
    }),
    z.object({
      cardNumber: z.string(),
      expirationDate: z.string(),
      cvv: z.string()
    }),
    z.object({
      content: z.string()
    }),
    z.object({})
  ])
});

export type FormData = z.infer<typeof schema>;

type Props = {
  value?: string;
  editMode?: boolean;
  formValues?: FormData;
  handlePopUpToggle: (
    popUpName: keyof UsePopUpState<["editUserSecret"] | ["createUserSecret"]>,
    state?: boolean
  ) => void;
  handlePopUpClose: (
    popUpName: keyof UsePopUpState<["editUserSecret"] | ["createUserSecret"]>
  ) => void;
};

export const UserSecretForm = ({
  editMode = false,
  formValues,
  handlePopUpClose
}: Props) => {
  const [selectedType, setSelectedType] = useState("0");

  const createUserSecret = useCreateUserSecret();
  const editUserSecret = useEditUserSecret();

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: formValues?.name || "",
      type: formValues?.type || "0",
      encryptedData: formValues?.encryptedData || {}
    }
  });

  const onFormSubmit = async (data: FormData) => {
    if (editMode) {
      try {
        const serializedData = {
          ...data,
          encryptedData: JSON.stringify(data.encryptedData)
        };

        await editUserSecret.mutateAsync({
          inputData: {
            ...serializedData,
            id: formValues?.id || ""
          },
          userSecretId: formValues?.id || ""
        });

        reset();

        createNotification({
          text: "Secret successfully updated.",
          type: "success"
        });

        handlePopUpClose("editUserSecret");
      } catch (error) {
        console.error(error);
        createNotification({
          text: "Failed to update user secret.",
          type: "error"
        });
      }
    } else {
      try {
        const serializedData = {
          ...data,
          encryptedData: JSON.stringify(data.encryptedData)
        };

        await createUserSecret.mutateAsync(serializedData);

        reset();

        createNotification({
          text: "Secret successfully created.",
          type: "success"
        });

        handlePopUpClose("createUserSecret");
      } catch (error) {
        console.error(error);
        createNotification({
          text: "Failed to create user secret.",
          type: "error"
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState: { error } }) => (
          <FormControl label="Name" isError={Boolean(error)} errorText={error?.message}>
            <Input {...field} placeholder="My Secret's Name" type="text" />
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="type"
        defaultValue="0"
        render={({ field: { onChange, ...field }, fieldState: { error } }) => (
          <FormControl label="Type" errorText={error?.message} isError={Boolean(error)}>
            <Select
              defaultValue={field.value}
              {...field}
              onValueChange={(e) => {
                onChange(e);
                setSelectedType(e);
                setValue("encryptedData", {});
              }}
              className="w-full"
            >
              {typeOptions.map(({ label, value: typeValue }) => (
                <SelectItem value={String(typeValue || "")} key={label}>
                  {label}
                </SelectItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      {selectedType === "0" && (
        <>
          <Controller
            control={control}
            name="encryptedData.username"
            render={({ field, fieldState: { error } }) => (
              <FormControl label="Username" isError={Boolean(error)} errorText={error?.message}>
                <Input {...field} placeholder="Username" type="text" />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="encryptedData.password"
            render={({ field, fieldState: { error } }) => (
              <FormControl label="Password" isError={Boolean(error)} errorText={error?.message}>
                <Input {...field} placeholder="Password" type="password" />
              </FormControl>
            )}
          />
        </>
      )}

      {selectedType === "1" && (
        <>
          <Controller
            control={control}
            name="encryptedData.cardNumber"
            render={({ field, fieldState: { error } }) => (
              <FormControl label="Card Number" isError={Boolean(error)} errorText={error?.message}>
                <Input {...field} placeholder="Card Number" type="text" />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="encryptedData.expirationDate"
            render={({ field, fieldState: { error } }) => (
              <FormControl
                label="Expiration Date"
                isError={Boolean(error)}
                errorText={error?.message}
              >
                <Input {...field} placeholder="MM/YY" type="text" />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="encryptedData.cvv"
            render={({ field, fieldState: { error } }) => (
              <FormControl label="CVV" isError={Boolean(error)} errorText={error?.message}>
                <Input {...field} placeholder="CVV" type="text" />
              </FormControl>
            )}
          />
        </>
      )}

      {selectedType === "2" && (
        <Controller
          control={control}
          name="encryptedData.content"
          render={({ field, fieldState: { error } }) => (
            <FormControl label="Content" isError={Boolean(error)} errorText={error?.message}>
              <textarea
                {...field}
                placeholder="Enter your secure note..."
                className="h-40 min-h-[70px] w-full rounded-md border border-mineshaft-600 bg-mineshaft-900 py-1.5 px-2 text-bunker-300 outline-none transition-all placeholder:text-mineshaft-400 hover:border-primary-400/30 focus:border-primary-400/50"
              />
            </FormControl>
          )}
        />
      )}

      <Button
        className="mt-4"
        size="sm"
        type="submit"
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
      >
        {editMode ? "Edit Secret" : "Create Secret"}
      </Button>
    </form>
  );
};
