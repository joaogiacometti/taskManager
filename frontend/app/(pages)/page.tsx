"use client";

import { ProjectsList } from "./_components/projects-list";
import { CreateProjectDialog } from "./_components/create-project-dialog";
import { Navigation } from "@/components/navigation";
import { useState } from "react";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProjectCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
            <p className="text-gray-600 mt-1">
              Gerencie e organize seus projetos
            </p>
          </div>
          <CreateProjectDialog onProjectCreated={handleProjectCreated} />
        </div>

        <ProjectsList onRefresh={refreshKey} />
      </div>
    </div>
  );
}
