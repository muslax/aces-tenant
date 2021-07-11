import Link from "next/link"

export default function NoPersonae({ project, isAdmin }) {
  return (
    <div className="border-b -border-gray-300 text-center px-5 py-6">
      <h2 className="text-lg text-pink-500  font-bold mb-7">
        Belum ada daftar peserta
      </h2>

      {isAdmin && (
        <div>
            <p className="text-base mb-4">
              Klik tombol di bawah untuk mengupload daftar peserta.
            </p>
            <p>
              <Link href={`/projects/${project._id}/import-csv`}>
                <a
                  className="inline-flex font-semibold text-green-500 rounded-sm border border-green-500 hover:border-green-400 hover:text-green-600 active:border-green-500 active:text-green-700 px-5 py-2"
                >Upload CSV File</a>
              </Link>
            </p>
        </div>
      )}

      {!isAdmin && (
        <div>
          <p className="text-base">
            Hanya admin proyek yang dapat membuat dan menambah daftar peserta.
          </p>
        </div>
      )}

    </div>
  )
}