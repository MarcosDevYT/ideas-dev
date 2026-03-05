"use client";

import { twMerge } from "tailwind-merge";
import { IntegrationsType } from "./Integrations";
import { motion } from "framer-motion";
import React from "react";

export default function IntegrationsColums({
  integrations,
  className,
  reverse,
}: {
  integrations: IntegrationsType;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <motion.div
      initial={{ y: reverse ? "-50%" : 0 }}
      animate={{ y: reverse ? 0 : "-50%" }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      className={twMerge("flex flex-col gap-4 pb-4", className)}
    >
      {Array.from({ length: 2 }).map((_, i) => (
        <React.Fragment key={i}>
          {integrations.map((integration) => (
            <div
              className="bg-card border relative border-white/10 rounded-3xl p-6 py-8 overflow-hidden"
              key={integration.name}
            >
              <div className="absolute inset-0">
                <img
                  src="/bg-hero.png"
                  className="size-full object-cover"
                  alt="bg-hero"
                />
              </div>

              <div className="absolute inset-0 backdrop-blur-md" />

              <div className="flex items-center justify-center relative z-1">
                <img
                  src={integration.icon}
                  alt={integration.name + " logo"}
                  className={`${integration.slug === "tailwind-css" ? "h-32 w-44" : "size-24"} object-contain`}
                />
              </div>
              <div className="relative z-1">
                <h3 className="text-3xl text-center mt-6">
                  {integration.name}
                </h3>
                <p className="text-center text-white/50 mt-2">
                  {integration.description}
                </p>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </motion.div>
  );
}
