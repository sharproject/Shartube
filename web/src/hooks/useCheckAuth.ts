"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { meQueryDocument } from "@/util/rawSchemaDocument"
import { useQuery } from "@apollo/client";

/**
 *
 * @returns
 */

export const useCheckAuth = () => {
  const router = useRouter();
  const pathname = usePathname()
  const { data, loading, error } = useQuery(meQueryDocument);

  useEffect(() => {
    //if (error!= null || error!= undefined){
    //   if (window){
    //     window.localStorage.removeItem("token");
    //   }
    // }
    console.log({ error });
    console.log({ pathname })
    const isInLoginOrRegisterPage =
      pathname == "/login" ||
      pathname == "/register" ||
      pathname == "/forgot-password" ||
      pathname == "/change-password";
    if (!loading && data?.Me && isInLoginOrRegisterPage) {
      router.replace("/");
    }
  }, [data, loading, router, error]);
  return {
    data,
    loading,
    error,
  };
};
