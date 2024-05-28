import { createContext, useCallback, useEffect, useState } from "react";

import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";

import user from "../models/user";
import Socket from "../listeners/socket";
import loginViewModel from "../viewmodels/login/loginviewmodel";

const sessioncontext = createContext(null);

const SessionContextProvider = (props: any) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const saveUser = async () => {
      setSession(await loginViewModel().saveSession());
    };

    saveUser();
  }, []);

  return (
    <sessioncontext.Provider value={session}>
      {props.children}
    </sessioncontext.Provider>
  );
};

export { SessionContextProvider, sessioncontext };
