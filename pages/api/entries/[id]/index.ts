import type { NextApiRequest, NextApiResponse } from 'next'
import { json } from 'stream/consumers';
import { db } from '../../../../database';
import { Entry, IEntry } from '../../../../models';

type Data = 
  | {message: string}
  | IEntry

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch ( req.method ) {
    case 'GET':
      return getEntry( req, res );

    case 'PUT':
      return putEntry( req, res );
  
    default:
      return res.status(400).json({
        message: 'this endpoint does not exist',
      })
    }
    
}

const getEntry = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {
  const { id } = req.query;

  await db.connect();
  const entryInDb = await Entry.findById( id );
  await db.disconnect();

  if( !entryInDb ) {
    return res.status(400).json({ message: 'no existe entry para este id'});
  }

  return res.status(200).json( entryInDb )

}

const putEntry = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {
  const { id } = req.query;
  
  await db.connect();
  const entryToUpdate = await Entry.findById( id );
  
  if( !entryToUpdate) {
    await db.disconnect();
    return res.status(400).json({ message: 'no existe entry para este id'});
  }
  const {_id, ...resto } = req.body;

  try {
    const updatedEntry = await Entry.findByIdAndUpdate( id, resto, {runValidators: true, new: true });

    await db.disconnect();

    return res.status(200).json( updatedEntry! );
    
  } catch (error: any) {
    await db.disconnect();
    res.status(400).json({ message: error.errors.status.message })
  }

  const updatedEntry = await Entry.findByIdAndUpdate( id, )
}

