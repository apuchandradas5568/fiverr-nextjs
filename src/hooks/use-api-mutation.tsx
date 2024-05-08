"use client";

import { useMutation } from "convex/react";
import { useState } from "react";

export const useApiMutation = (mutationFunction: any) => {
  const [pending, setPending] = useState(false);
  const apiMutation = useMutation(mutationFunction);

  const mutate = async (data: any) => {
    setPending(true);
    return apiMutation(data)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => setPending(false));
  };

  return { mutate, pending };
};
