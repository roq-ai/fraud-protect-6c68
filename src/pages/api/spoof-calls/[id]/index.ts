import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { spoofCallValidationSchema } from 'validationSchema/spoof-calls';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.spoof_call
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getSpoofCallById();
    case 'PUT':
      return updateSpoofCallById();
    case 'DELETE':
      return deleteSpoofCallById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSpoofCallById() {
    const data = await prisma.spoof_call.findFirst(convertQueryToPrismaUtil(req.query, 'spoof_call'));
    return res.status(200).json(data);
  }

  async function updateSpoofCallById() {
    await spoofCallValidationSchema.validate(req.body);
    const data = await prisma.spoof_call.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteSpoofCallById() {
    const data = await prisma.spoof_call.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
