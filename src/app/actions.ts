'use server';

import { Memory } from '@/schemas/memory';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getMemories(): Promise<Memory[]> {
  try {
    const response = await fetch(`${API_URL}/memories`);
    
    if (!response.ok) {
      console.error('Failed to fetch memories:', response.status, response.statusText);
      return [];
    }
    
    const data = (await response.json()) as Memory[] | { memories: Memory[] };
    return Array.isArray(data) ? data : data.memories || [];
  } catch (error) {
    console.error('Error fetching memories:', error);
    return [];
  }
}

export async function deleteMemory(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/memories/${id}`, {
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
    const date = new Date(data.timestamp);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    
    const memoryData = {
      ...data,
      timestamp: adjustedDate.toISOString(),
    };

    const response = await fetch(`${API_URL}/memories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memoryData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create memory: ${response.status} ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error creating memory:', error);
    throw error;
  }
}

export async function updateMemory(id: number, data: Memory): Promise<boolean> {
  try {
    const date = new Date(data.timestamp);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    
    const memoryData = {
      ...data,
      timestamp: adjustedDate.toISOString(),
    };

    const response = await fetch(`${API_URL}/memories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memoryData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update memory: ${response.status} ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error updating memory:', error);
    throw error;
  }
} 