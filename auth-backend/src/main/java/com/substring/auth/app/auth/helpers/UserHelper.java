package com.substring.auth.app.auth.helpers; import java.util.UUID;
public final class UserHelper{private UserHelper(){}public static UUID parseUUID(String id){try{return UUID.fromString(id);}catch(Exception e){throw new IllegalArgumentException("Invalid user id");}}}
