// lib/api.ts

// Helper function to handle API errors
const handleApiError = (error: any) => {
    if (error.response) {
      throw new Error(error.response.data.error || 'API request failed');
    }
    throw error;
  };
  
  export const assembleCode = async (code: string): Promise<{
    listing: string;
    log: string;
    object_file_path: string;
  }> => {
    try {
      const formData = new FormData();
      const codeBlob = new Blob([code], { type: 'text/plain' });
      formData.append('asmFile', codeBlob, 'code.asm');
  
      const response = await fetch('http://localhost:5000/assemble', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Assembly failed');
      }
  
      return await response.json();
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };
  
  export const emulateCode = async (objectFilePath: string, command: string): Promise<{
    output: string;
  }> => {
    try {
      const response = await fetch('http://localhost:5000/emulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          object_file_path: objectFilePath,
          command,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Emulation failed');
      }
  
      return await response.json();
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };
  
  export const uploadFile = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('asmFile', file);
  
      const response = await fetch('http://localhost:5000/assemble', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'File upload failed');
      }
  
      return await response.json();
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };
  
  export const downloadFile = async (filename: string): Promise<Blob> => {
    try {
      const response = await fetch(`http://localhost:5000/download/${filename}`);
      
      if (!response.ok) {
        throw new Error('File download failed');
      }
  
      return await response.blob();
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };