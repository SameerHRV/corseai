"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useProject, useRenameProject } from "../hooks/use-projects";
import { CloudCheckIcon, LoaderIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const fonts = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const Navbar = ({ projectId }: { projectId: Id<"projects"> }) => {
  const project = useProject(projectId);
  const renameProject = useRenameProject();

  const [isRenaming, setIsRenaming] = useState(false);
  const [isName, setIsName] = useState("");

  const handleStartRename = () => {
    if (!project) return;
    setIsName(project.name);
    setIsRenaming(true);
  };

  const handleSubmit = () => {
    if (!project) return;
    setIsRenaming(false);

    const trimmedName = isName.trim();

    if (!trimmedName || trimmedName === project?.name) return;

    renameProject({
      id: project._id,
      name: trimmedName,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsRenaming(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-x-2 p-2 bg-sidebar border-b">
      <div className="flex items-center gap-x-2">
        <Breadcrumb>
          <BreadcrumbList className="gap-0!">
            <BreadcrumbItem>
              <BreadcrumbLink className="flex items-center gap-1.5 " asChild>
                <Button
                  variant={"ghost"}
                  className="w-fit! p-1.5! h-7!"
                  asChild
                >
                  <Link href="/">
                    <Image
                      src={"/logo.svg"}
                      alt="Logo"
                      width={20}
                      height={20}
                    />
                    <span
                      className={cn("text-sm font-medium", fonts.className)}
                    >
                      CorseaiIDE
                    </span>
                  </Link>
                </Button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="ml-0! mr-1" />
            <BreadcrumbItem>
              {isRenaming ? (
                <input
                  autoFocus
                  type="text"
                  value={isName}
                  onChange={(e) => setIsName(e.target.value)}
                  onFocus={(e) => e.currentTarget.select()}
                  onBlur={handleSubmit}
                  onKeyDown={handleKeyDown}
                  className="text-sm bg-transparent text-foreground outline-none focus:ring-1 focus:ring-inset focus:ring-ring font-medium max-w-40 truncate"
                />
              ) : (
                <BreadcrumbPage
                  className="text-sm cursor-pointer hover:text-primary font-medium max-w-40 truncate"
                  onClick={handleStartRename}
                >
                  {project?.name ?? "Loading..."}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {project?.importStatus === "importing" ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="w-fit max-w-xs">
              Importing...
            </TooltipContent>
          </Tooltip>
        ) : (
          project?.updatedAt && (
            <Tooltip>
              <TooltipTrigger asChild>
                <CloudCheckIcon className="size-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="w-fit max-w-xs">
                Saved{" "}
                {project?.updatedAt
                  ? formatDistanceToNow(project.updatedAt, {
                      addSuffix: true,
                    })
                  : "unknown"}
              </TooltipContent>
            </Tooltip>
          )
        )}
      </div>
      <div className="flex items-center gap-3">
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
