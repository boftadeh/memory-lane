'use server'

import { Memory } from '@/schemas/memory'
import { revalidatePath } from 'next/cache'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const message = `API error ${res.status}: ${res.statusText}`
    console.error(message)
    throw new Error(message)
  }

  return res.json()
}

export async function getMemories(): Promise<Memory[]> {
  try {
    const data = await apiFetch<Memory[] | { memories: Memory[] }>('/memories')
    return Array.isArray(data) ? data : data.memories ?? []
  } catch (error) {
    console.error('Error fetching memories:', error)
    return []
  }
}

export async function refreshMemories() {
  revalidatePath('/')
}

export async function deleteMemory(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    await apiFetch(`/memories/${id}`, { method: 'DELETE' })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function createMemory(data: Memory): Promise<{ success: boolean; error?: string }> {
  try {
    const memoryData = {
      ...data,
      timestamp: new Date(data.timestamp).toISOString(),
    }

    await apiFetch('/memories', {
      method: 'POST',
      body: JSON.stringify(memoryData),
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updateMemory(id: number, data: Memory): Promise<{ success: boolean; error?: string }> {
  try {
    const memoryData = {
      ...data,
      timestamp: new Date(data.timestamp).toISOString(),
    }

    await apiFetch(`/memories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memoryData),
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
