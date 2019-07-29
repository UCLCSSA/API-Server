-- Ensure timezone is UTC+0 for standardization
SET TIME_ZONE = '+00:00';

-- Missing strings default to full-length spaces.
CREATE TABLE IF NOT EXISTS UserSessions
(
    -- UCLCSSA session key is the hex digest of SHA-256 HMAC using WechatOpenId
    -- and WechatSessionKey used to validate a user session.
    UclcssaSessionKey CHAR(64) NOT NULL DEFAULT (REPEAT(' ', 64)),
    -- Used to calculate whether UclcssaSessionKey is expired or not.
    CreationDatetime DATETIME NOT NULL DEFAULT (NOW()),
    -- WeChat openId is *supposedly* 28 characters long, but there does not seem
    -- to be any official documentation on its length. Hence, it is reserved to
    -- be 64 characters long should its length change in the future. If the
    -- openId retrieved is not sufficiently long, space characters U+0020
    -- shall be used to pad the openId (i.e. space padding concatenated with
    -- openId).
    WechatOpenId CHAR(64) NOT NULL DEFAULT (REPEAT(' ', 64)),
    WechatSessionKey CHAR(64) NOT NULL DEFAULT (REPEAT(' ', 64)),
    UclapiToken CHAR(64) NOT NULL DEFAULT (REPEAT(' ', 64))
);
