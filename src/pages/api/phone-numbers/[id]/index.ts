import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { phoneNumberValidationSchema } from 'validationSchema/phone-numbers';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.phone_number
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPhoneNumberById();
    case 'PUT':
      return updatePhoneNumberById();
    case 'DELETE':
      return deletePhoneNumberById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPhoneNumberById() {
    const data = await prisma.phone_number.findFirst(convertQueryToPrismaUtil(req.query, 'phone_number'));
    return res.status(200).json(data);
  }

  async function updatePhoneNumberById() {
    await phoneNumberValidationSchema.validate(req.body);
    const data = await prisma.phone_number.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePhoneNumberById() {
    const data = await prisma.phone_number.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
