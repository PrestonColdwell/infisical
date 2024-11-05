import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";

import { userSecretKeys } from "./queries";
import { TDeleteUserSecretRequest, TUserSecret } from "./types";

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

// export const useCreatePublicSharedSecret = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (inputData: TCreateSharedSecretRequest) => {
//       const { data } = await apiRequest.post<TCreatedSharedSecret>(
//         "/api/v1/secret-sharing/public",
//         inputData
//       );
//       return data;
//     },
//     onSuccess: () => queryClient.invalidateQueries(secretSharingKeys.allSharedSecrets())
//   });
// };

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
