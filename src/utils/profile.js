export const getDefaultLinks = () => {
  return { social: {}, custom: { list: {}, positions: {} } };
};

export const getDefaultTheme = () => {
  return { baseTheme: "Mint", customizations: {} };
};

export const getDefaultProfile = () => {
  let profileProperties = [
    "avatar",
    "username",
    "displayName",
    "description",
    "signInProvider",
    "createdOn",
  ];

  let profileObject = { theme: getDefaultTheme(), links: getDefaultLinks() };

  profileProperties.forEach((key) => {
    profileObject[key] = null;
  });

  return profileObject;
};
