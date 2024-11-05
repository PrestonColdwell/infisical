import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@app/config/request";

import { TUserSecret } from "./types";

export const userSecretKeys = {
  allSharedSecrets: () => ["userSecrets"] as const,
  // specificUserSecrets: ({ offset, limit }: { offset: number; limit: number }) =>
  //   [...secretSharingKeys.allSharedSecrets(), { offset, limit }] as const,
  getSecretById: (arg: { id: string }) => ["user-secret", arg]
};

export const useGetUserSecrets = ({
  offset = 0,
  limit = 25
}: {
  offset: number;
  limit: number;
}) => {
  return useQuery({
    // queryKey: secretSharingKeys.specificSharedSecrets({ offset, limit }),
    queryKey: ["userSecrets", { offset, limit }],
    queryFn: async () => {
      const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit)
      });

      const { data } = await apiRequest.get<{ secrets: TUserSecret[]; totalCount: number }>(
        "/api/v1/user-secrets/",
        {
          params
        }
      );
      return data;
    }
  });
};

// export const useGetActiveSharedSecretById = ({
//   sharedSecretId,
//   hashedHex,
//   password
// }: {
//   sharedSecretId: string;
//   hashedHex: string | null;
//   password?: string;
// }) => {
//   return useQuery<TViewSharedSecretResponse>(
//     secretSharingKeys.getSecretById({ id: sharedSecretId, hashedHex, password }),
//     async () => {
//       const { data } = await apiRequest.post<TViewSharedSecretResponse>(
//         `/api/v1/secret-sharing/public/${sharedSecretId}`,
//         {
//           ...(hashedHex && { hashedHex }),
//           password
//         }
//       );

//       return data;
//     },
//     {
//       enabled: Boolean(sharedSecretId)
//     }
//   );
// };
