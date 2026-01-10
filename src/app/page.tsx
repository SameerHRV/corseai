"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function Home() {
  const projects = useQuery(api.projects.getProject, {});

  const createProject = useMutation(api.projects.createProject);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24 sm:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Welcome to your Convex Starter Kit
      </h1>
      <p className="mt-6 text-base leading-7 text-gray-600">
        This is your Convex Starter Kit. You can use it to get started with
        Convex quickly.
      </p>
      <div>
        <Button
          onClick={() =>
            createProject({
              name: "New Project",
            })
          }
        >
          Add new project
        </Button>
      </div>
      {projects?.map((project) => (
        <div key={project._id}>
          <p>{project.name}</p>
          <p>{project.ownerId}</p>
        </div>
      ))}
    </main>
  );
}
