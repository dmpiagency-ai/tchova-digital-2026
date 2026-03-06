import { NextApiRequest, NextApiResponse } from 'next';
import { getToolById } from '@/config/gsmToolsConfig';
import { createChecktoolRequest, updateChecktoolResult } from '@/services/gsmFirebase';
import { ChecktoolRequest } from '@/types/gsm';

// Mock external API check
const mockChecktoolExternalAPI = async (toolId: string, inputData: { imei?: string; serial?: string }) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock responses based on tool and input
  if (toolId === 'mdm-fix-tool') {
    if (inputData.imei?.startsWith('35')) {
      return {
        status: 'success',
        details: {
          status: 'MDM Locked',
          network: 'Vodafone',
          country: 'Portugal',
          model: 'iPhone 13',
          mdmProvider: 'Microsoft Intune'
        }
      };
    } else {
      return {
        status: 'success',
        details: {
          status: 'Not Locked',
          network: 'Unlocked',
          country: 'Unknown',
          model: 'Unknown',
          mdmProvider: null
        }
      };
    }
  }
  
  if (toolId === 'chimera-tool') {
    if (inputData.imei?.endsWith('8')) {
      return {
        status: 'success',
        details: {
          status: 'FRP Locked',
          network: 'Orange',
          country: 'Spain',
          model: 'Samsung Galaxy S21',
          frpVersion: '1.0'
        }
      };
    } else {
      return {
        status: 'success',
        details: {
          status: 'FRP Unlocked',
          network: 'Unlocked',
          country: 'Unknown',
          model: 'Unknown',
          frpVersion: null
        }
      };
    }
  }
  
  // Default response
  return {
    status: 'success',
    details: {
      status: 'Status Unknown',
      network: 'Unknown',
      country: 'Unknown',
      model: 'Unknown'
    }
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { toolId, inputData, userId } = req.body;
      
      // Validate input
      if (!toolId || (!inputData?.imei && !inputData?.serial)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Tool ID and either IMEI or Serial number are required'
          }
        });
      }
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'USER_REQUIRED',
            message: 'User ID is required'
          }
        });
      }
      
      // Check if tool exists
      const tool = getToolById(toolId);
      if (!tool) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'TOOL_NOT_FOUND',
            message: 'Tool not found'
          }
        });
      }
      
      // Validate required inputs
      if (tool.requires_imei && !inputData.imei) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'IMEI_REQUIRED',
            message: 'IMEI number is required for this tool'
          }
        });
      }
      
      if (tool.requires_serial && !inputData.serial) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'SERIAL_REQUIRED',
            message: 'Serial number is required for this tool'
          }
        });
      }
      
      // Create checktool request
      const request: ChecktoolRequest = {
        id: `check_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        toolId,
        inputData: {
          ...(inputData.imei ? { imei: inputData.imei } : {}),
          ...(inputData.serial ? { serial: inputData.serial } : {})
        },
        result: {
          status: 'pending',
          details: {}
        },
        cost: 0, // Free check for demo purposes
        createdAt: new Date()
      };
      
      // Save to Firebase
      const requestId = await createChecktoolRequest(request);
      if (!requestId) {
        return res.status(500).json({
          success: false,
          error: {
            code: 'SERVER_ERROR',
            message: 'Failed to create checktool request'
          }
        });
      }
      
      // Call external API
      const checkResult = await mockChecktoolExternalAPI(toolId, inputData);
      
      // Update request with result
      await updateChecktoolResult(requestId, checkResult);
      
      return res.status(200).json({
        success: true,
        data: {
          requestId,
          ...checkResult
        },
        message: 'Check completed successfully'
      });
      
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).json({
        success: false,
        error: {
          code: 'METHOD_NOT_ALLOWED',
          message: `Method ${req.method} not allowed`
        }
      });
    }
  } catch (error) {
    console.error('Checktool API error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error'
      }
    });
  }
}