import { createContext, useState } from "react";

const UserType = createContext();

export default function UserContext({ children })
{
    const [userId, setUserId] = useState("");

    return (
        // eslint-disable-next-line react/react-in-jsx-scope
        <UserType.Provider value={{ userId, setUserId }} >
            {children}
        </UserType.Provider>
    );
}

export { UserType };

