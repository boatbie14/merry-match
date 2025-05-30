// hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)

  useEffect(() => {
    if (!userId) {
      setNotifications([])
      setError(null)
      setLoading(false)
      return
    }

    const loadNotifications = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data, error: fetchError } = await supabase
          .from('notifications')
          .select(`
            id,
            message,
            is_read,
            created_at,
            from_user:users (
              id,
              profile_image_url
            )
          `)
          .eq('to_user_id', userId)
          .order('created_at', { ascending: false })

        if (fetchError) {
          throw fetchError
        }

        setNotifications(data || [])
      } catch (err) {
        console.error('Error loading notifications:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [userId])

  const markAsRead = useCallback(
    async (id) => {
      try {
        const { error: updateError } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', id)

        if (updateError) {
          throw updateError
        }

        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, is_read: true } : n
          )
        )
      } catch (err) {
        console.error(`Error marking notification ${id} as read:`, err)
        // you could set a separate error state here if you want to surface it
      }
    },
    []
  )

  return { notifications, markAsRead, loading, error }
}
