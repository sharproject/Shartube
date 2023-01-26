export const type = {
  init: (version: string | number | null | undefined = 10) => {
    if (version) {
      return `https://discord.com/api/v${version}`;
    } else {
      const versionDefault = 10;
      return `https://discord.com/api/v${versionDefault}`;
    }
  },
};
