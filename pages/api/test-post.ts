import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Test endpoint hit! Method:', req.method)
  
  if (req.method === 'POST') {
    return res.status(200).json({ 
      success: true, 
      message: 'POST works!',
      body: req.body
    })
  }
  
  if (req.method === 'GET') {
    return res.status(200).json({ 
      success: true, 
      message: 'GET works!' 
    })
  }
  
  return res.status(405).json({ message: 'Method not allowed' })
}

