import { createContext, useContext } from 'react';
import { createContextualCan } from '@casl/react';
import { createMongoAbility } from '@casl/ability';

export const AbilityContext = createContext();
export const Can = createContextualCan(AbilityContext.Consumer);

export const useAbility = () => useContext(AbilityContext);

// Helper to create ability from permissions
export const createAbility = (permissions) => {
  const rules = permissions.map(permission => ({
    action: permission,
    subject: 'all'
  }));
  
  return createMongoAbility(rules);
};