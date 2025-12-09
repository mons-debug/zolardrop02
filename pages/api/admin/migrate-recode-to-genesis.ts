import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// This endpoint renames RECODE collection to GENESIS
// Run once: GET /api/admin/migrate-recode-to-genesis
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    try {
        // Find existing RECODE collection
        const recodeStack = await prisma.collectionStack.findFirst({
            where: { collectionName: 'RECODE' }
        })

        if (!recodeStack) {
            // Check if GENESIS already exists
            const genesisStack = await prisma.collectionStack.findFirst({
                where: { collectionName: 'GENESIS' }
            })

            if (genesisStack) {
                return res.status(200).json({
                    success: true,
                    message: 'GENESIS collection already exists',
                    stack: {
                        ...genesisStack,
                        images: JSON.parse(genesisStack.images)
                    }
                })
            }

            return res.status(404).json({
                success: false,
                message: 'No RECODE collection found to migrate'
            })
        }

        // Update RECODE to GENESIS
        const updatedStack = await prisma.collectionStack.update({
            where: { id: recodeStack.id },
            data: {
                collectionName: 'GENESIS',
                title: recodeStack.title === 'RECODE' ? 'GENESIS' : recodeStack.title
            }
        })

        return res.status(200).json({
            success: true,
            message: 'Successfully migrated RECODE to GENESIS',
            stack: {
                ...updatedStack,
                images: JSON.parse(updatedStack.images)
            }
        })
    } catch (error) {
        console.error('Migration error:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to migrate collection'
        })
    }
}
