import { Response } from "express";
import { ProductInfo } from "../scrapper/models";

export async function sendSuccess(
  statusCode: number,
  res: Response<any, Record<string, any>>,
  data: ProductInfo[]
) {
  if (statusCode === 200 || 201) {
    return res.status(statusCode).json({
      success: true,
      message: "Successfull Response",
      data: data,
    });
  } else {
    return res.status(statusCode).json({
      success: false,
      message: "Got Error In Response",
      data: data,
    });
  }
}
