import { useEffect, useState } from "react";
import { deleteMataKuliah, getMataKuliah } from "@/services/api";
import type { MataKuliahType } from "@/types/mata-kuliah";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export default function MataKuliahList() {
  const navigate = useNavigate();
  const [data, setData] = useState<MataKuliahType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    await getMataKuliah()
      .then((res) => setData(res.data as MataKuliahType[]))
      .catch(() => alert("Gagal mengambil data mata kuliah"));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pageData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (kode: string) => {
    Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data Mata Kuliah yang sudah dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMataKuliah(kode).then((res) => {
          if (res.status == 200) {
            Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
            fetchData();
          } else {
            Swal.fire("Gagal!", "Data gagal dihapus.", "error");
          }
        });
      }
    });
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg shadow border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-3 border">KODE</th>
              <th className="px-4 py-3 border">Nama</th>
              <th className="px-4 py-3 border">SKS</th>
              <th className="px-4 py-3 border">Semester</th>
              <th className="px-4 py-3 border">Jurusan</th>
              <th className="px-4 py-3 border">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {pageData.map((matkul) => (
              <tr key={matkul.kode} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{matkul.kode}</td>
                <td className="px-4 py-2 border">{matkul.nama}</td>
                <td className="px-4 py-2 border">{matkul.sks}</td>
                <td className="px-4 py-2 border text-center">
                  {matkul.semester}
                </td>
                <td className="px-4 py-2 border">{matkul.jurusan}</td>
                <td className="px-4 py-2 border">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`edit/${matkul.kode}`)}
                      className="w-6 h-6 flex items-center justify-center border border-[#6d75f6] rounded"
                    >
                      <Pencil size={14} color="#6d75f6" />
                    </button>
                    <button
                      onClick={() => handleDelete(matkul.kode)}
                      className="w-6 h-6 flex items-center justify-center border border-[#ff0000] rounded"
                    >
                      <Trash2 size={14} color="#ff0000" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Tidak ada data mata kuliah.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-2 mt-4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-8 h-8 rounded ${
              currentPage === i + 1
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-800 border"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
