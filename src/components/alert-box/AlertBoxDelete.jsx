import { AlertTriangle } from 'lucide-react';

export default function AlertBoxDelete({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle className="text-red-500" size={28} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">ยืนยันการลบแพ็กเกจ</h2>
            <p className="text-sm text-gray-600 mt-1">คุณแน่ใจหรือไม่ว่าต้องการลบแพ็กเกจนี้? การกระทำนี้ไม่สามารถย้อนกลับได้</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            ลบแพ็กเกจ
          </button>
        </div>
      </div>
    </div>
  );
}
