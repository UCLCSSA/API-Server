import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSessionSchema = new Schema({
    wechatSession: {
        openId: {
            type: String,
            default: '',
        },
        sessionKey: {
            type: String,
            default: '',
        },
    },
    uclcssaSession: {
        uclcssaToken: {
            type: String,
            default: '',
        },
        expirationTime: {
            type: Date,
            default: Date.now,
        },
    },
    uclApiToken: {
        type: String,
        default: '',
    },
});

export default userSessionSchema;
