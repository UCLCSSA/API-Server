CREATE TABLE IF NOT EXISTS UserSessions
(
    -- UCLCSSA session key is the hex digest of SHA-256 HMAC using WechatOpenId
    -- and WechatSessionKey used to validate a user session.
    UclcssaSessionKey CHAR(64) NOT NULL DEFAULT '',
    CreationDatetime DATETIME NOT NULL DEFAULT (NOW()),
    -- Used to calculate whether a user session is expired or not. If a user
    -- successfully authenticates via a protected route, the LastUsed datetime
    -- shall be correspondingly updated. This automatically extends the user
    -- session's validity period.
    LastUsed DATETIME NOT NULL DEFAULT (NOW()),
    -- WeChat openId is *supposedly* 28 characters long, but there does not seem
    -- to be any official documentation on its length. Hence, it is reserved to
    -- be 64 characters long should its length change in the future. If the
    -- openId retrieved is not sufficiently long, space characters U+0020
    -- shall be used to pad the openId (i.e. space padding concatenated with
    -- openId).
    WechatOpenId CHAR(64) NOT NULL DEFAULT '',
    WechatSessionKey CHAR(64) NOT NULL DEFAULT '',
    UclapiToken CHAR(64) NOT NULL DEFAULT '',
    -- The user's WeChat openId serves as the primary key to ensure each user
    -- only has one associated valid UclcssaSessionKey.
    PRIMARY KEY (WechatOpenId)
);
