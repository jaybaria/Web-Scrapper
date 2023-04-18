"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = void 0;
async function sendSuccess(statusCode, res, data) {
    if (statusCode === 200 || 201) {
        return res.status(statusCode).json({
            success: true,
            message: "Successfull Response",
            data: data,
        });
    }
    else {
        return res.status(statusCode).json({
            success: false,
            message: "Got Error In Response",
            data: data,
        });
    }
}
exports.sendSuccess = sendSuccess;
