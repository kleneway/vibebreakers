import { useQuery } from "@tanstack/react-query";

export function useExampleQuery() {
  return useQuery({
    queryKey: ["example"],
    queryFn: async () => {
      return { data: "Hello from React Query" };
    },
  });
}
