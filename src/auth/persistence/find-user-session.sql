-- Checks whether the user-supplied UclcssaSessionKey corresponds to a valid
-- user session.
SELECT UclcssaSessionKey, CreationDatetime, WechatOpenId
    FROM UserSessions
    WHERE
        UclcssaSessionKey = ?
