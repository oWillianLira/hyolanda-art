const { addFilter } = wp.hooks;

const hoverAttributes = {
  hoverAnimation: {
    type: 'string',
    default: 'none',
  },
  hoverBackgroundColor: {
    type: 'string',
    default: '',
  },
  hoverTextColor: {
    type: 'string',
    default: '',
  },
  hoverBorderColor: {
    type: 'string',
    default: '',
  },
  hoverDuration: {
    type: 'number',
    default: 500,
  },
};

const extendButtonAttributes = (settings, name) => {
  if (name !== 'core/button') {
    return settings;
  }

  return {
    ...settings,
    attributes: {
      ...settings.attributes,
      ...hoverAttributes,
    },
  };
};

addFilter(
  'blocks.registerBlockType',
  'hyo/button-hover-attributes',
  extendButtonAttributes,
);
