import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createMataKuliah,
  getMataKuliahByKode,
  updateMataKuliah,
} from "@/services/api";
import type { MataKuliahType } from "@/types/mata-kuliah";
import Swal from "sweetalert2";

const initialForm: MataKuliahType = {
  kode: "",
  nama: "",
  sks: 1,
  jurusan: "",
  semester: "",
};

export default function MataKuliahForm() {
  const [form, setForm] = useState<MataKuliahType>(initialForm);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { kode } = useParams<{ kode?: string }>();
  const isEdit = !!kode;

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  useEffect(() => {
    if (isEdit) {
      const fetchData = async () => {
        try {
          const data = await getMataKuliahByKode(kode!);
          if (data.status !== 200) {
            throw new Error("Gagal mengambil data mata kuliah.");
          }
          setForm(data.data as MataKuliahType);
        } catch (err) {
          Toast.fire({
            icon: "error",
            title: "Gagal mengambil data mata kuliah.",
          });
          navigate("/mata-kuliah");
          console.error(err);
        }
      };
      fetchData();
    }
  }, [isEdit, kode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "sks" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await updateMataKuliah(kode!, form);
      } else {
        await createMataKuliah(form);
      }
      Toast.fire({
        icon: "success",
        title: isEdit
          ? "Data mata kuliah berhasil diperbarui."
          : "Mata Kuliah berhasil ditambahkan.",
      });
      navigate("/mata-kuliah");
    } catch (err: any) {
      const message = err.response.data.message || null;
      Toast.fire({
        icon: "error",
        title: isEdit
          ? message
            ? message
            : "Gagal memperbarui data mata kuliah."
          : message
          ? message
          : "Gagal menambahkan mata kuliah.",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Kode</label>
          <input
            name="kode"
            type="text"
            value={form.kode}
            onChange={handleChange}
            required
            disabled={isEdit}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nama</label>
          <input
            name="nama"
            type="text"
            value={form.nama}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">SKS</label>
          <input
            name="sks"
            type="number"
            value={form.sks}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Semester</label>
          <input
            name="semester"
            type="text"
            value={form.semester}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Jurusan</label>
          <input
            name="jurusan"
            type="text"
            value={form.jurusan}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="md:col-span-2 flex justify-between mt-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : isEdit ? "Update" : "Simpan"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/mata-kuliah")}
            className="text-sm text-gray-500 hover:underline"
          >
            Batal / Kembali
          </button>
        </div>
      </form>
    </div>
  );
}
