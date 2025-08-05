import { baseUrl } from '../config/routes';

const PROGRAMMING_API_URL = `${baseUrl}/api/v1/programming`;

export interface ProgrammingProblem {
  _id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  link: string;
  category: string;
  tags: string[];
  description?: string;
  platformName?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface ProgrammingProblemsResponse {
  success: boolean;
  problems: ProgrammingProblem[];
  pagination: PaginationInfo;
}

export interface ProgrammingProblemsParams {
  category?: string;
  difficulty?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Get all programming problems
export const getAllProgrammingProblems = async (
  params: ProgrammingProblemsParams = {}
): Promise<ProgrammingProblemsResponse> => {
  try {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const response = await fetch(`${PROGRAMMING_API_URL}?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching programming problems:', error);
    throw error;
  }
};

// Get DSA-specific problems
export const getDSAProblems = async (
  params: Omit<ProgrammingProblemsParams, 'category'> = {}
): Promise<ProgrammingProblemsResponse> => {
  try {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const response = await fetch(`${PROGRAMMING_API_URL}/dsa?${searchParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching DSA problems:', error);
    throw error;
  }
};

// Create programming problem (Admin only)
export const createProgrammingProblem = async (
  problemData: Omit<ProgrammingProblem, '_id'>
): Promise<{ success: boolean; problem: ProgrammingProblem; message: string }> => {
  try {
    const response = await fetch(PROGRAMMING_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(problemData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating programming problem:', error);
    throw error;
  }
};

// Update programming problem (Admin only)
export const updateProgrammingProblem = async (
  problemId: string,
  problemData: Partial<ProgrammingProblem>
): Promise<{ success: boolean; problem: ProgrammingProblem; message: string }> => {
  try {
    const response = await fetch(`${PROGRAMMING_API_URL}/${problemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(problemData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating programming problem:', error);
    throw error;
  }
};

// Delete programming problem (Admin only)
export const deleteProgrammingProblem = async (
  problemId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${PROGRAMMING_API_URL}/${problemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting programming problem:', error);
    throw error;
  }
};
