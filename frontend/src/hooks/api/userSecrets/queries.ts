import { useQuery } from "@tanstack/react-query";
import CryptoJS from "crypto-js";

import { apiRequest } from "@app/config/request";

import { TUserSecret } from "./types";

const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

export const userSecretKeys = {
  allSharedSecrets: () => ["userSecrets"] as const,
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

      const decryptedSecrets = data.secrets.map((secret) => {
        if (!key) {
          throw new Error("Encryption key is undefined");
        }
        try {
          const decryptedData = Object.entries(secret.encryptedData).reduce(
            (acc, [field, encryptedValue]) => {
              const bytes = CryptoJS.AES.decrypt(encryptedValue, key);
              const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
              acc[field] = decryptedValue;
              return acc;
            },
            {} as { [key: string]: string }
          );

          return {
            ...secret,
            encryptedData: decryptedData
          };
        } catch (error) {
          console.error("Decryption error:", error);
          return secret;
        }
      });

      return {
        ...data,
        secrets: decryptedSecrets
      };
    }
  });
};
