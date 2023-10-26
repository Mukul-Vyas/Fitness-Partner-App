import React from 'react';
import Navigator from './navigation/navigator';
import UserContext from './userContext';
export default function App()
{
  return (
    <UserContext>
      <Navigator />
    </UserContext>
  );
}
