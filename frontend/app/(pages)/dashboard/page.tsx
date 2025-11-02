import { Navigation } from "@/components/navigation";
import { DashboardContent } from "./_components/dashboard-content";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Acompanhe o andamento das suas tarefas e projetos
          </p>
        </div>

        <DashboardContent />
      </div>
    </div>
  );
}
