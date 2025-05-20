import { Plus } from "lucide-react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

export default function MataKuliahLayout() {
  const navigate = useNavigate();
  const { kode } = useParams<{ kode?: string }>();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manajemen Mata Kuliah</h1>
        {!kode && (
          <button
            onClick={() => navigate("/mata-kuliah/new")}
            className="bg-indigo-600 text-white px-4 py-2 rounded shadow flex items-center gap-2"
          >
            <Plus size={14} strokeWidth={4} /> Mata Kuliah Baru
          </button>
        )}
      </div>

      <Outlet />
    </div>
  );
}
