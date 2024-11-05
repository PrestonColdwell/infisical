import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";

import { TCreatedSharedSecret } from "../secretSharing";
import { userSecretKeys } from "./queries";
import { TDeleteUserSecretRequest, TEditUserSecretRequest, TUserSecret } from "./types";

export const useCreateUserSecret = () => {
  console.log("createUserSecretReached");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (inputData: any) => {
      const { data } = await apiRequest.post<any>("/api/v1/user-secrets", inputData);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(userSecretKeys.allSharedSecrets())
  });
};

export const useEditUserSecret = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      inputData,
      userSecretId
    }: {
      inputData: TEditUserSecretRequest;
      userSecretId: string;
    }) => {
      const { data } = await apiRequest.put<TCreatedSharedSecret>(
        `/api/v1/user-secrets/${userSecretId}`,
        inputData
      );
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(userSecretKeys.allSharedSecrets())
  });
};

export const useDeleteUserSecret = () => {
  const queryClient = useQueryClient();
  return useMutation<TUserSecret, { message: string }, { userSecretId: string }>({
    mutationFn: async ({ userSecretId }: TDeleteUserSecretRequest) => {
      const { data } = await apiRequest.delete<TUserSecret>(`/api/v1/user-secrets/${userSecretId}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(userSecretKeys.allSharedSecrets())
  });
};
