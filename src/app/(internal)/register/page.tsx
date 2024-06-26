"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useRef } from "react";
import Image from "react-bootstrap/Image";
import { api } from "~/trpc/react";
import { siteOptionsContext, swalContext } from "../layoutStuff";

export default function Register() {
  const siteOptions = useContext(siteOptionsContext);

  const router = useRouter();
  const searchParams = useSearchParams();
  const query: string | null = searchParams.get("data");
  const swal = useContext(swalContext);
  const registered = useRef(false);

  const register = api.login.registerUser.useMutation({
    onSuccess: (result) => {
      if (result.wasError) {
        swal({
          title: "Error",
          mainText: result.data,
          icon: "error",
          cancelButton: false,
        });
        router.push("/");
      } else {
        localStorage.setItem("session", result.data);
        router.push("/main");
      }
    },
  });
  useEffect(() => {
    if (query && !registered.current) {
      registered.current = true;
      register.mutate(query);
    }
  });
  return (
    <div className="d-flex flex-column container">
      <div
        className="row align-items-center justify-content-center
          min-vh-100"
      >
        <div className="col-12 col-md-8 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="fw-bold text-uppercase mb-2 text-center ">
                {siteOptions.title}
              </h2>
              <Image
                src={siteOptions.icon}
                alt="Brand"
                style={{
                  width: "5rem",
                  left: "calc(50% - 2.5rem)",
                  position: "relative",
                }}
              />
              <div className="mb-4">
                <h5>Registering Account</h5>
                <p className="mb-2">
                  Wait a second while we register your account. The page will
                  load once done
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
