import mongoose from "mongoose";
import { APIresponse } from "../utils/apiResponse.utils.js";

const sessionAsyncHandler = (requestHandler) => async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await requestHandler(req, res, session);
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        console.log("Error: ", error);

        let statusCode = 500;
        if (error.code === 11000) {
            statusCode = 409;
        } else if (error.status) {
            statusCode = error.status;
        }

        return APIresponse(
            res,
            error.message || "Something went wrong.",
            statusCode || 500,
            false
        );
    } finally {
        session.endSession();
    }
};

export default sessionAsyncHandler;
