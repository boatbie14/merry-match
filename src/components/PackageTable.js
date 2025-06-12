import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { FiTrash2, FiEdit, FiMenu } from 'react-icons/fi'
import Image from 'next/image'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function PackageTable() {
  const router = useRouter()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPackages()
  }, [])

  async function fetchPackages() {
    const { data, error } = await supabase
      .from('packages')
      .select('id, icon_url, package_name, merry_per_day, price, created_at, order')
      .order('order', { ascending: true })

    if (error) {
      console.error('Error fetching packages:', error.message)
    } else {
      setPackages(data)
    }
    setLoading(false)
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '-'
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }

  async function handleDelete(id) {
    const confirm = window.confirm('Are you sure you want to delete this package?')
    if (!confirm) return

    const { error } = await supabase.from('packages').delete().eq('id', id)
    if (error) {
      alert('Failed to delete package: ' + error.message)
    } else {
      setPackages(packages.filter((p) => p.id !== id))
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  const handleDragEnd = async (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = packages.findIndex((p) => p.id === active.id)
    const newIndex = packages.findIndex((p) => p.id === over.id)
    const newOrder = arrayMove(packages, oldIndex, newIndex)

    setPackages(newOrder)

 
    const updates = newOrder.map((pkg, index) => ({
      id: pkg.id,
      order: index + 1
    }))

    const { error } = await supabase
      .from('packages')
      .upsert(updates, { onConflict: 'id' })

    if (error) {
      console.error('Error updating order:', error.message)
    }
  }

  if (loading) return <p>Loading packages...</p>

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Merry Package</h1>
        <button
          onClick={() => router.push('/admin/createPackage')}
          className="bg-[#C70039] hover:bg-[#a8002f] text-white px-5 py-2 rounded-full transition duration-200"
        >
          + Add Package
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={packages.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-[#f2f4f8] text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-xl w-16">☰</th>
                  <th className="px-4 py-3 font-medium">Icon</th>
                  <th className="px-4 py-3 font-medium">Package name</th>
                  <th className="px-4 py-3 font-medium">Merry limit</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Created Date</th>
                  <th className="px-4 py-3 font-medium rounded-tr-xl text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {packages.map((pkg, index) => (
                  <SortableRow
                    key={pkg.id}
                    pkg={pkg}
                    index={index}
                    formatDateTime={formatDateTime}
                    router={router}
                    handleDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}

function SortableRow({ pkg, index, formatDateTime, router, handleDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: pkg.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <tr ref={setNodeRef} style={style} {...attributes} className="hover:bg-gray-50">
      <td className="px-4 py-3 text-gray-800 cursor-grab" {...listeners}>
        <FiMenu size={18} /> 
      </td>
      <td className="px-4 py-3">
        {pkg.icon_url ? (
          <Image
            src={pkg.icon_url}
            alt={pkg.package_name}
            width={24}
            height={24}
            className="rounded-md object-cover"
          />
        ) : (
          <div className="w-6 h-6 bg-gray-200 rounded-md" />
        )}
      </td>
      <td className="px-4 py-3 font-medium">{pkg.package_name}</td>
      <td className="px-4 py-3">
        {pkg.merry_per_day !== null ? `${pkg.merry_per_day} Merry` : 'ไม่จำกัด'}
      </td>
      <td className="px-4 py-3">{pkg.price ? `${pkg.price.toLocaleString()} ฿` : '-'}</td>
      <td className="px-4 py-3">{formatDateTime(pkg.created_at)}</td>
      <td className="px-4 py-3 text-center flex gap-3 justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/admin/edit-package?id=${pkg.id}`)
          }}
          className="text-pink-500 hover:text-pink-700"
        >
          <FiEdit size={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDelete(pkg.id)
          }}
          className="text-pink-500 hover:text-pink-700"
        >
          <FiTrash2 size={18} />
        </button>
      </td>
    </tr>
  )
}
