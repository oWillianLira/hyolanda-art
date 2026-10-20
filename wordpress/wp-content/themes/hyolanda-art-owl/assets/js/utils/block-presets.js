export function normalizePresets(presets) {
  if (Array.isArray(presets)) {
    return presets;
  }

  if (!presets || typeof presets !== 'object') {
    return [];
  }

  return Object.values(presets).flatMap((group) =>
    Array.isArray(group) ? group : [],
  );
}

export function getPaletteOptions(palette) {
  const colors = normalizePresets(palette);

  return [
    { label: 'Default', value: '' },
    ...colors.map((color) => ({
      label: color.name,
      value: color.slug,
    })),
  ];
}

export function getFontFamilyOptions(fontFamilies) {
  const fonts = normalizePresets(fontFamilies);

  return [
    { label: 'Default', value: '' },
    ...fonts.map((font) => ({
      label: font.name,
      value: font.slug,
    })),
  ];
}

export function getColorValue(slug, palette) {
  const color = palette.find((item) => item.slug === slug);
  return color ? color.color : undefined;
}

export function getColorClass(slug, type = 'color') {
  if (!slug) {
    return '';
  }

  return type === 'background'
    ? `has-${slug}-background-color`
    : `has-${slug}-color`;
}

export function getFontClass(slug) {
  return slug ? `has-${slug}-font-family` : '';
}
