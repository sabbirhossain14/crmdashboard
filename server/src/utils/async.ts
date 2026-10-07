import type { Request,Response,NextFunction } from 'express';
export const wrap=(fn:(req:Request,res:Response,next:NextFunction)=>Promise<unknown>)=>(req:Request,res:Response,next:NextFunction)=>{void fn(req,res,next).catch(next)};
export const ok=(res:Response,data:unknown,status=200)=>res.status(status).json({success:true,data});
