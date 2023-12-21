import { Router } from "express";
import { DecodeToken } from "../util";
import { TeamModel } from "../model";

export const serviceRoute = Router();

serviceRoute.get("/decodeToken", async (req, res) => {

    const userToken = req.headers.authorization
    if (!userToken) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    if (typeof userToken != "string") {
        return res.status(401).json({
            message: "Unauthorized",
        });
    };
    try {
        const UserSession = (await DecodeToken(userToken))?.toJSON();
        if (!UserSession) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        };
        const sessionData = UserSession && {
            creatorID: UserSession.userID,
            ...UserSession,
        }
        if (req.headers.teamID) {
            const TeamID = req.headers.teamID as string
            if (TeamID.trim().length > 0) {
                const Team = await TeamModel.findOne({
                    _id: TeamID,
                })
                if (!Team) {
                    return res.status(401).json({
                        message: "Unauthorized",
                    });
                } else {
                    const members = Team.member.map((v) => v)
                    // if not will create at main account
                    if (members.includes(UserSession?.userID || '')) {
                        if (sessionData?.creatorID) {
                            sessionData.creatorID = Team._id
                        }
                    }
                }
            }
        }

        return res.status(200).json({
            sessionData
        });
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
});