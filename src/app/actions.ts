'use server';

import { Memory } from '@/schemas/memory';
import { revalidatePath } from 'next/cache';

export async function getMemories(): Promise<Memory[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/memories`);
    
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

export async function deleteMemory(id: number) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/memories/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete memory: ${response.status} ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting memory:', error);
    throw error;
  }
}

export async function createMemory(data: Memory): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const date = new Date(data.timestamp);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    
    const memoryData = {
      ...data,
      timestamp: adjustedDate.toISOString(),
    };

    const response = await fetch(`${apiUrl}/memories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memoryData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create memory: ${response.status} ${response.statusText}`);
    }

    revalidatePath('/');
    return true;
  } catch (error) {
    console.error('Error creating memory:', error);
    throw error;
  }
}

export async function updateMemory(id: number, data: Memory): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const date = new Date(data.timestamp);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    
    const memoryData = {
      ...data,
      timestamp: adjustedDate.toISOString(),
    };

    const response = await fetch(`${apiUrl}/memories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memoryData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update memory: ${response.status} ${response.statusText}`);
    }

    revalidatePath('/');
    return true;
  } catch (error) {
    console.error('Error updating memory:', error);
    throw error;
  }
} 