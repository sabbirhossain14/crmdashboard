import type { Request,Response,NextFunction } from 'express';
export function notFound(_req:Request,res:Response){res.status(404).json({success:false,message:'Route not found',errors:[]})}
export function errors(err:Error,_req:Request,res:Response,_next:NextFunction){if(process.env.NODE_ENV!=='production')console.error(err);const status=(err as Error&{status?:number}).status||500;res.status(status).json({success:false,message:status===500?'Something went wrong':err.message,errors:[]})}
