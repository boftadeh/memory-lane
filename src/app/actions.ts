'use server';

import { Memory } from '@/schemas/memory';
import { revalidatePath } from 'next/cache';

export async function getMemories(): Promise<Memory[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/memories`, { 
      headers: {
        'Cache-Control': 'no-store'
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch memories:', response.status, response.statusText);
      return [];
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : data.memories || [];
  } catch (error) {
    console.error('Error fetching memories:', error);
    return [];
  }
}

export async function refreshMemories() {
  revalidatePath('/');
} 